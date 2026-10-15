import { useState } from "react";
import CountryList from "./components/CountryList";   // lo hace tu compañero/a
import CountryDetail from "./components/CountryDetail";
import "./App.css";

export default function App() {
  // Estado elevado: lo comparten la lista (selecciona) y el detalle (muestra)
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <main className="app">
      <h1>Países y clima</h1>
      {selectedCountry ? (
        <CountryDetail country={selectedCountry} onBack={() => setSelectedCountry(null)} />
      ) : (
        <CountryList onSelect={setSelectedCountry} />
      )}
    </main>
  );
}
