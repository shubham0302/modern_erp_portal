import { Text, View } from "@react-pdf/renderer";
import type { PDFTableProps } from "../types/pdf.types";
import { basePdfStyles } from "../utils/pdfStyles";

export const PDFTable = <T,>({
  columns,
  data,
  showHeader = true,
}: PDFTableProps<T>) => {
  const getCellValue = (row: T, column: PDFTableProps<T>["columns"][0]) => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }
    return row[column.accessor];
  };

  const getCellStyle = (column: PDFTableProps<T>["columns"][0]) => {
    const styles: any[] = [basePdfStyles.tableCell];

    // Add width or flex
    if (column.width) {
      styles.push({ width: column.width });
    } else {
      styles.push({ flex: 1 });
    }

    // Add alignment
    if (column.align === "center") {
      styles.push(basePdfStyles.textCenter);
    } else if (column.align === "right") {
      styles.push(basePdfStyles.textRight);
    } else {
      styles.push(basePdfStyles.textLeft);
    }

    return styles;
  };

  return (
    <View style={basePdfStyles.table}>
      {/* Header */}
      {showHeader && (
        <View style={basePdfStyles.tableHeader}>
          {columns.map((column, index) => (
            <Text key={index} style={getCellStyle(column)}>
              {column.header}
            </Text>
          ))}
        </View>
      )}

      {/* Rows */}
      {data.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={rowIndex % 2 === 0 ? basePdfStyles.tableRow : basePdfStyles.tableRowAlt}
        >
          {columns.map((column, colIndex) => {
            const value = getCellValue(row, column);
            return (
              <View key={colIndex} style={getCellStyle(column)}>
                {typeof value === "string" || typeof value === "number" ? (
                  <Text>{String(value)}</Text>
                ) : (
                  value as any
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};
