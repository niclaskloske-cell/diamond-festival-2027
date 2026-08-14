import { AlertTriangle, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export function StepPayment({
  totalCents,
  loading,
  error,
  onPay,
}: {
  totalCents: number;
  loading: boolean;
  error: string | null;
  onPay: () => void;
}) {
  return (
    <div>
      <h3 className="font-display text-xl font-extrabold uppercase text-white">
        Bezahlung
      </h3>
      <p className="mt-1 text-sm text-muted">
        Du wirst zur sicheren Zahlungsseite weitergeleitet.
      </p>

      <div className="mt-6 flex items-center gap-3 rounded-md border border-white/10 bg-surface-2 p-4">
        <ShieldCheck className="size-5 shrink-0 text-diamond-light" />
        <p className="text-xs text-muted">
          Verschlüsselte Verbindung. Es werden keine Zahlungsdaten auf dieser Seite
          gespeichert.
        </p>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-md border border-warning/30 bg-warning/10 p-4">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
          <p className="text-sm text-warning">{error}</p>
        </div>
      )}

      <Button
        onClick={onPay}
        loading={loading}
        size="lg"
        className="mt-6 w-full"
      >
        {formatPrice(totalCents)} bezahlen
      </Button>
    </div>
  );
}
