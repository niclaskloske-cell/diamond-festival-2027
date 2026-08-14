/** Contact-form data shape, shared by the client (inline errors) and the API route (hard gate). */

export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function validateContact(input: Partial<ContactInput>): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  if (!input.name?.trim()) errors.name = "Bitte Namen angeben.";
  else if (input.name.trim().length < 2) errors.name = "Mindestens 2 Zeichen.";

  if (!input.email?.trim()) errors.email = "Bitte E-Mail-Adresse angeben.";
  else if (!EMAIL_RE.test(input.email.trim()))
    errors.email = "Diese E-Mail-Adresse sieht nicht gültig aus.";

  if (!input.message?.trim()) errors.message = "Bitte eine Nachricht schreiben.";
  else if (input.message.trim().length < 10)
    errors.message = "Die Nachricht ist noch etwas kurz.";
  else if (input.message.trim().length > 4000)
    errors.message = "Die Nachricht ist zu lang (max. 4000 Zeichen).";

  return errors;
}

export const hasContactErrors = (errors: ContactFieldErrors) =>
  Object.keys(errors).length > 0;
