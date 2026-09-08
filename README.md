# Staff Scheduling, Training & Compliance Dashboard

A responsive, code-based portfolio demonstration by **Rafet**. It shows how operational experience can be translated into staff scheduling, training administration, leave coordination, task management and reporting.

## What the demo does

- Summarises weekly shifts, uncovered shifts, training actions and open tasks
- Creates, edits and removes rota shifts
- Assigns staff members and specific tasks to each shift
- Updates coverage automatically when a person is assigned or removed
- Flags overlapping assignments for the same person
- Maintains a staff directory with roles, availability and weekly hours
- Tracks training due dates and follow-up actions
- Records leave decisions and cover arrangements
- Adds administrative tasks and moves them through a simple workflow
- Searches the current view and exports records as CSV
- Saves changes locally in the visitor's browser using `localStorage`
- Provides the matching modern Excel workbook as a direct download

All names and records are fictional. No employer or employee data is included.

## Run locally

No build tools or packages are required. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a new public repository, for example `scheduling-compliance-dashboard`.
2. Upload every file from this folder to the repository root.
3. Open **Settings → Pages** in the repository.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. GitHub will provide a URL similar to `https://rafet1829.github.io/scheduling-compliance-dashboard/`.

## Future live version

If this later becomes a real working application, the same interface can be connected to Supabase for authenticated data storage and deployed through Cloudflare Pages. A real version should use Row Level Security, per-user ownership policies and a publishable client key—never a Supabase service-role key in browser code.

## Portfolio wording

Describe this as a **personal portfolio project using fictional sample data**, not as a system deployed by an employer.
