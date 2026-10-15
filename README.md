# Desafío 03 – Países y clima (React)

App en React que lista países (Rest Countries v5) y muestra el clima actual de la capital (OpenWeatherMap).

## Cómo correrlo
1. `npm install`
2. Copiá `.env.example` a `.env` y poné tus dos API keys:
   - `VITE_RESTCOUNTRIES_API_KEY` (restcountries.com/sign-up). En la página **API Keys** agregá `localhost` en los hostnames permitidos (CORS).
   - `VITE_OPENWEATHER_API_KEY` (openweathermap.org)
3. `npm run dev` y abrir la URL que muestra la terminal.

## Estructura
- `src/components`: CountryList, CountryCard, CountryDetail, WeatherInfo, StatusMessage
- `src/hooks`: useCountries, useWeather
- `src/services`: countriesService, weatherService
- `src/utils`: countryUtils
