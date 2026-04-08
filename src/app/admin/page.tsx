"use client";

import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { env } from "@/env";
import {
  getOrderGraph,
  getPopularItems,
  getRecentOrders,
  queryKeys,
} from "@/queries";
import { useQuery } from "@tanstack/react-query";

export default function AdminPage() {
  const apiUrl = env.NEXT_PUBLIC_API_URL;

  const { data: graphData = null } = useQuery({
    queryKey: queryKeys.orderGraph(),
    queryFn: getOrderGraph,
  });

  const { data: recentOrders = null } = useQuery({
    queryKey: queryKeys.recentOrders(10),
    queryFn: () => getRecentOrders(10),
  });

  const { data: popularItems = null } = useQuery({
    queryKey: queryKeys.popularItems(10),
    queryFn: () => getPopularItems(10),
  });

  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-4xl font-bold">Admin</h1>
        <AdminDashboard
          apiUrl={apiUrl}
          initialGraphData={graphData}
          initialRecentOrders={recentOrders}
          initialPopularItems={popularItems}
        />
      </main>
    </div>
  );
}
