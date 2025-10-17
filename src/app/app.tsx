import type { DehydratedState } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";

import { AppRouter } from "./app-router";
import { LanguageProvider, QueryProvider, StoreProvider } from "./providers";

import "./styles/main.scss";

interface AppProps {
  dehydratedState?: DehydratedState;
}

export function App({ dehydratedState }: AppProps) {
  return (
    <StoreProvider>
      <LanguageProvider>
        <QueryProvider dehydratedState={dehydratedState}>
          <MotionConfig reducedMotion="user">
            <AppRouter />
          </MotionConfig>
        </QueryProvider>
      </LanguageProvider>
    </StoreProvider>
  );
}
