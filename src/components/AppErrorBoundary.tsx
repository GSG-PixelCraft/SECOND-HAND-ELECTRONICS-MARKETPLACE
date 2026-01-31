import type { ReactNode } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[AppErrorBoundary] Unhandled error", {
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
          <div className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-600">
            Unexpected Error
          </div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Something went wrong
          </h1>
          <p className="max-w-xl text-base text-slate-600">
            An unexpected error occurred. Please try refreshing the page or
            contact support if the problem persists.
          </p>
          <Link
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            to={ROUTES.HOME}
          >
            Back to Home
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}
