import PropTypes from "prop-types";
import { useWeather } from "../hooks/useWeather";
import { getCountryInfo } from "../utils/countryUtils";
import WeatherInfo from "./WeatherInfo";
import StatusMessage from "./StatusMessage";

/**
 * Vista de detalle: país, capital y clima actual de la capital.
 * @param {object} country    País seleccionado: { code, name, capital, flag }
 * @param {Function} onBack   Vuelve a la lista
 */
export default function CountryDetail({ country, onBack }) {
  const { name, capital, flag, countryCode } = getCountryInfo(country);
  const { weather, loading, error, retry } = useWeather(capital, countryCode);

  return (
    <section className="detail">
      <button className="btn-back" onClick={onBack}>← Volver a la lista</button>

      <header className="detail__header">
        {flag && <img className="detail__flag" src={flag} alt={`Bandera de ${name}`} />}
        <div>
          <h2>{name}</h2>
          <p>Capital: {capital ?? "No disponible"}</p>
        </div>
      </header>

      <h3>Clima actual{capital ? ` en ${capital}` : ""}</h3>
      {loading && <StatusMessage type="loading" message="Cargando clima..." />}
      {error && <StatusMessage type="error" message={error} onRetry={capital ? retry : undefined} />}
      {weather && <WeatherInfo {...weather} />}
    </section>
  );
}

CountryDetail.propTypes = {
  country: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
    capital: PropTypes.string,
    flag: PropTypes.string,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};
