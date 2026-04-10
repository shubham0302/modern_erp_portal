import type {
  Finish,
  GlossySeries,
  MattSeries,
  Series,
  SizeKey,
} from "../types/inventory.types";

export const SIZES: SizeKey[] = [
  "40x40",
  "25x40",
  "50x50",
  "30x60",
  "60x60",
  "60x120",
];

export const FINISHES: { value: Finish; label: string }[] = [
  { value: "glossy", label: "Glossy Finish" },
  { value: "matt", label: "Matt Finish" },
];

export const FINISH_SERIES_MAP: {
  glossy: GlossySeries[];
  matt: MattSeries[];
} = {
  glossy: ["GL", "EL", "PN"],
  matt: ["SF", "WF", "TZ", "PF"],
};

export const DESIGN_CODES: string[] = [
  "4001",
  "4002",
  "4003",
  "5001",
  "5002",
  "5003",
];

export const isValidSize = (value: string): value is SizeKey =>
  (SIZES as string[]).includes(value);

export const getSeriesForFinish = (finish: Finish): Series[] =>
  FINISH_SERIES_MAP[finish];

export const formatSize = (size: SizeKey): string => size.replace("x", "×");
