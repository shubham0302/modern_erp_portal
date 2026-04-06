import { StyleSheet } from "@react-pdf/renderer";

// PDF Theme Colors (using light theme for better printing)
export const pdfColors = {
  // Primary
  primary: "#3b82f6", // pl-600
  primaryDark: "#2563eb", // pl-700
  primaryLight: "#dbeafe", // pl-100

  // Neutral
  text: "#1e293b", // nl-800
  textSecondary: "#475569", // nl-600
  textMuted: "#64748b", // nl-500
  border: "#e2e8f0", // nl-200
  borderDark: "#cbd5e1", // nl-300
  background: "#ffffff",
  backgroundAlt: "#f8fafc", // nl-50
  backgroundGray: "#f1f5f9", // nl-100

  // Semantic
  success: "#008236", // sl-500
  successBg: "#dcfce7", // sl-100
  danger: "#ef4444", // dl-500
  dangerBg: "#fee2e2", // dl-100
  warning: "#f59e0b",
  warningBg: "#fef3c7",
};

// Base PDF Styles
export const basePdfStyles = StyleSheet.create({
  // Page
  page: {
    padding: 40,
    backgroundColor: pdfColors.background,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: pdfColors.text,
  },

  // Typography
  h1: {
    fontSize: 24,
    fontWeight: "bold",
    color: pdfColors.text,
    marginBottom: 8,
  },
  h2: {
    fontSize: 18,
    fontWeight: "bold",
    color: pdfColors.text,
    marginBottom: 6,
  },
  h3: {
    fontSize: 14,
    fontWeight: "bold",
    color: pdfColors.text,
    marginBottom: 4,
  },
  h4: {
    fontSize: 12,
    fontWeight: "bold",
    color: pdfColors.text,
    marginBottom: 4,
  },
  body: {
    fontSize: 10,
    color: pdfColors.text,
    lineHeight: 1.5,
  },
  small: {
    fontSize: 8,
    color: pdfColors.textMuted,
    lineHeight: 1.4,
  },
  muted: {
    color: pdfColors.textMuted,
  },
  bold: {
    fontWeight: "bold",
  },

  // Layout
  section: {
    marginBottom: 16,
  },
  sectionLarge: {
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flexDirection: "column",
  },
  flex1: {
    flex: 1,
  },
  gap4: {
    gap: 4,
  },
  gap8: {
    gap: 8,
  },
  gap12: {
    gap: 12,
  },

  // Card/Container
  card: {
    backgroundColor: pdfColors.backgroundAlt,
    padding: 12,
    borderRadius: 8,
    border: `1pt solid ${pdfColors.border}`,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: pdfColors.border,
    marginVertical: 12,
  },
  dividerDark: {
    height: 1,
    backgroundColor: pdfColors.borderDark,
    marginVertical: 12,
  },

  // Badge
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  badgeSuccess: {
    backgroundColor: pdfColors.successBg,
    color: pdfColors.success,
  },
  badgeDanger: {
    backgroundColor: pdfColors.dangerBg,
    color: pdfColors.danger,
  },
  badgeWarning: {
    backgroundColor: pdfColors.warningBg,
    color: pdfColors.warning,
  },
  badgePrimary: {
    backgroundColor: pdfColors.primaryLight,
    color: pdfColors.primaryDark,
  },

  // Table
  table: {
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: pdfColors.backgroundGray,
    borderBottom: `2pt solid ${pdfColors.borderDark}`,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontWeight: "bold",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: `1pt solid ${pdfColors.border}`,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRowAlt: {
    flexDirection: "row",
    backgroundColor: pdfColors.backgroundAlt,
    borderBottom: `1pt solid ${pdfColors.border}`,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableCell: {
    fontSize: 9,
    lineHeight: 1.4,
  },
  tableCellBold: {
    fontSize: 9,
    fontWeight: "bold",
  },

  // Alignment
  textLeft: {
    textAlign: "left",
  },
  textCenter: {
    textAlign: "center",
  },
  textRight: {
    textAlign: "right",
  },

  // Spacing
  mb4: {
    marginBottom: 4,
  },
  mb8: {
    marginBottom: 8,
  },
  mb12: {
    marginBottom: 12,
  },
  mb16: {
    marginBottom: 16,
  },
  mt4: {
    marginTop: 4,
  },
  mt8: {
    marginTop: 8,
  },
  mt12: {
    marginTop: 12,
  },
  mt16: {
    marginTop: 16,
  },

  // Padding
  p8: {
    padding: 8,
  },
  p12: {
    padding: 12,
  },
  p16: {
    padding: 16,
  },
});
