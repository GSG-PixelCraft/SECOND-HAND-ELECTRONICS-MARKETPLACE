import { useMemo, useState } from "react";
import { MoreVertical, Pin, Search } from "lucide-react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";

const avatarAhmadAli =
  "http://localhost:3845/assets/23fdb52cc83cd9a5da2b787fda4ccebfbcee347f.png";
const avatarAhmedSami =
  "http://localhost:3845/assets/e4f6648cc845ed5fbd08c0f96f7be87e74cd548a.png";
const avatarOmarAli =
  "http://localhost:3845/assets/42b9e04d2dd9dfe68de866da3f7b95ea50d48d6e.png";
const avatarMohammedSaid =
  "http://localhost:3845/assets/6228a15924c144a144b9b62a3b9568ce9304c6b9.png";
const productThumb =
  "http://localhost:3845/assets/e942fc8617157333b202f958a06fae510510ef08.png";

const tabs = ["all", "unread", "buying", "selling", "archive"] as const;

type ChatTab = (typeof tabs)[number];

interface ChatItem {
  id: string;
  name: string;
  message: string;
  time: string;
  product: string;
  avatarUrl: string;
  isOnline?: boolean;
  isPinned?: boolean;
  unreadCount?: number;
  isSelected?: boolean;
}

interface ChatsPartsProps extends HTMLAttributes<HTMLElement> {
  className?: string;
}

export function ChatsParts({ className, ...props }: ChatsPartsProps) {
  const [activeTab, setActiveTab] = useState<ChatTab>("all");

  const chatItems = useMemo<ChatItem[]>(
    () => [
      {
        id: "ahmad-ali",
        name: "Ahmad Ali",
        message: "Is it still available?",
        time: "1hr",
        product: "Canon EOS M50",
        avatarUrl: avatarAhmadAli,
        isOnline: true,
        isPinned: true,
        unreadCount: 1,
      },
      {
        id: "ahmed-sami",
        name: "Ahmed Sami",
        message: "Where can we meet?",
        time: "28m",
        product: "Dell XPS 15",
        avatarUrl: avatarAhmedSami,
        isPinned: true,
        isSelected: true,
      },
      {
        id: "omar-ali",
        name: "Omar Ali",
        message: "We can definitely meet tomorrow",
        time: "1w",
        product: "Redmi Note 12",
        avatarUrl: avatarOmarAli,
      },
      {
        id: "mohammed-said",
        name: "Mohammed Said",
        message: "I want to know if it is still available?",
        time: "1w",
        product: "iPhone 13 Pro Max",
        avatarUrl: avatarMohammedSaid,
      },
    ],
    [],
  );

  return (
    <section
      className={cn(
        "flex w-full max-w-[400px] flex-col gap-4 rounded-[10px] border border-[#e4e4e4] bg-white p-3",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-6">
        <h2 className="flex-1 text-2xl font-medium text-[#101010]">Chats</h2>
        <Button
          type="button"
          aria-label="More options"
          className="flex size-8 items-center justify-center rounded-full text-[#828282] transition-colors hover:bg-[#f6f6f6]"
        >
          <MoreVertical size={18} />
        </Button>
      </div>

      <div className="flex items-center gap-3 rounded-[12px] border border-[#e4e4e4] bg-white px-4 py-3">
        <Search size={18} className="text-[#828282]" />
        <input
          type="text"
          aria-label="Search chats"
          placeholder="Search ..."
          className="w-full text-[16px] text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
        />
      </div>

      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-[12px] border px-4 py-2 text-sm transition-colors",
                isActive
                  ? "border-[#2563eb] bg-[#2563eb] text-white"
                  : "border-[#e4e4e4] text-[#828282] hover:bg-[#f6f6f6]",
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4">
        {chatItems.map((chat) => (
          <article
            key={chat.id}
            className={cn(
              "rounded-[12px] border border-transparent bg-white p-3 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]",
              chat.isSelected && "border-[#2563eb] bg-[#f5f8ff]",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative size-[44px] shrink-0">
                  <Image
                    src={chat.avatarUrl}
                    alt="User avatar"
                    className="size-full rounded-full object-cover"
                  />
                  <Span
                    className={cn(
                      "absolute bottom-0 right-0 size-[10px] rounded-full border-2 border-white",
                      chat.isOnline ? "bg-[#22c55e]" : "bg-[#c7c7c7]",
                    )}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Text className="text-[16px] font-medium text-[#3d3d3d]">
                    {chat.name}
                  </Text>
                  <div className="space-y-0.5 text-[#828282]">
                    <Text className="text-[14px] font-medium">
                      {chat.message}
                    </Text>
                    <Text className="text-[10px]">{chat.time}</Text>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between gap-3">
                {chat.isPinned && <Pin size={16} className="text-[#828282]" />}
                {typeof chat.unreadCount === "number" && (
                  <Span className="flex size-5 items-center justify-center rounded-full bg-[#2563eb] text-[12px] text-white">
                    {chat.unreadCount}
                  </Span>
                )}
              </div>
            </div>

            <div className="my-3 h-px bg-[#e4e4e4]" />

            <div className="flex items-center gap-2">
              <Image
                src={productThumb}
                alt="Product thumbnail"
                className="size-6 rounded-[2px] object-cover"
              />
              <Text className="text-[12px] text-[#3d3d3d]">{chat.product}</Text>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
