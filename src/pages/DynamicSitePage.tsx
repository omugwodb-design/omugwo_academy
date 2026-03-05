import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SiteRenderer } from '../core/sitebuilder/renderer';
import { Loader2 } from 'lucide-react';

export const DynamicSitePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [pageData, setPageData] = useState<any>(null);
    const [siteConfig, setSiteConfig] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                setIsLoading(true);

                // Special-case preview mode (no publish needed)
                if (slug === '__preview__') {
                    const raw = localStorage.getItem('omugwo_sitebuilder_preview');
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        setSiteConfig({ global_styles: parsed.globalStyles });
                        setPageData({ published_blocks: parsed.blocks });
                    }
                    return;
                }

                // 1. Get Site Config
                const { data: config } = await supabase.from('site_config').select('*').single();
                if (config) setSiteConfig(config);

                // 2. Get Page by Slug
                const { data: page, error } = await supabase
                    .from('site_pages')
                    .select('*')
                    .eq('slug', slug)
                    .eq('status', 'PUBLISHED')
                    .single();

                if (error || !page) {
                    console.error('Page not found or error:', error);
                    // If homepage requested but not found, maybe just redirect to root or show 404
                    return;
                }

                setPageData(page);
            } catch (err) {
                console.error('Error fetching dynamic page:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) fetchPage();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!pageData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
                <h1 className="text-4xl font-black text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or isn't published.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg"
                >
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <SiteRenderer
            blocks={pageData.published_blocks || []}
            globalStyles={siteConfig?.global_styles}
        />
    );
};
