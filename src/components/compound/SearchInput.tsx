import { useEffect, type Dispatch, type SetStateAction } from "react";
import { Input } from "../base/Input";
import { SearchIcon, X } from "lucide-react";
import { IconButton } from "../base/IconButton";

interface SearchInputProps {
  defaultVal?: string;
  val: string;
  setVal: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  onClear?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = (props) => {
  const { setVal, val, defaultVal, placeholder, onClear } = props;

  useEffect(() => {
    if (defaultVal && defaultVal.trim().length > 0) {
      setVal(defaultVal);
    }
  }, []);

  const handleClear = () => {
    if (val && val.trim().length > 0) {
      setVal("");
      onClear?.();
    }
  };

  return (
    <Input
      leftElement={<SearchIcon size={16} strokeWidth={1} />}
      placeholder={placeholder || "Search"}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      rightElement={
        Boolean(val) ? (
          <IconButton icon={X} size={"xs"} onClick={handleClear} />
        ) : (
          <>
            <div className="block size-6" />
          </>
        )
      }
    />
  );
};

export default SearchInput;
