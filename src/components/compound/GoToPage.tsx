import { Input } from "@/components/base/Input";
import { IconButton } from "@/components/base/IconButton";
import { cn } from "@/utils/helpers";
import { useRouter } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";

export interface GoToPageProps {
  maxPages: number;
  className?: string;
}

const GoToPage: React.FC<GoToPageProps> = ({ maxPages, className }) => {
  const router = useRouter();
  const [pageInput, setPageInput] = useState<string>("");

  const isValidPage = () => {
    const pageNum = Number(pageInput);
    return pageInput !== "" && pageNum >= 1 && pageNum <= maxPages;
  };

  const handleGoToPage = () => {
    if (!isValidPage()) return;

    const targetPage = Number(pageInput);
    router.navigate({
      search: {
        ...router.state.location.search,
        currentPage: targetPage,
      } as any,
    });

    setPageInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGoToPage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or valid numbers
    if (value === "" || /^\d+$/.test(value)) {
      setPageInput(value);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Input
        type="text"
        inputMode="numeric"
        value={pageInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Go to"
        inputSize="sm"
        variant="filled"
        className="p-2"
        containerClassName="w-20"
        rightElement={
          <IconButton
            icon={ArrowRight}
            onClick={handleGoToPage}
            disabled={!isValidPage()}
            disableHoverBg
            className={cn(
              "transition-all",
              !isValidPage() && "cursor-not-allowed opacity-50",
            )}
            strokeWidth={1.6}
          />
        }
        rightElementClassname="pr-1"
      />
    </div>
  );
};

export default GoToPage;
