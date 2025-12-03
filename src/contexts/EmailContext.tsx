import React, { createContext, useContext, ReactNode } from 'react';
import { useEmailsViewModel } from '@/viewmodels/useEmailsViewModel';

type EmailContextType = ReturnType<typeof useEmailsViewModel>;

const EmailContext = createContext<EmailContextType | null>(null);

export function EmailProvider({ children }: { children: ReactNode }) {
  const viewModel = useEmailsViewModel();
  
  return (
    <EmailContext.Provider value={viewModel}>
      {children}
    </EmailContext.Provider>
  );
}

export function useEmails() {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmails must be used within an EmailProvider');
  }
  return context;
}
