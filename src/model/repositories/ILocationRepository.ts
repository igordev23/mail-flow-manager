// Model Layer - Location Repository Interface

import { BrazilianState, BrazilianCity } from '../entities/Location';

export interface ILocationRepository {
  getStates(): Promise<BrazilianState[]>;
  getCitiesByState(stateCode: string): Promise<BrazilianCity[]>;
}
