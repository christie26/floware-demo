<template>
  <div id="app">
    <div class="container">
      <div class="sector">
        <h2>Map</h2>
        <MapboxComponent :mapboxToken="mapboxToken" @fetchStationData="handleFetchStationData" />
      </div>

      <div class="sector">
        <h2>Station Chart</h2>
        <StationChart :chartData="chartData" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import MapboxComponent from './components/MapboxComponent.vue'
import StationChart from './components/StationChart.vue'
import { calculateStationData, transformDataForChartJS } from './components/utils.ts'

export default {
  name: 'App',
  data() {
    return {
      mapboxToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
      seoulToken: import.meta.env.VITE_SEOUL_OPENDATA_KEY,
      jsonData: [] as any[],
      chartData: null,
    }
  },
  components: {
    MapboxComponent,
    StationChart,
  },
  methods: {
    handleFetchStationData(properties: any) {
      const stationId = properties.id

      const data = calculateStationData(this.jsonData, stationId)
      console.log(data.countPerHour)
      this.chartData = transformDataForChartJS(data.countPerHour, 'Activity by Hour')
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

        this.jsonData = data

        console.log('All data loaded:', this.jsonData)
      } catch (error) {
        console.error('Error loading JSON files:', error)
      }
    },
  },
  mounted() {
    this.loadData()
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
