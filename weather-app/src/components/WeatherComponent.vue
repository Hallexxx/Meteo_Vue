<template>
  <div>
    <!-- Formulaire de recherche de la ville -->
    <form @submit.prevent="getWeather">
      <input v-model="city" type="text" placeholder="Recherchez votre ville" required />
      <button type="submit">Rechercher</button>
    </form>

    <!-- Affichage des informations météo actuelles -->
    <div v-if="weatherData" class="weather-info">
      <h2>{{ weatherData.name }}</h2>
      <p>Température: {{ weatherData.main.temp }} °C</p>
      <p>Pression: {{ weatherData.main.pressure }} hPa</p>
      <p>Vitesse du vent: {{ weatherData.wind.speed }} m/s</p>
      <p>Conditions: {{ weatherData.weather[0].description }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      city: '',
      weatherData: null,
      forecastData: null,
      apiKey: '6eb1180161eccb06843669dbee0f87b3', // Ton API OpenWeatherMap
    };
  },
  methods: {
    async getWeather() {
      try {
        // Requête pour récupérer les infos météo actuelles
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.apiKey}&units=metric`
        );
        this.weatherData = response.data;

        // Récupérer les prévisions météo à partir des coordonnées de la ville
        const { lat, lon } = this.weatherData.coord;
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
        );
        this.forecastData = forecastResponse.data.daily;

        // Émettre les données au parent
        this.$emit('weather-updated', this.weatherData, this.forecastData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données météo :', error);
      }
    }
  }
};
</script>

<style scoped>
.weather-info {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
}
</style>
