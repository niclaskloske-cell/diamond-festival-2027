"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { validateContact, hasContactErrors, type ContactFieldErrors } from "@/lib/contact";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

const EMPTY = { name: "", email: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onChange = (field: keyof typeof values, value: string) =>
    setValues((v) => ({ ...v, [field]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fieldErrors = validateContact(values);
    setErrors(fieldErrors);
    if (hasContactErrors(fieldErrors)) return;

    setStatus("sending");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(
          data.message ?? "Deine Nachricht konnte nicht gesendet werden.",
        );
        return;
      }
      setStatus("sent");
      setValues(EMPTY);
    } catch {
      setStatus("error");
      setErrorMessage("Verbindung fehlgeschlagen. Bitte prüfe deine Internetverbindung.");
    }
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-3 rounded-md border border-white/10 bg-surface p-10 text-center"
      >
        <CheckCircle2 className="size-8 text-success" />
        <p className="font-display text-lg font-extrabold uppercase text-white">
          Nachricht gesendet
        </p>
        <p className="max-w-sm text-sm text-muted">
          Danke für deine Nachricht — wir melden uns so schnell wie möglich zurück.
        </p>
        <button
          type="button"
          data-cursor="link"
          onClick={() => setStatus("idle")}
          className="mt-2 text-xs font-semibold uppercase tracking-[0.1em] text-diamond-light transition-colors hover:text-white"
        >
          Neue Nachricht schreiben
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-md border border-white/10 bg-surface p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          id="contact-name"
          label="Name"
          value={values.name}
          error={errors.name}
          onChange={(v) => onChange("name", v)}
          autoComplete="name"
        />
        <Field
          id="contact-email"
          label="E-Mail"
          type="email"
          value={values.email}
          error={errors.email}
          onChange={(v) => onChange("email", v)}
          autoComplete="email"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-muted"
        >
          Nachricht
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={values.message}
          onChange={(e) => onChange("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={cn(
            "w-full resize-none rounded-md border bg-surface-2 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-faint",
            errors.message ? "border-danger" : "border-white/12 focus:border-diamond",
          )}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1.5 text-xs text-danger">
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && errorMessage && (
        <div className="mt-4 flex items-start gap-3 rounded-md border border-warning/30 bg-warning/10 p-4">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
          <p className="text-sm text-warning">{errorMessage}</p>
        </div>
      )}

      <Button type="submit" loading={status === "sending"} className="mt-6 w-full sm:w-auto">
        Nachricht senden
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-muted"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "w-full rounded-md border bg-surface-2 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-faint",
          error ? "border-danger" : "border-white/12 focus:border-diamond",
        )}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
