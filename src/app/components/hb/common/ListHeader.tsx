/**
 * LIST HEADER COMPONENT
 * 
 * Consistent header for all list screens with:
 * - Left: Screen name and breadcrumbs
 * - Right: Search, Filters toggle, View switcher
 */

import { useState } from 'react';
import { Search, X, SlidersHorizontal, Grid3x3, List, Table, Plus } from 'lucide-react';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
import { cn } from '../../ui/utils';
import { Button } from '../../ui/button';

export type ViewMode = 'grid' | 'list' | 'table';

interface ListHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  className?: string;
  availableViews?: ViewMode[];
  onAddNew?: () => void;
  addNewLabel?: string;
}

export function ListHeader({
  title,
  breadcrumbs,
  viewMode,
  onViewModeChange,
  searchValue,
  onSearchChange,
  showFilters,
  onToggleFilters,
  className,
  availableViews = ['grid', 'list', 'table'],
  onAddNew,
  addNewLabel = 'Add New'
}: ListHeaderProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchToggle = () => {
    if (isSearchExpanded && searchValue) {
      // Don't collapse if there's a search value
      return;
    }
    setIsSearchExpanded(!isSearchExpanded);
  };

  const handleClearSearch = () => {
    onSearchChange('');
    setIsSearchExpanded(false);
  };

  return (
    <div className={cn("border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950", className)}>
      <div className="px-6 py-4">
        {/* Single Row: Left (Title + Breadcrumbs) and Right (All Controls) */}
        <div className="flex items-center justify-between gap-6">
          {/* Left Section: Title and Breadcrumbs */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
              {title}
            </h1>
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Right Section: All controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Collapsible Search */}
            <div className="flex items-center gap-2">
              {isSearchExpanded ? (
                <div className={cn(
                  "relative flex items-center border rounded-lg transition-all w-80",
                  isFocused 
                    ? "border-primary-500 ring-2 ring-primary-500/20" 
                    : "border-neutral-200 dark:border-neutral-800"
                )}>
                  <Search className="absolute left-3 w-4 h-4 text-neutral-400 dark:text-neutral-600" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoFocus
                    className="w-full pl-10 pr-10 py-2 bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 outline-none"
                  />
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 p-0.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <X className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
                  </button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSearchToggle}
                  className="h-9"
                >
                  <Search className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Filters Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFilters}
              className={cn(
                "h-9",
                showFilters && "bg-primary-50 dark:bg-primary-950/50 border-primary-200 dark:border-primary-800"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Filters'}
            </Button>

            {/* Add New Button */}
            {onAddNew && (
              <button
                onClick={onAddNew}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New</span>
              </button>
            )}

            {/* View Switcher */}
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-900 rounded-lg p-1">
              {availableViews.includes('grid') && (
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    viewMode === 'grid'
                      ? "bg-white dark:bg-neutral-800 text-primary-600 dark:text-primary-400 shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  )}
                  title="Grid View"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
              )}
              {availableViews.includes('list') && (
                <button
                  onClick={() => onViewModeChange('list')}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    viewMode === 'list'
                      ? "bg-white dark:bg-neutral-800 text-primary-600 dark:text-primary-400 shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  )}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              )}
              {availableViews.includes('table') && (
                <button
                  onClick={() => onViewModeChange('table')}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    viewMode === 'table'
                      ? "bg-white dark:bg-neutral-800 text-primary-600 dark:text-primary-400 shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  )}
                  title="Table View"
                >
                  <Table className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}