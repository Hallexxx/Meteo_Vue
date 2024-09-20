<template>
  <div id="app">
    <header>
      <h1><a href="#" class="logo">Météo</a></h1>
    </header>

    <main>
      <!-- Recherche de la ville -->
      <div class="search-bar">
        <WeatherComponent @weather-updated="updateWeather" />
      </div>

      <!-- Carte -->
      <div class="map-container">
        <MapComponent @weather-updated="updateWeather" />
      </div>

      <!-- Affichage des prévisions -->
      <div v-if="weatherData" id="weather-container-container">
        <h2>{{ weatherData.name }}</h2>
        <p>Température: {{ weatherData.main.temp }} °C</p>
        <p>Pression: {{ weatherData.main.pressure }} hPa</p>
        <p>Vitesse du vent: {{ weatherData.wind.speed }} m/s</p>
        <p>Conditions: {{ weatherData.weather[0].description }}</p>

        <div class="forecast-bar">
          <button @click="selectDay(0)" class="forecast-btn" :class="{ active: selectedDay === 0 }">Aujourd'hui</button>
          <button @click="selectDay(1)" class="forecast-btn" :class="{ active: selectedDay === 1 }">Demain</button>
          <button @click="selectDay(2)" class="forecast-btn" :class="{ active: selectedDay === 2 }">J+2</button>
          <button @click="selectDay(3)" class="forecast-btn" :class="{ active: selectedDay === 3 }">J+3</button>
          <button @click="selectDay(4)" class="forecast-btn" :class="{ active: selectedDay === 4 }">J+4</button>
        </div>

        <!-- Affichage des prévisions météo -->
        <div v-if="filteredForecastData.length">
          <div v-for="(day, index) in filteredForecastData" :key="index">
            <h3>J+{{ selectedDay }} - {{ new Date(day.dt * 1000).toLocaleDateString() }}</h3>
            <p>Température max: {{ day.temp.max }} °C</p>
            <p>Température min: {{ day.temp.min }} °C</p>
            <p>Conditions: {{ day.weather[0].description }}</p>
          </div>
        </div>
      </div>
    </main>

    <footer>
      <p>© 2023 Weather App</p>
    </footer>
  </div>
</template>

<script>
import WeatherComponent from './components/WeatherComponent.vue';
import MapComponent from './components/MapComponent.vue';

export default {
  name: 'App',
  components: {
    WeatherComponent,
    MapComponent
  },
  data() {
    return {
      selectedDay: 0,
      weatherData: null,
      forecastData: null
    };
  },
  computed: {
    filteredForecastData() {
      if (this.forecastData && this.forecastData.length) {
        const startDay = this.selectedDay;
        const endDay = startDay + 1;
        return this.forecastData.slice(startDay, endDay);
      }
      return [];
    }
  },
  methods: {
    selectDay(day) {
      this.selectedDay = day;
    },
    updateWeather(weatherData, forecastData) {
      this.weatherData = weatherData;
      this.forecastData = forecastData;
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

html {
  background: linear-gradient(to bottom, #45c4ff, #e3f6ff);
  height: 100%;
  font-family: Arial, Helvetica, sans-serif;
  letter-spacing: -0.6px;
  word-spacing: 0.6px;
  color: #000000;
  font-style: normal;
  font-variant: small-caps;
  text-transform: lowercase;
}

body {
  margin: 0;
  padding: 0;
}

header {
  background-color: #333;
  color: #fff;
  padding: 5px;
  text-align: left;
}

.logo {
  font-size: 24px;
  color: white;
  text-decoration: none;
}

.search-bar {
  transform: translateX(-50%) translateY(-50%);
  top: 5%;
  position: absolute;
  left: 50%;
}

main {
  max-width: 1800px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 5px;
}

.forecast-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.forecast-bar button {
  padding: 10px 40px;
  border-radius: 10px;
  font-family: 'Pacifico', cursive;
  font-size: 15px;
  border: none;
  color: #ffffff;
  background-color: #3498DB;
  border-bottom: 5px solid #2980B9;
  text-shadow: 0px -2px #2980B9;
  transition: all 0.1s;
}

.forecast-bar button.active {
  transform: translate(0px, 5px);
  border-bottom: none;
}

.map-container {
  transform: translateX(-50%) translateY(0%);
  margin-top: 0.5%;
  position: absolute;
  left: 50%;
}

#map {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  height: 500px;
  width: 700px;
  border-radius: 10px;
}

footer {
  position: absolute;
  background-color: #5f5f5f;
  padding: 10px 10px;
  text-align: center;
  font-size: 14px;
  color: #ffffff;
  bottom: 0;
  width: 100%;
}
</style>
