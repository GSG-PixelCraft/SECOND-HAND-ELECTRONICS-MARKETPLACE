type AxiosLikeError = {
  response?: {
    data?: {
      message?: unknown;
    };
  };
};

export const getBackendErrorMessage = (error: unknown): string | null => {
  try {
    // Axios-style error: error.response.data.message
    if (error && typeof error === "object" && "response" in error) {
      const axiosErr = error as AxiosLikeError;
      if (
        axiosErr.response &&
        typeof axiosErr.response === "object" &&
        axiosErr.response.data &&
        typeof axiosErr.response.data === "object" &&
        typeof axiosErr.response.data.message === "string"
      ) {
        return axiosErr.response.data.message;
      }
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
