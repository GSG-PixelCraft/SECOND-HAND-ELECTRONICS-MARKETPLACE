import { Button } from "../Button/button";

interface LocationPermissionModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

export const LocationPermissionModal = ({
  isOpen,
  onAllow,
  onDeny,
}: LocationPermissionModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
              <svg
                className="h-7 w-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-normal text-gray-900">
              Our website wants to know your location?
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onAllow}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Allow while visiting the site
          </Button>
          <Button
            onClick={onAllow}
            className="w-full rounded-lg border-2 border-blue-600 bg-white px-4 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50"
          >
            Allow this time
          </Button>
          <Button
            onClick={onDeny}
            className="w-full rounded-lg px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Never allow
          </Button>
        </div>
      </div>
    </div>
  );
};
