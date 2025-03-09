import { BrazilChoroplethStateData } from '../dashboard/BrazilChoroplethMap'
import { StatePackage } from './StatePackagesTable'

// Map of state codes to full state names
const stateNames: Record<string, string> = {
  'AC': 'Acre',
  'AL': 'Alagoas',
  'AP': 'Amapá',
  'AM': 'Amazonas',
  'BA': 'Bahia',
  'CE': 'Ceará',
  'DF': 'Distrito Federal',
  'ES': 'Espírito Santo',
  'GO': 'Goiás',
  'MA': 'Maranhão',
  'MT': 'Mato Grosso',
  'MS': 'Mato Grosso do Sul',
  'MG': 'Minas Gerais',
  'PA': 'Pará',
  'PB': 'Paraíba',
  'PR': 'Paraná',
  'PE': 'Pernambuco',
  'PI': 'Piauí',
  'RJ': 'Rio de Janeiro',
  'RN': 'Rio Grande do Norte',
  'RS': 'Rio Grande do Sul',
  'RO': 'Rondônia',
  'RR': 'Roraima',
  'SC': 'Santa Catarina',
  'SP': 'São Paulo',
  'SE': 'Sergipe',
  'TO': 'Tocantins'
}

/**
 * Converts BrazilChoroplethStateData to an array of StatePackage objects
 * @param stateData The state data from the choropleth map
 * @returns An array of StatePackage objects for use in the table
 */
export const convertToStatePackages = (stateData: BrazilChoroplethStateData): StatePackage[] => {
  return Object.entries(stateData).map(([stateCode, packages]) => ({
    stateCode,
    stateName: stateNames[stateCode] || stateCode,
    packages,
    averageDays: 0
  }))
} 