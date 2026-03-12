import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { BrandingConfig, useBranding } from './BrandingProvider';

type BrandLogoProps = {
  brandingOverride?: BrandingConfig;
  className?: string;
  iconClassName?: string;
  imageClassName?: string;
  nameClassName?: string;
  stacked?: boolean;
  suffix?: React.ReactNode;
  forceShowName?: boolean;
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brandingOverride,
  className,
  iconClassName,
  imageClassName,
  nameClassName,
  stacked = false,
  suffix,
  forceShowName = true,
}) => {
  const { branding } = useBranding();
  const activeBranding = brandingOverride || branding;

  return (
    <div className={cn('flex items-center gap-3', stacked && 'flex-col items-start gap-2', className)}>
      {activeBranding.logoUrl ? (
        <img
          src={activeBranding.logoUrl}
          alt={activeBranding.logoAlt}
          className={cn('h-10 w-auto max-w-[180px] object-contain', imageClassName)}
        />
      ) : (
        <div className={cn('w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200', iconClassName)}>
          <Heart className="w-5 h-5 text-white fill-white" />
        </div>
      )}
      {forceShowName && (
        <div className={cn('min-w-0', stacked && 'flex flex-col')}>
          <span className={cn('text-xl font-bold text-gray-900 dark:text-white', nameClassName)}>{activeBranding.brandName}</span>
          {suffix}
        </div>
      )}
    </div>
  );
};
