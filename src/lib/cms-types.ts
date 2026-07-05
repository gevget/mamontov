export interface DirectusFileRef {
  id?: string;
  filename_disk?: string;
}

export interface DirectusListResponse<T> {
  data: T[];
}

export interface DirectusSingleResponse<T> {
  data: T;
}

export interface DirectusServiceItem {
  id: string;
  slug: string;
  title: string;
  short_description?: string | null;
  full_description?: string | null;
  hero_image?: string | DirectusFileRef | null;
  features?: string[] | string | null;
  includes?: string[] | string | null;
  steps?: { title: string; desc: string }[] | string | null;
  price_factors?: string[] | string | null;
}

export interface DirectusPartnerItem {
  id: string;
  slug: string;
  name: string;
  type?: string | null;
  specialization?: string | null;
  description?: string | null;
  location?: string | null;
  focus?: string | null;
  image?: string | DirectusFileRef | null;
}

export interface DirectusPriceRangeItem {
  id: string;
  title: string;
  price: string;
  description?: string | null;
}

export interface DirectusTestimonialItem {
  id: string;
  author: string;
  role?: string | null;
  content: string;
  rating?: number | null;
  image?: string | DirectusFileRef | null;
  object_type?: string | null;
}

export interface DirectusFaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  page_type?: string | null;
}

export interface DirectusProjectItem {
  id: string;
  slug: string;
  title: string;
  category?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  year?: string | null;
  location?: string | null;
  area?: string | null;
  duration?: string | null;
  format?: string | null;
  project_status?: string | null;
  hero_image?: string | DirectusFileRef | null;
  client_task?: string | null;
  steps_done?: string[] | string | null;
  process_steps?:
    | { label: string; image?: string | DirectusFileRef | null; description: string }[]
    | string
    | null;
  complexities?: { title: string; description: string }[] | string | null;
  gallery?: Array<
    | string
    | DirectusFileRef
    | {
        directus_files_id?: string | DirectusFileRef | null;
      }
  > | string | null;
  partner?: string | { slug?: string | null; id?: string | null } | null;
  testimonial?:
    | DirectusTestimonialItem
    | {
        id?: string | null;
        author?: string | null;
        role?: string | null;
        content?: string | null;
      }
    | null;
}

export interface DirectusGlobalSettingsItem {
  id?: string | null;
  site_name?: string | null;
  phone?: string | null;
  email?: string | null;
  telegram_url?: string | null;
  whatsapp_url?: string | null;
  office_address?: string | null;
  work_hours?: string | null;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  contact_cta_title?: string | null;
  contact_cta_text?: string | null;
}

export interface DirectusSiteThemeItem {
  id?: string | null;
  brand_primary?: string | null;
  brand_warm?: string | null;
  brand_secondary?: string | null;
  brand_text?: string | null;
  brand_muted?: string | null;
  brand_border?: string | null;
  brand_dark?: string | null;
  brand_support?: string | null;
  brand_accent?: string | null;
  brand_accent_hover?: string | null;
  display_title_max?: number | null;
  section_title_max?: number | null;
  lead_text_size?: number | null;
  body_text_size?: number | null;
}
