import * as React from 'react';
import { cn } from '@/utils';
import './grid.css';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Content to be rendered in the grid
   */
  children: React.ReactNode;
  /**
   * Custom gap between grid items. Defaults to 'gap-6'
   */
  gap?:
    | 'gap-1'
    | 'gap-2'
    | 'gap-3'
    | 'gap-4'
    | 'gap-5'
    | 'gap-6'
    | 'gap-8'
    | 'gap-10'
    | 'gap-12';
  /**
   * Additional CSS classes to apply
   */
  className?: string;
  /**
   * Minimum column width in pixels. Defaults to 280px for cards
   */
  minColumnWidth?: number;
}

/**
 * Grid Component - CSS-Native Responsive Grid System
 *
 * Uses CSS Container Queries and grid-auto-columns for truly responsive layouts:
 * - Automatically adjusts columns based on available space and item min-width
 * - No JavaScript breakpoints - pure CSS responsiveness
 * - Intelligently handles nested grids with reduced column counts
 * - Uses CSS custom properties for dynamic configuration
 *
 * Key Features:
 * - CSS `repeat(auto-fit, minmax())` for automatic column sizing
 * - Container queries for different behaviors in narrow vs wide containers
 * - Nested grid detection for appropriate column reduction
 * - Smooth transitions between column counts
 *
 * @example
 * ```tsx
 * // Basic usage - automatically sizes columns based on content
 * <Grid>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 * </Grid>
 *
 * // Custom minimum column width and max columns
 * <Grid minColumnWidth={320} maxColumns={3}>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 * </Grid>
 * ```
 */
function Grid({
  children,
  gap = 'gap-6',
  className,
  minColumnWidth = 280,
  ...props
}: GridProps) {
  if (!gap.startsWith('gap-')) {
    gap = `gap-6`;
  }
  const gapValue = gap.replace('gap-', '');

  return (
    <div
      data-slot="grid"
      className={cn(
        'grid w-full',
        'grid-auto-responsive',
        'grid-auto-fit',
        'grid-smooth-transition',
        gap,
        '@container',
        className
      )}
      style={
        {
          // CSS custom properties for dynamic grid behavior
          '--grid-min-column-width': `${minColumnWidth}px`,
          '--grid-gap': `${Number(gapValue) * 0.25}rem`,
        } as React.CSSProperties & Record<string, string>
      }
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * GridItem Component - Optional wrapper for grid children
 *
 * Provides consistent styling and behavior for Grid children.
 * While not required, it can help with consistent spacing and alignment.
 *
 * @example
 * ```tsx
 * <Grid>
 *   <GridItem>
 *     <Card>Content</Card>
 *   </GridItem>
 *   <GridItem>
 *     <Card>Content</Card>
 *   </GridItem>
 * </Grid>
 * ```
 */
function GridItem({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="grid-item"
      className={cn(
        'flex flex-col',
        'h-full', // Take full height of grid cell
        'grid-item-responsive',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Grid, GridItem, type GridProps };
