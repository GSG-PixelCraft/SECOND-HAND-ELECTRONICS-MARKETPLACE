// Root component - Wrap with all providers
import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AppErrorBoundary } from "@/components/AppErrorBoundary/AppErrorBoundary";
import { QueryProvider } from "@/providers";
import { router } from "@/routes";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  getToken,
  getUser,
  getVerification,
  removeToken,
  removeUser,
  removeVerification,
  setToken as persistToken,
  setUser as persistUser,
  setVerification as persistVerification,
} from "@/lib/storage";

function AuthSync() {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const setVerification = useAuthStore((state) => state.setVerification);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const storedUser = getUser();
    const storedToken = getToken();
    const storedVerification = getVerification();

    if (!storedUser || !storedToken) {
      logout();
      removeUser();
      removeToken();
      removeVerification();
      return;
    }

    setUser(storedUser);
    setToken(storedToken);
    if (storedVerification) {
      setVerification(storedVerification);
    }
  }, [logout, setToken, setUser, setVerification]);

  useEffect(() => {
    const onStorage = () => {
      const storedUser = getUser();
      const storedToken = getToken();
      const storedVerification = getVerification();
      if (!storedUser || !storedToken) {
        logout();
        removeUser();
        removeToken();
        removeVerification();
      } else {
        setUser(storedUser);
        setToken(storedToken);
        persistUser(storedUser);
        persistToken(storedToken);
        if (storedVerification) {
          setVerification(storedVerification);
          persistVerification(storedVerification);
        }
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [logout, setToken, setUser, setVerification]);

  return null;
}

function App() {
  return (
    <AppErrorBoundary>
      <QueryProvider>
        <AuthSync />
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              padding: "12px 24px",
              borderRadius: "8px",
            },
            success: {
              style: {
                background: "#10b981",
                color: "white",
              },
            },
            error: {
              style: {
                background: "#ef4444",
                color: "white",
              },
            },
          }}
        />
      </QueryProvider>
    </AppErrorBoundary>
  );
}

export default App;
