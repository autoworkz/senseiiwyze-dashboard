'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface SearchParamsHandlerProps {
  onMessageParam: (message: string) => void;
}

export function SearchParamsHandler({ onMessageParam }: SearchParamsHandlerProps) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const messageParam = searchParams?.get('message');
    if (messageParam) {
      onMessageParam(messageParam);
    }
  }, [searchParams, onMessageParam]);
  
  return null;
}