import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  PhoneIncoming,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

interface VoiceCallModalProps {
  isOpen: boolean;
  sellerName: string;
  avatarUrl?: string;
  isIncoming?: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onToggleMic?: (muted: boolean) => void;
  onToggleSpeaker?: (enabled: boolean) => void;
  onEndCall: () => void;
}

export default function VoiceCallModal({
  isOpen,
  sellerName,
  avatarUrl,
  isIncoming = true,
  onAccept,
  onDecline,
  onToggleMic,
  onToggleSpeaker,
  onEndCall,
}: VoiceCallModalProps) {
  const { t } = useTranslation();
  const [seconds, setSeconds] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  useEffect(() => {
    if (!isOpen || isIncoming) return;
    setSeconds(0);
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isOpen, isIncoming]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((s % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={() => isIncoming && onDecline()}
    >
      <div
        className="border-border mx-4 w-full max-w-md rounded-3xl border bg-white shadow-2xl transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex min-h-[340px] flex-col items-center justify-center space-y-10 px-8 py-12">
          <div className="relative">
            <div className="h-28 w-28 rounded-full border-4 border-primary/20 shadow-lg">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={sellerName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-5xl font-medium text-muted-foreground">
                  {sellerName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {isIncoming && (
              <div className="absolute inset-0 animate-ping rounded-full border-4 border-primary opacity-30" />
            )}
          </div>

          <div className="text-center">
            <h3 className="text-foreground text-2xl font-semibold">
              {sellerName}
            </h3>
            <p className="mt-2 text-lg text-muted-foreground">
              {isIncoming ? t("chat.call.isCalling") : formatTime(seconds)}
            </p>
          </div>

          <div className="flex w-full items-center justify-center gap-12 pt-6 md:gap-16">
            {isIncoming ? (
              <>
                <button
                  type="button"
                  onClick={onDecline}
                  className="group flex flex-col items-center gap-3"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error shadow-lg transition-transform">
                    <X className="h-8 w-8 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="group-hover:text-foreground text-sm text-muted-foreground">
                    {t("chat.common.decline")}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onAccept}
                  className="group flex flex-col items-center gap-3"
                >
                  <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-success shadow-xl transition-transform">
                    <PhoneIncoming className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-sm font-medium text-success group-hover:text-success/90">
                    {t("chat.common.accept")}
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    const next = !isSpeakerOn;
                    setIsSpeakerOn(next);
                    onToggleSpeaker?.(next);
                  }}
                  className={`flex flex-col items-center gap-3 ${isSpeakerOn ? "text-primary" : "text-muted-foreground"}`}
                >
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full ${
                      isSpeakerOn ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    {isSpeakerOn ? (
                      <Volume2 className="h-8 w-8" />
                    ) : (
                      <VolumeX className="h-8 w-8" />
                    )}
                  </div>
                  <span className="text-sm">
                    {t(
                      isSpeakerOn
                        ? "chat.call.speaker"
                        : "chat.call.muteSpeaker",
                    )}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = !isMicMuted;
                    setIsMicMuted(next);
                    onToggleMic?.(next);
                  }}
                  className={`flex flex-col items-center gap-3 ${isMicMuted ? "text-error" : "text-foreground"}`}
                >
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full ${
                      isMicMuted ? "bg-error/10" : "bg-muted"
                    }`}
                  >
                    {isMicMuted ? (
                      <MicOff className="h-8 w-8" />
                    ) : (
                      <Mic className="h-8 w-8" />
                    )}
                  </div>
                  <span className="text-sm">
                    {t(isMicMuted ? "chat.call.unmute" : "chat.call.mute")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onEndCall}
                  className="group flex flex-col items-center gap-3"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error shadow-xl transition-transform">
                    <PhoneOff
                      className="h-8 w-8 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <span className="text-sm font-medium text-error">
                    {t("chat.call.end")}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
