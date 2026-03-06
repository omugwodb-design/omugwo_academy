import { supabase } from '../lib/supabase';
import type { 
  Course, Module, Lesson, User, Enrollment, 
  CommunitySpace, CommunityPost, Webinar, Certificate, Badge 
} from '../types';
import type { Tables } from '../types/database';

// =============================================
// COURSES API
// =============================================

export const coursesApi = {
  async getAll(published = true) {
    const query = supabase
      .from('courses')
      .select(`
        *,
        instructor:users!instructor_id(id, name, role),
        modules(id)
      `)
      .order('created_at', { ascending: false });
    
    if (published) {
      query.eq('is_published', true);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:users!instructor_id(id, name, role),
        modules(
          id, title, description, order_index,
          lessons(id, title, duration_minutes, is_free, order_index)
        )
      `)
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(course: Partial<Course>) {
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Course>) {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getStats() {
    const { data: courses } = await supabase
      .from('courses')
      .select('id, is_published');
    
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('id, status');
    
    const { data: payments } = await supabase
      .from('payments')
      .select('amount, status')
      .eq('status', 'completed');

    const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    return {
      totalCourses: courses?.length || 0,
      publishedCourses: courses?.filter(c => c.is_published).length || 0,
      totalEnrollments: enrollments?.length || 0,
      activeEnrollments: enrollments?.filter(e => e.status === 'active').length || 0,
      totalRevenue,
    };
  }
};

// =============================================
// MODULES API
// =============================================

export const modulesApi = {
  async getByCourse(courseId: string) {
    const { data, error } = await supabase
      .from('modules')
      .select(`
        *,
        lessons(*)
      `)
      .eq('course_id', courseId)
      .order('order_index');
    
    if (error) throw error;
    return data;
  },

  async create(module: Partial<Module>) {
    const { data, error } = await supabase
      .from('modules')
      .insert(module)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Module>) {
    const { data, error } = await supabase
      .from('modules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async reorder(moduleIds: string[]) {
    const updates = moduleIds.map((id, index) => ({
      id,
      order_index: index,
    }));

    for (const update of updates) {
      await supabase
        .from('modules')
        .update({ order_index: update.order_index })
        .eq('id', update.id);
    }
  }
};

// =============================================
// LESSONS API
// =============================================

export const lessonsApi = {
  async getByModule(moduleId: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index');
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        quizzes(
          id, title, passing_score,
          quiz_questions(*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(lesson: Partial<Lesson>) {
    const { data, error } = await supabase
      .from('lessons')
      .insert(lesson)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Lesson>) {
    const { data, error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// =============================================
// ENROLLMENTS API
// =============================================

export const enrollmentsApi = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        course:courses(*)
      `)
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getByCourse(courseId: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        user:users(id, name, email, role, status)
      `)
      .eq('course_id', courseId)
      .order('enrolled_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(userId: string, courseId: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        status: 'active',
        progress: 0,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProgress(userId: string, courseId: string, progress: number) {
    const updates: any = { progress };
    if (progress >= 100) {
      updates.status = 'completed';
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('enrollments')
      .update(updates)
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async checkEnrollment(userId: string, courseId: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .select('id, status')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
};

// =============================================
// COMMUNITY API
// =============================================

export const communityApi = {
  async getSpaces() {
    const { data, error } = await supabase
      .from('community_spaces')
      .select(`
        *,
        posts:community_posts(count)
      `)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async getPosts(spaceId?: string) {
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        user:users(id, name, role, status),
        space:community_spaces(id, name, slug)
      `)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (spaceId) {
      query = query.eq('space_id', spaceId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createPost(post: { space_id: string; user_id: string; title?: string; content: string }) {
    const { data, error } = await supabase
      .from('community_posts')
      .insert({ ...post, is_anonymous: false })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async likePost(postId: string, userId: string) {
    const { data: existing } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      await supabase.from('post_likes').delete().eq('id', existing.id);
      await supabase.rpc('decrement_likes', { post_id: postId });
      return false;
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
      await supabase.rpc('increment_likes', { post_id: postId });
      return true;
    }
  },

  async getComments(postId: string) {
    const { data, error } = await supabase
      .from('community_comments')
      .select(`
        *,
        user:users(id, name, role, status)
      `)
      .eq('post_id', postId)
      .order('created_at');
    
    if (error) throw error;
    return data;
  },

  async createComment(comment: { post_id: string; user_id: string; content: string }) {
    const { data, error } = await supabase
      .from('community_comments')
      .insert({ ...comment, is_anonymous: false })
      .select()
      .single();
    
    if (error) throw error;

    // Increment comment count
    await supabase.rpc('increment_comments', { post_id: comment.post_id });

    return data;
  }
};

// =============================================
// WEBINARS API
// =============================================

export const webinarsApi = {
  async getAll(status?: string) {
    let query = supabase
      .from('webinars')
      .select(`
        *,
        host:users!host_id(id, name, role),
        registrations:webinar_registrations(count)
      `)
      .order('scheduled_at', { ascending: true });
    
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('webinars')
      .select(`
        *,
        host:users!host_id(id, name, role)
      `)
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(webinar: Partial<Webinar>) {
    const { data, error } = await supabase
      .from('webinars')
      .insert(webinar)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Webinar>) {
    const { data, error } = await supabase
      .from('webinars')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async register(webinarId: string, userId: string, email: string) {
    const { data, error } = await supabase
      .from('webinar_registrations')
      .insert({
        webinar_id: webinarId,
        user_id: userId,
        email,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getRegistrations(webinarId: string) {
    const { data, error } = await supabase
      .from('webinar_registrations')
      .select(`
        *,
        user:users(id, name, email, role, status)
      `)
      .eq('webinar_id', webinarId)
      .order('registered_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// =============================================
// CERTIFICATES API
// =============================================

export const certificatesApi = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        course:courses(id, title, thumbnail_url)
      `)
      .eq('user_id', userId)
      .order('issued_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(userId: string, courseId: string) {
    const certificateNumber = `OMG-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const verificationUrl = `${window.location.origin}/verify/${certificateNumber}`;

    const { data, error } = await supabase
      .from('certificates')
      .insert({
        user_id: userId,
        course_id: courseId,
        certificate_number: certificateNumber,
        verification_url: verificationUrl,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async verify(certificateNumber: string) {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        user:users(id, name),
        course:courses(id, title)
      `)
      .eq('certificate_number', certificateNumber)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// =============================================
// LEADS API
// =============================================

export const leadsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(lead: { email: string; full_name?: string; source?: string; lead_magnet?: string }) {
    const { data, error } = await supabase
      .from('leads')
      .insert(lead)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getStats() {
    const { data: leads } = await supabase
      .from('leads')
      .select('status, created_at, lead_magnet');

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      totalLeads: leads?.length || 0,
      newLeads: leads?.filter(l => l.status === 'new').length || 0,
      convertedLeads: leads?.filter(l => l.status === 'converted').length || 0,
      leadsThisMonth: leads?.filter(l => new Date(l.created_at) >= thisMonth).length || 0,
      conversionRate: leads?.length 
        ? ((leads.filter(l => l.status === 'converted').length / leads.length) * 100).toFixed(1)
        : '0',
    };
  }
};

// =============================================
// BADGES API
// =============================================

export const badgesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('is_active', true)
      .order('points', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getUserBadges(userId: string) {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async awardBadge(userId: string, badgeId: string) {
    const { data, error } = await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_id: badgeId,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
