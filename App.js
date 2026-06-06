import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import WeatherCard from "./components/WeatherCard";

export default function App() {
  const [searchInput, setSearchInput] = useState("");
  const [cityData, setCityData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!searchInput.trim()) {
      setWeatherData(null);
      setCityData(null);
      setError("");
      return;
    }

    const controller = new AbortController();

    const debounce = setTimeout(() => {
      fetchWeather(controller);
    }, 500);

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [searchInput]);

  const fetchWeather = async (controller) => {
    console.log("Fetch berjalan untuk:", searchInput);
    
    try {
      setLoading(true);
      setError("");

      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${searchInput}&count=1&language=id`,
        {
          signal: controller.signal,
        }
      );

      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("Kota tidak ditemukan");
      }

      const city = geoData.results[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current_weather=true`,
        {
          signal: controller.signal,
        }
      );

      const weatherJson = await weatherResponse.json();

      setCityData(city);
      setWeatherData(weatherJson.current_weather);

      setHistory((prev) => {
        const updated = [
          city.name,
          ...prev.filter((item) => item !== city.name),
        ];

        return updated.slice(0, 5);
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getBackground = () => {
    if (!weatherData) return "#E3F2FD";

    if ([61, 63, 65, 80].includes(weatherData.weathercode)) {
      return "#B0BEC5";
    }

    if (weatherData.is_day) {
      return "#BBDEFB";
    }

    return "#263238";
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: getBackground() },
      ]}
    >
      <Text style={styles.title}>🌤 Weather Finder</Text>

      <TextInput
        style={styles.input}
        placeholder="Masukkan nama kota..."
        value={searchInput}
        onChangeText={setSearchInput}
      />

      {history.length > 0 && (
        <>
          <Text style={styles.historyTitle}>Riwayat Pencarian:</Text>

          <View style={styles.historyContainer}>
            {history.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.chip}
                onPress={() => setSearchInput(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {!searchInput && (
        <Text style={styles.info}>
          Ketik nama kota untuk mencari cuaca
        </Text>
      )}

      {loading && (
        <ActivityIndicator
          size="large"
          color="blue"
          style={{ marginTop: 20 }}
        />
      )}

      {error !== "" && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      {weatherData && cityData && !loading && (
        <WeatherCard
          weather={weatherData}
          city={cityData}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
  },

  info: {
    marginTop: 20,
    fontSize: 16,
  },

  error: {
    marginTop: 20,
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },

  historyTitle: {
    marginTop: 20,
    alignSelf: "flex-start",
    fontWeight: "bold",
  },

  historyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },

  chip: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
  },
});