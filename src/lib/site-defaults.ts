import type { GlobalSettings, SiteTheme } from '../types';

export const defaultGlobalSettings: GlobalSettings = {
  siteName: 'ARCHIBUILD',
  phone: '+7 (999) 123-45-67',
  email: 'hello@archibuild.ru',
  telegramUrl: 'https://t.me/archibuild',
  whatsappUrl: 'https://wa.me/79991234567',
  officeAddress: 'ул. Архитектурная, 10, Москва',
  workHours: 'Ежедневно с 10:00 до 20:00',
  heroTitle: 'РЕМОНТ КАК СИСТЕМА.',
  heroSubtitle:
    'Работаем с квартирами, домами и готовыми дизайн-проектами: считаем смету, ведем процесс по этапам и показываем качество не только на финальных фото, но и внутри ремонта.',
  contactCtaTitle: 'Обсудим ваш объект',
  contactCtaText:
    'Расскажите о квартире, доме или проекте. Мы уточним детали и подготовим понятный следующий шаг.',
};

export const defaultSiteTheme: SiteTheme = {
  brandPrimary: '#FFFFFF',
  brandWarm: '#F7F6F2',
  brandSecondary: '#F1EFEA',
  brandText: '#111111',
  brandMuted: '#6D6D6D',
  brandBorder: '#E6E2DA',
  brandDark: '#0D0D0D',
  brandAccent: '#B4DE00',
  brandAccentHover: '#C5F300',
  displayTitleMax: 110,
  sectionTitleMax: 64,
  leadTextSize: 20,
  bodyTextSize: 16,
};
