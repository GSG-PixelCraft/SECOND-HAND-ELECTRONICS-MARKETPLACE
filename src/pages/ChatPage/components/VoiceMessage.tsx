import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause } from "lucide-react";

type Props = {
  audioUrl: string;
};

export default function VoiceMessage({ audioUrl }: Props) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    const waveSurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "var(--neutral-300)",
      progressColor: "var(--primary)",
      barWidth: 5,
      barGap: 2,
      barRadius: 2,
      height: 80,
      cursorWidth: 0,
    });

    waveSurfer.load(audioUrl);

    waveSurfer.on("finish", () => {
      setIsPlaying(false);
    });

    waveSurferRef.current = waveSurfer;

    return () => {
      waveSurfer.destroy();
    };
  }, [audioUrl]);

  const togglePlay = () => {
    waveSurferRef.current?.playPause();
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-100 p-3">
      <button
        onClick={togglePlay}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>

      <div ref={waveformRef} className="flex-1" />
    </div>
  );
}
