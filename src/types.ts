/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectProcess {
  label: string;
  image: string;
  description: string;
}

export interface ProjectComplexity {
  title: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  year: string;
  location: string;
  area: string;
  duration: string;
  format: string;
  status: string;
  clientTask?: string;
  stepsDone?: string[];
  process?: ProjectProcess[];
  complexities?: ProjectComplexity[];
  gallery?: { label: string; image: string }[];
  partnerSlug?: string;
  testimonial?: {
    content: string;
    author: string;
    role: string;
  };
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  features: string[];
  includes?: string[];
  steps?: { title: string; desc: string }[];
  priceFactors?: string[];
  faq?: FAQItem[];
}

export interface Partner {
  id: string;
  slug: string;
  name: string;
  type: string;
  specialization: string;
  image: string;
  description: string;
  location?: string;
  focus?: string;
  projects?: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  rating: number;
  objectType?: string;
  projectSlug?: string;
  image?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  responsibility: string;
  image: string;
}

export interface GlobalSettings {
  siteName: string;
  phone: string;
  email: string;
  telegramUrl?: string;
  whatsappUrl?: string;
  officeAddress: string;
  workHours?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  contactCtaTitle?: string;
  contactCtaText?: string;
}

export interface SiteTheme {
  brandPrimary: string;
  brandWarm: string;
  brandSecondary: string;
  brandText: string;
  brandMuted: string;
  brandBorder: string;
  brandDark: string;
  brandAccent: string;
  brandAccentHover: string;
  displayTitleMax: number;
  sectionTitleMax: number;
  leadTextSize: number;
  bodyTextSize: number;
}
