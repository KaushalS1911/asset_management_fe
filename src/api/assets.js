import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher} from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetAssete() {
  const URL = 'https://asset-management-be-dkf8.onrender.com/asset';

  const { data, isLoading, error, isValidating ,mutate} = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      assets: data || [],
      assetsLoading: isLoading,
      assetsError: error,
      assetsValidating: isValidating,
      assetsEmpty: !isLoading && !data.length,
      mutate
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
export function useGetSingleAssete(id) {
  const URL = `https://asset-management-be-dkf8.onrender.com/asset/${id}`;

  const { data, isLoading, error, isValidating,mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      singleAssets: data || [],
      singleAssetsLoading: isLoading,
      singleAssetsError: error,
      singleAssetsValidating: isValidating,
      singleAssetsEmpty: !isLoading && !data.length,
      mutate
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
