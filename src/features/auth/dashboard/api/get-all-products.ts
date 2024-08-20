import api from '@/constants/api';
import { queryOptions } from '@tanstack/react-query';

export const fetchAllProducts = async () => {
  try {
    const response = await api.get('api/products').json();
    return response;
  } catch (err) {
    console.error('Failed to fetch products', err);
    throw err;
  }
};
export const allProductsQueryOptions = () =>
  queryOptions({
    queryKey: ['product', 'fetchProduct'],
    queryFn: () => fetchAllProducts(),
  });
