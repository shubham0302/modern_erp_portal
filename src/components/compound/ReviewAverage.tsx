import type { AverageRating } from "@/types/general.types";
import { Star } from "lucide-react";

interface ReviewAverageProps {
  data: AverageRating | undefined;
  isLoading: boolean;
}

const ReviewAverage: React.FC<ReviewAverageProps> = (props) => {
  const { data, isLoading } = props;
  const { averageRating, totalRatings } = data || {};

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <div className="fall bg-nl-50/50 dark:bg-nd-600 flex-col gap-2 rounded-xl p-4">
      <div className="flex items-center gap-1">
        <h4 className="text-nl-800 dark:text-nd-100 font-semibold">
          {" "}
          {averageRating ?? 0}{" "}
        </h4>
        <Star className="fill-t-amber text-t-amber dark:fill-t-yellow dark:text-t-yellow" />
      </div>
      {totalRatings !== undefined && totalRatings > 0 && (
        <p className="text-nl-500 dark:text-nd-300">
          Based on {totalRatings} ratings
        </p>
      )}
    </div>
  );
};

export default ReviewAverage;

const Skeleton = () => <div className="shimmer h-[88px] w-full rounded-xl" />;
