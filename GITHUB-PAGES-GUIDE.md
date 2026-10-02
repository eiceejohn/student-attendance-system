# How to Publish with GitHub Pages

This beginner-friendly guide explains how to put the attendance website online with GitHub Pages.

## What is GitHub Pages?

GitHub Pages is a free way to publish HTML, CSS, and JavaScript files stored in a GitHub repository.

This project works with GitHub Pages because **index.html** is the main page and the website does not require a build step.

## Before uploading

Confirm that these files are in the top level of the project folder:

- index.html
- styles.css
- app.js
- database.js
- README.md
- .nojekyll

The **index.html** file must not be hidden inside another folder.

## Method 1: Upload through the GitHub website

### Create a repository

1. Sign in at [GitHub](https://github.com).
2. Click the **+** button in the upper-right corner.
3. Choose **New repository**.
4. Enter a repository name such as **student-attendance-system**.
5. Choose **Public**.
6. Click **Create repository**.

### Upload the files

1. Open the new repository.
2. Choose **Add file → Upload files**.
3. Select all files from the project folder.
4. Drag them into the GitHub upload area.
5. Enter a commit message.
6. Click **Commit changes**.

Important: **index.html** should be visible on the first page of the repository.

### Enable GitHub Pages

1. Open the repository **Settings**.
2. Select **Pages** from the left menu.
3. Under **Build and deployment**, find **Source**.
4. Choose **Deploy from a branch**.
5. Select the **main** branch.
6. Select the **/(root)** folder.
7. Click **Save**.

### Open the live website

Return to **Settings → Pages** after a few minutes. GitHub will show an address similar to:

    https://USERNAME.github.io/student-attendance-system/

Replace USERNAME with the GitHub account name. Publishing can take several minutes.

## Method 2: Upload with Git

Use this method when Git is already installed:

    git init
    git add .
    git commit -m "Initial student attendance system"
    git branch -M main
    git remote add origin https://github.com/USERNAME/student-attendance-system.git
    git push -u origin main

After pushing, follow the **Enable GitHub Pages** steps above.

## Updating the live website

When using Git:

    git add .
    git commit -m "Update attendance system"
    git push

GitHub Pages will publish the new version automatically.

## Fixing a 404 or blank page

1. Confirm that the filename is exactly **index.html**.
2. Confirm that **index.html** is in the repository root.
3. In **Settings → Pages**, confirm that **main** and **/(root)** are selected.
4. Check the **Actions** tab for a failed deployment.
5. Wait a few minutes.
6. Refresh with Ctrl+F5.
7. Confirm that **styles.css**, **app.js**, and **database.js** were uploaded.

## Attendance data reminder

Uploading the website does not create a shared online attendance database.

Each browser keeps its own local copy. Attendance entered on one phone or computer will not automatically appear on another device.

For this version, it is best to use one designated school computer or teacher laptop and create regular backups.

## Public repository safety

Anyone can read files in a public repository. The included sample students are fictional, which is safe for demonstration.

Do not add real student information, passwords, secret keys, or private documents to the source files.