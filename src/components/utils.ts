import { type ChartDataset } from '../types'

export function calculateStationData(jsonData: any, stationId: number): any {
  const countPerHour: { [hour: string]: number } = {}

  jsonData.forEach((data: [], index: number) => {
    const filteredData = data.filter((item) => item.RENT_ID === stationId)
    countPerHour[index] = filteredData.length
  })

  return { countPerHour, stationId }
}
export function transformDataForChartJS(
  rawData: Record<string, number>,
  label: string,

  backgroundColor = 'rgba(85,89,180,0.2)',
  borderColor = 'rgba(85,89,180,1)',
) {
  const labels = Object.keys(rawData).map(String)
  const data = Object.values(rawData)

  const datasets: ChartDataset[] = [
    {
      label: label,
      data: data,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 1,
    },
  ]

  return {
    labels: labels,
    datasets: datasets,
  }
}
