import api from '@/constants/api';
import { queryOptions } from '@tanstack/react-query';

export const deleteProduct = async (id: string) => {
  try {
    const response = await api.delete(`api/products/${id}`).json();
    return response;
  } catch (err) {
    console.error('Failed to delete product', err);
    throw err;
  }
};
export const deleteProductQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['product', 'deleteProduct', id],
    queryFn: () => deleteProduct(id),
  });
