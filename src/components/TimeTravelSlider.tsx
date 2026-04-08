"use client";

import React from "react";
import { Slider } from "./ui/slider";
import { getLastEventRevision, queryKeys } from "@/queries";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function TimeTravelSlider() {
  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId");
  const timeTravelEnabled = searchParams.get("timeTravelEnabled");
  const doTimeTravel = timeTravelEnabled === "true";

  const { data: lastEventRevision } = useQuery({
    queryKey: queryKeys.lastEventRevision(cartId ?? ""),
    queryFn: () => {
      if (!cartId) return undefined;
      return getLastEventRevision(cartId);
    },
    enabled: doTimeTravel && Boolean(cartId),
  });

  if (!cartId || !doTimeTravel || lastEventRevision === undefined) {
    return null;
  }

  return (
    <Slider key={lastEventRevision} min={0} max={lastEventRevision} step={1} />
  );
}
