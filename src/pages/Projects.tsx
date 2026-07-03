import { useState } from 'react';
import { Container, Section, Button } from '../components/Base';
import { ProjectCard, Breadcrumbs } from '../components/Content';
import { projects as mockProjects } from '../data/mock';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { getProjects } from '../lib/api';
import { useCmsValue } from '../lib/hooks';
import type { Project } from '../types';

const CATEGORIES = ['Все', 'Квартиры', 'Дома', 'По дизайн-проекту', 'До 100 м2', '100+ м2', 'С инженерией'];

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
    if (activeFilter === 'С инженерией') return project.format.toLowerCase().includes('инженер') || project.description.toLowerCase().includes('инженер');
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40">
      <Container>
        <Breadcrumbs items={[{ name: 'Проекты' }]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32 items-end">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.85]">Проекты</h1>
            <p className="text-xl text-brand-muted font-light leading-relaxed max-w-xl">
              Показываем не только финальные интерьеры, но и подход к реализации: черновые работы, инженерные решения и внимание к деталям.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-y-6 pb-2">
            {['Реальные объекты', 'Фото процесса', 'Понятные параметры', 'Ремонт по этапам'].map((marker) => (
              <div key={marker} className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-semibold text-brand-text">
                <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                {marker}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-24">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2.5 rounded-full border text-[10px] uppercase tracking-widest font-bold transition-all duration-300 ${
                activeFilter === category ? 'bg-brand-accent border-brand-accent text-brand-dark' : 'border-brand-border text-brand-muted hover:border-brand-accent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-24 mb-40">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Каждый проект - это не только фотографии</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">
                В ремонте важны геометрия, инженерия, подготовка оснований и качество примыканий. Поэтому мы показываем не только финал, но и сам процесс реализации.
              </p>
              <Button variant="secondary" href="/technologies">Подробнее о качестве</Button>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200" alt="Process" className="w-full h-full object-cover" />
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="bg-brand-dark text-brand-primary p-12 md:p-24 text-center space-y-12">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Хотите похожий ремонт?</h2>
              <p className="text-lg text-brand-primary/60 font-light leading-relaxed">
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
