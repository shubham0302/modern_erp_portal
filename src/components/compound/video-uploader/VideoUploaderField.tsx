import { IconButton } from "@/components/base/IconButton";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAuthStore } from "@/store/useAuthStore";
import { PortalAccessUserTypeEnum } from "@/types/general.types";
import type {
  UploadMeta,
  UploadResult,
  Uploader,
} from "@/types/uploader.types";
import { formatFileSize, showErrorToasts } from "@/utils/helpers";
import { ACCEPTED_VIDEO_FORMATS, validateVideoFile } from "@/utils/validators";
import { Upload, X, XCircle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";
import { toast } from "../Sonner";

export interface VideoUploaderFieldProps {
  value?: string;
  onChange: (url: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
  maxSizeMB?: number;
  disabled?: boolean;
  acceptedFormats?: string[];
  className?: string;
  previewClassName?: string;
}

const VideoUploaderField: React.FC<VideoUploaderFieldProps> = ({
  value,
  onChange,
  error,
  label = "Video",
  required = false,
  maxSizeMB = 50,
  disabled = false,
  acceptedFormats = ACCEPTED_VIDEO_FORMATS,
  className,
  previewClassName,
}) => {
  const { uploadFile, progress, resetProgress } = useFileUpload();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const userType = useAuthStore((s) => s.user?.userType);

  const getVideoUrl = (url: string): string => {
    if (
      url.startsWith("http") ||
      url.startsWith("blob:") ||
      url.startsWith("/")
    ) {
      return url;
    }
    return `${import.meta.env.VITE_BACKEND_URL}/${url}`;
  };

  const previewUrl = useMemo(() => {
    if (uploading) return null; // Don't show preview while uploading
    if (value) return getVideoUrl(value);
    if (selectedFile) return URL.createObjectURL(selectedFile);
    return null;
  }, [value, selectedFile, uploading]);

  useEffect(() => {
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(URL.createObjectURL(selectedFile));
      }
    };
  }, [selectedFile]);

  const getUploaderType = (): Uploader => {
    switch (userType) {
      case PortalAccessUserTypeEnum.franchise_owner:
      case PortalAccessUserTypeEnum.franchise_staff:
        return "franchise";
      case PortalAccessUserTypeEnum.master_franchise_owner:
      case PortalAccessUserTypeEnum.master_franchise_staff:
        return "masterFranchise";
      case PortalAccessUserTypeEnum.staff:
      default:
        return "staff";
    }
  };

  const handleFileSelect = async (file: File) => {
    setValidationError(null);

    const validation = validateVideoFile(file);
    if (!validation.valid) {
      setValidationError(validation.error || "Invalid video file");
      return;
    }

    setSelectedFile(file);
    setUploading(true);

    try {
      const meta: UploadMeta = {
        type: "video",
        uploader: getUploaderType(),
        group: "rider-videos",
        size: file.size.toString(),
      };

      const result: UploadResult = await uploadFile(file, meta);
      onChange(result.path);
      setSelectedFile(null);
      toast.success("Video uploaded successfully");
    } catch (error) {
      showErrorToasts(error);
      setSelectedFile(null);
    } finally {
      setUploading(false);
      resetProgress();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled || uploading) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    onChange("");
    setValidationError(null);
  };

  const displayError = error || validationError;

  return (
    <div className={className}>
      {label && (
        <label className="text-nl-800 dark:text-nd-100 mb-2 block text-sm font-medium">
          {label}
          {required && (
            <span className="text-dl-500 dark:text-dd-400 ml-1">*</span>
          )}
        </label>
      )}

      {!previewUrl && (
        <label className={disabled ? "cursor-not-allowed" : "cursor-pointer"}>
          <input
            type="file"
            accept={acceptedFormats.join(",")}
            onChange={handleChange}
            disabled={disabled || uploading}
            className="sr-only"
          />
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-nl-200 dark:border-nd-500 bg-nl-50/50 dark:bg-nd-700 hover:bg-nl-100/80 hover:dark:bg-nd-600 aspect-video rounded-xl border-2 border-dashed p-8 text-center transition-all ${
              disabled || uploading ? "opacity-50" : ""
            }`}
          >
            <Upload className="text-nl-400 dark:text-nd-300 mx-auto h-12 w-12" />
            <p className="text-nl-600 dark:text-nd-200 mt-4">
              Drag & drop video here, or click to select
            </p>
            <p className="text-nl-500 dark:text-nd-300 mt-1 text-sm">
              Max {maxSizeMB}MB • MP4, WebM, OGG, MOV
            </p>
          </div>
        </label>
      )}

      {previewUrl && (
        <div className={`relative ${previewClassName || ""}`}>
          <div className="border-nl-200 dark:border-nd-600 bg-nl-900 dark:bg-nd-900 aspect-video overflow-hidden rounded-xl border-2">
            <ReactPlayer
              src={previewUrl}
              controls
              playing={false}
              width="100%"
              height="100%"
              playsInline
              onError={(error) => {
                console.error("Video player error:", error);
                setPlayerError("Failed to load video");
              }}
              onReady={() => {
                setPlayerError(null);
              }}
            />
          </div>
          {!disabled && (
            <IconButton
              icon={X}
              onClick={handleRemove}
              className="bg-nl-900/80 dark:bg-nd-800/80 hover:bg-nl-900 dark:hover:bg-nd-800 absolute top-2 right-2 backdrop-blur-sm"
              aria-label="Remove video"
            />
          )}
          {playerError && (
            <p className="text-dl-500 dark:text-dd-400 mt-2 flex items-center gap-2 text-sm">
              <XCircle className="h-4 w-4" /> {playerError}
            </p>
          )}
        </div>
      )}

      {uploading && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-nl-600 dark:text-nd-300">
              Uploading video...
            </span>
            <span className="text-nl-600 dark:text-nd-300">{progress}%</span>
          </div>
          <div className="bg-nl-200 dark:bg-nd-600 h-1.5 overflow-hidden rounded-full">
            <div
              className="bg-pl-600 dark:bg-pd-500 h-1.5 transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {selectedFile && !uploading && (
        <div className="text-nl-600 dark:text-nd-300 mt-2 text-sm">
          <p className="truncate">{selectedFile.name}</p>
          <p className="text-nl-500 dark:text-nd-400">
            {formatFileSize(selectedFile.size)}
          </p>
        </div>
      )}

      {displayError && (
        <p className="text-dl-500 dark:text-dd-400 mt-2 flex items-center gap-2 text-sm">
          <XCircle className="h-4 w-4" /> {displayError}
        </p>
      )}
    </div>
  );
};

export default VideoUploaderField;
