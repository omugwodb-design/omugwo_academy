import { appendLog, getPublicSystemeSettings, getSupabaseAdmin, json, readBody, systemeContacts, updateSystemeConfig } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const supabase = getSupabaseAdmin();

  try {
    const body = await readBody(req);
    const enrollmentId = String(body.enrollmentId || '').trim();
    const userId = String(body.userId || '').trim();
    const courseId = String(body.courseId || '').trim();

    if (!userId || !courseId) {
      return json(res, 400, { error: 'Missing userId or courseId.' });
    }

    const settings = await getPublicSystemeSettings(supabase);
    if (!settings.triggerEnrollments) {
      return json(res, 200, { ok: true, skipped: true, reason: 'Enrollment trigger disabled.' });
    }

    const [{ data: user, error: userError }, { data: course, error: courseError }] = await Promise.all([
      supabase.from('users').select('id, email, name, full_name').eq('id', userId).single(),
      supabase.from('courses').select('id, title, systeme_io_course_id').eq('id', courseId).single(),
    ]);

    if (userError) throw userError;
    if (courseError) throw courseError;

    const email = String(user.email || '').trim().toLowerCase();
    if (!email) {
      throw new Error('Cannot push enrollment without a user email.');
    }

    const fullName = String(user.full_name || user.name || '').trim();

    // Create or update contact in Systeme.io
    let contact = await systemeContacts.findByEmail(email);
    
    if (!contact) {
      // Create new contact
      contact = await systemeContacts.create({
        email,
        firstName: fullName || undefined,
      });
    } else if (fullName && !contact.firstName) {
      // Update existing contact with name if missing
      await systemeContacts.update(contact.id, { firstName: fullName });
    }

    // Add automation tag if configured
    if (settings.automationTagId && contact) {
      try {
        await systemeContacts.addTag(contact.id, settings.automationTagId);
      } catch (tagError) {
        // Tag assignment may fail if already assigned - log but don't fail
        console.warn('Tag assignment warning:', tagError.message);
      }
    }

    // Add default tag if configured
    if (settings.defaultTagId && contact) {
      try {
        await systemeContacts.addTag(contact.id, settings.defaultTagId);
      } catch (tagError) {
        console.warn('Default tag assignment warning:', tagError.message);
      }
    }

    // Note: Course enrollment in Systeme.io happens through automations triggered by tags
    // The API doesn't have direct course enrollment endpoints
    // Users should set up automations in Systeme.io that enroll contacts in courses when tags are added

    await updateSystemeConfig(supabase, (systemeIo) => ({
      ...systemeIo,
      lastEnrollmentPushAt: new Date().toISOString(),
    }));

    await appendLog(supabase, {
      type: 'enrollment_push',
      status: 'success',
      message: `Contact synced to Systeme.io for ${email} (course: ${course.title}). Tags assigned will trigger automations.`,
      meta: { 
        enrollmentId, 
        userId, 
        courseId, 
        systemeCourseId: course.systeme_io_course_id || null,
        contactId: contact?.id || null,
        note: 'Course enrollment happens via Systeme.io automations triggered by tags'
      },
    });

    return json(res, 200, { 
      ok: true, 
      contactId: contact?.id,
      note: 'Contact synced. Enrollment automations should be configured in Systeme.io to trigger when tags are assigned.'
    });
  } catch (error) {
    await appendLog(supabase, {
      type: 'enrollment_push',
      status: 'error',
      message: error instanceof Error ? error.message : 'Enrollment push failed.',
    });

    return json(res, 500, {
      error: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
}
