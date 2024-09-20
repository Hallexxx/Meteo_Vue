<template>
  <div id="map"></div>
</template>

<script>
import { defineComponent, onMounted, ref, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Styles de Leaflet
import axios from 'axios';

export default defineComponent({
  name: 'MapComponent',
  setup(_, { emit }) {
    const map = ref(null);
    const apiKey = '6eb1180161eccb06843669dbee0f87b3'; // Ton API key

    // Fonction pour récupérer les prévisions météo
    const getForecast = async (lat, lon) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        return response.data.daily; // Données des prévisions
      } catch (error) {
        console.error('Erreur lors de la récupération des prévisions :', error);
        return null;
      }
    };

    onMounted(async () => {
      await nextTick();

      // Initialisation de la carte
      map.value = L.map('map').setView([48.8566, 2.3522], 13); // Centré initialement sur Paris

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.value);

      // Clic sur la carte pour obtenir les infos météo
      map.value.on('click', async (e) => {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;

        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
          );
          const weatherData = response.data;

          const forecastData = await getForecast(lat, lon);

          emit('weather-updated', weatherData, forecastData);
        } catch (error) {
          console.error('Erreur lors de la récupération des données météo :', error);
        }
      });
    });

    return { map };
  }
});
</script>

<style scoped>
#map {
  height: 400px;
  width: 100%;
}
</style>
