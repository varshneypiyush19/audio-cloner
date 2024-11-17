import { Button } from "@/components/ui/button";
import { Upload, Volume2, Play } from "lucide-react";
import { ChangeEvent, useRef } from "react";

const FileUpload = ({
  uploadedFile,
  onFileUpload,
  isProcessing,
  onPlayAudio,
}: {
  uploadedFile: string;
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
  onPlayAudio: (audioUrl: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  return (
    <div className='space-y-4'>
      <label className='block text-sm font-medium text-gray-700'>
        1. Upload Voice Sample
      </label>
      <div className='flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white'>
        <Button
          variant='outline'
          className='mb-2'
          onClick={handleClick}
          disabled={isProcessing}>
          <Upload className='w-4 h-4 mr-2' />
          {isProcessing ? "Uploading..." : uploadedFile ? "Change File" : "Choose File"}
        </Button>
        <input
          ref={fileInputRef}
          type='file'
          accept='audio/*'
          className='hidden'
          onChange={onFileUpload}
          disabled={isProcessing}
        />
        {uploadedFile && (
          <div className='flex items-center gap-2 mt-2'>
            <div className='flex items-center text-sm text-gray-600'>
              <Volume2 className='w-4 h-4 mr-2 text-green-500' />
              {uploadedFile.split("/").pop()}
            </div>
            <Button variant='outline' onClick={() => onPlayAudio(uploadedFile)}>
              <Play className='w-4 h-4 mr-2' />
              Play
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
