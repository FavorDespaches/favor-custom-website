export type PrimaryColorConfig = {
  name?: string
  light?: string
  main: string
  dark?: string
}

// Primary color config object
const primaryColorConfig: PrimaryColorConfig[] = [
  {
    name: 'primary-1',
    light: '#6599c4',
    main: '#4080b1',
    dark: '#336a94'
  },
  {
    name: 'primary-2',
    light: '#A379FF',
    main: '#8C57FF',
    dark: '#7E4EE6'
  },
  {
    name: 'primary-3',
    light: '#4EB0B1',
    main: '#0D9394',
    dark: '#096B6C'
  },
  {
    name: 'primary-4',
    light: '#F0718D',
    main: '#EB3D63',
    dark: '#AC2D48'
  },
  {
    name: 'primary-5',
    light: '#FFC25A',
    main: '#FFAB1D',
    dark: '#BA7D15'
  },
  {
    name: 'primary-6',
    light: '#5CAFF1',
    main: '#2092EC',
    dark: '#176BAC'
  }
]

export default primaryColorConfig
