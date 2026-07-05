import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getGlobalSettings, getSiteTheme } from '../lib/api';
import { loginToDirectus, updateDirectusSingleton } from '../lib/directus';
import { defaultGlobalSettings, defaultSiteTheme } from '../lib/site-defaults';
import type { GlobalSettings, SiteTheme } from '../types';

export type VisualElementOverride = {
  text?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  letterSpacing?: string;
  textTransform?: string;
};

type SiteEditorContextValue = {
  editorEnabled: boolean;
  setEditorEnabled: (enabled: boolean) => void;
  elementOverrides: Record<string, VisualElementOverride>;
  updateElementOverride: (selector: string, patch: Partial<VisualElementOverride>) => void;
  removeElementOverride: (selector: string) => void;
  resetElementOverrides: () => void;
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
const LOCAL_STORAGE_EDITOR_KEY = 'site-editor-enabled';
const LOCAL_STORAGE_ELEMENT_OVERRIDES_KEY = 'site-editor-element-overrides';
const VISUAL_EDITOR_AVAILABLE = import.meta.env.DEV || import.meta.env.VITE_ENABLE_VISUAL_EDITOR === 'true';

const applyTheme = (theme: SiteTheme) => {
  const root = document.documentElement;

  root.style.setProperty('--editor-color-brand-primary', theme.brandPrimary);
  root.style.setProperty('--editor-color-brand-warm', theme.brandWarm);
  root.style.setProperty('--editor-color-brand-secondary', theme.brandSecondary);
  root.style.setProperty('--editor-color-brand-text', theme.brandText);
  root.style.setProperty('--editor-color-brand-muted', theme.brandMuted);
  root.style.setProperty('--editor-color-brand-border', theme.brandBorder);
  root.style.setProperty('--editor-color-brand-dark', theme.brandDark);
  root.style.setProperty('--editor-color-brand-support', theme.brandSupport);
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
  brand_support: theme.brandSupport,
  brand_accent: theme.brandAccent,
  brand_accent_hover: theme.brandAccentHover,
  display_title_max: theme.displayTitleMax,
  section_title_max: theme.sectionTitleMax,
  lead_text_size: theme.leadTextSize,
  body_text_size: theme.bodyTextSize,
});

export const SiteEditorProvider = ({ children }: { children: ReactNode }) => {
  const [editorEnabled, setEditorEnabledState] = useState(false);
  const [elementOverrides, setElementOverrides] = useState<Record<string, VisualElementOverride>>({});
  const [settings, setSettings] = useState(defaultGlobalSettings);
  const [savedSettings, setSavedSettings] = useState(defaultGlobalSettings);
  const [theme, setTheme] = useState(defaultSiteTheme);
  const [savedTheme, setSavedTheme] = useState(defaultSiteTheme);
  const [token, setToken] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!VISUAL_EDITOR_AVAILABLE) {
      window.localStorage.removeItem(LOCAL_STORAGE_EDITOR_KEY);
      window.localStorage.removeItem(LOCAL_STORAGE_ELEMENT_OVERRIDES_KEY);
    }

    const params = new URLSearchParams(window.location.search);
    const enabledFromQuery = params.get('editor') === '1';
    const enabledFromStorage = window.localStorage.getItem(LOCAL_STORAGE_EDITOR_KEY) === 'true';
    const nextEnabled = VISUAL_EDITOR_AVAILABLE && (enabledFromQuery || enabledFromStorage);

    setEditorEnabledState(nextEnabled);
    if (nextEnabled) {
      window.localStorage.setItem(LOCAL_STORAGE_EDITOR_KEY, 'true');
    }

    const savedOverrides = VISUAL_EDITOR_AVAILABLE
      ? window.localStorage.getItem(LOCAL_STORAGE_ELEMENT_OVERRIDES_KEY)
      : null;
    if (savedOverrides) {
      try {
        setElementOverrides(JSON.parse(savedOverrides) as Record<string, VisualElementOverride>);
      } catch {
        window.localStorage.removeItem(LOCAL_STORAGE_ELEMENT_OVERRIDES_KEY);
      }
    }

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

  const setEditorEnabled = (enabled: boolean) => {
    if (!VISUAL_EDITOR_AVAILABLE) {
      setEditorEnabledState(false);
      return;
    }

    setEditorEnabledState(enabled);
    if (enabled) {
      window.localStorage.setItem(LOCAL_STORAGE_EDITOR_KEY, 'true');
      return;
    }

    window.localStorage.removeItem(LOCAL_STORAGE_EDITOR_KEY);
  };

  const updateElementOverride = (selector: string, patch: Partial<VisualElementOverride>) => {
    if (!VISUAL_EDITOR_AVAILABLE) {
      return;
    }

    setElementOverrides((current) => {
      const next = {
        ...current,
        [selector]: {
          ...current[selector],
          ...patch,
        },
      };

      window.localStorage.setItem(LOCAL_STORAGE_ELEMENT_OVERRIDES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const removeElementOverride = (selector: string) => {
    if (!VISUAL_EDITOR_AVAILABLE) {
      return;
    }

    setElementOverrides((current) => {
      const next = { ...current };
      delete next[selector];
      window.localStorage.setItem(LOCAL_STORAGE_ELEMENT_OVERRIDES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetElementOverrides = () => {
    if (!VISUAL_EDITOR_AVAILABLE) {
      return;
    }

    setElementOverrides({});
    window.localStorage.removeItem(LOCAL_STORAGE_ELEMENT_OVERRIDES_KEY);
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
        setEditorEnabled,
        elementOverrides,
        updateElementOverride,
        removeElementOverride,
        resetElementOverrides,
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
