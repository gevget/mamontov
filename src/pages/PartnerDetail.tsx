import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Section, Button } from '../components/Base';
import { Breadcrumbs, ProjectCard } from '../components/Content';
import { partners as mockPartners, projects } from '../data/mock';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useModal } from '../context/ModalContext';
import { PartnerLeadForm } from '../components/LeadForm';
import { getPartners } from '../lib/api';
import type { Partner } from '../types';

export const PartnerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [partners, setPartners] = useState<Partner[]>(mockPartners);

  useEffect(() => {
    let isActive = true;

    getPartners().then((data) => {
      if (isActive) {
        setPartners(data);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  const partner = partners.find((p) => p.slug === id);

  useEffect(() => {
    if (!partner) navigate('/partners');
    window.scrollTo(0, 0);
  }, [partner, navigate]);

  if (!partner) return null;

  const partnerProjects = projects.filter((p) => partner.projects?.includes(p.id));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40">
      <Container>
        <div className="flex justify-between items-center mb-8">
          <Breadcrumbs items={[{ name: 'Партнёры', href: '/partners' }, { name: partner.name }]} />
          <Link to="/partners" className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-muted hover:text-brand-text transition-colors">
            <ArrowLeft className="w-3 h-3" /> Назад к списку
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-brand-accent font-bold">Партнёр ArchiBuild</span>
              <h1 className="text-6xl md:text-9xl font-bold uppercase tracking-tighter leading-[0.8]">{partner.name}</h1>
              <p className="text-xl md:text-2xl text-brand-muted font-light leading-relaxed max-w-xl">{partner.specialization}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-brand-border">
              {[
                ['Город', partner.location || 'Москва'],
                ['Тип', partner.type],
                ['Фокус', partner.focus || 'Современные интерьеры'],
                ['Статус', 'Активный партнёр'],
              ].map(([label, value]) => (
                <div key={label} className="space-y-2">
                  <span className="text-[8px] uppercase tracking-widest text-brand-muted font-bold">{label}</span>
                  <p className="text-[10px] uppercase tracking-widest font-bold">{value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl font-bold uppercase tracking-tighter">О партнёре</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">{partner.description}</p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] bg-brand-warm overflow-hidden">
              <img src={partner.image} alt={partner.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>

        <Section className="py-32 border-t border-brand-border">
          <div className="space-y-20">
            <h2 className="text-4xl font-bold uppercase tracking-tighter">Как мы работаем вместе</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                ['Изучаем проект', 'Детально разбираем чертежи, материалы и технические узлы.'],
                ['Согласуем вопросы', 'Обсуждаем все спорные решения до начала работ.'],
                ['Ведём объект', 'Контролируем процесс, этапы и качество исполнения.'],
                ['Сохраняем идею', 'Помогаем довести проект до результата без потери деталей.'],
              ].map(([title, desc]) => (
                <div key={title} className="p-8 border border-brand-border space-y-4">
                  <CheckCircle2 className="w-5 h-5 text-brand-accent" />
                  <h3 className="text-xs font-bold uppercase tracking-widest">{title}</h3>
                  <p className="text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {partnerProjects.length > 0 && (
          <Section className="py-32 border-t border-brand-border">
            <div className="space-y-20">
              <h2 className="text-4xl font-bold uppercase tracking-tighter">Совместные проекты</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {partnerProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
              </div>
            </div>
          </Section>
        )}

        <Section className="py-40 bg-brand-warm -mx-6 md:-mx-12 px-6 md:px-12 border-y border-brand-border">
          <Container>
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <span className="text-5xl md:text-8xl font-serif text-brand-border italic">"</span>
              <p className="text-2xl md:text-4xl font-light leading-relaxed italic tracking-tight">
                Для меня важно, чтобы на стройке не упрощали проект без обсуждения. В совместной работе ценю внимательность к чертежам и спокойную коммуникацию.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-bold uppercase tracking-widest">{partner.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Партнёр проекта</p>
              </div>
            </div>
          </Container>
        </Section>

        <Section className="py-40">
          <div className="bg-brand-dark p-12 md:p-32 text-center space-y-12">
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-brand-primary leading-tight">Хотите реализовать <br />проект вместе?</h2>
            <p className="text-xl text-brand-primary/60 font-light leading-relaxed max-w-2xl mx-auto">
              Отправьте проект или расскажите об объекте. Обсудим формат взаимодействия и оценим следующий шаг.
            </p>
            <div className="pt-8">
              <Button variant="accent" onClick={() => openModal('partner')}>Обсудить сотрудничество</Button>
            </div>
          </div>
        </Section>

        <Section id="contact" className="pb-40 border-t border-brand-border pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none">Обсудим <br />партнёрство</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">
                Расскажите о проекте, студии или запросе. Предложим удобный формат совместной работы.
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
