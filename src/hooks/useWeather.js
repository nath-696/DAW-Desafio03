import { useEffect, useState, useCallback } from "react";
import { getWeatherByCity } from "../services/weatherService";

/**
 * Hook que obtiene el clima actual de la capital cada vez que cambia el país.
 * @param {string|null} capital     Nombre de la capital
 * @param {string} countryCode      Código ISO de 2 letras (cca2)
 * @returns {{weather:object|null, loading:boolean, error:string|null, retry:Function}}
 */
export function useWeather(capital, countryCode) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0); // al reintentar cambia y vuelve a ejecutar el efecto

  useEffect(() => {
    if (!capital) {
      setWeather(null);
      setLoading(false);
      setError("Este país no tiene capital registrada, no se puede consultar el clima.");
      return;
    }

    const controller = new AbortController();

    async function loadWeather() {
      setLoading(true);
      setError(null);
      setWeather(null);
      try {
        const data = await getWeatherByCity(capital, countryCode, controller.signal);
        setWeather(data);
      } catch (err) {
        if (err.name === "AbortError") return; // cambió de país: se ignora
        setError(err.message || "No se pudo obtener el clima.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadWeather();
    return () => controller.abort(); // cleanup
  }, [capital, countryCode, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { weather, loading, error, retry };
}
