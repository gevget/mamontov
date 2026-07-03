import { FormEvent, useState } from 'react';
import { LogIn, LogOut, Palette, RotateCcw, Save, Settings2, Type, X } from 'lucide-react';
import { useSiteEditor } from '../context/SiteEditorContext';
import type { SiteTheme } from '../types';

type EditorTab = 'texts' | 'theme';

const numberValue = (value: string) => Number.parseInt(value, 10) || 0;

export const VisualEditor = () => {
  const {
    editorEnabled,
    settings,
    theme,
    isAuthenticated,
    isSaving,
    authError,
    saveError,
    updateSettings,
    updateTheme,
    resetSettings,
    resetTheme,
    login,
    logout,
    saveSettings,
    saveTheme,
  } = useSiteEditor();
  const [isOpen, setIsOpen] = useState(true);
  const [tab, setTab] = useState<EditorTab>('texts');
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('change-me-please');

  if (!editorEnabled) {
    return null;
  }

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    await login(email, password);
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed right-6 bottom-6 z-[70] flex items-center gap-3 rounded-full bg-brand-dark px-5 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary shadow-2xl"
        >
          <Settings2 className="h-4 w-4" />
          Editor
        </button>
      )}

      {isOpen && (
        <aside className="fixed right-0 top-0 z-[80] flex h-screen w-full max-w-md flex-col border-l border-brand-border bg-brand-primary shadow-2xl">
          <div className="flex items-center justify-between border-b border-brand-border px-6 py-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent">Visual Editor</p>
              <h2 className="mt-2 text-xl font-display font-semibold">Редактирование сайта</h2>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-full border border-brand-border p-2">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="border-b border-brand-border px-6 py-4">
            {!isAuthenticated ? (
              <form className="space-y-3" onSubmit={handleLogin}>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email Directus"
                  className="w-full border border-brand-border px-4 py-3 text-sm outline-none"
                />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Пароль"
                  type="password"
                  className="w-full border border-brand-border px-4 py-3 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 bg-brand-accent px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-dark"
                >
                  <LogIn className="h-4 w-4" />
                  Войти для сохранения
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-brand-muted">Сохранение в Directus доступно.</p>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-2 border border-brand-border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em]"
                >
                  <LogOut className="h-4 w-4" />
                  Выйти
                </button>
              </div>
            )}
            {authError && <p className="mt-3 text-sm text-red-600">{authError}</p>}
            {saveError && <p className="mt-3 text-sm text-red-600">{saveError}</p>}
          </div>

          <div className="grid grid-cols-2 border-b border-brand-border">
            <button
              type="button"
              onClick={() => setTab('texts')}
              className={`flex items-center justify-center gap-2 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.3em] ${
                tab === 'texts' ? 'bg-brand-warm text-brand-text' : 'text-brand-muted'
              }`}
            >
              <Type className="h-4 w-4" />
              Тексты
            </button>
            <button
              type="button"
              onClick={() => setTab('theme')}
              className={`flex items-center justify-center gap-2 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.3em] ${
                tab === 'theme' ? 'bg-brand-warm text-brand-text' : 'text-brand-muted'
              }`}
            >
              <Palette className="h-4 w-4" />
              Тема
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
            {tab === 'texts' ? (
              <>
                <label className="block space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Название сайта</span>
                  <input value={settings.siteName} onChange={(event) => updateSettings({ siteName: event.target.value })} className="w-full border border-brand-border px-4 py-3 text-sm outline-none" />
                </label>
                <label className="block space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Hero title</span>
                  <textarea value={settings.heroTitle || ''} onChange={(event) => updateSettings({ heroTitle: event.target.value })} className="min-h-28 w-full border border-brand-border px-4 py-3 text-sm outline-none" />
                </label>
                <label className="block space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Hero subtitle</span>
                  <textarea value={settings.heroSubtitle || ''} onChange={(event) => updateSettings({ heroSubtitle: event.target.value })} className="min-h-32 w-full border border-brand-border px-4 py-3 text-sm outline-none" />
                </label>
                <label className="block space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">CTA title</span>
                  <input value={settings.contactCtaTitle || ''} onChange={(event) => updateSettings({ contactCtaTitle: event.target.value })} className="w-full border border-brand-border px-4 py-3 text-sm outline-none" />
                </label>
                <label className="block space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">CTA text</span>
                  <textarea value={settings.contactCtaText || ''} onChange={(event) => updateSettings({ contactCtaText: event.target.value })} className="min-h-28 w-full border border-brand-border px-4 py-3 text-sm outline-none" />
                </label>
                <label className="block space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Телефон</span>
                  <input value={settings.phone} onChange={(event) => updateSettings({ phone: event.target.value })} className="w-full border border-brand-border px-4 py-3 text-sm outline-none" />
                </label>
                <label className="block space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Email</span>
                  <input value={settings.email} onChange={(event) => updateSettings({ email: event.target.value })} className="w-full border border-brand-border px-4 py-3 text-sm outline-none" />
                </label>
                <label className="block space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Адрес</span>
                  <textarea value={settings.officeAddress} onChange={(event) => updateSettings({ officeAddress: event.target.value })} className="min-h-24 w-full border border-brand-border px-4 py-3 text-sm outline-none" />
                </label>
                <label className="block space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Часы работы</span>
                  <input value={settings.workHours || ''} onChange={(event) => updateSettings({ workHours: event.target.value })} className="w-full border border-brand-border px-4 py-3 text-sm outline-none" />
                </label>
              </>
            ) : (
              <>
                {[
                  ['brandPrimary', 'Фон основной'],
                  ['brandWarm', 'Фон теплый'],
                  ['brandSecondary', 'Фон секции'],
                  ['brandText', 'Текст'],
                  ['brandMuted', 'Текст muted'],
                  ['brandBorder', 'Границы'],
                  ['brandDark', 'Темный фон'],
                  ['brandAccent', 'Accent'],
                  ['brandAccentHover', 'Accent hover'],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between gap-4">
                    <span className="text-sm">{label}</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={theme[key as keyof SiteTheme] as string}
                        onChange={(event) => updateTheme({ [key]: event.target.value } as Partial<SiteTheme>)}
                        className="h-10 w-14 border border-brand-border bg-transparent"
                      />
                      <input
                        value={theme[key as keyof SiteTheme] as string}
                        onChange={(event) => updateTheme({ [key]: event.target.value } as Partial<SiteTheme>)}
                        className="w-32 border border-brand-border px-3 py-2 text-sm outline-none"
                      />
                    </div>
                  </label>
                ))}

                {[
                  ['displayTitleMax', 'Hero max, px'],
                  ['sectionTitleMax', 'Section title max, px'],
                  ['leadTextSize', 'Lead text, px'],
                  ['bodyTextSize', 'Body text, px'],
                ].map(([key, label]) => (
                  <label key={key} className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">{label}</span>
                    <input
                      type="number"
                      value={theme[key as keyof SiteTheme] as number}
                      onChange={(event) => updateTheme({ [key]: numberValue(event.target.value) } as Partial<SiteTheme>)}
                      className="w-full border border-brand-border px-4 py-3 text-sm outline-none"
                    />
                  </label>
                ))}
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-brand-border px-6 py-5">
            <button
              type="button"
              onClick={tab === 'texts' ? resetSettings : resetTheme}
              className="flex items-center justify-center gap-2 border border-brand-border px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em]"
            >
              <RotateCcw className="h-4 w-4" />
              Сбросить
            </button>
            <button
              type="button"
              onClick={tab === 'texts' ? saveSettings : saveTheme}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 bg-brand-dark px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Сохраняю' : 'Сохранить'}
            </button>
          </div>
        </aside>
      )}
    </>
  );
};
