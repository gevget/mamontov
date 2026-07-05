import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Paperclip, Send } from 'lucide-react';
import { useModal, ModalVariant } from '../context/ModalContext';
import { Button } from './Base';

const modalConfigs: Record<ModalVariant, { title: string; text: string }> = {
  project: {
    title: 'Обсудим ваш объект',
    text: 'Расскажите о квартире, доме или готовом проекте. Мы уточним детали и предложим понятный следующий шаг.',
  },
  estimate: {
    title: 'Получить предварительную смету',
    text: 'Оставьте данные об объекте, и мы подготовим ориентир по составу работ и бюджету.',
  },
  partner: {
    title: 'Обсудим сотрудничество',
    text: 'Открыты к работе с дизайнерами, архитекторами и студиями, которым важна аккуратная реализация.',
  },
  question: {
    title: 'Задать вопрос',
    text: 'Оставьте ваш вопрос, и мы свяжемся с вами для короткой консультации.',
  },
};

export const LeadModal: React.FC = () => {
  const { isOpen, variant, closeModal } = useModal();
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeModal]);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const config = modalConfigs[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[100]" />

          <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-brand-primary w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto relative shadow-2xl border border-brand-border"
            >
              <button onClick={closeModal} className="absolute top-6 right-6 text-brand-muted hover:text-brand-text transition-colors z-10">
                <X className="w-6 h-6" />
              </button>

              <div className="p-8 md:p-16">
                {!submitted ? (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight">{config.title}</h2>
                      <p className="text-brand-muted text-sm leading-relaxed max-w-md">{config.text}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Ваше имя</label>
                        <input required type="text" placeholder="Имя Фамилия" className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-support transition-colors font-light text-sm" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Телефон</label>
                        <input required type="tel" placeholder="+7 (___) ___-__-__" className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-support transition-colors font-light text-sm" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Удобный канал</label>
                        <select className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-support transition-colors font-light text-sm appearance-none cursor-pointer">
                          <option>Telegram</option>
                          <option>WhatsApp</option>
                          <option>Звонок</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Тип объекта</label>
                        <select className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-support transition-colors font-light text-sm appearance-none cursor-pointer">
                          <option>Квартира</option>
                          <option>Частный дом</option>
                          <option>Другое</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Площадь (м2)</label>
                        <input type="number" placeholder="80" className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-support transition-colors font-light text-sm" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Есть ли проект?</label>
                        <select className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-support transition-colors font-light text-sm appearance-none cursor-pointer">
                          <option>Да, есть</option>
                          <option>В процессе</option>
                          <option>Нет</option>
                        </select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Комментарий</label>
                        <textarea rows={3} placeholder="Опишите задачу, сроки или вопросы..." className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-support transition-colors font-light text-sm resize-none" />
                      </div>

                      <div className="md:col-span-2">
                        <div className="border-2 border-dashed border-brand-border p-6 text-center group hover:border-brand-accent transition-colors cursor-pointer">
                          <div className="flex flex-col items-center gap-2">
                            <Paperclip className="w-5 h-5 text-brand-muted group-hover:text-brand-accent transition-colors" />
                            <span className="text-[10px] uppercase tracking-widest text-brand-muted font-bold group-hover:text-brand-text transition-colors">
                              Прикрепить планировку или проект
                            </span>
                          </div>
                        </div>
                        <p className="mt-3 text-[9px] text-brand-muted uppercase tracking-widest leading-relaxed">
                          Если файла нет под рукой, можно отправить его позже в мессенджере.
                        </p>
                      </div>

                      <div className="md:col-span-2 pt-4">
                        <Button variant="accent" className="w-full" type="submit">
                          Отправить заявку <Send className="ml-2 w-3 h-3" />
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="py-12 md:py-20 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-brand-accent rounded-full flex items-center justify-center mx-auto shadow-lg shadow-brand-accent/20">
                      <CheckCircle2 className="w-10 h-10 text-brand-dark" />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-3xl font-display font-medium">Заявка отправлена</h2>
                      <p className="text-brand-muted text-sm leading-relaxed max-w-sm mx-auto">
                        Спасибо. Мы получили информацию и свяжемся с вами, чтобы уточнить детали проекта.
                      </p>
                    </div>
                    <div className="pt-4">
                      <Button onClick={closeModal} variant="secondary" className="w-full md:w-auto">
                        Закрыть
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
