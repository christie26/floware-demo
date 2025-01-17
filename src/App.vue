<template>
  <div id="app">
    <div class="container">
      <div class="sector">
        <h2>Map</h2>
        <MapboxComponent :mapboxToken="mapboxToken" @fetchStationData="handleFetchStationData" />
      </div>

      <div class="sector">
        <h2>Station Chart</h2>
        <StationChart :stationChartData="stationChartData" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import MapboxComponent from './components/MapboxComponent.vue'
import StationChart from './components/StationChart.vue'
import {
  calculateAllStationData,
  calculateOneStationData,
  transformDataForChartJS,
} from './components/utils.ts'
import type { ChartDataset } from './types.ts'

export default {
  name: 'App',
  data() {
    return {
      mapboxToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
      seoulToken: import.meta.env.VITE_SEOUL_OPENDATA_KEY,
      stationList: [],
      usageDataByTime: [] as any[],
      stationChartData: {
        labels: [] as string[],
        datasets: [] as ChartDataset[],
      },
    }
  },
  components: {
    MapboxComponent,
    StationChart,
  },
  methods: {
    handleFetchStationData(properties: any) {
      const stationId = properties.id
      const district = properties.district

      const data = calculateOneStationData(this.usageDataByTime, stationId)
      console.log(data.countPerHour)
      this.stationChartData = transformDataForChartJS(data.countPerHour, 'Activity by Hour')
    },
    async loadData() {
      try {
        const fileNames = Array.from(
          { length: 24 },
          (_, i) => `usage_info_bytime_20240416_${i}.json`,
        )

        const filePromises = fileNames.map((fileName) =>
          fetch(`/data/${fileName}`).then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to load ${fileName}: ${res.statusText}`)
            }
            return res.json()
          }),
        )

        const data = await Promise.all(filePromises)

        this.usageDataByTime = data

        console.log('All data loaded:', this.usageDataByTime)
      } catch (error) {
        console.error('Error loading JSON files:', error)
      }
    },
    async loadStationList() {
      try {
        const response = await fetch(`/seoul_bike_stations.geojson`)
        const geoJsonData = await response.json()
        // console.log(geoJsonData)

        this.stationList = geoJsonData.features.map((feature: any) => feature.properties)

        console.log('Station data loaded:', this.stationList)
      } catch (error) {
        console.error('Error loading JSON files:', error)
      }

      calculateAllStationData(this.stationList, this.usageDataByTime)
    },
    async loadAll() {
      await this.loadData() // Wait for loadData to finish
      // this.loadStationList() // Then call loadStationList
    },
  },
  mounted() {
    this.loadAll()
  },
}
</script>

<style>
#app {
  display: flex;
  align-items: center;
  justify-content: center;
}
.container {
  display: flex;
  gap: 20px;
  padding: 20px;
  width: 90vw;
  height: 90vh;
}
.sector {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  width: 50%;
}
.sector > h2 {
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
