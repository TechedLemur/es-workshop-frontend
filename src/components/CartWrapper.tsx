"use client";

import { Cart } from "./Cart";
import { API_VERSION, getCart, getCartPositioned, queryKeys } from "@/queries";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Client wrapper that binds URL params to TanStack query state.
export default function CartWrapper({
  allowTimeTravel = true,
  version = "v1",
}: {
  version?: API_VERSION;
  allowTimeTravel?: boolean;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cartId = searchParams.get("cartId");
  const timeTravelEnabled = searchParams.get("timeTravelEnabled");
  const revision = searchParams.get("revision");

  const revisionNumber = revision ? parseInt(revision) : NaN;
  const doTimeTravel =
    timeTravelEnabled === "true" && allowTimeTravel && !isNaN(revisionNumber);

  useEffect(() => {
    if (!cartId) {
      router.replace("/shop?cartId=123");
    }
  }, [cartId, router]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.cart({
      cartId: cartId ?? "",
      version,
      timeTravelEnabled: doTimeTravel,
      revision: doTimeTravel ? revisionNumber : null,
    }),
    enabled: Boolean(cartId),
    queryFn: async () => {
      if (!cartId) throw new Error("Missing cart id");
      const result = doTimeTravel
        ? await getCartPositioned(cartId, revisionNumber)
        : await getCart(cartId, version);
      if ("error" in result) throw new Error(result.error);
      return result.data;
    },
  });

  if (!cartId) {
    return <div>Loading cart...</div>;
  }

  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (!data) {
    return <div>Cart not found</div>;
  }

  return <Cart cartId={cartId} cart={data} />;
}
