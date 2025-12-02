import { useState } from 'react';

function WelcomeTour({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: ' Welcome to Your 2026 Travel Planner!',
      content: "We're excited to help you plan your adventures! Let's take a quick tour to show you around.",
      icon: '<â',
    },
    {
      title: 'ï Create Your First Trip',
      content: 'Click the "+ Add New Trip" button to start planning. Fill in details like destination, dates, costs, and more!',
      icon: '',
    },
    {
      title: '=∞ Track Payments',
      content: 'Add deposits and monthly payment plans. Use the recurring payment generator to automatically create payment schedules!',
      icon: '=≥',
    },
    {
      title: '=≈ Calendar View',
      content: 'Switch to Calendar View to see all your trips and payment due dates in one place. Perfect for planning!',
      icon: '=≈',
    },
    {
      title: '=˙ Explore Features',
      content: 'Check out the interactive world map, weather forecasts, currency converter, and more. Everything you need for travel planning!',
      icon: '<',
    },
    {
      title: '=Ò Use Anywhere',
      content: 'Access your trips on any device! Use Export/Import to transfer trips between your computer and phone.',
      icon: '=Ú',
    },
    {
      title: "<ä You're All Set!",
      content: "Ready to start planning your 2026 adventures? Click 'Get Started' to begin!",
      icon: '=Ä',
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
              ê Previous
            </button>
          )}

          {!isLastStep ? (
            <>
              <button className="btn btn-secondary" onClick={handleSkip}>
                Skip Tour
              </button>
              <button className="btn btn-primary" onClick={handleNext}>
                Next í
              </button>
            </>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={handleComplete}>
              Get Started! <â
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
          margin-bottom: 1rem;
          font-size: 1.75rem;
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
