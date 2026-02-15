import { DefaultOptions, QueryClient } from "@tanstack/react-query"
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProviderProps } from "@tanstack/react-query-persist-client";

export const getQueryClient = (defaultOptions: DefaultOptions) => 
    new QueryClient({
        defaultOptions
    });

export const queryClient = getQueryClient({
    queries: {
        refetchOnMount: true,
        refetchOnWindowFocus: false
    }
});

//! createSyncStoragePersister is depricated
const persister = createAsyncStoragePersister({
    storage: window.localStorage
});

export const persistOptions: PersistQueryClientProviderProps["persistOptions"] = {
    persister
}