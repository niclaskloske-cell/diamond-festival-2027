/**
 * TICKET-PDF
 * ==========
 * Ein PDF, eine Seite pro Ticket — Boarding-Pass-Format (A6 quer), links die
 * Eventdaten und der Name des Ticketinhabers, rechts ein großer, scanbarer
 * QR-Code. Wird live im API-Handler erzeugt, nichts liegt auf Vorrat auf der
 * Platte — dieselbe Bestellung ergibt jedes Mal dasselbe PDF.
 */

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

import { festival } from "@/data/festival";
import type { PaidOrderSummary } from "@/lib/payments";

const PAGE_WIDTH = 420;
const PAGE_HEIGHT = 298;
const DIVIDER_X = 250;

const ACCENT = rgb(0.298, 0.667, 0.788); // Diamond Blue, passend zur Website
const INK = rgb(0.06, 0.06, 0.08);
const MUTED = rgb(0.42, 0.42, 0.46);
const LINE = rgb(0.85, 0.85, 0.87);

export type TicketForPdf = { code: string; position: number };

export async function generateTicketsPdf(
  order: PaidOrderSummary,
  orderNumber: string,
  tickets: TicketForPdf[],
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${festival.fullName} — Tickets`);
  pdf.setAuthor(festival.organiser);
  pdf.setSubject(`Bestellung ${orderNumber}`);

  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);

  for (const ticket of tickets) {
    const holder = order.holders[ticket.position - 1];
    const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - 5,
      width: PAGE_WIDTH,
      height: 5,
      color: ACCENT,
    });
    page.drawLine({
      start: { x: DIVIDER_X, y: 18 },
      end: { x: DIVIDER_X, y: PAGE_HEIGHT - 18 },
      thickness: 1,
      color: LINE,
      dashArray: [3, 3],
    });

    const left = 24;
    let y = PAGE_HEIGHT - 34;

    page.drawText(festival.name.toUpperCase(), { x: left, y, size: 17, font: bold, color: INK });
    y -= 16;
    page.drawText("MUHABBET LIVE", { x: left, y, size: 8.5, font: regular, color: MUTED });

    y -= 26;
    page.drawText(order.tierName, { x: left, y, size: 12, font: bold, color: ACCENT });

    y -= 22;
    const holderName = holder ? `${holder.firstName} ${holder.lastName}` : "—";
    page.drawText(holderName, { x: left, y, size: 13, font: bold, color: INK, maxWidth: DIVIDER_X - left - 10 });
    if (holder?.birthDate) {
      y -= 14;
      page.drawText(`geb. ${formatDatePdf(holder.birthDate)}`, {
        x: left,
        y,
        size: 8.5,
        font: regular,
        color: MUTED,
      });
    }

    y -= 24;
    page.drawText(festival.dateLabel, { x: left, y, size: 10, font: bold, color: INK });
    y -= 13;
    page.drawText(`Einlass ${festival.doorsOpen} · Beginn ${festival.showStart}`, {
      x: left,
      y,
      size: 8.5,
      font: regular,
      color: MUTED,
    });
    y -= 13;
    page.drawText(festival.location.venue, { x: left, y, size: 8.5, font: regular, color: MUTED });

    y -= 22;
    if (tickets.length > 1) {
      page.drawText(`Ticket ${ticket.position} von ${tickets.length}`, {
        x: left,
        y,
        size: 8,
        font: bold,
        color: ACCENT,
      });
      y -= 12;
    }
    page.drawText(`Bestellnummer ${orderNumber}`, { x: left, y, size: 7.5, font: regular, color: MUTED });

    page.drawText("Einlass ab 18 Jahren — bitte Ausweis mitbringen.", {
      x: left,
      y: 30,
      size: 7,
      font: regular,
      color: MUTED,
    });
    page.drawText(`${festival.contact.email} · ${festival.contact.phone}`, {
      x: left,
      y: 18,
      size: 7,
      font: regular,
      color: MUTED,
    });

    // Höhere Fehlerkorrektur (Q) als auf der Website-Anzeige (M) — ein
    // ausgedrucktes Ticket verträgt eher einen Knick oder Kaffeefleck.
    const qrPng = await QRCode.toBuffer(ticket.code, {
      type: "png",
      errorCorrectionLevel: "Q",
      margin: 1,
      width: 600,
      color: { dark: "#0d0d0f", light: "#ffffff" },
    });
    const qrImage = await pdf.embedPng(qrPng);
    const qrSize = 150;
    const qrX = DIVIDER_X + (PAGE_WIDTH - DIVIDER_X - qrSize) / 2;
    const qrY = (PAGE_HEIGHT - qrSize) / 2 + 14;
    page.drawImage(qrImage, { x: qrX, y: qrY, width: qrSize, height: qrSize });

    const codeWidth = regular.widthOfTextAtSize(ticket.code, 8);
    page.drawText(ticket.code, {
      x: qrX + (qrSize - codeWidth) / 2,
      y: qrY - 14,
      size: 8,
      font: regular,
      color: INK,
    });
  }

  return pdf.save();
}

function formatDatePdf(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
