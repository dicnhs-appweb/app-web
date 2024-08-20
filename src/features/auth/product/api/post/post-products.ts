import { collection } from "@/lib/mongodb";
import { queryOptions } from "@tanstack/react-query";
import { ObjectId } from "mongodb";

const fetchProduct = (id: ObjectId) => {
  return collection("products")?.findOne({ _id: id });
};

export const productQueryOptions = (id: ObjectId) =>
  queryOptions({
    queryKey: ["product", "fetchProduct"],
    queryFn: () => fetchProduct(id),
  });
