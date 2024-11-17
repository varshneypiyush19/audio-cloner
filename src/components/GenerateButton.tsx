import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const GenerateButton = ({
  onClick,
  isProcessing,
  isDisabled,
}: {
  onClick: () => void;
  isProcessing: boolean;
  isDisabled: boolean;
}) => {
  return (
    <Button className="w-full h-12" onClick={onClick} disabled={isDisabled}>
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        "3. Generate Voice"
      )}
    </Button>
  );
};

export default GenerateButton;
