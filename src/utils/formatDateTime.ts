import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * Returns today's date range as string timestamps (start of day to end of day)
 * Useful for route redirects and default query params
 */
export const getTodayRange = () => ({
  startDate: String(dayjs().startOf("day").valueOf()),
  endDate: String(dayjs().endOf("day").valueOf()),
});

/**
 * Returns the current week's date range (Monday to Sunday) as string timestamps
 * Useful for route redirects and default query params
 */
export const getCurrentWeekRange = () => {
  const today = dayjs();
  const currentDayOfWeek = today.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Calculate days to subtract to get to Monday of current week
  // If Sunday (0), go back 6 days; if Monday (1), go back 0 days; etc.
  const daysToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

  // Get Monday of the current week
  const mondayOfCurrentWeek = today
    .subtract(daysToMonday, "day")
    .startOf("day");

  return {
    startDate: String(mondayOfCurrentWeek.valueOf()),
    endDate: String(mondayOfCurrentWeek.add(6, "day").endOf("day").valueOf()),
  };
};

/**
 * Returns the last week's date range (Monday to Sunday) as string timestamps
 * Useful for route redirects and default query params
 */
export const getLastWeekRange = () => {
  const today = dayjs();
  const currentDayOfWeek = today.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Calculate days to subtract to get to Monday of current week
  const daysToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

  // Get Monday of the current week, then go back 7 days to get Monday of last week
  const mondayOfLastWeek = today
    .subtract(daysToMonday, "day")
    .subtract(7, "day")
    .startOf("day");

  return {
    startDate: String(mondayOfLastWeek.valueOf()),
    endDate: String(mondayOfLastWeek.add(6, "day").endOf("day").valueOf()),
  };
};

/**
 * Returns the last month's date range (30 days from now) as numeric timestamps
 * Useful for fullscreen chart default time ranges
 */
export const getLastMonthRange = () => {
  const endDate = Date.now();
  const startDate = endDate - 30 * 24 * 60 * 60 * 1000; // 30 days ago
  return { startDate, endDate };
};

/**
 * Returns a human-readable relative time string (e.g., "2 minutes ago", "in 3 hours")
 * Similar to date-fns formatDistanceToNow but using dayjs
 */
export const formatDistanceToNow = (
  date: Date | string | number | null | undefined,
  options: { addSuffix?: boolean } = {},
): string => {
  const { addSuffix = true } = options;

  if (date === null || date === undefined) return "Invalid Date";

  let parsed;

  if (typeof date === "number") {
    const dateStr = date.toString();
    if (dateStr.length > 10) {
      // If timestamp has more than 13 digits, it's likely in microseconds
      if (dateStr.length > 13) {
        parsed = dayjs(date / 1000); // Convert microseconds to milliseconds
      } else {
        parsed = dayjs(date); // Already in milliseconds
      }
    } else {
      return "Epoch is not in millis or micros";
    }
  } else {
    parsed = dayjs(date);
  }

  if (!parsed.isValid()) return "Invalid Date";

  return addSuffix ? parsed.fromNow() : parsed.toNow(true);
};

type FormatOptions = {
  showDate?: boolean;
  showDay?: boolean;
  showTime?: boolean;
  showYear?: boolean;
  fallback?: string;
  disableRelativeDates?: boolean;
};

export const prettyDate = (
  date: Date | string | number | null | undefined,
  options: FormatOptions = {},
): string => {
  const {
    showDate = true,
    showDay = true,
    showTime = true,
    showYear = true,
    fallback = "Invalid Date",
    disableRelativeDates = false,
  } = options;

  if (date === null || date === undefined || date === 0) return fallback;

  let parsed;

  if (typeof date === "number") {
    const dateStr = date.toString();
    if (dateStr.length > 10) {
      // If timestamp has more than 13 digits, it's likely in microseconds
      if (dateStr.length > 13) {
        parsed = dayjs(date / 1000); // Convert microseconds to milliseconds
      } else {
        parsed = dayjs(date); // Already in milliseconds
      }
    } else {
      return "Epoch is not in millis or micros";
    }
  } else {
    parsed = dayjs(date);
  }

  if (!parsed.isValid()) return fallback;

  let datePart = "";

  // Only show relative dates if not disabled
  if (!disableRelativeDates) {
    // Check for today, tomorrow, yesterday
    const now = dayjs();
    const isToday = parsed.isSame(now, "day");
    const isTomorrow = parsed.isSame(now.add(1, "day"), "day");
    const isYesterday = parsed.isSame(now.subtract(1, "day"), "day");

    if (isToday) {
      datePart = "TODAY";
    } else if (isTomorrow) {
      datePart = "TOMORROW";
    } else if (isYesterday) {
      datePart = "YESTERDAY";
    }
  }

  // If no relative date was set or relative dates are disabled, use absolute format
  if (!datePart) {
    const parts: string[] = [];

    if (showDate) {
      parts.push("DD MMM");
    }
    if (showYear) {
      parts.push("YY");
    }

    if (showDay) {
      parts.push("(ddd)");
    }

    datePart = parsed.format(parts.join(" ")).toUpperCase();
  }

  if (showTime) {
    const timePart = parsed.format("hh:mm A");
    return `${datePart} - ${timePart}`.toUpperCase();
  }

  return datePart;
};

export const prettyDateRange = (
  start: Date | string | number | null | undefined,
  end: Date | string | number | null | undefined,
  options: FormatOptions = {},
): string => {
  const {
    showDate = false,
    showDay = false,
    showTime = true,
    fallback = "Invalid Range",
    disableRelativeDates = false,
  } = options;

  if (!start || !end) return fallback;

  const parseDate = (date: Date | string | number) => {
    if (typeof date === "number") {
      const dateStr = date.toString();
      if (dateStr.length === 10) {
        return dayjs.unix(date); // Unix timestamp in seconds
      } else if (dateStr.length > 13) {
        return dayjs(date / 1000); // Microseconds to milliseconds
      } else {
        return dayjs(date); // Already in milliseconds
      }
    }
    return dayjs(date);
  };

  const startParsed = parseDate(start);
  const endParsed = parseDate(end);

  if (!startParsed.isValid() || !endParsed.isValid()) return fallback;

  const formatTime = (d: dayjs.Dayjs) =>
    d.minute() === 0 ? d.format("hA") : d.format("h:mm A");

  // Check for common fields
  const sameYear = startParsed.year() === endParsed.year();
  const sameMonth = sameYear && startParsed.month() === endParsed.month();
  const sameDate = sameMonth && startParsed.date() === endParsed.date();

  // Check for today, tomorrow, yesterday
  const now = dayjs();
  const startIsToday = startParsed.isSame(now, "day");
  const startIsTomorrow = startParsed.isSame(now.add(1, "day"), "day");
  const startIsYesterday = startParsed.isSame(now.subtract(1, "day"), "day");
  const endIsToday = endParsed.isSame(now, "day");
  const endIsTomorrow = endParsed.isSame(now.add(1, "day"), "day");
  const endIsYesterday = endParsed.isSame(now.subtract(1, "day"), "day");

  const getRelativeDate = (
    isToday: boolean,
    isTomorrow: boolean,
    isYesterday: boolean,
  ): string => {
    if (disableRelativeDates) return "";
    if (isToday) return "TODAY";
    if (isTomorrow) return "TOMORROW";
    if (isYesterday) return "YESTERDAY";
    return "";
  };

  if (showDate || showDay) {
    const startParts: string[] = [];
    const endParts: string[] = [];
    const commonParts: string[] = [];

    // Build date format based on what's common
    if (sameDate) {
      // Same date - check for relative date
      const relativeDate = getRelativeDate(
        startIsToday,
        startIsTomorrow,
        startIsYesterday,
      );

      const dateStr =
        relativeDate ||
        (() => {
          if (showDate) startParts.push("DD MMM YY");
          if (showDay) startParts.push("(ddd)");
          return startParsed.format(startParts.join(" ")).toUpperCase();
        })();

      const timeRange = showTime
        ? `${formatTime(startParsed)} - ${formatTime(endParsed)}`
        : "";

      return [dateStr, timeRange].filter(Boolean).join(", ");
    }

    // When showing time with different dates, avoid common parts to prevent confusion
    if (showTime) {
      const startRelative = getRelativeDate(
        startIsToday,
        startIsTomorrow,
        startIsYesterday,
      );
      const endRelative = getRelativeDate(
        endIsToday,
        endIsTomorrow,
        endIsYesterday,
      );

      let startStr: string;
      let endStr: string;

      if (startRelative) {
        startStr = startRelative;
      } else {
        if (showDate) startParts.push("DD MMM YY");
        if (showDay) startParts.push("(ddd)");
        startStr = startParsed.format(startParts.join(" ")).toUpperCase();
      }

      if (endRelative) {
        endStr = endRelative;
      } else {
        if (showDate) endParts.push("DD MMM YY");
        if (showDay) endParts.push("(ddd)");
        endStr = endParsed.format(endParts.join(" ")).toUpperCase();
      }

      return `${startStr}, ${formatTime(startParsed)} - ${endStr}, ${formatTime(endParsed)}`;
    }

    // When NOT showing time, we can safely use common parts for brevity
    const startRelative = getRelativeDate(
      startIsToday,
      startIsTomorrow,
      startIsYesterday,
    );
    const endRelative = getRelativeDate(
      endIsToday,
      endIsTomorrow,
      endIsYesterday,
    );

    if (startRelative || endRelative) {
      const startStr =
        startRelative ||
        (() => {
          if (showDate) startParts.push("DD MMM YY");
          if (showDay) startParts.push("(ddd)");
          return startParsed.format(startParts.join(" ")).toUpperCase();
        })();

      const endStr =
        endRelative ||
        (() => {
          if (showDate) endParts.push("DD MMM YY");
          if (showDay) endParts.push("(ddd)");
          return endParsed.format(endParts.join(" ")).toUpperCase();
        })();

      return `${startStr} - ${endStr}`;
    }

    if (sameMonth) {
      // Same month and year - extract common month/year
      if (showDate) {
        startParts.push("DD");
        endParts.push("DD");
        commonParts.push("MMM");
      }
      if (sameYear) {
        commonParts.push("YY");
      }
      if (showDay) {
        startParts.push("(ddd)");
        endParts.push("(ddd)");
      }
    } else if (sameYear) {
      // Same year only - extract common year
      if (showDate) {
        startParts.push("DD MMM");
        endParts.push("DD MMM");
        commonParts.push("YY");
      }
      if (showDay) {
        startParts.push("(ddd)");
        endParts.push("(ddd)");
      }
    } else {
      // Different year - show full dates
      if (showDate) {
        startParts.push("DD MMM YY");
        endParts.push("DD MMM YY");
      }
      if (showDay) {
        startParts.push("(ddd)");
        endParts.push("(ddd)");
      }
    }

    const startStr = startParsed.format(startParts.join(" ")).toUpperCase();
    const endStr = endParsed.format(endParts.join(" ")).toUpperCase();
    const commonStr = commonParts.length
      ? startParsed.format(commonParts.join(" ")).toUpperCase()
      : "";

    // Build the final string (no time)
    return commonStr
      ? `${startStr} - ${endStr} ${commonStr}`
      : `${startStr} - ${endStr}`;
  }

  // Time-only format
  if (showTime) {
    return `${formatTime(startParsed)} - ${formatTime(endParsed)}`;
  }

  return fallback;
};

/**
 * Converts 24-hour time format to 12-hour format with AM/PM
 * @param time - Time string in 24-hour format (e.g., "14:30", "09:00")
 * @returns Time string in 12-hour format (e.g., "2:30 PM", "9:00 AM")
 */
export const formatTo12Hour = (time: string): string => {
  if (!time) return "";

  // Parse the time string (assuming HH:mm format)
  const [hours, minutes] = time.split(":").map(Number);

  // Create a dayjs object with the time
  const parsed = dayjs().hour(hours).minute(minutes);

  if (!parsed.isValid()) return time;

  // Format to 12-hour time with AM/PM
  return parsed.format("h:mm A");
};
