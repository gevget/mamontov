# Directus Seed

## Purpose

Load the current site content into Directus so editors can start working from the admin panel immediately.

## What the seed fills

- `global_settings`
- `services`
- `partners`
- `testimonials`
- `projects`
- `price_ranges`
- `faq_items`

## Important limitation

This seed focuses on text and relations first.

It does **not** upload remote images into Directus files yet.

That is acceptable for the current frontend because the app still has safe fallback data and images from the existing mock layer.

## Before running

1. Start Directus:

```bash
npm run cms:up
```

2. Make sure the collections from [directus-cms-blueprint.md](/E:/codex/mamontov/docs/directus-cms-blueprint.md) already exist in Directus.

3. Make sure admin credentials in [.env.directus.example](/E:/codex/mamontov/.env.directus.example) match your local instance.

## Run

```bash
npm run cms:seed
```

## Notes

- The seed uses upsert-like behavior by checking a unique field first.
- For `services`, `partners`, and `projects`, it uses `slug`.
- For `price_ranges`, it uses `title`.
- For `testimonials`, it uses `author`.
- For `faq_items`, it uses `question`.
- For `global_settings`, it updates or creates the first record.

## Next improvement

After the first content migration works, the next practical upgrade is:

- image upload to Directus files
- replacing fallback media with real Directus assets
