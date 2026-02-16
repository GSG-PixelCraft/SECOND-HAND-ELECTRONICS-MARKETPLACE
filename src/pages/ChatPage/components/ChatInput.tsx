// import {
//   Send,
//   Paperclip,
//   Mic,
//   Camera,
//   Video,
//   GalleryThumbnailsIcon,
//   LocateIcon,
//   File,
// } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { useTranslation } from "react-i18next";
// import MenuItem from "./MenuItem";
// import { useEffect, useRef, useState } from "react";

// type FormValues = {
//   message: string;
// };

// export default function ChatInput() {
//   const { t } = useTranslation();
//   const { register, handleSubmit, reset } = useForm<FormValues>();
//   const [open, setOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   const onSubmit = (data: FormValues) => {
//     if (!data.message) return;
//     console.log(data.message);
//     reset();
//   };
//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="border-border relative flex flex-col items-end gap-1 border-t px-2 py-4 md:flex-row md:items-center"
//     >
//       <div className="relative flex w-full flex-1 items-center gap-1">
//         <input
//           {...register("message")}
//           placeholder={t("chat.sendMessage", "Send message")}
//           className="border-border flex-1 rounded-lg border bg-muted-10 px-4 py-2 text-body focus:outline-none focus:ring-2 focus:ring-primary-20"
//         />
//         <button
//           type="button"
//           className="absolute end-2 cursor-pointer text-neutral hover:text-primary"
//           onClick={() => setOpen(!open)}
//         >
//           <Paperclip size={18} />
//         </button>
//       </div>
//       <div className="flex items-center gap-1">
//         <button
//           type="submit"
//           className="rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary-40"
//         >
//           <Send size={18} />
//         </button>

//         <button type="button" className="text-neutral hover:text-primary">
//           <Mic size={20} />
//         </button>
//       </div>
//       {open && (
//         <div
//           ref={menuRef}
//           className="border-border absolute bottom-16 right-6 z-50 w-56 rounded-lg border bg-white shadow-md"
//         >
//           <MenuItem Icon={Camera} label={t("chat.menu.camera")} />
//           <MenuItem Icon={Video} label={t("chat.menu.video")} />
//           <MenuItem
//             Icon={GalleryThumbnailsIcon}
//             label={t("chat.menu.gallery")}
//           />
//           <MenuItem Icon={LocateIcon} label={t("chat.menu.location")} />
//           <MenuItem Icon={File} label={t("chat.menu.document")} />
//         </div>
//       )}
//     </form>
//   );
// }

import {
  Send,
  Paperclip,
  Mic,
  Camera,
  Video,
  GalleryThumbnailsIcon,
  LocateIcon,
  File,
  Square,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import MenuItem from "./MenuItem";
import { useEffect, useRef, useState } from "react";
import VoiceMessage from "./VoiceMessage";

type FormValues = {
  message: string;
};

export default function ChatInput() {
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 🎙 Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const onSubmit = (data: FormValues) => {
    if (!data.message) return;
    console.log("Text message:", data.message);
    reset();
  };

  // 🎙 Start Recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, {
        type: "audio/webm",
      });

      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      console.log("Voice message blob:", audioBlob);

      // Stop mic access
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  // 🎙 Stop Recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // 📎 Outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border relative flex flex-col items-end gap-1 border-t px-2 py-4 md:flex-row md:items-center"
    >
      <div className="relative flex w-full flex-1 items-center gap-1">
        <input
          {...register("message")}
          placeholder={t("chat.sendMessage", "Send message")}
          className="border-border flex-1 rounded-lg border bg-muted-10 px-4 py-2 text-body focus:outline-none focus:ring-2 focus:ring-primary-20"
        />

        <button
          type="button"
          className="absolute end-2 cursor-pointer text-neutral hover:text-primary"
          onClick={() => setOpen(!open)}
        >
          <Paperclip size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Send Button */}
        <button
          type="submit"
          className="rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary-40"
        >
          <Send size={18} />
        </button>

        {/* Mic Button */}
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="text-neutral hover:text-primary"
          >
            <Mic size={20} />
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="text-red-500"
          >
            <Square size={20} />
          </button>
        )}
      </div>

      {/* 🎧 Audio Preview */}
      {audioUrl && (
        <div className="mt-2 w-full">
          {/* <audio controls src={audioUrl} className="w-full" /> */}
          <VoiceMessage audioUrl={audioUrl} />
        </div>
      )}

      {open && (
        <div
          ref={menuRef}
          className="border-border absolute bottom-16 right-6 z-50 w-56 rounded-lg border bg-white shadow-md"
        >
          <MenuItem Icon={Camera} label={t("chat.menu.camera")} />
          <MenuItem Icon={Video} label={t("chat.menu.video")} />
          <MenuItem
            Icon={GalleryThumbnailsIcon}
            label={t("chat.menu.gallery")}
          />
          <MenuItem Icon={LocateIcon} label={t("chat.menu.location")} />
          <MenuItem Icon={File} label={t("chat.menu.document")} />
        </div>
      )}
    </form>
  );
}
