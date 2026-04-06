import { Button } from "@/components/base/Button";
import type { ButtonProps } from "@/components/base/Button";

interface PDFDownloadButtonProps extends Omit<ButtonProps, "onClick"> {
  onOpenPreview?: () => void;
  onDirectDownload?: () => void;
}

export const PDFDownloadButton = ({
  onOpenPreview,
  onDirectDownload,
  children = "Download Invoice",
  variant = "outline",
  color = "primary",
  startIcon,
  ...buttonProps
}: PDFDownloadButtonProps) => {
  const handleClick = () => {
    if (onOpenPreview) {
      onOpenPreview();
    } else if (onDirectDownload) {
      onDirectDownload();
    }
  };

  return (
    <Button
      variant={variant}
      color={color}
      startIcon={startIcon}
      onClick={handleClick}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};
