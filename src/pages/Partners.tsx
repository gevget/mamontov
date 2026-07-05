import { Container, Section, Button } from '../components/Base';
import { Breadcrumbs, FAQAccordion, PartnerCard, ProjectCard } from '../components/Content';
import { partnerFAQ, partners as mockPartners, projects as mockProjects } from '../data/mock';
import { motion } from 'motion/react';
import { ArrowRight, ClipboardList, Eye, FileText, MessagesSquare, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { PartnerLeadForm } from '../components/LeadForm';
import { Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { getPartnerFaq, getPartners, getProjects } from '../lib/api';
import { useCmsValue } from '../lib/hooks';
import type { Partner, Project } from '../types';

const PARTNER_MARKERS = [
  ['Работаем по чертежам', FileText],
  ['Фиксируем изменения', ClipboardList],
  ['Ведем коммуникацию', MessagesSquare],
  ['Контролируем качество', ShieldCheck],
] as const;

const PARTNER_STAGES = [
  ['Концепция и проект', 'Подключаем дизайнеров, архитекторов и поставщиков, когда важны точные решения на бумаге.', FileText],
  ['Черновые и инженерные работы', 'Координируем смежников и инженерные узлы, чтобы не терялась логика проекта.', Wrench],
  ['Чистовая реализация', 'Сверяем фактуры, размеры, примыкания и декоративные решения по месту.', Sparkles],
  ['Комплектация и финальные детали', 'Помогаем синхронизировать мебель, свет, камень, текстиль и встроенные изделия.', Eye],
] as const;

export const Partners = () => {
  const { openModal } = useModal();
  const partners = useCmsValue<Partner[]>(getPartners, mockPartners);
  const projects = useCmsValue<Project[]>(getProjects, mockProjects);
  const faqItems = useCmsValue(getPartnerFaq, partnerFAQ);
  const jointProjects = projects.slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40">
      <Container>
        <Breadcrumbs items={[{ name: 'Партнеры' }]} />

        <div className="page-hero-grid partners-hero-grid">
          <div className="space-y-8">
            <h1 className="page-hero-title partners-hero-title font-bold uppercase tracking-tighter">
              <span className="block">Для дизайнеров</span>
              <span className="block whitespace-nowrap">и архитекторов</span>
            </h1>
            <p className="text-xl text-brand-muted font-light leading-relaxed max-w-xl">
              Аккуратно реализуем дизайн-проекты, соблюдаем чертежи, согласуем изменения и сохраняем авторскую идею на объекте.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button onClick={() => openModal('partner')}>Обсудить сотрудничество</Button>
              <Button variant="outline" href="/projects">Смотреть проекты</Button>
            </div>
          </div>
          <div className="page-hero-aside grid grid-cols-2 gap-y-6 pb-2">
            {PARTNER_MARKERS.map(([marker, Icon]) => (
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
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-tight">Реализация проекта - это продолжение работы дизайнера</h2>
              <div className="w-20 h-[1px] bg-brand-support" />
              <p className="text-xl text-brand-muted font-light leading-relaxed max-w-2xl">
                Даже сильный проект можно испортить на стройке. Мы выстраиваем процесс так, чтобы строительная реализация не разрушала авторскую идею.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-[3/4] bg-brand-warm overflow-hidden">
                <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200" alt="Interior realization" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </Section>

        <Section className="py-40 border-t border-brand-border">
          <div className="space-y-16">
            <div className="max-w-3xl space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Кого и когда подключаем</span>
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Этапы, на которых особенно важны партнеры</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">
                Партнерство сильнее работает, когда понятно, на каком этапе мы подключаем производителя, студию или поставщика и какую задачу решаем вместе.
              </p>
              <p className="text-sm italic text-brand-support">Редакционный акцент: сильный интерьер складывается из хорошо синхронизированных участников.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
              {PARTNER_STAGES.map(([title, desc, Icon], index) => (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="space-y-6 border border-brand-border bg-brand-primary p-10 transition-transform duration-500 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-4xl font-bold text-brand-border">{String(index + 1).padStart(2, '0')}</div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-brand-secondary text-brand-support">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest">{title}</h3>
                  <p className="text-sm font-light leading-relaxed text-brand-muted">{desc}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </Section>

        <Section className="py-40 border-t border-brand-border">
          <div className="space-y-20">
            <div className="max-w-3xl space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Процесс взаимодействия</span>
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Как мы работаем <br />с дизайнерами</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {[
                ['Изучаем проект', 'Смотрим чертежи, ведомости, узлы и состав работ.'],
                ['Проверяем объект', 'Сопоставляем проект с реальным состоянием площадки.'],
                ['Готовим смету', 'Фиксируем этапы и понятный состав реализации.'],
                ['Согласуем вопросы', 'Все спорные решения обсуждаем до выполнения.'],
                ['Ведем реализацию', 'Контролируем инженерные, черновые и чистовые работы.'],
                ['Сдаем результат', 'Передаем объект без потери логики проекта.'],
              ].map(([title, desc], index) => {
                const icons = [FileText, Eye, ClipboardList, MessagesSquare, Wrench, Sparkles];
                const Icon = icons[index % icons.length];

                return (
                  <div key={title} className="space-y-6 group">
                    <div className="flex items-center gap-4">
                      <div className="text-brand-border text-5xl font-bold uppercase tracking-tighter group-hover:text-brand-accent transition-colors">{String(index + 1).padStart(2, '0')}</div>
                      <div className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-brand-support group-hover:border-brand-accent transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest">{title}</h4>
                      <p className="text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed">{desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>

        <Section className="bg-brand-secondary -mx-6 md:-mx-12 px-6 md:px-12 py-40 border-y border-brand-border">
          <Container>
            <div className="space-y-20">
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-center">Почему с нами удобно</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  ['Соблюдаем чертежи', 'Работаем с проектной документацией и не упрощаем решения без согласования.'],
                  ['Фиксируем изменения', 'Любые корректировки проходят через понятное обсуждение и согласование.'],
                  ['Не теряем детали', 'Следим за примыканиями, геометрией и материалами.'],
                  ['Ведем коммуникацию', 'Клиент, дизайнер и команда всегда понимают, что происходит.'],
                  ['Показываем процесс', 'Фотоотчеты помогают контролировать скрытые работы.'],
                  ['Берегем репутацию', 'Качественная реализация усиливает проект, а не создает проблемы после сдачи.'],
                ].map(([title, desc], index) => {
                  const icons = [FileText, ClipboardList, Sparkles, MessagesSquare, Eye, ShieldCheck];
                  const Icon = icons[index % icons.length];

                  return (
                    <div key={title} className="p-8 border border-brand-border space-y-6 bg-brand-primary">
                      <div className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-brand-support">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold uppercase tracking-widest">{title}</h3>
                      <p className="text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed">{desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Container>
        </Section>

        <Section className="py-40 border-t border-brand-border">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Наши работы</span>
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-tight">Проекты, где важна <br />точность реализации</h2>
            </div>
            <Link to="/projects" className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold group">
              Смотреть все проекты
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {jointProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </Section>

        <Section className="py-40 border-t border-brand-border">
          <div className="space-y-20">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Наши партнеры</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                >
                  <PartnerCard partner={partner} />
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        <Section className="py-40 border-t border-brand-border">
          <div className="max-w-4xl space-y-20">
            <h2 className="text-4xl font-bold uppercase tracking-tighter">Вопросы и ответы</h2>
            <div className="space-y-16 pb-24">
              <div className="max-w-3xl space-y-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Кого и когда подключаем</span>
                <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Этапы, на которых особенно важны партнеры</h2>
                <p className="text-lg text-brand-muted font-light leading-relaxed">
                  Партнерство сильнее работает, когда понятно, на каком этапе мы подключаем производителя, студию или поставщика и какую задачу решаем вместе.
                </p>
                <p className="text-sm italic text-brand-support">Редакционный акцент: сильный интерьер складывается из хорошо синхронизированных участников.</p>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
                {PARTNER_STAGES.map(([title, desc, Icon], index) => (
                  <motion.article
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    className="space-y-6 border border-brand-border bg-brand-primary p-10 transition-transform duration-500 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-4xl font-bold text-brand-border">{String(index + 1).padStart(2, '0')}</div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-brand-secondary text-brand-support">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest">{title}</h3>
                    <p className="text-sm font-light leading-relaxed text-brand-muted">{desc}</p>
                  </motion.article>
                ))}
              </div>
            </div>
            <FAQAccordion items={faqItems} />
          </div>
        </Section>

        <Section className="pb-40" id="contact">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none">Обсудим <br />партнерство</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">
                Расскажите о студии, проекте или формате взаимодействия. Предложим удобный рабочий сценарий.
              </p>
            </div>
            <div className="lg:col-span-7">
              <PartnerLeadForm />
            </div>
          </div>
        </Section>
      </Container>
    </motion.div>
  );
};
