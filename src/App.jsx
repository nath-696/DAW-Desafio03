import { useRef, useState } from "react";
import CountryList from "./components/CountryList";
import CountryDetail from "./components/CountryDetail";
import Icon from "./components/Icon";
import "./App.css";
export default function App() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [continent, setContinent] = useState(null);
  const heading = useRef(null);
  const previous = useRef(null);
  function select(country) {
    previous.current = country.code;
    setSelected(country);
    window.scrollTo(0, 0);
    requestAnimationFrame(() => heading.current?.focus());
  }
  function back() {
    setSelected(null);
    requestAnimationFrame(() =>
      Array.from(document.querySelectorAll("[data-country]"))
        .find((el) => el.dataset.country === previous.current)
        ?.focus(),
    );
  }
  return (
    <>
      <a className="skip-link" href="#content">
        Saltar al contenido
      </a>
      <header className="topbar">
        <a
          className="brand"
          href="./"
          onClick={(e) => {
            e.preventDefault();
            setSelected(null);
            setSearch("");
            setContinent(null);
          }}
        >
          <span className="brand__icon">
            <Icon name="globe" />
          </span>
          atlas<span className="brand__dot">.</span>
        </a>
        <span className="topbar__label">PAÍSES & CLIMA</span>
        <span className="topbar__tag">
          <i />
          Un mundo por descubrir
        </span>
      </header>
      <main id="content" className="app">
        <div hidden={Boolean(selected)}>
          <section className="hero" aria-labelledby="explore-title">
            <div className="hero__copy">
              <span className="eyebrow">
                <Icon name="explore" size={18} /> TU PRÓXIMO DESCUBRIMIENTO
              </span>
              <h1 id="explore-title">
                El mundo,
                <br />
                <span>a tu ritmo.</span>
              </h1>
              <p>
                Explora países, conoce sus capitales y descubre
                <br className="desktop-break" /> cómo está el clima al otro lado
                del mundo.
              </p>
              <a className="hero__link" href="#country-explorer">
                Comienza a explorar <Icon name="arrow" size={18} />
              </a>
            </div>
            <div className="world-art" aria-hidden="true">
              <div className="orbit" />
              <div className="world-art__sun">
                <Icon name="sun" size={38} />
              </div>
              <svg
                className="world-art__globe"
                viewBox="0 0 260 260"
                fill="none"
              >
                <circle cx="130" cy="130" r="116" fill="#b3dee2" />
                <g stroke="#609397" strokeWidth="1.5" opacity=".6">
                  <ellipse cx="130" cy="130" rx="64" ry="116" />
                  <path d="M14 130h232M28 76h204M28 184h204M130 14v232" />
                </g>
                <path
                  d="m56 49 35-17 21 13-7 25 16 14-12 26-26-3-10 19-22-14-17-30zm55 81 27 1 18 29-12 23-4 31-16 16-12-34-15-20zm56-90 32 17 29 28-17 15-25-7-5 22-24-5-11-27zm21 101 29 10 12 31-24 12-24-18z"
                  fill="#eaf2d7"
                />
                <circle
                  cx="130"
                  cy="130"
                  r="116"
                  stroke="#75a2a5"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="art-label art-label--top">
                <Icon name="location" size={17} /> Sin fronteras
              </span>
              <span className="art-label art-label--bottom">
                <Icon name="cloud" size={19} /> Nuevos horizontes
              </span>
              <span className="art-spark">✦</span>
            </div>
          </section>
        </div>
        {selected && (
          <CountryDetail
            country={selected}
            onBack={back}
            headingRef={heading}
          />
        )}
        <div hidden={Boolean(selected)}>
          <CountryList
            onSelect={select}
            search={search}
            setSearch={setSearch}
            sort={sort}
            setSort={setSort}
            continent={continent}
            setContinent={setContinent}
          />
        </div>
      </main>
      <footer className="footer">
        <span className="footer__brand">atlas.</span>
        <span>Un poco de curiosidad te lleva lejos.</span>
        <span>
          Hecho para explorar <Icon name="globe" size={16} />
        </span>
      </footer>
    </>
  );
}
