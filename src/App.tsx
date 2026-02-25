// Root component - Wrap with all providers
import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { AppErrorBoundary } from "@/components/AppErrorBoundary.stories/AppErrorBoundary";
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
      </QueryProvider>
    </AppErrorBoundary>
  );
}

export default App;
