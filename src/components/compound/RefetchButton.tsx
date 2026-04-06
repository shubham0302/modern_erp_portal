import { RefreshCcw } from "lucide-react";
import { Button, type ButtonProps } from "../base/Button";
import Tooltip from "./Tooltip";
import { useState } from "react";

type RefetchButtonProps = ButtonProps & {
  onRefetch: () => void;
};

const RefetchButton: React.FC<RefetchButtonProps> = (props) => {
  const { onRefetch, color = "neutral" } = props;

  const [loading, setLoading] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const handleClick = async () => {
    if (loading) return;

    setLoading(true);
    setFinishing(false);

    const start = Date.now();

    try {
      await onRefetch();
    } finally {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 600 - elapsed);

      setTimeout(() => {
        setLoading(false);
        setFinishing(true);

        // remove finishing class after animation ends
        setTimeout(() => setFinishing(false), 600);
      }, remaining);
    }
  };

  return (
    <Tooltip content="Refetch">
      <Button onClick={handleClick} color={color} {...props}>
        <RefreshCcw
          size={14}
          className={loading ? "rotate" : finishing ? "rotate-once" : ""}
        />
      </Button>
    </Tooltip>
  );
};

export default RefetchButton;
