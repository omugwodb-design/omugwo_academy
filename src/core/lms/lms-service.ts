import { supabase } from "../../lib/supabase";

//  Course CRUD 

export const getCourses = async (filters?: { published?: boolean; instructorId?: string; featured?: boolean }) => {
  let query = supabase.from("courses").select("*, modules(*, lessons(*))").order("created_at", { ascending: false });
  if (filters?.published) query = query.eq("is_published", true);
  if (filters?.instructorId) query = query.eq("instructor_id", filters.instructorId);
  if (filters?.featured) query = query.eq("is_featured", true);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getCourse = async (courseId: string) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*, modules(*, lessons(*)), enrollments(count)")
    .eq("id", courseId)
    .single();
  if (error) throw error;
  return data;
};

export const createCourse = async (course: {
  title: string;
  description?: string;
  price?: number;
  thumbnail_url?: string;
  category?: string;
  difficulty_level?: string;
  instructor_id?: string;
}) => {
  const slug = course.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const { data, error } = await supabase
    .from("courses")
    .insert({ ...course, slug, is_published: false })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateCourse = async (courseId: string, updates: Record<string, any>) => {
  const { data, error } = await supabase
    .from("courses")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", courseId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const publishCourse = async (courseId: string) => {
  return updateCourse(courseId, { is_published: true });
};

export const deleteCourse = async (courseId: string) => {
  const { error } = await supabase.from("courses").delete().eq("id", courseId);
  if (error) throw error;
};

//  Module CRUD 

export const getModules = async (courseId: string) => {
  const { data, error } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });
  if (error) throw error;
  return data || [];
};

export const createModule = async (courseId: string, title: string, orderIndex: number) => {
  const { data, error } = await supabase
    .from("modules")
    .insert({ course_id: courseId, title, order_index: orderIndex })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateModule = async (moduleId: string, updates: Record<string, any>) => {
  const { data, error } = await supabase
    .from("modules")
    .update(updates)
    .eq("id", moduleId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteModule = async (moduleId: string) => {
  const { error } = await supabase.from("modules").delete().eq("id", moduleId);
  if (error) throw error;
};

export const reorderModules = async (modules: { id: string; order_index: number }[]) => {
  const promises = modules.map((m) =>
    supabase.from("modules").update({ order_index: m.order_index }).eq("id", m.id)
  );
  await Promise.all(promises);
};

//  Lesson CRUD 

export const getLessons = async (moduleId: string) => {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", moduleId)
    .order("order_index", { ascending: true });
  if (error) throw error;
  return data || [];
};

export const createLesson = async (moduleId: string, lesson: {
  title: string;
  type: string;
  order_index: number;
  content?: any;
  video_url?: string;
  duration_minutes?: number;
}) => {
  const { data, error } = await supabase
    .from("lessons")
    .insert({ module_id: moduleId, ...lesson })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateLesson = async (lessonId: string, updates: Record<string, any>) => {
  const { data, error } = await supabase
    .from("lessons")
    .update(updates)
    .eq("id", lessonId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteLesson = async (lessonId: string) => {
  const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
  if (error) throw error;
};

export const reorderLessons = async (lessons: { id: string; order_index: number }[]) => {
  const promises = lessons.map((l) =>
    supabase.from("lessons").update({ order_index: l.order_index }).eq("id", l.id)
  );
  await Promise.all(promises);
};

//  Quiz CRUD 

export const getQuiz = async (lessonId: string) => {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*, questions:quiz_questions(*)")
    .eq("lesson_id", lessonId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const createQuiz = async (lessonId: string, quiz: {
  title: string;
  passing_score?: number;
  time_limit_minutes?: number;
  max_attempts?: number;
  shuffle_questions?: boolean;
}) => {
  const { data, error } = await supabase
    .from("quizzes")
    .insert({ lesson_id: lessonId, ...quiz })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const addQuizQuestion = async (quizId: string, question: {
  question: string;
  question_type?: string;
  options?: any;
  correct_answer?: number | null;
  explanation?: string | null;
  order_index: number;
}) => {
  const { data, error } = await supabase
    .from("quiz_questions")
    .insert({ quiz_id: quizId, ...question })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateQuizQuestion = async (questionId: string, updates: Record<string, any>) => {
  const allowed: Record<string, any> = {
    question: updates.question,
    question_type: updates.question_type,
    options: updates.options,
    correct_answer: updates.correct_answer,
    order_index: updates.order_index,
    explanation: updates.explanation,
    scenario_context: updates.scenario_context,
  };

  const cleanUpdates = Object.fromEntries(
    Object.entries(allowed).filter(([, v]) => v !== undefined)
  );

  const { data, error } = await supabase
    .from("quiz_questions")
    .update(cleanUpdates)
    .eq("id", questionId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteQuizQuestion = async (questionId: string) => {
  const { error } = await supabase.from("quiz_questions").delete().eq("id", questionId);
  if (error) throw error;
};

//  Quiz Attempt / Grading 

export const submitQuizAttempt = async (quizId: string, userId: string, answers: Record<string, string>) => {
  // 1. Fetch quiz with questions
  const { data: quiz, error: qErr } = await supabase
    .from("quizzes")
    .select("*, questions:quiz_questions(*)")
    .eq("id", quizId)
    .single();
  if (qErr || !quiz) throw qErr || new Error("Quiz not found");

  // 2. Grade (only graded questions, not survey/poll/rating)
  let totalPoints = 0;
  let earnedPoints = 0;
  const results: any[] = [];
  const feedbackQuestions: any[] = [];

  for (const q of (quiz as any).questions || []) {
    const questionType = q.question_type || 'multiple_choice';
    const isFeedback = ['survey', 'poll', 'rating'].includes(questionType);
    const userAnswer = answers[q.id] || "";

    if (isFeedback) {
      // Store feedback questions separately for saving to survey/poll tables
      feedbackQuestions.push({ ...q, userAnswer, questionType });
    } else {
      // Grade regular questions
      const pts = q.points || 1;
      totalPoints += pts;
      const correctIdx = typeof q.correct_answer === 'number' ? q.correct_answer : null;
      const correctValue = correctIdx !== null && Array.isArray(q.options) ? q.options[correctIdx]?.value : String(q.correct_answer || '');
      const isCorrect = userAnswer.toLowerCase().trim() === String(correctValue).toLowerCase().trim();
      if (isCorrect) earnedPoints += pts;
      results.push({ question_id: q.id, user_answer: userAnswer, is_correct: isCorrect, points_earned: isCorrect ? pts : 0 });
    }
  }

  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const passed = score >= (quiz.passing_score || 70);

  // Save attempt (schema uses quiz_responses)
  const { data: attempt, error: aErr } = await supabase
    .from("quiz_responses")
    .insert({
      quiz_id: quizId,
      user_id: userId,
      score,
      passed,
      answers: results,
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (aErr) throw aErr;

  // 4. Save feedback question responses (survey/poll/rating)
  for (const fq of feedbackQuestions) {
    if (!fq.userAnswer) continue;

    try {
      if (fq.questionType === 'survey') {
        // Save to survey_responses table
        await supabase.from("survey_responses").upsert({
          quiz_id: quizId,
          question_id: fq.id,
          user_id: userId,
          response_text: fq.userAnswer,
          response_data: { option_selected: fq.userAnswer },
          submitted_at: new Date().toISOString(),
        }, { onConflict: 'quiz_id,question_id,user_id' });
      } else if (fq.questionType === 'poll') {
        // Save to poll_votes table
        const optionIndex = (fq.options || []).findIndex((o: any) => 
          (typeof o === 'object' ? (o.value || o.label) : o) === fq.userAnswer
        );
        await supabase.from("poll_votes").upsert({
          quiz_id: quizId,
          question_id: fq.id,
          user_id: userId,
          option_index: optionIndex >= 0 ? optionIndex : 0,
          voted_at: new Date().toISOString(),
        }, { onConflict: 'quiz_id,question_id,user_id' });
      } else if (fq.questionType === 'rating') {
        // Save rating to survey_responses (could also be course_ratings for course feedback)
        await supabase.from("survey_responses").upsert({
          quiz_id: quizId,
          question_id: fq.id,
          user_id: userId,
          response_text: fq.userAnswer,
          response_data: { rating: parseInt(fq.userAnswer) || 0, scale: parseInt(fq.options?.[0]?.label) || 5 },
          submitted_at: new Date().toISOString(),
        }, { onConflict: 'quiz_id,question_id,user_id' });
      }
    } catch (feedbackErr) {
      console.error('Error saving feedback response:', feedbackErr);
    }
  }

  return { attempt, score, passed, results, totalPoints, earnedPoints };
};

//  Progress Tracking 

export const getLessonProgress = async (userId: string, courseId: string) => {
  const { data: modules, error: mErr } = await supabase
    .from("modules")
    .select("id, lessons(id)")
    .eq("course_id", courseId);
  if (mErr) throw mErr;

  const lessonIds = (modules || []).flatMap((m: any) => (m.lessons || []).map((l: any) => l.id));
  if (lessonIds.length === 0) return [];

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds);
  if (error) throw error;
  return data || [];
};

export const markLessonComplete = async (userId: string, courseId: string, lessonId: string) => {
  // Upsert lesson progress
  const { error } = await supabase
    .from("lesson_progress")
    .upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        is_completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" }
    );
  if (error) throw error;

  // Recalculate course progress
  await recalculateCourseProgress(userId, courseId);
};

export const recalculateCourseProgress = async (userId: string, courseId: string) => {
  // Get total lessons in course
  const { data: modules, error: mErr } = await supabase
    .from("modules")
    .select("id, lessons(id)")
    .eq("course_id", courseId);
  if (mErr) throw mErr;

  const totalLessons = (modules || []).reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0);
  if (totalLessons === 0) return 0;

  const lessonIds = (modules || []).flatMap((m: any) => (m.lessons || []).map((l: any) => l.id));
  if (lessonIds.length === 0) return 0;

  // Get completed lessons
  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("id")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds)
    .eq("is_completed", true);

  const completedLessons = progress?.length || 0;
  const percentage = Math.round((completedLessons / totalLessons) * 100);

  // Update enrollment progress
  await supabase
    .from("enrollments")
    .update({ progress: percentage, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("course_id", courseId);

  // Check if course is complete
  if (percentage >= 100) {
    await supabase
      .from("enrollments")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("course_id", courseId);

    // Trigger certificate generation
    await generateCertificate(userId, courseId);
  }

  return percentage;
};

//  Enrollment 

export const enrollUser = async (userId: string, courseId: string) => {
  const { data, error } = await supabase
    .from("enrollments")
    .insert({
      user_id: userId,
      course_id: courseId,
      status: "active",
      progress: 0,
      enrolled_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getEnrollment = async (userId: string, courseId: string) => {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const getUserEnrollments = async (userId: string) => {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*, course:courses(*)")
    .eq("user_id", userId)
    .order("enrolled_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

//  Certificate Generation 

export const generateCertificate = async (userId: string, courseId: string) => {
  // Check if certificate already exists
  const { data: existing } = await supabase
    .from("certificates")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (existing) return existing;

  // Get course and user info
  const { data: course } = await supabase.from("courses").select("title, instructor_id").eq("id", courseId).single();
  const { data: userProfile } = await supabase.from("users").select("full_name").eq("id", userId).single();

  const certNumber = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  const verificationUrl = `/certificates/verify/${certNumber}`;

  const { data, error } = await supabase
    .from("certificates")
    .insert({
      user_id: userId,
      course_id: courseId,
      certificate_number: certNumber,
      issued_at: new Date().toISOString(),
      verification_url: verificationUrl,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getCertificate = async (userId: string, courseId: string) => {
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const verifyCertificate = async (certNumber: string) => {
  const { data, error } = await supabase
    .from("certificates")
    .select("*, course:courses(title)")
    .eq("certificate_number", certNumber)
    .maybeSingle();
  if (error) throw error;
  return data;
};

//  Streak Tracking 

export const updateStreak = async (userId: string) => {
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!existing) {
    await supabase.from("user_streaks").insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_activity_date: today,
    });
    return { current_streak: 1, longest_streak: 1 };
  }

  const lastDate = existing.last_activity_date;
  if (lastDate === today) return existing;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const isConsecutive = lastDate === yesterday;

  const newStreak = isConsecutive ? existing.current_streak + 1 : 1;
  const longestStreak = Math.max(newStreak, existing.longest_streak);

  await supabase
    .from("user_streaks")
    .update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_activity_date: today,
    })
    .eq("user_id", userId);

  return { current_streak: newStreak, longest_streak: longestStreak };
};

//  Assignment CRUD 

export const createAssignment = async (lessonId: string, assignment: {
  title: string;
  instructions: string;
  due_date?: string;
  max_score?: number;
  rubric?: any[];
}) => {
  const { data, error } = await supabase
    .from("assignments")
    .insert({ lesson_id: lessonId, ...assignment })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const submitAssignment = async (assignmentId: string, userId: string, submission: {
  content: string;
  file_urls?: string[];
}) => {
  const { data, error } = await supabase
    .from("assignment_submissions")
    .insert({
      assignment_id: assignmentId,
      user_id: userId,
      ...submission,
      submitted_at: new Date().toISOString(),
      status: "submitted",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const gradeAssignment = async (submissionId: string, grade: {
  score: number;
  feedback: string;
  graded_by: string;
}) => {
  const { data, error } = await supabase
    .from("assignment_submissions")
    .update({
      ...grade,
      status: "graded",
      graded_at: new Date().toISOString(),
    })
    .eq("id", submissionId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

//  Instructor Dashboard 

export const getInstructorStats = async (instructorId: string) => {
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, enrollments(count)")
    .eq("instructor_id", instructorId);

  const courseIds = (courses || []).map((c: any) => c.id);

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("status, progress")
    .in("course_id", courseIds.length > 0 ? courseIds : ["__none__"]);

  const totalStudents = enrollments?.length || 0;
  const completedStudents = enrollments?.filter((e: any) => e.status === "completed").length || 0;
  const avgProgress = totalStudents > 0
    ? Math.round((enrollments || []).reduce((sum: number, e: any) => sum + (e.progress || 0), 0) / totalStudents)
    : 0;

  return {
    totalCourses: courses?.length || 0,
    totalStudents,
    completedStudents,
    avgProgress,
    completionRate: totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0,
  };
};
