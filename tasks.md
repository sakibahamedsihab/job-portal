# Job Portal - Task & Sub-Task Breakdown

## Phase 1: The Engine Room (Backend Foundation)
* **Task 1.1: Server Initialization**
  * Sub-task: Sandbox - Raw Node.js HTTP server vs. Express.
  * Sub-task: Initialize `package.json` and install backend dependencies.
  * Sub-task: Setup `server.js` and `app.js` with global error handling.
* **Task 1.2: Database Connection**
  * Sub-task: Sandbox - Connecting to MongoDB using only the Native Driver.
  * Sub-task: Build `config/db.js` for connection pooling.
  * Sub-task: Test database ping on server startup.

## Phase 2: The Vault (Authentication & Users)
* **Task 2.1: Better Auth Integration**
  * Sub-task: Sandbox - How session cookies actually work.
  * Sub-task: Configure Better Auth on the Express backend.
  * Sub-task: Setup Next.js frontend route handlers for Better Auth.
* **Task 2.2: Role Management**
  * Sub-task: Define User schemas (Seeker, Recruiter, Admin) in BSON.
  * Sub-task: Create `middlewares/roleCheck.js` to protect backend routes.

## Phase 3: The Recruiter Flow (Companies & Jobs)
* **Task 3.1: Company Profiles**
  * Sub-task: Create backend POST/GET routes for Companies.
  * Sub-task: Build frontend `lib/companies.js` service fetches.
  * Sub-task: Build the UI form for Recruiter to register a company.
* **Task 3.2: Job Creation**
  * Sub-task: Create backend POST route for Jobs (Default status: 'Pending').
  * Sub-task: Link Job document to the Recruiter's Company ID.
  * Sub-task: Build the frontend UI for creating a job post.
* **Task 3.3: Job Editing**
  * Sub-task: Create backend PUT route for Jobs (Must reset status to 'Pending').

## Phase 4: The Admin Flow (Moderation)
* **Task 4.1: Job Approval System**
  * Sub-task: Sandbox - MongoDB aggregation to fetch only 'Pending' jobs.
  * Sub-task: Create backend GET route for Admin to view pending jobs.
  * Sub-task: Create backend PATCH route to update status (Approved/Rejected).
  * Sub-task: Build Admin UI to review and approve posts.

## Phase 5: The Seeker Flow (Job Board & Applications)
* **Task 5.1: The Global Job Board**
  * Sub-task: Create backend GET route to fetch all 'Approved' jobs.
  * Sub-task: Implement search and filtering logic in native MongoDB queries.
  * Sub-task: Build frontend `app/jobs/page.js` using Server-Side Rendering (SSR).
* **Task 5.2: The Application Engine**
  * Sub-task: Sandbox - MongoDB logic to count documents (Checking the 3-job limit).
  * Sub-task: Create backend POST route for Applications (Verify user limit & auth).
  * Sub-task: Build frontend UI to apply to a job.

## Phase 6: Dashboards & Reporting
* **Task 6.1: Seeker Dashboard**
  * Sub-task: Fetch and display user's application history and status.
* **Task 6.2: Recruiter Dashboard**
  * Sub-task: Fetch applicants for the recruiter's specific jobs.
  * Sub-task: Build UI to update applicant status (Hire/Reject).
* **Task 6.3: Reporting System**
  * Sub-task: Build frontend UI for Seekers to report a job.
  * Sub-task: Build Admin UI to view and dismiss/act on reports.