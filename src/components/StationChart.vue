<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
    <p>{{ jsonData }}</p>
  </div>
</template>

<script lang="ts">
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  name: 'StationChart',
  props: {
    jsonData: {
      type: Object,
      required: true,
    },
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        if (!this.jsonData) {
          // console.error('Invalid JSON data format. Please provide `labels` and `datasets`.')
          return
        }
        const chartData = this.transformDataForChartJS(this.jsonData, 'Activity by Hour')

        this.renderChart(chartData) // Re-render the chart when data changes
      },
    },
  },
  mounted() {
    this.renderChart()
  },
  methods: {
    renderChart(chartData) {
      // if (!this.jsonData) {
      //   console.error('Invalid JSON data format. Please provide `labels` and `datasets`.')
      //   return
      // }
      // const chartData = this.transformDataForChartJS(this.jsonData, 'Activity by Hour')
      // console.log('chartData', chartData)

      // const ctx = this.$refs.chartCanvas.getContext('2d')
      // const ctx = document.getElementById('chartCanvas')

      // console.log('ctx', ctx)
      new Chart(this.$refs.chartCanvas, {
        type: 'bar', // You can change this to 'line', 'pie', etc.
        data: {
          labels: chartData.labels,
          datasets: chartData.datasets.map((dataset) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor || 'rgba(75, 192, 192, 0.2)',
            borderColor: dataset.borderColor || 'rgba(75, 192, 192, 1)',
            borderWidth: dataset.borderWidth || 1,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      })
    },
    transformDataForChartJS(
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
    },
  },
}
</script>
