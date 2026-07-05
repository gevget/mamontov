import 'dotenv/config';
import {
  aboutFAQ,
  faq as homeFaq,
  generalFAQ,
  partnerFAQ,
  partners,
  priceFAQ,
  priceRanges,
  projects,
  services,
  technologyFAQ,
  testimonials,
} from '../src/data/mock';

const DIRECTUS_URL = (process.env.DIRECTUS_URL || process.env.PUBLIC_URL || 'http://localhost:8055').replace(/\/+$/, '');
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'change-me-please';

type DirectusItem = Record<string, unknown>;
type DirectusCollectionResponse = {
  data: DirectusItem[] | DirectusItem;
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

const findItemByField = async (token: string, collection: string, field: string, value: string) => {
  const filter = encodeURIComponent(JSON.stringify({ [field]: { _eq: value } }));
  const response = await request<{ data: DirectusItem[] }>(`/items/${collection}?filter=${filter}&limit=1`, {
    headers: buildAuthHeaders(token),
  });

  return response.data[0];
};

const createItem = async (token: string, collection: string, payload: DirectusItem) => {
  const response = await request<{ data: DirectusItem }>(`/items/${collection}`, {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(payload),
  });

  return response.data;
};

const updateSingleton = async (token: string, collection: string, payload: DirectusItem) => {
  const response = await request<{ data: DirectusItem }>(`/items/${collection}`, {
    method: 'PATCH',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(payload),
  });

  return response.data;
};

const updateItem = async (token: string, collection: string, id: string, payload: DirectusItem) => {
  const response = await request<{ data: DirectusItem }>(`/items/${collection}/${id}`, {
    method: 'PATCH',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(payload),
  });

  return response.data;
};

const upsertByField = async (token: string, collection: string, field: string, value: string, payload: DirectusItem) => {
  const existing = await findItemByField(token, collection, field, value);

  if (existing?.id) {
    return updateItem(token, collection, String(existing.id), payload);
  }

  return createItem(token, collection, payload);
};

const ensureSingleton = async (token: string, collection: string, payload: DirectusItem) => {
  const response = await request<DirectusCollectionResponse>(`/items/${collection}?limit=1`, {
    headers: buildAuthHeaders(token),
  });

  if (!Array.isArray(response.data)) {
    return updateSingleton(token, collection, payload);
  }

  const existing = response.data[0];

  if (existing?.id) {
    return updateItem(token, collection, String(existing.id), payload);
  }

  return createItem(token, collection, payload);
};

const seedGlobalSettings = async (token: string) => {
  await ensureSingleton(token, 'global_settings', {
    site_name: 'МАМОНТОВ - дизайн и ремонт',
    phone: '+7 (999) 123-45-67',
    email: 'hello@archibuild.ru',
    telegram_url: 'https://t.me/archibuild',
    whatsapp_url: 'https://wa.me/79991234567',
    office_address: 'ул. Архитектурная, 10, Москва',
    work_hours: 'Ежедневно с 10:00 до 20:00',
    hero_title: 'РЕМОНТ КАК ИСКУССТВО.',
    hero_subtitle:
      'Работаем с квартирами, домами и готовыми дизайн-проектами: считаем смету, ведем процесс по этапам и показываем качество не только на финальных фото, но и внутри ремонта.',
    contact_cta_title: 'Обсудим ваш объект',
    contact_cta_text:
      'Расскажите о квартире, доме или проекте. Мы уточним детали и предложим понятный следующий шаг.',
  });
};

const seedSiteTheme = async (token: string) => {
  await ensureSingleton(token, 'site_theme', {
    brand_primary: '#FFFFFF',
    brand_warm: '#F7F6F2',
    brand_secondary: '#F1EFEA',
    brand_text: '#111111',
    brand_muted: '#6D6D6D',
    brand_border: '#E6E2DA',
    brand_dark: '#0D0D0D',
    brand_support: '#B19B84',
    brand_accent: '#B4DE00',
    brand_accent_hover: '#C5F300',
    display_title_max: 110,
    section_title_max: 64,
    lead_text_size: 20,
    body_text_size: 16,
  });
};

const seedServices = async (token: string) => {
  for (const [index, service] of services.entries()) {
    await upsertByField(token, 'services', 'slug', service.slug, {
      status: 'published',
      sort: index + 1,
      title: service.title,
      slug: service.slug,
      short_description: service.description,
      full_description: service.description,
      features: service.features,
      includes: service.includes ?? [],
      steps: service.steps ?? [],
      price_factors: service.priceFactors ?? [],
    });
  }
};

const seedPartners = async (token: string) => {
  const partnerIdBySlug = new Map<string, string>();

  for (const [index, partner] of partners.entries()) {
    const saved = await upsertByField(token, 'partners', 'slug', partner.slug, {
      status: 'published',
      sort: index + 1,
      name: partner.name,
      slug: partner.slug,
      type: partner.type,
      specialization: partner.specialization,
      description: partner.description,
      location: partner.location ?? '',
      focus: partner.focus ?? '',
    });

    partnerIdBySlug.set(partner.slug, String(saved.id));
  }

  return partnerIdBySlug;
};

const seedTestimonials = async (token: string) => {
  const testimonialIdByAuthor = new Map<string, string>();

  for (const [index, testimonial] of testimonials.entries()) {
    const saved = await upsertByField(token, 'testimonials', 'author', testimonial.author, {
      status: 'published',
      sort: index + 1,
      author: testimonial.author,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating,
      object_type: testimonial.objectType ?? '',
    });

    testimonialIdByAuthor.set(testimonial.author, String(saved.id));
  }

  return testimonialIdByAuthor;
};

const seedProjects = async (
  token: string,
  partnerIdBySlug: Map<string, string>,
  testimonialIdByAuthor: Map<string, string>,
) => {
  const partnerSlugByProjectId = new Map<string, string>();

  for (const partner of partners) {
    for (const projectId of partner.projects ?? []) {
      partnerSlugByProjectId.set(projectId, partner.slug);
    }
  }

  for (const [index, project] of projects.entries()) {
    const partnerSlug = partnerSlugByProjectId.get(project.id);
    const partnerId = partnerSlug ? partnerIdBySlug.get(partnerSlug) : undefined;
    const testimonialAuthor = project.testimonial?.author;
    const testimonialId = testimonialAuthor ? testimonialIdByAuthor.get(testimonialAuthor) : undefined;

    await upsertByField(token, 'projects', 'slug', project.id, {
      status: 'published',
      sort: index + 1,
      title: project.title,
      slug: project.id,
      category: project.category,
      short_description: project.description,
      full_description: project.description,
      year: project.year,
      location: project.location,
      area: project.area,
      duration: project.duration,
      format: project.format,
      project_status: project.status,
      client_task: project.clientTask ?? '',
      steps_done: project.stepsDone ?? [],
      process_steps: project.process ?? [],
      complexities: project.complexities ?? [],
      partner: partnerId ?? null,
      testimonial: testimonialId ?? null,
    });
  }
};

const seedPriceRanges = async (token: string) => {
  for (const [index, range] of priceRanges.entries()) {
    await upsertByField(token, 'price_ranges', 'title', range.title, {
      status: 'published',
      sort: index + 1,
      title: range.title,
      price: range.price,
      description: range.description,
    });
  }
};

const flattenGeneralFaq = () =>
  Object.entries(generalFAQ).flatMap(([category, items]) =>
    items.map((item) => ({
      ...item,
      category,
      page_type: 'general',
    })),
  );

const buildFaqSeed = () => [
  ...homeFaq.map((item) => ({ ...item, category: 'Главная', page_type: 'general' })),
  ...flattenGeneralFaq(),
  ...aboutFAQ.map((item) => ({ ...item, category: 'О компании', page_type: 'about' })),
  ...priceFAQ.map((item) => ({ ...item, category: 'Цены', page_type: 'prices' })),
  ...partnerFAQ.map((item) => ({ ...item, category: 'Партнеры', page_type: 'partners' })),
  ...technologyFAQ.map((item) => ({ ...item, category: 'Технологии', page_type: 'technologies' })),
];

const seedFaq = async (token: string) => {
  const faqItems = buildFaqSeed();

  for (const [index, item] of faqItems.entries()) {
    await upsertByField(token, 'faq_items', 'question', item.question, {
      status: 'published',
      sort: index + 1,
      question: item.question,
      answer: item.answer,
      category: item.category,
      page_type: item.page_type,
    });
  }
};

const main = async () => {
  console.log(`Seeding Directus at ${DIRECTUS_URL}`);

  const token = await login();
  await seedGlobalSettings(token);
  await seedSiteTheme(token);
  await seedServices(token);
  const partnerIdBySlug = await seedPartners(token);
  const testimonialIdByAuthor = await seedTestimonials(token);
  await seedProjects(token, partnerIdBySlug, testimonialIdByAuthor);
  await seedPriceRanges(token);
  await seedFaq(token);

  console.log('Directus seed completed');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
