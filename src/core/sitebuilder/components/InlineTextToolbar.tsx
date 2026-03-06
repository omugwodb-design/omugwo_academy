import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Bold, Italic, Link as LinkIcon, RemoveFormatting, Underline } from "lucide-react";
import { cn } from "../../../lib/utils";

type ToolbarState = {
  open: boolean;
  top: number;
  left: number;
};

const isSelectionInsideContentEditable = (selection: Selection | null) => {
  if (!selection || selection.rangeCount === 0) return false;
  const anchor = selection.anchorNode;
  const focus = selection.focusNode;
  const el = (node: Node | null): HTMLElement | null => {
    if (!node) return null;
    if (node instanceof HTMLElement) return node;
    return node.parentElement;
  };

  const a = el(anchor);
  const f = el(focus);
  return Boolean((a && a.isContentEditable) || (f && f.isContentEditable));
};

const getSelectionRect = (selection: Selection | null) => {
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  if (!rect || (rect.width === 0 && rect.height === 0)) return null;
  return rect;
};

const ToolbarButton: React.FC<{
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ title, onClick, children }) => {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        // Prevent selection loss / blur
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
    >
      {children}
    </button>
  );
};

export const InlineTextToolbar: React.FC = () => {
  const [state, setState] = useState<ToolbarState>({ open: false, top: 0, left: 0 });
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [fontFamily, setFontFamily] = useState<string>("Inter");
  const [fontSize, setFontSize] = useState<string>("3");
  const [textColor, setTextColor] = useState<string>("#111827");
  const [highlightColor, setHighlightColor] = useState<string>("#FDE68A");

  const updateFromSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setState((s) => (s.open ? { ...s, open: false } : s));
      setSavedRange(null);
      return;
    }

    if (!isSelectionInsideContentEditable(selection)) {
      setState((s) => (s.open ? { ...s, open: false } : s));
      setSavedRange(null);
      return;
    }

    const rect = getSelectionRect(selection);
    if (!rect) {
      setState((s) => (s.open ? { ...s, open: false } : s));
      setSavedRange(null);
      return;
    }

    try {
      setSavedRange(selection.getRangeAt(0).cloneRange());
    } catch {
      setSavedRange(null);
    }

    const top = rect.top - 44;
    const left = rect.left + rect.width / 2;
    setState({ open: true, top, left });
  }, []);

  const restoreSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || !savedRange) return false;
    selection.removeAllRanges();
    selection.addRange(savedRange);
    return true;
  }, [savedRange]);

  useEffect(() => {
    const onSelectionChange = () => updateFromSelection();
    const onScrollOrResize = () => updateFromSelection();

    document.addEventListener("selectionchange", onSelectionChange);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      document.removeEventListener("selectionchange", onSelectionChange);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [updateFromSelection]);

  const exec = useCallback(
    (command: string, value?: string) => {
      restoreSelection();
      document.execCommand(command, false, value);
      updateFromSelection();
    },
    [restoreSelection, updateFromSelection]
  );

  const insertLink = useCallback(() => {
    const url = window.prompt("Enter URL:");
    if (!url) return;
    exec("createLink", url);
  }, [exec]);

  const applyHeading = useCallback(
    (tag: "p" | "h1" | "h2" | "h3") => {
      exec("formatBlock", tag);
    },
    [exec]
  );

  const applyFontFamily = useCallback(
    (ff: string) => {
      setFontFamily(ff);
      exec("fontName", ff);
    },
    [exec]
  );

  const applyFontSize = useCallback(
    (size: string) => {
      setFontSize(size);
      // execCommand only supports 1-7; map UI directly to that.
      exec("fontSize", size);
    },
    [exec]
  );

  const applyTextColor = useCallback(
    (c: string) => {
      setTextColor(c);
      exec("foreColor", c);
    },
    [exec]
  );

  const applyHighlight = useCallback(
    (c: string) => {
      setHighlightColor(c);
      // Some browsers use hiliteColor; others use backColor.
      exec("hiliteColor", c);
      exec("backColor", c);
    },
    [exec]
  );

  const style = useMemo<React.CSSProperties>(() => {
    return {
      position: "fixed",
      top: state.top,
      left: state.left,
      transform: "translateX(-50%)",
    };
  }, [state.left, state.top]);

  if (!state.open) return null;

  return (
    <div
      className={cn(
        "pointer-events-auto z-50",
        "bg-white border border-gray-200 rounded-xl shadow-lg",
        "px-1.5 py-1 flex items-center gap-0.5"
      )}
      style={style}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <select
        className="h-8 text-xs rounded-md border border-gray-200 bg-white px-2"
        value={fontFamily}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onChange={(e) => applyFontFamily(e.target.value)}
        title="Font"
      >
        <option value="Inter">Inter</option>
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Verdana">Verdana</option>
      </select>

      <select
        className="h-8 text-xs rounded-md border border-gray-200 bg-white px-2"
        value={fontSize}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onChange={(e) => applyFontSize(e.target.value)}
        title="Font size"
      >
        <option value="1">XS</option>
        <option value="2">SM</option>
        <option value="3">MD</option>
        <option value="4">LG</option>
        <option value="5">XL</option>
        <option value="6">2XL</option>
        <option value="7">3XL</option>
      </select>

      <select
        className="h-8 text-xs rounded-md border border-gray-200 bg-white px-2"
        defaultValue="p"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onChange={(e) => applyHeading(e.target.value as any)}
        title="Heading"
      >
        <option value="p">P</option>
        <option value="h1">H1</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
      </select>

      <label
        className="h-8 w-8 rounded-md border border-gray-200 bg-white flex items-center justify-center cursor-pointer"
        title="Text color"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <span className="w-4 h-4 rounded" style={{ backgroundColor: textColor }} />
        <input
          type="color"
          value={textColor}
          onChange={(e) => applyTextColor(e.target.value)}
          className="sr-only"
        />
      </label>

      <label
        className="h-8 w-8 rounded-md border border-gray-200 bg-white flex items-center justify-center cursor-pointer"
        title="Highlight"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <span className="w-4 h-4 rounded" style={{ backgroundColor: highlightColor }} />
        <input
          type="color"
          value={highlightColor}
          onChange={(e) => applyHighlight(e.target.value)}
          className="sr-only"
        />
      </label>

      <div className="w-px h-5 bg-gray-200 mx-1" />
      <ToolbarButton title="Bold" onClick={() => exec("bold")}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton title="Italic" onClick={() => exec("italic")}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton title="Underline" onClick={() => exec("underline")}
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      <ToolbarButton title="Insert Link" onClick={insertLink}
      >
        <LinkIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton title="Clear Formatting" onClick={() => exec("removeFormat")}
      >
        <RemoveFormatting className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
};
