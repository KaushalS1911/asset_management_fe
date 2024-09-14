import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher} from 'src/utils/axios';
import { ASSETS_API_URL } from '../config-global';
import { useAuthContext } from '../auth/hooks';

// ----------------------------------------------------------------------

export function useGetService() {
  const { user } = useAuthContext()
  const URL = `${ASSETS_API_URL}/${user?._id}/service`;

  const { data, isLoading, error, isValidating ,mutate} = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      service: data || [],
      serviceLoading: isLoading,
      serviceError: error,
      serviceValidating: isValidating,
      serviceLength:data?.length,      // serviceEmpty: !isLoading && !data.length,
      mutate
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
export function useGetSingleService(id) {
  const { user } = useAuthContext()
  const URL = `${ASSETS_API_URL}/${user?._id}/service/${id}`;

  const { data, isLoading, error, isValidating,mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      singleService: data || [],
      singleServiceLoading: isLoading,
      singleServiceError: error,
      singleServiceValidating: isValidating,
      // singleServiceEmpty: isLoading && data.length,
      mutate
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
