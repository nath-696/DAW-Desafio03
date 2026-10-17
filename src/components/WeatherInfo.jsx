import PropTypes from "prop-types";
import { capitalizeFirst } from "../utils/countryUtils";
import Icon from "./Icon";

/**
 * Muestra el clima actual. Solo presenta datos: no hace fetch ni maneja estado.
 * @param {number} temperature Temperatura en °C
 * @param {string} condition   Descripción del clima
 * @param {number} humidity    Humedad en %
 * @param {number} windSpeed   Velocidad del viento en m/s
 */
export default function WeatherInfo({
  temperature,
  condition,
  humidity,
  windSpeed,
}) {
  return (
    <dl className="weather">
      <div className="weather__item">
        <dt>
          <Icon name="sun" /> Temperatura
        </dt>
        <dd>
          {Math.round(temperature)}
          <span> °C</span>
        </dd>
      </div>
      <div className="weather__item">
        <dt>
          <Icon name="cloud" /> Estado del cielo
        </dt>
        <dd>{capitalizeFirst(condition)}</dd>
      </div>
      <div className="weather__item">
        <dt>
          <Icon name="drop" /> Humedad
        </dt>
        <dd>
          {humidity}
          <span> %</span>
        </dd>
      </div>
      <div className="weather__item">
        <dt>
          <Icon name="wind" /> Viento
        </dt>
        <dd>
          {windSpeed}
          <span> m/s</span>
        </dd>
      </div>
    </dl>
  );
}

WeatherInfo.propTypes = {
  temperature: PropTypes.number.isRequired,
  condition: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  windSpeed: PropTypes.number.isRequired,
};
