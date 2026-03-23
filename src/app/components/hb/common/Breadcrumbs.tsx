/**
 * BREADCRUMBS COMPONENT
 * 
 * Displays navigation breadcrumbs
 * Pattern: Module name > Screen Name > Item Name (for detail screens)
 */

import { ChevronRight } from 'lucide-react';
import { cn } from '../../ui/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center gap-2 text-sm", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
          )}
          {index === items.length - 1 ? (
            <span className="text-neutral-900 dark:text-white font-medium">
              {item.label}
            </span>
          ) : (
            <span className="text-neutral-600 dark:text-neutral-400">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
