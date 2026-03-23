/**
 * FILTER DRAWER COMPONENT
 * 
 * A slide-in drawer panel from the right side for filtering data
 * Used across listing pages for consistent filter UI
 * 
 * DESIGN SPECS:
 * - Width: 480px fixed
 * - Position: Fixed right side, full height
 * - Animation: Smooth 300ms slide-in/out
 * - Overlay: Dark backdrop with click-to-close
 * - Structure: Header → Content → Footer
 */

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../ui/button';

export interface FilterDrawerProps {
  /** Controls drawer visibility */
  isOpen: boolean;
  
  /** Callback when drawer should close */
  onClose: () => void;
  
  /** Callback when Apply Filters is clicked */
  onApply: () => void;
  
  /** Callback when Reset Filters is clicked */
  onReset: () => void;
  
  /** Filter content to display in the drawer */
  children: ReactNode;
  
  /** Optional title (default: "Filters") */
  title?: string;
}

/**
 * FilterDrawer Component
 * 
 * Provides a consistent drawer UI for filters across listing pages
 */
export function FilterDrawer({
  isOpen,
  onClose,
  onApply,
  onReset,
  children,
  title = 'Filters'
}: FilterDrawerProps) {
  if (!isOpen) return null;

  const handleApply = () => {
    onApply();
    onClose();
  };

  return (
    <>
      {/* Overlay Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 dark:bg-black/70 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-[480px] bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="px-6 py-6 max-h-[calc(100%-140px)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-neutral-600 dark:text-neutral-400"
          >
            Reset Filters
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * FilterField Component
 * 
 * Provides consistent styling for filter fields inside the drawer
 */
export interface FilterFieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function FilterField({ label, children, className = '' }: FilterFieldProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
