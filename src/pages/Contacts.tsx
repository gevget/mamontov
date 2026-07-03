import { Container, Section, Button } from '../components/Base';
import { Breadcrumbs } from '../components/Content';
import { motion } from 'motion/react';
import { CheckCircle2, Send, MessageCircle, MapPin } from 'lucide-react';
import { ContactForm } from '../components/LeadForm';
import { useModal } from '../context/ModalContext';
import { useSiteEditor } from '../context/SiteEditorContext';
import { defaultGlobalSettings } from '../lib/site-defaults';

export const Contacts = () => {
  const { openModal } = useModal();
  const { settings } = useSiteEditor();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40">
      <Container>
        <Breadcrumbs items={[{ name: 'Контакты' }]} />

        <div className="mb-40 grid grid-cols-1 items-end gap-20 lg:grid-cols-2">
          <div className="space-y-8">
            <h1 className="font-bold uppercase tracking-tighter leading-[0.85]" data-editor-size="display">Контакты</h1>
            <p className="max-w-xl font-light leading-relaxed text-brand-muted" data-editor-size="lead">
              Расскажите о квартире, доме или готовом проекте. Мы уточним детали, оценим задачу и предложим понятный следующий шаг.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-y-6 border-b border-brand-border pb-2 lg:border-none">
            {['Консультация по объекту', 'Предварительная оценка', 'Работа с проектами', 'Связь в мессенджерах'].map((marker) => (
              <div key={marker} className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-widest text-brand-text">
                <CheckCircle2 className="h-4 w-4 text-brand-accent" />
                {marker}
              </div>
            ))}
          </div>
        </div>

        <Section className="border-t border-brand-border py-20">
          <div className="grid grid-cols-1 gap-px border border-brand-border bg-brand-border md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-6 bg-brand-primary p-12">
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-brand-muted">Телефон</span>
              <div className="space-y-2">
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`} className="block text-xl font-bold transition-colors hover:text-brand-accent">{settings.phone}</a>
                <p className="text-[10px] uppercase tracking-widest text-brand-muted">{settings.workHours || defaultGlobalSettings.workHours}</p>
              </div>
            </div>
            <div className="space-y-6 bg-brand-primary p-12">
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-brand-muted">Мессенджеры</span>
              <div className="flex flex-col gap-4">
                <a href={settings.telegramUrl || defaultGlobalSettings.telegramUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-border transition-all group-hover:border-brand-accent group-hover:bg-brand-accent">
                    <Send className="h-3.5 w-3.5 group-hover:text-brand-dark" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Telegram</span>
                </a>
                <a href={settings.whatsappUrl || defaultGlobalSettings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-border transition-all group-hover:border-brand-accent group-hover:bg-brand-accent">
                    <MessageCircle className="h-3.5 w-3.5 group-hover:text-brand-dark" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">WhatsApp</span>
                </a>
              </div>
            </div>
            <div className="space-y-6 bg-brand-primary p-12">
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-brand-muted">Email</span>
              <div className="space-y-2">
                <a href={`mailto:${settings.email}`} className="block text-xl font-bold transition-colors hover:text-brand-accent">{settings.email}</a>
                <p className="text-[10px] uppercase tracking-widest text-brand-muted">Для предложений и проектов</p>
              </div>
            </div>
            <div className="space-y-6 bg-brand-primary p-12">
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-brand-muted">Офис</span>
              <div className="space-y-2">
                <p className="text-xl font-bold">Москва</p>
                <p className="text-[10px] uppercase tracking-widest leading-relaxed text-brand-muted">{settings.officeAddress}</p>
              </div>
            </div>
          </div>
        </Section>

        <Section className="border-t border-brand-border py-40">
          <div className="grid grid-cols-1 gap-20 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-5">
              <h2 className="font-bold uppercase tracking-tighter leading-none" data-editor-size="heading">Обсудим ваш объект</h2>
              <p className="font-light leading-relaxed text-brand-muted" data-editor-size="lead">
                Опишите задачу, площадь и формат ремонта. Если есть планировка или проект, укажите это в комментарии.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </Section>

        <Section className="border-t border-brand-border py-40">
          <div className="space-y-20">
            <h2 className="font-bold uppercase tracking-tighter" data-editor-size="heading">Что будет после заявки</h2>
            <div className="grid grid-cols-1 gap-px border border-brand-border bg-brand-border md:grid-cols-2 lg:grid-cols-4">
              {[
                ['Уточним задачу', 'Разберемся в типе объекта, площади, стадии и желаемом результате.'],
                ['Изучим материалы', 'Если есть проект или планировка, посмотрим состав работ и возможные вопросы.'],
                ['Дадим ориентир', 'Обсудим бюджет, сроки и удобный следующий шаг.'],
                ['Договоримся о замере', 'Если задача подходит, согласуем выезд или дополнительную консультацию.'],
              ].map(([title, desc], index) => (
                <div key={title} className="group space-y-8 bg-brand-primary p-12 transition-colors duration-500 hover:bg-brand-warm">
                  <div className="text-4xl font-bold text-brand-border transition-colors group-hover:text-brand-accent">{String(index + 1).padStart(2, '0')}</div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest leading-tight">{title}</h4>
                    <p className="text-[10px] uppercase tracking-widest leading-relaxed text-brand-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section className="border-t border-brand-border py-40">
          <div className="space-y-12">
            <h2 className="font-bold uppercase tracking-tighter" data-editor-size="heading">Локация</h2>
            <div className="flex aspect-[21/9] items-center justify-center border border-brand-border bg-brand-warm p-12 text-center">
              <div className="max-w-sm space-y-4">
                <MapPin className="mx-auto h-8 w-8 text-brand-accent" />
                <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-brand-muted">
                  Работаем на объектах Москвы и Московской области. Точный адрес встречи уточняем после первого контакта.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section className="pb-40">
          <div className="space-y-12 bg-brand-dark p-12 text-center text-brand-primary md:p-24">
            <div className="mx-auto max-w-2xl space-y-6">
              <h2 className="font-bold uppercase tracking-tighter leading-none" data-editor-size="heading">Начнем с короткого разговора</h2>
              <p className="font-light leading-relaxed text-brand-primary/60" data-editor-size="lead">
                Не обязательно заранее знать точный состав работ. Расскажите, что есть сейчас, и мы подскажем, как двигаться дальше.
              </p>
            </div>
            <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-dark" onClick={() => openModal('project')}>
              Обсудить проект
            </Button>
          </div>
        </Section>
      </Container>
    </motion.div>
  );
};
