<template>
  <div v-if="weatherData" class="weather-container">
    <!-- Météo actuelle -->
    <h2>{{ weatherData.name }}</h2>
    <p>Température : {{ weatherData.main.temp }} °C</p>
    <p>Pression : {{ weatherData.main.pressure }} hPa</p>
    <p>Vent : {{ weatherData.wind.speed }} m/s</p>
    <p>Conditions : {{ weatherData.weather[0].description }}</p>

    <!-- Prévisions (si forecastData est disponible) -->
    <div v-if="forecastData && forecastData.length">
      <h3>Prévision pour {{ selectedDayLabel }}</h3>
      <p v-if="selectedForecast">
        Température max : {{ selectedForecast.temp.max }} °C<br />
        Température min : {{ selectedForecast.temp.min }} °C<br />
        Conditions : {{ selectedForecast.weather[0].description }}
      </p>
      <p v-else>Pas de données pour ce jour.</p>

      <!-- Affichage selon la période choisie (matin, après-midi, soirée) -->
      <div v-if="selectedPeriod">
        <hr />
        <p><strong>Période :</strong> {{ selectedPeriodText }}</p>
        <p>
          Température :
          {{ selectedForecast ? getPeriodTemperature(selectedForecast.temp, selectedPeriod) : 'N/A' }}
          °C
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WeatherDisplay",
  props: {
    weatherData: {
      type: Object,
      default: null
    },
    forecastData: {
      type: Array,
      default: () => []
    },
    selectedDay: {
      type: Number,
      default: 0
    },
    selectedPeriod: {
      type: String,
      default: null // "morning", "afternoon" ou "evening"
    }
  },
  computed: {
    selectedForecast() {
      // Renvoie la prévision du jour sélectionné
      if (!this.forecastData || !this.forecastData.length) return null;
      return this.forecastData[this.selectedDay] || null;
    },
    selectedDayLabel() {
      switch (this.selectedDay) {
        case 0:
          return "Aujourd'hui";
        case 1:
          return "Demain";
        default:
          return `J+${this.selectedDay}`;
      }
    },
    selectedPeriodText() {
      switch (this.selectedPeriod) {
        case "morning":
          return "Matin";
        case "afternoon":
          return "Après-midi";
        case "evening":
          return "Soirée";
        default:
          return "";
      }
    }
  },
  methods: {
    /**
     * Récupère la température selon la période de la journée.
     * L’API OneCall propose souvent : temp.morn, temp.day, temp.eve, temp.night
     */
    getPeriodTemperature(tempObj, period) {
      switch (period) {
        case "morning":
          return tempObj.morn;
        case "afternoon":
          return tempObj.day;
        case "evening":
          return tempObj.eve;
        default:
          return null;
      }
    }
  }
};
</script>

<style scoped>
.weather-container {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
}
</style>
