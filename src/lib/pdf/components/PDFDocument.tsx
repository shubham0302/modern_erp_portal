import { Document, Page, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { basePdfStyles } from "../utils/pdfStyles";

interface PDFDocumentProps {
  children: ReactNode;
  title?: string;
}

export const PDFDocument = ({ children, title }: PDFDocumentProps) => {
  return (
    <Document title={title}>
      <Page size="A4" style={basePdfStyles.page}>
        {children}
      </Page>
    </Document>
  );
};

interface PDFSectionProps {
  children: ReactNode;
  style?: any;
}

export const PDFSection = ({ children, style }: PDFSectionProps) => {
  return <View style={[basePdfStyles.section, style]}>{children}</View>;
};
