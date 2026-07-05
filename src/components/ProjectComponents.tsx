import { Clock3, Frame, MapPin, Ruler, ShieldCheck, Sparkles } from 'lucide-react';
import { Project } from '../types';

const projectMetaItems = [
  { key: 'area', label: 'Площадь', Icon: Ruler },
  { key: 'category', label: 'Тип объекта', Icon: Frame },
  { key: 'duration', label: 'Срок', Icon: Clock3 },
  { key: 'format', label: 'Формат', Icon: Sparkles },
  { key: 'location', label: 'Локация', Icon: MapPin },
  { key: 'status', label: 'Статус', Icon: ShieldCheck },
] as const;

export const ProjectMeta = ({ project }: { project: Project }) => (
  <div className="grid grid-cols-2 gap-8 border-y border-brand-border py-12 md:grid-cols-3 lg:grid-cols-6">
    {projectMetaItems.map(({ key, label, Icon }) => {
      const value = project[key as keyof Project];

      return (
        <div key={key} className="space-y-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-brand-secondary text-brand-support">
            <Icon className="h-4 w-4" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-brand-muted">{label}</span>
            <p className={`text-sm font-medium ${key === 'status' ? 'text-brand-accent' : ''}`}>{String(value ?? '')}</p>
          </div>
        </div>
      );
    })}
  </div>
);

export const ProjectGallery = ({ images }: { images: { label: string; image: string }[] }) => (
  <div className="space-y-24">
    {images.map((item, i) => (
      <div key={i} className="space-y-8">
        <div className="aspect-[16/9] overflow-hidden">
          <img src={item.image} alt={item.label} className="h-full w-full object-cover" />
        </div>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold uppercase tracking-widest">{item.label}</h4>
          <span className="text-[10px] uppercase tracking-widest text-brand-muted">
            {String(i + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    ))}
  </div>
);
