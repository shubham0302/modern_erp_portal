import { cn } from "@/utils/helpers";
import { useEffect, useState, memo } from "react";

interface AwaitingStoreAcceptanceProps {
  order: {
    status: string;
    updatedAt: number; // timestamp in milliseconds
  };
  className?: string;
}

const AwaitingStoreAcceptance = memo(
  ({ order, className = "" }: AwaitingStoreAcceptanceProps) => {
    const [showIndicator, setShowIndicator] = useState(false);

    useEffect(() => {
      // Early return if status is not payment_confirmed
      if (order.status !== "payment_confirmed") {
        setShowIndicator(false);
        return;
      }

      // Function to check if we should show the indicator
      const checkTimeElapsed = () => {
        const twoMinutesInMs = 2 * 60 * 1000;
        const timeElapsed = Date.now() - order.updatedAt;
        setShowIndicator(timeElapsed > twoMinutesInMs);
      };

      // Check immediately on mount/status change
      checkTimeElapsed();

      // Set up interval to check every second
      const intervalId = setInterval(checkTimeElapsed, 1000);

      // Cleanup interval on unmount or when dependencies change
      return () => clearInterval(intervalId);
    }, [order.status, order.updatedAt]);

    // Don't render anything if indicator shouldn't be shown
    if (!showIndicator) {
      return null;
    }

    return (
      <span className={cn(`relative flex h-3 w-3`, className)}>
        <span className="bg-dl-500 dark:bg-dd-500 absolute -inset-[6px] inline-flex animate-ping rounded-full opacity-75"></span>
        <span className="bg-dl-500 dark:bg-dd-500 relative inline-flex h-3 w-3 rounded-full"></span>
      </span>
    );
  },
);

AwaitingStoreAcceptance.displayName = "AwaitingStoreAcceptance";

export default AwaitingStoreAcceptance;
