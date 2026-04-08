"use client";

import { ProductCard } from "./ProductCard";
import { API_VERSION, getProducts, queryKeys } from "@/queries";
import { useQuery } from "@tanstack/react-query";

export function ProductGrid({
  version = "v1",
}: {
  version?: API_VERSION;
}) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.products(version),
    queryFn: async () => {
      const result = await getProducts(version);
      if ("error" in result) throw new Error(result.error);
      return result.data;
    },
  });

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (!data) {
    return <div>No products found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((product) => (
        <ProductCard key={product.id} product={product} version={version} />
      ))}
    </div>
  );
}
