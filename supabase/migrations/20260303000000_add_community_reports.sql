-- Community Reports Table
CREATE TABLE public.community_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
    details TEXT,
    reviewed_by UUID REFERENCES public.users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Community Reports
CREATE INDEX idx_community_reports_post ON public.community_reports(post_id);
CREATE INDEX idx_community_reports_comment ON public.community_reports(comment_id);
CREATE INDEX idx_community_reports_reporter ON public.community_reports(reporter_id);
CREATE INDEX idx_community_reports_status ON public.community_reports(status);

-- RLS for Community Reports
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;

-- Policies for Community Reports
CREATE POLICY "Users can create reports" ON public.community_reports
    FOR INSERT WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Admins can view all reports" ON public.community_reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin', 'moderator')
        )
    );

CREATE POLICY "Users can view own reports" ON public.community_reports
    FOR SELECT USING (reporter_id = auth.uid());

CREATE POLICY "Admins can update reports" ON public.community_reports
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin', 'moderator')
        )
    );
