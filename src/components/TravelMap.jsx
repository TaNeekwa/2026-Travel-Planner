import { MapContainer, TileLayer, Marker, Popup, Tooltip, Polyline, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getTripLocations } from '../utils/geocoding';
import { formatDate } from '../utils/calculations';
import LocationAutocomplete from './LocationAutocomplete';
import { getCurrencyFromDestination } from '../utils/currencyMapping';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom colored markers for different trip statuses
const createCustomIcon = (status) => {
  const colors = {
    upcoming: '#2563eb',    // Blue
    active: '#10b981',      // Green
    completed: '#ff1493',   // Hot Pink
  };

  const color = colors[status] || colors.upcoming;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(45deg);
          color: white;
          font-size: 16px;
        ">
          ✈️
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

// Component to auto-fit map bounds to show all markers
function FitBounds({ locations }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => loc.coordinates));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 5 });
    }
  }, [locations, map]);

  return null;
}

function TravelMap({ trips, onMarkerClick, onAddPastTrip }) {
  const locations = getTripLocations(trips);
  const [showModal, setShowModal] = useState(false);
  const [mapStyle, setMapStyle] = useState('street');
  const [pastTripData, setPastTripData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  // Default center (center of US) if no trips
  const defaultCenter = [39.8283, -98.5795];
  const defaultZoom = 4;

  // Get completed trips in chronological order and create line coordinates
  const getCompletedTripLines = () => {
    // Filter only completed trips
    const completedTrips = locations.filter(loc => loc.status === 'completed');

    // Sort by start date (oldest to newest)
    completedTrips.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateA - dateB;
    });

    // Create array of coordinates for the polyline
    return completedTrips.map(trip => trip.coordinates);
  };

  const completedTripPath = getCompletedTripLines();

  // Map style configurations
  const mapStyles = {
    street: {
      name: 'Street',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      name: 'Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
    },
    terrain: {
      name: 'Terrain',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
    },
    dark: {
      name: 'Dark',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
    }
  };

  const handleInputChange = (e) => {
    setPastTripData({
      ...pastTripData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pastTripData.destination || !pastTripData.startDate || !pastTripData.endDate) {
      alert('Please fill in destination and dates');
      return;
    }

    // Auto-detect currency from destination
    const detectedCurrency = getCurrencyFromDestination(pastTripData.destination);

    // Create a completed trip
    const newPastTrip = {
      name: `${pastTripData.destination} Trip`,
      destination: pastTripData.destination,
      startDate: pastTripData.startDate,
      endDate: pastTripData.endDate,
      description: pastTripData.description,
      baseCost: 0,
      isBooked: true,
      currency: detectedCurrency,
    };

    if (onAddPastTrip) {
      onAddPastTrip(newPastTrip);
    }

    // Reset form and close modal
    setPastTripData({ destination: '', startDate: '', endDate: '', description: '' });
    setShowModal(false);
  };

  return (
    <div className="travel-map-container">
      <div className="map-header">
        <h3>Your Travel Destinations</h3>
        <div className="map-controls">
          <div className="map-style-switcher">
            <label style={{ fontSize: '0.875rem', marginRight: '0.5rem' }}>Map Style:</label>
            <select
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value)}
              className="map-style-select"
            >
              {Object.entries(mapStyles).map(([key, style]) => (
                <option key={key} value={key}>{style.name}</option>
              ))}
            </select>
          </div>
          <div className="map-legend">
            <div className="legend-item">
              <span className="legend-marker" style={{ backgroundColor: '#2563eb' }}></span>
              <span>Upcoming</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker" style={{ backgroundColor: '#10b981' }}></span>
              <span>Active</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker" style={{ backgroundColor: '#ff1493' }}></span>
              <span>Completed</span>
            </div>
          </div>
        </div>
      </div>

      {locations.length === 0 ? (
        <div className="map-empty-state">
          <p>🗺️ Your travel destinations will appear here once you add trips with locations!</p>
        </div>
      ) : (
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            key={mapStyle}
            attribution={mapStyles[mapStyle].attribution}
            url={mapStyles[mapStyle].url}
          />

          {locations.map((location) => (
            <Marker
              key={location.id}
              position={location.coordinates}
              icon={createCustomIcon(location.status)}
              eventHandlers={{
                click: () => {
                  const tiktokUrl = `https://www.tiktok.com/search?q=${encodeURIComponent(location.destination + ' travel')}`;
                  window.open(tiktokUrl, '_blank', 'noopener,noreferrer');
                },
              }}
            >
              <Tooltip permanent direction="top" offset={[0, -20]} className="map-label">
                {location.destination}
              </Tooltip>
            </Marker>
          ))}

          {/* Pink lines connecting completed trips in chronological order */}
          {completedTripPath.length >= 2 && (
            <Polyline
              positions={completedTripPath}
              pathOptions={{
                color: '#ff1493',
                weight: 3,
                opacity: 0.7,
                dashArray: '10, 10',
              }}
            />
          )}

          <FitBounds locations={locations} />
        </MapContainer>
      )}

      <div className="map-footer">
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => setShowModal(true)}
          style={{ marginRight: 'auto' }}
        >
          + Add Past Trip
        </button>
        {locations.length > 0 && (
          <span>{locations.length} destination{locations.length !== 1 ? 's' : ''} mapped</span>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Past Trip</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Add a trip you've already completed to see it on your map with a hot pink marker!
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="destination">Destination *</label>
                <LocationAutocomplete
                  value={pastTripData.destination}
                  onChange={(value) => setPastTripData({ ...pastTripData, destination: value })}
                  placeholder="Start typing a city... (e.g., Paris, Tokyo)"
                  required={true}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date *</label>
                  <DatePicker
                    selected={pastTripData.startDate ? new Date(pastTripData.startDate) : null}
                    onChange={(date) => {
                      const dateStr = date ? date.toISOString().split('T')[0] : '';
                      setPastTripData({ ...pastTripData, startDate: dateStr });
                    }}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select start date"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    yearDropdownItemNumber={15}
                    scrollableYearDropdown
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">End Date *</label>
                  <DatePicker
                    selected={pastTripData.endDate ? new Date(pastTripData.endDate) : null}
                    onChange={(date) => {
                      const dateStr = date ? date.toISOString().split('T')[0] : '';
                      setPastTripData({ ...pastTripData, endDate: dateStr });
                    }}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select end date"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    yearDropdownItemNumber={15}
                    scrollableYearDropdown
                    minDate={pastTripData.startDate ? new Date(pastTripData.startDate) : null}
                    openToDate={pastTripData.startDate ? new Date(pastTripData.startDate) : new Date()}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Details (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={pastTripData.description}
                  onChange={handleInputChange}
                  placeholder="Share some memories or highlights from this trip..."
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add to Map
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TravelMap;
