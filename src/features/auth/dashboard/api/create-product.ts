import api from '@/constants/api';
import { ProductSchema } from '@/types/product.schema';
import { queryOptions } from '@tanstack/react-query';

const createProduct = async (newProduct: ProductSchema) => {
  try {
    const response = await api.post('api/products', { json: newProduct }).json();
    return response;
  } catch (err) {
    console.error('Failed to create product', err);
    throw err;
  }
};

export const createProductQueryOptions = (newProduct: ProductSchema) =>
  queryOptions({
    queryKey: ['product', 'createProduct'],
    queryFn: () => createProduct(newProduct),
  });
