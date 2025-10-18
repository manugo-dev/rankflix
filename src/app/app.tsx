import type { DehydratedState } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";

import { AppRouter } from "./app-router";
import { ErrorBoundary, LanguageProvider, QueryProvider } from "./providers";

import "./styles/main.scss";

interface AppProps {
  dehydratedState?: DehydratedState;
}

export function App({ dehydratedState }: AppProps) {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <QueryProvider dehydratedState={dehydratedState}>
          <MotionConfig reducedMotion="user">
            <AppRouter />
          </MotionConfig>
        </QueryProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
