import { useState } from 'react';

function WelcomeTour({ onComplete, user }) {
  const [currentStep, setCurrentStep] = useState(0);

  // Extract first name from display name or email
  const getFirstName = () => {
    if (user?.displayName) {
      return user.displayName.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Traveler';
  };

  const firstName = getFirstName();

  const steps = [
    {
      title: `Welcome to our Travel Planner, ${firstName}!`,
      content: "We're excited to help you plan your adventures! Let's take a quick tour to show you around.",
      icon: '🎉',
    },
    {
      title: 'Create Your First Trip',
      content: 'Look at the top right corner - click the green "+ Add New Trip" button, or use the pink floating button in the bottom right corner. Fill in trip name, destination, dates, and costs. You can add as much or as little detail as you want!',
      icon: '✏️',
    },
    {
      title: 'Payment Plans',
      content: 'When creating a trip, scroll to "Monthly Payment Plan" section. Use the "Generate Recurring Payments" feature to automatically create weekly, bi-weekly, or monthly payment schedules!',
      icon: '💳',
    },
    {
      title: 'Calendar View',
      content: 'On the dashboard, click "Calendar View" to see all your trips AND payment due dates on a calendar. Navigate months to see your complete schedule!',
      icon: '📅',
    },
    {
      title: 'Interactive World Map',
      content: 'The dashboard shows your trips on a world map with animated markers! Switch between Street, Satellite, Terrain, and Dark map styles. Click any destination to explore TikTok travel content!',
      icon: '🗺️',
    },
    {
      title: 'Payment Notifications',
      content: 'Look for the bell icon in the header! It shows a badge with the number of upcoming payments. Click it to see which payments are due this week or this month.',
      icon: '🔔',
    },
    {
      title: 'Currency Converter & Budget',
      content: 'Scroll down on the dashboard to find the Budget Overview section. Here you can see your payment schedule and use the built-in currency converter to convert between 11+ currencies!',
      icon: '💱',
    },
    {
      title: 'Account Settings',
      content: 'Click the gear icon in the header to update your name, email, password, or add your phone number for future SMS payment reminders!',
      icon: '⚙️',
    },
    {
      title: "You're All Set!",
      content: 'Ready to start planning your 2026 adventures? Click "Get Started" to begin creating your first trip!',
      icon: '🚀',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleComplete = () => {
    onComplete();
  };

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="welcome-tour-overlay">
      <div className="welcome-tour-modal">
        <div className="welcome-tour-content">
          <div className="welcome-tour-icon">{step.icon}</div>
          <h2>{step.title}</h2>
          {isFirstStep && (
            <p className="built-by">Built by Naomi</p>
          )}
          <p>{step.content}</p>

          <div className="welcome-tour-progress">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index === currentStep ? 'active' : ''} ${
                  index < currentStep ? 'completed' : ''
                }`}
              />
            ))}
          </div>

          <div className="welcome-tour-step-counter">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        <div className="welcome-tour-actions">
          {!isFirstStep && (
            <button className="btn btn-secondary" onClick={handlePrevious}>
              Previous
            </button>
          )}

          {!isLastStep ? (
            <>
              <button className="btn btn-secondary" onClick={handleSkip}>
                Skip Tour
              </button>
              <button className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            </>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={handleComplete}>
              Get Started!
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .welcome-tour-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(4px);
        }

        .welcome-tour-modal {
          background: var(--surface);
          border-radius: 1rem;
          padding: 2rem;
          max-width: 600px;
          width: 90%;
          box-shadow: var(--shadow-lg);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .welcome-tour-content {
          text-align: center;
        }

        .welcome-tour-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: bounce 1s ease-in-out;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .welcome-tour-content h2 {
          color: var(--primary-color);
          margin-bottom: 0.5rem;
          font-size: 1.75rem;
        }

        .built-by {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-style: italic;
          margin-bottom: 1.5rem !important;
          opacity: 0.8;
        }

        .welcome-tour-content p {
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .welcome-tour-progress {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .progress-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: var(--border-color);
          transition: all 0.3s ease;
        }

        .progress-dot.active {
          background-color: var(--primary-color);
          transform: scale(1.3);
        }

        .progress-dot.completed {
          background-color: var(--success-color);
        }

        .welcome-tour-step-counter {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .welcome-tour-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          align-items: center;
        }

        .welcome-tour-actions button {
          min-width: 120px;
        }
      `}</style>
    </div>
  );
}

export default WelcomeTour;
