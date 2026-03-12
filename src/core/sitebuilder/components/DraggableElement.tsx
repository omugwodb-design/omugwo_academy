import React, { useRef, useState } from 'react';
import { cn } from '../../../lib/utils';
import { GripHorizontal } from 'lucide-react';

interface DraggableElementProps {
    id: string; // Used to identify the prop key being modified (e.g. titleOffsetX, imageOffsetY)
    initialX?: number;
    initialY?: number;
    selected?: boolean;
    label?: string;
    onUpdateXY?: (x: number, y: number) => void;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const DraggableElement: React.FC<DraggableElementProps> = ({
    id,
    initialX = 0,
    initialY = 0,
    selected = false,
    label = 'Drag Element',
    onUpdateXY,
    children,
    className,
    style,
}) => {
    const [isDragging, setIsDragging] = useState(false);

    // Need to track relative positions to ensure correct drag distances
    const dragRef = useRef<{
        startX: number;
        startY: number;
        originX: number;
        originY: number;
    } | null>(null);

    // Snap to 8px grid
    const snap = (n: number, grid = 8) => Math.round(n / grid) * grid;

    const onPointerDown = (e: React.PointerEvent) => {
        if (!selected) return;
        e.preventDefault();
        e.stopPropagation();

        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            originX: initialX,
            originY: initialY,
        };

        setIsDragging(true);

        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.setPointerCapture(e.pointerId);
        }
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!selected || !isDragging || !dragRef.current) return;

        e.preventDefault();
        e.stopPropagation();

        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;

        const nextX = snap(dragRef.current.originX + dx);
        const nextY = snap(dragRef.current.originY + dy);

        if (onUpdateXY) {
            onUpdateXY(nextX, nextY);
        }
    };

    const onPointerUp = (e: React.PointerEvent) => {
        if (!selected || !isDragging) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragRef.current = null;

        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    };

    return (
        <div
            className={cn('relative inline-block', className, isDragging && 'z-50')}
            style={{
                transform: `translate3d(${initialX}px, ${initialY}px, 0)`,
                willChange: isDragging ? 'transform' : 'auto',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                ...style
            }}
        >
            {/* Drag Handle UI visible tightly above the element when selected */}
            {selected && (
                <div
                    className={cn(
                        "absolute -top-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full px-2.5 py-1 shadow-xl cursor-grab active:cursor-grabbing backdrop-blur-md border border-white/10 transition-all",
                        isDragging ? 'bg-primary-600/90 text-white scale-105' : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800'
                    )}
                    style={{ touchAction: "none" }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                >
                    <GripHorizontal className="w-3.5 h-3.5 opacity-50" />
                    <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{label}</span>

                    {/* Smart Alignment Guides - visible only during drag */}
                    {isDragging && (
                        <div className="absolute inset-x-0 bottom-full mb-2 pointer-events-none">
                            <div className="w-full h-[500px] border-l-2 border-primary-400/30 border-dashed absolute left-1/2 -translate-x-1/2 bottom-0" />
                            <div className="w-[500px] h-px border-b-2 border-primary-400/30 border-dashed absolute left-1/2 -translate-x-1/2 bottom-0" />
                        </div>
                    )}
                </div>
            )}

            {/* Actual Element Content */}
            <div className={cn("relative", selected && "ring-1 ring-primary-500/20 rounded-sm ring-offset-2 ring-offset-transparent")}>
                {children}
            </div>
        </div>
    );
};
