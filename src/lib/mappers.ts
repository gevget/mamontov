import type { FAQItem, GlobalSettings, Partner, Project, Service, SiteTheme, Testimonial } from '../types';
import type {
  DirectusFaqItem,
  DirectusFileRef,
  DirectusGlobalSettingsItem,
  DirectusPartnerItem,
  DirectusPriceRangeItem,
  DirectusProjectItem,
  DirectusServiceItem,
  DirectusSiteThemeItem,
  DirectusTestimonialItem,
} from './cms-types';
import { buildDirectusAssetUrl } from './directus';
import { defaultSiteTheme } from './site-defaults';

type PriceRange = {
  title: string;
  price: string;
  description: string;
};

const parseJsonValue = <T>(value: T | string | null | undefined, fallback: T): T => {
  if (value == null) {
    return fallback;
  }

  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const mapDirectusService = (item: DirectusServiceItem): Service => ({
  id: item.slug || item.id,
  slug: item.slug,
  title: item.title,
  description: item.full_description || item.short_description || '',
  image: buildDirectusAssetUrl(item.hero_image),
  features: parseJsonValue(item.features, [] as string[]),
  includes: parseJsonValue(item.includes, [] as string[]),
  steps: parseJsonValue(item.steps, [] as { title: string; desc: string }[]),
  priceFactors: parseJsonValue(item.price_factors, [] as string[]),
});

export const mapDirectusPartner = (item: DirectusPartnerItem): Partner => ({
  id: item.slug || item.id,
  slug: item.slug,
  name: item.name,
  type: item.type || '',
  specialization: item.specialization || '',
  image: buildDirectusAssetUrl(item.image) || '',
  description: item.description || '',
  location: item.location || undefined,
  focus: item.focus || undefined,
});

export const mapDirectusPriceRange = (item: DirectusPriceRangeItem): PriceRange => ({
  title: item.title,
  price: item.price,
  description: item.description || '',
});

export const mapDirectusTestimonial = (item: DirectusTestimonialItem): Testimonial => ({
  id: item.id,
  author: item.author,
  role: item.role || '',
  content: item.content,
  rating: item.rating || 5,
  objectType: item.object_type || undefined,
  image: buildDirectusAssetUrl(item.image),
});

export const mapDirectusFaqItem = (item: DirectusFaqItem): FAQItem => ({
  id: item.id,
  question: item.question,
  answer: item.answer,
});

const resolveGalleryImage = (item: NonNullable<Exclude<DirectusProjectItem['gallery'], string>>[number]) => {
  if (!item) return undefined;
  if (typeof item === 'string') return buildDirectusAssetUrl(item);
  if ('directus_files_id' in item) return buildDirectusAssetUrl(item.directus_files_id);
  if ('id' in item) return buildDirectusAssetUrl(item);
  return undefined;
};

export const mapDirectusProject = (item: DirectusProjectItem): Project => ({
  id: item.slug || item.id,
  title: item.title,
  category: item.category || '',
  image: buildDirectusAssetUrl(item.hero_image) || '',
  description: item.full_description || item.short_description || '',
  year: item.year || '',
  location: item.location || '',
  area: item.area || '',
  duration: item.duration || '',
  format: item.format || '',
  status: item.project_status || '',
  clientTask: item.client_task || undefined,
  stepsDone: parseJsonValue(item.steps_done, [] as string[]).length
    ? parseJsonValue(item.steps_done, [] as string[])
    : undefined,
  process: parseJsonValue(item.process_steps, [] as { label: string; image?: string | DirectusFileRef | null; description: string }[]).map((step) => ({
    label: step.label,
    image: buildDirectusAssetUrl(step.image) || '',
    description: step.description,
  })),
  complexities: parseJsonValue(item.complexities, [] as { title: string; description: string }[]).length
    ? parseJsonValue(item.complexities, [] as { title: string; description: string }[])
    : undefined,
  gallery: parseJsonValue(item.gallery, [] as NonNullable<Exclude<DirectusProjectItem['gallery'], string>>)
    ?.map((galleryItem, index) => {
      const image = resolveGalleryImage(galleryItem);
      return image
        ? {
            label: `Кадр ${String(index + 1).padStart(2, '0')}`,
            image,
          }
        : null;
    })
    .filter((galleryItem): galleryItem is NonNullable<typeof galleryItem> => Boolean(galleryItem)),
  partnerSlug: typeof item.partner === 'string' ? item.partner : item.partner?.slug || item.partner?.id || undefined,
  testimonial:
    item.testimonial && 'content' in item.testimonial && item.testimonial.content
      ? {
          content: item.testimonial.content,
          author: item.testimonial.author || '',
          role: item.testimonial.role || '',
        }
      : undefined,
});

export const mapDirectusGlobalSettings = (item: DirectusGlobalSettingsItem): GlobalSettings => ({
  siteName: item.site_name || 'ARCHIBUILD',
  phone: item.phone || '+7 (999) 123-45-67',
  email: item.email || 'hello@archibuild.ru',
  telegramUrl: item.telegram_url || undefined,
  whatsappUrl: item.whatsapp_url || undefined,
  officeAddress: item.office_address || 'ул. Архитектурная, 10, Москва',
  workHours: item.work_hours || 'Ежедневно с 10:00 до 20:00',
  heroTitle: item.hero_title || undefined,
  heroSubtitle: item.hero_subtitle || undefined,
  contactCtaTitle: item.contact_cta_title || undefined,
  contactCtaText: item.contact_cta_text || undefined,
});

export const mapDirectusSiteTheme = (item: DirectusSiteThemeItem): SiteTheme => ({
  brandPrimary: item.brand_primary || defaultSiteTheme.brandPrimary,
  brandWarm: item.brand_warm || defaultSiteTheme.brandWarm,
  brandSecondary: item.brand_secondary || defaultSiteTheme.brandSecondary,
  brandText: item.brand_text || defaultSiteTheme.brandText,
  brandMuted: item.brand_muted || defaultSiteTheme.brandMuted,
  brandBorder: item.brand_border || defaultSiteTheme.brandBorder,
  brandDark: item.brand_dark || defaultSiteTheme.brandDark,
  brandAccent: item.brand_accent || defaultSiteTheme.brandAccent,
  brandAccentHover: item.brand_accent_hover || defaultSiteTheme.brandAccentHover,
  displayTitleMax: item.display_title_max || defaultSiteTheme.displayTitleMax,
  sectionTitleMax: item.section_title_max || defaultSiteTheme.sectionTitleMax,
  leadTextSize: item.lead_text_size || defaultSiteTheme.leadTextSize,
  bodyTextSize: item.body_text_size || defaultSiteTheme.bodyTextSize,
});
