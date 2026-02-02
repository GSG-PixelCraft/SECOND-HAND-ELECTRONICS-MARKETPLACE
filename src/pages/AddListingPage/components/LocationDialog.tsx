// src/pages/AddListingPage/components/LocationDialog.tsx
import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

interface LocationValue {
  country: string;
  city: string;
  street: string;
  lat: number;
  lng: number;
}

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: LocationValue;
  onApply: (value: LocationValue) => void;
}

delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const parseAddress = (address: Record<string, string | undefined>) => {
  const city =
    address.city ?? address.town ?? address.village ?? address.state ?? "";
  const street = [address.road, address.house_number].filter(Boolean).join(" ");
  return {
    country: address.country ?? "",
    city,
    street,
  };
};

const reverseGeocode = async (lat: number, lng: number) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
    {
      headers: {
        "Accept-Language": "en",
      },
    },
  );
  if (!response.ok) return null;
  const data: { address?: Record<string, string> } = await response.json();
  if (!data.address) return null;
  return parseAddress(data.address);
};

const forwardGeocode = async (query: string, signal: AbortSignal) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}`,
    { signal, headers: { "Accept-Language": "en" } },
  );
  if (!response.ok) return null;
  const data: Array<{ lat: string; lon: string }> = await response.json();
  if (!data.length) return null;
  return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
};

const MapUpdater = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
  }, [map, position]);
  return null;
};

const MapEvents = ({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click: (event) => onPick(event.latlng.lat, event.latlng.lng),
  });
  return null;
};

export const LocationDialog: React.FC<LocationDialogProps> = ({
  open,
  onOpenChange,
  value,
  onApply,
}): React.ReactElement => {
  const [draft, setDraft] = useState<LocationValue>(value);
  const [lastUpdateSource, setLastUpdateSource] = useState<
    "map" | "form" | null
  >(null);
  const searchAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(value);
      setLastUpdateSource(null);
    }
  }, [open, value]);

  useEffect(() => {
    if (!open || lastUpdateSource !== "map") return;
    const run = async () => {
      const result = await reverseGeocode(draft.lat, draft.lng);
      if (result) {
        setDraft((prev) => ({
          ...prev,
          ...result,
        }));
      }
      setLastUpdateSource(null);
    };
    run();
  }, [draft.lat, draft.lng, lastUpdateSource, open]);

  useEffect(() => {
    if (!open || lastUpdateSource !== "form") return;
    const query = [draft.street, draft.city, draft.country]
      .filter(Boolean)
      .join(", ");
    if (!query) return;

    const controller = new AbortController();
    searchAbortRef.current?.abort();
    searchAbortRef.current = controller;

    const timeout = setTimeout(async () => {
      const result = await forwardGeocode(query, controller.signal);
      if (result) {
        setDraft((prev) => ({
          ...prev,
          lat: result.lat,
          lng: result.lng,
        }));
      }
      setLastUpdateSource(null);
    }, 500);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [draft.street, draft.city, draft.country, lastUpdateSource, open]);

  const mapPosition = useMemo<[number, number]>(
    () => [draft.lat, draft.lng],
    [draft.lat, draft.lng],
  );

  const handleMapPick = (lat: number, lng: number) => {
    setDraft((prev) => ({ ...prev, lat, lng }));
    setLastUpdateSource("map");
  };

  const handleApply = () => {
    onApply(draft);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      className="max-w-[577px] rounded-[20px] border border-[#e4e4e4] p-8"
    >
      <div className="relative flex items-center justify-center">
        <p className="font-['Poppins'] text-xl font-medium leading-normal text-[#212121]">
          Location
        </p>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-0 flex h-7 w-7 items-center justify-center rounded-full border border-[#e4e4e4] text-sm text-[#3d3d3d]"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <p className="font-['Poppins'] text-base leading-normal text-[#3d3d3d]">
              Country
            </p>
            <div className="flex flex-col items-center justify-center text-center leading-[0]">
              <p className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">
                *
              </p>
            </div>
          </div>
          <div className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4">
            <input
              type="text"
              value={draft.country}
              onChange={(event) => {
                setDraft((prev) => ({ ...prev, country: event.target.value }));
                setLastUpdateSource("form");
              }}
              placeholder="Palestine"
              className="flex-1 bg-transparent font-['Poppins'] text-base leading-normal text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
            />
            <svg
              className="size-6 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 9L12 15L5 9"
                stroke="#828282"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <p className="font-['Poppins'] text-base leading-normal text-[#3d3d3d]">
              City
            </p>
            <div className="flex flex-col items-center justify-center text-center leading-[0]">
              <p className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">
                *
              </p>
            </div>
          </div>
          <div className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4">
            <input
              type="text"
              value={draft.city}
              onChange={(event) => {
                setDraft((prev) => ({ ...prev, city: event.target.value }));
                setLastUpdateSource("form");
              }}
              placeholder="Gaza"
              className="flex-1 bg-transparent font-['Poppins'] text-base leading-normal text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
            />
            <svg
              className="size-6 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 9L12 15L5 9"
                stroke="#828282"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-['Poppins'] text-base leading-normal text-[#3d3d3d]">
            Street
          </p>
          <div className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4">
            <input
              type="text"
              value={draft.street}
              onChange={(event) => {
                setDraft((prev) => ({ ...prev, street: event.target.value }));
                setLastUpdateSource("form");
              }}
              placeholder="Enter street name"
              className="flex-1 bg-transparent font-['Poppins'] text-base leading-normal text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 text-[#828282]">
          <span className="h-px flex-1 bg-[#e4e4e4]" />
          <p className="font-['Poppins'] text-sm leading-normal">
            Or use the map
          </p>
          <span className="h-px flex-1 bg-[#e4e4e4]" />
        </div>

        <div className="overflow-hidden rounded-[10px] border border-[#e4e4e4]">
          <MapContainer
            center={mapPosition}
            zoom={13}
            className="h-[280px] w-full"
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater position={mapPosition} />
            <MapEvents onPick={handleMapPick} />
            <Marker
              position={mapPosition}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const marker = event.target as L.Marker;
                  const { lat, lng } = marker.getLatLng();
                  handleMapPick(lat, lng);
                },
              }}
            />
          </MapContainer>
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-[#2563eb] px-[119px] py-4"
        >
          <p className="font-['Poppins'] text-base font-medium leading-normal text-white">
            Use this address
          </p>
        </button>
      </div>
    </Dialog>
  );
};
