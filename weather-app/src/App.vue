<template>
    <div id="app">
        <NavBar @search-city="fetchWeatherByCity" />

        <section class="container my-3">
            <div class="row justify-content-center mt-5">
                <div class="col-12 col-md-8 col-lg-8">
                    <div class="day-buttons d-flex flex-wrap justify-content-center mb-3">
                        <button
                            v-for="(day, index) in days"
                            :key="index"
                            class="btn btn-custom mx-1"
                            :class="{ 'active-day': selectedDay === index }"
                            @click="handleSelectDay(index)"
                        >
                            {{ day.label }}
                        </button>
                    </div>

                    <div
                        v-if="weatherData && forecastData"
                        class="weather-overlay p-3 bg-white rounded shadow mb-3 mt-3"
                        @click="toggleDetails"
                    > 
                        <div v-if="displayedWeather">
                            <div class="overlay-header d-flex justify-content-between align-items-center">
                                <div class="header-left d-flex align-items-center">
                                    <i
                                        :class="['bi', selectedDay === 0 ? weatherIconClass : forecastIconClass, 'me-2']"
                                        style="font-size: 2rem; color: #f39c12;"
                                    ></i>
                                    <span class="h4 mb-0">
                                        {{ weatherData.name }} 
                                        {{ selectedDay === 0 ? Math.round(weatherData.main.temp) : Math.round(displayedWeather.main.temp) }}°C
                                    </span>
                                </div>
                                <div class="header-right">
                                    <i class="bi" :class="detailsExpanded ? 'bi-chevron-up' : 'bi-chevron-down'" style="font-size: 2rem;"></i>
                                </div>
                            </div>
                            <transition name="slide-fade">
                                <div v-if="detailsExpanded" class="overlay-details mt-3">
                                    <div class="detail-item">
                                        <p class="mb-0">
                                            <strong>Température :</strong>
                                            {{ selectedDay === 0 ? Math.round(weatherData.main.temp) : Math.round(displayedWeather.main.temp) }}°C
                                        </p>
                                    </div>
                                    <hr class="detail-divider" />
                                    <div class="detail-item">
                                        <p class="mb-0">
                                            <strong>Vent :</strong>
                                            {{ selectedDay === 0 ? weatherData.wind.speed : displayedWeather.wind.speed }} m/s
                                        </p>
                                    </div>
                                    <hr class="detail-divider" />
                                    <div class="detail-item">
                                        <p class="mb-0">
                                            <strong>Conditions :</strong>
                                            {{ selectedDay === 0 ? weatherData.weather[0].description : displayedWeather.weather[0].description }}
                                        </p>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="container d-flex justify-content-center mb-5 mt-5">
            <MapComponent :apiKey="apiKey" @weather-updated="updateWeather" />
        </section>

        <footer class="bg-dark text-white py-3">
            <div class="container d-flex flex-column justify-content-between align-items-center">
                <span>© 2025 Weather App</span>
                <span>Created by Alexandre Perez</span>
            </div>
        </footer>
    </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import MapComponent from "./components/MapComponent.vue";
import WeatherService from "./services/WeatherService.js";

export default {
  name: "App",
  components: { NavBar, MapComponent },
  data() {
    return {
      apiKey: "2a83a40f3f0976b2d76e3838702603d4",
      weatherData: null,
      forecastData: null,
      selectedDay: 0,
      detailsExpanded: false,
      days: [
        { label: "Aujourd'hui" },
        { label: "Demain" },
        { label: "J+2" },
        { label: "J+3" },
        { label: "J+4" }
      ]
    };
  },
  computed: {
    displayedWeather() {
      if (!this.forecastData) return null;
      return this.selectedDay === 0
        ? this.weatherData
        : this.forecastData[this.selectedDay]
          ? this.forecastData[this.selectedDay].data[0]
          : null;
    },
    weatherIconClass() {
      if (!this.weatherData) return "bi-cloud";
      const main = this.weatherData.weather[0].main;
      switch (main) {
        case "Clear": return "bi-sun-fill";
        case "Clouds": return "bi-cloud-fill";
        case "Rain": return "bi-cloud-rain-fill";
        case "Drizzle": return "bi-cloud-drizzle-fill";
        case "Thunderstorm": return "bi-cloud-lightning-fill";
        case "Snow": return "bi-snow";
        case "Mist":
        case "Fog": return "bi-cloud-fog-fill";
        default: return "bi-cloud";
      }
    },
    // Icône pour les prévisions
    forecastIconClass() {
      const forecast = this.displayedWeather;
      if (!forecast) return "bi-cloud";
      const main = forecast.weather[0].main;
      switch (main) {
        case "Clear": return "bi-sun-fill";
        case "Clouds": return "bi-cloud-fill";
        case "Rain": return "bi-cloud-rain-fill";
        case "Drizzle": return "bi-cloud-drizzle-fill";
        case "Thunderstorm": return "bi-cloud-lightning-fill";
        case "Snow": return "bi-snow";
        case "Mist":
        case "Fog": return "bi-cloud-fog-fill";
        default: return "bi-cloud";
      }
    }
  },
  methods: {
    fetchWeatherByCity(city) {
      Promise.all([
        WeatherService.getCurrentWeatherByCity(city, this.apiKey),
        WeatherService.getForecastByCity(city, this.apiKey)
      ])
        .then(([current, forecast]) => {
          this.weatherData = current;
          this.forecastData = this.processForecastData(forecast);
          this.detailsExpanded = false;
        })
        .catch(err => console.error("Erreur :", err));
    },
    processForecastData(forecast) {
      const daily = {};
      forecast.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!daily[date]) daily[date] = [];
        daily[date].push(item);
      });
      return Object.keys(daily)
        .sort()
        .map(date => ({ date, data: daily[date] }));
    },
    handleSelectDay(index) {
      this.selectedDay = index;
      this.detailsExpanded = false;
    },
    toggleDetails() {
      this.detailsExpanded = !this.detailsExpanded;
    },
    updateWeather(data) {
      this.weatherData = data;
      this.detailsExpanded = false;
    }
  },
  mounted() {
    this.fetchWeatherByCity("Paris");
  }
};
</script>

<style>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css');

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.weather-overlay {
  max-width: 500px;
  width: 100%;
  margin: auto;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.weather-overlay:hover {
  transform: scale(1.02);
}

.overlay-header {
  text-align: left;
}

.overlay-details {
  text-align: left;
  padding: 0 15px;
}
.detail-divider {
  border-top: 1px solid #000;
  margin: 8px 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.btn-custom {
  display: inline-block;
  font-weight: bold;
  text-transform: uppercase;
  padding: 15px 30px;
  border: 2px solid #3498db;
  color: #3498db;
  border-radius: 8px;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  background-color: transparent;
  transition: all 0.3s ease;
  margin: 5px 0;
  cursor: pointer;
  font-size: 1.25rem;
}

.btn-custom::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: #3498db;
  z-index: -1;
  transition: all 0.3s ease;
}

.btn-custom:hover {
  color: #fff;
  transform: scale(1.05);
}

.btn-custom:hover::after {
  left: 0;
}

.active-day {
  color: #fff;
  background-color: #3498db;
  border-color: #3498db;
  transform: scale(1.05);
}

footer {
  margin-top: auto;
}
</style>
