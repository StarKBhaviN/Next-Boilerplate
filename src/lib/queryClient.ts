import { QueryClient } from "@tanstack/react-query";

let queryClientSingleton: QueryClient | null = null;

export function getQueryClient(): QueryClient {
  if (queryClientSingleton) return queryClientSingleton;
  queryClientSingleton = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 1000 * 5,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
    },
  });
  return queryClientSingleton;
}


