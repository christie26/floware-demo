export function calculateStationData(jsonData: any, stationId: number): any {
  const countPerHour: { [hour: string]: number } = {}

  jsonData.forEach((data: [], index: number) => {
    const filteredData = data.filter((item) => item.RENT_ID === stationId)
    countPerHour[index] = filteredData.length
  })

  return { countPerHour, stationId }
}
