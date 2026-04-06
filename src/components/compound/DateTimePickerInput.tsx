import { useToggle } from "@/hooks/useToggle";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Clock5 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import "react-day-picker/style.css";
import { Input } from "../base/Input";
import { Popover } from "./Popover";
import ErrorText from "../base/ErrorText";
import { cn } from "@/utils/helpers";
import { DatePicker, type DisabledDate } from "./DatePicker";

dayjs.extend(customParseFormat);

type DateTimePickerInputProps = {
  value?: number;
  onChange?: (epoch: number) => void;
  placeholder?: string;
  dateFormat?: string;
  disabled?: DisabledDate;
  disablePastDates?: boolean;
  className?: string;
  wrapperClassName?: string;
  label?: string;
  error?: string;
  fullWidth?: boolean;
};

const DateTimePickerInput: React.FC<DateTimePickerInputProps> = ({
  value,
  onChange,
  placeholder = "Select date & time",
  dateFormat = "DD/MM/YYYY",
  disabled,
  disablePastDates = false,
  className = "",
  wrapperClassName = "",
  label = "",
  error = "",
  fullWidth = false,
}) => {
  // Helper functions defined first
  const getDatePortionEpoch = (epoch: number): number => {
    const d = new Date(epoch);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const formatTime12Hour = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");

    return `${hh}:${mm} ${ampm}`;
  };

  const mergeDateTime = (dateMs: number, timeMs: number): number => {
    const dateObj = new Date(dateMs);
    const timeObj = new Date(timeMs);

    // Extract date portion from dateMs (zero out time)
    dateObj.setHours(0, 0, 0, 0);

    // Add time portion from timeMs
    dateObj.setHours(timeObj.getHours(), timeObj.getMinutes(), 0, 0);

    return dateObj.getTime();
  };

  const formatCombinedValue = (epoch: number): string => {
    const dateStr = dayjs(epoch).format(dateFormat);
    const timeStr = formatTime12Hour(new Date(epoch));
    return `${dateStr} ${timeStr}`;
  };

  // State management
  const [inputValue, setInputValue] = useState<string>("");
  const [dateEpoch, setDateEpoch] = useState<number>(
    getDatePortionEpoch(value ?? Date.now()),
  );
  const [timeEpoch, setTimeEpoch] = useState<number>(value ?? Date.now());
  const { isOpen, toggle, close } = useToggle();
  const inputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  // Sync with prop changes
  useEffect(() => {
    const currentValue = value ?? Date.now();

    const dateFormatted = dayjs(currentValue).format(dateFormat);
    const timeFormatted = formatTime12Hour(new Date(currentValue));
    setInputValue(`${dateFormatted} ${timeFormatted}`);

    setDateEpoch(getDatePortionEpoch(currentValue));
    setTimeEpoch(currentValue);
  }, [value, dateFormat]);

  // Date selection handler
  const handleDateSelect = (date?: Date) => {
    if (!date) {
      close();
      return;
    }

    const selectedDateEpoch = date.getTime();
    setDateEpoch(selectedDateEpoch);

    // Merge with existing time (always valid)
    const mergedEpoch = mergeDateTime(selectedDateEpoch, timeEpoch);
    setInputValue(formatCombinedValue(mergedEpoch));
    onChange?.(mergedEpoch);
    close();
  };

  // Time selection handler
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeStr = e.target.value; // Format: "HH:MM"

    if (!timeStr) return;

    // Parse time string (24-hour format from native input)
    const [hh, mm] = timeStr.split(":").map(Number);
    const timeDate = new Date(dateEpoch);
    timeDate.setHours(hh, mm, 0, 0);
    const newTimeEpoch = timeDate.getTime();
    setTimeEpoch(newTimeEpoch);

    // Merge with existing date (always valid)
    const mergedEpoch = mergeDateTime(dateEpoch, newTimeEpoch);

    setInputValue(formatCombinedValue(mergedEpoch));
    onChange?.(mergedEpoch);
  };

  // Manual input parsing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // Try to parse combined format: "DD/MM/YYYY hh:mm A" (12-hour with AM/PM)
    const combinedFormat = `${dateFormat} hh:mm A`;
    const parsed = dayjs(val, combinedFormat, true);

    if (parsed.isValid()) {
      const epoch = parsed.valueOf();
      setDateEpoch(getDatePortionEpoch(epoch));
      setTimeEpoch(epoch);
      onChange?.(epoch);
    }
    // If invalid, keep displaying what user typed but don't update epoch
  };

  return (
    <div className={cn("relative", fullWidth && "w-full", wrapperClassName)}>
      {/* Main visible input */}
      <Input
        ref={inputRef}
        label={label}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={className}
        rightElementClassname="pr-0"
        rightElement={
          <div
            className="input-icon-container cursor-pointer"
            onClick={() => toggle()}
          >
            <Clock5 size={16} />
          </div>
        }
      />

      {/* Combined Calendar & Time Popover */}
      <Popover
        trigger={<span className="sr-only absolute right-0 bottom-0" />}
        isOpen={isOpen}
        onOpenChange={toggle}
        side="bottom"
        sideOffset={4}
        className="p-0"
      >
        <div className="flex flex-row gap-4 p-4">
          {/* Calendar Section */}
          <div className="flex-shrink-0">
            <DatePicker
              selected={dateEpoch ? new Date(dateEpoch) : undefined}
              onSelect={handleDateSelect}
              disabled={disabled}
              disablePastDates={disablePastDates}
            />
          </div>

          {/* Time Picker Section */}
          <div className="flex flex-col justify-center gap-2 border-l border-nl-200 dark:border-nd-500 pl-4">
            <p className="text-sm font-medium text-nl-700 dark:text-nd-200">
              Select Time
            </p>
            <input
              ref={timeInputRef}
              type="time"
              step={300}
              value={
                timeEpoch
                  ? `${String(new Date(timeEpoch).getHours()).padStart(2, "0")}:${String(new Date(timeEpoch).getMinutes()).padStart(2, "0")}`
                  : ""
              }
              onChange={handleTimeChange}
              className="rounded-lg border border-nl-200 dark:border-nd-500 bg-white dark:bg-nd-800 px-3 py-2 text-nl-800 dark:text-nd-100 focus:outline-none focus:ring-2 focus:ring-pl-500 dark:focus:ring-pd-400"
            />
          </div>
        </div>
      </Popover>

      {/* Error text */}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};

export default DateTimePickerInput;
