import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getGlobalSettings, getSiteTheme } from '../lib/api';
import { loginToDirectus, updateDirectusSingleton } from '../lib/directus';
import { defaultGlobalSettings, defaultSiteTheme } from '../lib/site-defaults';
import type { GlobalSettings, SiteTheme } from '../types';

type SiteEditorContextValue = {
  editorEnabled: boolean;
  settings: GlobalSettings;
  theme: SiteTheme;
  isAuthenticated: boolean;
  isSaving: boolean;
  authError: string | null;
  saveError: string | null;
  updateSettings: (patch: Partial<GlobalSettings>) => void;
  updateTheme: (patch: Partial<SiteTheme>) => void;
  resetSettings: () => void;
  resetTheme: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  saveSettings: () => Promise<void>;
  saveTheme: () => Promise<void>;
};

const SiteEditorContext = createContext<SiteEditorContextValue | null>(null);
const SESSION_STORAGE_TOKEN_KEY = 'site-editor-token';

const applyTheme = (theme: SiteTheme) => {
  const root = document.documentElement;

  root.style.setProperty('--editor-color-brand-primary', theme.brandPrimary);
  root.style.setProperty('--editor-color-brand-warm', theme.brandWarm);
  root.style.setProperty('--editor-color-brand-secondary', theme.brandSecondary);
  root.style.setProperty('--editor-color-brand-text', theme.brandText);
  root.style.setProperty('--editor-color-brand-muted', theme.brandMuted);
  root.style.setProperty('--editor-color-brand-border', theme.brandBorder);
  root.style.setProperty('--editor-color-brand-dark', theme.brandDark);
  root.style.setProperty('--editor-color-brand-accent', theme.brandAccent);
  root.style.setProperty('--editor-color-brand-accent-hover', theme.brandAccentHover);
  root.style.setProperty('--editor-display-size-max', `${theme.displayTitleMax}px`);
  root.style.setProperty('--editor-heading-size-max', `${theme.sectionTitleMax}px`);
  root.style.setProperty('--editor-lead-size', `${theme.leadTextSize}px`);
  root.style.setProperty('--editor-body-size', `${theme.bodyTextSize}px`);
};

const mapSettingsPayload = (settings: GlobalSettings) => ({
  site_name: settings.siteName,
  phone: settings.phone,
  email: settings.email,
  telegram_url: settings.telegramUrl || null,
  whatsapp_url: settings.whatsappUrl || null,
  office_address: settings.officeAddress,
  work_hours: settings.workHours || null,
  hero_title: settings.heroTitle || null,
  hero_subtitle: settings.heroSubtitle || null,
  contact_cta_title: settings.contactCtaTitle || null,
  contact_cta_text: settings.contactCtaText || null,
});

const mapThemePayload = (theme: SiteTheme) => ({
  brand_primary: theme.brandPrimary,
  brand_warm: theme.brandWarm,
  brand_secondary: theme.brandSecondary,
  brand_text: theme.brandText,
  brand_muted: theme.brandMuted,
  brand_border: theme.brandBorder,
  brand_dark: theme.brandDark,
  brand_accent: theme.brandAccent,
  brand_accent_hover: theme.brandAccentHover,
  display_title_max: theme.displayTitleMax,
  section_title_max: theme.sectionTitleMax,
  lead_text_size: theme.leadTextSize,
  body_text_size: theme.bodyTextSize,
});

export const SiteEditorProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState(defaultGlobalSettings);
  const [savedSettings, setSavedSettings] = useState(defaultGlobalSettings);
  const [theme, setTheme] = useState(defaultSiteTheme);
  const [savedTheme, setSavedTheme] = useState(defaultSiteTheme);
  const [token, setToken] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const editorEnabled =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('editor') === '1';

  useEffect(() => {
    const savedToken = window.sessionStorage.getItem(SESSION_STORAGE_TOKEN_KEY);
    if (savedToken) {
      setToken(savedToken);
    }

    getGlobalSettings().then((value) => {
      setSettings(value);
      setSavedSettings(value);
    });

    getSiteTheme().then((value) => {
      setTheme(value);
      setSavedTheme(value);
    });
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const login = async (email: string, password: string) => {
    try {
      setAuthError(null);
      const accessToken = await loginToDirectus(email, password);
      setToken(accessToken);
      window.sessionStorage.setItem(SESSION_STORAGE_TOKEN_KEY, accessToken);
    } catch {
      setAuthError('Не удалось войти в Directus. Проверьте логин и пароль.');
      throw new Error('Directus auth failed');
    }
  };

  const logout = () => {
    setToken('');
    window.sessionStorage.removeItem(SESSION_STORAGE_TOKEN_KEY);
  };

  const saveSettings = async () => {
    if (!token) {
      setSaveError('Сначала войдите в Directus.');
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      await updateDirectusSingleton('global_settings', mapSettingsPayload(settings), token);
      setSavedSettings(settings);
    } catch {
      setSaveError('Не удалось сохранить тексты.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveTheme = async () => {
    if (!token) {
      setSaveError('Сначала войдите в Directus.');
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      await updateDirectusSingleton('site_theme', mapThemePayload(theme), token);
      setSavedTheme(theme);
    } catch {
      setSaveError('Не удалось сохранить тему.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SiteEditorContext.Provider
      value={{
        editorEnabled,
        settings,
        theme,
        isAuthenticated: Boolean(token),
        isSaving,
        authError,
        saveError,
        updateSettings: (patch) => setSettings((current) => ({ ...current, ...patch })),
        updateTheme: (patch) => setTheme((current) => ({ ...current, ...patch })),
        resetSettings: () => setSettings(savedSettings),
        resetTheme: () => setTheme(savedTheme),
        login,
        logout,
        saveSettings,
        saveTheme,
      }}
    >
      {children}
    </SiteEditorContext.Provider>
  );
};

export const useSiteEditor = () => {
  const context = useContext(SiteEditorContext);

  if (!context) {
    throw new Error('useSiteEditor must be used inside SiteEditorProvider');
  }

  return context;
};
