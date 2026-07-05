import { Project, Service, Partner, Testimonial, TeamMember, FAQItem } from '../types';
import { ArrowUpRight, Plus, Minus, MapPin, Clock3, Sparkles, Ruler, Wrench, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FALLBACK_PROJECT_IMAGE } from '../lib/media';

const serviceFeatureIcons = [Ruler, Wrench, Sparkles, BadgeCheck];

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <Link to={`/projects/${project.id}`} className="group block overflow-hidden">
    <div className="relative aspect-[4/5] overflow-hidden mb-6">
      <img src={project.image || FALLBACK_PROJECT_IMAGE} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/10 transition-colors duration-500" />
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-brand-muted">{project.category} / {project.area}</span>
          <h3 className="text-xl md:text-2xl font-display font-medium group-hover:text-brand-accent transition-colors">{project.title}</h3>
        </div>
        <div className="w-10 h-10 border border-brand-border rounded-full flex items-center justify-center group-hover:bg-brand-dark group-hover:text-brand-primary transition-all duration-300">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-widest text-brand-muted font-semibold">
        <span className="inline-flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-brand-support" />
          {project.location}
        </span>
        <span className="inline-flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5 text-brand-support" />
          {project.duration}
        </span>
      </div>
    </div>
  </Link>
);

export const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
  <Link
    to={`/services/${service.slug}`}
    className="group block p-10 border border-brand-border hover:border-brand-accent transition-all duration-500 bg-white space-y-8 flex flex-col h-full"
  >
    {service.image && (
      <div className="aspect-video overflow-hidden -mx-10 -mt-10 mb-8">
        <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
    )}
    <div className="space-y-4">
      <h3 className="text-2xl font-display font-medium group-hover:text-brand-accent transition-colors">{service.title}</h3>
      <p className="text-brand-muted font-light leading-relaxed">{service.description}</p>
    </div>
    <div className="mt-auto pt-8 border-t border-brand-border/50 space-y-8">
      <ul className="space-y-3">
        {service.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-brand-text/70">
            {React.createElement(serviceFeatureIcons[i % serviceFeatureIcons.length], {
              className: 'w-3.5 h-3.5 text-brand-support',
            })}
            {feature}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold group-hover:gap-5 transition-all">
        <span>Подробнее</span>
        <ArrowUpRight className="w-4 h-4 text-brand-support" />
      </div>
    </div>
  </Link>
);

export const PartnerCard: React.FC<{ partner: Partner }> = ({ partner }) => (
  <Link
    to={`/partners/${partner.slug}`}
    className="group block p-10 border border-brand-border hover:border-brand-accent transition-all duration-500 bg-white space-y-8 flex flex-col h-full"
  >
    <div className="aspect-[4/5] overflow-hidden bg-brand-warm -mx-10 -mt-10 mb-8">
      <img
        src={partner.image}
        alt={partner.name}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-xl md:text-2xl font-display font-medium group-hover:text-brand-accent transition-colors">{partner.name}</h3>
        <ArrowUpRight className="w-4 h-4 text-brand-support" />
      </div>
      <p className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">{partner.specialization}</p>
      <p className="text-brand-muted font-light leading-relaxed line-clamp-3 pt-2 text-sm">{partner.description}</p>
      <div className="pt-8 mt-auto border-t border-brand-border/50 flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold group-hover:gap-5 transition-all">
        <span>Смотреть партнёра</span>
        <div className="w-8 h-[1px] bg-brand-border group-hover:w-12 group-hover:bg-brand-accent transition-all" />
      </div>
    </div>
  </Link>
);

export const AccordionItem: React.FC<{ item: FAQItem; isOpen: boolean; onClick: () => void }> = ({ item, isOpen, onClick }) => (
  <div className="border-b border-brand-border">
    <button className="w-full py-8 flex justify-between items-center text-left hover:text-brand-accent transition-colors group" onClick={onClick}>
      <h3 className="text-xs font-bold uppercase tracking-widest pr-8 group-hover:text-brand-text transition-colors">{item.question}</h3>
      <div className="flex-shrink-0 text-brand-support">{isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}</div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="pb-8 text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed max-w-3xl">{item.answer}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export const FAQAccordion: React.FC<{ items: FAQItem[] }> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-brand-border">
      {items.map((item, i) => (
        <AccordionItem key={item.id || i} item={item} isOpen={openIndex === i} onClick={() => setOpenIndex(openIndex === i ? null : i)} />
      ))}
    </div>
  );
};

export const TeamRoleCard: React.FC<{ member: TeamMember }> = ({ member }) => (
  <div className="group p-10 border border-brand-border hover:border-brand-accent transition-all duration-500 bg-white space-y-8 flex flex-col h-full">
    <div className="aspect-[4/5] overflow-hidden bg-brand-warm grayscale group-hover:grayscale-0 transition-all duration-700 -mx-10 -mt-10 mb-8">
      <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
    </div>
    <div className="space-y-4 flex-grow">
      <div className="space-y-1">
        <h3 className="text-xl md:text-2xl font-display font-medium group-hover:text-brand-accent transition-colors">{member.name}</h3>
        <p className="text-[10px] uppercase tracking-widest text-brand-support font-bold">{member.role}</p>
      </div>
      <p className="text-sm text-brand-muted font-light leading-relaxed">{member.description}</p>
    </div>
    <div className="pt-8 border-t border-brand-border/50">
      <p className="text-[8px] uppercase tracking-widest font-bold text-brand-muted mb-2">Ответственность:</p>
      <p className="text-[10px] uppercase tracking-widest font-bold">{member.responsibility}</p>
    </div>
  </div>
);

export const Breadcrumbs: React.FC<{ items: { name: string; href?: string }[] }> = ({ items }) => (
  <nav className="flex items-center gap-3 text-[10px] uppercase tracking-widest mb-8">
    <Link to="/" className="text-brand-muted hover:text-brand-text">
      Главная
    </Link>
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-3">
        <span className="text-brand-border">/</span>
        {item.href ? (
          <Link to={item.href} className="text-brand-muted hover:text-brand-text">
            {item.name}
          </Link>
        ) : (
          <span className="text-brand-text">{item.name}</span>
        )}
      </span>
    ))}
  </nav>
);

export const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <div className="p-12 border border-brand-border bg-brand-primary space-y-12 h-full flex flex-col hover:border-brand-accent transition-colors">
    <div className="flex gap-1">
      {[...Array(testimonial.rating)].map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 bg-brand-support rounded-full" />
      ))}
    </div>
    <p className="text-xl md:text-2xl font-light leading-relaxed flex-grow italic">"{testimonial.content}"</p>
    <div className="flex items-center gap-6 pt-12 border-t border-brand-border">
      {testimonial.image && (
        <div className="w-16 h-16 rounded-full overflow-hidden grayscale shrink-0 border border-brand-border">
          <img src={testimonial.image} alt={testimonial.author} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="space-y-1">
        <h4 className="text-sm font-bold uppercase tracking-widest">{testimonial.author}</h4>
        <div className="flex gap-3 text-[8px] uppercase tracking-widest text-brand-muted font-bold">
          <span>{testimonial.role}</span>
          {testimonial.objectType && (
            <>
              <span className="text-brand-border">/</span>
              <span>{testimonial.objectType}</span>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);
