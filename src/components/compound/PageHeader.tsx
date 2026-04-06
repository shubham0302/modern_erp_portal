import { cn } from "@/utils/helpers";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  trailingComponent?: React.ReactNode;
  className?: string;
};

const PageHeader: React.FC<PageHeaderProps> = (props) => {
  const {
    title,
    subtitle,
    trailingComponent,
    subtitleClassName,
    titleClassName,
    className,
  } = props;
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div>
        <h5
          className={cn(
            "text-nl-800 dark:text-nd-100 font-semibold",
            titleClassName,
          )}
        >
          {title}
        </h5>
        <p
          className={cn(
            "text-nl-400 dark:text-nd-300 leading-tight",
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      </div>
      {trailingComponent && trailingComponent}
    </div>
  );
};

export default PageHeader;
