// ViewModel Layer - Dashboard ViewModel

import { useMemo } from 'react';
import { Email, DashboardData } from '@/model/entities';
import { GetDashboardDataUseCase } from '@/model/usecases';

// State Type
export interface UseDashboardViewModelState {
  dashboardData: DashboardData;
  loading: boolean;
  error: string | null;
}

// Actions Type
export interface UseDashboardViewModelActions {}

// ViewModel Return Type
export interface UseDashboardViewModelReturn {
  state: UseDashboardViewModelState;
  actions: UseDashboardViewModelActions;
}

export function useDashboardViewModel(
  emails: Email[],
  loading: boolean,
  error: string | null
): UseDashboardViewModelReturn {
  const getDashboardDataUseCase = useMemo(() => new GetDashboardDataUseCase(), []);

  const dashboardData = useMemo(
    () => getDashboardDataUseCase.execute(emails),
    [emails, getDashboardDataUseCase]
  );

  return {
    state: {
      dashboardData,
      loading,
      error,
    },
    actions: {},
  };
}
