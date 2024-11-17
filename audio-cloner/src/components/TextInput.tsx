import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent } from "react";

const TextInput = ({
  inputText,
  onTextChange,
  isProcessing,
}: {
  inputText: string;
  onTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isProcessing: boolean;
}) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        2. Enter Text to Convert
      </label>
      <Textarea
        placeholder="Type your text here... (max 500 characters)"
        value={inputText}
        onChange={onTextChange}
        className="min-h-[120px]"
        disabled={isProcessing}
      />
      <p className="text-sm text-gray-500 text-right">
        {inputText.length}/500 characters
      </p>
    </div>
  );
};

export default TextInput;
