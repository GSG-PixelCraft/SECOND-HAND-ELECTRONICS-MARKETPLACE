export const getBackendErrorMessage = (error: unknown): string | null => {
  try {
    // Axios-style error: error.response.data.message
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      (error as any).response &&
      typeof (error as any).response === "object" &&
      "data" in (error as any).response &&
      (error as any).response.data &&
      typeof (error as any).response.data === "object" &&
      "message" in (error as any).response.data &&
      typeof (error as any).response.data.message === "string"
    ) {
      return (error as any).response.data.message as string;
    }

    // Fallback to plain Error.message
    if (error instanceof Error && typeof error.message === "string") {
      return error.message;
    }
  } catch {
    // ignore parsing errors
  }
  return null;
};

