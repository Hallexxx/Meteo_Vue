export default {
    getCurrentWeatherByCity(city, apiKey) {
      return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(res => {
          if (!res.ok) throw new Error(`Erreur ${res.status}`);
          return res.json();
        });
    },
    getForecastByCity(city, apiKey) {
      return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(res => {
          if (!res.ok) throw new Error(`Erreur ${res.status}`);
          return res.json();
        });
    }
};
  