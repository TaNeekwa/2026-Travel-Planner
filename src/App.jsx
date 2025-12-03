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
import { formatCurrency, formatDate } from './utils/calculations';
import { ToastContainer } from './components/Toast';
import './App.css';

// Helper functions for URL-based routing
const getRouteFromHash = () => {
  const hash = window.location.hash.slice(1) || '/'; // Remove # and default to /
  const parts = hash.split('/').filter(Boolean);

  if (!parts.length || parts[0] === '') return { view: 'dashboard', tripId: null };
  if (parts[0] === 'trip' && parts[1]) return { view: 'detail', tripId: parts[1] };
  if (parts[0] === 'trip' && parts[1] && parts[2] === 'edit') return { view: 'edit', tripId: parts[1] };
  if (parts[0] === 'add') return { view: 'add', tripId: null };
  if (parts[0] === 'converter') return { view: 'converter', tripId: null };
  if (parts[0] === 'settings') return { view: 'settings', tripId: null };

  return { view: 'dashboard', tripId: null };
};

const setRouteHash = (view, tripId = null) => {
  if (view === 'dashboard') window.location.hash = '/';
  else if (view === 'detail' && tripId) window.location.hash = `/trip/${tripId}`;
  else if (view === 'edit' && tripId) window.location.hash = `/trip/${tripId}/edit`;
  else if (view === 'add') window.location.hash = '/add';
  else if (view === 'converter') window.location.hash = '/converter';
  else if (view === 'settings') window.location.hash = '/settings';
  else window.location.hash = '/';
};

function App() {
  const { currentUser, logout } = useAuth();
  const [trips, setTrips] = useState([]);
  const [currentView, setCurrentView] = useState(() => {
    // Initialize view from URL hash
    const route = getRouteFromHash();
    return route.view;
  });
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  const [loading, setLoading] = useState(true);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Initialize AOS (Animate On Scroll)
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    });
  }, []);

  // Handle URL hash changes (browser back/forward, URL edits)
  useEffect(() => {
    const handleHashChange = () => {
      const route = getRouteFromHash();
      setCurrentView(route.view);

      // If route has a tripId, find and set the trip
      if (route.tripId && trips.length > 0) {
        const trip = trips.find(t => t.id === route.tripId);
        if (trip) {
          setSelectedTrip(trip);
        } else {
          // Trip not found, go to dashboard
          setRouteHash('dashboard');
          setCurrentView('dashboard');
          setSelectedTrip(null);
        }
      } else if (!route.tripId) {
        setSelectedTrip(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [trips]);

  // Restore selected trip from URL after trips are loaded
  useEffect(() => {
    if (trips.length > 0) {
      const route = getRouteFromHash();
      if (route.tripId && !selectedTrip) {
        const trip = trips.find(t => t.id === route.tripId);
        if (trip) {
          setSelectedTrip(trip);
          console.log('Restored trip from URL:', trip.name);
        } else {
          // Trip not found, go to dashboard
          setRouteHash('dashboard');
          setCurrentView('dashboard');
        }
      }
    }
  }, [trips]);

  // Note: Browser back/forward now handled by hashchange listener above

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

  // Calculate payment notifications
  useEffect(() => {
    const checkPayments = () => {
      const now = new Date();
      const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const alerts = [];

      trips.forEach(trip => {
        // Check deposit payments
        if (trip.deposit && parseFloat(trip.deposit) > 0 && trip.depositDueDate && !trip.depositPaid) {
          const dueDate = new Date(trip.depositDueDate);

          if (dueDate <= oneWeekFromNow && dueDate >= now) {
            alerts.push({
              type: 'urgent',
              tripName: trip.name,
              amount: parseFloat(trip.deposit),
              dueDate: trip.depositDueDate,
              description: 'Deposit',
              daysUntil: Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
            });
          } else if (dueDate <= endOfMonth && dueDate >= now) {
            alerts.push({
              type: 'upcoming',
              tripName: trip.name,
              amount: parseFloat(trip.deposit),
              dueDate: trip.depositDueDate,
              description: 'Deposit',
              daysUntil: Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
            });
          }
        }

        // Check monthly payment plan
        if (trip.monthlyPayments && trip.monthlyPayments.length > 0) {
          trip.monthlyPayments.forEach(payment => {
            if (!payment.paid && payment.dueDate) {
              const dueDate = new Date(payment.dueDate);

              if (dueDate <= oneWeekFromNow && dueDate >= now) {
                alerts.push({
                  type: 'urgent',
                  tripName: trip.name,
                  amount: parseFloat(payment.amount),
                  dueDate: payment.dueDate,
                  description: payment.description || 'Payment',
                  daysUntil: Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
                });
              } else if (dueDate <= endOfMonth && dueDate >= now) {
                alerts.push({
                  type: 'upcoming',
                  tripName: trip.name,
                  amount: parseFloat(payment.amount),
                  dueDate: payment.dueDate,
                  description: payment.description || 'Payment',
                  daysUntil: Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
                });
              }
            }
          });
        }

        // Check custom payments
        if (trip.payments && trip.payments.length > 0) {
          trip.payments.forEach(payment => {
            if (!payment.paid && payment.dueDate) {
              const dueDate = new Date(payment.dueDate);

              if (dueDate <= oneWeekFromNow && dueDate >= now) {
                alerts.push({
                  type: 'urgent',
                  tripName: trip.name,
                  amount: parseFloat(payment.amount),
                  dueDate: payment.dueDate,
                  description: payment.description || 'Payment',
                  daysUntil: Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
                });
              } else if (dueDate <= endOfMonth && dueDate >= now) {
                alerts.push({
                  type: 'upcoming',
                  tripName: trip.name,
                  amount: parseFloat(payment.amount),
                  dueDate: payment.dueDate,
                  description: payment.description || 'Payment',
                  daysUntil: Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
                });
              }
            }
          });
        }
      });

      // Sort by due date (soonest first)
      alerts.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setNotifications(alerts);
    };

    checkPayments();
  }, [trips]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toast notification functions
  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleAddTrip = async (tripData) => {
    try {
      console.log('Adding trip:', tripData);
      const newTrip = await addTrip(currentUser.uid, tripData);
      console.log('Trip added successfully:', newTrip);
      setTrips([...trips, newTrip]);
      setCurrentView('dashboard');
      setRouteHash('dashboard');
      showToast('Trip added successfully!', 'success');
    } catch (error) {
      console.error('Error adding trip:', error);
      console.error('Error details:', error.message, error.code);
      showToast(`Failed to add trip: ${error.message}`, 'error');
    }
  };

  const handleUpdateTrip = async (id, updates) => {
    try {
      const updated = await updateTrip(currentUser.uid, id, updates);
      if (updated) {
        setTrips(trips.map(t => t.id === id ? { ...t, ...updated } : t));
        setCurrentView('dashboard');
        setRouteHash('dashboard');
        showToast('Trip updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error updating trip:', error);
      showToast('Failed to update trip. Please try again.', 'error');
    }
  };

  const handleDeleteTrip = async (id) => {
    try {
      await deleteTrip(currentUser.uid, id);
      setTrips(trips.filter(t => t.id !== id));
      setCurrentView('dashboard');
      setRouteHash('dashboard');
      showToast('Trip deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting trip:', error);
      showToast('Failed to delete trip. Please try again.', 'error');
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
    setRouteHash('detail', trip.id);
  };

  const handleEditTrip = (trip) => {
    setSelectedTrip(trip);
    setCurrentView('edit');
    setRouteHash('edit', trip.id);
  };

  const handleBackToDashboard = () => {
    setSelectedTrip(null);
    setCurrentView('dashboard');
    setRouteHash('dashboard');
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
            <button
              className="btn btn-primary"
              onClick={() => {
                setCurrentView('add');
                setRouteHash('add');
              }}
            >
              + Add New Trip
            </button>
          )}
          {currentView === 'settings' && (
            <button
              className="btn btn-secondary"
              onClick={handleBackToDashboard}
            >
              ← Back to Dashboard
            </button>
          )}
          <div className="notification-bell-container">
            <button
              className="btn btn-icon notification-bell"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Payment Notifications"
            >
              🔔
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>
            {showNotifications && notifications.length > 0 && (
              <div className="notification-dropdown">
                <div className="notification-dropdown-header">
                  <h4>Payment Notifications</h4>
                  <button
                    className="close-btn"
                    onClick={() => setShowNotifications(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="notification-dropdown-content">
                  {notifications.filter(n => n.type === 'urgent').length > 0 && (
                    <div className="notification-section">
                      <h5 className="notification-section-title urgent">⚠️ Due This Week</h5>
                      {notifications.filter(n => n.type === 'urgent').map((notif, index) => {
                        const trip = trips.find(t => t.name === notif.tripName);
                        return (
                          <div
                            key={index}
                            className="notification-item urgent clickable"
                            onClick={() => {
                              if (trip) {
                                handleViewTrip(trip);
                                setShowNotifications(false);
                              }
                            }}
                          >
                            <div className="notification-item-header">
                              <strong>{notif.tripName}</strong>
                              <span className="notification-amount">{formatCurrency(notif.amount)}</span>
                            </div>
                            <div className="notification-item-details">
                              <span className="notification-due">
                                {notif.daysUntil === 0 ? 'Due today' :
                                 notif.daysUntil === 1 ? 'Due tomorrow' :
                                 `Due in ${notif.daysUntil} days`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {notifications.filter(n => n.type === 'upcoming').length > 0 && (
                    <div className="notification-section">
                      <h5 className="notification-section-title upcoming">📅 This Month</h5>
                      {notifications.filter(n => n.type === 'upcoming').map((notif, index) => {
                        const trip = trips.find(t => t.name === notif.tripName);
                        return (
                          <div
                            key={index}
                            className="notification-item upcoming clickable"
                            onClick={() => {
                              if (trip) {
                                handleViewTrip(trip);
                                setShowNotifications(false);
                              }
                            }}
                          >
                            <div className="notification-item-header">
                              <strong>{notif.tripName}</strong>
                              <span className="notification-amount">{formatCurrency(notif.amount)}</span>
                            </div>
                            <div className="notification-item-details">
                              <span className="notification-due">Due {formatDate(notif.dueDate)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button
            className="btn btn-icon"
            onClick={() => {
              setCurrentView('settings');
              setRouteHash('settings');
            }}
            title="Account Settings"
          >
            ⚙️
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
          <ProfileSettings onBack={handleBackToDashboard} onLogout={handleLogout} />
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fab-container">
        {showFabMenu && (
          <div className="fab-menu">
            <button
              className="fab-menu-item"
              onClick={() => {
                setShowWelcomeTour(true);
                setShowFabMenu(false);
              }}
            >
              <span className="fab-menu-icon">🎓</span>
              <span className="fab-menu-text">View Tour</span>
            </button>
            <button
              className="fab-menu-item"
              onClick={() => {
                setCurrentView('add');
                setRouteHash('add');
                setShowFabMenu(false);
              }}
            >
              <span className="fab-menu-icon">✈️</span>
              <span className="fab-menu-text">Add Trip</span>
            </button>
          </div>
        )}
        <button
          className="fab-button"
          onClick={() => setShowFabMenu(!showFabMenu)}
          title="Quick Actions"
        >
          {showFabMenu ? '✕' : '+'}
        </button>
      </div>

      {showWelcomeTour && <WelcomeTour onComplete={handleCompleteTour} user={currentUser} />}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
