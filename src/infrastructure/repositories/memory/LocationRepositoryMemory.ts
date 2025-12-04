// Infrastructure Layer - Location Repository Memory Implementation

import { BrazilianState, BrazilianCity } from '@/model/entities';
import { ILocationRepository } from '@/model/repositories';

const brazilianStates: BrazilianState[] = [
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'BA', name: 'Bahia' },
  { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' },
];

const citiesByState: Record<string, BrazilianCity[]> = {
  PI: [
    { name: 'Teresina', stateCode: 'PI' },
    { name: 'Parnaíba', stateCode: 'PI' },
    { name: 'Picos', stateCode: 'PI' },
    { name: 'Piripiri', stateCode: 'PI' },
    { name: 'Floriano', stateCode: 'PI' },
    { name: 'Campo Maior', stateCode: 'PI' },
    { name: 'Barras', stateCode: 'PI' },
    { name: 'União', stateCode: 'PI' },
    { name: 'Altos', stateCode: 'PI' },
    { name: 'José de Freitas', stateCode: 'PI' },
  ],
  CE: [
    { name: 'Fortaleza', stateCode: 'CE' },
    { name: 'Caucaia', stateCode: 'CE' },
    { name: 'Juazeiro do Norte', stateCode: 'CE' },
    { name: 'Maracanaú', stateCode: 'CE' },
    { name: 'Sobral', stateCode: 'CE' },
    { name: 'Crato', stateCode: 'CE' },
    { name: 'Itapipoca', stateCode: 'CE' },
    { name: 'Maranguape', stateCode: 'CE' },
    { name: 'Iguatu', stateCode: 'CE' },
    { name: 'Quixadá', stateCode: 'CE' },
  ],
  MA: [
    { name: 'São Luís', stateCode: 'MA' },
    { name: 'Imperatriz', stateCode: 'MA' },
    { name: 'São José de Ribamar', stateCode: 'MA' },
    { name: 'Timon', stateCode: 'MA' },
    { name: 'Caxias', stateCode: 'MA' },
    { name: 'Codó', stateCode: 'MA' },
    { name: 'Paço do Lumiar', stateCode: 'MA' },
    { name: 'Açailândia', stateCode: 'MA' },
    { name: 'Bacabal', stateCode: 'MA' },
    { name: 'Balsas', stateCode: 'MA' },
  ],
  SP: [
    { name: 'São Paulo', stateCode: 'SP' },
    { name: 'Guarulhos', stateCode: 'SP' },
    { name: 'Campinas', stateCode: 'SP' },
    { name: 'São Bernardo do Campo', stateCode: 'SP' },
    { name: 'Santo André', stateCode: 'SP' },
    { name: 'Osasco', stateCode: 'SP' },
    { name: 'Ribeirão Preto', stateCode: 'SP' },
    { name: 'Sorocaba', stateCode: 'SP' },
    { name: 'Santos', stateCode: 'SP' },
    { name: 'São José dos Campos', stateCode: 'SP' },
  ],
  RJ: [
    { name: 'Rio de Janeiro', stateCode: 'RJ' },
    { name: 'São Gonçalo', stateCode: 'RJ' },
    { name: 'Duque de Caxias', stateCode: 'RJ' },
    { name: 'Nova Iguaçu', stateCode: 'RJ' },
    { name: 'Niterói', stateCode: 'RJ' },
    { name: 'Belford Roxo', stateCode: 'RJ' },
    { name: 'Campos dos Goytacazes', stateCode: 'RJ' },
    { name: 'São João de Meriti', stateCode: 'RJ' },
    { name: 'Petrópolis', stateCode: 'RJ' },
    { name: 'Volta Redonda', stateCode: 'RJ' },
  ],
};

export class LocationRepositoryMemory implements ILocationRepository {
  async getStates(): Promise<BrazilianState[]> {
    return [...brazilianStates];
  }

  async getCitiesByState(stateCode: string): Promise<BrazilianCity[]> {
    return citiesByState[stateCode] || [];
  }
}
