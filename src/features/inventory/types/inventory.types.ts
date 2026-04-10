export type Finish = "matt" | "glossy";

export type GlossySeries = "GL" | "EL" | "PN";
export type MattSeries = "SF" | "WF" | "TZ" | "PF";
export type Series = GlossySeries | MattSeries;

export type SizeKey =
  | "40x40"
  | "25x40"
  | "50x50"
  | "30x60"
  | "60x60"
  | "60x120";

export interface Batch {
  id: string;
  size: SizeKey;
  finish: Finish;
  series: Series;
  designCode: string;
  boxes: number;
  createdAt: string;
}
