
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Keep a console trace so the root cause is visible in DevTools.
    console.error("App crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
          <section className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
            <p className="mt-2 text-slate-600">
              The page failed to render. Refresh the page and check the browser console for details.
            </p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
