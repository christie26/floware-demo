<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script lang="ts">
import type { Properties } from '@/types'
import mapboxgl from 'mapbox-gl'

export default {
  name: 'MapboxComponent',
  props: ['mapboxToken'],
  emits: ['fetchStationData'],
  mounted() {
    mapboxgl.accessToken = this.mapboxToken

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [126.9778, 37.5665],
      zoom: 10,
    })

    map.addControl(new mapboxgl.NavigationControl())

    map.on('load', () => {
      map.addSource('bikeStations', {
        type: 'geojson',
        data: '../dataset/seoul_bike_stations.geojson',
      })

      map.addLayer({
        id: 'bike-stations',
        type: 'circle',
        source: 'bikeStations',
        paint: {
          'circle-color': [
            'match',
            ['get', 'status'], // Assuming 'status' is a property in your GeoJSON data
            'active',
            '#00FF00', // Green for active stations
            'inactive',
            '#FF0000', // Red for inactive stations
            '#5b64b4', // Default color
          ],
          'circle-radius': 6,
        },
      })

      map.on('click', 'bike-stations', (e) => {
        if (!e.features || e.features.length === 0) {
          console.warn('No features found at the clicked location.')
          return
        }
        const coordinates = e.features[0].geometry.coordinates.slice()
        const properties = e.features[0].properties

        // Ensure that if the map is zoomed out to a level where the popup is
        // near the left or right edge of the screen, it will be aligned properly.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }
        this.$emit('fetchStationData', properties)

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(
            `
        <h3>${properties.name}</h3>
        <p>${properties.address || 'No address available'}</p>
      `,
          )
          .addTo(map)
      })

      map.on('mouseenter', 'bike-stations', () => {
        map.getCanvas().style.cursor = 'pointer'
      })

      map.on('mouseleave', 'bike-stations', () => {
        map.getCanvas().style.cursor = ''
      })
    })
  },
}
</script>

<style>
#map {
  border: 2px solid #ccc;
  border-radius: 8px;
  width: 100%;
  height: 50vh;
}
</style>
