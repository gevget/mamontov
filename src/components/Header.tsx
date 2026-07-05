import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from './Base';
import { motion, AnimatePresence } from 'motion/react';
import { useModal } from '../context/ModalContext';
import { useSiteEditor } from '../context/SiteEditorContext';
import logo from '../../logo.png';

const NAV_LINKS = [
  { name: 'Проекты', href: '/projects' },
  { name: 'Услуги', href: '/services' },
  { name: 'Цены', href: '/prices' },
  { name: 'Технологии', href: '/technologies' },
  { name: 'Партнеры', href: '/partners' },
  { name: 'О нас', href: '/about' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Контакты', href: '/contacts' },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { openModal } = useModal();
  const { settings } = useSiteEditor();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'border-b border-brand-border bg-brand-primary/95 py-4 backdrop-blur-sm' : 'bg-transparent py-8'
      }`}
    >
      <div className="flex w-full items-center justify-between gap-8 px-6 md:px-12">
        <Link to="/" className="flex items-center" aria-label={settings.siteName || 'МАМОНТОВ - дизайн и ремонт'}>
          <img
            src={logo}
            alt={settings.siteName || 'МАМОНТОВ - дизайн и ремонт'}
            className="h-[36px] w-auto shrink-0 object-contain"
          />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 text-xs uppercase tracking-widest transition-all duration-300 ${
                  isActive
                    ? 'rounded-full border border-brand-support/40 bg-brand-support/10 font-semibold text-brand-text'
                    : 'text-brand-muted hover:text-brand-accent'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button variant="accent" className="!px-6 !py-3 text-xs uppercase tracking-widest" onClick={() => openModal('project')}>
            Обсудить проект <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <button className="p-2 text-brand-text lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-0 right-0 top-full border-b border-brand-border bg-brand-primary lg:hidden"
          >
            <nav className="flex flex-col gap-4 p-6">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} to={link.href} className="border-b border-brand-border/50 py-2 text-lg font-display last:border-0">
                  {link.name}
                </Link>
              ))}
              <Button
                variant="accent"
                className="mt-4 w-full"
                onClick={() => {
                  setIsOpen(false);
                  openModal('project');
                }}
              >
                Обсудить проект
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
