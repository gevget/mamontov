import { Container, Section } from '../components/Base';
import { Breadcrumbs, FAQAccordion } from '../components/Content';
import { technologyFAQ } from '../data/mock';
import { motion } from 'motion/react';
import { CheckCircle2, Settings, Hammer, Ruler, Layers } from 'lucide-react';
import { LeadForm } from '../components/LeadForm';

export const Technologies = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40">
      <Container>
        <Breadcrumbs items={[{ name: 'Технологии' }]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-40 items-end">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.85]">Технологии <br />и контроль</h1>
            <p className="text-xl text-brand-muted font-light leading-relaxed max-w-xl">
              Качество ремонта видно не только на финальных фотографиях. Оно начинается с черновых работ, инженерии, подготовки оснований и дисциплины в процессе.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-y-6 pb-2">
            {['Скрытые работы', 'Инженерия', 'Чек-листы', 'Фотоотчёты'].map((marker) => (
              <div key={marker} className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-semibold text-brand-text">
                <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                {marker}
              </div>
            ))}
          </div>
        </div>

        <Section className="py-40 border-t border-brand-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-7 space-y-12">
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-tight">Хороший ремонт начинается до чистовой отделки</h2>
              <div className="w-20 h-[1px] bg-brand-accent" />
              <p className="text-xl text-brand-muted font-light leading-relaxed max-w-2xl">
                Ровные стены, стабильная электрика, грамотно собранная сантехника и подготовленные основания не всегда заметны на фото, но именно они определяют качество и долговечность результата.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] bg-brand-warm overflow-hidden">
                <img src="https://images.unsplash.com/photo-1503387762-592dec5832f2?auto=format&fit=crop&q=80&w=1200" alt="Construction process" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </Section>

        <Section className="py-40 border-t border-brand-border">
          <div className="space-y-20">
            <div className="max-w-3xl space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Стандарты качества</span>
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Ключевые направления <br />контроля</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-border border border-brand-border">
              {[
                ['Черновые работы', 'Подготовка стен, полов и оснований под дальнейшую отделку.'],
                ['Инженерные системы', 'Электрика, сантехника, вентиляция и скрытые коммуникации.'],
                ['Геометрия помещений', 'Контроль плоскостей, углов, примыканий и чистых линий.'],
                ['Материалы', 'Подбор и применение решений под задачу, объект и проект.'],
                ['Чистовая отделка', 'Финишные покрытия, стыки и визуальные детали.'],
                ['Приёмка этапов', 'Проверка результата до перехода к следующему этапу.'],
              ].map(([title, desc], i) => (
                <div key={title} className="p-12 bg-brand-primary space-y-6 group hover:bg-brand-warm transition-colors duration-500">
                  <div className="text-brand-border text-xs font-bold group-hover:text-brand-accent transition-colors">{String(i + 1).padStart(2, '0')}</div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest">{title}</h4>
                    <p className="text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section className="py-40 border-t border-brand-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-4 space-y-8">
              <h2 className="text-4xl font-bold uppercase tracking-tighter">Как мы <br />контролируем <br />процесс</h2>
            </div>
            <div className="lg:col-span-8 space-y-12">
              {[
                ['Изучаем проект и объект', 'Проверяем исходные данные, состав работ и состояние площадки.'],
                ['Делим ремонт на этапы', 'Фиксируем последовательность работ, чтобы процесс был управляемым.'],
                ['Проверяем скрытые работы', 'Контролируем то, что позже закроется отделкой.'],
                ['Ведём фотоотчёты', 'Показываем клиенту, что происходит на объекте.'],
                ['Согласуем изменения', 'Все новые решения фиксируем до выполнения.'],
                ['Принимаем результат', 'Проверяем качество перед сдачей объекта.'],
              ].map(([title, desc], i) => (
                <div key={title} className="flex gap-12 group pb-12 border-b border-brand-border last:border-0">
                  <div className="text-4xl font-bold text-brand-border group-hover:text-brand-accent transition-colors">{String(i + 1).padStart(2, '0')}</div>
                  <div className="space-y-2 pt-2">
                    <h4 className="text-sm font-bold uppercase tracking-widest">{title}</h4>
                    <p className="text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section className="bg-brand-dark -mx-6 md:-mx-12 px-6 md:px-12 py-40 border-y border-brand-border">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-12">
                <span className="text-[10px] uppercase tracking-[0.4em] text-brand-accent font-bold">Важная зона контроля</span>
                <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter text-brand-primary leading-none">Скрытые работы - <br />зона, где нельзя <br />экономить на контроле</h2>
                <p className="text-xl text-brand-primary/60 font-light leading-relaxed max-w-xl">
                  После чистовой отделки инженерия, основания и коммуникации уже не видны. Поэтому мы особенно внимательно проверяем их до того, как они будут закрыты материалами.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-8">
                  {['Электрика', 'Сантехнические узлы', 'Подготовка стен и полов', 'Скрытые коммуникации'].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-brand-primary/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="aspect-square bg-brand-border/20 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1558389186-438424b00a32?auto=format&fit=crop&q=80&w=1200" alt="Technical details" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
              </div>
            </div>
          </Container>
        </Section>

        <Section className="py-40">
          <div className="space-y-20">
            <div className="text-center space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold">Система проверки</span>
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Чек-листы приёмки</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                ['Черновой этап', ['геометрия стен', 'подготовка оснований', 'качество стяжки', 'скрытые коммуникации']],
                ['Инженерия', ['электрика', 'сантехника', 'вентиляция', 'слаботочные системы']],
                ['Чистовая отделка', ['стыки', 'примыкания', 'материалы', 'визуальная целостность']],
                ['Финальная сдача', ['уборка', 'проверка замечаний', 'передача объекта', 'гарантийные документы']],
              ].map(([title, items]) => (
                <div key={title} className="space-y-8 p-10 border border-brand-border bg-brand-primary group hover:border-brand-accent transition-colors">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-brand-muted">{title}</h3>
                  <ul className="space-y-4">
                    {(items as string[]).map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="w-1 h-1 rounded-full bg-brand-border mt-1.5 group-hover:bg-brand-accent transition-colors" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section className="py-40 bg-brand-secondary -mx-6 md:-mx-12 px-6 md:px-12 border-y border-brand-border">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
              <div className="lg:col-span-5 space-y-8">
                <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-tight">Материалы подбираются под задачу</h2>
                <p className="text-lg text-brand-muted font-light leading-relaxed">
                  Для каждого объекта важны разные решения: влажные зоны, нагрузка на покрытия, сроки, инженерия и требования дизайн-проекта.
                </p>
              </div>
              <div className="lg:col-span-7 grid grid-cols-2 gap-8">
                {[
                  ['основания и смеси', Hammer],
                  ['инженерные материалы', Settings],
                  ['чистовые покрытия', Layers],
                  ['расходники и крепёж', Ruler],
                ].map(([title, Icon]) => (
                  <div key={title as string} className="p-8 border border-brand-border bg-brand-primary space-y-4 hover:border-brand-accent transition-colors cursor-default">
                    <Icon className="w-6 h-6 text-brand-accent" />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest">{title as string}</h4>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        <Section className="py-40 border-t border-brand-border">
          <div className="max-w-4xl space-y-20">
            <h2 className="text-4xl font-bold uppercase tracking-tighter">Частые вопросы</h2>
            <FAQAccordion items={technologyFAQ} />
          </div>
        </Section>

        <Section className="pb-40" id="contact">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none">Хотите понять, что <br />нужно вашему объекту?</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed">
                Расскажите о квартире, доме или проекте. Мы оценим состояние объекта и предложим рабочий план.
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
