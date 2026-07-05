import { useParams, Link, Navigate } from 'react-router-dom';
import { Container, Section } from '../components/Base';
import { Breadcrumbs, ProjectCard } from '../components/Content';
import { ProjectMeta, ProjectGallery } from '../components/ProjectComponents';
import { projects as mockProjects } from '../data/mock';
import { motion } from 'motion/react';
import { ArrowLeft, Quote, CheckCircle2, ShieldCheck, Wrench, Sparkles } from 'lucide-react';
import { LeadForm } from '../components/LeadForm';
import { getProjects } from '../lib/api';
import { useCmsValue } from '../lib/hooks';
import { FALLBACK_PROJECT_IMAGE } from '../lib/media';
import type { Project } from '../types';

const PROJECT_INCLUDED = [
  'Изучение исходных данных и логики объекта',
  'Согласование узлов и решений до выполнения',
  'Контроль скрытых работ и ключевых этапов',
  'Фотофиксация и проверка качества перед сдачей',
] as const;

const PROJECT_EXCLUDED = [
  'Случайные замены без согласования',
  'Упрощение важных деталей на площадке',
  'Неясные бюджеты и размытые этапы',
  'Сдача без финальной проверки результата',
] as const;

const QUALITY_CONTROL_STEPS = [
  ['Чек-листы этапов', 'Фиксируем контрольные точки до старта и сверяемся по ним в процессе.', ShieldCheck],
  ['Скрытые работы', 'Проверяем инженерные и подготовительные узлы до того, как они будут закрыты отделкой.', Wrench],
  ['Фотофиксация', 'Собираем визуальную историю этапов, чтобы качество было видно не только на финальных фото.', Sparkles],
] as const;

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
          <img src={project.image || FALLBACK_PROJECT_IMAGE} alt={project.title} className="w-full h-full object-cover" />
        </div>

        <ProjectMeta project={project} />

        <Section className="border-t border-brand-border pt-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Паспорт проекта</span>
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Коротко о масштабе и формате</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">
                Каждому проекту важна не только красивая финальная картинка, но и понятная структура: площадь, сроки, состав команды и логика реализации.
              </p>
              <p className="text-sm italic text-brand-support">Редакционный акцент: хорошие проекты читаются в деталях еще до галереи.</p>
            </div>
            <div className="grid grid-cols-1 gap-px border border-brand-border bg-brand-border md:grid-cols-2 lg:col-span-8">
              {[
                ['Тип объекта', project.category],
                ['Площадь', project.area],
                ['Локация', project.location],
                ['Срок', project.duration],
                ['Формат', project.format],
                ['Статус', project.status],
                ['Год', project.year],
                ['Фокус', project.complexities?.[0]?.title || 'Точная реализация'],
              ].map(([label, value], index) => (
                <motion.div
                  key={`${label}-${index}`}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="space-y-3 bg-brand-primary p-8"
                >
                  <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">{label}</span>
                  <p className="text-lg font-bold uppercase tracking-tight">{value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

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
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-border bg-brand-secondary text-brand-support">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </span>
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

        <Section className="border-t border-brand-border pt-32">
          <div className="grid grid-cols-1 gap-20 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Прозрачность проекта</span>
              <h2 className="text-4xl font-bold uppercase tracking-tighter">Что мы держим внутри процесса</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:col-span-8">
              <div className="space-y-8 border border-brand-border bg-brand-primary p-10">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-support">Что входит</h3>
                <div className="space-y-4">
                  {PROJECT_INCLUDED.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="flex items-start gap-3 text-[10px] uppercase tracking-widest"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-accent" />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="space-y-8 border border-brand-border bg-brand-warm p-10">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-support">Что не допускаем</h3>
                <div className="space-y-4">
                  {PROJECT_EXCLUDED.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: 14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="flex items-start gap-3 text-[10px] uppercase tracking-widest text-brand-muted"
                    >
                      <span className="mt-[5px] h-2 w-2 rounded-full bg-brand-support flex-shrink-0" />
                      {item}
                    </motion.div>
                  ))}
                </div>
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
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-border bg-brand-secondary text-brand-support">
                      {index % 3 === 0 ? <ShieldCheck className="h-4 w-4" /> : index % 3 === 1 ? <Wrench className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-brand-text">{item.title}</h4>
                    <p className="text-xs text-brand-muted leading-relaxed font-light">{item.description}</p>
                    <p className="text-[10px] uppercase tracking-widest text-brand-accent font-bold pt-4">Важный элемент качества</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        <Section className="border-t border-brand-border pt-32">
          <div className="space-y-16">
            <div className="max-w-3xl space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Контроль качества</span>
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Как мы страхуем качество на объекте</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">
                Кейс продает сильнее, когда видно не только результат, но и то, как именно он был собран. Поэтому мы показываем логику контроля внутри проекта.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {QUALITY_CONTROL_STEPS.map(([title, description, Icon], index) => (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.07 }}
                  className="space-y-6 border border-brand-border bg-brand-primary p-10 transition-transform duration-500 hover:-translate-y-1"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-border bg-brand-secondary text-brand-support">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest">{title}</h3>
                  <p className="text-sm font-light leading-relaxed text-brand-muted">{description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </Section>

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
            {similarProjects.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
              >
                <ProjectCard project={item} />
              </motion.div>
            ))}
          </div>
        </Section>
      </Container>
    </motion.div>
  );
};
