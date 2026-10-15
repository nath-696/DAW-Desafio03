const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

/**
 * Consulta el clima actual de una ciudad (la capital del país).
 * @param {string} city        Nombre de la capital
 * @param {string} countryCode Código ISO de 2 letras (cca2) para evitar ciudades homónimas
 * @param {AbortSignal} signal Para cancelar la petición en el cleanup del useEffect
 * @returns {Promise<{temperature:number, condition:string, humidity:number, windSpeed:number}>}
 */
export async function getWeatherByCity(city, countryCode, signal) {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("Falta la API key de OpenWeatherMap (VITE_OPENWEATHER_API_KEY en .env).");
  }

  const query = countryCode ? `${city},${countryCode}` : city;
  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&units=metric&lang=es&appid=${apiKey}`;

  const response = await fetch(url, { signal });

  if (response.status === 404) {
    throw new Error(`No se encontró el clima de "${city}".`);
  }
  if (response.status === 401) {
    throw new Error("La API key de OpenWeatherMap no es válida.");
  }
  if (!response.ok) {
    throw new Error(`El servicio del clima respondió con error (${response.status}).`);
  }

  const data = await response.json();
  return normalizeWeather(data);
}

// Valida y normaliza la respuesta: si falta algo, lanza error en vez de romper la UI.
function normalizeWeather(data) {
  const temperature = data?.main?.temp;
  const humidity = data?.main?.humidity;
  const windSpeed = data?.wind?.speed;
  const condition = data?.weather?.[0]?.description;

  const valid =
    typeof temperature === "number" &&
    typeof humidity === "number" &&
    typeof windSpeed === "number" &&
    typeof condition === "string";

  if (!valid) {
    throw new Error("Los datos del clima llegaron incompletos o inválidos.");
  }

  return { temperature, condition, humidity, windSpeed };
}
