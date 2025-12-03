// Model Layer - In-Memory Location Repository Implementation

import { BrazilianState, BrazilianCity } from '../../entities/Location';
import { ILocationRepository } from '../ILocationRepository';

const states: BrazilianState[] = [
  { code: 'PI', name: 'Piauí' },
  { code: 'CE', name: 'Ceará' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'BA', name: 'Bahia' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'PR', name: 'Paraná' },
];

const cities: BrazilianCity[] = [
  // Piauí
  { name: 'Teresina', stateCode: 'PI' },
  { name: 'Piripiri', stateCode: 'PI' },
  { name: 'Parnaíba', stateCode: 'PI' },
  { name: 'Picos', stateCode: 'PI' },
  // Ceará
  { name: 'Fortaleza', stateCode: 'CE' },
  { name: 'Sobral', stateCode: 'CE' },
  { name: 'Juazeiro do Norte', stateCode: 'CE' },
  { name: 'Crato', stateCode: 'CE' },
  // Maranhão
  { name: 'São Luís', stateCode: 'MA' },
  { name: 'Imperatriz', stateCode: 'MA' },
  { name: 'Caxias', stateCode: 'MA' },
  // São Paulo
  { name: 'São Paulo', stateCode: 'SP' },
  { name: 'Campinas', stateCode: 'SP' },
  { name: 'Santos', stateCode: 'SP' },
  // Rio de Janeiro
  { name: 'Rio de Janeiro', stateCode: 'RJ' },
  { name: 'Niterói', stateCode: 'RJ' },
  { name: 'Petrópolis', stateCode: 'RJ' },
  // Bahia
  { name: 'Salvador', stateCode: 'BA' },
  { name: 'Feira de Santana', stateCode: 'BA' },
  // Pernambuco
  { name: 'Recife', stateCode: 'PE' },
  { name: 'Olinda', stateCode: 'PE' },
  // Minas Gerais
  { name: 'Belo Horizonte', stateCode: 'MG' },
  { name: 'Uberlândia', stateCode: 'MG' },
  // Rio Grande do Sul
  { name: 'Porto Alegre', stateCode: 'RS' },
  { name: 'Caxias do Sul', stateCode: 'RS' },
  // Paraná
  { name: 'Curitiba', stateCode: 'PR' },
  { name: 'Londrina', stateCode: 'PR' },
];

export class LocationRepositoryMemory implements ILocationRepository {
  async getStates(): Promise<BrazilianState[]> {
    return [...states];
  }

  async getCitiesByState(stateCode: string): Promise<BrazilianCity[]> {
    return cities.filter(c => c.stateCode === stateCode);
  }
}
