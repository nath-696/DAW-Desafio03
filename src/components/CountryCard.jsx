import PropTypes from "prop-types";
import { getCountryInfo } from "../utils/countryUtils";

/**
 * Tarjeta reutilizable de un país: bandera y nombre.
 * @param {object} country    País normalizado: { code, name, capital, flag }
 * @param {Function} onSelect Se llama con el país completo al hacer clic
 */
export default function CountryCard({ country, onSelect }) {
  const { name, flag } = getCountryInfo(country);

  return (
    <li className="card-item">
      <button className="card" onClick={() => onSelect(country)}>
        {flag ? (
          <img className="card__flag" src={flag} alt={`Bandera de ${name}`} loading="lazy" />
        ) : (
          <div className="card__flag card__flag--empty">Sin bandera</div>
        )}
        <span className="card__name">{name}</span>
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
