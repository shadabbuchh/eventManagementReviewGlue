import * as React from 'react';
import { cn } from '@/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 space-y-8 py-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Container };
