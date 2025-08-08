'use client';

import { createContext, useContext, useCallback, ReactNode } from 'react';
// import { useCustomer as useAutumnCustomer } from 'autumn-js/react';

// Define our own interface since UseCustomerParams is not exported
interface UseCustomerParams {
  errorOnNotFound?: boolean;
  expand?: Array<'invoices' | 'rewards' | 'trials_used' | 'entities' | 'referrals' | 'payment_method'>;
  swrConfig?: any; // SWRConfiguration
}

// Create a context for the refetch function
interface AutumnCustomerContextType {
  refetchCustomer: () => Promise<void>;
}

const AutumnCustomerContext = createContext<AutumnCustomerContextType | null>(null);

// Provider component
export function AutumnCustomerProvider({ children }: { children: ReactNode }) {
  // const { refetch } = useAutumnCustomer();
  
  // Fallback implementation
  const refetch = useCallback(async () => {
    console.log('Autumn customer refetch disabled - Autumn integration disabled');
    return Promise.resolve();
  }, []);

  const refetchCustomer = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <AutumnCustomerContext.Provider value={{ refetchCustomer }}>
      {children}
    </AutumnCustomerContext.Provider>
  );
}

// Hook to use the customer data with global refetch
export function useCustomer(params?: UseCustomerParams) {
  // const autumnCustomer = useAutumnCustomer(params);
  
  // Fallback implementation
  const autumnCustomer = {
    data: null,
    isLoading: false,
    error: null,
    refetch: async () => {
      console.log('Autumn customer hook disabled - Autumn integration disabled');
      return Promise.resolve();
    },
    attach: async (params: any) => {
      console.log('Autumn attach disabled - Autumn integration disabled', params);
      return Promise.resolve();
    }
  };
  
  const context = useContext(AutumnCustomerContext);

  // Create a wrapped refetch that can be used globally
  const globalRefetch = useCallback(async () => {
    // Refetch the local instance
    const result = await autumnCustomer.refetch();
    
    // Also trigger any global refetch if in context
    if (context?.refetchCustomer) {
      await context.refetchCustomer();
    }
    
    return result;
  }, [autumnCustomer, context]);

  return {
    ...autumnCustomer,
    refetch: globalRefetch,
  };
}

// Hook to trigger a global customer data refresh from anywhere
export function useRefreshCustomer() {
  const context = useContext(AutumnCustomerContext);
  
  if (!context) {
    // Return a no-op function if not in provider
    return async () => {
      console.warn('useRefreshCustomer called outside of AutumnCustomerProvider');
    };
  }
  
  return context.refetchCustomer;
}