import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export const UserDetailHeader = forwardRef<HTMLDivElement>((_props, ref) => {
  const navigate = useNavigate();

  return (
    <div ref={ref} className="mb-6 flex items-center gap-4">
      <Button
        intent="outline"
        size="md"
        onClick={() => navigate("/admin/users")}
        className="h-10 w-10 rounded-full border border-neutral-20"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Text variant="displaySm" className="text-neutral-90 font-bold">
        User Profile
      </Text>
    </div>
  );
});

UserDetailHeader.displayName = "UserDetailHeader";
