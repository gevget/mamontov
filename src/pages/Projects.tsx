import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Building2, Camera, CheckCircle2, ClipboardList, SlidersHorizontal } from 'lucide-react';
import { Container, Section, Button } from '../components/Base';
import { Breadcrumbs, ProjectCard } from '../components/Content';
import { projects as mockProjects } from '../data/mock';
import { useModal } from '../context/ModalContext';
import { getProjects } from '../lib/api';
import { useCmsValue } from '../lib/hooks';
import type { Project } from '../types';

const CATEGORIES = ['Все', 'Квартиры', 'Дома', 'По дизайн-проекту', 'До 100 м2', '100+ м2', 'С инженерией'];
const projectHeroIcons = [Building2, Camera, SlidersHorizontal, ClipboardList];
const projectFilterIcons = [SlidersHorizontal, Building2, Building2, ClipboardList, Camera, Camera, CheckCircle2];

export const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('Все');
  const { openModal } = useModal();
  const projects = useCmsValue<Project[]>(getProjects, mockProjects);

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'Все') return true;
    if (activeFilter === 'Квартиры') return project.category === 'Квартира';
    if (activeFilter === 'Дома') return project.category === 'Дом';
    if (activeFilter === 'По дизайн-проекту') return project.format.toLowerCase().includes('дизайн');
    if (activeFilter === 'До 100 м2') return parseInt(project.area) < 100;
    if (activeFilter === '100+ м2') return parseInt(project.area) >= 100;
    if (activeFilter === 'С инженерией') {
      return project.format.toLowerCase().includes('инженер') || project.description.toLowerCase().includes('инженер');
    }
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40">
      <Container>
        <Breadcrumbs items={[{ name: 'Проекты' }]} />

        <div className="grid grid-cols-1 items-end gap-20 mb-32 lg:grid-cols-2">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold uppercase tracking-tighter leading-[0.85] md:text-8xl">Проекты</h1>
            <p className="max-w-xl text-xl font-light leading-relaxed text-brand-muted">
              Показываем не только финальные интерьеры, но и подход к реализации: черновые работы, инженерные решения и внимание к деталям.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-y-6 pb-2">
            {['Реальные объекты', 'Фото процесса', 'Понятные параметры', 'Ремонт по этапам'].map((marker, index) => {
              const Icon = projectHeroIcons[index % projectHeroIcons.length];

              return (
                <div key={marker} className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-widest text-brand-text">
                  <Icon className="h-4 w-4 text-brand-support" />
                  {marker}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-24 flex flex-wrap gap-3">
          {CATEGORIES.map((category, index) => {
            const Icon = projectFilterIcons[index % projectFilterIcons.length];

            return (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeFilter === category ? 'border-brand-accent bg-brand-accent text-brand-dark' : 'border-brand-border text-brand-muted hover:border-brand-accent'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {category}
              </button>
            );
          })}
        </div>

        <div className="mb-40 grid grid-cols-1 gap-x-12 gap-y-24 md:grid-cols-12">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const spans = ['md:col-span-8', 'md:col-span-4 md:mt-24', 'md:col-span-4', 'md:col-span-8', 'md:col-span-7', 'md:col-span-5 md:mt-32'];

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className={spans[index % spans.length]}
                >
                  <ProjectCard project={project} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </Container>

      <Section className="bg-brand-warm">
        <Container>
          <div className="grid grid-cols-1 items-center gap-24 lg:grid-cols-2">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold uppercase tracking-tighter md:text-5xl">Каждый проект это не только фотографии</h2>
              <p className="text-lg font-light leading-relaxed text-brand-muted">
                В ремонте важны геометрия, инженерия, подготовка оснований и качество примыканий. Поэтому мы показываем не только финал, но и сам процесс реализации.
              </p>
              <Button variant="secondary" href="/technologies">Подробнее о качестве</Button>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200" alt="Процесс ремонта" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="space-y-12 bg-brand-dark p-12 text-center text-brand-primary md:p-24">
            <div className="mx-auto max-w-2xl space-y-6">
              <h2 className="text-4xl font-bold uppercase tracking-tighter md:text-6xl">Хотите похожий ремонт?</h2>
              <p className="text-lg font-light leading-relaxed text-brand-primary/60">
                Расскажите о квартире, доме или готовом проекте. Мы оценим задачу и предложим понятный следующий шаг.
              </p>
            </div>
            <Button variant="accent" onClick={() => openModal('project')}>Обсудить проект</Button>
          </div>
        </Container>
      </Section>
    </motion.div>
  );
};
