// Context Layer - Dependency Injection for Repositories

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useEmailsViewModel, UseEmailsViewModelReturn } from '@/viewmodel/useEmailsViewModel';
import { EmailRepositoryMemory } from '@/model/repositories/memory/EmailRepositoryMemory';
import { LocationRepositoryMemory } from '@/model/repositories/memory/LocationRepositoryMemory';
import { IEmailRepository, ILocationRepository } from '@/model/repositories';

// Repository instances (singleton pattern for memory implementation)
const emailRepository: IEmailRepository = new EmailRepositoryMemory();
const locationRepository: ILocationRepository = new LocationRepositoryMemory();

// Export repositories for components that need direct access (e.g., LocationSelect)
export { locationRepository };

const EmailContext = createContext<UseEmailsViewModelReturn | null>(null);

export function EmailProvider({ children }: { children: ReactNode }) {
  const viewModel = useEmailsViewModel(emailRepository, locationRepository);
  
  return (
    <EmailContext.Provider value={viewModel}>
      {children}
    </EmailContext.Provider>
  );
}

export function useEmails(): UseEmailsViewModelReturn {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmails must be used within an EmailProvider');
  }
  return context;
}
