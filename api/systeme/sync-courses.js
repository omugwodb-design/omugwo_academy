import { appendLog, getPublicSystemeSettings, getSupabaseAdmin, json, normalizeCollection, slugify, systemeRequest, updateSystemeConfig } from './_lib.js';

const extractId = (course) => String(
  course.id ||
  course['@id'] ||
  course.courseId ||
  course.uuid ||
  ''
).trim();

const extractTitle = (course) => String(
  course.name ||
  course.title ||
  course.label ||
  'Untitled Systeme Course'
).trim();

const extractDescription = (course) => String(
  course.description ||
  course.summary ||
  course.content ||
  'Imported from Systeme.io.'
).trim();

const extractThumbnail = (course) => String(
  course.image ||
  course.thumbnail ||
  course.thumbnailUrl ||
  ''
).trim() || null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const supabase = getSupabaseAdmin();

  try {
    const settings = await getPublicSystemeSettings(supabase);
    const payload = await systemeRequest({ path: settings.courseEndpointPath || '/api/school/courses' });
    const courses = normalizeCollection(payload);

    let synced = 0;
    let skipped = 0;

    for (const sourceCourse of courses) {
      const externalId = extractId(sourceCourse);
      const title = extractTitle(sourceCourse);
      const description = extractDescription(sourceCourse);
      const thumbnailUrl = extractThumbnail(sourceCourse);
      const slugBase = slugify(title);
      const slug = `systeme-${slugBase}`.slice(0, 120);

      if (!externalId) {
        skipped += 1;
        continue;
      }

      const { data: existing, error: existingError } = await supabase
        .from('courses')
        .select('id')
        .eq('systeme_io_course_id', externalId)
        .maybeSingle();

      if (existingError) throw existingError;

      const payloadForCourse = {
        title,
        slug,
        description,
        short_description: description.slice(0, 180),
        thumbnail_url: thumbnailUrl,
        is_published: true,
        price: Number(sourceCourse.price || sourceCourse.amount || 0),
        currency: String(sourceCourse.currency || 'USD'),
        source_platform: 'systeme_io',
        systeme_io_course_id: externalId,
        external_sync_metadata: {
          source: 'systeme_io',
          lastSyncedAt: new Date().toISOString(),
          rawCourse: sourceCourse,
          lessonSyncAvailable: false,
        },
        updated_at: new Date().toISOString(),
      };

      if (existing?.id) {
        const { error: updateError } = await supabase
          .from('courses')
          .update(payloadForCourse)
          .eq('id', existing.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('courses')
          .insert(payloadForCourse);
        if (insertError) throw insertError;
      }

      synced += 1;
    }

    const summary = {
      synced,
      skipped,
      fetched: courses.length,
      lessonSyncAvailable: false,
    };

    await updateSystemeConfig(supabase, (systemeIo) => ({
      ...systemeIo,
      lastCourseSyncAt: new Date().toISOString(),
      lastSyncSummary: summary,
    }));

    await appendLog(supabase, {
      type: 'course_sync',
      status: 'success',
      message: `Synced ${synced} course(s) from Systeme.io.${skipped ? ` Skipped ${skipped} course(s) without stable IDs.` : ''}`,
      meta: summary,
    });

    return json(res, 200, {
      ok: true,
      summary,
    });
  } catch (error) {
    await appendLog(supabase, {
      type: 'course_sync',
      status: 'error',
      message: error instanceof Error ? error.message : 'Course sync failed.',
    });

    return json(res, 500, {
      error: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
}
