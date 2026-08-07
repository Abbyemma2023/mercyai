# MercyAI

MercyAI is an AI Workforce Platform where businesses can hire AI Employees.

## Foundation

This repository uses Next.js with TypeScript, Tailwind CSS, the App Router, and ESLint.

The codebase follows clean architecture with dependencies directed inward:

- `src/core/domain`: business entities and rules.
- `src/core/application`: use cases and application services.
- `src/core/ports`: interfaces implemented by external adapters.
- `src/infrastructure`: framework, persistence, and third-party adapters.
- `src/presentation`: delivery-layer components and view models.
- `src/app`: Next.js App Router composition layer.
- `src/shared`: cross-cutting utilities with no business ownership.
- `tests/unit` and `tests/integration`: automated test suites.

No product pages or features are implemented in this milestone.

## Commands

```bash
npm run dev
npm run lint
npm run build
```
