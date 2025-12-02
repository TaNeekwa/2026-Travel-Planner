import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Dashboard from './components/Dashboard';
import TripDetail from './components/TripDetail';
import TripForm from './components/TripForm';
import CurrencyConverter from './components/CurrencyConverter';
import ProfileSettings from './components/ProfileSettings';
import WelcomeTour from './components/WelcomeTour';
import Login from './components/Login';
import Signup from './components/Signup';
import { useAuth } from './contexts/AuthContext';
import { loadTrips, addTrip, updateTrip, deleteTrip } from './utils/firebaseStorage';
import './App.css';

function App() {
  const { currentUser, logout } = useAuth();
  const [trips, setTrips] = useState([]);
  const [currentView, setCurrentView] = useState(() => {
    // Restore view from localStorage on page load
    const savedView = localStorage.getItem('currentView');
    return savedView || 'dashboard';
  });
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  const [loading, setLoading] = useState(true);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);

  // Initialize AOS (Animate On Scroll)
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    });
  }, []);

  // Persist current view to localStorage
  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  // Persist selected trip ID to localStorage
  useEffect(() => {
    if (selectedTrip) {
      localStorage.setItem('selectedTripId', selectedTrip.id);
    } else {
      localStorage.removeItem('selectedTripId');
    }
  }, [selectedTrip]);

  // Restore selected trip after trips are loaded
  useEffect(() => {
    if (trips.length > 0 && !selectedTrip) {
      const savedTripId = localStorage.getItem('selectedTripId');
      if (savedTripId) {
        const trip = trips.find(t => t.id === savedTripId);
        if (trip) {
          setSelectedTrip(trip);
        }
      }
    }
  }, [trips]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
        if (event.state.tripId) {
          const trip = trips.find(t => t.id === event.state.tripId);
          setSelectedTrip(trip);
        } else {
          setSelectedTrip(null);
        }
      } else {
        setCurrentView('dashboard');
        setSelectedTrip(null);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Set initial state from saved view
    if (!window.history.state) {
      const savedView = localStorage.getItem('currentView') || 'dashboard';
      const savedTripId = localStorage.getItem('selectedTripId');
      window.history.replaceState({
        view: savedView,
        tripId: savedTripId
      }, '');
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [trips]);

  // Load trips when user is authenticated
  useEffect(() => {
    const fetchTrips = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const loadedTrips = await loadTrips(currentUser.uid);
          setTrips(loadedTrips);

          // Check if user has seen welcome tour
          const hasSeenTour = localStorage.getItem(`welcomeTour_${currentUser.uid}`);
          if (!hasSeenTour) {
            setShowWelcomeTour(true);
          }
        } catch (error) {
          console.error('Error fetching trips:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setTrips([]);
        setLoading(false);
      }
    };

    fetchTrips();
  }, [currentUser]);

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

  const handleAddTrip = async (tripData) => {
    try {
      console.log('Adding trip:', tripData);
      const newTrip = await addTrip(currentUser.uid, tripData);
      console.log('Trip added successfully:', newTrip);
      setTrips([...trips, newTrip]);
      setCurrentView('dashboard');
      window.history.pushState({ view: 'dashboard' }, '');
    } catch (error) {
      console.error('Error adding trip:', error);
      console.error('Error details:', error.message, error.code);
      alert(`Failed to add trip: ${error.message}. Please check the console for details.`);
    }
  };

  const handleUpdateTrip = async (id, updates) => {
    try {
      const updated = await updateTrip(currentUser.uid, id, updates);
      if (updated) {
        setTrips(trips.map(t => t.id === id ? { ...t, ...updated } : t));
        setCurrentView('dashboard');
        window.history.pushState({ view: 'dashboard' }, '');
      }
    } catch (error) {
      console.error('Error updating trip:', error);
      alert('Failed to update trip. Please try again.');
    }
  };

  const handleDeleteTrip = async (id) => {
    try {
      await deleteTrip(currentUser.uid, id);
      setTrips(trips.filter(t => t.id !== id));
      setCurrentView('dashboard');
      window.history.pushState({ view: 'dashboard' }, '');
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Failed to delete trip. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setTrips([]);
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const handleViewTrip = (trip) => {
    setSelectedTrip(trip);
    setCurrentView('detail');
    window.history.pushState({ view: 'detail', tripId: trip.id }, '');
  };

  const handleEditTrip = (trip) => {
    setSelectedTrip(trip);
    setCurrentView('edit');
    window.history.pushState({ view: 'edit', tripId: trip.id }, '');
  };

  const handleBackToDashboard = () => {
    setSelectedTrip(null);
    setCurrentView('dashboard');
    window.history.pushState({ view: 'dashboard' }, '');
  };

  const handleCompleteTour = () => {
    if (currentUser) {
      localStorage.setItem(`welcomeTour_${currentUser.uid}`, 'true');
    }
    setShowWelcomeTour(false);
  };

  // Show auth screens if user is not logged in
  if (!currentUser) {
    return (
      <>
        {authView === 'login' ? (
          <Login onSwitchToSignup={() => setAuthView('signup')} />
        ) : (
          <Signup onSwitchToLogin={() => setAuthView('login')} />
        )}
      </>
    );
  }

  // Show loading state while fetching trips
  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner">✈️</div>
          <p>Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 onClick={handleBackToDashboard} style={{ cursor: 'pointer' }}>
          ✈️ Travel Planner
        </h1>
        <div className="header-actions">
          <span className="user-greeting">
            Hello, {currentUser.displayName || currentUser.email}!
          </span>
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
                onClick={() => {
                  setCurrentView('converter');
                  window.history.pushState({ view: 'converter' }, '');
                }}
              >
                💱 Currency Converter
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setCurrentView('add');
                  window.history.pushState({ view: 'add' }, '');
                }}
              >
                + Add New Trip
              </button>
            </>
          )}
          {(currentView === 'converter' || currentView === 'settings') && (
            <button
              className="btn btn-secondary"
              onClick={handleBackToDashboard}
            >
              ← Back to Dashboard
            </button>
          )}
          <button
            className="btn btn-icon"
            onClick={() => {
              setCurrentView('settings');
              window.history.pushState({ view: 'settings' }, '');
            }}
            title="Account Settings"
          >
            ⚙️
          </button>
          <button
            className="btn btn-danger"
            onClick={handleLogout}
            title="Logout"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="app-main">
        {currentView === 'dashboard' && (
          <Dashboard
            trips={trips}
            onViewTrip={handleViewTrip}
            onEditTrip={handleEditTrip}
            onDeleteTrip={handleDeleteTrip}
            onAddTrip={handleAddTrip}
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

        {currentView === 'settings' && (
          <ProfileSettings onBack={handleBackToDashboard} />
        )}
      </main>

      {showWelcomeTour && <WelcomeTour onComplete={handleCompleteTour} />}
    </div>
  );
}

export default App;
