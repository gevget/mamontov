import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileText,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users2,
} from 'lucide-react';
import { Container, Section, Button } from '../components/Base';
import { Breadcrumbs, ProjectCard } from '../components/Content';
import { PartnerLeadForm } from '../components/LeadForm';
import { partners as mockPartners, projects } from '../data/mock';
import { useModal } from '../context/ModalContext';
import { getPartners } from '../lib/api';
import type { Partner } from '../types';

const metaIcons = [MapPin, Building2, Eye, ShieldCheck];
const workIcons = [FileText, ClipboardList, CheckCircle2, Sparkles];

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
        <div className="mb-8 flex items-center justify-between">
          <Breadcrumbs items={[{ name: 'Партнёры', href: '/partners' }, { name: partner.name }]} />
          <Link to="/partners" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted transition-colors hover:text-brand-text">
            <ArrowLeft className="h-3 w-3" /> Назад к списку
          </Link>
        </div>

        <div className="mb-32 grid grid-cols-1 gap-20 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-7">
            <div className="space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-support">Партнёр МАМОНТОВ</span>
              <h1 className="page-hero-title max-w-[12ch] font-bold uppercase tracking-tighter">{partner.name}</h1>
              <p className="max-w-xl text-xl font-light leading-relaxed text-brand-muted md:text-2xl">{partner.specialization}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 border-y border-brand-border py-12 md:grid-cols-4">
              {[
                ['Город', partner.location || 'Москва'],
                ['Тип', partner.type],
                ['Фокус', partner.focus || 'Современные интерьеры'],
                ['Статус', 'Активный партнёр'],
              ].map(([label, value], index) => {
                const Icon = metaIcons[index % metaIcons.length];

                return (
                  <div key={label} className="space-y-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-brand-secondary text-brand-support">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-brand-muted">{label}</span>
                      <p className="text-[10px] font-bold uppercase tracking-widest">{value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl font-bold uppercase tracking-tighter">О партнёре</h2>
              <p className="text-lg font-light leading-relaxed text-brand-muted">{partner.description}</p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] overflow-hidden bg-brand-warm">
              <img src={partner.image} alt={partner.name} className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>

        <Section className="border-t border-brand-border py-32">
          <div className="space-y-20">
            <h2 className="text-4xl font-bold uppercase tracking-tighter">Как мы работаем вместе</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                ['Изучаем проект', 'Детально разбираем чертежи, материалы и технические узлы.'],
                ['Согласуем вопросы', 'Обсуждаем все спорные решения до начала работ.'],
                ['Ведём объект', 'Контролируем процесс, этапы и качество исполнения.'],
                ['Сохраняем идею', 'Помогаем довести проект до результата без потери деталей.'],
              ].map(([title, desc], index) => {
                const Icon = workIcons[index % workIcons.length];

                return (
                  <div key={title} className="space-y-4 border border-brand-border p-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-brand-secondary text-brand-support">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-widest">{title}</h3>
                    <p className="text-[10px] uppercase tracking-widest leading-relaxed text-brand-muted">{desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>

        {partnerProjects.length > 0 && (
          <Section className="border-t border-brand-border py-32">
            <div className="space-y-20">
              <h2 className="text-4xl font-bold uppercase tracking-tighter">Совместные проекты</h2>
              <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                {partnerProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
              </div>
            </div>
          </Section>
        )}

        <Section className="bg-brand-warm -mx-6 border-y border-brand-border px-6 py-40 md:-mx-12 md:px-12">
          <Container>
            <div className="mx-auto max-w-4xl space-y-12 text-center">
              <span className="font-serif text-5xl italic text-brand-border md:text-8xl">"</span>
              <p className="text-2xl font-light italic leading-relaxed tracking-tight md:text-4xl">
                Для меня важно, чтобы на стройке не упрощали проект без обсуждения. В совместной работе ценю внимательность к чертежам и спокойную коммуникацию.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-bold uppercase tracking-widest">{partner.name}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Партнёр проекта</p>
              </div>
            </div>
          </Container>
        </Section>

        <Section className="py-40">
          <div className="space-y-12 bg-brand-dark p-12 text-center md:p-32">
            <h2 className="text-4xl font-bold uppercase tracking-tighter leading-tight text-brand-primary md:text-6xl">Хотите реализовать проект вместе?</h2>
            <p className="mx-auto max-w-2xl text-xl font-light leading-relaxed text-brand-primary/60">
              Отправьте проект или расскажите об объекте. Обсудим формат взаимодействия и оценим следующий шаг.
            </p>
            <div className="pt-8">
              <Button variant="accent" onClick={() => openModal('partner')}>Обсудить сотрудничество</Button>
            </div>
          </div>
        </Section>

        <Section id="contact" className="border-t border-brand-border pb-40 pt-32">
          <div className="grid grid-cols-1 gap-20 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-5">
              <h2 className="text-4xl font-bold uppercase tracking-tighter leading-none md:text-6xl">Обсудим партнёрство</h2>
              <p className="text-lg font-light leading-relaxed text-brand-muted">
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
