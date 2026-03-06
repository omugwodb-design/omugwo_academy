//  Role-Based Access Control System 

export type SystemRole =
  | 'super_admin'
  | 'admin'
  | 'instructor'
  | 'moderator'
  | 'student'
  | 'community_manager'
  | 'marketing_admin';

export type Permission =
  // Course Management
  | 'courses.create'
  | 'courses.edit'
  | 'courses.delete'
  | 'courses.publish'
  | 'courses.view_analytics'
  // User Management
  | 'users.view'
  | 'users.edit'
  | 'users.delete'
  | 'users.manage_roles'
  | 'users.impersonate'
  // Community
  | 'community.create_space'
  | 'community.moderate'
  | 'community.ban_user'
  | 'community.pin_post'
  | 'community.delete_content'
  | 'community.manage_events'
  // Webinars
  | 'webinars.create'
  | 'webinars.edit'
  | 'webinars.delete'
  | 'webinars.host'
  | 'webinars.view_analytics'
  // Payments
  | 'payments.view'
  | 'payments.refund'
  | 'payments.manage_coupons'
  // Site Builder
  | 'site_builder.edit'
  | 'site_builder.publish'
  | 'site_builder.manage_templates'
  | 'site_builder.manage_pages'
  | 'site_builder.edit_theme'
  | 'site_builder.custom_css'
  // LMS
  | 'lms.grade_assignments'
  | 'lms.manage_cohorts'
  | 'lms.view_student_progress'
  | 'lms.issue_certificates'
  | 'lms.manage_drip'
  // Content
  | 'content.create_blog'
  | 'content.edit_blog'
  | 'content.publish_blog'
  | 'content.manage_podcast'
  // Settings
  | 'settings.general'
  | 'settings.billing'
  | 'settings.integrations'
  | 'settings.email_templates'
  // Analytics
  | 'analytics.dashboard'
  | 'analytics.revenue'
  | 'analytics.users'
  | 'analytics.courses'
  | 'analytics.community'
  | 'analytics.export';

//  Role â†’ Permission Mapping 
export const ROLE_PERMISSIONS: Record<SystemRole, Permission[]> = {
  super_admin: [
    'courses.create', 'courses.edit', 'courses.delete', 'courses.publish', 'courses.view_analytics',
    'users.view', 'users.edit', 'users.delete', 'users.manage_roles', 'users.impersonate',
    'community.create_space', 'community.moderate', 'community.ban_user', 'community.pin_post', 'community.delete_content', 'community.manage_events',
    'webinars.create', 'webinars.edit', 'webinars.delete', 'webinars.host', 'webinars.view_analytics',
    'payments.view', 'payments.refund', 'payments.manage_coupons',
    'site_builder.edit', 'site_builder.publish', 'site_builder.manage_templates', 'site_builder.manage_pages', 'site_builder.edit_theme', 'site_builder.custom_css',
    'lms.grade_assignments', 'lms.manage_cohorts', 'lms.view_student_progress', 'lms.issue_certificates', 'lms.manage_drip',
    'content.create_blog', 'content.edit_blog', 'content.publish_blog', 'content.manage_podcast',
    'settings.general', 'settings.billing', 'settings.integrations', 'settings.email_templates',
    'analytics.dashboard', 'analytics.revenue', 'analytics.users', 'analytics.courses', 'analytics.community', 'analytics.export',
  ],
  admin: [
    'courses.create', 'courses.edit', 'courses.publish', 'courses.view_analytics',
    'users.view', 'users.edit', 'users.manage_roles',
    'community.create_space', 'community.moderate', 'community.ban_user', 'community.pin_post', 'community.delete_content', 'community.manage_events',
    'webinars.create', 'webinars.edit', 'webinars.host', 'webinars.view_analytics',
    'payments.view', 'payments.refund', 'payments.manage_coupons',
    'site_builder.edit', 'site_builder.publish', 'site_builder.manage_templates', 'site_builder.manage_pages', 'site_builder.edit_theme',
    'lms.grade_assignments', 'lms.manage_cohorts', 'lms.view_student_progress', 'lms.issue_certificates', 'lms.manage_drip',
    'content.create_blog', 'content.edit_blog', 'content.publish_blog', 'content.manage_podcast',
    'settings.general', 'settings.integrations', 'settings.email_templates',
    'analytics.dashboard', 'analytics.revenue', 'analytics.users', 'analytics.courses', 'analytics.community', 'analytics.export',
  ],
  instructor: [
    'courses.create', 'courses.edit', 'courses.view_analytics',
    'webinars.create', 'webinars.edit', 'webinars.host',
    'lms.grade_assignments', 'lms.view_student_progress', 'lms.issue_certificates',
    'content.create_blog', 'content.edit_blog',
    'analytics.courses',
    'site_builder.edit',
  ],
  moderator: [
    'community.moderate', 'community.pin_post', 'community.delete_content',
    'community.manage_events',
    'users.view',
  ],
  student: [],
  community_manager: [
    'community.create_space', 'community.moderate', 'community.ban_user', 'community.pin_post',
    'community.delete_content', 'community.manage_events',
    'users.view',
    'analytics.community',
  ],
  marketing_admin: [
    'site_builder.edit', 'site_builder.publish', 'site_builder.manage_templates', 'site_builder.manage_pages',
    'content.create_blog', 'content.edit_blog', 'content.publish_blog', 'content.manage_podcast',
    'webinars.create', 'webinars.edit',
    'payments.manage_coupons',
    'analytics.dashboard', 'analytics.revenue',
  ],
};

//  Permission Helpers 
export function hasPermission(role: SystemRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: SystemRole, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(role, p));
}

export function hasAllPermissions(role: SystemRole, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(role, p));
}

export function getPermissionsForRole(role: SystemRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

//  Role Metadata 
export const ROLE_METADATA: Record<SystemRole, { label: string; description: string; color: string; }> = {
  super_admin: { label: 'Super Admin', description: 'Full system access with all permissions', color: '#dc2626' },
  admin: { label: 'Admin', description: 'Platform administration without destructive actions', color: '#f59e0b' },
  instructor: { label: 'Instructor', description: 'Course creation, teaching, and student management', color: '#3b82f6' },
  moderator: { label: 'Moderator', description: 'Community moderation and content management', color: '#8b5cf6' },
  student: { label: 'Student', description: 'Course access, community participation', color: '#10b981' },
  community_manager: { label: 'Community Manager', description: 'Full community management and analytics', color: '#ec4899' },
  marketing_admin: { label: 'Marketing Admin', description: 'Site builder, content, and campaign management', color: '#f97316' },
};

//  Permission Groups (for UI display) 
export const PERMISSION_GROUPS = [
  { id: 'courses', label: 'Courses', permissions: ['courses.create', 'courses.edit', 'courses.delete', 'courses.publish', 'courses.view_analytics'] },
  { id: 'users', label: 'Users', permissions: ['users.view', 'users.edit', 'users.delete', 'users.manage_roles', 'users.impersonate'] },
  { id: 'community', label: 'Community', permissions: ['community.create_space', 'community.moderate', 'community.ban_user', 'community.pin_post', 'community.delete_content', 'community.manage_events'] },
  { id: 'webinars', label: 'Webinars', permissions: ['webinars.create', 'webinars.edit', 'webinars.delete', 'webinars.host', 'webinars.view_analytics'] },
  { id: 'payments', label: 'Payments', permissions: ['payments.view', 'payments.refund', 'payments.manage_coupons'] },
  { id: 'site_builder', label: 'Site Builder', permissions: ['site_builder.edit', 'site_builder.publish', 'site_builder.manage_templates', 'site_builder.manage_pages', 'site_builder.edit_theme', 'site_builder.custom_css'] },
  { id: 'lms', label: 'LMS', permissions: ['lms.grade_assignments', 'lms.manage_cohorts', 'lms.view_student_progress', 'lms.issue_certificates', 'lms.manage_drip'] },
  { id: 'content', label: 'Content', permissions: ['content.create_blog', 'content.edit_blog', 'content.publish_blog', 'content.manage_podcast'] },
  { id: 'settings', label: 'Settings', permissions: ['settings.general', 'settings.billing', 'settings.integrations', 'settings.email_templates'] },
  { id: 'analytics', label: 'Analytics', permissions: ['analytics.dashboard', 'analytics.revenue', 'analytics.users', 'analytics.courses', 'analytics.community', 'analytics.export'] },
] as const;
