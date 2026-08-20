# Diamond Night — Ticketshop

Next.js-App für den Ticketverkauf zur Diamond Night (Muhabbet live). Verkauft über
Stripe Checkout, meldet bezahlte Bestellungen an die [Diamond Events
Plattform](https://github.com/niclaskloske-cell/diamond-events-platform), die die
Ticketcodes ausstellt und am Einlass scannt — dieser Shop selbst führt keine
Ticket-Wahrheit, nur den Verkauf.

## Lokal starten

```bash
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000). Für Checkout/Ticket-Ausgabe
werden die Variablen aus `.env.example` in einer lokalen `.env.local` benötigt.

## Deployment

Läuft produktiv auf **Render** unter [diamondfestival.de](https://diamondfestival.de) —
automatischer Deploy bei jedem Push auf `main`. Es gibt keine weitere Deploy-Zielumgebung.

Umgebungsvariablen werden im Render-Dashboard des Service gepflegt, nicht hier im Repo.
