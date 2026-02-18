import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Span } from "@/components/ui/span";

export default function BlockedUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Fetch blocked users from API
  // TODO: Implement handleUnblock function when implementing real data

  return (
    <PageLayout title="Blocked Users" className="max-w-full">
      <div className="space-y-6">
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
          {/* <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <UserX className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
            <Text variant="muted">You haven't blocked any users yet.</Text>
            <Text variant="muted" className="text-bodySmall mt-1">
              Blocked users won't be able to send you messages or view your
              contact information.
            </Text>
          </div> */}

          {/* Example blocked user card (remove when implementing real data) */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-10">
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
                className="bg-primary text-white"
                // onClick={() => handleUnblock("user-id")}
              >
                Unblock
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
