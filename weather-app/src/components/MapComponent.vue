<template>
    <div ref="map" class="map"></div>
</template>

<script>
    import { ref, onMounted } from "vue";
    import L from "leaflet";
    import "leaflet/dist/leaflet.css";

    export default {
        name: "MapComponent",
        props: {
            apiKey: { type: String, required: true }
        },
        setup(props, { emit }) {
            const mapElement = ref(null);
            let mapInstance = null;
            let currentMarker = null;

            const getIconClass = (weatherMain) => {
            switch (weatherMain) {
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
            };

            onMounted(() => {
                mapInstance = L.map(mapElement.value).setView([46.8566, 2.3522], 6);
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: '&copy; OpenStreetMap'
                }).addTo(mapInstance);

                mapInstance.on("click", async (e) => {
                    const { lat, lng } = e.latlng;
                    try {
                    const res = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${props.apiKey}&units=metric`
                    );
                    if (!res.ok) throw new Error(`Erreur ${res.status}`);
                    const data = await res.json();

                    if (currentMarker) {
                        mapInstance.removeLayer(currentMarker);
                    }

                    const iconClass = getIconClass(data.weather[0].main);
                    const label = `
                        <div class="custom-marker">
                        <i class="bi ${iconClass}" style="font-size:2rem; color:#f39c12;"></i>
                        <span class="temp">${Math.round(data.main.temp)}°C</span>
                        </div>
                    `;

                    const customIcon = L.divIcon({
                        html: label,
                        className: "", 
                        iconSize: [100, 50],
                        iconAnchor: [50, 25] 
                    });

                    currentMarker = L.marker([lat, lng], { icon: customIcon }).addTo(mapInstance);

                    emit("weather-updated", data);
                    } catch (err) {
                    console.error("Erreur lors de la récupération de la météo :", err);
                    }
                });
            });

            return { map: mapElement };
        }
    };
</script>

<style scoped>
    .map {
        width: 950px;
        height: 550px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .custom-marker {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.9);
        padding: 5px 10px;
        border-radius: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .temp {
        margin-left: 8px;
        font-weight: bold;
        color: #333;
    }
</style>
