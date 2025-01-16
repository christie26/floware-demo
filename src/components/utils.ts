export function calculateStationData(jsonData: any, stationId: number): any {
  const countPerHour: { [hour: string]: number } = {}

  jsonData.forEach((data: [], index: number) => {
    const filteredData = data.filter((item) => item.RENT_ID === stationId)
    countPerHour[index] = filteredData.length
  })

  return { countPerHour, stationId }
}
export function transformDataForChartJS(
  rawData,
  label,
  backgroundColor = 'rgba(75, 192, 192, 0.2)',
  borderColor = 'rgba(75, 192, 192, 1)',
) {
  const labels = Object.keys(rawData).map(String) // Convert keys to strings for labels
  const data = Object.values(rawData) // Extract values for dataset

  return {
    labels: labels,
    datasets: [
      {
        label: label,
        data: data,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  }
}
