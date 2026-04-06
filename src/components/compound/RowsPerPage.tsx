import {
  SingleSelect,
  type SelectOnChangeVal,
  type SelectOption,
} from "@/components/base/Select";
import { cn } from "@/utils/helpers";
import { useRouter } from "@tanstack/react-router";
import React from "react";

export interface RowsPerPageProps {
  currentPageSize: number;
  className?: string;
}

const pageSizeOptions: SelectOption<number>[] = [
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];

const RowsPerPage: React.FC<RowsPerPageProps> = ({
  currentPageSize,
  className,
}) => {
  const router = useRouter();

  const selectedOption =
    pageSizeOptions.find((opt) => opt.value === currentPageSize) ||
    pageSizeOptions[0];

  const handlePageSizeChange = (value: SelectOnChangeVal<number>) => {
    // For SingleSelect, value will be SelectOption | null
    const option = value as SelectOption<number> | null;
    if (!option) return;

    router.navigate({
      replace: true,
      search: {
        ...router.state.location.search,
        pageSize: option.value,
        currentPage: 1, // Reset to first page when changing page size
      } as any,
    });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-nl-600 dark:text-nd-300 text-sm">Rows:</span>
      <SingleSelect<number>
        options={pageSizeOptions}
        value={selectedOption}
        onChange={handlePageSizeChange}
        variant="default"
        width={70}
        isSearchable={false}
        isClearable={false}
        menuPlacement="top"
      />
    </div>
  );
};

export default RowsPerPage;
