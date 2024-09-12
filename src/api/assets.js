import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher} from 'src/utils/axios';
import { ASSETS_API_URL } from '../config-global';
import { useAuthContext } from '../auth/hooks';

// ----------------------------------------------------------------------

export function useGetAssete() {
  const {user} = useAuthContext()
  console.log(user);
  const URL = `${ASSETS_API_URL}/${user?.data?._id}/asset`;

  const { data, isLoading, error, isValidating ,mutate} = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      assets: data || [],
      assetsLoading: isLoading,
      assetsError: error,
      assetsValidating: isValidating,
      assetsEmpty: !isLoading ,
      mutate
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
export function useGetSingleAssete(id) {
  const {user} = useAuthContext()
  const URL = `${ASSETS_API_URL}/${user?.data?._id}/asset/${id}`;

  const { data, isLoading, error, isValidating,mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      singleAssets: data || [],
      singleAssetsLoading: isLoading,
      singleAssetsError: error,
      singleAssetsValidating: isValidating,
      singleAssetsEmpty: !isLoading ,
      mutate
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
