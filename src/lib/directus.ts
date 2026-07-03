import type { DirectusFileRef, DirectusListResponse, DirectusSingleResponse } from './cms-types';

const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL?.replace(/\/+$/, '') ?? '';
const DIRECTUS_TOKEN = import.meta.env.VITE_DIRECTUS_TOKEN ?? '';

export const isDirectusConfigured = Boolean(DIRECTUS_URL);

const requestJson = async <T>(path: string, init: RequestInit = {}) => {
  const response = await fetch(`${DIRECTUS_URL}${path}`, init);

  if (!response.ok) {
    throw new Error(`Directus request failed for ${path}: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const buildDirectusAssetUrl = (file?: string | DirectusFileRef | null) => {
  if (!DIRECTUS_URL || !file) return undefined;

  const fileId = typeof file === 'string' ? file : file.id;

  return fileId ? `${DIRECTUS_URL}/assets/${fileId}` : undefined;
};

export const readDirectusItems = async <T>(collection: string, params?: Record<string, string>) => {
  if (!DIRECTUS_URL) {
    throw new Error('Directus URL is not configured');
  }

  const searchParams = new URLSearchParams(params);
  return requestJson<DirectusListResponse<T>>(`/items/${collection}?${searchParams.toString()}`, {
    headers: {
      ...(DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}),
    },
  });
};

export const readDirectusSingleton = async <T>(collection: string, params?: Record<string, string>) => {
  if (!DIRECTUS_URL) {
    throw new Error('Directus URL is not configured');
  }

  const searchParams = new URLSearchParams(params);
  return requestJson<DirectusSingleResponse<T>>(`/items/${collection}?${searchParams.toString()}`, {
    headers: {
      ...(DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}),
    },
  });
};

export const loginToDirectus = async (email: string, password: string) => {
  if (!DIRECTUS_URL) {
    throw new Error('Directus URL is not configured');
  }

  const response = await requestJson<{ data: { access_token: string } }>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return response.data.access_token;
};

export const updateDirectusSingleton = async (collection: string, payload: Record<string, unknown>, token: string) => {
  if (!DIRECTUS_URL) {
    throw new Error('Directus URL is not configured');
  }

  return requestJson(`/items/${collection}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
};
