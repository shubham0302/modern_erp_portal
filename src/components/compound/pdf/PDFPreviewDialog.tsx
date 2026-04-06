import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import Dialog from "../Dialog";
import { Button } from "@/components/base/Button";
import { generateAndDownloadPDF, generatePDFDataURL } from "@/lib/pdf";
import { toast } from "../Sonner";

interface PDFPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: ReactElement;
  fileName: string;
}

export const PDFPreviewDialog = ({
  isOpen,
  onClose,
  document,
  fileName,
}: PDFPreviewDialogProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !previewUrl && !isGenerating) {
      generatePreview();
    }

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [isOpen]);

  const generatePreview = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const url = await generatePDFDataURL(document);
      setPreviewUrl(url);
    } catch (err) {
      console.error("PDF preview generation error:", err);
      setError("Failed to generate PDF preview. Please try again.");
      toast.error("Failed to generate PDF preview");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    await generateAndDownloadPDF(document, {
      fileName,
      onSuccess: () => {
        toast.success("Invoice downloaded successfully!");
        onClose();
      },
      onError: (error) => {
        toast.error(`Failed to download invoice: ${error.message}`);
      },
    });

    setIsDownloading(false);
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      close={handleClose}
      size="full"
      title="Invoice Preview"
      actions={{
        secondary: {
          label: "Close",
          onClick: handleClose,
          disabled: isDownloading,
          variant: "outline",
          color: "neutral",
        },
        primary: {
          label: "Download PDF",
          onClick: handleDownload,
          loading: isDownloading,
          disabled: isGenerating || !!error,
          startIcon: "Download",
          variant: "filled",
          color: "primary",
        },
      }}
    >
      {/* Preview Content */}
      <div className="flex min-h-[70vh] items-center justify-center overflow-auto bg-nl-100 p-6 dark:bg-nd-900">
        {isGenerating && (
          <div className="flex flex-col items-center gap-4">
            <div className="shimmer h-12 w-12 rounded-full" />
            <p className="text-nl-600 dark:text-nd-300">
              Generating invoice preview...
            </p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-dl-100 p-6 dark:bg-dd-900">
              <p className="text-center text-dl-600 dark:text-dd-400">{error}</p>
            </div>
            <Button variant="outline" color="primary" onClick={generatePreview}>
              Retry
            </Button>
          </div>
        )}

        {previewUrl && !isGenerating && !error && (
          <iframe
            src={previewUrl}
            className="h-full w-full min-h-[70vh] rounded-xl border border-nl-200 bg-white shadow-lg dark:border-nd-700"
            title="PDF Preview"
          />
        )}
      </div>
    </Dialog>
  );
};
