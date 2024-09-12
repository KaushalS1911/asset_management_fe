import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher} from 'src/utils/axios';
import { ASSETS_API_URL } from '../config-global';
import { useAuthContext } from '../auth/hooks';

// ----------------------------------------------------------------------

export function useGetContract() {
  const {user} = useAuthContext()
  const URL = `${ASSETS_API_URL}/${user?.data?._id}/contract`;

  const { data, isLoading, error, isValidating ,mutate} = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      contract: data || [],
      contractLoading: isLoading,
      contractError: error,
      contractValidating: isValidating,
      // contractEmpty: !isLoading && !data.length,
      mutate
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
export function useGetSingleContract(id) {
  const {user} = useAuthContext()
  const URL = `${ASSETS_API_URL}/${user?.data?._id}/contract/${id}`;

  const { data, isLoading, error, isValidating,mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      singleContract: data || [],
      singleContractLoading: isLoading,
      singleContractError: error,
      singleContractValidating: isValidating,
      // singleServiceEmpty: isLoading && data.length,
      mutate
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
