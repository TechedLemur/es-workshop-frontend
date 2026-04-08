import {
  Cart,
  OrderGraphData,
  PopularItem,
  Product,
  RecentOrder,
} from "./types";
import { env } from "./env";

const API_URL = env.NEXT_PUBLIC_API_URL;

export type API_VERSION = "v1" | "v2";
export type QueryResult<T> = { data: T } | { error: string };
export type MutationResult =
  | { success: true; message: string }
  | { success: false; message: string };

export const queryKeys = {
  products: (version: API_VERSION) => ["products", version] as const,
  cart: (params: {
    cartId: string;
    version: API_VERSION;
    timeTravelEnabled: boolean;
    revision: number | null;
  }) => ["cart", params] as const,
  orderGraph: () => ["order-graph"] as const,
  recentOrders: (limit: number) => ["recent-orders", limit] as const,
  popularItems: (limit: number) => ["popular-items", limit] as const,
  lastEventRevision: (cartId: string) =>
    ["last-event-revision", cartId] as const,
};

export async function getProducts(
  version: API_VERSION = "v1",
): Promise<QueryResult<Product[]>> {
  try {
    const response = await fetch(`${API_URL}/products/${version}`);
    if (!response.ok) return { error: "Failed to get products" };
    return { data: (await response.json()) as Product[] };
  } catch {
    return { error: "Failed to get products" };
  }
}

export async function getCart(
  cartId: string,
  version: API_VERSION = "v1",
): Promise<QueryResult<Cart>> {
  try {
    const response = await fetch(`${API_URL}/cart/${version}/${cartId}`);
    if (!response.ok) return { error: "Failed to get cart" };
    return { data: (await response.json()) as Cart };
  } catch {
    return { error: "Failed to get cart" };
  }
}

export async function getCartPositioned(
  cartId: string,
  revision: number,
): Promise<QueryResult<Cart>> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("maxCount", revision.toString());
    const response = await fetch(
      `${API_URL}/cart/positioned/${cartId}?${searchParams.toString()}`,
    );
    if (!response.ok) return { error: "Failed to get cart" };
    return { data: (await response.json()) as Cart };
  } catch {
    return { error: "Failed to get cart" };
  }
}

export async function getLastEventRevision(cartId: string) {
  try {
    const response = await fetch(`${API_URL}/cart/${cartId}/lastEventRevision`);
    if (!response.ok) return undefined;
    const data = await response.json();
    return data.lastEventRevision as number | undefined;
  } catch {
    console.error(`Failed to get last event revision for cart ${cartId}`);
    return undefined;
  }
}

export async function getOrderGraph(): Promise<OrderGraphData | null> {
  try {
    const response = await fetch(`${API_URL}/orders/graph`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as OrderGraphData;
  } catch {
    return null;
  }
}

export async function getRecentOrders(
  limit = 10,
): Promise<RecentOrder[] | null> {
  try {
    const response = await fetch(`${API_URL}/orders?limit=${limit}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as RecentOrder[];
  } catch {
    return null;
  }
}

export async function getPopularItems(
  limit = 10,
): Promise<PopularItem[] | null> {
  try {
    const response = await fetch(`${API_URL}/orders/popular?limit=${limit}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as PopularItem[];
  } catch {
    return null;
  }
}

export async function addItemToCart(
  cartId: string,
  productId: string,
  version: API_VERSION = "v1",
): Promise<void> {
  const response = await fetch(`${API_URL}/cart/${version}/${cartId}/addItem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add item to cart: ${response.statusText}`);
  }
}

export async function removeItemFromCart(
  cartId: string,
  itemId: string,
  version: API_VERSION = "v1",
): Promise<void> {
  const response = await fetch(
    `${API_URL}/cart/${version}/${cartId}/removeItem/${itemId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to remove item from cart: ${response.statusText}`);
  }
}

export async function checkout(cartId: string): Promise<MutationResult> {
  const response = await fetch(`${API_URL}/orders/checkout/${cartId}`, {
    method: "POST",
  });

  if (response.status === 501) {
    return {
      success: false,
      message: "Checkout not implemented",
    };
  }

  if (!response.ok) {
    return {
      success: false,
      message: `Failed to checkout: ${response.statusText}`,
    };
  }

  return {
    success: true,
    message: "Order created",
  };
}
