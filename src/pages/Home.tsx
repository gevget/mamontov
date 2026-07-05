import { Container, Section, Button } from '../components/Base';
import { FAQAccordion, ProjectCard, ServiceCard, TestimonialCard } from '../components/Content';
import { LeadForm } from '../components/LeadForm';
import { faq as mockFaq, projects as mockProjects, services as mockServices, testimonials as mockTestimonials } from '../data/mock';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, ClipboardList, FileText, MessageSquareMore, Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useSiteEditor } from '../context/SiteEditorContext';
import { getHomeFaq, getProjects, getServices, getTestimonials } from '../lib/api';
import { useCmsValue } from '../lib/hooks';
import { defaultGlobalSettings } from '../lib/site-defaults';
import type { Project, Service, Testimonial } from '../types';

const TRUST_MARKERS = ['Фиксируем смету', 'Работаем по договору', 'Показываем процесс', 'Контролируем качество'];

const STEPS = [
  { title: 'Заявка', desc: 'Коротко обсуждаем задачу, объект и ваши ожидания.' },
  { title: 'Консультация', desc: 'Разбираем формат работы и ориентир по следующему шагу.' },
  { title: 'Замер', desc: 'Выезжаем на объект и уточняем исходные данные.' },
  { title: 'Смета', desc: 'Готовим понятный состав работ, сроки и бюджет.' },
];

const STEP_ICONS = [MessageSquareMore, FileText, Ruler, ClipboardList];
const DETAIL_GALLERY = [
  {
    title: 'Материалы и фактуры',
    description: 'Смотрим не только на общую картину, но и на то, как ведут себя поверхности, стыки, оттенки и свет вживую.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200',
  },
  {
    title: 'Узлы и примыкания',
    description: 'Аккуратность ремонта часто считывается именно в деталях: теневые профили, скрытые двери, встроенные решения, чистые линии.',
    image: 'https://images.unsplash.com/photo-1616594039964-3f2b2d4ad419?auto=format&fit=crop&q=80&w=1200',
  },
  {
    title: 'Свет и атмосфера',
    description: 'Подбираем решения так, чтобы интерьер выглядел собранно и днем, и вечером, а материалы не спорили между собой.',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200',
  },
] as const;

const renderHeroTitle = (title: string) => {
  const match = title.match(/^(.*?)(ИСКУССТВО\.?)(.*)$/u);

  if (!match) {
    return title;
  }

  const [, before, highlighted, after] = match;

  return (
    <>
      {before}
      <span className="italic text-brand-accent">{highlighted}</span>
      {after}
    </>
  );
};

export const Home = () => {
  const { openModal } = useModal();
  const { settings } = useSiteEditor();
  const projects = useCmsValue<Project[]>(getProjects, mockProjects);
  const services = useCmsValue<Service[]>(getServices, mockServices);
  const faq = useCmsValue(getHomeFaq, mockFaq);
  const testimonials = useCmsValue<Testimonial[]>(getTestimonials, mockTestimonials);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <Section className="relative flex min-h-screen items-center overflow-hidden bg-brand-warm pt-32 pb-20">
        <Container className="relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="space-y-12 lg:col-span-7">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="leading-[0.85] font-bold uppercase tracking-tighter"
                data-editor-size="display"
              >
                {renderHeroTitle(settings.heroTitle || defaultGlobalSettings.heroTitle)}
              </motion.h1>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="max-w-xl font-light leading-relaxed text-brand-muted"
                data-editor-size="lead"
              >
                {settings.heroSubtitle || defaultGlobalSettings.heroSubtitle}
              </motion.p>

              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex flex-col gap-6 sm:flex-row">
                <Button variant="accent" onClick={() => openModal('project')}>Обсудить проект</Button>
                <Button variant="secondary" href="/projects">Смотреть проекты</Button>
              </motion.div>

              <div className="grid grid-cols-2 gap-y-6 border-t border-brand-border pt-8">
                {TRUST_MARKERS.map((marker, index) => (
                  <motion.div
                    key={marker}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 + index * 0.08, duration: 0.45 }}
                    className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-widest text-brand-text"
                  >
                    <CheckCircle2 className="h-4 w-4 text-brand-accent" />
                    {marker}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="hidden h-[600px] lg:col-span-5 lg:block">
              <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200" alt="Premium Interior" className="h-full w-full object-cover grayscale-[0.3] transition-all duration-700 hover:grayscale-0" />
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-24 flex flex-col items-end justify-between gap-8 md:flex-row">
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Избранные проекты</span>
              <h2 className="font-bold uppercase tracking-tighter" data-editor-size="heading">Портфолио реализаций</h2>
            </div>
            <Link to="/projects" className="group flex items-center border-b border-brand-border pb-2 text-xs font-bold uppercase tracking-widest transition-colors hover:border-brand-accent">
              Смотреть все проекты <ArrowRight className="ml-4 h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
            {projects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-y border-brand-border bg-brand-primary">
        <Container>
          <div className="mb-20 max-w-3xl space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Материалы и детали</span>
            <h2 className="font-bold uppercase tracking-tighter" data-editor-size="heading">Из чего складывается ощущение премиального ремонта</h2>
            <p className="font-light leading-relaxed text-brand-muted" data-editor-size="lead">
              Качественный интерьер держится не только на планировке и мебели. Его создают пропорции, свет, фактуры и точность исполнения в каждом узле.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_0.85fr_0.85fr]">
            {DETAIL_GALLERY.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="group space-y-6"
              >
                <div className={`overflow-hidden bg-brand-warm ${index === 0 ? 'aspect-[4/5]' : 'aspect-[4/4.5]'}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-support">{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="text-2xl font-bold uppercase tracking-tight">{item.title}</h3>
                  <p className="text-sm font-light leading-relaxed text-brand-muted">{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-secondary">
        <Container>
          <div className="mb-24 max-w-3xl space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent">Сценарии работы</span>
            <h2 className="font-bold uppercase tracking-tighter" data-editor-size="heading">Услуги компании</h2>
            <p className="font-light leading-relaxed text-brand-muted" data-editor-size="lead">
              От комплексного ремонта под ключ до аккуратной реализации инженерных решений и авторских проектов.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-20 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Процесс</span>
            <h2 className="mt-4 font-bold uppercase tracking-tighter" data-editor-size="heading">Этапы реализации</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className="space-y-6 border border-brand-border bg-brand-primary p-8 transition-transform duration-500 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-border bg-brand-secondary text-brand-support">
                    {(() => {
                      const Icon = STEP_ICONS[index % STEP_ICONS.length];
                      return <Icon className="h-4 w-4" />;
                    })()}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-widest">{step.title}</h4>
                  <p className="text-xs font-light leading-relaxed text-brand-muted">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-secondary">
        <Container>
          <div className="mb-24 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Отзывы</span>
            <h2 className="mt-4 font-bold uppercase tracking-tighter" data-editor-size="heading">Что говорят клиенты</h2>
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {testimonials.slice(0, 2).map((item) => <TestimonialCard key={item.id} testimonial={item} />)}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="flex flex-col gap-20 lg:flex-row">
            <div className="space-y-8 lg:w-1/3">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">FAQ</span>
              <h2 className="font-bold uppercase tracking-tighter" data-editor-size="heading">Частые вопросы</h2>
              <p className="font-light leading-relaxed text-brand-muted" data-editor-size="body">
                Собрали короткие ответы о стоимости, процессе и работе с проектами.
              </p>
            </div>
            <div className="lg:w-2/3">
              <FAQAccordion items={faq} />
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-warm" id="contact-form">
        <Container>
          <div className="grid grid-cols-1 gap-20 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent">Контакты</span>
              <h2 className="font-bold uppercase tracking-tighter leading-none" data-editor-size="heading">
                {settings.contactCtaTitle || defaultGlobalSettings.contactCtaTitle}
              </h2>
              <p className="font-light leading-relaxed text-brand-muted" data-editor-size="body">
                {settings.contactCtaText || defaultGlobalSettings.contactCtaText}
              </p>
              <div className="space-y-6 pt-12">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-brand-muted">Офис</span>
                  <p className="text-sm font-medium">{settings.officeAddress}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-brand-muted">Телефон</span>
                  <p className="text-sm font-medium">{settings.phone}</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8">
              <LeadForm />
            </div>
          </div>
        </Container>
      </Section>
    </motion.div>
  );
};
