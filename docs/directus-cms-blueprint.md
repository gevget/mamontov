# Directus CMS Blueprint

## Goal

Replace static content from [src/data/mock.ts](/E:/codex/mamontov/src/data/mock.ts) with a simple Directus-based CMS that allows non-technical users to:

- edit services
- edit prices
- add and edit projects
- add and edit partners
- update FAQ
- update global contact and hero content

This blueprint intentionally favors simplicity over maximum flexibility.

## CMS Choice

Recommended CMS: `Directus`

Why:

- simple admin UI for non-technical editors
- collections and relations are easy to manage
- files and image uploads are built in
- API is available out of the box
- fits the current custom frontend well

## Scope

### Phase 1

Collections to implement first:

1. `global_settings`
2. `services`
3. `projects`
4. `partners`
5. `price_ranges`
6. `faq_items`
7. `testimonials`

### Phase 2

Optional improvements later:

- page builder for `home`, `about`, `contacts`
- SEO presets and previews
- draft preview flow
- redirect management
- localized content

## Data Model

### 1. `global_settings`

Purpose:
Single record with shared site content and contacts.

Collection mode:
Treat as singleton in app logic. Directus can store it as one-item collection.

| Field | Directus Type | Required | Notes |
|---|---|---:|---|
| `site_name` | string | yes | Example: `ARCHIBUILD` |
| `phone` | string | yes | Main phone |
| `email` | string | yes | Main email |
| `telegram_url` | string | no | Full URL |
| `whatsapp_url` | string | no | Full URL |
| `office_address` | text | yes | Address for footer/contact page |
| `work_hours` | string | no | Example: `Ежедневно с 10:00 до 20:00` |
| `hero_title` | string | no | Main homepage title |
| `hero_subtitle` | text | no | Homepage subtitle |
| `contact_cta_title` | string | no | Shared CTA heading |
| `contact_cta_text` | text | no | Shared CTA text |
| `default_seo_title` | string | no | Default SEO |
| `default_seo_description` | text | no | Default SEO |

### 2. `services`

Purpose:
Content for services listing and detail pages.

| Field | Directus Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | yes | Auto |
| `status` | status | yes | `draft` / `published` |
| `sort` | integer | no | Manual ordering |
| `title` | string | yes | Service title |
| `slug` | string | yes | Unique |
| `short_description` | text | yes | Card text |
| `full_description` | text | no | Detail page intro |
| `hero_image` | file | no | Main image |
| `features` | json | no | Array of strings |
| `includes` | json | no | Array of strings |
| `steps` | json | no | Array of `{ title, desc }` |
| `price_factors` | json | no | Array of strings |
| `seo_title` | string | no | SEO |
| `seo_description` | text | no | SEO |

JSON examples:

```json
["черновые работы", "инженерия", "контроль качества"]
```

```json
[
  { "title": "Изучаем объект", "desc": "Понимаем объем работ и ограничения." },
  { "title": "Готовим смету", "desc": "Фиксируем состав работ и этапность." }
]
```

### 3. `projects`

Purpose:
Portfolio cases and detail pages.

| Field | Directus Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | yes | Auto |
| `status` | status | yes | `draft` / `published` |
| `sort` | integer | no | Manual ordering |
| `title` | string | yes | Project title |
| `slug` | string | yes | Unique |
| `category` | string | yes | Example: `Квартира`, `Дом` |
| `short_description` | text | yes | Card/preview text |
| `full_description` | text | no | Detail intro |
| `year` | string | no | Keep simple for editors |
| `location` | string | no | City/region |
| `area` | string | no | Example: `86 м2` |
| `duration` | string | no | Example: `5 месяцев` |
| `format` | string | no | Example: `Ремонт по дизайн-проекту` |
| `project_status` | string | no | Example: `Сдан` |
| `hero_image` | file | yes | Main cover |
| `client_task` | text | no | Detail page block |
| `steps_done` | json | no | Array of strings |
| `process_steps` | json | no | Array of `{ label, image, description }` |
| `complexities` | json | no | Array of `{ title, description }` |
| `gallery` | m2m files | no | Gallery images |
| `partner` | m2o `partners` | no | Related partner |
| `testimonial` | m2o `testimonials` | no | Related testimonial |
| `seo_title` | string | no | SEO |
| `seo_description` | text | no | SEO |

JSON examples:

```json
["демонтаж", "черновые работы", "инженерия", "чистовая отделка"]
```

```json
[
  {
    "label": "Инженерия",
    "image": "DIRECTUS_FILE_ID",
    "description": "Монтаж электрики и сантехники."
  }
]
```

```json
[
  {
    "title": "Точная геометрия",
    "description": "Подготовка под встроенную мебель и панели."
  }
]
```

### 4. `partners`

Purpose:
Partner list and partner detail pages.

| Field | Directus Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | yes | Auto |
| `status` | status | yes | `draft` / `published` |
| `sort` | integer | no | Manual ordering |
| `name` | string | yes | Partner name |
| `slug` | string | yes | Unique |
| `type` | string | no | Example: `Студия`, `Дизайнер` |
| `specialization` | string | no | Short descriptor |
| `description` | text | yes | Main description |
| `location` | string | no | City |
| `focus` | string | no | Example: `Минимализм` |
| `image` | file | no | Main image |
| `seo_title` | string | no | SEO |
| `seo_description` | text | no | SEO |

Relation note:

- do not manually maintain a `projects[]` field here in phase 1
- use the reverse relation from `projects.partner`

### 5. `price_ranges`

Purpose:
Simple pricing cards for the prices page.

| Field | Directus Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | yes | Auto |
| `status` | status | yes | `draft` / `published` |
| `sort` | integer | no | Manual ordering |
| `title` | string | yes | Card heading |
| `price` | string | yes | Keep as display string |
| `description` | text | no | Card body |

### 6. `faq_items`

Purpose:
Reusable FAQ entries for all pages and services.

| Field | Directus Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | yes | Auto |
| `status` | status | yes | `draft` / `published` |
| `sort` | integer | no | Manual ordering |
| `question` | string | yes | FAQ title |
| `answer` | text | yes | FAQ body |
| `category` | string | no | Example: `Стоимость`, `Смета` |
| `page_type` | string | yes | See allowed values below |
| `service` | m2o `services` | no | Only for service-specific FAQ |

Recommended `page_type` values:

- `general`
- `about`
- `prices`
- `partners`
- `technologies`
- `service`

### 7. `testimonials`

Purpose:
Reusable testimonials for home/about/projects.

| Field | Directus Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | yes | Auto |
| `status` | status | yes | `draft` / `published` |
| `sort` | integer | no | Manual ordering |
| `author` | string | yes | Name |
| `role` | string | no | Role/company |
| `content` | text | yes | Quote |
| `rating` | integer | no | Example: `5` |
| `image` | file | no | Avatar |
| `object_type` | string | no | Example: `Квартира 86 м2` |

## Relations

### Minimal relation map

- `projects.partner` -> `partners.id`
- `projects.testimonial` -> `testimonials.id`
- `faq_items.service` -> `services.id`

### Files

- `services.hero_image` -> Directus files
- `projects.hero_image` -> Directus files
- `projects.gallery` -> Directus files
- `partners.image` -> Directus files
- `testimonials.image` -> Directus files

## Access Model

Keep permissions simple.

### Roles

1. `Administrator`
2. `Editor`
3. `Marketing`
4. `Public API`

### Permissions

#### Administrator

- full access to all collections
- settings, files, users, schema

#### Editor

- create/read/update/delete on:
  - `services`
  - `projects`
  - `partners`
  - `price_ranges`
  - `faq_items`
  - `testimonials`
  - `global_settings`
- file upload access

#### Marketing

- create/read/update on:
  - `faq_items`
  - `testimonials`
  - `global_settings`
- read/update on:
  - `price_ranges`
  - `services`
- no schema access

#### Public API

- read-only
- only `published` items
- no admin app access

## Frontend Mapping

Current source:

- [src/data/mock.ts](/E:/codex/mamontov/src/data/mock.ts)

Future source:

- `GET /items/global_settings`
- `GET /items/services`
- `GET /items/projects`
- `GET /items/partners`
- `GET /items/price_ranges`
- `GET /items/faq_items`
- `GET /items/testimonials`

### Page mapping

| Frontend Page | Collections |
|---|---|
| Home | `global_settings`, `services`, `projects`, `faq_items`, `testimonials` |
| Projects | `projects` |
| Project Detail | `projects`, `partners`, `testimonials` |
| Services | `services`, `projects` |
| Service Detail | `services`, `faq_items`, `projects` |
| Prices | `price_ranges`, `faq_items`, `global_settings` |
| Partners | `partners`, `projects`, `faq_items` |
| Partner Detail | `partners`, `projects` |
| About | `global_settings`, `testimonials`, `faq_items` |
| Contacts | `global_settings` |
| FAQ | `faq_items` |
| Technologies | `faq_items` |

## Recommended API Layer

Create a new frontend module later:

- `src/lib/directus.ts`
- `src/lib/api.ts`
- `src/lib/mappers.ts`

### Responsibilities

- `directus.ts`
  - base URL
  - token handling
  - fetch wrapper

- `api.ts`
  - raw collection requests

- `mappers.ts`
  - convert Directus responses to current frontend-friendly shape

## Rollout Plan

### Step 1

Set up Directus locally:

- Directus app
- database
- admin user
- file storage

### Step 2

Create collections:

- `global_settings`
- `services`
- `projects`
- `partners`
- `price_ranges`
- `faq_items`
- `testimonials`

### Step 3

Configure roles:

- `Administrator`
- `Editor`
- `Marketing`
- `Public API`

### Step 4

Seed initial content from [src/data/mock.ts](/E:/codex/mamontov/src/data/mock.ts)

### Step 5

Replace static frontend reads:

- first `projects`
- then `services`
- then `partners`
- then `prices`
- then shared settings and FAQ

### Step 6

Remove dependency on `mock.ts`

## Implementation Notes

To keep the admin UI simple in phase 1:

- prefer `json` arrays over over-modeled nested collections for repeated text blocks
- avoid page-builder complexity
- keep price values as strings
- keep area and duration as strings
- only add relations where they help editors directly

This is intentionally not the most “pure” schema. It is the easiest schema to operate.

## Next Build Tasks

1. Add Directus locally via Docker Compose
2. Create the collections above
3. Export a sample schema snapshot
4. Add frontend API client
5. Migrate one page first: `Projects`
6. Then migrate `Services`, `Partners`, `Prices`

## Suggested First Migration Order

Recommended order for least risk:

1. `price_ranges`
2. `services`
3. `partners`
4. `projects`
5. `faq_items`
6. `global_settings`
7. `testimonials`

This gives us quick wins while keeping the most interconnected content for later.
