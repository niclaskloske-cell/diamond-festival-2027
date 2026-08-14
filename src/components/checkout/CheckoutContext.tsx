"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import type { TicketTierId } from "@/data/tickets";

type CheckoutState = {
  open: boolean;
  tierId: TicketTierId | null;
  /** Bumped on every openCheckout call — used to key-remount the flow so its
   *  local step/quantity/customer state resets without an effect. */
  nonce: number;
};

type CheckoutContextValue = {
  state: CheckoutState;
  openCheckout: (tierId: TicketTierId) => void;
  closeCheckout: () => void;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

/** Wraps the page so any "TICKET KAUFEN" button anywhere can open the flow. */
export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CheckoutState>({
    open: false,
    tierId: null,
    nonce: 0,
  });

  const openCheckout = useCallback((tierId: TicketTierId) => {
    setState((s) => ({ open: true, tierId, nonce: s.nonce + 1 }));
  }, []);

  const closeCheckout = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  const value = useMemo(
    () => ({ state, openCheckout, closeCheckout }),
    [state, openCheckout, closeCheckout],
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used inside CheckoutProvider");
  return ctx;
}
