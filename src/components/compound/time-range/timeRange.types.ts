export interface TimeRange {
  startDate: number;
  endDate: number;
}

export enum PresetRange {
  UPCOMING_DAY = "upcoming_day",
  UPCOMING_3_DAYS = "upcoming_3_days",
  UPCOMING_WEEK = "upcoming_week",
  UPCOMING_MONTH = "upcoming_month",
  TODAY = "today",
  YESTERDAY = "yesterday",
  LAST_24_HOURS = "last_24_hours",
  LAST_3_DAYS = "last_3_days",
  LAST_WEEK = "last_week",
  LAST_MONTH = "last_month",
  LAST_3_MONTHS = "last_3_months",
  CUSTOM = "custom",
}
