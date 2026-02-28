import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/button";
import { Image } from "@/components/ui/Image/image";
import { Text } from "@/components/ui/Text/text";
import { Span } from "@/components/ui/Span/span";

interface SellerCardProps {
  name: string;
  avatarUrl: string;
  activeListings: number;
  soldListings: number;
  lastOnline: string;
  responseTime: string;
  onChat?: () => void;
  onReportListing?: () => void;
  onReportUser?: () => void;
  showReportMenu?: boolean;
}

export const SellerCard = ({
  name,
  avatarUrl,
  activeListings,
  soldListings,
  lastOnline,
  responseTime,
  onChat,
  onReportListing,
  onReportUser,
  showReportMenu = true,
}: SellerCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  return (
    <Card className="gap-4 rounded-2xl border border-neutral-10 bg-white">
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={avatarUrl}
              alt={name}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <Text className="text-sm font-semibold text-neutral-foreground">
                {name}
              </Text>
              <Text variant="muted" className="text-xs">
                {activeListings} Active listing · {soldListings} Sold listing
              </Text>
            </div>
          </div>

          {showReportMenu && (
            <div className="relative" ref={menuRef}>
              <Button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-10 bg-white text-neutral-foreground shadow-sm transition hover:bg-neutral-5"
                aria-label="Open seller menu"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>

              {menuOpen && (
                <div className="absolute right-0 top-10 z-20 w-44 rounded-xl border border-neutral-10 bg-white p-2 shadow-lg">
                  <Button
                    type="button"
                    onClick={() => {
                      onReportListing?.();
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-neutral-foreground hover:bg-neutral-5"
                  >
                    Report listing
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      onReportUser?.();
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-neutral-foreground hover:bg-neutral-5"
                  >
                    Report user
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <Span>Last online {lastOnline}</Span>
          <Span>Avg. response time: {responseTime}</Span>
        </div>

        <Button fullWidth onClick={onChat}>
          Chat with seller
        </Button>
      </CardContent>
    </Card>
  );
};
