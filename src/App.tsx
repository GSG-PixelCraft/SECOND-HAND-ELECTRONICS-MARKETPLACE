// Root component - Wrap with all providers
import { RouterProvider } from "react-router-dom";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { QueryProvider } from "@/providers";
import { router } from "@/routes";

function App() {
  return (
    <AppErrorBoundary>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </AppErrorBoundary>
  );
}

export default App;
