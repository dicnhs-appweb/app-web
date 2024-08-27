import api from '@/constants/api';
import { ProductSchema } from '@/types/product.schema';
import { queryOptions } from '@tanstack/react-query';

export const updateProduct = async (
  id: string,
  updatedProduct: ProductSchema
) => {
  try {
    const response = await api
      .put(`api/products/${id}`, {
        json: updatedProduct,
      })
      .json();
    return response;
  } catch (err) {
    console.error('Failed to update product', err);
    throw err;
  }
};
export const updateProductQueryOptions = (
  id: string,
  updatedProduct: ProductSchema
) =>
  queryOptions({
    queryKey: ['product', 'updateProduct', id],
    queryFn: () => updateProduct(id, updatedProduct),
  });
