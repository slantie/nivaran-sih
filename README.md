# Nivaran — Unified Grievance Lodging Demo

A polished, frontend-only portfolio demonstration for the **“Unified Portal for Grievance Lodging”** concept. Built with Next.js, TypeScript, Tailwind CSS, and shadcn-style UI primitives.

> Project status: prototype / portfolio demo only. It is not deployed, government-integrated, production-tested, or connected to a backend, identity provider, notification system, or database.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Create an optimized production build with:

```bash
npm run build
npm run start
```

## Verified presentation facts

The supplied `Final Presentation.pdf` identifies:

- SIH 2023, PS code **SIH1516**
- Ministry: **Ministry of Housing and Urban Affairs**
- Problem statement title: **Unified Portal for Grievance Lodging**
- Proposed idea elements: chatbot-assisted lodging, text or voice query input, status checking, user notifications, departmental handling, feedback/survey loop, government oversight, monitoring and reporting.
- Mentioned use-case areas: housing and urban affairs, public services, healthcare, education, employment, utility services, transportation and e-commerce.

The presentation does not specify required visual brand assets, real department identifiers, data structures, SLAs, security policy, integration endpoints, authentication details, or exact operational metrics.

## Included demo journeys

- Public landing page with proposed process explanation and primary actions.
- Accessible multi-step grievance flow: contact information, category, location, urgency, description, local attachment mock, review, and deterministic reference generation.
- Reference-based tracking with loading, empty, validation-friendly and not-found experiences.
- Citizen dashboard with sample case search/filtering, detail view, local feedback, and a simulated reopen action.
- Administration dashboard with local queue filters, derived summary cards, department workload chart, assignment, and status-change controls.
- Responsive desktop/tablet/mobile layout with semantic labels and visible focus treatment.

## Demo references and local data

Use `JSP-2026-00482` to view the seeded tracking timeline. All cases, contacts, names, departments, timestamps, and outcomes in the interface are fictional sample data. New submissions and modifications exist only in React state until the page is reloaded.

## Routing simulation

The presentation proposes automation/chatbot-based handling. This implementation intentionally uses transparent, deterministic category rules such as `Water supply → Water Board` and `Roads & transport → Public Works`. It is labeled as a **routing simulation** throughout the UI; it is not an AI model or deployed routing service.

## Architecture

```
app/page.tsx          Interactive portal screens, fixture data, local logic
components/ui/*       shadcn-style Button, Card and Badge primitives
app/globals.css       Theme, responsive styling and accessible focus treatment
```

No backend, API keys, authentication provider, uploaded evidence storage, or paid service is required for the primary demo journey.

## Presentation-sourced functionality vs. demo enhancements

| Presentation-sourced / proposed      | Demo enhancements added for a usable portfolio prototype                  |
| ------------------------------------ | ------------------------------------------------------------------------- |
| Unified lodging and tracking         | Multi-step form, review step, generated local reference                   |
| Chatbot / automation concept         | Inspectable category-to-department routing simulation                     |
| Departmental grievance handling      | Local admin queue with assignment/status controls                         |
| Notifications and real-time updates  | Static activity timeline and a non-functional “Enable updates” affordance |
| Feedback loop, surveys and reporting | Local feedback/reopen controls and lightweight workload bars              |
| Government dashboard                 | Responsive admin dashboard based on fictional seeded records              |

## Limitations

- Evidence selection is visual only; no file is uploaded or retained.
- “Voice,” chatbot, multilingual support, notifications, surveys, escalations, appointments, and reports are proposed by the presentation but not implemented as live services here.
- The app makes no claim of affiliation with, approval by, or deployment for any government institution.
- There is no production authentication, authorization, privacy handling, audit log, database persistence, live analytics, or integration.

## Screenshots

Desktop and mobile views were captured from the running local application during validation. Re-capture locally at your preferred viewport after `npm run dev`; the app has no external visual/image dependencies.
