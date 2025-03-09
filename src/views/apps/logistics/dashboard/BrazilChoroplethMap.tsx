'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js'
import { ChoroplethController, ColorScale, GeoFeature, ProjectionScale } from 'chartjs-chart-geo'
import { useEffect, useRef, useState } from 'react'

// Import the StatePackagesTable and utility function
import StatePackagesTable from '../state-packages/StatePackagesTable'
import { convertToStatePackages } from '../state-packages/statePackageUtils'

// Register the required components
ChartJS.register(
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  ChoroplethController,
  GeoFeature,
  ColorScale,
  ProjectionScale
)

export interface BrazilChoroplethStateData {
  /**
   * The name of the state, followed by the number of packages
   * @example "SP": 21, "RJ": 37, "MG": 5, "ES": 7, etc.
   */
  [key: string]: number
}

// Mock data for testing
export const mockBrazilStateData: BrazilChoroplethStateData = {
  "SP": 850, // São Paulo
  "RJ": 720, // Rio de Janeiro
  "MG": 580, // Minas Gerais
  "BA": 450, // Bahia
  "RS": 380, // Rio Grande do Sul
  "PR": 320, // Paraná
  "PE": 280, // Pernambuco
  "CE": 250, // Ceará
  "PA": 220, // Pará
  "SC": 200, // Santa Catarina
  "MA": 180, // Maranhão
  "GO": 160, // Goiás
  "AM": 140, // Amazonas
  "ES": 120, // Espírito Santo
  "PB": 100, // Paraíba
  "RN": 90,  // Rio Grande do Norte
  "MT": 80,  // Mato Grosso
  "AL": 70,  // Alagoas
  "PI": 60,  // Piauí
  "DF": 50,  // Distrito Federal
  "MS": 40,  // Mato Grosso do Sul
  "SE": 30,  // Sergipe
  "RO": 25,  // Rondônia
  "TO": 20,  // Tocantins
  "AC": 15,  // Acre
  "AP": 10,  // Amapá
  "RR": 5    // Roraima
};

interface BrazilChoroplethMapProps {
  /**
   * Data for each Brazilian state showing the number of packages
   * If not provided, mock data will be used
   */
  brazilChoroplethStateData?: BrazilChoroplethStateData;
}

const BrazilChoroplethMap = ({ brazilChoroplethStateData = mockBrazilStateData }: BrazilChoroplethMapProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [chartInstance, setChartInstance] = useState<ChartJS | null>(null)
  const theme = useTheme()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Brazil GeoJSON data
        const response = await fetch('/geo-json/bra.json')
        const brazilData = await response.json()

        // Map GeoJSON features to data using the provided state data
        const stateData = brazilData.features.map((feature: any) => {
          // Get the state code from the feature properties (using postal code)
          // If postal is not available, try to extract from code_hasc (e.g., "BR.GO" -> "GO")
          let stateCode = feature.properties.postal;
          
          if (!stateCode && feature.properties.code_hasc) {
            // Extract state code from code_hasc (format: "BR.GO")
            const codeHascParts = feature.properties.code_hasc.split('.');
            if (codeHascParts.length > 1) {
              stateCode = codeHascParts[1];
            }
          }
          
          // If still no state code, try to use the abbrev property
          if (!stateCode && feature.properties.abbrev) {
            stateCode = feature.properties.abbrev;
          }
          
          // Look up the value in the provided data, default to 0 if not found
          const value = stateCode ? (brazilChoroplethStateData[stateCode] || 0) : 0;
          
          // Log missing state codes for debugging
          if (value === 0 && stateCode) {
            console.log(`No data found for state code: ${stateCode} (${feature.properties.name})`);
          }
          
          return {
            feature: feature,
            value: value
          }
        });

        // Log a sample feature and data mapping for debugging
        if (brazilData.features.length > 0) {
          const sampleFeature = brazilData.features[0];
          console.log('Sample feature properties:', sampleFeature.properties);
          console.log('Sample state code:', sampleFeature.properties.postal);
          console.log('Sample value from data:', brazilChoroplethStateData[sampleFeature.properties.postal] || 'Not found');
        }
        
        // Log the keys in the provided data
        console.log('Available state codes in provided data:', Object.keys(brazilChoroplethStateData));

        // Calculate min and max values for color scaling
        const values = stateData.map((d: any) => d.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        
        console.log(`Value range: ${minValue} to ${maxValue}`);

        if (chartRef.current) {
          // Destroy previous chart instance if it exists
          if (chartInstance) {
            chartInstance.destroy()
          }

          // Create new chart
          const newChartInstance = new ChartJS(chartRef.current, {
            type: "choropleth",
            data: {
              labels: stateData.map((d: any) => d.feature.properties.name),
              datasets: [
                {
                  label: "Shipment Volume",
                  data: stateData,
                  borderWidth: 1,
                  borderColor: theme.palette.divider,
                  hoverBackgroundColor: theme.palette.primary.main
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              layout: {
                padding: {
                  top: 10,
                  right: 10,
                  bottom: 10,
                  left: 10
                }
              },
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  callbacks: {
                    label: (context: any) => {
                      if (context.raw && context.raw.feature && context.raw.value !== undefined) {
                        const stateName = context.raw.feature.properties.name;
                        const value = context.raw.value;
                        return `${stateName}: ${value} pacotes`;
                      }
                      return "Nenhum dado disponível";
                    }
                  }
                },
                title: {
                  display: false
                }
              },
              scales: {
                projection: {
                  axis: "x",
                  projection: "mercator",
                  projectionOffset: [510, -140],
                  projectionScale: 8.7
                },
                color: {
                  axis: "x",
                  quantize: 8,
                  min: minValue,
                  max: maxValue,
                  legend: {
                    position: "bottom-left",
                    align: "right"
                  },
                  weight: 5,
                  ticks: {
                    color: theme.palette.text.primary
                  },
                  title: {
                    display: false,
                    text: "Package Volume",
                    align: "center",
                    color: theme.palette.text.primary,
                    font: {
                      weight: "bold"
                    },
                    padding: 10
                  }
                }
              }
            }
          });

          setChartInstance(newChartInstance)
        }
      } catch (error) {
        console.error('Error loading Brazil map data:', error)
      }
    }

    fetchData()

    // Cleanup function
    return () => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    }
  }, [theme, brazilChoroplethStateData])

  return (
    <Card className='bs-full'>
      <CardHeader 
        title="Distribuição Regional do Brasil" 
        subheader="Distribuição de envios por estado brasileiro"
        titleTypographyProps={{ variant: 'h5' }}
        subheaderTypographyProps={{ variant: 'body2' }}
      />
      <CardContent sx={{ height: '440px' }}>
        <Grid container spacing={0} >
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              height: '100%',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}> 
              <canvas ref={chartRef}></canvas>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} >
            <StatePackagesTable 
              stateData={convertToStatePackages(brazilChoroplethStateData)}
              title="State Package Details"
              subheader="Sortable list of packages by state"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default BrazilChoroplethMap 