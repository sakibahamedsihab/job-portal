# Job Portal — Implementation Review

## Overview

This document compares the planned tasks in `tasks.md` against the actual project state. The project is in early development — backend scaffolding and frontend auth are wired up, but most business logic (companies, jobs, applications, dashboards) has not been started.

---

## Phase 1: The Engine Room (Backend Foundation)

| # | Sub-task | Status | Notes |
|---|---|---|---|
| 1.1 | Sandbox — Raw Node.js vs Express | ❌ Not done | Sandbox/exploration task; no traces found |
| 1.1 | Init `package.json` & install backend deps | ✅ Done | Express 5.2.1, cors, dotenv, mongodb 7.5.0 |
| 1.1 | Setup `server.js` & `app.js` with global error handling | ⚠️ Partial | Files exist, but **no global error-handling middleware** is present |
| 1.2 | Sandbox — Native MongoDB driver | ❌ Not done | Sandbox/exploration task |
| 1.2 | Build `config/db.js` for connection pooling | ✅ Done | `connectDB()` + `getDB()` using `MongoClient` |
| 1.2 | Test database ping on server startup | ⚠️ Partial | Logs "Successfully connected" but no explicit `ping()` command |

## Phase 2: The Vault (Authentication & Users)

| # | Sub-task | Status | Notes |
|---|---|---|---|
| 2.1 | Sandbox — Session cookies | ❌ Not done | Sandbox/exploration task |
| 2.1 | Configure Better Auth on the **Express backend** | ❌ **Missing** | Better Auth is only set up in the **frontend** (Next.js API route). The Express backend has no auth config at all |
| 2.1 | Setup Next.js frontend route handlers for Better Auth | ✅ Done | `app/api/auth/[...all]/route.js` wired up with `toNextJsHandler(auth)` |
| 2.2 | Define User schemas (Seeker, Recruiter, Admin) in BSON | ❌ Missing | No models or collection schemas exist anywhere |
| 2.2 | Create `middlewares/roleCheck.js` | ❌ Missing | No `middlewares/` directory exists |

## Phase 3: The Recruiter Flow (Companies & Jobs)

| # | Sub-task | Status | Notes |
|---|---|---|---|
| 3.1 | Backend POST/GET routes for Companies | ❌ Not done | |
| 3.1 | Frontend `lib/companies.js` service | ❌ Not done | |
| 3.1 | UI form for Recruiter to register a company | ❌ Not done | |
| 3.2 | Backend POST route for Jobs (status: "Pending") | ❌ Not done | |
| 3.2 | Link Job document to Recruiter's Company ID | ❌ Not done | |
| 3.2 | Frontend UI for creating a job post | ❌ Not done | |
| 3.3 | Backend PUT route for Jobs (reset status to "Pending") | ❌ Not done | |

## Phase 4: The Admin Flow (Moderation)

| # | Sub-task | Status | Notes |
|---|---|---|---|
| 4.1 | Sandbox — MongoDB aggregation for pending jobs | ❌ Not done | |
| 4.1 | Backend GET route for pending jobs | ❌ Not done | |
| 4.1 | Backend PATCH route to approve/reject | ❌ Not done | |
| 4.1 | Admin UI to review and approve posts | ❌ Not done | |

## Phase 5: The Seeker Flow (Job Board & Applications)

| # | Sub-task | Status | Notes |
|---|---|---|---|
| 5.1 | Backend GET route for approved jobs (search/filter) | ❌ Not done | |
| 5.1 | Build `app/jobs/page.js` using **SSR** | ⚠️ **Different approach** | File exists but uses `"use client"` (CSR) with **hardcoded dummy data** instead of SSR + backend fetch |
| 5.2 | Sandbox — MongoDB count (3-job limit) | ❌ Not done | |
| 5.2 | Backend POST route for Applications (with limit check) | ❌ Not done | |
| 5.2 | Frontend UI to apply to a job | ❌ Not done | |

## Phase 6: Dashboards & Reporting

| # | Sub-task | Status | Notes |
|---|---|---|---|
| 6.1 | Seeker Dashboard (application history) | ❌ Not done | |
| 6.2 | Recruiter Dashboard (applicants + status update) | ❌ Not done | |
| 6.3 | Reporting system (Seeker report + Admin moderation) | ❌ Not done | |

---

## Key Deviations from `tasks.md`

### 1. Better Auth on Express (Task 2.1) — Not Done
The task explicitly says "Configure Better Auth on the Express backend," but the Express app has zero auth integration. Auth is handled exclusively through Next.js API routes. This is the biggest architectural deviation — the backend is currently unprotected.

### 2. Job Board uses CSR + dummy data instead of SSR (Task 5.1)
The task says to build `app/jobs/page.js` using **Server-Side Rendering (SSR)** fetched from the backend. The actual file uses `"use client"` (Client-Side Rendering) with 3 hardcoded dummy jobs.

### 3. No global error handling (Task 1.1)
`app.js` has no error-handling middleware (`(err, req, res, next)`). The task specifically mentions setting up "global error handling."

### 4. Database name mismatch
- Backend `config/db.js` → `"job_portal_db"`
- Frontend `auth.js` → `"job_portal"`

These are different databases, which will cause data sharing issues between frontend auth and backend routes.

### 5. No backend `start` script
`package.json` only has a placeholder `"test"` script — no `"start"` or `"dev"` script for running the Express server.

### 6. Homepage (`/`) is untouched
Still shows the default `create-next-app` boilerplate — not customized for the job portal.

### 7. Exposed credentials in `.env`
Backend `.env` is not gitignored (`backend/.gitignore` doesn't exist for it). MongoDB credentials (username, password, connection string) are committed to the repo. Frontend properly ignores `.env*` in its `.gitignore`.

---

## Summary

| Category | Count |
|---|---|
| ✅ Fully implemented | 4 sub-tasks |
| ⚠️ Partially implemented | 2 sub-tasks |
| ❌ Missing / not started | 14 sub-tasks |
| 🔶 Architectural deviation from spec | 2 items |
