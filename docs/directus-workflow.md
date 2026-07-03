# Directus Workflow

## Fast Start

1. Start Directus:

```bash
npm run cms:up
```

2. Initialize everything in one go:

```bash
npm run cms:init
```

This runs:

- schema bootstrap
- content seed
- public read permissions

## Step By Step

If you want full control, use the commands below.

1. Create the schema:

```bash
npm run cms:schema
```

2. Seed the current site data:

```bash
npm run cms:seed
```

3. Enable public read access for published content:

```bash
npm run cms:public
```

4. Open the admin panel:

- [http://localhost:8055/admin](http://localhost:8055/admin)

## What This Gives Us

- `global_settings` for contacts and homepage text
- `services` for service cards and service detail pages
- `projects` for portfolio entries
- `partners` for partner pages
- `price_ranges` for pricing cards
- `faq_items` for page FAQ blocks
- `testimonials` for reusable reviews

## Current Limits

- image fields are stored as Directus file IDs, but the seed script does not upload files yet
- `gallery` is currently stored as a JSON array of file IDs for simplicity
- public read access is configured for local Directus, but production still needs the same step in the deployed CMS environment

## Recommended Next Step

After the first content migration works, point the frontend environment to the deployed Directus URL and keep `VITE_DIRECTUS_TOKEN` empty when public read permissions are enabled.
