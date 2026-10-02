# Student Attendance Logging System

Isang simple at madaling gamiting website para sa pag-record ng **Time In** at **Time Out** ng mga estudyante.

Hindi kailangan ng installation, account, o server. Buksan lamang ang `index.html` gamit ang browser.

## Ano ang kayang gawin?

- Magdagdag, mag-edit, at magtanggal ng estudyante
- Maglagay ng Student ID at Grade/Section/Course
- Pumili muna ng section bago pumili ng estudyante
- Mag-record ng Time In at Time Out
- Makita kung On time o Late ang estudyante
- Makita ang bilang ng present, late, at kabuuang oras
- Hanapin ang estudyante gamit ang pangalan o Student ID
- Ayusin ang student list ayon sa section
- Salain ang attendance records ayon sa petsa, section, o estudyante
- Mag-download ng attendance bilang CSV
- Gumawa at mag-restore ng JSON backup
- Gamitin sa computer, tablet, o cellphone

## Sample data

Sa unang pagbukas ng website, awtomatikong lalabas ang:

- **100 fictional sample students**
- **10 sections**
- **10 students sa bawat section**
- Student IDs mula **2026-001** hanggang **2026-100**

Sample lamang ang mga pangalan. Maaari silang i-edit o tanggalin.

Kasamang sample sections:

- Grade 7 - Rizal
- Grade 7 - Mabini
- Grade 8 - Bonifacio
- Grade 8 - Luna
- Grade 9 - Jacinto
- Grade 9 - Del Pilar
- Grade 10 - Aguinaldo
- Grade 10 - Silang
- Grade 11 - STEM A
- Grade 12 - HUMSS A

## Pinakamadaling paraan para buksan

1. Hanapin ang project folder.
2. I-double-click ang `index.html`.
3. Bubukas ang system sa Chrome, Edge, Firefox, o ibang modernong browser.

Walang kailangang i-install.

## Paano gamitin

### Pag-time in

1. Pumunta sa **Dashboard**.
2. Piliin ang section.
3. Piliin ang pangalan ng estudyante.
4. Pindutin ang **Time In**.

### Pag-time out

1. Piliin ulit ang section at estudyante.
2. Pindutin ang **Time Out**.

Ang estudyante ay itinuturing na **Late** kapag nag-time in pagkalipas ng **8:15 AM**.

### Pagdagdag ng estudyante

1. Pumunta sa **Mga Estudyante**.
2. Pindutin ang **Bagong estudyante**.
3. Ilagay ang buong pangalan, Student ID, at section.
4. Pindutin ang **I-save**.

Awtomatikong ginagamit ng system ang inilagay na section para sa pag-group at pag-filter.

### Pagtingin ng records

1. Pumunta sa **Attendance Records**.
2. Pumili ng petsa, section, o estudyante kung gusto mong paliitin ang listahan.
3. Pindutin ang **Export CSV** kung gusto mong buksan ang records sa Excel o Google Sheets.

## Saan naka-save ang data?

Ang data ay naka-save sa **local storage ng browser**.

Sa madaling salita, isipin ito na parang maliit na notebook na nasa loob mismo ng browser:

- Kapag isinara ang browser, naroon pa rin ang data.
- Kapag ni-refresh ang page, hindi nawawala ang data.
- Kapag ibang browser o ibang device ang ginamit, ibang notebook din iyon.
- Kapag nilinis ang browser data, maaaring mabura ang attendance.
- Hindi awtomatikong nagsi-sync ang data sa ibang computer.

### Mahalagang paalala tungkol sa GitHub Pages

Kapag na-live ang website sa GitHub Pages, gagana ang system pero **hindi magiging shared database** ang attendance.

Halimbawa:

- Ang attendance na ginawa sa laptop ng teacher ay nasa laptop/browser na iyon.
- Ang attendance na ginawa sa cellphone ng student ay nasa cellphone/browser na iyon.
- Hindi agad makikita ng teacher ang attendance na ginawa sa ibang device.

Kung kailangan ng iisang shared database para sa lahat, kailangan sa susunod ng online backend tulad ng Firebase, Supabase, o sariling server.

## Backup at restore

Para hindi madaling mawala ang data:

1. Pindutin ang **Backup at restore** sa menu.
2. Piliin ang **I-download ang backup**.
3. Itago ang downloaded JSON file sa ligtas na folder.

Para ibalik ang data:

1. Buksan ang **Backup at restore**.
2. Piliin ang **Mag-restore ng backup**.
3. Piliin ang dating downloaded JSON file.

## Mga file sa project

| File | Simpleng paliwanag |
|---|---|
| `index.html` | Ito ang pangunahing page na binubuksan ng browser. |
| `styles.css` | Ito ang kulay, layout, spacing, at mobile design. |
| `app.js` | Ito ang kumokontrol sa buttons, filters, tables, at screen actions. |
| `database.js` | Ito ang humahawak sa students, attendance, sample data, at browser storage. |
| `README.md` | Ito ang pangunahing documentation ng project. |
| `GITHUB-PAGES-GUIDE.md` | Step-by-step guide para i-upload at i-live sa GitHub Pages. |
| `RAILWAY-GUIDE.md` | Step-by-step guide para i-deploy sa Railway. |
| `package.json` | Node.js project settings at Railway start command. |
| `server.js` | Maliit na web server na ginagamit ng Railway. |
| `.nojekyll` | Sinasabi nito sa GitHub Pages na direktang i-serve ang static files. |

## Paano i-live?

May dalawang deployment option ang project.

### Railway

Basahin ang [RAILWAY-GUIDE.md](RAILWAY-GUIDE.md) para sa step-by-step instructions.

Maikling version:

1. I-push ang lahat ng project files sa GitHub.
2. Sa Railway, piliin ang **New Project → Deploy from GitHub repo**.
3. Piliin ang repository at pindutin ang **Deploy Now**.
4. Pagkatapos ng deployment, pumunta sa **Settings → Networking**.
5. Pindutin ang **Generate Domain**.

Walang kailangang external package o manual port setting. Awtomatikong ginagamit ng `server.js` ang port na ibinibigay ng Railway.

### GitHub Pages

May detalyadong gabay sa [GITHUB-PAGES-GUIDE.md](GITHUB-PAGES-GUIDE.md).

Maikling version:

1. Gumawa ng bagong public repository sa GitHub.
2. I-upload ang lahat ng files sa project folder.
3. Pumunta sa **Settings → Pages**.
4. Sa **Source**, piliin ang **Deploy from a branch**.
5. Piliin ang **main** branch at **/(root)** folder.
6. Pindutin ang **Save**.
7. Hintayin ang GitHub Pages link.

Ayon sa GitHub, maaaring umabot nang hanggang 10 minuto bago lumabas ang site pagkatapos i-publish.

Official guide: [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

## Pagbabago ng sections

Kapag nagdagdag o nag-edit ng estudyante, ilagay lamang ang gustong pangalan ng section sa **Grade / Section / Course**.

Hindi kailangang gumawa ng hiwalay na section page. Awtomatikong kinukuha ng system ang section mula sa student records.

## Mga limitasyon ng kasalukuyang version

- Walang login o password
- Walang teacher/admin account
- Walang central online database
- Walang automatic synchronization sa ibang device
- Maaaring mabura ang data kapag nilinis ang browser storage
- Hindi pa ito angkop bilang official school record system nang walang regular backup

## Privacy at safety

Huwag ilagay ang tunay na student records direkta sa source code bago i-upload sa public GitHub repository.

Ang kasamang 100 students ay fictional lamang. Ang aktuwal na attendance na ginagamit sa website ay nasa browser storage at hindi kasama sa repository kapag nag-upload ka ng source files.

## Browser support

Gamitin ang updated version ng:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

## Project status

Ang project ay isang working website at handa nang i-deploy sa Railway o GitHub Pages.