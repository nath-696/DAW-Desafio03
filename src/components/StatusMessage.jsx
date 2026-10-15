import PropTypes from "prop-types";

/**
 * Mensaje de carga o de error reutilizable (también lo puede usar la lista de países).
 * @param {"loading"|"error"} type Tipo de mensaje
 * @param {string} message         Texto a mostrar
 * @param {Function} [onRetry]     Si se pasa, muestra el botón "Reintentar"
 */
export default function StatusMessage({ type, message, onRetry }) {
  if (type === "loading") {
    return (
      <p role="status" className="status status--loading">
        <span className="spinner" aria-hidden="true" /> {message}
      </p>
    );
  }
  return (
    <div role="alert" className="status status--error">
      <p>{message}</p>
      {onRetry && <button onClick={onRetry}>Reintentar</button>}
    </div>
  );
}

StatusMessage.propTypes = {
  type: PropTypes.oneOf(["loading", "error"]).isRequired,
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
};
