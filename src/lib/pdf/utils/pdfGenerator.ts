import { pdf } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import type { PDFGenerateOptions } from "../types/pdf.types";

/**
 * Generate and download a PDF from a React PDF Document component
 */
export const generateAndDownloadPDF = async (
  document: ReactElement,
  options: PDFGenerateOptions,
): Promise<void> => {
  try {
    // Generate PDF blob
    const blob = await pdf(document as any).toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `${options.fileName}.pdf`;

    // Trigger download
    window.document.body.appendChild(link);
    link.click();

    // Cleanup
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Success callback
    options.onSuccess?.();
  } catch (error) {
    console.error("PDF generation error:", error);
    options.onError?.(
      error instanceof Error ? error : new Error("PDF generation failed"),
    );
  }
};

/**
 * Generate PDF blob (for preview)
 */
export const generatePDFBlob = async (
  document: ReactElement,
): Promise<Blob> => {
  return await pdf(document as any).toBlob();
};

/**
 * Generate PDF data URL (for embedding)
 */
export const generatePDFDataURL = async (
  document: ReactElement,
): Promise<string> => {
  const blob = await generatePDFBlob(document);
  return URL.createObjectURL(blob);
};
