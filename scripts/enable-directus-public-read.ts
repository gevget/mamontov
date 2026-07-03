import 'dotenv/config';

const DIRECTUS_URL = (process.env.DIRECTUS_URL || process.env.PUBLIC_URL || 'http://localhost:8055').replace(/\/+$/, '');
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'change-me-please';

type DirectusPermission = {
  id: number;
  policy: string | null;
  collection: string;
  action: string;
  permissions: Record<string, unknown> | null;
  fields: string[];
};

type DirectusPolicy = {
  id: string;
  name: string;
};

type DirectusAccess = {
  id: string;
  role: string | null;
  user: string | null;
  policy: string;
};

type PublicPermissionDefinition = {
  collection: string;
  action: 'read';
  permissions: Record<string, unknown>;
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

const getPublicPolicyId = async (token: string) => {
  const [accessResponse, policyResponse] = await Promise.all([
    request<{ data: DirectusAccess[] }>('/access', {
      headers: buildAuthHeaders(token),
    }),
    request<{ data: DirectusPolicy[] }>('/policies', {
      headers: buildAuthHeaders(token),
    }),
  ]);

  const accessPolicy = accessResponse.data.find((item) => item.role === null && item.user === null)?.policy;

  if (accessPolicy) {
    return accessPolicy;
  }

  const fallbackPolicy = policyResponse.data.find((item) => item.name === '$t:public_label');

  if (fallbackPolicy) {
    return fallbackPolicy.id;
  }

  throw new Error('Public policy not found in Directus. Open Directus once and ensure the default public policy exists.');
};

const getExistingPermissions = async (token: string, policyId: string) => {
  const filter = encodeURIComponent(JSON.stringify({ policy: { _eq: policyId } }));
  const response = await request<{ data: DirectusPermission[] }>(`/permissions?filter=${filter}&limit=-1`, {
    headers: buildAuthHeaders(token),
  });

  return response.data;
};

const permissionsToEnsure: PublicPermissionDefinition[] = [
  {
    collection: 'global_settings',
    action: 'read',
    permissions: {},
  },
  {
    collection: 'site_theme',
    action: 'read',
    permissions: {},
  },
  {
    collection: 'services',
    action: 'read',
    permissions: { status: { _eq: 'published' } },
  },
  {
    collection: 'partners',
    action: 'read',
    permissions: { status: { _eq: 'published' } },
  },
  {
    collection: 'projects',
    action: 'read',
    permissions: { status: { _eq: 'published' } },
  },
  {
    collection: 'price_ranges',
    action: 'read',
    permissions: { status: { _eq: 'published' } },
  },
  {
    collection: 'faq_items',
    action: 'read',
    permissions: { status: { _eq: 'published' } },
  },
  {
    collection: 'testimonials',
    action: 'read',
    permissions: { status: { _eq: 'published' } },
  },
  {
    collection: 'directus_files',
    action: 'read',
    permissions: {},
  },
];

const ensurePermission = async (
  token: string,
  policyId: string,
  definition: PublicPermissionDefinition,
  existingPermissions: DirectusPermission[],
) => {
  const existing = existingPermissions.find(
    (item) => item.policy === policyId && item.collection === definition.collection && item.action === definition.action,
  );

  const payload = {
    policy: policyId,
    collection: definition.collection,
    action: definition.action,
    permissions: definition.permissions,
    validation: null,
    presets: null,
    fields: ['*'],
  };

  if (existing) {
    await request(`/permissions/${existing.id}`, {
      method: 'PATCH',
      headers: buildAuthHeaders(token),
      body: JSON.stringify(payload),
    });

    console.log(`Updated public permission: ${definition.collection}.${definition.action}`);
    return;
  }

  const response = await request<{ data: DirectusPermission }>('/permissions', {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(payload),
  });

  existingPermissions.push(response.data);
  console.log(`Created public permission: ${definition.collection}.${definition.action}`);
};

const main = async () => {
  console.log(`Enabling public read access at ${DIRECTUS_URL}`);

  const token = await login();
  const publicPolicyId = await getPublicPolicyId(token);
  const existingPermissions = await getExistingPermissions(token, publicPolicyId);

  for (const permission of permissionsToEnsure) {
    await ensurePermission(token, publicPolicyId, permission, existingPermissions);
  }

  console.log('Directus public read access enabled');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
