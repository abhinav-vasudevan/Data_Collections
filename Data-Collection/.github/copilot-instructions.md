# Copilot Instructions for Data-Collection Project

## Project Overview
This project is a full-stack data collection platform for hair & scalp analysis, built with Vite (frontend) and a backend originally in Express, now migrated to Vercel serverless functions. It collects participant metadata and image uploads for AI model training.

## Architecture
- **Frontend**: React (Vite), located in `client/`. Main entry: `client/src/App.tsx`, page logic in `client/src/pages/DataCollection.tsx`.
- **Backend**: Vercel serverless functions in `api/`. Key endpoints:
  - `api/submit.ts`: Accepts participant metadata (no file upload support in Vercel functions).
  - `api/participants.ts`: Returns all participants.
  - `api/participant.ts`: Returns a single participant and their images.
- **Database**: Uses Drizzle ORM with Postgres. Schema in `shared/schema.ts`. DB logic in `server/storage.ts` and `server/db.ts`.
- **Uploads**: Image upload logic was previously handled by Express/multer. Vercel serverless functions do not support direct file uploads; use third-party storage (S3, Cloudinary) for production.

## Developer Workflows
- **Build**: `npm run build` (outputs to `dist/`)
- **Dev**: `npm run dev` (local only; not used on Vercel)
- **Deploy**: Push to GitHub, connect repo to Vercel, Vercel auto-builds frontend and deploys API routes.
- **API Usage**: Frontend should call `/api/submit`, `/api/participants`, `/api/participant?id=...` for backend data.

## Conventions & Patterns
- **Frontend**: Uses Wouter for routing, TanStack React Query for data fetching, and Tailwind CSS for styling.
- **Backend**: All API logic should be in `/api` as Vercel serverless functions. Avoid Express-specific middleware.
- **Database Access**: Use Drizzle ORM via `server/storage.ts` and `server/db.ts`. Schema types in `shared/schema.ts`.
- **Error Handling**: API routes return JSON with `success`, `message`, and error details.
- **File Uploads**: Not supported in Vercel API routes. For uploads, integrate with S3/Cloudinary and store URLs in DB.

## Integration Points
- **External DB**: Requires `DATABASE_URL` environment variable for Postgres.
- **Third-party Storage**: For image uploads, use S3/Cloudinary and update API/DB logic accordingly.

## Examples
- To add a new API route, create a file in `/api` and export a default handler with `(req, res)` signature.
- To fetch participants in frontend:
  ```js
  fetch('/api/participants').then(res => res.json())
  ```
- To submit participant data:
  ```js
  fetch('/api/submit', { method: 'POST', body: JSON.stringify(data) })
  ```

## Key Files
- `client/src/App.tsx`, `client/src/pages/DataCollection.tsx`: Main frontend logic
- `api/submit.ts`, `api/participants.ts`, `api/participant.ts`: Main backend endpoints
- `shared/schema.ts`, `server/storage.ts`, `server/db.ts`: Database schema and access

---

If any section is unclear or missing, please provide feedback for improvement.