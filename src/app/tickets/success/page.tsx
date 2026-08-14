import type { Metadata } from "next";

import { SuccessExperience } from "@/components/sections/success/SuccessExperience";
import { EmptyOrderState } from "@/components/sections/success/EmptyOrderState";
import { getTier } from "@/data/tickets";

export const metadata: Metadata = { title: "Bestellbestätigung", robots: { index: false } };

type SearchParams = Promise<{
  order?: string;
  tier?: string;
  qty?: string;
  name?: string;
}>;

/**
 * Reached after a successful checkout-provider redirect
 * (`successUrl` in src/lib/payments.ts). Until a payment provider is wired
 * up, nothing can redirect here with real data — so a visit without the
 * expected query params renders an honest empty state instead of a
 * fabricated order.
 */
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const tier = params.tier ? getTier(params.tier as never) : undefined;
  const quantity = Number(params.qty ?? "0");

  if (!params.order || !tier || !Number.isFinite(quantity) || quantity < 1) {
    return <EmptyOrderState />;
  }

  return (
    <SuccessExperience
      reference={params.order}
      tierName={tier.name}
      quantity={quantity}
      name={params.name ?? ""}
    />
  );
}
