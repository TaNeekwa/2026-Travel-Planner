import { useState } from 'react';
import { updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

function ProfileSettings({ onBack, onLogout }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [profileData, setProfileData] = useState({
    displayName: currentUser.displayName || '',
    email: currentUser.email || '',
    newPassword: '',
    confirmPassword: '',
    currentPassword: '',
  });

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
    setMessage('');
    setError('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Update display name
      if (profileData.displayName !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: profileData.displayName,
        });
        setMessage('Profile updated successfully!');
      }

      // Update email (requires recent authentication)
      if (profileData.email !== currentUser.email) {
        if (!profileData.currentPassword) {
          setError('Please enter your current password to change email');
          setLoading(false);
          return;
        }

        // Re-authenticate user
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          profileData.currentPassword
        );
        await reauthenticateWithCredential(currentUser, credential);

        await updateEmail(currentUser, profileData.email);
        setMessage('Email updated successfully!');
      }

      // Update password (requires recent authentication)
      if (profileData.newPassword) {
        if (profileData.newPassword !== profileData.confirmPassword) {
          setError('New passwords do not match');
          setLoading(false);
          return;
        }

        if (profileData.newPassword.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        if (!profileData.currentPassword) {
          setError('Please enter your current password to change password');
          setLoading(false);
          return;
        }

        // Re-authenticate user
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          profileData.currentPassword
        );
        await reauthenticateWithCredential(currentUser, credential);

        await updatePassword(currentUser, profileData.newPassword);
        setMessage('Password updated successfully!');

        // Clear password fields
        setProfileData({
          ...profileData,
          newPassword: '',
          confirmPassword: '',
          currentPassword: '',
        });
      }

      if (!profileData.newPassword && profileData.email === currentUser.email && profileData.displayName === currentUser.displayName) {
        setMessage('No changes to save');
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use by another account');
      } else if (error.code === 'auth/requires-recent-login') {
        setError('Please log out and log back in before changing email or password');
      } else {
        setError('Failed to update profile: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-settings">
      <div className="settings-header">
        <button className="btn btn-secondary" onClick={onBack}>
          � Back to Dashboard
        </button>
        <h2>Account Settings</h2>
      </div>

      <div className="settings-content">
        <div className="settings-card">
          <h3>Profile Information</h3>

          {message && (
            <div className="alert alert-success" style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              backgroundColor: '#d1fae5',
              color: '#065f46',
              borderRadius: '0.375rem',
              border: '1px solid #6ee7b7'
            }}>
              {message}
            </div>
          )}

          {error && (
            <div className="alert alert-error" style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '0.375rem',
              border: '1px solid #fca5a5'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleUpdateProfile}>
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="displayName">Display Name</label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={profileData.displayName}
                  onChange={handleChange}
                  placeholder="Your name"
                />
                <small>This name will be displayed in the app</small>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
                <small>Used for login and notifications</small>
              </div>
            </div>

            <div className="form-section">
              <h4>Change Password</h4>
              <p className="section-description">Leave blank if you don't want to change your password</p>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={profileData.newPassword}
                  onChange={handleChange}
                  placeholder="New password (min 6 characters)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="form-section">
              <h4>Verify Identity</h4>
              <p className="section-description">Required to change email or password</p>

              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={profileData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                />
                <small>Required when changing email or password</small>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={onBack}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="settings-card" style={{ marginTop: '1.5rem' }}>
          <h3>Account Information</h3>
          <div className="info-row">
            <span className="info-label">User ID:</span>
            <span className="info-value" style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {currentUser.uid}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Account Created:</span>
            <span className="info-value">
              {new Date(currentUser.metadata.creationTime).toLocaleDateString()}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Last Sign In:</span>
            <span className="info-value">
              {new Date(currentUser.metadata.lastSignInTime).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="settings-card" style={{ marginTop: '1.5rem', borderColor: '#ef4444' }}>
          <h3 style={{ color: '#ef4444' }}>Danger Zone</h3>
          <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
            Sign out of your account
          </p>
          <button
            className="btn btn-danger btn-lg"
            onClick={onLogout}
            style={{ width: '100%' }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;
