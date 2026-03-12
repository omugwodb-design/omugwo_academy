import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';

export type BrandingConfig = {
  brandName: string;
  logoUrl: string;
  logoAlt: string;
};

type BrandingContextValue = {
  branding: BrandingConfig;
  isLoading: boolean;
  refreshBranding: () => Promise<void>;
  setBranding: (branding: BrandingConfig) => void;
};

const DEFAULT_BRANDING: BrandingConfig = {
  brandName: 'Omugwo Academy',
  logoUrl: '',
  logoAlt: 'Omugwo Academy logo',
};

const BRANDING_EVENT = 'omugwo-branding-updated';

const BrandingContext = createContext<BrandingContextValue | undefined>(undefined);

const normalizeBranding = (siteConfig: any): BrandingConfig => {
  const globalStyles = siteConfig?.global_styles && typeof siteConfig.global_styles === 'object' && !Array.isArray(siteConfig.global_styles)
    ? siteConfig.global_styles as Record<string, any>
    : {};

  const branding = globalStyles.branding && typeof globalStyles.branding === 'object' && !Array.isArray(globalStyles.branding)
    ? globalStyles.branding as Partial<BrandingConfig>
    : {};

  const brandName = String(siteConfig?.name || branding.brandName || DEFAULT_BRANDING.brandName).trim() || DEFAULT_BRANDING.brandName;
  const logoUrl = String(branding.logoUrl || '').trim();
  const logoAlt = String(branding.logoAlt || `${brandName} logo`).trim() || `${brandName} logo`;

  return {
    brandName,
    logoUrl,
    logoAlt,
  };
};

export const emitBrandingUpdated = (branding: BrandingConfig) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(BRANDING_EVENT, { detail: branding }));
};

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBrandingState] = useState<BrandingConfig>(DEFAULT_BRANDING);
  const [isLoading, setIsLoading] = useState(true);

  const refreshBranding = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('site_config')
        .select('name, global_styles')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setBrandingState(normalizeBranding(data));
    } catch (error) {
      console.error('Failed to load branding:', error);
      setBrandingState(DEFAULT_BRANDING);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBranding();
  }, [refreshBranding]);

  useEffect(() => {
    const handleBrandingUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<BrandingConfig>;
      if (customEvent.detail) {
        setBrandingState(customEvent.detail);
      }
    };

    window.addEventListener(BRANDING_EVENT, handleBrandingUpdate as EventListener);
    return () => window.removeEventListener(BRANDING_EVENT, handleBrandingUpdate as EventListener);
  }, []);

  const setBranding = useCallback((nextBranding: BrandingConfig) => {
    setBrandingState(nextBranding);
    emitBrandingUpdated(nextBranding);
  }, []);

  const value = useMemo(() => ({
    branding,
    isLoading,
    refreshBranding,
    setBranding,
  }), [branding, isLoading, refreshBranding, setBranding]);

  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};

export const getDefaultBranding = () => DEFAULT_BRANDING;
