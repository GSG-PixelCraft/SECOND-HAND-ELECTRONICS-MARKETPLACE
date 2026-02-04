import { useMemo } from "react";
import { MapPin } from "lucide-react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Card, CardContent } from "@/components/ui/Card";
import { Span } from "@/components/ui/span";

interface LocationCardProps {
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export const LocationCard = ({ location, coordinates }: LocationCardProps) => {
  const position = useMemo<[number, number]>(() => {
    if (coordinates) return [coordinates.lat, coordinates.lng];
    return [31.5017, 34.4668];
  }, [coordinates]);

  return (
    <Card className="gap-3 rounded-2xl border border-neutral-10 bg-white">
      <CardContent className="space-y-3">
        <h3 className="text-sm font-semibold text-neutral-foreground">
          Location
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <Span>{location}</Span>
        </div>
        <div className="relative h-44 w-full overflow-hidden rounded-xl border border-neutral-10">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} />
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};
