import { useParams, Navigate, Link } from 'react-router-dom';
import { Container, Section, Button } from '../components/Base';
import { Breadcrumbs, ProjectCard, FAQAccordion } from '../components/Content';
import { projects as mockProjects, services as mockServices } from '../data/mock';
import { motion } from 'motion/react';
import { CheckCircle2, Plus } from 'lucide-react';
import { LeadForm } from '../components/LeadForm';
import { useModal } from '../context/ModalContext';
import { getProjects, getServices } from '../lib/api';
import { useCmsValue } from '../lib/hooks';
import type { Project, Service } from '../types';

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
          <div className="space-y-12">
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none">{service.title}</h1>
            <p className="text-xl text-brand-muted font-light leading-relaxed">{service.description}</p>
            <div className="flex flex-wrap gap-6">
              <Button variant="accent" onClick={() => openModal('project')}>Обсудить проект</Button>
              <Link to="/projects"><Button variant="secondary">Смотреть проекты</Button></Link>
            </div>
          </div>
          <div className="aspect-video lg:aspect-square overflow-hidden">
            <img src={service.image || fallbackProjectImage} alt={service.title} className="w-full h-full object-cover" />
          </div>
        </div>

        <Section className="border-t border-brand-border pt-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              ['Есть готовый дизайн-проект', 'Изучим документацию, проверим состав работ и подготовим смету.'],
              ['Нужна понятная реализация', 'Соберем процесс в этапы и заранее обозначим контрольные точки.'],
              ['Важно не потерять детали', 'Контролируем узлы, материалы и соответствие проекту.'],
            ].map(([title, text]) => (
              <div key={title} className="p-10 border border-brand-border space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest">{title}</h3>
                <p className="text-xs text-brand-muted leading-relaxed font-light">{text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section className="bg-brand-warm -mx-6 md:-mx-12 px-6 md:px-12 py-32">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
              <div className="lg:col-span-4">
                <h2 className="text-4xl font-bold uppercase tracking-tighter sticky top-40">Что входит <br />в работу</h2>
              </div>
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12">
                {(service.includes || service.features).map((item, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <CheckCircle2 className="w-5 h-5 text-brand-accent flex-shrink-0" />
                    <span className="text-xs uppercase tracking-widest font-bold pt-1">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {service.steps && service.steps.length > 0 && (
          <Section className="py-40">
            <div className="max-w-4xl space-y-20">
              <h2 className="text-sm uppercase tracking-[0.3em] text-brand-muted font-bold">Как проходит работа</h2>
              <div className="space-y-12">
                {service.steps.map((step, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-brand-border pb-12">
                    <div className="md:col-span-1 text-xs font-bold text-brand-accent">{String(index + 1).padStart(2, '0')}</div>
                    <div className="md:col-span-4 text-xs font-bold uppercase tracking-widest">{step.title}</div>
                    <div className="md:col-span-7 text-xs text-brand-muted uppercase tracking-widest leading-relaxed">{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        <Section className="bg-brand-dark text-brand-primary p-12 md:p-24 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Мы не ломаем идею проекта на стройке</h2>
              <p className="text-lg text-brand-primary/60 font-light leading-relaxed">
                Если появляются технические вопросы, мы не принимаем решения в одиночку. Сначала согласуем, затем фиксируем и только потом реализуем.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                {['Соблюдаем чертежи', 'Согласуем замены', 'Фиксируем решения', 'Ведем коммуникацию', 'Показываем процесс'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-semibold text-brand-primary">
                    <Plus className="w-3 h-3 text-brand-accent" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block aspect-square opacity-20">
              <img src="https://images.unsplash.com/photo-1503387762-592dec5832f2?auto=format&fit=crop&q=80&w=1200" alt="Technical" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
        </Section>

        <Section className="py-40">
          <div className="flex justify-between items-end mb-20">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Примеры проектов</h2>
            <Link to="/projects" className="text-xs font-bold uppercase tracking-widest text-brand-muted hover:text-brand-text transition-colors">Все проекты</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {relatedProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        </Section>

        {service.priceFactors && service.priceFactors.length > 0 && (
          <Section className="bg-brand-secondary -mx-6 md:-mx-12 px-6 md:px-12 py-32">
            <Container>
              <div className="max-w-4xl space-y-12">
                <h2 className="text-4xl font-bold uppercase tracking-tighter">От чего зависит стоимость</h2>
                <div className="flex flex-wrap gap-3">
                  {service.priceFactors.map((factor, index) => (
                    <span key={index} className="px-6 py-2 border border-brand-border bg-brand-primary text-[10px] uppercase tracking-widest font-bold">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </Container>
          </Section>
        )}

        {service.faq && service.faq.length > 0 && (
          <Section className="py-40">
            <div className="max-w-4xl space-y-16">
              <h2 className="text-sm uppercase tracking-[0.3em] text-brand-muted font-bold">Вопросы и ответы</h2>
              <FAQAccordion items={service.faq} />
            </div>
          </Section>
        )}

        <Section className="pb-40" id="form">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none">Отправьте проект на оценку</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">
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
