import PropTypes from "prop-types";
import { getCountryInfo } from "../utils/countryUtils";
import Icon from "./Icon";

/**
 * Tarjeta reutilizable de un país: bandera y nombre.
 * @param {object} country    País normalizado: { code, name, capital, flag }
 * @param {Function} onSelect Se llama con el país completo al hacer clic
 */
export default function CountryCard({ country, onSelect }) {
  const { name, flag, capital } = getCountryInfo(country);

  return (
    <li className="card-item">
      <button
        className="card"
        data-country={country.code}
        onClick={() => onSelect(country)}
      >
        <span className="card__visual">
          {flag ? (
            <img
              className="card__flag"
              src={flag}
              alt={`Bandera de ${name}`}
              loading="lazy"
            />
          ) : (
            <div className="card__flag card__flag--empty">Sin bandera</div>
          )}
          <span className="card__code">{country.code}</span>
        </span>
        <span className="card__body">
          <span className="card__name">{name}</span>
          <span className="card__capital">
            <Icon name="location" size={15} />
            {capital || "Capital no disponible"}
          </span>
          <span className="card__action">
            Explorar país <Icon name="arrow" size={18} />
          </span>
        </span>
      </button>
    </li>
  );
}

CountryCard.propTypes = {
  country: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
    flag: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};
