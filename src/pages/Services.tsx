import { Container, Section, Button } from '../components/Base';
import { Breadcrumbs, ServiceCard, ProjectCard } from '../components/Content';
import { projects, services as mockServices } from '../data/mock';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { useEffect, useState } from 'react';
import { getServices } from '../lib/api';
import type { Service } from '../types';

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
          </div>
          <div className="grid grid-cols-2 gap-y-6 pb-2">
            {['Ремонт по договору', 'Прозрачная смета', 'Контроль этапов', 'Работа с проектами'].map((marker) => (
              <div key={marker} className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-semibold text-brand-text">
                <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                {marker}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-12 mb-20">
          <h2 className="text-sm uppercase tracking-[0.3em] text-brand-muted font-bold">Выберите сценарий</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {services.map((service) => <ServiceCard key={service.id} service={service} />)}
          </div>
        </div>
      </Container>

      <Section className="bg-brand-warm border-y border-brand-border">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-tight">Не обязательно знать точный состав работ заранее</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">
                На первом этапе достаточно рассказать об объекте, площади и желаемом результате. Мы подскажем, какой формат работы подойдёт лучше всего.
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                ['Есть готовый проект', 'Изучим документацию и подготовим смету.'],
                ['Нужно понять бюджет', 'Сделаем ориентир по планировке и вводным данным.'],
                ['Нужен замер', 'Выедем на объект и оценим текущий статус.'],
              ].map(([title, desc]) => (
                <div key={title} className="p-8 border border-brand-border bg-brand-primary space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest">{title}</h4>
                  <p className="text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12 border-t border-brand-border pt-20">
            {['Смета до старта', 'Договор и сроки', 'Отчёты по этапам', 'Контроль скрытых работ', 'Аккуратная сдача объекта', 'Гарантия'].map((principle) => (
              <div key={principle} className="space-y-4">
                <div className="w-12 h-[1px] bg-brand-accent" />
                <h4 className="text-xs uppercase tracking-widest font-bold">{principle}</h4>
                <p className="text-[10px] text-brand-muted uppercase tracking-widest">Стандарт работы ArchiBuild</p>
              </div>
            ))}
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
