import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TripDetail from './components/TripDetail';
import TripForm from './components/TripForm';
import CurrencyConverter from './components/CurrencyConverter';
import { loadTrips, saveTrips, addTrip, updateTrip, deleteTrip } from './utils/storage';
import './App.css';

function App() {
  const [trips, setTrips] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    const loadedTrips = loadTrips();
    setTrips(loadedTrips);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAddTrip = (tripData) => {
    const newTrip = addTrip(tripData);
    setTrips([...trips, newTrip]);
    setCurrentView('dashboard');
  };

  const handleUpdateTrip = (id, updates) => {
    const updated = updateTrip(id, updates);
    if (updated) {
      setTrips(trips.map(t => t.id === id ? updated : t));
      setCurrentView('dashboard');
    }
  };

  const handleDeleteTrip = (id) => {
    deleteTrip(id);
    setTrips(trips.filter(t => t.id !== id));
    setCurrentView('dashboard');
  };

  const handleViewTrip = (trip) => {
    setSelectedTrip(trip);
    setCurrentView('detail');
  };

  const handleEditTrip = (trip) => {
    setSelectedTrip(trip);
    setCurrentView('edit');
  };

  const handleBackToDashboard = () => {
    setSelectedTrip(null);
    setCurrentView('dashboard');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 onClick={handleBackToDashboard} style={{ cursor: 'pointer' }}>
          ✈️ 2026 Travel Planner
        </h1>
        <div className="header-actions">
          <button
            className="btn btn-icon"
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          {currentView === 'dashboard' && (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentView('converter')}
              >
                💱 Currency Converter
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setCurrentView('add')}
              >
                + Add New Trip
              </button>
            </>
          )}
          {currentView === 'converter' && (
            <button
              className="btn btn-secondary"
              onClick={handleBackToDashboard}
            >
              ← Back to Dashboard
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {currentView === 'dashboard' && (
          <Dashboard
            trips={trips}
            onViewTrip={handleViewTrip}
            onEditTrip={handleEditTrip}
            onDeleteTrip={handleDeleteTrip}
          />
        )}

        {currentView === 'detail' && selectedTrip && (
          <TripDetail
            trip={selectedTrip}
            onBack={handleBackToDashboard}
            onEdit={() => handleEditTrip(selectedTrip)}
            onDelete={() => handleDeleteTrip(selectedTrip.id)}
            onUpdatePayment={(paymentUpdates) => {
              handleUpdateTrip(selectedTrip.id, paymentUpdates);
              setSelectedTrip({ ...selectedTrip, ...paymentUpdates });
            }}
          />
        )}

        {(currentView === 'add' || currentView === 'edit') && (
          <TripForm
            trip={currentView === 'edit' ? selectedTrip : null}
            onSave={currentView === 'edit' ?
              (updates) => handleUpdateTrip(selectedTrip.id, updates) :
              handleAddTrip
            }
            onCancel={handleBackToDashboard}
          />
        )}

        {currentView === 'converter' && (
          <CurrencyConverter />
        )}
      </main>
    </div>
  );
}

export default App;
