import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher} from 'src/utils/axios';
import { ASSETS_API_URL } from '../config-global';

// ----------------------------------------------------------------------

export function useGetAssete() {
  const URL = `${ASSETS_API_URL}/asset`;

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
  const URL = `${ASSETS_API_URL}/asset/${id}`;

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
