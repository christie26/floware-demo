<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  name: 'StationChart',
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chartInstance: null as Chart | null,
    }
  },
  watch: {
    chartData: {
      handler() {
        console.log(this.chartData)
        this.renderChart()
      },
      deep: true,
    },
  },
  mounted() {
    this.renderChart()
  },
  methods: {
    renderChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy()
      }

      if (!this.chartData) {
        console.error('No chartData provided!')
        return
      }

      const ctx = (this.$refs.chartCanvas as HTMLCanvasElement).getContext('2d')
      if (!ctx) {
        console.error('Failed to get canvas context!')
        return
      }

      this.chartInstance = new Chart(ctx, {
        type: 'bar', // Change this to 'line', 'pie', etc., as needed
        data: {
          labels: this.chartData.labels,
          datasets: this.chartData.datasets.map((dataset: any) => ({
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
  },
}
</script>
