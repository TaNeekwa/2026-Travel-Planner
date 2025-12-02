import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getTripLocations } from '../utils/geocoding';
import { formatDate } from '../utils/calculations';

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
    completed: '#64748b',   // Gray
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

function TravelMap({ trips, onMarkerClick }) {
  const locations = getTripLocations(trips);

  // Default center (center of US) if no trips
  const defaultCenter = [39.8283, -98.5795];
  const defaultZoom = 4;

  return (
    <div className="travel-map-container">
      <div className="map-header">
        <h3>Your Travel Destinations</h3>
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
            <span className="legend-marker" style={{ backgroundColor: '#64748b' }}></span>
            <span>Completed</span>
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
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locations.map((location) => (
            <Marker
              key={location.id}
              position={location.coordinates}
              icon={createCustomIcon(location.status)}
              eventHandlers={{
                click: () => {
                  if (onMarkerClick) {
                    const trip = trips.find(t => t.id === location.id);
                    onMarkerClick(trip);
                  }
                },
              }}
            >
              <Tooltip permanent direction="top" offset={[0, -20]} className="map-label">
                {location.destination}
              </Tooltip>
              <Popup>
                <div className="map-popup">
                  <strong>{location.name}</strong>
                  <div className="popup-destination">{location.destination}</div>
                  <div className="popup-dates">
                    {formatDate(location.startDate)} - {formatDate(location.endDate)}
                  </div>
                  <div className={`popup-status status-${location.status}`}>
                    {location.status.charAt(0).toUpperCase() + location.status.slice(1)}
                  </div>
                  <a
                    href={`https://www.tiktok.com/search?q=${encodeURIComponent(location.destination + ' travel')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="popup-tiktok-btn"
                    style={{
                      display: 'inline-block',
                      marginTop: '0.5rem',
                      padding: '0.4rem 0.8rem',
                      backgroundColor: '#000',
                      color: '#fff',
                      textDecoration: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#ff0050'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#000'}
                  >
                    🎬 See on TikTok
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}

          <FitBounds locations={locations} />
        </MapContainer>
      )}

      {locations.length > 0 && (
        <div className="map-footer">
          <span>{locations.length} destination{locations.length !== 1 ? 's' : ''} mapped</span>
        </div>
      )}
    </div>
  );
}

export default TravelMap;
