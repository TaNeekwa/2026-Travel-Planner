import { useState } from 'react';
import BudgetOverview from './BudgetOverview';
import TravelStats from './TravelStats';
import TravelMap from './TravelMap';
import TripCard from './TripCard';
import CalendarView from './CalendarView';
import { getTripsByStatus } from '../utils/calculations';

function Dashboard({ trips, onViewTrip, onEditTrip, onDeleteTrip }) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'calendar'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

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

  return (
    <div className="dashboard">
      <TravelStats trips={trips} />

      <TravelMap trips={trips} onMarkerClick={onViewTrip} />

      <BudgetOverview trips={trips} tripsByStatus={tripsByStatus} />

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
        <div className="trips-grid">
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
            sortedTrips.map(trip => (
              <TripCard
                key={trip.id}
                trip={trip}
                onView={() => onViewTrip(trip)}
                onEdit={() => onEditTrip(trip)}
                onDelete={() => {
                  if (window.confirm(`Are you sure you want to delete "${trip.name}"?`)) {
                    onDeleteTrip(trip.id);
                  }
                }}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
