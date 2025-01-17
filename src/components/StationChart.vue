<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Chart, registerables } from 'chart.js'
import { ChartData } from '../types'
Chart.register(...registerables)

export default {
  name: 'StationChart',
  props: {
    stationChartData: {
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
    stationChartData: {
      handler() {
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

      if (!this.stationChartData) {
        console.warn('No stationChartData provided!')
        return
      }

      const canvas = this.$refs.chartCanvas as HTMLCanvasElement
      if (!canvas) {
        console.error('Canvas element is not available!')
        return
      }

      const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
      if (!ctx) {
        console.error('Failed to get canvas context!')
        return
      }
      console.log('ctx1', ctx)
      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.stationChartData.labels,
          datasets: this.stationChartData.datasets.map((dataset: any) => ({
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
      console.log('ctx2', ctx)
    },
  },
}
</script>
