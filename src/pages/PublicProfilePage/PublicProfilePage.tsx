import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star, MapPin, Calendar } from "lucide-react";

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();

  // TODO: Fetch user profile data using the id

  return (
    <PageLayout title="User Profile" maxWidth="6xl">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-10">
              <span className="text-h1 font-bold text-muted-foreground">U</span>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-h2 font-semibold">User #{id}</h1>
                  <div className="text-bodySmall mt-2 flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Location</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined Jan 2026</span>
                    </div>
                  </div>
                </div>
                <Button intent="primary">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-4 flex gap-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-warning text-warning" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-bodySmall text-muted-foreground">
                    (120 reviews)
                  </span>
                </div>
                <div className="text-bodySmall">
                  <span className="font-semibold">150</span>
                  <span className="text-muted-foreground"> listings</span>
                </div>
                <div className="text-bodySmall">
                  <span className="font-semibold">95%</span>
                  <span className="text-muted-foreground"> response rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Listings */}
        <div>
          <h2 className="mb-4 text-h3 font-semibold">Active Listings</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* TODO: Add product cards */}
            <div className="rounded-lg bg-white p-6 text-center shadow-sm">
              <p className="text-muted-foreground">
                This user has no active listings.
              </p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="mb-4 text-h3 font-semibold">Reviews</h2>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-center text-muted-foreground">No reviews yet.</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
