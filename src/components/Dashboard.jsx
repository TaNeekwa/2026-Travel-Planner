import { useState, useRef } from 'react';
import BudgetOverview from './BudgetOverview';
import TravelStats from './TravelStats';
import TravelMap from './TravelMap';
import TripCard from './TripCard';
import CalendarView from './CalendarView';
import { getTripsByStatus } from '../utils/calculations';
import { useAuth } from '../contexts/AuthContext';

function Dashboard({ trips, onViewTrip, onEditTrip, onDeleteTrip, onAddTrip }) {
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'calendar'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const fileInputRef = useRef(null);
  const carouselRef = useRef(null);

  const tripsByStatus = getTripsByStatus(trips);

  // Get all unique tags from trips
  const allTags = [...new Set(trips.flatMap(trip => trip.tags || []))].sort();

  const getFilteredTrips = () => {
    let filtered;
    switch (filter) {
      case 'upcoming':
        filtered = tripsByStatus.upcoming;
        break;
      case 'active':
        filtered = tripsByStatus.active;
        break;
      case 'completed':
        filtered = tripsByStatus.completed;
        break;
      default:
        filtered = trips;
    }

    // Apply tag filter
    if (selectedTag !== 'all') {
      filtered = filtered.filter(trip => trip.tags && trip.tags.includes(selectedTag));
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trip =>
        trip.name.toLowerCase().includes(query) ||
        trip.destination.toLowerCase().includes(query) ||
        (trip.hotel && trip.hotel.toLowerCase().includes(query)) ||
        (trip.notes && trip.notes.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  const getSortedTrips = (tripsToSort) => {
    const sorted = [...tripsToSort];
    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'cost':
        return sorted.sort((a, b) => {
          const totalA = parseFloat(a.baseCost || 0);
          const totalB = parseFloat(b.baseCost || 0);
          return totalB - totalA;
        });
      default:
        return sorted;
    }
  };

  const filteredTrips = getFilteredTrips();
  const sortedTrips = getSortedTrips(filteredTrips);

  // Carousel navigation functions
  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * 0.8; // Scroll by 80% of container width
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * 0.8;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Export trips to JSON file
  const handleExportTrips = () => {
    if (trips.length === 0) {
      alert('No trips to export!');
      return;
    }

    const dataStr = JSON.stringify(trips, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `travel-planner-trips-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`Exported ${trips.length} trips successfully! Transfer this file to your phone to import.`);
  };

  // Import trips from JSON file
  const handleImportTrips = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTrips = JSON.parse(e.target.result);

        if (!Array.isArray(importedTrips)) {
          alert('Invalid file format. Please select a valid trips export file.');
          return;
        }

        // Save to localStorage
        const storageKey = `trips_${currentUser.uid}`;
        localStorage.setItem(storageKey, JSON.stringify(importedTrips));

        // Reload the page to show imported trips
        alert(`Successfully imported ${importedTrips.length} trips! Refreshing...`);
        window.location.reload();
      } catch (error) {
        console.error('Error importing trips:', error);
        alert('Failed to import trips. Please make sure the file is valid.');
      }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="dashboard">
      <div data-aos="fade-up">
        <TravelStats trips={trips} />
      </div>

      <div data-aos="fade-up" data-aos-delay="100">
        <TravelMap trips={trips} onMarkerClick={onViewTrip} onAddPastTrip={onAddTrip} />
      </div>

      <div data-aos="fade-up" data-aos-delay="200">
        <BudgetOverview trips={trips} tripsByStatus={tripsByStatus} />
      </div>

      <div className="dashboard-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search trips by name, destination, hotel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>

        <div className="view-toggle">
          <button
            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('grid')}
          >
            📋 Grid View
          </button>
          <button
            className={`btn btn-sm ${viewMode === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('calendar')}
          >
            📅 Calendar View
          </button>
        </div>

        <div className="export-import-controls" style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-sm btn-secondary"
            onClick={handleExportTrips}
            title="Download trips to transfer to another device"
          >
            📥 Export Trips
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            title="Load trips from another device"
          >
            📤 Import Trips
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportTrips}
            style={{ display: 'none' }}
          />
        </div>

        {viewMode === 'grid' && (
          <>
            <div className="filter-group">
              <label>Filter:</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Trips ({trips.length})</option>
                <option value="upcoming">Upcoming ({tripsByStatus.upcoming.length})</option>
                <option value="active">Active ({tripsByStatus.active.length})</option>
                <option value="completed">Completed ({tripsByStatus.completed.length})</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="cost">Cost</option>
              </select>
            </div>

            {allTags.length > 0 && (
              <div className="filter-group">
                <label>Tag:</label>
                <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                  <option value="all">All Tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}
      </div>

      {viewMode === 'calendar' ? (
        <CalendarView trips={trips} onViewTrip={onViewTrip} />
      ) : (
        <>
          {sortedTrips.length === 0 ? (
            <div className="empty-state">
              <h2>No trips found</h2>
              <p>
                {filter === 'all'
                  ? 'Start planning your 2026 adventures by adding your first trip!'
                  : `No ${filter} trips at the moment.`}
              </p>
            </div>
          ) : (
            <div className="trips-carousel-container">
              {sortedTrips.length > 3 && (
                <button
                  className="carousel-nav carousel-nav-left"
                  onClick={scrollLeft}
                  aria-label="Scroll left"
                >
                  ←
                </button>
              )}

              <div className="trips-carousel" ref={carouselRef}>
                {sortedTrips.map((trip, index) => (
                  <div key={trip.id} data-aos="zoom-in" data-aos-delay={index * 100}>
                    <TripCard
                      trip={trip}
                      onView={() => onViewTrip(trip)}
                      onEdit={() => onEditTrip(trip)}
                      onDelete={() => {
                        if (window.confirm(`Are you sure you want to delete "${trip.name}"?`)) {
                          onDeleteTrip(trip.id);
                        }
                      }}
                    />
                  </div>
                ))}
              </div>

              {sortedTrips.length > 3 && (
                <button
                  className="carousel-nav carousel-nav-right"
                  onClick={scrollRight}
                  aria-label="Scroll right"
                >
                  →
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
