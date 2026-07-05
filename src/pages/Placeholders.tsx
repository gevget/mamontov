import { Container, Section } from '../components/Base';
import { Breadcrumbs } from '../components/Content';
import { ReactNode } from 'react';
import { motion } from 'motion/react';

export const PageLayout = ({ title, subtitle, children, breadcrumbs = [] }: { 
  title: string, 
  subtitle?: string, 
  children: ReactNode,
  breadcrumbs?: { name: string, href?: string }[]
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="pt-40"
  >
    <Container>
      <Breadcrumbs items={breadcrumbs} />
      <div className="mb-20 max-w-5xl">
        <h1 className="page-hero-title mb-8 font-bold uppercase tracking-tighter">{title}</h1>
        {subtitle && <p className="text-xl text-brand-muted font-light leading-relaxed">{subtitle}</p>}
      </div>
    </Container>
    {children}
  </motion.div>
);
