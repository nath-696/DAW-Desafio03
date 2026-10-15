/**
 * Extrae de forma segura los datos que usan los componentes.
 * Si algo falta, devuelve un valor por defecto en vez de romper la app (validación 5.1).
 * @param {{code?:string, name?:string, capital?:string|null, flag?:string|null}} country
 * @returns {{name:string, capital:string|null, flag:string|null, countryCode:string}}
 */
export function getCountryInfo(country) {
  return {
    name: country?.name ?? "País sin nombre",
    capital: country?.capital ?? null,
    flag: country?.flag ?? null,
    countryCode: country?.code ?? "",
  };
}

/** Pone la primera letra en mayúscula ("cielo claro" -> "Cielo claro"). */
export function capitalizeFirst(text) {
  if (typeof text !== "string" || text.length === 0) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}
