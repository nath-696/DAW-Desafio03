import { useState } from "react";
import PropTypes from "prop-types";
import { useCountries } from "../hooks/useCountries";
import CountryCard from "./CountryCard";
import StatusMessage from "./StatusMessage";

/**
 * Lista de países con buscador. Maneja su propia carga y sus errores.
 * @param {Function} onSelect Se llama con el país elegido
 */
export default function CountryList({ onSelect }) {
  const { countries, loading, error, retry } = useCountries();
  const [search, setSearch] = useState("");

  if (loading) return <StatusMessage type="loading" message="Cargando países..." />;
  if (error) return <StatusMessage type="error" message={error} onRetry={retry} />;

  const term = search.trim().toLowerCase();
  const filtered = countries.filter((c) => c.name.toLowerCase().includes(term));

  return (
    <section>
      <input
        className="search"
        type="search"
        placeholder="Buscar país..."
        aria-label="Buscar país"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filtered.length === 0 ? (
        <p className="empty">No se encontraron países con "{search}".</p>
      ) : (
        <ul className="grid">
          {filtered.map((country) => (
            <CountryCard key={country.code} country={country} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </section>
  );
}

CountryList.propTypes = {
  onSelect: PropTypes.func.isRequired,
};
