/**
 * FILTER PANEL COMPONENT
 * 
 * Collapsible filter panel with consistent styling
 * Each screen can provide custom filter content
 */

import { ReactNode } from 'react';
import { cn } from '../../ui/utils';
import { Button } from '../../ui/button';

interface FilterPanelProps {
  isOpen: boolean;
  onReset: () => void;
  onApply: () => void;
  children: ReactNode;
  className?: string;
}

export function FilterPanel({
  isOpen,
  onReset,
  onApply,
  children,
  className
}: FilterPanelProps) {
  if (!isOpen) return null;

  return (
    <div className={cn(
      "border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50",
      className
    )}>
      <div className="px-6 py-4">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-0.5">
            Filters
          </h3>
        </div>

        {/* Filter Content */}
        <div className="space-y-4 mb-4">
          {children}
        </div>

        {/* Filter Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-neutral-600 dark:text-neutral-400"
          >
            Reset Filter
          </Button>
          <Button
            size="sm"
            onClick={onApply}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

interface FilterFieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function FilterField({ label, children, className }: FilterFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
