// Root component - Wrap with all providers
import { RouterProvider } from "react-router-dom";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { QueryProvider, ThemeProvider } from "@/providers";
import { router } from "@/routes";

function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <QueryProvider>
          <RouterProvider router={router} />
        </QueryProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}

export default App;
