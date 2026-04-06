import Label from "@/components/base/Label";

interface ColorPickerProps {
  label?: string;
  value?: string;
  onChange: (color: string) => void;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value = "#000000",
  onChange,
  className,
}) => {
  return (
    <div className={className}>
      {label && <Label className="mb-2">{label}</Label>}
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
          <div
            className="border-nl-200 dark:border-nd-600 hover:border-nl-300 dark:hover:border-nd-500 size-10 cursor-pointer rounded-xl border transition-colors"
            style={{ backgroundColor: value }}
          />
        </div>
        <span className="text-nl-600 dark:text-nd-300 font-mono text-sm">
          {value.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default ColorPicker;
