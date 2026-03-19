'use client';

import { ReactNode } from 'react';
import { SuccessProvider } from '@/hooks/useSuccess';

interface RootLayoutClientProps {
  children: ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  return <SuccessProvider>{children}</SuccessProvider>;
}
