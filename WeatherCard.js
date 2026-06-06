import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { weatherCodes, getWindDirection } from "../utils/weatherUtils";

export default function WeatherCard({ weather, city }) {
  const info =
    weatherCodes[weather.weathercode] || {
      label: "Tidak diketahui",
      emoji: "❓",
    };

  return (
    <View style={styles.card}>
      <Text style={styles.city}>
        {city.name}, {city.country}
      </Text>

      <Text style={styles.temp}>{weather.temperature}°C</Text>

      <Text style={styles.condition}>
        {info.emoji} {info.label}
      </Text>

      <Text>💨 {weather.windspeed} km/jam</Text>

      <Text>
        🧭 {getWindDirection(weather.winddirection)}
      </Text>

      <Text>
        {weather.is_day ? "☀️ Siang" : "🌙 Malam"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    width: "100%",
    elevation: 4,
  },

  city: {
    fontSize: 22,
    fontWeight: "bold",
  },

  temp: {
    fontSize: 40,
    fontWeight: "bold",
    marginVertical: 10,
  },

  condition: {
    fontSize: 20,
    marginBottom: 10,
  },
});