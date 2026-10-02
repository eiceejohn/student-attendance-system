# Student Attendance Logging System

A simple, beginner-friendly website for recording student **Time In** and **Time Out**.

You can open **index.html** directly in a browser, or publish the project through Railway or GitHub Pages.

## Main features

- Add, edit, search, and delete students
- Organize students by grade, section, or course
- Record Time In and Time Out
- Automatically mark attendance as On time or Late
- Show daily totals for present students, late students, and recorded hours
- Filter attendance by date, section, or student
- Export attendance records as a CSV file
- Download and restore a JSON backup
- Switch between light and dark themes
- Use the system on a computer, tablet, or phone

## Included sample data

The first time the website opens, it creates:

- 100 fictional sample students
- 10 sections
- 10 students in each section
- Student IDs from 2026-001 to 2026-100

The sample students can be edited or deleted.

## Quick start

1. Open the project folder.
2. Double-click **index.html**.
3. The system will open in Chrome, Edge, Firefox, or another modern browser.

No installation is required for this basic method.

## How to record attendance

### Time In

1. Open the Dashboard.
2. Select a section.
3. Select a student.
4. Click **Time In**.

### Time Out

1. Select the same section and student.
2. Click **Time Out**.

A student is marked **Late** when the Time In is later than 8:15 AM.

## How to add a student

1. Open **Students**.
2. Click **New student**.
3. Enter the full name, Student ID, and grade or section.
4. Click **Save**.

The system automatically uses the grade or section to group and filter students.

## Attendance records

1. Open **Attendance Records**.
2. Use the date, section, or student filters when needed.
3. Click **Export CSV** to open the records in Excel or Google Sheets.

## Where is the data saved?

The current version stores data in the browser's local storage.

Think of it as a small notebook kept inside one browser:

- Closing or refreshing the browser does not remove the data.
- A different browser or device has a separate copy of the data.
- Clearing browser data may delete attendance records.
- Data does not automatically sync between devices.

This project does not yet use a shared online database. For regular school use, use one designated computer and create backups often.

## Backup and restore

To create a backup:

1. Click **Backup and restore** in the menu.
2. Click **Download backup**.
3. Keep the downloaded JSON file in a safe folder.

To restore a backup:

1. Open **Backup and restore**.
2. Click **Restore backup**.
3. Select a previously downloaded JSON backup.

## Project files

| File | Purpose |
| --- | --- |
| **index.html** | The main page opened by the browser |
| **styles.css** | Colors, layout, responsive design, and themes |
| **app.js** | Buttons, filters, tables, and screen actions |
| **database.js** | Students, attendance, sample data, and browser storage |
| **server.js** | Small web server used by Railway |
| **package.json** | Project and Railway start settings |
| **README.md** | Main beginner documentation |
| **GITHUB-PAGES-GUIDE.md** | GitHub Pages publishing guide |
| **RAILWAY-GUIDE.md** | Railway deployment guide |

## Publish with Railway

See [RAILWAY-GUIDE.md](RAILWAY-GUIDE.md) for detailed instructions.

Short version:

1. Push the project to GitHub.
2. In Railway, choose **New Project → Deploy from GitHub repo**.
3. Select the repository and deploy it.
4. Open **Settings → Networking**.
5. Click **Generate Domain**.

Railway automatically runs the included Node.js server and uses the port supplied by Railway.

## Publish with GitHub Pages

See [GITHUB-PAGES-GUIDE.md](GITHUB-PAGES-GUIDE.md) for detailed instructions.

Short version:

1. Open the repository settings on GitHub.
2. Select **Pages**.
3. Choose **Deploy from a branch**.
4. Select the **main** branch and **/(root)** folder.
5. Save and wait for the public link.

## Current limitations

- No login or password
- No teacher or administrator account
- No central online database
- No automatic syncing between devices
- Browser data can be removed when browser storage is cleared
- Regular backups are required

## Privacy reminder

The included 100 students are fictional. Do not place real student information directly in a public GitHub repository.

Actual attendance entered through the website stays in browser storage and is not included in the source files pushed to GitHub.