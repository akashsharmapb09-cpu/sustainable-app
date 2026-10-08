import React from 'react';
import { cn } from '../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex border-b border-border gap-1 overflow-x-auto pb-px', className)} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition-colors duration-150 whitespace-nowrap select-none',
              isActive
                ? 'border-burnt text-foreground font-semibold'
                : 'border-transparent text-ink-muted hover:text-foreground hover:border-border'
            )}
          >
            {tab.icon && <span className="h-3.5 w-3.5">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'rounded-sm px-1.5 py-0.2 text-[10px] font-mono',
                  isActive ? 'bg-burnt/10 text-burnt' : 'bg-surface-muted text-ink-muted'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
