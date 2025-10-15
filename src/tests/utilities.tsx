import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, renderHook } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";
import { MemoryRouter } from "react-router";

interface RenderWithProvidersOptions {
  initialEntries?: string[];
  queryClient?: QueryClient;
  route?: string;
}

interface WrapperProps {
  children: ReactNode;
}

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
      queries: {
        gcTime: 0,
        retry: false,
        staleTime: 0,
      },
    },
  });
};

const createWrapper = ({
  initialEntries,
  queryClient,
  route,
}: Required<RenderWithProvidersOptions>) => {
  const Wrapper = ({ children }: WrapperProps) => {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route, ...initialEntries]}>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  };

  return Wrapper;
};

export const renderWithProviders = (ui: ReactElement, options: RenderWithProvidersOptions = {}) => {
  const { initialEntries = ["/"], queryClient = createQueryClient(), route = "/" } = options;

  return {
    ...render(ui, { wrapper: createWrapper({ initialEntries, queryClient, route }) }),
    queryClient,
  };
};

export const renderHookWithProviders = <TResult, TProps>(
  hook: (_props: TProps) => TResult,
  options: RenderWithProvidersOptions = {},
) => {
  const { initialEntries = ["/"], queryClient = createQueryClient(), route = "/" } = options;

  return {
    ...renderHook(hook, { wrapper: createWrapper({ initialEntries, queryClient, route }) }),
    queryClient,
  };
};
