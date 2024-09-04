import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher} from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetService() {
  const URL = 'https://asset-management-be-dkf8.onrender.com/service';

  const { data, isLoading, error, isValidating ,mutate} = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      service: data || [],
      serviceLoading: isLoading,
      serviceError: error,
      serviceValidating: isValidating,
      // serviceEmpty: !isLoading && !data.length,
      mutate
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
export function useGetSingleService(id) {
  const URL = `https://asset-management-be-dkf8.onrender.com/service/${id}`;

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
