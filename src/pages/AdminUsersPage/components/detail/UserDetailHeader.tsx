import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { AdminBackButton } from "@/components/admin";
import { Text } from "@/components/ui/Text/text";

export const UserDetailHeader = forwardRef<HTMLDivElement>((_props, ref) => {
  const navigate = useNavigate();

  return (
    <div ref={ref} className="mb-6 flex items-center gap-4">
      <AdminBackButton
        onClick={() => navigate("/admin/users")}
        aria-label="Back to users"
      />
      <Text variant="displaySm" className="text-neutral-90 font-bold">
        User Profile
      </Text>
    </div>
  );
});

UserDetailHeader.displayName = "UserDetailHeader";
