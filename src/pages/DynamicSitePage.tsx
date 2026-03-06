import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SiteRenderer } from '../core/sitebuilder/renderer';
import { Loader2 } from 'lucide-react';

export const DynamicSitePage: React.FC<{ fallback?: React.ReactNode; pageType?: string }> = ({ fallback, pageType }) => {
    const { slug } = useParams<{ slug?: string }>();
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

                let query = supabase.from('site_pages').select('*').eq('status', 'PUBLISHED');
                
                if (pageType) {
                    query = query.eq('page_type', pageType);
                } else if (slug) {
                    query = query.eq('slug', slug);
                } else {
                    setIsLoading(false);
                    return;
                }

                const { data: page, error } = await query.maybeSingle();

                if (error) {
                    console.error('Error fetching dynamic page:', error);
                } else if (page) {
                    setPageData(page);
                }
            } catch (err) {
                console.error('Error loading dynamic page:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (slug || pageType) {
            fetchPage();
        }
    }, [slug, pageType]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!pageData || !pageData.published_blocks || pageData.published_blocks.length === 0) {
        if (fallback) {
            return <>{fallback}</>;
        }
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 p-6 text-center">
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
