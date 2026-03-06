import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { SiteRenderer } from '../core/sitebuilder/renderer';
import { Loader2 } from 'lucide-react';
import { Home } from './Home';

/**
 * SmartHome component that checks for a published site builder homepage
 * and falls back to the static Home component if none exists.
 * This ensures site builder changes propagate to the landing page.
 */
export const SmartHome: React.FC = () => {
  const [pageData, setPageData] = useState<any>(null);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useStaticHome, setUseStaticHome] = useState(false);

  useEffect(() => {
    const fetchHomePage = async () => {
      try {
        setIsLoading(true);

        // 1. Get Site Config
        const { data: config } = await supabase
          .from('site_config')
          .select('*')
          .single();
        
        if (config) {
          setSiteConfig(config);
        }

        // 2. Try to get published homepage from site builder
        const { data: homePage, error } = await supabase
          .from('site_pages')
          .select('*')
          .eq('is_home_page', true)
          .eq('status', 'PUBLISHED')
          .maybeSingle();

        if (error || !homePage || !homePage.published_blocks || homePage.published_blocks.length === 0) {
          // No published homepage from site builder, use static Home
          console.log('SmartHome: No published site builder homepage found, using static Home');
          setUseStaticHome(true);
          return;
        }

        // Use the site builder homepage
        console.log('SmartHome: Using published site builder homepage');
        setPageData(homePage);
      } catch (err) {
        console.error('SmartHome: Error fetching homepage:', err);
        setUseStaticHome(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomePage();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  // If no site builder homepage, render the static Home component
  if (useStaticHome || !pageData) {
    return <Home />;
  }

  // Render the site builder homepage
  return (
    <SiteRenderer
      blocks={pageData.published_blocks || []}
      globalStyles={siteConfig?.global_styles}
    />
  );
};

export default SmartHome;
