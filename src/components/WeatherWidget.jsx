import { useState, useEffect } from 'react';
import { getCoordinates } from '../utils/geocoding';

function WeatherWidget({ destination, startDate }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const coords = getCoordinates(destination);
        if (!coords) {
          setError('Location not found in our database');
          setLoading(false);
          return;
        }

        const [lat, lon] = coords;

        // Fetch weather from Open-Meteo API (free, no API key needed)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max&temperature_unit=fahrenheit&timezone=auto&forecast_days=7`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setWeather(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (destination) {
      fetchWeather();
    }
  }, [destination]);

  const getWeatherIcon = (code) => {
    // WMO Weather interpretation codes
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '🌨️';
    if (code <= 82) return '🌦️';
    if (code <= 86) return '❄️';
    if (code <= 99) return '⛈️';
    return '🌤️';
  };

  const getWeatherDescription = (code) => {
    if (code === 0) return 'Clear sky';
    if (code <= 3) return 'Partly cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 82) return 'Rain showers';
    if (code <= 86) return 'Snow showers';
    if (code <= 99) return 'Thunderstorm';
    return 'Unknown';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="weather-widget">
        <h3>Weather Forecast</h3>
        <div className="weather-loading">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget">
        <h3>Weather Forecast</h3>
        <div className="weather-error">
          Unable to load weather for {destination}. {error}
        </div>
      </div>
    );
  }

  if (!weather || !weather.daily) {
    return null;
  }

  const totalDays = 7;
  const daysToShow = 2;
  const canGoBack = currentDayIndex > 0;
  const canGoForward = currentDayIndex + daysToShow < totalDays;

  const handlePrevious = () => {
    if (canGoBack) {
      setCurrentDayIndex(currentDayIndex - daysToShow);
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      setCurrentDayIndex(currentDayIndex + daysToShow);
    }
  };

  const visibleDays = weather.daily.time.slice(currentDayIndex, currentDayIndex + daysToShow);

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <h3>7-Day Weather Forecast</h3>
        <span className="weather-location">📍 {destination}</span>
      </div>

      <div className="weather-carousel-container">
        <button
          className="weather-nav weather-nav-left"
          onClick={handlePrevious}
          disabled={!canGoBack}
          aria-label="Previous days"
        >
          ‹
        </button>

        <div className="weather-forecast">
          {visibleDays.map((date, offset) => {
            const index = currentDayIndex + offset;
            return (
              <div key={date} className="weather-day">
                <div className="weather-date">{formatDate(date)}</div>
                <div className="weather-icon">
                  {getWeatherIcon(weather.daily.weathercode[index])}
                </div>
                <div className="weather-desc">
                  {getWeatherDescription(weather.daily.weathercode[index])}
                </div>
                <div className="weather-temp">
                  <span className="temp-high">
                    {Math.round(weather.daily.temperature_2m_max[index])}°
                  </span>
                  <span className="temp-divider">/</span>
                  <span className="temp-low">
                    {Math.round(weather.daily.temperature_2m_min[index])}°
                  </span>
                </div>
                {weather.daily.precipitation_probability_max[index] > 0 && (
                  <div className="weather-precip">
                    💧 {weather.daily.precipitation_probability_max[index]}%
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          className="weather-nav weather-nav-right"
          onClick={handleNext}
          disabled={!canGoForward}
          aria-label="Next days"
        >
          ›
        </button>
      </div>

      <div className="weather-footer">
        <small>
          Days {currentDayIndex + 1}-{Math.min(currentDayIndex + daysToShow, totalDays)} of {totalDays} · Powered by Open-Meteo
        </small>
      </div>
    </div>
  );
}

export default WeatherWidget;
