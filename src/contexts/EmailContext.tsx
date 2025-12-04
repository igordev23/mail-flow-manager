// Context Layer - Email Provider with Dependency Injection

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { IEmailRepository, ILocationRepository } from '@/model/repositories';
import { EmailRepositoryMemory, LocationRepositoryMemory } from '@/infrastructure/repositories';
import { useEmailsBaseViewModel, UseEmailsBaseViewModelReturn } from '@/viewmodel';

// Create repository instances (can be swapped for different implementations)
const emailRepository = new EmailRepositoryMemory();
const locationRepository = new LocationRepositoryMemory();

interface EmailContextType extends UseEmailsBaseViewModelReturn {
  emailRepository: IEmailRepository;
  locationRepository: ILocationRepository;
}

const EmailContext = createContext<EmailContextType | null>(null);

export function EmailProvider({ children }: { children: ReactNode }) {
  const baseViewModel = useEmailsBaseViewModel(emailRepository);

  const value = useMemo(
    () => ({
      ...baseViewModel,
      emailRepository,
      locationRepository,
    }),
    [baseViewModel]
  );

  return (
    <EmailContext.Provider value={value}>
      {children}
    </EmailContext.Provider>
  );
}

export function useEmailContext(): EmailContextType {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmailContext must be used within an EmailProvider');
  }
  return context;
}

// Export repositories for direct access when needed
export { emailRepository, locationRepository };
