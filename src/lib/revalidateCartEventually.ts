import { QueryClient } from "@tanstack/react-query";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isCartQueryForCartId(queryKey: readonly unknown[], cartId: string) {
  if (queryKey[0] !== "cart") return false;
  const maybeParams = queryKey[1];
  if (!maybeParams || typeof maybeParams !== "object") return true;

  const params = maybeParams as { cartId?: string };
  if (!params.cartId) return true;
  return params.cartId === cartId;
}

function isLastEventRevisionQueryForCartId(
  queryKey: readonly unknown[],
  cartId: string,
) {
  return queryKey[0] === "last-event-revision" && queryKey[1] === cartId;
}

// Handles eventual consistency by refetching active cart queries a few times.
// Better approaches could be to use a websocket or a pub/sub system.
// We could also use the revision of the cart and revalidate until we reach the newest revision.
export async function revalidateCartEventually(
  queryClient: QueryClient,
  cartId: string,
  delayMs: number,
) {
  const delays = [delayMs];

  for (const waitMs of delays) {
    if (waitMs > 0) {
      await delay(waitMs);
    }

    await queryClient.invalidateQueries({
      predicate: (query) =>
        isCartQueryForCartId(query.queryKey, cartId) ||
        isLastEventRevisionQueryForCartId(query.queryKey, cartId),
      refetchType: "active",
    });
  }
}
