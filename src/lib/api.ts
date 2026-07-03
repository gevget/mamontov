import {
  aboutFAQ,
  faq as mockHomeFaq,
  generalFAQ,
  partnerFAQ,
  partners as mockPartners,
  priceFAQ,
  priceRanges as mockPriceRanges,
  projects as mockProjects,
  services as mockServices,
  technologyFAQ,
  testimonials as mockTestimonials,
} from '../data/mock';
import type { FAQItem, GlobalSettings, Partner, Project, Service, SiteTheme, Testimonial } from '../types';
import type {
  DirectusFaqItem,
  DirectusGlobalSettingsItem,
  DirectusPartnerItem,
  DirectusPriceRangeItem,
  DirectusProjectItem,
  DirectusServiceItem,
  DirectusSiteThemeItem,
  DirectusTestimonialItem,
} from './cms-types';
import { readDirectusItems, readDirectusSingleton } from './directus';
import {
  mapDirectusFaqItem,
  mapDirectusGlobalSettings,
  mapDirectusPartner,
  mapDirectusPriceRange,
  mapDirectusProject,
  mapDirectusService,
  mapDirectusSiteTheme,
  mapDirectusTestimonial,
} from './mappers';
import { defaultGlobalSettings, defaultSiteTheme } from './site-defaults';

type PriceRange = (typeof mockPriceRanges)[number];
type FaqGroups = Record<string, FAQItem[]>;

const fallbackSettings: GlobalSettings = defaultGlobalSettings;

const publishedParams = {
  filter: JSON.stringify({ status: { _eq: 'published' } }),
  sort: 'sort',
};

const mergeServiceWithFallback = (service: Service) => {
  const fallback = mockServices.find((item) => item.slug === service.slug || item.id === service.id);

  if (!fallback) {
    return service;
  }

  return {
    ...fallback,
    ...service,
    image: service.image || fallback.image,
    features: service.features.length ? service.features : fallback.features,
    includes: service.includes?.length ? service.includes : fallback.includes,
    steps: service.steps?.length ? service.steps : fallback.steps,
    priceFactors: service.priceFactors?.length ? service.priceFactors : fallback.priceFactors,
    faq: fallback.faq,
  };
};

const mergePartnerWithFallback = (partner: Partner) => {
  const fallback = mockPartners.find((item) => item.slug === partner.slug || item.id === partner.id);

  if (!fallback) {
    return partner;
  }

  return {
    ...fallback,
    ...partner,
    image: partner.image || fallback.image,
    projects: fallback.projects,
  };
};

const mergePriceRangeWithFallback = (range: PriceRange, index: number) => {
  const fallback = mockPriceRanges[index];

  if (!fallback) {
    return range;
  }

  return {
    ...fallback,
    ...range,
  };
};

const mergeProjectWithFallback = (project: Project) => {
  const fallback = mockProjects.find((item) => item.id === project.id);

  if (!fallback) {
    return project;
  }

  return {
    ...fallback,
    ...project,
    image: project.image || fallback.image,
    clientTask: project.clientTask || fallback.clientTask,
    stepsDone: project.stepsDone?.length ? project.stepsDone : fallback.stepsDone,
    process: project.process?.length ? project.process : fallback.process,
    complexities: project.complexities?.length ? project.complexities : fallback.complexities,
    gallery: project.gallery?.length ? project.gallery : fallback.gallery,
    testimonial: project.testimonial || fallback.testimonial,
  };
};

const groupFaqItems = (items: DirectusFaqItem[]) =>
  items.reduce<FaqGroups>((accumulator, item) => {
    const category = item.category || 'Общее';
    if (!accumulator[category]) {
      accumulator[category] = [];
    }
    accumulator[category].push(mapDirectusFaqItem(item));
    return accumulator;
  }, {});

const flattenFaqGroups = (groups: Record<string, FAQItem[]>) => Object.values(groups).flat();

export const getServices = async () => {
  try {
    const response = await readDirectusItems<DirectusServiceItem>('services', {
      ...publishedParams,
      fields: 'id,slug,title,short_description,full_description,hero_image,features,includes,steps,price_factors',
    });

    if (!response.data.length) {
      return mockServices;
    }

    return response.data.map(mapDirectusService).map(mergeServiceWithFallback);
  } catch {
    return mockServices;
  }
};

export const getPartners = async () => {
  try {
    const response = await readDirectusItems<DirectusPartnerItem>('partners', {
      ...publishedParams,
      fields: 'id,slug,name,type,specialization,description,location,focus,image',
    });

    if (!response.data.length) {
      return mockPartners;
    }

    return response.data.map(mapDirectusPartner).map(mergePartnerWithFallback);
  } catch {
    return mockPartners;
  }
};

export const getPriceRanges = async () => {
  try {
    const response = await readDirectusItems<DirectusPriceRangeItem>('price_ranges', {
      ...publishedParams,
      fields: 'id,title,price,description',
    });

    if (!response.data.length) {
      return mockPriceRanges;
    }

    return response.data.map(mapDirectusPriceRange).map(mergePriceRangeWithFallback);
  } catch {
    return mockPriceRanges;
  }
};

export const getProjects = async () => {
  try {
    const response = await readDirectusItems<DirectusProjectItem>('projects', {
      ...publishedParams,
      fields:
        'id,slug,title,category,short_description,full_description,year,location,area,duration,format,project_status,hero_image,client_task,steps_done,process_steps,complexities,gallery,partner.slug,partner.id,testimonial.id,testimonial.author,testimonial.role,testimonial.content',
    });

    if (!response.data.length) {
      return mockProjects;
    }

    return response.data.map(mapDirectusProject).map(mergeProjectWithFallback);
  } catch {
    return mockProjects;
  }
};

export const getTestimonials = async () => {
  try {
    const response = await readDirectusItems<DirectusTestimonialItem>('testimonials', {
      ...publishedParams,
      fields: 'id,author,role,content,rating,image,object_type',
    });

    if (!response.data.length) {
      return mockTestimonials;
    }

    return response.data.map(mapDirectusTestimonial);
  } catch {
    return mockTestimonials;
  }
};

export const getFaqItemsByPage = async (pageType: string, fallback: FAQItem[]) => {
  try {
    const response = await readDirectusItems<DirectusFaqItem>('faq_items', {
      ...publishedParams,
      filter: JSON.stringify({
        status: { _eq: 'published' },
        page_type: { _eq: pageType },
      }),
      fields: 'id,question,answer,category,page_type',
    });

    if (!response.data.length) {
      return fallback;
    }

    return response.data.map(mapDirectusFaqItem);
  } catch {
    return fallback;
  }
};

export const getGeneralFaqGroups = async () => {
  try {
    const response = await readDirectusItems<DirectusFaqItem>('faq_items', {
      ...publishedParams,
      filter: JSON.stringify({
        status: { _eq: 'published' },
        page_type: { _eq: 'general' },
      }),
      fields: 'id,question,answer,category,page_type',
    });

    if (!response.data.length) {
      return generalFAQ;
    }

    return groupFaqItems(response.data);
  } catch {
    return generalFAQ;
  }
};

export const getHomeFaq = async () => {
  const grouped = await getGeneralFaqGroups();
  const flattened = flattenFaqGroups(grouped);
  return flattened.length ? flattened.slice(0, 4) : mockHomeFaq;
};

export const getAboutFaq = async () => getFaqItemsByPage('about', aboutFAQ);
export const getPriceFaq = async () => getFaqItemsByPage('prices', priceFAQ);
export const getPartnerFaq = async () => getFaqItemsByPage('partners', partnerFAQ);
export const getTechnologyFaq = async () => getFaqItemsByPage('technologies', technologyFAQ);

export const getGlobalSettings = async () => {
  try {
    const response = await readDirectusSingleton<DirectusGlobalSettingsItem>('global_settings', {
      fields:
        'site_name,phone,email,telegram_url,whatsapp_url,office_address,work_hours,hero_title,hero_subtitle,contact_cta_title,contact_cta_text',
    });

    if (!response.data || !response.data.site_name) {
      return fallbackSettings;
    }

    return mapDirectusGlobalSettings(response.data);
  } catch {
    return fallbackSettings;
  }
};

export const getSiteTheme = async () => {
  try {
    const response = await readDirectusSingleton<DirectusSiteThemeItem>('site_theme', {
      fields:
        'brand_primary,brand_warm,brand_secondary,brand_text,brand_muted,brand_border,brand_dark,brand_accent,brand_accent_hover,display_title_max,section_title_max,lead_text_size,body_text_size',
    });

    if (!response.data) {
      return defaultSiteTheme;
    }

    return mapDirectusSiteTheme(response.data);
  } catch {
    return defaultSiteTheme;
  }
};
