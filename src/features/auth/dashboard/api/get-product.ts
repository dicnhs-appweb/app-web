import api from '@/constants/api';
import { queryOptions } from '@tanstack/react-query';
import { ObjectId } from 'mongodb';

export const fetchProductById = async (id: string | ObjectId) => {
  try {
    const response = await api.get(`api/products/${id}`).json();
    return response;
  } catch (err) {
    console.error('Failed to fetch product by ID', err);
    throw err;
  }
};
export const productByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['product', 'fetchProductById', id],
    queryFn: () => fetchProductById(id),
  });
