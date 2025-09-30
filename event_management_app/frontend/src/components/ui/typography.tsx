import * as React from 'react';
import { cn } from '@/utils';

// Helper function to get truncation classes
const getTruncationClasses = (truncate?: boolean | number | 'wrap') => {
  if (truncate === true) {
    return 'truncate';
  }
  if (typeof truncate === 'number' && truncate > 0) {
    return `line-clamp-${Math.min(truncate, 6)}`;
  }
  return '';
};

// Typography Props Types
interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  truncate?: boolean | number | 'wrap';
}

interface HeadingProps extends TypographyProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

// H1 - Main Heading
const H1 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, truncate = true, ...props }, ref) => {
    return (
      <h1
        ref={ref}
        className={cn(
          'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance',
          getTruncationClasses(truncate),
          className
        )}
        {...props}
      >
        {children}
      </h1>
    );
  }
);
H1.displayName = 'H1';

// H2 - Section Heading
const H2 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, truncate, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn(
          'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
          getTruncationClasses(truncate),
          className
        )}
        {...props}
      >
        {children}
      </h2>
    );
  }
);
H2.displayName = 'H2';

// H3 - Subsection Heading
const H3 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, truncate, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          'scroll-m-20 text-2xl font-semibold tracking-tight',
          getTruncationClasses(truncate),
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);
H3.displayName = 'H3';

// H4 - Small Heading
const H4 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, truncate, ...props }, ref) => {
    return (
      <h4
        ref={ref}
        className={cn(
          'scroll-m-20 text-xl font-semibold tracking-tight',
          getTruncationClasses(truncate),
          className
        )}
        {...props}
      >
        {children}
      </h4>
    );
  }
);
H4.displayName = 'H4';

// Paragraph
const P = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, children, truncate, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'leading-7 [&:not(:first-child)]:mt-3',
          getTruncationClasses(truncate),
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);
P.displayName = 'P';

// Lead Text - Larger introductory paragraph
const Lead = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, children, truncate, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'text-xl text-muted-foreground',
          getTruncationClasses(truncate),
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);
Lead.displayName = 'Lead';

// Large Text
const Large = React.forwardRef<HTMLDivElement, TypographyProps>(
  ({ className, children, truncate, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'text-lg font-semibold',
          getTruncationClasses(truncate),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Large.displayName = 'Large';

// Small Text
const Small = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, children, truncate, ...props }, ref) => {
    return (
      <small
        ref={ref}
        className={cn(
          'text-sm font-medium leading-none',
          getTruncationClasses(truncate),
          className
        )}
        {...props}
      >
        {children}
      </small>
    );
  }
);
Small.displayName = 'Small';

// Muted Text
const Muted = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, children, truncate, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'text-sm text-muted-foreground',
          getTruncationClasses(truncate),
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);
Muted.displayName = 'Muted';

// Blockquote
const Blockquote = React.forwardRef<HTMLQuoteElement, TypographyProps>(
  ({ className, children, truncate, ...props }, ref) => {
    return (
      <blockquote
        ref={ref}
        className={cn(
          'mt-6 border-l-2 pl-6 italic',
          getTruncationClasses(truncate),
          className
        )}
        {...props}
      >
        {children}
      </blockquote>
    );
  }
);
Blockquote.displayName = 'Blockquote';

// Inline Code
const InlineCode = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, children, truncate, ...props }, ref) => {
    return (
      <code
        ref={ref}
        className={cn(
          'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
          getTruncationClasses(truncate),
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  }
);
InlineCode.displayName = 'InlineCode';

// List (Unordered)
const List = React.forwardRef<HTMLUListElement, TypographyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}
        {...props}
      >
        {children}
      </ul>
    );
  }
);
List.displayName = 'List';

// Ordered List
const OrderedList = React.forwardRef<HTMLOListElement, TypographyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <ol
        ref={ref}
        className={cn('my-6 ml-6 list-decimal [&>li]:mt-2', className)}
        {...props}
      >
        {children}
      </ol>
    );
  }
);
OrderedList.displayName = 'OrderedList';

// List Item
const ListItem = React.forwardRef<HTMLLIElement, TypographyProps>(
  ({ className, children, truncate, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn('mt-2', getTruncationClasses(truncate), className)}
        {...props}
      >
        {children}
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';

// Table Row
const TypographyTableRow = React.forwardRef<
  HTMLTableRowElement,
  TypographyProps
>(({ className, children, ...props }, ref) => {
  return (
    <tr
      ref={ref}
      className={cn(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
});
TypographyTableRow.displayName = 'TypographyTableRow';

// Table Header Cell
const TypographyTableHead = React.forwardRef<
  HTMLTableCellElement,
  TypographyProps
>(({ className, children, ...props }, ref) => {
  return (
    <th
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
});
TypographyTableHead.displayName = 'TypographyTableHead';

// Table Cell
const TypographyTableCell = React.forwardRef<
  HTMLTableCellElement,
  TypographyProps
>(({ className, children, ...props }, ref) => {
  return (
    <td
      ref={ref}
      className={cn(
        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
});
TypographyTableCell.displayName = 'TypographyTableCell';

export {
  H1,
  H2,
  H3,
  H4,
  P,
  Lead,
  Large,
  Small,
  Muted,
  Blockquote,
  InlineCode,
  List,
  OrderedList,
  ListItem,
  TypographyTableRow,
  TypographyTableHead,
  TypographyTableCell,
  type TypographyProps,
  type HeadingProps,
};

export const Typography = {
  H1,
  H2,
  H3,
  H4,
  P,
  Lead,
  Large,
  Small,
  Muted,
  Blockquote,
  InlineCode,
  List,
  OrderedList,
  ListItem,
  TypographyTableRow,
  TypographyTableHead,
  TypographyTableCell,
};
