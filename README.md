# Staff Scheduling, Training and Compliance Dashboard

I created this project after building my inventory system because I wanted to show a different part of my work experience. This one focuses on rotas, staff cover, training records, leave requests and everyday administrative follow-up.

It is a demonstration project with fictional names and records. It does not contain information from any employer or employee.

## What you can do in the web version

- View weekly shifts and see which ones need cover
- Change a shift's coverage status and see the dashboard update
- Review training dates and follow-up actions
- Check leave requests and cover arrangements
- Add administrative tasks
- Move tasks from not started to in progress and complete
- Search the current section
- Export records as CSV

Changes are saved in the visitor's browser with `localStorage`, so no account or database is needed for the demonstration.

## Excel version

The matching Excel workbook is included in the `downloads` folder and can also be downloaded from the web page. It uses formulas, dropdown lists, conditional formatting and a chart to summarise:

- Weekly shifts
- Shifts needing cover
- Training that is overdue or due soon
- Pending leave
- Open administrative tasks

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
