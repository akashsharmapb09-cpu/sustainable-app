import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../shared/lib/cn';

type PremiumCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: 'article' | 'section' | 'div';
  eyebrow?: string;
};

export function PremiumCard({ children, as: Element = 'article', eyebrow, className, ...props }: PremiumCardProps) {
  return (
    <Element className={cn('premium-card', className)} {...props}>
      {eyebrow ? <p className="taxonomy-label mb-4">{eyebrow}</p> : null}
      {children}
    </Element>
  );
}
