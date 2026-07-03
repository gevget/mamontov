# Directus Local Setup

## What this adds

This project now includes a minimal local Directus setup for the CMS:

- `docker-compose.yml`
- `.env.directus.example`
- npm scripts for start/stop/logs

## First start

1. Update values in `.env.directus.example` if needed.
2. Run:

```bash
npm run cms:up
```

3. Open:

```text
http://localhost:8055
```

4. Login with:

- email from `DIRECTUS_ADMIN_EMAIL`
- password from `DIRECTUS_ADMIN_PASSWORD`

## Commands

Start CMS:

```bash
npm run cms:up
```

Stop CMS:

```bash
npm run cms:down
```

Watch logs:

```bash
npm run cms:logs
```

## Storage

Local CMS data is stored in ignored folders:

- `cms/data`
- `cms/uploads`

## Notes

- this setup uses SQLite for simplicity
- good for local development and schema design
- later we can move production to Postgres
