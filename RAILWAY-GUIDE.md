# How to Publish on Railway

This project is ready to deploy on Railway. It includes a small Node.js web server and does not require external packages.

## Railway-ready files

- **package.json** tells Railway how to start the project.
- **server.js** serves the website files.
- **/health** is a health-check address that confirms the server is running.

## Deployment steps

1. Push all project files to a GitHub repository.
2. Sign in at [Railway](https://railway.com/).
3. Click **New Project**.
4. Choose **Deploy from GitHub repo**.
5. Connect your GitHub account if Railway asks.
6. Select the student attendance repository.
7. Click **Deploy Now**.
8. Wait for the build and deployment to finish.
9. Open the service and go to **Settings → Networking**.
10. Click **Generate Domain**.

Railway will provide a public website address.

## How Railway starts the app

Railway detects **package.json** and runs:

    npm start

The server automatically uses the PORT value supplied by Railway. You do not need to create a custom port variable.

## Optional health check

In the Railway service settings, set the Healthcheck Path to:

    /health

A working server returns a response with an OK status.

## Updating the website

Edit the project, commit the changes, and push them to the connected GitHub branch. Railway normally creates a new deployment automatically.

If a deployment is waiting for approval, click **Deploy** or **Apply changes** in Railway.

## Important database reminder

Publishing on Railway makes the website public, but attendance is still stored in each browser's local storage.

- The teacher and students do not share one database.
- Attendance is not saved on the Railway server.
- Use **Backup and Restore** to protect the data.
- Use one designated device when possible.

A shared multi-device system would require a backend API and an online database such as Railway PostgreSQL.

## Test locally

If Node.js is installed, open a terminal in the project folder and run:

    npm start

Then open:

    http://localhost:3000

Test the health endpoint at:

    http://localhost:3000/health

## Troubleshooting

### Deployment fails

- Confirm that **package.json** and **server.js** are in the repository root.
- Read the Railway deployment logs.
- Remove any incorrect custom Start Command.

### No public link

Open **Settings → Networking** and click **Generate Domain**.

### Page loads without styling

Confirm that **index.html**, **styles.css**, **app.js**, and **database.js** are all in the repository root.