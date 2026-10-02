# Paano I-upload at I-live sa GitHub Pages

Ang guide na ito ay para sa beginner. Hindi kailangan maging programmer.

## Ano ang GitHub?

Ang GitHub ay website kung saan maaaring i-save at ipakita online ang project files.

## Ano ang GitHub Pages?

Ang GitHub Pages ay libreng paraan para gawing live website ang mga HTML, CSS, at JavaScript files na nasa GitHub repository.

Ang attendance project na ito ay puwedeng i-host sa GitHub Pages dahil puro static files lamang ito at may `index.html` na pangunahing page.

## Bago magsimula

Kailangan mo ng:

- GitHub account
- Internet connection
- Kumpletong project folder
- Ang `index.html` ay dapat nasa pinakataas na bahagi ng repository

Siguraduhing kasama ang mga sumusunod:

- `index.html`
- `styles.css`
- `app.js`
- `database.js`
- `README.md`
- `GITHUB-PAGES-GUIDE.md`
- `.nojekyll`

## Paraan 1: Upload gamit ang GitHub website

Ito ang pinakamadaling paraan.

### Step 1 — Gumawa ng repository

1. Mag-login sa [GitHub](https://github.com).
2. Pindutin ang **+** sa upper-right corner.
3. Piliin ang **New repository**.
4. Sa Repository name, puwedeng ilagay ang `student-attendance-system`.
5. Maglagay ng maikling description kung gusto.
6. Piliin ang **Public**. Ito ang pinakamadaling option para sa GitHub Pages gamit ang libreng GitHub account.
7. Huwag nang magpa-create ng bagong README dahil may kasama nang `README.md` ang project.
8. Pindutin ang **Create repository**.

### Step 2 — I-upload ang files

1. Sa bagong repository, pindutin ang **uploading an existing file** o **Add file → Upload files**.
2. Buksan ang folder na:
   `C:\eicee desktop\attendance-logging`
3. Piliin ang lahat ng project files.
4. I-drag ang files papunta sa GitHub upload area.
5. Sa commit message, ilagay ang `Initial student attendance system`.
6. Pindutin ang **Commit changes**.

Mahalaga: Dapat direktang nakikita ang `index.html` sa unang page ng repository. Huwag ilagay ang buong project sa isa pang nested folder.

Tama:

~~~text
student-attendance-system/
├── index.html
├── styles.css
├── app.js
├── database.js
├── README.md
└── .nojekyll
~~~

Mali:

~~~text
student-attendance-system/
└── attendance-logging/
    ├── index.html
    └── styles.css
~~~

### Step 3 — I-enable ang GitHub Pages

1. Sa repository, pindutin ang **Settings**.
2. Sa kaliwang menu, hanapin ang **Pages**.
3. Sa **Build and deployment**, hanapin ang **Source**.
4. Piliin ang **Deploy from a branch**.
5. Sa Branch, piliin ang **main**.
6. Sa folder, piliin ang **/(root)**.
7. Pindutin ang **Save**.

Ito ang publishing method na inirerekomenda ng GitHub para sa simpleng site na hindi nangangailangan ng special build process.

### Step 4 — Hintayin ang live link

Bumalik sa **Settings → Pages** pagkatapos ng ilang minuto.

Makikita mo ang link na katulad nito:

~~~text
https://USERNAME.github.io/student-attendance-system/
~~~

Palitan ng GitHub username mo ang `USERNAME`.

Maaaring umabot nang hanggang 10 minuto bago maging available ang site.

## Paraan 2: Upload gamit ang Git commands

Optional lamang ito. Gamitin kung may Git ka na sa computer.

Buksan ang terminal sa project folder, pagkatapos ay gamitin ang sumusunod:

~~~text
git init
git add .
git commit -m "Initial student attendance system"
git branch -M main
git remote add origin https://github.com/USERNAME/student-attendance-system.git
git push -u origin main
~~~

Palitan ang `USERNAME` ng tunay mong GitHub username.

Pagkatapos mag-push, sundin ang **Step 3 — I-enable ang GitHub Pages**.

## Paano mag-update ng live website?

### Kung GitHub website ang gamit

1. Buksan ang repository.
2. Piliin ang file na babaguhin.
3. Pindutin ang pencil o edit button.
4. Gawin ang pagbabago.
5. Pindutin ang **Commit changes**.

Para sa maraming files, gamitin ulit ang **Add file → Upload files** at i-upload ang updated files na may parehong pangalan.

### Kung Git ang gamit

~~~text
git add .
git commit -m "Update attendance system"
git push
~~~

Awtomatikong ire-republish ng GitHub Pages ang bagong version.

## Kapag 404 o blank page

Subukan ang sumusunod:

1. Siguraduhing `index.html` ang eksaktong filename—lowercase at walang dagdag na extension.
2. Siguraduhing nasa root o pinakataas ng repository ang `index.html`.
3. Sa **Settings → Pages**, tiyaking `main` at `/(root)` ang napili.
4. Tingnan ang **Actions** tab kung may failed deployment.
5. Maghintay nang hanggang 10 minuto.
6. I-refresh gamit ang Ctrl+F5 para hindi lumang cache ang makita.
7. Siguraduhing na-upload ang `styles.css`, `app.js`, at `database.js`.

Official troubleshooting guide: [GitHub Pages 404 errors](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)

## Mahalagang paliwanag tungkol sa attendance data

Ang pag-upload sa GitHub ay naglalagay lamang ng website files online. Hindi nito ginagawang online shared database ang browser storage.

Bawat browser at device ay may sariling copy ng:

- Student list
- Attendance records
- Backup state

Ibig sabihin, kung gagamitin ng maraming students ang sariling cellphone nila, magkakahiwalay ang records. Para sa kasalukuyang version, pinakamainam na isang designated school computer o teacher laptop ang gamitin sa pag-log.

## Ligtas bang public ang repository?

Ang source code ay maaaring makita ng kahit sino kapag public ang repository. Okay lamang ito dahil fictional ang kasamang sample students.

Huwag maglagay sa project files ng:

- Password
- Personal student information
- Secret key
- Private school records
- API credentials

GitHub Pages sites are publicly accessible, kaya laging suriin ang files bago i-upload.

## Bakit may `.nojekyll` file?

May built-in site builder ang GitHub Pages na tinatawag na Jekyll. Hindi ito kailangan ng project na ito.

Ang empty `.nojekyll` file ay nagsasabi sa GitHub na direktang i-publish ang static HTML, CSS, at JavaScript files.

## Official GitHub references

- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Configuring the publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Troubleshooting 404 errors](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)