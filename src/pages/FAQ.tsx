import { Container, Section, Button } from '../components/Base';
import { Breadcrumbs, FAQAccordion } from '../components/Content';
import { generalFAQ } from '../data/mock';
import { motion } from 'motion/react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useModal } from '../context/ModalContext';
import { getGeneralFaqGroups } from '../lib/api';
import { useCmsValue } from '../lib/hooks';

export const FAQ = () => {
  const { openModal } = useModal();
  const groupedFaq = useCmsValue(getGeneralFaqGroups, generalFAQ);
  const categories = Object.keys(groupedFaq);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40">
      <Container>
        <Breadcrumbs items={[{ name: 'Вопросы и ответы' }]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-40 items-end">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.85]">Ответы на вопросы</h1>
            <p className="text-xl text-brand-muted font-light leading-relaxed max-w-xl">
              Собрали основные вопросы о стоимости, сроках, смете, дизайн-проектах, контроле качества и работе с изменениями.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-y-6 pb-2 border-b border-brand-border lg:border-none">
            {['Короткие ответы', 'Без рекламного шума', 'Про смету и процесс', 'Можно уточнить лично'].map((marker) => (
              <div key={marker} className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-semibold text-brand-text">
                <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                {marker}
              </div>
            ))}
          </div>
        </div>

        <Section className="py-20 border-t border-brand-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-3">
              <div className="sticky top-40 space-y-4">
                <span className="text-[8px] uppercase tracking-[0.3em] text-brand-muted font-bold block mb-8">Категории</span>
                <nav className="flex flex-col gap-2">
                  {categories.map((category) => (
                    <button key={category} onClick={() => setActiveCategory(category)} className={`text-left py-4 px-6 border transition-all text-[10px] uppercase tracking-widest font-bold ${activeCategory === category ? 'bg-brand-dark border-brand-dark text-brand-primary' : 'border-brand-border text-brand-muted hover:border-brand-accent'}`}>
                      {category}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className="lg:col-span-9 space-y-20">
              {categories.map((category) => (
                <div key={category} className={`space-y-12 transition-opacity duration-500 ${activeCategory === category ? 'opacity-100' : 'opacity-40 lg:opacity-20'}`}>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-[1px] bg-brand-accent" />
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">{category}</h2>
                  </div>
                  <FAQAccordion items={groupedFaq[category]} />
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section className="py-40 border-t border-brand-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="w-16 h-16 bg-brand-warm rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-brand-accent" />
              </div>
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none">Остались вопросы <br />по вашему объекту?</h2>
              <p className="text-lg text-brand-muted font-light leading-relaxed max-w-xl">
                Расскажите о задаче, и мы подскажем, какой формат ремонта подойдёт и с чего лучше начать.
              </p>
            </div>
            <div className="flex flex-col gap-6 items-start lg:items-end">
              <Button variant="accent" className="!px-16 !py-6" onClick={() => openModal('question')}>
                Задать вопрос
              </Button>
              <p className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Обычно отвечаем в течение часа</p>
            </div>
          </div>
        </Section>
      </Container>
    </motion.div>
  );
};
