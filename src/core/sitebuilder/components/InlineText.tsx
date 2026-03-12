import React from "react";
import { cn } from "../../../lib/utils";

interface InlineTextProps {
    value: string;
    onChange: (newValue: string) => void;
    selected?: boolean;
    className?: string;
    element?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
    placeholder?: string;
}

export const InlineText: React.FC<InlineTextProps> = ({
    value,
    onChange,
    selected = false,
    className,
    element: Element = "div",
    placeholder = "Type here...",
}) => {
    const stopBlockSelection = (e: React.SyntheticEvent) => {
        e.stopPropagation();
    };

    // If not selected, just render a regular element with dangerouslySetInnerHTML
    // to support any basic HTML formatting if needed, though usually it's just text.
    if (!selected) {
        return (
            <Element
                className={className}
                dangerouslySetInnerHTML={{ __html: value || placeholder }}
            />
        );
    }

    return (
        <Element
            className={cn(
                className,
                "outline-none focus:ring-2 focus:ring-primary-500/30 rounded-sm transition-shadow min-h-[1em]",
                !value && "text-gray-400 italic"
            )}
            contentEditable={true}
            suppressContentEditableWarning
            onBlur={(e) => {
                const newValue = e.currentTarget.innerHTML;
                if (newValue !== value) {
                    onChange(newValue);
                }
            }}
            onMouseDown={stopBlockSelection}
            onPointerDown={stopBlockSelection}
            onClick={stopBlockSelection}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && Element !== 'p' && Element !== 'div') {
                    // Prevent new lines in headings/spans unless it's a block element
                    // actually, sometimes we want br in headings. Let's be flexible.
                }
            }}
            dangerouslySetInnerHTML={{ __html: value || (selected ? "" : placeholder) }}
        />
    );
};
