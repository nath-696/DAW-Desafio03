import { useEffect, useState, useCallback } from "react";
import { getAllCountries } from "../services/countriesService";

/**
 * Hook que carga la lista de países una vez al montar.
 * @returns {{countries:object[], loading:boolean, error:string|null, retry:Function}}
 */
export function useCountries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCountries() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllCountries(controller.signal);
        setCountries(data);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "No se pudo cargar la lista de países.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadCountries();
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { countries, loading, error, retry };
}
