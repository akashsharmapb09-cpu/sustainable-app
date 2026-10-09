import type { HTMLAttributes, ReactNode } from 'react';

type PremiumCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: 'article' | 'section' | 'div';
  eyebrow?: string;
};

export function PremiumCard({ children, as: Element = 'article', eyebrow, className, ...props }: PremiumCardProps) {
  return (
    <Element className={['premium-card', className].filter(Boolean).join(' ')} {...props}>
      {eyebrow ? <p className="taxonomy-label mb-4">{eyebrow}</p> : null}
      {children}
    </Element>
  );
}
