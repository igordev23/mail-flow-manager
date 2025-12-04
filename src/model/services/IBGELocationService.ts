import axios from 'axios';
import { BrazilianState, BrazilianCity } from '@/model/entities/Location';
import { ILocationRepository } from '@/model/repositories/ILocationRepository';

const BASE_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades';

export class IBGELocationService implements ILocationRepository {

  async getStates(): Promise<BrazilianState[]> {
    const response = await axios.get(`${BASE_URL}/estados?orderBy=nome`);

    return response.data.map((state: any) => ({
      code: state.sigla,
      name: state.nome,
    }));
  }

  async getCitiesByState(stateCode: string): Promise<BrazilianCity[]> {
    const response = await axios.get(`${BASE_URL}/estados/${stateCode}/municipios`);

    return response.data.map((city: any) => ({
      name: city.nome,
      stateCode: stateCode,
    }));
  }
}
