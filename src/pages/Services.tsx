import { Container, Section, Button } from '../components/Base';
import { Breadcrumbs, ServiceCard, ProjectCard } from '../components/Content';
import { projects, services as mockServices } from '../data/mock';
import { motion } from 'motion/react';
import { ClipboardList, FileText, HardHat, Receipt, Ruler, ShieldCheck, Sparkles } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { useEffect, useState } from 'react';
import { getServices } from '../lib/api';
import type { Service } from '../types';

const serviceScenarioIcons = [FileText, ClipboardList, Ruler];
const servicePrincipleIcons = [FileText, ClipboardList, Sparkles, HardHat, ShieldCheck, ShieldCheck];
const serviceHeroIcons = [Receipt, ClipboardList, ShieldCheck, FileText];
const SERVICE_FORMATS = [
  ['Только реализация', 'Для проектов, где уже есть документация и нужен сильный исполнитель.', FileText],
  ['Реализация по дизайн-проекту', 'Когда важно сохранить авторскую идею, узлы и материалы без упрощений.', ClipboardList],
  ['Дом под ключ', 'Для объектов с большим количеством инженерии, логистики и смежных подрядчиков.', HardHat],
] as const;

export const Services = () => {
  const { openModal } = useModal();
  const [services, setServices] = useState<Service[]>(mockServices);

  useEffect(() => {
    let isActive = true;

    getServices().then((data) => {
      if (isActive) {
        setServices(data);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40">
      <Container>
        <Breadcrumbs items={[{ name: 'Услуги' }]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32 items-end">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.85]">Услуги</h1>
            <p className="text-xl text-brand-muted font-light leading-relaxed max-w-xl">
              Работаем с квартирами, частными домами и готовыми дизайн-проектами: считаем смету, ведём процесс по этапам и контролируем качество.
            </p>
            <div className="aspect-[4/3] max-w-xl overflow-hidden bg-brand-warm">
              <img src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&q=80&w=1200" alt="Ремонт интерьера" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-6 pb-2">
            {['Ремонт по договору', 'Прозрачная смета', 'Контроль этапов', 'Работа с проектами'].map((marker, index) => {
              const Icon = serviceHeroIcons[index % serviceHeroIcons.length];

              return (
              <div key={marker} className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-semibold text-brand-text">
                <Icon className="w-4 h-4 text-brand-support" />
                {marker}
              </div>
            )})}
          </div>
        </div>

        <div className="space-y-12 mb-20">
          <h2 className="text-sm uppercase tracking-[0.3em] text-brand-muted font-bold">Выберите сценарий</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>
        </div>
      </Container>

      <Section className="border-t border-brand-border">
        <Container>
          <div className="space-y-16">
            <div className="max-w-3xl space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Форматы работы</span>
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Как можно зайти в проект</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">
                Не всегда нужно сразу знать точный список услуг. Чаще важнее понять формат взаимодействия и глубину нашей вовлеченности.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {SERVICE_FORMATS.map(([title, desc, Icon], index) => (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="space-y-6 border border-brand-border bg-brand-primary p-10 transition-transform duration-500 hover:-translate-y-1"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-brand-secondary text-brand-support">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest">{title}</h3>
                  <p className="text-sm font-light leading-relaxed text-brand-muted">{desc}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-warm border-y border-brand-border">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-tight">Не обязательно знать точный состав работ заранее</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">
                На первом этапе достаточно рассказать об объекте, площади и желаемом результате. Мы подскажем, какой формат работы подойдёт лучше всего.
              </p>
              <div className="aspect-[4/3] overflow-hidden bg-brand-primary">
                <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200" alt="Работа над проектом" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                ['Есть готовый проект', 'Изучим документацию и подготовим смету.'],
                ['Нужно понять бюджет', 'Сделаем ориентир по планировке и вводным данным.'],
                ['Нужен замер', 'Выедем на объект и оценим текущий статус.'],
              ].map(([title, desc], index) => {
                const Icon = serviceScenarioIcons[index];

                return (
                  <div key={title} className="p-8 border border-brand-border bg-brand-primary space-y-4">
                    <div className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-brand-support">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-widest">{title}</h4>
                    <p className="text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed">{desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12 border-t border-brand-border pt-20">
            {['Смета до старта', 'Договор и сроки', 'Отчёты по этапам', 'Контроль скрытых работ', 'Аккуратная сдача объекта', 'Гарантия'].map((principle, index) => {
              const Icon = servicePrincipleIcons[index % servicePrincipleIcons.length];

              return (
              <div key={principle} className="space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-brand-secondary text-brand-support">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="w-12 h-[1px] bg-brand-support" />
                <h4 className="text-xs uppercase tracking-widest font-bold">{principle}</h4>
                <p className="text-[10px] text-brand-muted uppercase tracking-widest">Стандарт работы ArchiBuild</p>
              </div>
            )})}
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-secondary py-32">
        <Container>
          <div className="flex justify-between items-end mb-20">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Посмотрите, как это <br />выглядит в проектах</h2>
            <Button variant="secondary" className="hidden md:flex" href="/projects">Все проекты</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {projects.slice(0, 3).map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="bg-brand-dark text-brand-primary p-12 md:p-24 text-center space-y-12">
            <div className="mx-auto aspect-[21/9] max-w-4xl overflow-hidden opacity-80">
              <img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1400" alt="Готовый интерьер" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Подберём формат ремонта под ваш объект</h2>
              <p className="text-lg text-brand-primary/60 font-light leading-relaxed">
                Опишите квартиру, дом или готовый проект. Подскажем, с чего начать и какой сценарий работы будет самым рациональным.
              </p>
            </div>
            <Button variant="accent" onClick={() => openModal('project')}>Обсудить проект</Button>
          </div>
        </Container>
      </Section>
    </motion.div>
  );
};
