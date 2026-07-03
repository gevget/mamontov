import { Link } from 'react-router-dom';
import { Container } from './Base';
import { Send, Phone } from 'lucide-react';
import { useSiteEditor } from '../context/SiteEditorContext';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteEditor();

  return (
    <footer className="bg-brand-dark pt-24 pb-12 text-brand-primary">
      <Container>
        <div className="mb-24 grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-display font-bold tracking-tighter">
              {settings.siteName || 'ARCHIBUILD'}
            </Link>
            <p className="max-w-xs font-light leading-relaxed text-brand-primary/60">
              Премиальная ремонтно-строительная команда для квартир, домов и проектов с высокой требовательностью к деталям.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Навигация</h4>
            <ul className="space-y-4 text-sm font-light text-brand-primary/80">
              <li><Link to="/projects" className="transition-colors hover:text-brand-accent">Проекты</Link></li>
              <li><Link to="/services" className="transition-colors hover:text-brand-accent">Услуги</Link></li>
              <li><Link to="/prices" className="transition-colors hover:text-brand-accent">Цены</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-brand-accent">О нас</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Сценарии</h4>
            <ul className="space-y-4 text-sm font-light text-brand-primary/80">
              <li><Link to="/services/design-project-renovation" className="transition-colors hover:text-brand-accent">Ремонт по проекту</Link></li>
              <li><Link to="/services/apartments" className="transition-colors hover:text-brand-accent">Ремонт квартир</Link></li>
              <li><Link to="/services/houses" className="transition-colors hover:text-brand-accent">Частные дома</Link></li>
              <li><Link to="/technologies" className="transition-colors hover:text-brand-accent">Технологии</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Контакты</h4>
            <ul className="space-y-4 text-sm font-light text-brand-primary/80">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand-accent" />
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`} className="transition-colors hover:text-brand-accent">{settings.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Send className="h-4 w-4 text-brand-accent" />
                <a href={settings.telegramUrl || 'https://t.me/archibuild'} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand-accent">Telegram</a>
              </li>
              <li className="pt-2">
                <span className="mb-2 block text-xs uppercase tracking-widest text-brand-primary/40">Офис</span>
                <span className="text-brand-primary/60">{settings.officeAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-brand-primary/10 pt-8 text-xs uppercase tracking-widest text-brand-primary/40 md:flex-row">
          <p>{currentYear} {settings.siteName || 'ARCHIBUILD'}. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link to="/contacts" className="transition-colors hover:text-brand-accent">Политика и контакты</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
