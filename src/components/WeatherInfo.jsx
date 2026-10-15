import PropTypes from "prop-types";
import { capitalizeFirst } from "../utils/countryUtils";

/**
 * Muestra el clima actual. Solo presenta datos: no hace fetch ni maneja estado.
 * @param {number} temperature Temperatura en °C
 * @param {string} condition   Descripción del clima
 * @param {number} humidity    Humedad en %
 * @param {number} windSpeed   Velocidad del viento en m/s
 */
export default function WeatherInfo({ temperature, condition, humidity, windSpeed }) {
  return (
    <dl className="weather">
      <div className="weather__item"><dt>Temperatura</dt><dd>{Math.round(temperature)} °C</dd></div>
      <div className="weather__item"><dt>Estado</dt><dd>{capitalizeFirst(condition)}</dd></div>
      <div className="weather__item"><dt>Humedad</dt><dd>{humidity} %</dd></div>
      <div className="weather__item"><dt>Viento</dt><dd>{windSpeed} m/s</dd></div>
    </dl>
  );
}

WeatherInfo.propTypes = {
  temperature: PropTypes.number.isRequired,
  condition: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  windSpeed: PropTypes.number.isRequired,
};
