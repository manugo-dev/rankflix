import type { DehydratedState } from "@tanstack/react-query";

import { AppRouter } from "./app-router";
import { QueryProvider, StoreProvider } from "./providers";

import "./styles/main.scss";

interface AppProps {
  dehydratedState?: DehydratedState;
}

export function App({ dehydratedState }: AppProps) {
  return (
    <StoreProvider>
      <QueryProvider dehydratedState={dehydratedState}>
        <AppRouter />
      </QueryProvider>
    </StoreProvider>
  );
}
