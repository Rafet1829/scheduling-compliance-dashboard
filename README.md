# Staff Scheduling, Training and Compliance Dashboard

I created this project after building my inventory system because I wanted to show a different part of my work experience. This one focuses on rotas, staff cover, training records, leave requests and everyday administrative follow-up.

It is a demonstration project with fictional names and records. It does not contain information from any employer or employee.

## Rota management

The rota is fully editable in the browser. You can:

- Create a shift with its date, start time, end time and required role
- Select a staff member from the staff directory
- Assign a specific task and add handover notes
- Edit or remove an existing shift
- See the calculated shift length and total scheduled hours
- Identify unassigned shifts automatically
- See a warning when the same person has overlapping shifts

The staff directory holds each person's usual role, availability and weekly hours. Adding someone to the directory makes them available in the rota assignment list.

## Other sections

- Training records with due dates and follow-up actions
- Leave requests and cover arrangements
- Administrative tasks that move from not started to in progress and complete
- Dashboard totals for shifts, cover, training and open work
- Search and CSV export

Changes are saved in the visitor's browser with `localStorage`, so no account or database is needed for the demonstration.

## Excel version

The matching Excel workbook is included in the `downloads` folder and can also be downloaded from the web page. It uses formulas, dropdown lists, conditional formatting and a chart to summarise staffing, training, leave and administrative actions.

## Technology

- HTML
- CSS
- JavaScript
- Microsoft Excel
- GitHub Pages

There is no framework, package installation or build step.

## Run it locally

Download the repository and open `index.html`. You can also serve the folder locally:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Why I built it

My work has involved staff coordination, training colleagues, supporting rotas and keeping operational records. I made this project to practise presenting those responsibilities in a clear office-administration format.

If I later develop it as a real multi-user system, I would add authentication and a database. For now, keeping it as a static demonstration makes it easy for anyone to review.
