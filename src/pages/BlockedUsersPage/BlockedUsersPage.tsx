import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export default function BlockedUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Fetch blocked users from API
  // TODO: Implement handleUnblock function when implementing real data

  return (
    <PageLayout title="Blocked Users" maxWidth="4xl">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <UserX className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-h2 font-semibold">Blocked Users</h1>
            <Text variant="muted">
              Manage users you've blocked from contacting you
            </Text>
          </div>
        </div>

        {/* Search */}
        <div>
          <Input
            type="search"
            placeholder="Search blocked users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Blocked Users List */}
        <div className="space-y-4">
          {/* TODO: Map over actual blocked users */}
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <UserX className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
            <Text variant="muted">You haven't blocked any users yet.</Text>
            <Text variant="muted" className="text-bodySmall mt-1">
              Blocked users won't be able to send you messages or view your
              contact information.
            </Text>
          </div>

          {/* Example blocked user card (remove when implementing real data) */}
          {/* <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-10 rounded-full flex items-center justify-center">
                  <Span variant="muted" className="text-bodyLg font-bold">
                    U
                  </Span>
                </div>
                <div>
                  <h3 className="font-semibold">User Name</h3>
                  <Text variant="muted" className="text-bodySmall">
                    Blocked on Jan 15, 2026
                  </Text>
                </div>
              </div>
              <Button
                intent="outline"
                size="sm"
                onClick={() => handleUnblock("user-id")}
              >
                Unblock
              </Button>
            </div>
          </div> */}
        </div>
      </div>
    </PageLayout>
  );
}
