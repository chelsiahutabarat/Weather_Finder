export const weatherCodes = {
  0: { label: "Cerah", emoji: "☀️" },
  1: { label: "Sebagian Cerah", emoji: "🌤️" },
  2: { label: "Berawan", emoji: "⛅" },
  3: { label: "Mendung", emoji: "☁️" },
  45: { label: "Kabut", emoji: "🌫️" },
  48: { label: "Kabut Beku", emoji: "🌫️" },
  51: { label: "Gerimis Ringan", emoji: "🌦️" },
  61: { label: "Hujan Ringan", emoji: "🌧️" },
  63: { label: "Hujan", emoji: "🌧️" },
  65: { label: "Hujan Lebat", emoji: "⛈️" },
  71: { label: "Salju Ringan", emoji: "❄️" },
  80: { label: "Hujan Lokal", emoji: "🌦️" },
  95: { label: "Badai Petir", emoji: "⛈️" },
};

export const getWindDirection = (degree) => {
  const directions = ["U", "TL", "T", "TG", "S", "BD", "B", "BL"];
  return directions[Math.round(degree / 45) % 8];
};