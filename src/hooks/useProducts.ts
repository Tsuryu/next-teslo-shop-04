import useSWR, { SWRConfiguration } from 'swr';

import { IProduct } from '@/interfaces';

export const useProducts = (url: string, config: SWRConfiguration = {}) => {
  //   const { data, error } = useSWR<{ products: IProduct[] }>(`/api${url}`, fetcher, config);
  const { data, error } = useSWR<{ products: IProduct[] }>(`/api${url}`, config);

  return {
    products: data?.products || [],
    hasErrors: error,
    isLoading: !error && !data
  };
};
