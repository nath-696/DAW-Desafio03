// REST Countries v5 (las versiones v1-v4 fueron dadas de baja).
// En desarrollo, Vite redirige /api/countries a https://api.restcountries.com/countries/v5 (ver vite.config.js)
const BASE_URL = "/api/countries";
const FIELDS = "names.common,codes.alpha_2,capitals,continents";
const PAGE_SIZE = 100; // máximo permitido en el plan gratuito
const MAX_PAGES = 5; // protección contra bucles (hay ~250 países => 3 páginas)
const CACHE_KEY = "countries_v5_continents_cache";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 h (los términos permiten cachear hasta 3 días)

/**
 * Obtiene todos los países desde Rest Countries v5.
 * Guarda el resultado en localStorage para no gastar la cuota mensual de la API key.
 * @param {AbortSignal} signal Para cancelar la petición en el cleanup del useEffect
 * @returns {Promise<{code:string, name:string, capital:string|null, flag:string}[]>}
 */
export async function getAllCountries(signal) {
  const cached = readCache();
  if (cached) return cached;

  const objects = [];
  let offset = 0;
  for (let page = 0; page < MAX_PAGES; page++) {
    const { items, more } = await fetchPage(offset, signal);
    objects.push(...items);
    if (!more) break;
    offset += PAGE_SIZE;
  }

  const countries = objects
    .map(normalizeCountry)
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (countries.length === 0) {
    throw new Error("La API de países no devolvió resultados válidos.");
  }

  writeCache(countries);
  return countries;
}

async function fetchPage(offset, signal) {
  const url = `${BASE_URL}?response_fields=${FIELDS}&limit=${PAGE_SIZE}&offset=${offset}`;
  let response;
  try {
    response = await fetch(url, { signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new Error(
      "No se pudo conectar con Rest Countries. Revisá tu conexión a internet e intentá de nuevo.",
    );
  }

  if (response.status === 401)
    throw new Error(
      "La API key de Rest Countries falta o no es válida (revisá VITE_RESTCOUNTRIES_API_KEY en .env y reiniciá el servidor).",
    );
  if (response.status === 403)
    throw new Error(
      "Rest Countries rechazó la petición (403). Revisá tu cuenta y tu API key.",
    );
  if (response.status === 429)
    throw new Error(
      "Demasiadas solicitudes a Rest Countries. Esperá unos segundos e intentá de nuevo.",
    );
  if (!response.ok)
    throw new Error(`Rest Countries respondió con error (${response.status}).`);

  const json = await response.json();
  const items = json?.data?.objects;
  if (!Array.isArray(items))
    throw new Error("La API de países devolvió datos inválidos.");

  return { items, more: Boolean(json?.data?.meta?.more) };
}

// Convierte el formato de la API v5 a uno simple y validado para la app.
function normalizeCountry(raw) {
  const name = raw?.names?.common;
  const code = raw?.codes?.alpha_2;
  if (typeof name !== "string" || typeof code !== "string") return null; // se descarta el registro inválido

  const capitals = Array.isArray(raw?.capitals) ? raw.capitals : [];
  const main = capitals.find((c) => c?.attributes?.primary) ?? capitals[0];
  const capitalName = typeof main === "string" ? main : main?.name;

  return {
    code,
    name,
    continents: Array.isArray(raw.continents)
      ? raw.continents.filter((value) => typeof value === "string")
      : [],
    capital:
      typeof capitalName === "string" && capitalName.length > 0
        ? capitalName
        : null,
    // CDN gratuito de banderas (no usa la API key ni gasta cuota)
    flag: `https://flags.restcountries.com/v5/w320/${code.toLowerCase()}.png`,
  };
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { savedAt, data } = JSON.parse(raw);
    if (
      Date.now() - savedAt > CACHE_TTL_MS ||
      !Array.isArray(data) ||
      data.length === 0
    )
      return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ savedAt: Date.now(), data }),
    );
  } catch {
    /* si el almacenamiento falla, la app sigue funcionando sin caché */
  }
}
