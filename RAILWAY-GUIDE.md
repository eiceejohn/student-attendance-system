# Paano I-live sa Railway

Ang project ay handa nang i-deploy sa Railway. May kasama na itong maliit na Node.js web server at hindi nangangailangan ng external package.

## Mga file na para sa Railway

- `package.json` — nagsasabi sa Railway na Node.js project ito at kung paano ito sisimulan.
- `server.js` — naghahatid ng HTML, CSS, at JavaScript files sa internet.
- `/health` — health-check address na maaaring gamitin para malaman kung tumatakbo ang server.

## Step-by-step deployment

1. I-upload o i-push ang lahat ng project files sa GitHub repository.
2. Mag-sign in sa [Railway](https://railway.com/).
3. Piliin ang **New Project**.
4. Piliin ang **Deploy from GitHub repo**.
5. I-connect ang GitHub account kung hinihingi.
6. Piliin ang repository ng attendance system.
7. Piliin ang **Deploy Now**.
8. Hintaying matapos ang build at deployment.
9. Buksan ang service at pumunta sa **Settings → Networking**.
10. Pindutin ang **Generate Domain**.

Makakakuha ka ng public address na katulad ng:

```text
https://student-attendance-production.up.railway.app
```

## Ano ang awtomatikong gagawin ng Railway?

Makikita ng Railway ang `package.json`, ihahanda ang Node.js runtime, at tatakbuhin ang:

```text
npm start
```

Ang server ay awtomatikong gumagamit ng `PORT` na ibinibigay ng Railway. Wala kang kailangang ilagay na port number sa Railway Variables.

## Optional health check

Sa Railway service settings, maaari mong ilagay ang sumusunod bilang Healthcheck Path:

```text
/health
```

Kapag gumagana ang server, magbabalik ito ng:

```json
{"status":"ok"}
```

## Paano mag-update?

I-update ang files sa GitHub at mag-push sa connected branch. Awtomatikong gagawa ang Railway ng bagong deployment.

## Mahalagang database reminder

Ang pag-deploy sa Railway ay ginagawang public ang website, pero ang kasalukuyang attendance data ay nasa `localStorage` pa rin ng browser.

- Bawat browser o device ay may sariling records.
- Hindi pa shared ang database ng teacher at students.
- Hindi nai-save sa Railway server ang attendance.
- Gumamit ng Backup at Restore para protektahan ang data.

Kung kailangan ng iisang shared attendance database, kailangan pang magdagdag ng backend API at Railway PostgreSQL database.

## Local testing

Kung may Node.js sa computer, buksan ang terminal sa project folder at patakbuhin:

```text
npm start
```

Pagkatapos, buksan sa browser:

```text
http://localhost:3000
```

Para subukan ang health endpoint:

```text
http://localhost:3000/health
```

## Troubleshooting

### Deployment failed

- Siguraduhing kasama ang `package.json` at `server.js` sa root ng repository.
- Tingnan ang Railway deployment logs.
- Siguraduhing walang ibang custom Start Command na nakalagay.

### Walang public link

Pumunta sa **Settings → Networking** at pindutin ang **Generate Domain**.

### Blank o walang design

Siguraduhing kasama sa GitHub ang `index.html`, `styles.css`, `app.js`, at `database.js`.

## Official references

- [Railway Quick Start](https://docs.railway.com/quick-start)
- [Railpack](https://docs.railway.com/builds/railpack)
- [Railway Services](https://docs.railway.com/services)
