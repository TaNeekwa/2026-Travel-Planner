import { useState, useEffect, useRef } from 'react';

function LocationAutocomplete({ value, onChange, placeholder, required }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounce timer
  const debounceTimer = useRef(null);

  useEffect(() => {
    // Click outside handler
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocations = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': '2026-Travel-Planner',
          },
        }
      );

      const data = await response.json();

      const formattedSuggestions = data.map((item) => {
        // Format the display name nicely
        const parts = [];
        if (item.address.city) parts.push(item.address.city);
        else if (item.address.town) parts.push(item.address.town);
        else if (item.address.village) parts.push(item.address.village);

        if (item.address.state) parts.push(item.address.state);
        if (item.address.country) parts.push(item.address.country);

        return {
          display: parts.join(', ') || item.display_name,
          value: parts.join(', ') || item.display_name,
        };
      });

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer to search after 300ms of no typing
    debounceTimer.current = setTimeout(() => {
      searchLocations(newValue);
    }, 300);
  };

  const handleSelectSuggestion = (suggestion) => {
    onChange(suggestion.value);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (suggestions.length > 0) setShowSuggestions(true);
        }}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className="location-suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="location-suggestion-item"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              📍 {suggestion.display}
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="location-loading">Searching...</div>
      )}
    </div>
  );
}

export default LocationAutocomplete;
