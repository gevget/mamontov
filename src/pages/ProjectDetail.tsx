import { useParams, Link, Navigate } from 'react-router-dom';
import { Container, Section } from '../components/Base';
import { Breadcrumbs, ProjectCard } from '../components/Content';
import { ProjectMeta, ProjectGallery } from '../components/ProjectComponents';
import { projects as mockProjects } from '../data/mock';
import { motion } from 'motion/react';
import { ArrowLeft, Quote, Plus } from 'lucide-react';
import { LeadForm } from '../components/LeadForm';
import { getProjects } from '../lib/api';
import { useCmsValue } from '../lib/hooks';
import type { Project } from '../types';

export const ProjectDetail = () => {
  const { id } = useParams();
  const projects = useCmsValue<Project[]>(getProjects, mockProjects);
  const project = projects.find((item) => item.id === id);

  if (!project) return <Navigate to="/projects" replace />;

  const similarProjects = projects.filter((item) => item.id !== id).slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40">
      <Container>
        <Breadcrumbs items={[{ name: 'Проекты', href: '/projects' }, { name: project.title }]} />

        <div className="max-w-4xl mb-16 space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none">{project.title}</h1>
          <p className="text-xl text-brand-muted font-light leading-relaxed">{project.description}</p>
        </div>

        <div className="aspect-video overflow-hidden mb-24">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        </div>

        <ProjectMeta project={project} />

        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-brand-accent font-bold">Задача клиента</span>
                <p className="text-xl font-display italic leading-relaxed text-brand-text">"{project.clientTask || project.description}"</p>
              </div>

              {project.stepsDone && (
                <div className="space-y-8">
                  <h3 className="text-sm uppercase tracking-widest font-bold">Что было сделано:</h3>
                  <ul className="space-y-4">
                    {project.stepsDone.map((step, index) => (
                      <li key={index} className="flex items-center gap-4 text-xs uppercase tracking-widest text-brand-muted font-medium">
                        <Plus className="w-3 h-3 text-brand-accent" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-12">
                {project.process && project.process.length > 0 && (
                  <div className="space-y-8">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Процесс</span>
                    <div className="grid grid-cols-2 gap-4">
                      {project.process.map((step, index) => (
                        <div key={index} className="space-y-4">
                          <div className="aspect-[4/3] overflow-hidden">
                            <img src={step.image} alt={step.label} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest">{step.label}</h4>
                            <p className="text-[10px] text-brand-muted uppercase tracking-widest mt-1">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Section>

        {project.complexities && (
          <Section className="bg-brand-warm -mx-6 md:-mx-12 px-6 md:px-12 py-24">
            <div className="max-w-7xl mx-auto space-y-16">
              <h2 className="text-4xl font-bold uppercase tracking-tighter">Сложные решения</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {project.complexities.map((item, index) => (
                  <div key={index} className="space-y-4 p-8 border border-brand-border bg-brand-primary">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-brand-text">{item.title}</h4>
                    <p className="text-xs text-brand-muted leading-relaxed font-light">{item.description}</p>
                    <p className="text-[10px] uppercase tracking-widest text-brand-accent font-bold pt-4">Важный элемент качества</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        {project.gallery && project.gallery.length > 0 && (
          <Section className="py-40">
            <div className="space-y-12 mb-24">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Финальный результат</span>
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Галерея проекта</h2>
            </div>
            <ProjectGallery images={project.gallery} />
          </Section>
        )}

        {project.testimonial && (
          <Section className="bg-brand-secondary -mx-6 md:-mx-12 px-6 md:px-12 py-24 mb-32">
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <Quote className="w-12 h-12 text-brand-accent mx-auto opacity-40" />
              <p className="text-2xl md:text-3xl font-display italic leading-relaxed text-brand-text">"{project.testimonial.content}"</p>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest">{project.testimonial.author}</h4>
                <p className="text-[10px] text-brand-muted uppercase tracking-widest mt-2">{project.testimonial.role}</p>
              </div>
            </div>
          </Section>
        )}

        <Section className="mb-40" id="contact">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none">Хотите <br />похожий результат?</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">
                Отправьте планировку или расскажите о задаче. Мы изучим объект и подготовим предварительный ориентир.
              </p>
              <div className="pt-12">
                <Link to="/contacts" className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest group">
                  <div className="w-10 h-10 border border-brand-border rounded-full flex items-center justify-center transition-all group-hover:bg-brand-dark group-hover:text-brand-primary">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  Перейти к контактам
                </Link>
              </div>
            </div>
            <div className="lg:col-span-7">
              <LeadForm />
            </div>
          </div>
        </Section>

        <Section className="border-t border-brand-border pt-32 mb-20">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-3xl font-bold uppercase tracking-tighter">Похожие проекты</h2>
            <Link to="/projects" className="text-xs font-bold uppercase tracking-widest text-brand-muted hover:text-brand-text transition-colors">
              Смотреть все
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {similarProjects.map((item) => <ProjectCard key={item.id} project={item} />)}
          </div>
        </Section>
      </Container>
    </motion.div>
  );
};
