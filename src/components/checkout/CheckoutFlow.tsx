"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/checkout/StepIndicator";
import { StepTier } from "@/components/checkout/steps/StepTier";
import { StepQuantity } from "@/components/checkout/steps/StepQuantity";
import { StepCustomer } from "@/components/checkout/steps/StepCustomer";
import { StepSummary } from "@/components/checkout/steps/StepSummary";
import { StepPayment } from "@/components/checkout/steps/StepPayment";
import { useCheckout } from "@/components/checkout/CheckoutContext";
import {
  calculateOrderTotals,
  getTier,
  type TicketStatusMap,
  type TicketTierId,
} from "@/data/tickets";
import { validateCustomer, hasErrors, type FieldErrors } from "@/lib/orders";
import type { Customer } from "@/lib/payments";

const EASE = [0.16, 1, 0.3, 1] as const;
const EMPTY_CUSTOMER: Customer = {
  firstName: "",
  lastName: "",
  birthDate: "",
  email: "",
  phone: "",
};

/**
 * Modal shell. `CheckoutFlowContent` is remounted via `key={state.nonce}` on
 * every openCheckout call, which resets its local step/quantity/customer
 * state for free — no reset effect needed, and the content stays mounted
 * while the modal exit-animates instead of vanishing on close.
 */
export function CheckoutFlow({ statuses }: { statuses: TicketStatusMap }) {
  const { state, closeCheckout } = useCheckout();

  return (
    <Modal open={state.open} onClose={closeCheckout} labelledBy="checkout-title">
      <CheckoutFlowContent
        key={state.nonce}
        initialTierId={state.tierId}
        statuses={statuses}
      />
    </Modal>
  );
}

function CheckoutFlowContent({
  initialTierId,
  statuses,
}: {
  initialTierId: TicketTierId | null;
  statuses: TicketStatusMap;
}) {
  const [step, setStep] = useState(1);
  const [tierId, setTierId] = useState<TicketTierId | null>(initialTierId);
  const [quantity, setQuantity] = useState(1);
  const [customer, setCustomer] = useState<Customer>(EMPTY_CUSTOMER);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const tier = tierId ? getTier(tierId) : undefined;
  const totals = tier ? calculateOrderTotals(tier.priceCents, quantity) : null;

  const goNext = () => {
    if (step === 3) {
      const fieldErrors = validateCustomer(customer);
      setErrors(fieldErrors);
      if (hasErrors(fieldErrors)) return;
    }
    setStep((s) => Math.min(5, s + 1));
  };
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const handlePay = async () => {
    if (!tier) return;
    setPaying(true);
    setPayError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ tierId: tier.id, quantity }],
          customer,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPayError(
          data.message ??
            "Die Zahlung ist aktuell nicht verfügbar. Bitte versuche es später erneut.",
        );
        return;
      }
      window.location.href = data.redirectUrl;
    } catch {
      setPayError("Verbindung fehlgeschlagen. Bitte prüfe deine Internetverbindung.");
    } finally {
      setPaying(false);
    }
  };

  const canAdvance = step === 1 ? Boolean(tierId) : true;

  return (
    <div className="p-6 sm:p-8">
      <h2 id="checkout-title" className="sr-only">
        Ticket-Kauf
      </h2>
      <StepIndicator current={step} />

      <div className="mt-8 min-h-[19rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {step === 1 && (
              <StepTier
                selected={tierId}
                statuses={statuses}
                onSelect={(id) => setTierId(id)}
              />
            )}
            {step === 2 && tier && (
              <StepQuantity tier={tier} quantity={quantity} onChange={setQuantity} />
            )}
            {step === 3 && (
              <StepCustomer
                customer={customer}
                errors={errors}
                onChange={(field, value) =>
                  setCustomer((c) => ({ ...c, [field]: value }))
                }
              />
            )}
            {step === 4 && tier && totals && (
              <StepSummary
                tier={tier}
                quantity={quantity}
                customer={customer}
                {...totals}
              />
            )}
            {step === 5 && totals && (
              <StepPayment
                totalCents={totals.totalCents}
                loading={paying}
                error={payError}
                onPay={handlePay}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {step < 5 && (
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            data-cursor="link"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted transition-colors hover:text-white disabled:opacity-0"
          >
            <ArrowLeft className="size-3.5" />
            Zurück
          </button>
          <Button
            onClick={goNext}
            disabled={!canAdvance}
            icon={<ArrowRight className="size-4" />}
          >
            Weiter
          </Button>
        </div>
      )}
      {step === 5 && (
        <button
          type="button"
          onClick={goBack}
          data-cursor="link"
          className="mt-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted transition-colors hover:text-white"
        >
          <ArrowLeft className="size-3.5" />
          Zurück zur Übersicht
        </button>
      )}
    </div>
  );
}
