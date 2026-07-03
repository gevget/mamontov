import { Project } from '../types';

export const ProjectMeta = ({ project }: { project: Project }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 py-12 border-y border-brand-border">
    <div className="space-y-2">
      <span className="text-[10px] uppercase tracking-widest text-brand-muted">Площадь</span>
      <p className="text-sm font-medium">{project.area}</p>
    </div>
    <div className="space-y-2">
      <span className="text-[10px] uppercase tracking-widest text-brand-muted">Тип объекта</span>
      <p className="text-sm font-medium">{project.category}</p>
    </div>
    <div className="space-y-2">
      <span className="text-[10px] uppercase tracking-widest text-brand-muted">Срок</span>
      <p className="text-sm font-medium">{project.duration}</p>
    </div>
    <div className="space-y-2">
      <span className="text-[10px] uppercase tracking-widest text-brand-muted">Формат</span>
      <p className="text-sm font-medium">{project.format}</p>
    </div>
    <div className="space-y-2">
      <span className="text-[10px] uppercase tracking-widest text-brand-muted">Локация</span>
      <p className="text-sm font-medium">{project.location}</p>
    </div>
    <div className="space-y-2">
      <span className="text-[10px] uppercase tracking-widest text-brand-muted">Статус</span>
      <p className="text-sm font-medium text-brand-accent">{project.status}</p>
    </div>
  </div>
);

export const ProjectGallery = ({ images }: { images: { label: string; image: string }[] }) => (
  <div className="space-y-24">
    {images.map((item, i) => (
      <div key={i} className="space-y-8">
        <div className="aspect-[16/9] overflow-hidden">
          <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
        </div>
        <div className="flex justify-between items-center">
          <h4 className="text-sm uppercase tracking-widest font-bold">{item.label}</h4>
          <span className="text-[10px] text-brand-muted uppercase tracking-widest">
            {String(i + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    ))}
  </div>
);
