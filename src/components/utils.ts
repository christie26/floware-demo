import { type ChartDataset, type UsageInfo } from '../types'

export function calculateOneStationData(usageDataByTime: any, stationId: number): any {
  const countPerHour: { [hour: string]: number } = {}

  usageDataByTime.forEach((data: [], index: number) => {
    const filteredData = data.filter((item: UsageInfo) => item.RENT_ID === stationId)
    countPerHour[index] = filteredData.length
  })

  return { countPerHour, stationId }
}
export function calculateAllStationData(stationList: any, usageDataByTime: any): any {
  const countPerHour: {
    [hour: string]: {
      [stationName: string]: { name: string; id: string; district: string; count: number }
    }
  } = {}

  usageDataByTime.forEach((data: any, hourIndex: number) => {
    const hour = String(hourIndex)
    countPerHour[hour] = countPerHour[hour] || {}

    stationList.forEach((station: any) => {
      const stationData = data.filter((d: any) => d.RENT_ID === station.id)
      const count = stationData.length

      countPerHour[hour][station.name] = {
        name: station.name,
        id: station.id,
        district: station.district,
        count: count,
      }
    })
  })
  console.log(countPerHour)
  return countPerHour
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
