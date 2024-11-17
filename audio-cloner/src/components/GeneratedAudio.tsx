import { Button } from "@/components/ui/button";
import { Play, Square, Download } from "lucide-react";

const GeneratedAudio = ({
  generatedAudio,
  onPlay,
  onStop,
  isPlaying,
}: {
  generatedAudio: string;
  onPlay: any;
  onStop: any;
  isPlaying: boolean;
}) => {
  return (
    <div className="pt-4 flex items-center justify-between border-t">
      <div className="flex justify-center items-center gap-2">
        <Button variant="outline" onClick={onPlay} disabled={isPlaying}>
          <Play className="w-4 h-4 mr-2" />
          Play Generated Voice
        </Button>
        {isPlaying && (
          <Button variant="outline" onClick={onStop}>
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
        )}
      </div>
      <Button
        variant="outline"
        className="w-full max-w-xs"
        onClick={() => {
          const a = document.createElement("a");
          a.href = generatedAudio;
          a.download = "generated-voice.wav";
          a.click();
        }}
      >
        <Download className="w-4 h-4" />
        Download Generated Voice
      </Button>
    </div>
  );
};

export default GeneratedAudio;
