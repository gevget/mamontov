import { useEffect, useMemo, useState } from 'react';
import { Container, Section, Button } from '../components/Base';
import { Breadcrumbs, FAQAccordion } from '../components/Content';
import { priceFAQ, priceRanges as mockPriceRanges } from '../data/mock';
import { motion } from 'motion/react';
import { CheckCircle2, Info, ArrowRight, Calculator, ClipboardList, FileText, Hammer, Layers3, Map, Package, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { LeadForm } from '../components/LeadForm';
import { useModal } from '../context/ModalContext';
import { getPriceFaq, getPriceRanges } from '../lib/api';
import { useCmsValue } from '../lib/hooks';

const priceHeroIcons = [Calculator, ClipboardList, ShieldCheck, FileText];
const includedIcons = [FileText, ClipboardList, Package, Hammer, Wrench, Layers3, ShieldCheck, CheckCircle2];
const separateIcons = [Layers3, Wrench, Hammer, Package, FileText, Truck];
const priceScenarioIcons = [Map, ShieldCheck, Layers3];

const PRICE_SCENARIOS = [
  {
    title: 'Квартира для жизни',
    area: '70-95 м2',
    budget: 'от 3.4 млн',
    description: 'Подходит для вторичного жилья и новостроек, когда нужен спокойный темп, понятная смета и аккуратная чистовая отделка.',
    details: ['Смета до старта', 'График этапов', 'Фотофиксация процесса'],
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200',
  },
  {
    title: 'Дом с инженерией',
    area: '140-220 м2',
    budget: 'от 7.8 млн',
    description: 'Формат для объектов с отоплением, вентиляцией, сложными узлами и повышенными требованиями к координации подрядчиков.',
    details: ['Инженерный разбор', 'Контроль скрытых работ', 'Поэтапные акты'],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
  },
  {
    title: 'Дизайнерский проект',
    area: '90-160 м2',
    budget: 'от 5.6 млн',
    description: 'Когда важны нестандартные решения, авторские детали, работа с мебелью и точная реализация замысла без визуальных компромиссов.',
    details: ['Работа по чертежам', 'Согласование узлов', 'Контроль авторских решений'],
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200',
  },
] as const;

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
              <Info className="w-4 h-4 text-brand-support flex-shrink-0" />
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
            <div className="aspect-[4/3] max-w-xl overflow-hidden bg-brand-warm">
              <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200" alt="Расчет бюджета проекта" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-6 pb-2">
            {['Предварительный расчёт', 'Смета до старта', 'Договор и этапы', 'Прозрачные условия'].map((marker, index) => {
              const Icon = priceHeroIcons[index % priceHeroIcons.length];

              return (
              <div key={marker} className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-semibold text-brand-text">
                <Icon className="w-4 h-4 text-brand-support" />
                {marker}
              </div>
            )})}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-40">
          {priceRanges.map((range, index) => {
            const icons = [Calculator, FileText, Hammer, ShieldCheck];
            const Icon = icons[index % icons.length];

            return (
              <div key={range.title} className="p-8 border border-brand-border space-y-6 bg-brand-primary">
                <div className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-brand-support">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest">{range.title}</h3>
                <p className="text-3xl font-bold uppercase tracking-tighter text-brand-support">{range.price}</p>
                <p className="text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed">{range.description}</p>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-brand-muted uppercase tracking-widest text-center mb-40">
          Диапазоны указаны для предварительной ориентации. Итоговая стоимость рассчитывается после замера и изучения проекта.
        </p>

        <Section className="border-t border-brand-border pt-32">
          <div className="space-y-16">
            <div className="max-w-3xl space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Сценарии бюджета</span>
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Как обычно выглядит проект</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">
                Ниже не прайс-лист, а ориентиры по типовым сценариям. Так проще понять масштаб объекта, состав работ и уровень бюджета еще до детальной сметы.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              {PRICE_SCENARIOS.map((scenario, index) => {
                const Icon = priceScenarioIcons[index % priceScenarioIcons.length];

                return (
                  <motion.article
                    key={scenario.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.55, delay: index * 0.08 }}
                    className="overflow-hidden border border-brand-border bg-brand-primary"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-brand-warm">
                      <img src={scenario.image} alt={scenario.title} className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]" referrerPolicy="no-referrer" />
                    </div>
                    <div className="space-y-8 p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">{scenario.area}</p>
                          <h3 className="text-2xl font-bold uppercase tracking-tight">{scenario.title}</h3>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-border bg-brand-secondary text-brand-support">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="flex items-end justify-between gap-4 border-y border-brand-border py-5">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Ориентир</span>
                        <span className="text-2xl font-bold uppercase tracking-tight text-brand-support">{scenario.budget}</span>
                      </div>

                      <p className="text-sm text-brand-muted font-light leading-relaxed">{scenario.description}</p>

                      <div className="grid grid-cols-1 gap-4">
                        {scenario.details.map((detail) => (
                          <div key={detail} className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-semibold">
                            <CheckCircle2 className="h-4 w-4 text-brand-support flex-shrink-0" />
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </Section>

        <Section className="border-t border-brand-border pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-4 space-y-8">
              <h2 className="text-4xl font-bold uppercase tracking-tighter">Что входит <br />в стоимость</h2>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12">
              {['изучение объекта и задачи', 'подготовка сметы', 'организация работ', 'черновые работы', 'инженерия по составу проекта', 'чистовая отделка', 'контроль качества', 'сдача объекта'].map((item, index) => {
                const Icon = includedIcons[index % includedIcons.length];

                return (
                <div key={item} className="flex gap-4 items-start">
                  <Icon className="w-5 h-5 text-brand-support flex-shrink-0" />
                  <span className="text-xs uppercase tracking-widest font-bold pt-1">{item}</span>
                </div>
              )})}
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
                {['чистовые материалы', 'сложные инженерные решения', 'нестандартные конструкции', 'мебель и встроенные системы', 'авторский надзор', 'доставка и подъём материалов'].map((item, index) => {
                  const Icon = separateIcons[index % separateIcons.length];

                  return (
                  <div key={item} className="flex gap-4 items-start">
                    <Icon className="w-4 h-4 text-brand-support flex-shrink-0 pt-1" />
                    <span className="text-xs uppercase tracking-widest font-medium text-brand-muted">{item}</span>
                  </div>
                )})}
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
              ].map(([title, desc], index) => {
                const icons = [Map, Package, FileText, Wrench, Layers3, Hammer, Truck, ShieldCheck];
                const Icon = icons[index % icons.length];

                return (
                  <div key={title} className="space-y-4">
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
        </Section>

        <Section id="calculator">
          <div className="space-y-12 mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Оценка проекта</span>
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Мини-калькулятор</h2>
          </div>
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-[1.15fr_0.85fr] xl:items-stretch">
            <PriceCalculator />
            <div className="aspect-[4/5] overflow-hidden bg-brand-warm">
              <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200" alt="Подготовка сметы" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </Section>

        <Section className="py-32">
          <div className="bg-brand-secondary p-12 md:p-20 space-y-12">
            <div className="aspect-[21/9] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1400" alt="Финансовое планирование проекта" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            </div>
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
                <p className="text-4xl font-bold uppercase tracking-tighter text-brand-support">от 3 870 000 руб</p>
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
