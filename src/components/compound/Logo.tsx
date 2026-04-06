import { cn } from "@/utils/helpers";

const Logo: React.FC<LogoProps> = ({
  size = "md",
  className,
  src = "/logo.png",
  alt = "Logo",
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("object-contain", sizeMap[size], className)}
    />
  );
};

const sizeMap: Record<NonNullable<LogoProps["size"]>, string> = {
  xs: "h-6 w-auto",
  sm: "h-8 w-auto",
  md: "h-10 w-auto",
  lg: "h-12 w-auto",
  xl: "h-16 w-auto",
  "2xl": "h-20 w-auto",
};

export default Logo;

interface LogoProps {
  /**
   * Size preset for the logo
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  /**
   * Additional className for custom styling
   */
  className?: string;
  /**
   * Logo file path from public folder
   * @default "/logo.svg"
   */
  src?: string;
  /**
   * Alt text for the logo
   * @default "Logo"
   */
  alt?: string;
}
