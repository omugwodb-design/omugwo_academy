import React from "react";
import { Block, GlobalStyles } from "./types";
import { BLOCK_DEFINITIONS } from "./registry";
import { cn } from "../../lib/utils";

interface SiteRendererProps {
    blocks: Block[];
    globalStyles?: GlobalStyles;
}

export const SiteRenderer: React.FC<SiteRendererProps> = ({ blocks, globalStyles }) => {
    // Filter out navigation and footer blocks - these are managed globally by App.tsx
    const contentBlocks = blocks.filter(block => 
        block.type !== 'navigation' && block.type !== 'footer'
    );

    return (
        <div
            className="w-full min-h-screen"
            style={{
                fontFamily: globalStyles?.fontFamily || "Inter",
                color: globalStyles?.textColor || "#1f2937",
                backgroundColor: globalStyles?.backgroundColor || "#ffffff",
            }}
        >
            {contentBlocks.map((block) => {
                const def = BLOCK_DEFINITIONS[block.type];
                if (!def) return null;

                const Component = def.component;

                // Pass dummy onChange for read-only mode
                return (
                    <div key={block.id} id={block.id}>
                        <Component
                            block={block}
                            onChange={() => { }}
                            selected={false}
                        />
                    </div>
                );
            })}
        </div>
    );
};
