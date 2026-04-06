import { useRef, useEffect } from "react";
import { useToggle } from "@/hooks/useToggle";

interface ExpandableTextProps {
  text: string;
  className?: string;
  maxLines?: number;
}

export default function ExpandableText({
  text,
  className = "",
  maxLines = 2,
}: ExpandableTextProps) {
  const expanded = useToggle();
  const textRef = useRef<HTMLParagraphElement>(null);
  const shouldShowToggle = useRef(false);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(textRef.current).lineHeight,
      );
      const maxHeight = lineHeight * maxLines;
      const actualHeight = textRef.current.scrollHeight;

      shouldShowToggle.current = actualHeight > maxHeight;
    }
  }, [text, maxLines]);

  return (
    <div>
      <p
        ref={textRef}
        className={`${className} ${
          !expanded.isOpen
            ? "line-clamp-2 overflow-hidden text-ellipsis"
            : ""
        }`}
      >
        {text}
      </p>
      {shouldShowToggle.current && (
        <button
          onClick={expanded.isOpen ? expanded.close : expanded.open}
          className="text-pl-600 dark:text-pd-400 hover:text-pl-700 dark:hover:text-pd-300 mt-1 text-sm font-medium transition-colors"
          type="button"
        >
          {expanded.isOpen ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
