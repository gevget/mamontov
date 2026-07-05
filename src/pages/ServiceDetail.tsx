import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  ClipboardList,
  Eye,
  FileText,
  MessageSquareMore,
  Ruler,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { Container, Section, Button } from '../components/Base';
import { Breadcrumbs, FAQAccordion, ProjectCard } from '../components/Content';
import { LeadForm } from '../components/LeadForm';
import { projects as mockProjects, services as mockServices } from '../data/mock';
import { useModal } from '../context/ModalContext';
import { getProjects, getServices } from '../lib/api';
import { useCmsValue } from '../lib/hooks';
import type { Project, Service } from '../types';

const detailCards = [FileText, ClipboardList, Eye];
const includedIcons = [CheckCircle2, ClipboardList, Ruler, Wrench, ShieldCheck, Sparkles];
const processIcons = [ClipboardList, FileText, Ruler, CheckCircle2, ShieldCheck, Wrench];
const darkSectionIcons = [FileText, MessageSquareMore, ClipboardList, Eye, ShieldCheck];
const factorIcons = [Ruler, FileText, ClipboardList, Wrench, Sparkles, ShieldCheck];
const includedChecklist = [
  'Разбор исходных данных и сценария реализации',
  'Понятная смета и этапность работ',
  'Согласование важных решений до монтажа',
  'Контроль качества по ключевым узлам',
] as const;
const excludedChecklist = [
  'Импровизация без проекта и обсуждения',
  'Скрытые допработы без фиксации',
  'Подмена материалов без предупреждения',
  'Сдача с нерешенными замечаниями',
] as const;

export const ServiceDetail = () => {
  const { id } = useParams();
  const { openModal } = useModal();
  const services = useCmsValue<Service[]>(getServices, mockServices);
  const projects = useCmsValue<Project[]>(getProjects, mockProjects);

  const service = services.find((item) => item.slug === id);

  if (!service) return <Navigate to="/services" replace />;

  const relatedProjects = projects.slice(0, 3);
  const fallbackProjectImage = projects[0]?.image || mockProjects[0]?.image || '';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40">
      <Container>
        <Breadcrumbs items={[{ name: 'Услуги', href: '/services' }, { name: service.title }]} />

        <div className="mb-32 grid grid-cols-1 gap-20 lg:grid-cols-2">
          <div className="space-y-12">
            <h1 className="page-hero-title max-w-[12ch] font-bold uppercase tracking-tighter">{service.title}</h1>
            <p className="text-xl font-light leading-relaxed text-brand-muted">{service.description}</p>
            <div className="flex flex-wrap gap-6">
              <Button variant="accent" onClick={() => openModal('project')}>Обсудить проект</Button>
              <Link to="/projects"><Button variant="secondary">Смотреть проекты</Button></Link>
            </div>
          </div>
          <div className="aspect-video overflow-hidden lg:aspect-square">
            <img src={service.image || fallbackProjectImage} alt={service.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>

        <Section className="border-t border-brand-border pt-32">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              ['Есть готовый дизайн-проект', 'Изучим документацию, проверим состав работ и подготовим смету.'],
              ['Нужна понятная реализация', 'Соберем процесс в этапы и заранее обозначим контрольные точки.'],
              ['Важно не потерять детали', 'Контролируем узлы, материалы и соответствие проекту.'],
            ].map(([title, text], index) => {
              const Icon = detailCards[index % detailCards.length];

              return (
                <div key={title} className="space-y-6 border border-brand-border p-10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-brand-secondary text-brand-support">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest">{title}</h3>
                  <p className="text-xs font-light leading-relaxed text-brand-muted">{text}</p>
                </div>
              );
            })}
          </div>
        </Section>

        <Section className="bg-brand-warm -mx-6 px-6 py-32 md:-mx-12 md:px-12">
          <Container>
            <div className="grid grid-cols-1 gap-20 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h2 className="sticky top-40 text-4xl font-bold uppercase tracking-tighter">Что входит в работу</h2>
              </div>
              <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2 lg:col-span-8">
                {(service.includes || service.features).map((item, index) => {
                  const Icon = includedIcons[index % includedIcons.length];

                  return (
                    <div key={index} className="flex items-start gap-4">
                      <Icon className="h-5 w-5 flex-shrink-0 text-brand-support" />
                      <span className="pt-1 text-xs font-bold uppercase tracking-widest">{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Container>
        </Section>

        <Section className="border-t border-brand-border pt-32">
          <div className="grid grid-cols-1 gap-20 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Что входит / что не входит</span>
              <h2 className="text-4xl font-bold uppercase tracking-tighter">Прозрачный формат работы</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">
                Мы заранее обозначаем, за что отвечаем в рамках услуги, а где нужны отдельные решения, согласования или дополнительные сценарии.
              </p>
              <p className="text-sm italic text-brand-support">Редакционный акцент: хороший сервис снимает неопределенность до старта.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:col-span-8">
              <div className="space-y-8 border border-brand-border bg-brand-primary p-10">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-support">Входит в услугу</h3>
                <div className="space-y-4">
                  {[...(service.includes || []), ...includedChecklist].slice(0, 6).map((item) => (
                    <div key={item} className="flex items-start gap-3 text-[10px] uppercase tracking-widest">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-accent" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-8 border border-brand-border bg-brand-warm p-10">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-support">Отдельно обсуждается</h3>
                <div className="space-y-4">
                  {excludedChecklist.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-[10px] uppercase tracking-widest text-brand-muted">
                      <span className="mt-[5px] h-2 w-2 rounded-full bg-brand-support flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {service.steps && service.steps.length > 0 && (
          <Section className="py-40">
            <div className="max-w-4xl space-y-20">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-muted">Как проходит работа</h2>
              <div className="space-y-12">
                {service.steps.map((step, index) => {
                  const Icon = processIcons[index % processIcons.length];

                  return (
                    <div key={index} className="grid grid-cols-1 items-start gap-8 border-b border-brand-border pb-12 md:grid-cols-12">
                      <div className="flex items-center gap-4 md:col-span-2">
                        <div className="text-xs font-bold text-brand-support">{String(index + 1).padStart(2, '0')}</div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-brand-secondary text-brand-support">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="text-xs font-bold uppercase tracking-widest md:col-span-3">{step.title}</div>
                      <div className="text-xs uppercase tracking-widest leading-relaxed text-brand-muted md:col-span-7">{step.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>
        )}

        <Section className="relative overflow-hidden bg-brand-dark p-12 text-brand-primary md:p-24">
          <div className="relative z-10 grid grid-cols-1 items-center gap-24 lg:grid-cols-2">
            <div className="space-y-8">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-support font-bold">Редакционный акцент</span>
              <h2 className="text-4xl font-bold uppercase tracking-tighter md:text-5xl">Мы не ломаем идею проекта на стройке</h2>
              <p className="text-lg font-light leading-relaxed text-brand-primary/60">
                Если появляются технические вопросы, мы не принимаем решения в одиночку. Сначала согласуем, затем фиксируем и только потом реализуем.
              </p>
              <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2">
                {['Соблюдаем чертежи', 'Согласуем замены', 'Фиксируем решения', 'Ведем коммуникацию', 'Показываем процесс'].map((item, index) => {
                  const Icon = darkSectionIcons[index % darkSectionIcons.length];

                  return (
                    <div key={item} className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-widest text-brand-primary">
                      <Icon className="h-3.5 w-3.5 text-brand-support" />
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="hidden aspect-square opacity-20 lg:block">
              <img src="https://images.unsplash.com/photo-1503387762-592dec5832f2?auto=format&fit=crop&q=80&w=1200" alt="Техническая часть проекта" className="h-full w-full rounded-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </Section>

        <Section className="py-40">
          <div className="mb-20 flex items-end justify-between">
            <h2 className="text-4xl font-bold uppercase tracking-tighter md:text-5xl">Примеры проектов</h2>
            <Link to="/projects" className="text-xs font-bold uppercase tracking-widest text-brand-muted transition-colors hover:text-brand-text">Все проекты</Link>
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {relatedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </Section>

        {service.priceFactors && service.priceFactors.length > 0 && (
          <Section className="bg-brand-secondary -mx-6 px-6 py-32 md:-mx-12 md:px-12">
            <Container>
              <div className="max-w-4xl space-y-12">
                <h2 className="text-4xl font-bold uppercase tracking-tighter">От чего зависит стоимость</h2>
                <div className="flex flex-wrap gap-3">
                  {service.priceFactors.map((factor, index) => {
                    const Icon = factorIcons[index % factorIcons.length];

                    return (
                      <span key={index} className="inline-flex items-center gap-2 border border-brand-border bg-brand-primary px-6 py-2 text-[10px] font-bold uppercase tracking-widest">
                        <Icon className="h-3.5 w-3.5 text-brand-support" />
                        {factor}
                      </span>
                    );
                  })}
                </div>
              </div>
            </Container>
          </Section>
        )}

        {service.faq && service.faq.length > 0 && (
          <Section className="py-40">
            <div className="max-w-4xl space-y-16">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-muted">Вопросы и ответы</h2>
              <FAQAccordion items={service.faq} />
            </div>
          </Section>
        )}

        <Section className="pb-40" id="form">
          <div className="grid grid-cols-1 gap-20 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-5">
              <h2 className="text-4xl font-bold uppercase tracking-tighter leading-none md:text-6xl">Отправьте проект на оценку</h2>
              <p className="text-lg font-light leading-relaxed text-brand-muted">
                Мы изучим вводные, уточним детали и подготовим ориентир по составу работ.
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
