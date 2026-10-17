import PropTypes from "prop-types";
import { useCountries } from "../hooks/useCountries";
import CountryCard from "./CountryCard";
import StatusMessage from "./StatusMessage";
import Icon from "./Icon";
const continents = [
  {
    name: "América",
    values: ["North America", "South America", "Americas"],
    description: "De norte a sur, un mundo de contrastes.",
    symbol: "AM",
  },
  {
    name: "Europa",
    values: ["Europe"],
    description: "Historia y nuevos caminos por descubrir.",
    symbol: "EU",
  },
  {
    name: "Asia",
    values: ["Asia"],
    description: "Culturas y horizontes que sorprenden.",
    symbol: "AS",
  },
  {
    name: "África",
    values: ["Africa"],
    description: "Diversidad que se extiende sin límites.",
    symbol: "AF",
  },
  {
    name: "Oceanía",
    values: ["Oceania"],
    description: "Islas y destinos al otro lado del océano.",
    symbol: "OC",
  },
  {
    name: "Antártida",
    values: ["Antarctica"],
    description: "Explora los territorios del extremo sur.",
    symbol: "AN",
  },
];
const belongsTo = (country, group) =>
  group.values.some((value) => country.continents?.includes(value));
const normalize = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export default function CountryList({
  onSelect,
  search,
  setSearch,
  sort,
  setSort,
  continent,
  setContinent,
}) {
  const { countries, loading, error, retry } = useCountries();
  const active = continents.find((group) => group.name === continent);
  function changeContinent(value) {
    setSearch("");
    setContinent(value);
    requestAnimationFrame(() =>
      document.getElementById("countries-title")?.focus(),
    );
  }
  const filtered = countries
    .filter((c) => active && belongsTo(c, active))
    .filter((c) =>
      normalize(`${c.name} ${c.capital || ""} ${c.code}`).includes(
        normalize(search.trim()),
      ),
    )
    .sort((a, b) =>
      sort === "asc"
        ? a.name.localeCompare(b.name, "es")
        : b.name.localeCompare(a.name, "es"),
    );
  return (
    <section
      className="explorer"
      id="country-explorer"
      aria-labelledby="countries-title"
    >
      {active && (
        <button className="btn-back" onClick={() => changeContinent(null)}>
          <Icon name="back" size={18} /> Todos los continentes
        </button>
      )}
      <div className="section-heading">
        <div>
          <span className="eyebrow">EXPLORA SIN PRISA</span>
          <h2 id="countries-title" tabIndex={-1}>
            {active
              ? `Descubre ${active.name}`
              : "¿Qué continente quieres explorar?"}
          </h2>
        </div>
        <span className="section-heading__icon">
          <Icon name="explore" size={28} />
        </span>
      </div>
      {!active && (
        <p className="continent-intro">
          Elige un continente para descubrir sus países y el clima de sus
          capitales.
        </p>
      )}
      {!active && !loading && !error && (
        <ul className="continent-grid">
          {continents.map((group) => {
            const count = countries.filter((country) =>
              belongsTo(country, group),
            ).length;
            return (
              <li key={group.name}>
                <button
                  className="continent-card"
                  disabled={!count}
                  onClick={() => changeContinent(group.name)}
                >
                  <span className="continent-card__art" aria-hidden="true">
                    <Icon name="globe" size={68} />
                    <span>{group.symbol}</span>
                  </span>
                  <span className="continent-card__title">
                    {group.name}
                    <Icon name="arrow" size={22} />
                  </span>
                  <span className="continent-card__description">
                    {group.description}
                  </span>
                  <span className="continent-card__count">
                    {count
                      ? `${count} ${count === 1 ? "país o territorio" : "países y territorios"}`
                      : "Sin destinos disponibles"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {active && (
        <div className="toolbar">
          <div className="search-field">
            <Icon name="search" />
            <input
              id="country-search"
              type="search"
              placeholder="Busca un país o una capital"
              aria-label="Buscar por país, capital o código"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="icon-button"
                aria-label="Limpiar búsqueda"
                onClick={() => {
                  setSearch("");
                  document.getElementById("country-search").focus();
                }}
              >
                <Icon name="close" size={20} />
              </button>
            )}
          </div>
          <label className="sort-field">
            <span>Ordenar</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="asc">Nombre: A–Z</option>
              <option value="desc">Nombre: Z–A</option>
            </select>
          </label>
        </div>
      )}
      {loading ? (
        <StatusMessage
          type="loading"
          message="Preparando tu recorrido por el mundo…"
        />
      ) : error ? (
        <StatusMessage type="error" message={error} onRetry={retry} />
      ) : active ? (
        <>
          <div className="results-line">
            <span role="status">
              <strong>{filtered.length}</strong>{" "}
              {filtered.length === 1 ? "país" : "países"}
              {search ? " encontrados" : " por descubrir"}
            </span>
            <span>
              Elige un país para conocer su clima{" "}
              <Icon name="arrow" size={16} />
            </span>
          </div>
          {filtered.length ? (
            <ul className="grid">
              {filtered.map((c) => (
                <CountryCard key={c.code} country={c} onSelect={onSelect} />
              ))}
            </ul>
          ) : (
            <div className="empty">
              <Icon name="search" size={32} />
              <h3>No encontramos ese destino</h3>
              <p>Prueba con otro país, su capital o su código.</p>
              <button onClick={() => setSearch("")}>
                Ver países de {active.name}
              </button>
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}
CountryList.propTypes = {
  onSelect: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
  setSort: PropTypes.func.isRequired,
  continent: PropTypes.string,
  setContinent: PropTypes.func.isRequired,
};
