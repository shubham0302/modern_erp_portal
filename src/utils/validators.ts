import z from "zod";

export const selectZodSchema = <T extends string = string>(
  requireMessage?: string,
) =>
  z.object({
    label: z.string().min(1, requireMessage || "Required"),
    value: z.custom<T>((val) => typeof val === "string" && val.length > 0, {
      message: requireMessage || "Required",
    }),
  });

export const phoneSchema = z
  .string()
  .refine((val) => /^[6-9]\d{9}$/.test(val), {
    message: "Mobile number must be exactly 10 digits and start with 6-9",
  });

export const passwordSchema = z.string().min(1, "Password is required");

export const paginationSearchParams = z.object({
  currentPage: z.number().optional(),
  pageSize: z.number().optional(),
});

export const searchWithPaginationSearchParams = z.object({
  currentPage: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  isAscending: z.boolean().optional(),
  sortByField: z.string().optional(),
});

// Video upload validation
export const VIDEO_MAX_SIZE_MB = 50;
export const VIDEO_MAX_SIZE_BYTES = VIDEO_MAX_SIZE_MB * 1024 * 1024;

export const ACCEPTED_VIDEO_FORMATS = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

export function validateVideoFile(
  file: File,
): { valid: boolean; error?: string } {
  if (!ACCEPTED_VIDEO_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid video format. Accepted formats: MP4, WebM, OGG, MOV",
    };
  }

  if (file.size > VIDEO_MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: `Video file size exceeds ${VIDEO_MAX_SIZE_MB}MB limit`,
    };
  }

  return { valid: true };
}
