import { View } from "@react-pdf/renderer";
import { basePdfStyles } from "../utils/pdfStyles";

interface PDFDividerProps {
  dark?: boolean;
}

export const PDFDivider = ({ dark = false }: PDFDividerProps) => {
  return (
    <View style={dark ? basePdfStyles.dividerDark : basePdfStyles.divider} />
  );
};
