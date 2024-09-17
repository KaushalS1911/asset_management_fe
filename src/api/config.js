import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher} from 'src/utils/axios';
import { ASSETS_API_URL } from '../config-global';
import { useAuthContext } from '../auth/hooks';

// ----------------------------------------------------------------------

export function useGetConfigs() {
  const {user} = useAuthContext()
  const URL = `${ASSETS_API_URL}/${user?._id}/config`;

  const { data, isLoading, error, isValidating ,mutate} = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      config: data?.data || [],
      configLoading: isLoading,
      configError: error,
      configValidating: isValidating,
      configEmpty: !isLoading ,
      configLength: data?.length ,
      mutate
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
