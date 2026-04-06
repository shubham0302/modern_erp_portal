import type { AppRouter } from "@/router";
import { toast } from "@/components/compound/Sonner";
import type { BaseApiErrorResponse } from "@/types/baseApi.types";
import { prettyDate } from "@/utils/formatDateTime";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const showErrorToasts = (
  err: BaseApiErrorResponse | any,
  limit?: number,
) => {
  if (Array.isArray(err.message)) {
    const messages = limit ? err.message.slice(0, limit) : err.message;
    messages.forEach((msg: string) => {
      toast.error(msg);
    });
  } else {
    toast.error(err.message || err.error || "Unknown error");
  }
};

export const showValidationErrors = (
  errors: Record<string, any>,
  limit?: number,
) => {
  const messages: { field: string; message: string }[] = [];

  const collectMessages = (err: any, path: string = "") => {
    // Skip if err is null or undefined
    if (!err) return;

    // First priority: Check if this error has a message
    if (err.message && typeof err.message === "string") {
      messages.push({
        field: path,
        message: err.message,
      });
      return; // Stop recursing once we find a message
    }

    // Second priority: Skip if ref contains a DOM element (prevents infinite recursion)
    if (err.ref && err.ref instanceof HTMLElement) return;

    if (typeof err === "object") {
      for (const [key, value] of Object.entries(err)) {
        // Skip 'ref' always, and 'type' only when it's a string (RHF error metadata, not a field named 'type')
        if (key === "ref") continue;
        if (key === "type" && typeof value === "string") continue;

        const newPath = path ? `${path}.${key}` : key;
        collectMessages(value, newPath);
      }
    }
  };

  collectMessages(errors);

  const limitedMessages = limit ? messages.slice(0, limit) : messages;

  limitedMessages.forEach(({ field, message }) => {
    const formattedField = field
      .split(".")
      .map((part) => part.replace(/([A-Z])/g, " $1").trim())
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" > ");

    toast.error(`${formattedField}: ${message}`);
  });
};

export const objectToSearchParams = (obj?: Record<string, any>): string => {
  if (!obj || typeof obj !== "object") return "";

  return new URLSearchParams(
    Object.entries(obj)
      .filter(
        ([_, v]) =>
          v !== undefined &&
          v !== null &&
          v !== "" &&
          !(typeof v === "number" && isNaN(v)),
      )
      .map(([k, v]) => [k, String(v)]),
  ).toString();
};

export const toCommaSeparated = (values: string[]): string => {
  return values.filter(Boolean).join(", ");
};

export const getFileExtension = (file: File) => {
  if (!file) return "File not found";
  const extension = file.name.split(".").pop()?.toUpperCase();
  return extension;
};

export function sendBack(router: AppRouter, fallBackRoute?: string) {
  router.history.canGoBack()
    ? router.history.back()
    : router.navigate({
        to: fallBackRoute,
      });
}

export const getResponsiveGridLayoutClass = (length: number) => {
  if (length === 1) return "grid-cols-1";
  if (length === 2) return "lg:grid-cols-2";
  if (length === 3) return "lg:grid-cols-3";
  if (length === 4) return "lg:grid-cols-2";
  return "lg:grid-cols-3";
};

export function formatCurrencyINR(
  amount: number | null | undefined,
  compact?: boolean,
): string {
  if (amount == null || typeof amount !== "number" || isNaN(amount)) {
    return "-";
  }

  // Non-compact mode (default): use full Intl formatting
  if (!compact) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(amount);
  }

  // Compact mode: Indian number system
  const absAmount = Math.abs(amount);

  let value: number;
  let suffix: string;

  if (absAmount >= 10000000) {
    // 1 crore+
    value = absAmount / 10000000;
    suffix = "Cr";
  } else if (absAmount >= 100000) {
    // 1 lakh+
    value = absAmount / 100000;
    suffix = "L";
  } else if (absAmount >= 1000) {
    // 1 thousand+
    value = absAmount / 1000;
    suffix = "K";
  } else {
    // Less than 1000: use Intl with currency symbol
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Format with appropriate decimals
  const formatted =
    value % 1 === 0 ? value.toFixed(0) : value.toFixed(value >= 10 ? 1 : 2);

  // Remove trailing zeros
  const cleaned = formatted.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");

  // Use Intl to get the currency symbol in proper format
  const currencySymbol =
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value || "₹";

  return `${amount < 0 ? "-" : ""}${currencySymbol}${cleaned}${suffix}`;
}

export function prettyPhoneNumber(phone: string) {
  if (phone === undefined) return "--";
  let digits = phone?.replace(/\D/g, "");

  if (digits.length < 10) return "Invalid phone number";

  const last10 = digits.slice(-10);
  const prefix = digits.slice(0, -10);

  const match = phone.match(/^(\D*\d{1,5})\D*\d{10}$/);
  const displayPrefix = match ? match[1].replace(/\s+/, "") : prefix;

  return (
    (displayPrefix ? displayPrefix + " " : "") +
    `${last10.slice(0, 5)} ${last10.slice(5)}`
  );
}

export function prettyNumber(
  value: number | null | undefined,
): string | undefined {
  if (value == null || typeof value !== "number" || isNaN(value)) {
    return undefined;
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);
}

export const floatingCashStatusLabelMap: Record<string, string> = {
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
};

export function formatFileSize(bytes: number | string): string {
  const numBytes = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;

  if (isNaN(numBytes) || numBytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));

  return parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}


/**
 * Triggers a file download from a Blob in the browser.
 * Appends the current date to the filename by default (e.g. "orders-11 Mar 2026.xlsx").
 * @param blob - The Blob to download
 * @param filename - The base filename including extension (e.g. "orders.xlsx")
 * @param options.includeDate - Set to false to omit the date suffix (default: true)
 */
export function downloadBlob(
  blob: Blob,
  filename: string,
  options?: { includeDate?: boolean },
): void {
  const includeDate = options?.includeDate ?? true;

  let finalFilename = filename;
  if (includeDate) {
    const dotIndex = filename.lastIndexOf(".");
    const name = dotIndex !== -1 ? filename.slice(0, dotIndex) : filename;
    const ext = dotIndex !== -1 ? filename.slice(dotIndex) : "";
    const date = prettyDate(Date.now(), { disableRelativeDates: true });
    finalFilename = `${name}-${date}${ext}`;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = finalFilename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Copies text to clipboard and shows a success toast
 * @param text - The text to copy to clipboard
 * @param options - Optional configuration
 * @param options.successMessage - Custom success message (defaults to "Copied to clipboard")
 * @param options.onSuccess - Callback function to execute after successful copy (e.g., for icon changes)
 * @returns Promise that resolves when copy is successful
 */
export const copyToClipboard = async (
  text: string,
  options?: {
    successMessage?: string;
    onSuccess?: () => void;
    dontShowToast?: boolean;
  },
): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    if (!options?.dontShowToast) {
      toast.success(options?.successMessage || "Copied to clipboard");
    }
    options?.onSuccess?.();
  } catch (error) {
    toast.error("Failed to copy to clipboard");
    console.error("Copy to clipboard failed:", error);
  }
};
