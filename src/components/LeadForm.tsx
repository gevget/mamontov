import { Button } from './Base';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const SuccessState = ({ title = 'Спасибо' }: { title?: string }) => (
  <div className="bg-brand-primary p-8 md:p-16 border border-brand-border shadow-sm text-center space-y-6 animate-in fade-in duration-700">
    <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center mx-auto">
      <CheckCircle2 className="w-8 h-8 text-brand-dark" />
    </div>
    <h3 className="text-2xl font-bold uppercase tracking-tighter">{title}</h3>
    <p className="text-brand-muted uppercase tracking-widest text-[10px] leading-relaxed max-w-sm mx-auto">
      Мы получили заявку и свяжемся с вами в ближайшее время, чтобы уточнить детали.
    </p>
  </div>
);

export const PartnerLeadForm = () => {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return <SuccessState title="Заявка отправлена" />;

  return (
    <div className="bg-brand-primary p-8 md:p-16 border border-brand-border shadow-sm">
      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Ваше имя</label>
          <input required type="text" placeholder="Имя Фамилия" className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-accent transition-colors font-light" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Телефон</label>
          <input required type="tel" placeholder="+7 (___) ___-__-__" className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-accent transition-colors font-light" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Ваша роль</label>
          <select className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-accent transition-colors font-light appearance-none cursor-pointer">
            <option>Дизайнер</option>
            <option>Архитектор</option>
            <option>Студия</option>
            <option>Другое</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Ссылка на портфолио</label>
          <input type="url" placeholder="https://..." className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-accent transition-colors font-light" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Комментарий</label>
          <textarea rows={4} placeholder="Расскажите о проекте или формате сотрудничества..." className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-accent transition-colors font-light resize-none" />
        </div>
        <div className="md:col-span-2 pt-8">
          <Button variant="accent" className="w-full md:w-auto" type="submit">Отправить заявку</Button>
          <p className="mt-6 text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed max-w-sm">
            Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
          </p>
        </div>
      </form>
    </div>
  );
};

export const LeadForm = () => {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return <SuccessState />;

  return (
    <div className="bg-brand-primary p-8 md:p-16 border border-brand-border shadow-sm">
      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Ваше имя</label>
          <input required type="text" placeholder="Имя Фамилия" className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-accent transition-colors font-light" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Телефон</label>
          <input required type="tel" placeholder="+7 (___) ___-__-__" className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-accent transition-colors font-light" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Тип объекта</label>
          <select className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-accent transition-colors font-light appearance-none cursor-pointer">
            <option>Квартира</option>
            <option>Частный дом</option>
            <option>Коммерческое помещение</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Площадь (м2)</label>
          <input type="number" placeholder="80" className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-accent transition-colors font-light" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Комментарий</label>
          <textarea rows={4} placeholder="Опишите пожелания, сроки и исходные данные..." className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-accent transition-colors font-light resize-none" />
        </div>
        <div className="md:col-span-2 pt-8">
          <Button variant="accent" className="w-full md:w-auto" type="submit">Получить смету</Button>
          <p className="mt-6 text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed max-w-sm">
            Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
          </p>
        </div>
      </form>
    </div>
  );
};

export const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return <SuccessState title="Сообщение отправлено" />;

  return (
    <div className="bg-brand-primary p-8 md:p-16 border border-brand-border shadow-sm">
      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Имя</label>
          <input required type="text" placeholder="Имя Фамилия" className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-accent transition-colors font-light" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Телефон</label>
          <input required type="tel" placeholder="+7 (___) ___-__-__" className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-accent transition-colors font-light" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Удобный канал связи</label>
          <select className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-accent transition-colors font-light appearance-none cursor-pointer">
            <option>Telegram</option>
            <option>WhatsApp</option>
            <option>Звонок</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Тип объекта</label>
          <select className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-accent transition-colors font-light appearance-none cursor-pointer">
            <option>Квартира</option>
            <option>Частный дом</option>
            <option>Другое</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Площадь (м2)</label>
          <input type="number" placeholder="80" className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-accent transition-colors font-light" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Есть ли проект?</label>
          <select className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-accent transition-colors font-light appearance-none cursor-pointer">
            <option>Да, есть</option>
            <option>В процессе</option>
            <option>Нет</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Комментарий</label>
          <textarea rows={4} placeholder="Опишите задачу, текущий статус объекта и ваши вопросы..." className="w-full bg-transparent border-b border-brand-border py-4 focus:outline-none focus:border-brand-accent transition-colors font-light resize-none" />
        </div>
        <div className="md:col-span-2 pt-8">
          <Button variant="accent" className="w-full md:w-auto" type="submit">Отправить заявку</Button>
          <p className="mt-6 text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed max-w-sm">
            Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
          </p>
        </div>
      </form>
    </div>
  );
};
