import ErrorDisplay from "@/components/ErrorDisplay";
import FileUpload from "@/components/FileUpload";
import GenerateButton from "@/components/GenerateButton";
import GeneratedAudio from "@/components/GeneratedAudio";
import TextInput from "@/components/TextInput";
import supabase from "@/lib/supabase";
import { ChangeEvent, useRef, useState } from "react";

const VoiceCloneApp = () => {
  const [uploadedFile, setUploadedFile] = useState<string>("");
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [generatedAudio, setGeneratedAudio] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setError("");

      if (file.size > 5 * 1024 * 1024) {
        setError("File is too large. Please upload a file smaller than 5MB.");
        return;
      }

      if (!file.type.startsWith("audio/")) {
        setError("Please upload an audio file (MP3, WAV, etc.).");
        return;
      }

      // Upload file to supabase
      const { data, error: uploadError } = await supabase.storage
        .from("voices")
        .upload(`${Date.now()}_${file.name}`, file, {
          upsert: false,
          contentType: file.type,
        });
      setUploadedFile(
        `https://bytpjvxugcnuzpcokria.supabase.co/storage/v1/object/public/${data?.fullPath}`
      );
      if (uploadError) {
        throw new Error("Failed to upload file");
      }

      console.log("Upload successful:", data);
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const text = event.target.value;
    setError("");

    if (text.length > 500) {
      setError("Text exceeds 500 character limit.");
      return;
    }

    setInputText(text);
  };

  const handleGenerate = async () => {
    if (!uploadedFile) {
      setError("Please upload a voice file first.");
      return;
    }

    if (!inputText.trim()) {
      setError("Please enter some text to convert.");
      return;
    }

    try {
      setIsProcessing(true);

      // Step 1: Create a voice project
      const voiceResponse = await fetch(
        "https://app.resemble.ai/api/v2/projects",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_RESEMBLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `Voice_${Date.now()}`,
            description: "Generated voice project",
          }),
        }
      );

      const projectData = await voiceResponse.json();
      if (!voiceResponse.ok) {
        throw new Error(
          projectData.message || "Failed to create voice project"
        );
      }
      const { uuid } = projectData.item;

      // Step 2: Upload voice clip to the project
      const clipResponse = await fetch(
        `https://app.resemble.ai/api/v2/projects/${uuid}/clips`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_RESEMBLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `Sample_${Date.now()}`,
            audio_url: uploadedFile,
            body: inputText,
            voice_uuid: "1dcf0222",
          }),
        }
      );

      const clipData = await clipResponse.json();
      if (!clipResponse.ok) {
        throw new Error(clipData.message || "Failed to upload voice clip");
      }

      // Store the API source URL for playback
      const audioSourceUrl = clipData.item.audio_src;
      setGeneratedAudio(audioSourceUrl);

      // Upload to Supabase for storage (but don't use this URL for playback)
      const audioResponse = await fetch(audioSourceUrl);
      const audioBlob = await audioResponse.blob();

      const audioFileName = `${Date.now()}_generated_audio.mp3`;
      const { error: uploadError } = await supabase.storage
        .from("voices")
        .upload(audioFileName, audioBlob, {
          contentType: audioBlob.type,
        });

      if (uploadError) {
        throw new Error("Failed to upload generated audio to Supabase");
      }

      console.log("Generated audio stored in Supabase");
    } catch (err) {
      setError("Failed to generate voice. Please try again.");
      console.error("Generation error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = async (generatedAudio: string) => {
    if (!audioRef.current) return;

    try {
      // Check if the URL is valid
      if (!generatedAudio) {
        throw new Error("No audio URL provided");
      }

      // Try to load the audio first
      const response = await fetch(generatedAudio);
      if (!response.ok) {
        throw new Error("Failed to load audio file");
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      audioRef.current.src = audioUrl;

      // Add error handling for the audio element
      audioRef.current.onerror = (e) => {
        console.error("Audio playback error:", e);
        setError("Failed to play audio. Please try again.");
        setIsPlaying(false);
      };

      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Audio playback error:", err);
      setError("Failed to play audio. Please try again.");
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-slate-100 dark:bg-black">
      <div className="container max-h-dvh mx-auto p-4 h-screen overflow-y-auto">
        {/* Main glassmorphism container */}
        <div className="backdrop-blur-md bg-white/80 dark:bg-white/10 p-3 sm:p-5 md:p-7 rounded-2xl shadow-lg border border-slate-200 dark:border-white/20 w-full max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-4 sm:mb-6">
            Voice Clone Studio
          </h1>

          {/* Content container */}
          <div className="space-y-4 sm:space-y-6">
            {/* Recording section */}
            <div className="backdrop-blur-sm bg-slate-50/80 dark:bg-white/5 p-3 sm:p-5 rounded-xl border border-slate-200 dark:border-white/10">
              <h2 className="text-xl sm:text-2xl font-semibold  text-slate-900 dark:text-white mb-3 sm:mb-4">
                Record Your Voice
              </h2>
              <FileUpload
                uploadedFile={uploadedFile}
                onFileUpload={handleFileUpload}
                onPlayAudio={playAudio}
                isProcessing={isProcessing}
              />
            </div>

            {/* Voice model section */}

            <TextInput
              inputText={inputText}
              onTextChange={handleTextInput}
              isProcessing={isProcessing}
            />

            {/* Actions section */}

            <GenerateButton
              onClick={handleGenerate}
              isProcessing={isProcessing}
              isDisabled={!uploadedFile || !inputText.trim()}
            />
            <GeneratedAudio
              generatedAudio={generatedAudio}
              onPlay={() => playAudio(generatedAudio)}
              onStop={stopAudio}
              isPlaying={isPlaying}
            />
            <ErrorDisplay error={error} />
          </div>
        </div>
      </div>

      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  );
};

export default VoiceCloneApp;
