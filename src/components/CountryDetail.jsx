import PropTypes from "prop-types";
import { useWeather } from "../hooks/useWeather";
import { getCountryInfo } from "../utils/countryUtils";
import WeatherInfo from "./WeatherInfo";
import StatusMessage from "./StatusMessage";
import Icon from "./Icon";

/**
 * Vista de detalle: país, capital y clima actual de la capital.
 * @param {object} country    País seleccionado: { code, name, capital, flag }
 * @param {Function} onBack   Vuelve a la lista
 */
export default function CountryDetail({ country, onBack, headingRef }) {
  const { name, capital, flag, countryCode } = getCountryInfo(country);
  const { weather, loading, error, retry } = useWeather(capital, countryCode);

  return (
    <section className="detail">
      <button className="btn-back" onClick={onBack}>
        <Icon name="back" size={18} /> Todos los países
      </button>

      <header className="detail__header">
        {flag && (
          <img className="detail__flag" src={flag} alt={`Bandera de ${name}`} />
        )}
        <div>
          <span className="eyebrow">
            UN LUGAR POR DESCUBRIR · {countryCode}
          </span>
          <h1 ref={headingRef} tabIndex={-1}>
            {name}
          </h1>
          <p>
            <Icon name="location" size={18} /> Capital:{" "}
            {capital ?? "No disponible"}
          </p>
        </div>
      </header>

      <div className="weather-heading">
        <span className="weather-heading__icon">
          <Icon name="sun" size={28} />
        </span>
        <div>
          <h2>El clima ahora</h2>
          <p>
            {capital ? `Así está el día en ${capital}.` : "Clima de la capital"}
          </p>
        </div>
        <span className="live-label">Clima actual</span>
      </div>
      {loading && <StatusMessage type="loading" message="Cargando clima..." />}
      {error && (
        <StatusMessage
          type="error"
          message={error}
          onRetry={capital ? retry : undefined}
        />
      )}
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
  headingRef: PropTypes.shape({ current: PropTypes.any }),
};
