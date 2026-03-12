import React from 'react';
import { cn } from '../../../lib/utils';
import {
    AlignCenter, AlignLeft, AlignRight,
    Bold, Italic, Type,
    ArrowUp, ArrowDown, MoveHorizontal,
    Square, Circle, Minus, Maximize,
    Layers
} from 'lucide-react';

// --- TYPOGRAPHY CONTROL ---
interface TypographyControlProps {
    label: string;
    values: {
        fontFamily?: string;
        fontSize?: number;
        fontWeight?: string;
        lineHeight?: number;
        textAlign?: 'left' | 'center' | 'right';
        color?: string;
        textTransform?: string;
    };
    onChange: (updates: any) => void;
}

export const TypographyControl: React.FC<TypographyControlProps> = ({ label, values, onChange }) => {
    return (
        <div className="space-y-3 p-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-1">
                <Type className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</span>
            </div>

            {/* Alignment & Style Row */}
            <div className="flex items-center gap-1">
                <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    {[
                        { id: 'left', icon: AlignLeft },
                        { id: 'center', icon: AlignCenter },
                        { id: 'right', icon: AlignRight },
                    ].map((align) => (
                        <button
                            key={align.id}
                            onClick={() => onChange({ textAlign: align.id })}
                            className={cn(
                                "p-1.5 rounded transition-all",
                                values.textAlign === align.id ? "bg-primary-100 text-primary-600 dark:bg-primary-900/40" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <align.icon className="w-3.5 h-3.5" />
                        </button>
                    ))}
                </div>

                <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ml-auto">
                    <button
                        onClick={() => onChange({ fontWeight: values.fontWeight === 'bold' ? 'normal' : 'bold' })}
                        className={cn(
                            "p-1.5 rounded transition-all",
                            values.fontWeight === 'bold' ? "bg-primary-100 text-primary-600 dark:bg-primary-900/40" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => onChange({ textTransform: values.textTransform === 'uppercase' ? 'none' : 'uppercase' })}
                        className={cn(
                            "p-1.5 rounded transition-all",
                            values.textTransform === 'uppercase' ? "bg-primary-100 text-primary-600 dark:bg-primary-900/40" : "text-gray-400 hover:text-gray-600 font-bold text-[10px]"
                        )}
                    >
                        AA
                    </button>
                </div>
            </div>

            {/* Font Size & Line Height */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-[9px] text-gray-400 uppercase font-black mb-1 block">Size</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={values.fontSize || 16}
                            onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
                            className="w-full pl-7 pr-2 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-1 focus:ring-primary-500"
                        />
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">px</span>
                    </div>
                </div>
                <div>
                    <label className="text-[9px] text-gray-400 uppercase font-black mb-1 block">Line</label>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.1"
                            value={values.lineHeight || 1.5}
                            onChange={(e) => onChange({ lineHeight: Number(e.target.value) })}
                            className="w-full pl-7 pr-2 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-1 focus:ring-primary-500"
                        />
                        <MoveHorizontal className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Color Picker */}
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden relative shadow-sm">
                    <input
                        type="color"
                        value={values.color || '#000000'}
                        onChange={(e) => onChange({ color: e.target.value })}
                        className="absolute -inset-1 w-[150%] h-[150%] cursor-pointer"
                    />
                </div>
                <input
                    type="text"
                    value={values.color || '#000000'}
                    onChange={(e) => onChange({ color: e.target.value })}
                    className="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-mono"
                    placeholder="#HEX"
                />
            </div>
        </div>
    );
};

// --- BORDER & RADIUS CONTROL ---
interface BorderControlProps {
    label: string;
    values: {
        borderWidth?: number;
        borderStyle?: string;
        borderColor?: string;
        borderRadius?: number;
    };
    onChange: (updates: any) => void;
}

export const BorderControl: React.FC<BorderControlProps> = ({ label, values, onChange }) => {
    const styles = ['none', 'solid', 'dashed', 'dotted'];

    return (
        <div className="space-y-3 p-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-1">
                <Square className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-[9px] text-gray-400 uppercase font-black mb-1 block">Width</label>
                    <input
                        type="number"
                        value={values.borderWidth || 0}
                        onChange={(e) => onChange({ borderWidth: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                    />
                </div>
                <div>
                    <label className="text-[9px] text-gray-400 uppercase font-black mb-1 block">Radius</label>
                    <input
                        type="number"
                        value={values.borderRadius || 0}
                        onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                    />
                </div>
            </div>

            <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                {styles.map((s) => (
                    <button
                        key={s}
                        onClick={() => onChange({ borderStyle: s })}
                        className={cn(
                            "flex-1 py-1 text-[9px] uppercase font-bold rounded transition-all",
                            (values.borderStyle || 'none') === s ? "bg-primary-100 text-primary-600 dark:bg-primary-900/40" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden relative shadow-sm">
                    <input
                        type="color"
                        value={values.borderColor || '#000000'}
                        onChange={(e) => onChange({ borderColor: e.target.value })}
                        className="absolute -inset-1 w-[150%] h-[150%] cursor-pointer"
                    />
                </div>
                <input
                    type="text"
                    value={values.borderColor || '#000000'}
                    onChange={(e) => onChange({ borderColor: e.target.value })}
                    className="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-mono"
                    placeholder="Border Color"
                />
            </div>
        </div>
    );
};

// --- SPACING CONTROL ---
interface SpacingControlProps {
    label: string;
    type: 'padding' | 'margin';
    values: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
        linked?: boolean;
    };
    onChange: (updates: any) => void;
}

export const SpacingControl: React.FC<SpacingControlProps> = ({ label, type, values, onChange }) => {
    const isLinked = values.linked ?? true;

    const handleValChange = (side: string, val: number) => {
        if (isLinked) {
            onChange({ top: val, right: val, bottom: val, left: val });
        } else {
            onChange({ [side]: val });
        }
    };

    return (
        <div className="bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Maximize className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</span>
                </div>
                <button
                    onClick={() => onChange({ linked: !isLinked })}
                    className={cn("p-1 rounded transition-colors", isLinked ? "text-primary-600 bg-primary-50 dark:bg-primary-900/40" : "text-gray-400 hover:bg-gray-100")}
                >
                    <Layers className={cn("w-3.5 h-3.5", isLinked ? "scale-110" : "scale-100")} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 relative">
                {/* Linked overlay if applicable - visualized via UI inputs */}
                <div>
                    <label className="text-[8px] text-gray-400 block mb-0.5 ml-1">TOP</label>
                    <input
                        type="number"
                        value={values.top || 0}
                        onChange={(e) => handleValChange('top', Number(e.target.value))}
                        className="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-center"
                    />
                </div>
                <div>
                    <label className="text-[8px] text-gray-400 block mb-0.5 ml-1">BOTTOM</label>
                    <input
                        type="number"
                        value={values.bottom || 0}
                        onChange={(e) => handleValChange('bottom', Number(e.target.value))}
                        className="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-center"
                    />
                </div>
                <div>
                    <label className="text-[8px] text-gray-400 block mb-0.5 ml-1">LEFT</label>
                    <input
                        type="number"
                        value={values.left || 0}
                        onChange={(e) => handleValChange('left', Number(e.target.value))}
                        disabled={isLinked}
                        className={cn("w-full px-2 py-1.5 text-xs border rounded-lg outline-none text-center", isLinked ? "bg-gray-100 dark:bg-gray-800/50 border-transparent text-gray-300" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700")}
                    />
                </div>
                <div>
                    <label className="text-[8px] text-gray-400 block mb-0.5 ml-1">RIGHT</label>
                    <input
                        type="number"
                        value={values.right || 0}
                        onChange={(e) => handleValChange('right', Number(e.target.value))}
                        disabled={isLinked}
                        className={cn("w-full px-2 py-1.5 text-xs border rounded-lg outline-none text-center", isLinked ? "bg-gray-100 dark:bg-gray-800/50 border-transparent text-gray-300" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700")}
                    />
                </div>
            </div>
        </div>
    );
};
