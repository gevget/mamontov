import { useEffect, useMemo, useState } from 'react';
import { Container, Section, Button } from '../components/Base';
import { Breadcrumbs, FAQAccordion } from '../components/Content';
import { priceFAQ, priceRanges as mockPriceRanges } from '../data/mock';
import { motion } from 'motion/react';
import { CheckCircle2, Info, ArrowRight, Plus } from 'lucide-react';
import { LeadForm } from '../components/LeadForm';
import { useModal } from '../context/ModalContext';
import { getPriceFaq, getPriceRanges } from '../lib/api';
import { useCmsValue } from '../lib/hooks';

const PriceCalculator = () => {
  const { openModal } = useModal();
  const [type, setType] = useState<'квартира' | 'дом'>('квартира');
  const [area, setArea] = useState(80);
  const [format, setFormat] = useState<'базовый' | 'комплексный' | 'проект'>('комплексный');
  const [needsEngineering, setNeedsEngineering] = useState(true);

  const estimate = useMemo(() => {
    let basePrice = 40000;
    if (format === 'базовый') basePrice = 35000;
    if (format === 'проект') basePrice = 45000;
    if (type === 'дом') basePrice *= 1.15;
    return Math.round(basePrice * area).toLocaleString('ru-RU');
  }, [type, area, format]);

  return (
    <div className="bg-brand-primary border border-brand-border p-8 md:p-12 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-muted">Тип объекта</label>
            <div className="flex gap-2">
              {[
                ['квартира', 'Квартира'],
                ['дом', 'Дом'],
              ].map(([value, label]) => (
                <button key={value} onClick={() => setType(value as 'квартира' | 'дом')} className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-bold border transition-all ${type === value ? 'bg-brand-accent border-brand-accent text-brand-dark' : 'border-brand-border text-brand-muted'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-muted">Площадь объекта</label>
              <span className="text-xl font-display">{area} м2</span>
            </div>
            <input type="range" min="30" max="500" value={area} onChange={(e) => setArea(parseInt(e.target.value))} className="w-full h-1 bg-brand-border appearance-none cursor-pointer accent-brand-accent" />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-muted">Формат ремонта</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                ['базовый', 'Базовый'],
                ['комплексный', 'Комплексный'],
                ['проект', 'По дизайн-проекту'],
              ].map(([id, label]) => (
                <button key={id} onClick={() => setFormat(id as 'базовый' | 'комплексный' | 'проект')} className={`w-full py-3 px-6 text-left text-[10px] uppercase tracking-widest font-bold border transition-all flex justify-between items-center ${format === id ? 'bg-brand-accent border-brand-accent text-brand-dark' : 'border-brand-border text-brand-muted'}`}>
                  {label}
                  {format === id && <ArrowRight className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-muted">Нужна ли инженерия?</label>
            <div className="flex gap-2">
              {[true, false].map((val) => (
                <button key={String(val)} onClick={() => setNeedsEngineering(val)} className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-bold border transition-all ${needsEngineering === val ? 'bg-brand-accent border-brand-accent text-brand-dark' : 'border-brand-border text-brand-muted'}`}>
                  {val ? 'Да' : 'Нет'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 bg-brand-warm border border-brand-border space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Предварительный ориентир</span>
              <p className="text-4xl font-bold uppercase tracking-tighter">от {estimate} руб</p>
            </div>
            <p className="text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed">
              {needsEngineering ? 'Инженерные работы требуют отдельной детализации после изучения объекта.' : 'Расчёт без учёта сложных инженерных систем.'}
            </p>
            <div className="flex items-start gap-3 pt-4 border-t border-brand-border">
              <Info className="w-4 h-4 text-brand-accent flex-shrink-0" />
              <p className="text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed">
                Точная смета рассчитывается после замера и согласования состава работ.
              </p>
            </div>
            <Button variant="accent" className="w-full mt-4" onClick={() => openModal('estimate')}>
              Обсудить расчёт
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Prices = () => {
  const priceRanges = useCmsValue(getPriceRanges, mockPriceRanges);
  const faqItems = useCmsValue(getPriceFaq, priceFAQ);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40">
      <Container>
        <Breadcrumbs items={[{ name: 'Цены' }]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32 items-end">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.85]">Цены</h1>
            <p className="text-xl text-brand-muted font-light leading-relaxed max-w-xl">
              Стоимость зависит от площади, проектной документации, инженерии, материалов и текущего состояния объекта. Мы заранее показываем логику расчёта.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-y-6 pb-2">
            {['Предварительный расчёт', 'Смета до старта', 'Договор и этапы', 'Прозрачные условия'].map((marker) => (
              <div key={marker} className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-semibold text-brand-text">
                <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                {marker}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-40">
          {priceRanges.map((range) => (
            <div key={range.title} className="p-8 border border-brand-border space-y-6 bg-brand-primary">
              <h3 className="text-sm font-bold uppercase tracking-widest">{range.title}</h3>
              <p className="text-3xl font-bold uppercase tracking-tighter text-brand-accent">{range.price}</p>
              <p className="text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed">{range.description}</p>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-brand-muted uppercase tracking-widest text-center mb-40">
          Диапазоны указаны для предварительной ориентации. Итоговая стоимость рассчитывается после замера и изучения проекта.
        </p>

        <Section className="border-t border-brand-border pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-4 space-y-8">
              <h2 className="text-4xl font-bold uppercase tracking-tighter">Что входит <br />в стоимость</h2>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12">
              {['изучение объекта и задачи', 'подготовка сметы', 'организация работ', 'черновые работы', 'инженерия по составу проекта', 'чистовая отделка', 'контроль качества', 'сдача объекта'].map((item) => (
                <div key={item} className="flex gap-4 items-start">
                  <CheckCircle2 className="w-5 h-5 text-brand-accent flex-shrink-0" />
                  <span className="text-xs uppercase tracking-widest font-bold pt-1">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section className="bg-brand-warm -mx-6 md:-mx-12 px-6 md:px-12 py-32 border-y border-brand-border">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
              <div className="lg:col-span-4 space-y-8">
                <h2 className="text-4xl font-bold uppercase tracking-tighter">Что считается <br />отдельно</h2>
                <p className="text-sm text-brand-muted font-light leading-relaxed">
                  Эти позиции зависят от выбранных материалов, сложности решений и логистики поставок.
                </p>
              </div>
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12">
                {['чистовые материалы', 'сложные инженерные решения', 'нестандартные конструкции', 'мебель и встроенные системы', 'авторский надзор', 'доставка и подъём материалов'].map((item) => (
                  <div key={item} className="flex gap-4 items-start">
                    <Plus className="w-4 h-4 text-brand-muted flex-shrink-0 pt-1" />
                    <span className="text-xs uppercase tracking-widest font-medium text-brand-muted">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        <Section className="py-40">
          <div className="space-y-20">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-center">От чего зависит цена</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20">
              {[
                ['Площадь', 'Чем больше площадь, тем выше общий бюджет проекта.'],
                ['Состояние', 'Первичное жильё и вторичный фонд требуют разной подготовки.'],
                ['Проект', 'Наличие документации ускоряет расчёт и снижает неопределённость.'],
                ['Инженерия', 'Сложные системы заметно влияют на состав работ.'],
                ['Материалы', 'Форматы, вес и способ монтажа влияют на трудоёмкость.'],
                ['Сложность', 'Радиусные стены, теневые профили и скрытые двери требуют большего мастерства.'],
                ['Сроки', 'Сжатый график может требовать усиления команды.'],
                ['Контроль', 'Расширенная отчётность и фиксация этапов добавляют прозрачности.'],
              ].map(([title, desc]) => (
                <div key={title} className="space-y-4">
                  <div className="w-12 h-[1px] bg-brand-accent" />
                  <h4 className="text-xs font-bold uppercase tracking-widest">{title}</h4>
                  <p className="text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="calculator">
          <div className="space-y-12 mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Оценка проекта</span>
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Мини-калькулятор</h2>
          </div>
          <PriceCalculator />
        </Section>

        <Section className="py-32">
          <div className="bg-brand-secondary p-12 md:p-20 space-y-12">
            <h2 className="text-3xl font-bold uppercase tracking-tighter">Пример расчёта</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-brand-border pt-12">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-brand-muted">Объект</span>
                <p className="text-sm font-bold uppercase">Квартира 86 м2</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-brand-muted">Формат</span>
                <p className="text-sm font-bold uppercase">По дизайн-проекту</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-brand-muted">Срок</span>
                <p className="text-sm font-bold uppercase">Около 5 месяцев</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pt-8">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-brand-muted">Состав работ</span>
                <p className="text-[10px] text-brand-muted uppercase tracking-widest max-w-md">
                  Черновые работы, инженерия, подготовка оснований, чистовая отделка и контроль качества.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-brand-muted">Предварительный ориентир</span>
                <p className="text-4xl font-bold uppercase tracking-tighter text-brand-accent">от 3 870 000 руб</p>
              </div>
            </div>
          </div>
        </Section>

        <Section className="py-40">
          <div className="max-w-4xl space-y-20">
            <h2 className="text-4xl font-bold uppercase tracking-tighter">Частые вопросы</h2>
            <FAQAccordion items={faqItems} />
          </div>
        </Section>

        <Section className="pb-40" id="contact">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none">Получите <br />предварительную смету</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">
                Расскажите об объекте, площади и формате ремонта. Мы уточним детали и подготовим ориентир.
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
