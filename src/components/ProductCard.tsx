"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/types";
import { addItemToCart, API_VERSION } from "@/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { revalidateCartEventually } from "@/lib/revalidateCartEventually";

type ProductCardProps = {
  product: Product;
  version: API_VERSION;
};

export function ProductCard({ product, version }: ProductCardProps) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const cartId = searchParams.get("cartId");
  const delay = searchParams.get("delay")
    ? parseInt(searchParams.get("delay") || "10")
    : 10;

  console.log("delay", delay);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!cartId) {
        throw new Error("Cart ID is required");
      }
      await addItemToCart(cartId, product.id, version);
    },
    onSuccess: async () => {
      if (!cartId) return;
      await revalidateCartEventually(queryClient, cartId, delay);
      toast.success("Item added to cart");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add item to cart");
    },
  });

  const handleSubmit = async () => {
    if (!cartId) {
      toast.error("Cart ID is required");
      return;
    }
    await addToCartMutation.mutateAsync();
  };
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-1">
        <div className="bg-muted mb-4 aspect-square w-full overflow-hidden rounded-lg">
          <Image
            loading="eager"
            width={400}
            height={400}
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          {product.price.toFixed(2)} {product.currency}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!cartId || addToCartMutation.isPending}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
