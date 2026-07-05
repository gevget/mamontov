import { Container, Section } from '../components/Base';
import { Breadcrumbs, FAQAccordion, ProjectCard, TeamRoleCard, TestimonialCard } from '../components/Content';
import { aboutFAQ, projects as mockProjects, teamMembers, testimonials as mockTestimonials } from '../data/mock';
import { motion } from 'motion/react';
import { Building2, CheckCircle2, ClipboardList, HardHat, ShieldCheck, Users2 } from 'lucide-react';
import { LeadForm } from '../components/LeadForm';
import { getAboutFaq, getProjects, getTestimonials } from '../lib/api';
import { useCmsValue } from '../lib/hooks';
import type { Project, Testimonial } from '../types';

const ABOUT_MARKERS = [
  ['Команда под объект', Users2],
  ['Понятная ответственность', ShieldCheck],
  ['Контроль этапов', ClipboardList],
  ['Реальные проекты', Building2],
] as const;

const ABOUT_METRICS = [
  ['10+', 'лет в ремонте и координации объектов'],
  ['120+', 'решений по квартирам, домам и дизайнерским проектам'],
  ['4 этапа', 'понятная структура от замера до сдачи'],
  ['1 команда', 'единая ответственность за процесс и качество'],
] as const;

const ABOUT_PRINCIPLES = [
  ['Сначала разбираемся в задаче', 'Изучаем объект, проект, площадь и исходные ограничения.', Building2],
  ['Считаем до старта', 'Готовим понятную смету и делим процесс на этапы.', ClipboardList],
  ['Контролируем реализацию', 'Следим за инженерией, черновыми и чистовыми работами.', HardHat],
  ['Сдаем результат', 'Проверяем объект, закрываем замечания и передаем итог.', CheckCircle2],
] as const;

export const About = () => {
  const projects = useCmsValue<Project[]>(getProjects, mockProjects);
  const testimonials = useCmsValue<Testimonial[]>(getTestimonials, mockTestimonials);
  const faqItems = useCmsValue(getAboutFaq, aboutFAQ);
  const approachProjects = projects.slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40">
      <Container>
        <Breadcrumbs items={[{ name: 'О компании' }]} />

        <div className="page-hero-grid">
          <div className="space-y-8">
            <h1 className="page-hero-title font-bold uppercase tracking-tighter">О компании</h1>
            <p className="text-xl text-brand-muted font-light leading-relaxed max-w-xl">
              Мы ведем ремонт как управляемый процесс: от изучения объекта и сметы до контроля скрытых работ, чистовой отделки и сдачи.
            </p>
          </div>
          <div className="page-hero-aside grid grid-cols-2 gap-y-6 border-b border-brand-border pb-2 lg:border-none">
            {ABOUT_MARKERS.map(([marker, Icon]) => (
              <div key={marker} className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-semibold text-brand-text">
                <Icon className="w-4 h-4 text-brand-support" />
                {marker}
              </div>
            ))}
          </div>
        </div>

        <Section className="py-40 border-t border-brand-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-7 space-y-12">
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-tight">За результат отвечает система, а не случай</h2>
              <div className="w-20 h-[1px] bg-brand-support" />
              <p className="text-xl text-brand-muted font-light leading-relaxed max-w-2xl">
                Качественный ремонт складывается из проектной документации, сметы, инженерии, дисциплины на площадке и спокойной коммуникации. Поэтому для нас важны не только мастера, но и структура управления проектом.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] bg-brand-warm overflow-hidden">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" alt="Office and team process" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </Section>

        <Section className="py-40 border-t border-brand-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4 space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Доверие и факты</span>
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Показываем не обещания, а структуру работы</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">
                Для нас важны прогнозируемость, аккуратная коммуникация и понятная зона ответственности. Поэтому на сайте и в работе мы всегда показываем логику процесса.
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-border border border-brand-border">
              {ABOUT_METRICS.map(([value, description]) => (
                <div key={value} className="bg-brand-primary p-10 md:p-12 space-y-4">
                  <p className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-brand-support">{value}</p>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-brand-muted leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section className="py-40 border-t border-brand-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-border border border-brand-border">
            {ABOUT_PRINCIPLES.map(([title, desc, Icon], index) => (
              <div key={title} className="p-12 bg-brand-primary space-y-8 group hover:bg-brand-warm transition-colors duration-500">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-4xl font-bold text-brand-border group-hover:text-brand-accent transition-colors">{String(index + 1).padStart(2, '0')}</div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-brand-secondary text-brand-support">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest leading-tight">{title}</h4>
                  <p className="text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section className="py-40 border-t border-brand-border">
          <div className="space-y-20">
            <div className="max-w-3xl space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Команда и роли</span>
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Те, кто <br />управляет вашим <br />объектом</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {teamMembers.map((member) => <TeamRoleCard key={member.id} member={member} />)}
            </div>
          </div>
        </Section>

        <Section className="py-40 border-t border-brand-border">
          <div className="space-y-20">
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Отзывы</span>
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Что говорят <br />клиенты</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => <TestimonialCard key={testimonial.id} testimonial={testimonial} />)}
            </div>
          </div>
        </Section>

        <Section className="py-40 border-t border-brand-border">
          <div className="space-y-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-tight">Лучше всего подход <br />виден в проектах</h2>
                <p className="text-lg text-brand-muted font-light leading-relaxed max-w-xl">
                  В кейсах можно увидеть не только финальный интерьер, но и логику процесса, инженерные решения и работу с деталями.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {approachProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          </div>
        </Section>

        <Section className="py-40">
          <div className="max-w-4xl space-y-20">
            <h2 className="text-4xl font-bold uppercase tracking-tighter">Частые вопросы</h2>
            <FAQAccordion items={faqItems} />
          </div>
        </Section>

        <Section className="pb-40" id="contact">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none">Обсудим <br />ваш объект</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">
                Расскажите о квартире, доме или готовом проекте. Мы уточним детали, оценим задачу и предложим понятный следующий шаг.
              </p>
            </div>
            <div className="lg:col-span-7">
              <LeadForm />
            </div>
          </div>
        </Section>
      </Container>
    </motion.div>
  );
};
