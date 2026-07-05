import 'dotenv/config';

const DIRECTUS_URL = (process.env.DIRECTUS_URL || process.env.PUBLIC_URL || 'http://localhost:8055').replace(/\/+$/, '');
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'change-me-please';

type DirectusFieldType = 'string' | 'text' | 'json' | 'integer';

type CollectionDefinition = {
  collection: string;
  icon: string;
  note: string;
  singleton?: boolean;
  fields: FieldDefinition[];
};

type FieldDefinition = {
  field: string;
  type: DirectusFieldType;
  interface?: string;
  display?: string;
  required?: boolean;
  width?: 'full' | 'half';
  hidden?: boolean;
  readonly?: boolean;
  note?: string;
  options?: Record<string, unknown>;
  special?: string[];
  schema?: Record<string, unknown>;
};

type RelationDefinition = {
  collection: string;
  field: string;
  related_collection: string;
  one_field?: string;
  one_deselect_action?: 'nullify' | 'delete';
};

type DirectusCollectionResponse = {
  data: Array<{
    collection: string;
  }>;
};

type DirectusFieldResponse = {
  data: Array<{
    field: string;
  }>;
};

type DirectusRelationResponse = {
  data: Array<{
    collection: string;
    field: string;
  }>;
};

const jsonHeaders = {
  'Content-Type': 'application/json',
};

const request = async <T>(path: string, init: RequestInit = {}) => {
  const response = await fetch(`${DIRECTUS_URL}${path}`, init);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Directus request failed ${response.status} ${response.statusText}: ${body}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

const login = async () => {
  const response = await request<{ data: { access_token: string } }>('/auth/login', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  return response.data.access_token;
};

const buildAuthHeaders = (token: string) => ({
  ...jsonHeaders,
  Authorization: `Bearer ${token}`,
});

const collections: CollectionDefinition[] = [
  {
    collection: 'global_settings',
    icon: 'settings',
    note: 'Shared site contacts and reusable homepage text.',
    singleton: true,
    fields: [
      { field: 'site_name', type: 'string', interface: 'input', required: true },
      { field: 'phone', type: 'string', interface: 'input', required: true },
      { field: 'email', type: 'string', interface: 'input', required: true },
      { field: 'telegram_url', type: 'string', interface: 'input' },
      { field: 'whatsapp_url', type: 'string', interface: 'input' },
      { field: 'office_address', type: 'text', interface: 'input-multiline', required: true },
      { field: 'work_hours', type: 'string', interface: 'input' },
      { field: 'hero_title', type: 'string', interface: 'input' },
      { field: 'hero_subtitle', type: 'text', interface: 'input-multiline' },
      { field: 'contact_cta_title', type: 'string', interface: 'input' },
      { field: 'contact_cta_text', type: 'text', interface: 'input-multiline' },
      { field: 'default_seo_title', type: 'string', interface: 'input' },
      { field: 'default_seo_description', type: 'text', interface: 'input-multiline' },
    ],
  },
  {
    collection: 'site_theme',
    icon: 'palette',
    note: 'Runtime visual theme for the website.',
    singleton: true,
    fields: [
      { field: 'brand_primary', type: 'string', interface: 'input' },
      { field: 'brand_warm', type: 'string', interface: 'input' },
      { field: 'brand_secondary', type: 'string', interface: 'input' },
      { field: 'brand_text', type: 'string', interface: 'input' },
      { field: 'brand_muted', type: 'string', interface: 'input' },
      { field: 'brand_border', type: 'string', interface: 'input' },
      { field: 'brand_dark', type: 'string', interface: 'input' },
      { field: 'brand_support', type: 'string', interface: 'input' },
      { field: 'brand_accent', type: 'string', interface: 'input' },
      { field: 'brand_accent_hover', type: 'string', interface: 'input' },
      { field: 'display_title_max', type: 'integer', interface: 'input' },
      { field: 'section_title_max', type: 'integer', interface: 'input' },
      { field: 'lead_text_size', type: 'integer', interface: 'input' },
      { field: 'body_text_size', type: 'integer', interface: 'input' },
    ],
  },
  {
    collection: 'services',
    icon: 'construction',
    note: 'Services list and detail page content.',
    fields: [
      { field: 'status', type: 'string', interface: 'select-dropdown', required: true, options: { choices: [{ text: 'Draft', value: 'draft' }, { text: 'Published', value: 'published' }] } },
      { field: 'sort', type: 'integer', interface: 'input' },
      { field: 'title', type: 'string', interface: 'input', required: true },
      { field: 'slug', type: 'string', interface: 'input', required: true, note: 'Unique slug for routes.' },
      { field: 'short_description', type: 'text', interface: 'input-multiline', required: true },
      { field: 'full_description', type: 'text', interface: 'input-multiline' },
      { field: 'hero_image', type: 'string', interface: 'file-image' },
      { field: 'features', type: 'json', interface: 'tags' },
      { field: 'includes', type: 'json', interface: 'tags' },
      { field: 'steps', type: 'json', interface: 'input-code', options: { language: 'json' } },
      { field: 'price_factors', type: 'json', interface: 'tags' },
      { field: 'seo_title', type: 'string', interface: 'input' },
      { field: 'seo_description', type: 'text', interface: 'input-multiline' },
    ],
  },
  {
    collection: 'partners',
    icon: 'handshake',
    note: 'Partner profiles and linked project pages.',
    fields: [
      { field: 'status', type: 'string', interface: 'select-dropdown', required: true, options: { choices: [{ text: 'Draft', value: 'draft' }, { text: 'Published', value: 'published' }] } },
      { field: 'sort', type: 'integer', interface: 'input' },
      { field: 'name', type: 'string', interface: 'input', required: true },
      { field: 'slug', type: 'string', interface: 'input', required: true, note: 'Unique slug for routes.' },
      { field: 'type', type: 'string', interface: 'input' },
      { field: 'specialization', type: 'string', interface: 'input' },
      { field: 'description', type: 'text', interface: 'input-multiline', required: true },
      { field: 'location', type: 'string', interface: 'input' },
      { field: 'focus', type: 'string', interface: 'input' },
      { field: 'image', type: 'string', interface: 'file-image' },
      { field: 'seo_title', type: 'string', interface: 'input' },
      { field: 'seo_description', type: 'text', interface: 'input-multiline' },
    ],
  },
  {
    collection: 'testimonials',
    icon: 'format_quote',
    note: 'Reusable testimonials for home, about, and projects.',
    fields: [
      { field: 'status', type: 'string', interface: 'select-dropdown', required: true, options: { choices: [{ text: 'Draft', value: 'draft' }, { text: 'Published', value: 'published' }] } },
      { field: 'sort', type: 'integer', interface: 'input' },
      { field: 'author', type: 'string', interface: 'input', required: true },
      { field: 'role', type: 'string', interface: 'input' },
      { field: 'content', type: 'text', interface: 'input-multiline', required: true },
      { field: 'rating', type: 'integer', interface: 'input' },
      { field: 'image', type: 'string', interface: 'file-image' },
      { field: 'object_type', type: 'string', interface: 'input' },
    ],
  },
  {
    collection: 'projects',
    icon: 'home_repair_service',
    note: 'Portfolio items and detail page content.',
    fields: [
      { field: 'status', type: 'string', interface: 'select-dropdown', required: true, options: { choices: [{ text: 'Draft', value: 'draft' }, { text: 'Published', value: 'published' }] } },
      { field: 'sort', type: 'integer', interface: 'input' },
      { field: 'title', type: 'string', interface: 'input', required: true },
      { field: 'slug', type: 'string', interface: 'input', required: true, note: 'Unique slug for routes.' },
      { field: 'category', type: 'string', interface: 'input', required: true },
      { field: 'short_description', type: 'text', interface: 'input-multiline', required: true },
      { field: 'full_description', type: 'text', interface: 'input-multiline' },
      { field: 'year', type: 'string', interface: 'input' },
      { field: 'location', type: 'string', interface: 'input' },
      { field: 'area', type: 'string', interface: 'input' },
      { field: 'duration', type: 'string', interface: 'input' },
      { field: 'format', type: 'string', interface: 'input' },
      { field: 'project_status', type: 'string', interface: 'input' },
      { field: 'hero_image', type: 'string', interface: 'file-image' },
      { field: 'client_task', type: 'text', interface: 'input-multiline' },
      { field: 'steps_done', type: 'json', interface: 'tags' },
      { field: 'process_steps', type: 'json', interface: 'input-code', options: { language: 'json' } },
      { field: 'complexities', type: 'json', interface: 'input-code', options: { language: 'json' } },
      { field: 'gallery', type: 'json', interface: 'input-code', options: { language: 'json' }, note: 'Store Directus file IDs as a JSON array.' },
      { field: 'partner', type: 'integer', interface: 'select-dropdown-m2o' },
      { field: 'testimonial', type: 'integer', interface: 'select-dropdown-m2o' },
      { field: 'seo_title', type: 'string', interface: 'input' },
      { field: 'seo_description', type: 'text', interface: 'input-multiline' },
    ],
  },
  {
    collection: 'price_ranges',
    icon: 'payments',
    note: 'Simple pricing cards for the prices page.',
    fields: [
      { field: 'status', type: 'string', interface: 'select-dropdown', required: true, options: { choices: [{ text: 'Draft', value: 'draft' }, { text: 'Published', value: 'published' }] } },
      { field: 'sort', type: 'integer', interface: 'input' },
      { field: 'title', type: 'string', interface: 'input', required: true },
      { field: 'price', type: 'string', interface: 'input', required: true },
      { field: 'description', type: 'text', interface: 'input-multiline' },
    ],
  },
  {
    collection: 'faq_items',
    icon: 'quiz',
    note: 'FAQ records reused across pages and services.',
    fields: [
      { field: 'status', type: 'string', interface: 'select-dropdown', required: true, options: { choices: [{ text: 'Draft', value: 'draft' }, { text: 'Published', value: 'published' }] } },
      { field: 'sort', type: 'integer', interface: 'input' },
      { field: 'question', type: 'string', interface: 'input', required: true },
      { field: 'answer', type: 'text', interface: 'input-multiline', required: true },
      { field: 'category', type: 'string', interface: 'input' },
      { field: 'page_type', type: 'string', interface: 'select-dropdown', required: true, options: { choices: [{ text: 'General', value: 'general' }, { text: 'About', value: 'about' }, { text: 'Prices', value: 'prices' }, { text: 'Partners', value: 'partners' }, { text: 'Technologies', value: 'technologies' }, { text: 'Service', value: 'service' }] } },
      { field: 'service', type: 'integer', interface: 'select-dropdown-m2o' },
    ],
  },
];

const relations: RelationDefinition[] = [
  {
    collection: 'projects',
    field: 'partner',
    related_collection: 'partners',
  },
  {
    collection: 'projects',
    field: 'testimonial',
    related_collection: 'testimonials',
  },
  {
    collection: 'faq_items',
    field: 'service',
    related_collection: 'services',
  },
];

const getCollections = async (token: string) =>
  request<DirectusCollectionResponse>('/collections', {
    headers: buildAuthHeaders(token),
  });

const getFields = async (token: string, collection: string) =>
  request<DirectusFieldResponse>(`/fields/${collection}`, {
    headers: buildAuthHeaders(token),
  });

const getRelations = async (token: string) =>
  request<DirectusRelationResponse>('/relations', {
    headers: buildAuthHeaders(token),
  });

const ensureCollection = async (token: string, definition: CollectionDefinition, existingNames: Set<string>) => {
  if (existingNames.has(definition.collection)) {
    console.log(`Collection exists: ${definition.collection}`);
    return;
  }

  await request('/collections', {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify({
      collection: definition.collection,
      meta: {
        icon: definition.icon,
        note: definition.note,
        hidden: false,
        singleton: definition.singleton ?? false,
        accountability: 'all',
        archive_app_filter: true,
      },
      schema: {
        name: definition.collection,
      },
    }),
  });

  console.log(`Created collection: ${definition.collection}`);
};

const ensureField = async (token: string, collection: string, definition: FieldDefinition, existingFields: Set<string>) => {
  if (existingFields.has(definition.field)) {
    console.log(`Field exists: ${collection}.${definition.field}`);
    return;
  }

  await request(`/fields/${collection}`, {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify({
      field: definition.field,
      type: definition.type,
      meta: {
        interface: definition.interface ?? 'input',
        display: definition.display ?? null,
        options: definition.options ?? null,
        readonly: definition.readonly ?? false,
        hidden: definition.hidden ?? false,
        width: definition.width ?? 'full',
        note: definition.note ?? null,
        required: definition.required ?? false,
        special: definition.special ?? null,
      },
      schema: {
        is_nullable: !(definition.required ?? false),
        ...(definition.schema ?? {}),
      },
    }),
  });

  console.log(`Created field: ${collection}.${definition.field}`);
};

const ensureRelation = async (
  token: string,
  definition: RelationDefinition,
  existingRelationKeys: Set<string>,
) => {
  const key = `${definition.collection}.${definition.field}`;

  if (existingRelationKeys.has(key)) {
    console.log(`Relation exists: ${key} -> ${definition.related_collection}`);
    return;
  }

  await request('/relations', {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify({
      collection: definition.collection,
      field: definition.field,
      related_collection: definition.related_collection,
      schema: {
        table: definition.collection,
        column: definition.field,
        foreign_key_table: definition.related_collection,
        foreign_key_column: 'id',
        on_delete: 'SET NULL',
      },
      meta: {
        many_collection: definition.collection,
        many_field: definition.field,
        one_collection: definition.related_collection,
        one_field: definition.one_field ?? null,
        one_deselect_action: definition.one_deselect_action ?? 'nullify',
      },
    }),
  });

  console.log(`Created relation: ${key} -> ${definition.related_collection}`);
};

const main = async () => {
  console.log(`Bootstrapping Directus schema at ${DIRECTUS_URL}`);

  const token = await login();
  const collectionResponse = await getCollections(token);
  const existingCollectionNames = new Set(collectionResponse.data.map((item) => item.collection));

  for (const collection of collections) {
    await ensureCollection(token, collection, existingCollectionNames);
    existingCollectionNames.add(collection.collection);
  }

  for (const collection of collections) {
    const fieldResponse = await getFields(token, collection.collection);
    const existingFields = new Set(fieldResponse.data.map((item) => item.field));

    for (const field of collection.fields) {
      await ensureField(token, collection.collection, field, existingFields);
      existingFields.add(field.field);
    }
  }

  const relationResponse = await getRelations(token);
  const existingRelationKeys = new Set(relationResponse.data.map((item) => `${item.collection}.${item.field}`));

  for (const relation of relations) {
    await ensureRelation(token, relation, existingRelationKeys);
    existingRelationKeys.add(`${relation.collection}.${relation.field}`);
  }

  console.log('Directus schema bootstrap completed');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
