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
        data: '../public/seoul_bike_stations.geojson',
      })

      map.addSource('district', {
        type: 'geojson',
        data: '../public/seoul_district.geojson',
        generateId: true,
      })

      map.addLayer({
        id: 'district-base',
        type: 'fill',
        source: 'district',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'population'],
            50000,
            '#FFFFFF',
            100000,
            '#D1C1E0',
            150000,
            '#A18DC7',
            200000,
            '#7F68A4',
            250000,
            '#4C2E7A',
          ],
          'fill-opacity': 0.7,
        },
      })
      map.addLayer({
        id: 'district-outline',
        type: 'line',
        source: 'district',
        paint: {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#ffff00',
            '#5b64b4',
          ],
          'line-width': 2,
          'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.7, 0.3],
        },
      })
      map.addLayer({
        id: 'bike-stations',
        type: 'circle',
        source: 'bikeStations',
        paint: {
          'circle-color': '#5b64b4',
          'circle-radius': 4,
        },
      })
      map.on('click', 'bike-stations', (e) => {
        if (!e.features || e.features.length === 0) {
          console.warn('No features found at the clicked location.')
          return
        }
        const coordinates = e.features[0].geometry.coordinates.slice()
        const properties = e.features[0].properties

        // Ensure that if the map is zoomed out to a level where the popup is near the left or right edge of the screen, it will be aligned properly.
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

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      })
      map.on('mouseenter', 'district-base', function (e) {
        map.getCanvas().style.cursor = 'pointer'
        const formattedPopulation = new Intl.NumberFormat('de-DE').format(
          e.features[0].properties.population,
        )
        const popupContent = `
          <h3>${e.features[0].properties.SIG_ENG_NM}</h3>
          <p><strong>Population:</strong> ${formattedPopulation}</p>
        `
        popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map)
      })
      map.on('mouseleave', 'district-base', function () {
        map.getCanvas().style.cursor = ''

        popup.remove()
      })

      let hoveredPolygonId: string | null = null
      map.on('mousemove', 'district-outline', (e) => {
        if (e.features.length > 0) {
          if (hoveredPolygonId !== null) {
            map.setFeatureState({ source: 'district', id: hoveredPolygonId }, { hover: false })
          }
          hoveredPolygonId = e.features[0].id
          map.setFeatureState({ source: 'district', id: hoveredPolygonId }, { hover: true })
        }
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

<style scoped>
#map {
  border: 2px solid #ccc;
  border-radius: 8px;
  width: 100%;
  height: 80vh;
}
</style>
