// Block Variants and Conditional Visibility System
import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../../../lib/utils';
import { Block } from '../types';
import { useEditorStore } from '../store/editor-store';
import {
  Layers,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ChevronDown,
  ChevronRight,
  Plus,
  Check,
  X,
  Settings,
  Variable,
  Clock,
  User,
  Monitor,
  Smartphone,
  Globe,
} from 'lucide-react';

// Block variant definition
export interface BlockVariant {
  id: string;
  name: string;
  description?: string;
  props: Record<string, any>;
  isDefault?: boolean;
}

// Visibility condition types
export type VisibilityConditionType =
  | 'always'
  | 'device'
  | 'datetime'
  | 'user_role'
  | 'user_logged_in'
  | 'url_param'
  | 'referrer'
  | 'scroll_position'
  | 'custom';

// Visibility condition
export interface VisibilityCondition {
  type: VisibilityConditionType;
  enabled: boolean;
  config: Record<string, any>;
}

// Device visibility config
export interface DeviceVisibilityConfig {
  showOnDesktop: boolean;
  showOnTablet: boolean;
  showOnMobile: boolean;
}

// DateTime visibility config
export interface DateTimeVisibilityConfig {
  startDate?: string;
  endDate?: string;
  timezone?: string;
}

// User role visibility config
export interface UserRoleVisibilityConfig {
  roles: string[];
  matchType: 'any' | 'all' | 'none';
}

// URL param visibility config
export interface URLParamVisibilityConfig {
  param: string;
  value: string;
  matchType: 'equals' | 'contains' | 'exists';
}

// Default visibility
const DEFAULT_VISIBILITY: VisibilityCondition = {
  type: 'always',
  enabled: false,
  config: {},
};

const DEFAULT_DEVICE_CONFIG: DeviceVisibilityConfig = {
  showOnDesktop: true,
  showOnTablet: true,
  showOnMobile: true,
};

// Extended block with variants and visibility
export interface EnhancedBlock extends Block {
  variants?: BlockVariant[];
  activeVariantId?: string;
  visibility?: VisibilityCondition;
}

// Check if block should be visible
export const checkBlockVisibility = (
  block: Block,
  context: {
    device?: 'desktop' | 'tablet' | 'mobile';
    userRole?: string;
    isLoggedIn?: boolean;
    urlParams?: Record<string, string>;
    referrer?: string;
    scrollPosition?: number;
    currentTime?: Date;
  }
): boolean => {
  const enhancedBlock = block as EnhancedBlock;
  const visibility = enhancedBlock.visibility;

  if (!visibility || !visibility.enabled) {
    return true;
  }

  switch (visibility.type) {
    case 'device': {
      const config = visibility.config as DeviceVisibilityConfig;
      const device = context.device || 'desktop';
      if (device === 'desktop' && !config.showOnDesktop) return false;
      if (device === 'tablet' && !config.showOnTablet) return false;
      if (device === 'mobile' && !config.showOnMobile) return false;
      return true;
    }

    case 'user_logged_in': {
      return context.isLoggedIn === visibility.config.showLoggedIn;
    }

    case 'user_role': {
      const config = visibility.config as UserRoleVisibilityConfig;
      const userRole = context.userRole;
      if (!userRole) return config.matchType === 'none';
      
      const hasRole = config.roles.includes(userRole);
      if (config.matchType === 'any') return hasRole;
      if (config.matchType === 'all') return config.roles.every(r => r === userRole);
      if (config.matchType === 'none') return !hasRole;
      return true;
    }

    case 'url_param': {
      const config = visibility.config as URLParamVisibilityConfig;
      const paramValue = context.urlParams?.[config.param];
      
      if (!paramValue) return config.matchType === 'exists' ? false : true;
      
      if (config.matchType === 'equals') return paramValue === config.value;
      if (config.matchType === 'contains') return paramValue.includes(config.value);
      if (config.matchType === 'exists') return !!paramValue;
      return true;
    }

    case 'datetime': {
      const config = visibility.config as DateTimeVisibilityConfig;
      const now = context.currentTime || new Date();
      
      if (config.startDate) {
        const start = new Date(config.startDate);
        if (now < start) return false;
      }
      
      if (config.endDate) {
        const end = new Date(config.endDate);
        if (now > end) return false;
      }
      
      return true;
    }

    default:
      return true;
  }
};

// Get active variant props
export const getActiveVariantProps = (block: EnhancedBlock): Record<string, any> => {
  if (!block.variants || block.variants.length === 0) {
    return block.props;
  }

  const activeVariant = block.variants.find(v => v.id === block.activeVariantId);
  if (activeVariant) {
    return { ...block.props, ...activeVariant.props };
  }

  const defaultVariant = block.variants.find(v => v.isDefault);
  return { ...block.props, ...defaultVariant?.props };
};

// Block Variants Panel
interface BlockVariantsPanelProps {
  block: EnhancedBlock;
  onUpdateBlock: (updates: Partial<EnhancedBlock>) => void;
  className?: string;
}

export const BlockVariantsPanel: React.FC<BlockVariantsPanelProps> = ({
  block,
  onUpdateBlock,
  className,
}) => {
  const [expandedVariant, setExpandedVariant] = useState<string | null>(null);

  const variants = block.variants || [];

  const createVariant = useCallback(() => {
    const newVariant: BlockVariant = {
      id: `variant_${Date.now()}`,
      name: `Variant ${variants.length + 1}`,
      props: { ...block.props },
    };

    onUpdateBlock({
      variants: [...variants, newVariant],
      activeVariantId: newVariant.id,
    });
  }, [block.props, variants, onUpdateBlock]);

  const updateVariant = useCallback((variantId: string, updates: Partial<BlockVariant>) => {
    const updatedVariants = variants.map(v =>
      v.id === variantId ? { ...v, ...updates } : v
    );
    onUpdateBlock({ variants: updatedVariants });
  }, [variants, onUpdateBlock]);

  const deleteVariant = useCallback((variantId: string) => {
    const filteredVariants = variants.filter(v => v.id !== variantId);
    const updates: Partial<EnhancedBlock> = { variants: filteredVariants };
    
    if (block.activeVariantId === variantId) {
      const defaultVariant = filteredVariants.find(v => v.isDefault);
      updates.activeVariantId = defaultVariant?.id || filteredVariants[0]?.id;
    }
    
    onUpdateBlock(updates);
  }, [variants, block.activeVariantId, onUpdateBlock]);

  const setAsDefault = useCallback((variantId: string) => {
    const updatedVariants = variants.map(v => ({
      ...v,
      isDefault: v.id === variantId,
    }));
    onUpdateBlock({ variants: updatedVariants });
  }, [variants, onUpdateBlock]);

  const duplicateVariant = useCallback((variantId: string) => {
    const original = variants.find(v => v.id === variantId);
    if (!original) return;

    const duplicate: BlockVariant = {
      id: `variant_${Date.now()}`,
      name: `${original.name} (Copy)`,
      props: { ...original.props },
    };

    onUpdateBlock({
      variants: [...variants, duplicate],
      activeVariantId: duplicate.id,
    });
  }, [variants, onUpdateBlock]);

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Copy className="w-3.5 h-3.5" />
          Variants
        </h4>
        <button
          onClick={createVariant}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No variants yet
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Create variations of this block for A/B testing
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className={cn(
                'border rounded-lg overflow-hidden transition-colors',
                block.activeVariantId === variant.id
                  ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20'
                  : 'border-gray-200 dark:border-gray-700'
              )}
            >
              <div
                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setExpandedVariant(
                  expandedVariant === variant.id ? null : variant.id
                )}
              >
                <div className="flex items-center gap-2">
                  {expandedVariant === variant.id ? (
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  )}
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {variant.name}
                  </span>
                  {variant.isDefault && (
                    <span className="px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-xs rounded">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateBlock({ activeVariantId: variant.id });
                    }}
                    className={cn(
                      'p-1 rounded transition-colors',
                      block.activeVariantId === variant.id
                        ? 'text-primary-600'
                        : 'text-gray-400 hover:text-primary-600'
                    )}
                    title="Activate"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {expandedVariant === variant.id && (
                <div className="px-3 pb-3 space-y-2 border-t border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) => updateVariant(variant.id, { name: e.target.value })}
                    className="w-full px-2 py-1 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded mt-2"
                    placeholder="Variant name"
                  />
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => setAsDefault(variant.id)}
                      className="flex-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    >
                      Set Default
                    </button>
                    <button
                      onClick={() => duplicateVariant(variant.id)}
                      className="flex-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => deleteVariant(variant.id)}
                      className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Block Visibility Panel
interface BlockVisibilityPanelProps {
  block: EnhancedBlock;
  onUpdateBlock: (updates: Partial<EnhancedBlock>) => void;
  className?: string;
}

export const BlockVisibilityPanel: React.FC<BlockVisibilityPanelProps> = ({
  block,
  onUpdateBlock,
  className,
}) => {
  const visibility = block.visibility || DEFAULT_VISIBILITY;
  const [expandedCondition, setExpandedCondition] = useState<VisibilityConditionType | null>(null);

  const updateVisibility = useCallback((updates: Partial<VisibilityCondition>) => {
    onUpdateBlock({
      visibility: { ...visibility, ...updates },
    });
  }, [visibility, onUpdateBlock]);

  const updateConfig = useCallback((config: Record<string, any>) => {
    updateVisibility({ config: { ...visibility.config, ...config } });
  }, [visibility.config, updateVisibility]);

  const conditionTypes: { type: VisibilityConditionType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { type: 'device', label: 'Device', icon: Monitor },
    { type: 'datetime', label: 'Date & Time', icon: Clock },
    { type: 'user_logged_in', label: 'Login Status', icon: User },
    { type: 'user_role', label: 'User Role', icon: User },
    { type: 'url_param', label: 'URL Parameter', icon: Globe },
  ];

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Eye className="w-3.5 h-3.5" />
          Visibility
        </h4>
        <label className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Enable</span>
          <input
            type="checkbox"
            checked={visibility.enabled}
            onChange={(e) => updateVisibility({ enabled: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </label>
      </div>

      {!visibility.enabled ? (
        <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Always visible
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Enable to add visibility rules
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Condition Type Selector */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Show based on
            </label>
            <select
              value={visibility.type}
              onChange={(e) => updateVisibility({ type: e.target.value as VisibilityConditionType })}
              className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              {conditionTypes.map((ct) => (
                <option key={ct.type} value={ct.type}>
                  {ct.label}
                </option>
              ))}
            </select>
          </div>

          {/* Device Visibility */}
          {visibility.type === 'device' && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Show on these devices:
              </p>
              {[
                { key: 'showOnDesktop', label: 'Desktop', icon: Monitor },
                { key: 'showOnTablet', label: 'Tablet', icon: Monitor },
                { key: 'showOnMobile', label: 'Mobile', icon: Smartphone },
              ].map(({ key, label, icon: Icon }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(visibility.config as DeviceVisibilityConfig)[key as keyof DeviceVisibilityConfig]}
                    onChange={(e) => updateConfig({ [key]: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600"
                  />
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          )}

          {/* DateTime Visibility */}
          {visibility.type === 'datetime' && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Start Date (optional)
                </label>
                <input
                  type="datetime-local"
                  value={(visibility.config as DateTimeVisibilityConfig).startDate || ''}
                  onChange={(e) => updateConfig({ startDate: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  End Date (optional)
                </label>
                <input
                  type="datetime-local"
                  value={(visibility.config as DateTimeVisibilityConfig).endDate || ''}
                  onChange={(e) => updateConfig({ endDate: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded mt-1"
                />
              </div>
            </div>
          )}

          {/* User Logged In Visibility */}
          {visibility.type === 'user_logged_in' && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibility.config.showLoggedIn === true}
                  onChange={(e) => updateConfig({ showLoggedIn: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  Only show to logged-in users
                </span>
              </label>
            </div>
          )}

          {/* User Role Visibility */}
          {visibility.type === 'user_role' && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Match Type
                </label>
                <select
                  value={(visibility.config as UserRoleVisibilityConfig).matchType || 'any'}
                  onChange={(e) => updateConfig({ matchType: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded mt-1"
                >
                  <option value="any">User has any of these roles</option>
                  <option value="all">User has all of these roles</option>
                  <option value="none">User has none of these roles</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Roles (comma-separated)
                </label>
                <input
                  type="text"
                  value={((visibility.config as UserRoleVisibilityConfig).roles || []).join(', ')}
                  onChange={(e) => updateConfig({ roles: e.target.value.split(',').map(r => r.trim()).filter(Boolean) })}
                  placeholder="admin, student, instructor"
                  className="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded mt-1"
                />
              </div>
            </div>
          )}

          {/* URL Parameter Visibility */}
          {visibility.type === 'url_param' && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Parameter Name
                </label>
                <input
                  type="text"
                  value={(visibility.config as URLParamVisibilityConfig).param || ''}
                  onChange={(e) => updateConfig({ param: e.target.value })}
                  placeholder="utm_source"
                  className="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Match Type
                </label>
                <select
                  value={(visibility.config as URLParamVisibilityConfig).matchType || 'equals'}
                  onChange={(e) => updateConfig({ matchType: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded mt-1"
                >
                  <option value="equals">Equals</option>
                  <option value="contains">Contains</option>
                  <option value="exists">Exists (any value)</option>
                </select>
              </div>
              {(visibility.config as URLParamVisibilityConfig).matchType !== 'exists' && (
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Expected Value
                  </label>
                  <input
                    type="text"
                    value={(visibility.config as URLParamVisibilityConfig).value || ''}
                    onChange={(e) => updateConfig({ value: e.target.value })}
                    placeholder="newsletter"
                    className="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded mt-1"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Combined Block Settings Panel
interface BlockAdvancedSettingsProps {
  block: EnhancedBlock;
  onUpdateBlock: (updates: Partial<EnhancedBlock>) => void;
  className?: string;
}

export const BlockAdvancedSettings: React.FC<BlockAdvancedSettingsProps> = ({
  block,
  onUpdateBlock,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<'variants' | 'visibility'>('variants');

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('variants')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold transition-colors',
            activeTab === 'variants'
              ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/30 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          <Copy className="w-3.5 h-3.5" />
          Variants
        </button>
        <button
          onClick={() => setActiveTab('visibility')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold transition-colors',
            activeTab === 'visibility'
              ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/30 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          <Eye className="w-3.5 h-3.5" />
          Visibility
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'variants' && (
          <BlockVariantsPanel
            block={block}
            onUpdateBlock={onUpdateBlock}
          />
        )}
        {activeTab === 'visibility' && (
          <BlockVisibilityPanel
            block={block}
            onUpdateBlock={onUpdateBlock}
          />
        )}
      </div>
    </div>
  );
};

export default BlockAdvancedSettings;
