import { ChevronDown } from "lucide-react";
import Divider from "../base/Divider";
import { cn } from "@/utils/helpers";
import { IconButton } from "../base/IconButton";
import { useToggle } from "@/hooks/useToggle";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface ContainerProps {
  title: string;
  children: ReactNode;
  isCollapsible?: boolean;
  defaultOpen?: boolean;
  bodyClassName?: string;
  titleClassName?: string;
  subTitle?: string;
  headClassName?: string;
  className?: string;
  isOpen?: boolean;
  toggle?: () => void;
  dynamicHeight?: boolean;
  leadingHeaderComponent?: ReactNode;
  trailingHeaderComponent?: ReactNode;
  lazyRender?: boolean;
}

const Container: React.FC<ContainerProps> = (props) => {
  const {
    children,
    title,
    isCollapsible,
    bodyClassName,
    headClassName,
    titleClassName,
    subTitle,
    defaultOpen,
    className,
    dynamicHeight = false,
    leadingHeaderComponent,
    trailingHeaderComponent,
    lazyRender = false,
  } = props;

  const internalToggle = useToggle(defaultOpen || false);

  const isControlled = props.isOpen !== undefined && props.toggle !== undefined;

  const isOpen = isControlled ? props.isOpen : internalToggle.isOpen;
  const toggle = isControlled ? props.toggle : internalToggle.toggle;

  // If lazyRender is true, dynamicHeight should also be true
  const effectiveDynamicHeight = lazyRender || dynamicHeight;

  const [maxHeight, setMaxHeight] = useState("0px");
  const [shouldRenderContent, setShouldRenderContent] = useState(
    !lazyRender || isOpen
  );

  const contentRef = useRef<HTMLDivElement>(null);

  const cardBody = () => (
    <div className={cn("px-4 py-3.5", bodyClassName)}>
      {shouldRenderContent && children}
    </div>
  );

  const handleOnCollapse = () => {
    if (isCollapsible) {
      if (toggle) {
        toggle();
      }
    }
  };

  useEffect(() => {
    if (!lazyRender) return;

    if (isOpen) {
      setShouldRenderContent(true);
    } else {
      const timeout = setTimeout(() => setShouldRenderContent(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, lazyRender]);

  useEffect(() => {
    if (isOpen && contentRef.current && effectiveDynamicHeight) {
      // Use requestAnimationFrame to ensure DOM has updated after shouldRenderContent changes
      requestAnimationFrame(() => {
        if (contentRef.current) {
          const newHeight = contentRef.current.scrollHeight;
          setMaxHeight(`${newHeight}px`);
        }
      });
    }
  }, [isOpen, children, effectiveDynamicHeight, shouldRenderContent]);

  return (
    <div className={cn("card w-full", className)}>
      <div
        className={cn(
          "flex items-center gap-x-3 px-4 py-3",
          headClassName,
          isCollapsible && "cursor-pointer select-none",
        )}
        onClick={handleOnCollapse}
      >
        {leadingHeaderComponent && (
          <div onClick={(e) => e.stopPropagation()}>
            {leadingHeaderComponent}
          </div>
        )}
        <div className="mr-auto flex flex-col">
          <p
            className={cn(
              "dark:text-nd-200 text-nl-600 font-medium",
              titleClassName,
            )}
          >
            {title || "Card Title"}
          </p>
          {subTitle && (
            <span className="text-nl-500 dark:text-nd-300"> {subTitle} </span>
          )}
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          {trailingHeaderComponent && trailingHeaderComponent}
        </div>
        {isCollapsible && (
          <IconButton
            icon={ChevronDown}
            size={"sm"}
            onClick={(e) => {
              e.stopPropagation();
              handleOnCollapse();
            }}
            noDefaultFill
            iconClassName={cn(
              "transition-all",
              isOpen ? "-scale-y-100" : "scale-100",
            )}
          />
        )}
      </div>
      <Divider
        className={cn(
          "transition-opacity",
          isCollapsible && !isOpen && "opacity-0",
          (!isCollapsible || isOpen) && "opacity-100",
        )}
      />
      <>
        {isCollapsible ? (
          <div
            className={cn(
              "overflow-hidden transition-all duration-200 ease-in-out",
            )}
            style={{
              maxHeight: isOpen
                ? effectiveDynamicHeight
                  ? maxHeight
                  : `${contentRef.current?.scrollHeight || 1000}px`
                : "0px",
            }}
          >
            <div className={cn("px-4 py-3.5", bodyClassName)} ref={contentRef}>
              {shouldRenderContent && children}
            </div>
          </div>
        ) : (
          cardBody()
        )}
      </>
    </div>
  );
};

export default Container;
