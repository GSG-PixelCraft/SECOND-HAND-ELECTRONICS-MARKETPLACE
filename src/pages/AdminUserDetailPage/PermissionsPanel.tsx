import { forwardRef } from "react";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import { Switch } from "@/components/ui/switch";
import { useUpdateChatAccess } from "@/services/admin-users.service";

export interface PermissionsPanelProps {
  userId: string;
  chatAccess: boolean;
}

export const PermissionsPanel = forwardRef<
  HTMLDivElement,
  PermissionsPanelProps
>(({ userId, chatAccess }, ref) => {
  const updateChatAccessMutation = useUpdateChatAccess();

  const handleChatAccessToggle = async (checked: boolean) => {
    try {
      await updateChatAccessMutation.mutateAsync({
        id: userId,
        payload: { chatAccess: checked },
      });
    } catch (error) {
      console.error("Failed to update chat access:", error);
    }
  };

  return (
    <div
      ref={ref}
      className="rounded-xl bg-white p-6 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]"
    >
      <Text variant="bodyLg" className="text-neutral-90 mb-4 font-semibold">
        Permissions
      </Text>

      <div className="flex items-center justify-between">
        <div>
          <Text variant="body" className="text-neutral-90 font-medium">
            Chat Access
          </Text>
          <Span className="text-neutral-50 text-sm">
            Allow user to send and receive messages
          </Span>
        </div>
        <Switch
          checked={chatAccess}
          onCheckedChange={handleChatAccessToggle}
          disabled={updateChatAccessMutation.isPending}
        />
      </div>
    </div>
  );
});

PermissionsPanel.displayName = "PermissionsPanel";
