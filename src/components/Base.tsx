import { ReactNode, ButtonHTMLAttributes, MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';

export const Container = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
  <div className={`max-w-7xl mx-auto px-6 md:px-12 ${className}`}>
    {children}
  </div>
);

export const Section = ({ children, className = '', id }: { children: ReactNode, className?: string, id?: string }) => (
  <section id={id} className={`py-20 md:py-32 ${className}`}>
    {children}
  </section>
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'pill' | 'ghost' | 'outline' | 'accent';
  href?: string;
  to?: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  href,
  to,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center transition-all duration-300 font-bold text-[10px] uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-brand-dark text-brand-primary px-10 py-5 hover:bg-brand-accent hover:text-brand-dark',
    accent: 'bg-brand-accent text-brand-dark px-10 py-5 hover:bg-brand-accent-hover',
    secondary: 'border border-brand-border text-brand-text px-10 py-5 hover:bg-brand-warm',
    outline: 'border border-brand-border text-brand-text px-10 py-5 hover:bg-brand-dark hover:text-brand-primary',
    pill: 'bg-brand-warm text-brand-text px-8 py-3 rounded-full border border-brand-border hover:border-brand-accent transition-colors',
    ghost: 'text-brand-text hover:text-brand-accent transition-colors px-4 py-2'
  };

  const classes = `${baseStyles} ${variants[variant]} ${className}`;

  if (to) {
    return <Link to={to} className={classes}>{children}</Link>;
  }

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
    if (isExternal || href.startsWith('#')) {
      return (
        <a 
          href={href} 
          className={classes}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    }
    return <Link to={href} className={classes}>{children}</Link>;
  }

  return (
    <button 
      type={type} 
      className={classes} 
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
