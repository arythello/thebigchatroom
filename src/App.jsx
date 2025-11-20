import React from 'react';
import './App.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import SignIn from './components/SignIn';
import ChatRoom from './components/ChatRoom';
import UsernameForm from './components/UsernameForm';
import { sendEmailVerification } from 'firebase/auth';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div className="App"><div className="loading">Loading...</div></div>;
  }

  // 1. Check if user is logged in
  if (!user) {
    return (
      <div className="App">
        <SignIn />
      </div>
    );
  }

  // 2. Check Email Verification (only for password users)
  if (!user.emailVerified && user.providerData.some(provider => provider.providerId === 'password')) {
    return (
      <div className="App">
        <div className="sign-in-container">
          <h1>Verify your Email</h1>
          <p>We sent a verification email to <strong>{user.email}</strong>.</p>
          <p>Please check your inbox (and spam folder) and click the link to activate your account.</p>

          <div className="auth-buttons">
            <button
              className="sign-in-btn"
              onClick={() => window.location.reload()}
              style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
            >
              I've Verified My Email
            </button>

            <button
              className="sign-in-btn"
              onClick={() => sendEmailVerification(user)}
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }}
            >
              Resend Email
            </button>

            <button
              className="sign-out"
              onClick={() => auth.signOut()}
              style={{ marginTop: '20px', color: 'var(--error-color)' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Check if Username is set
  if (!user.displayName) {
    return (
      <div className="App">
        <UsernameForm user={user} />
      </div>
    );
  }

  // 4. Show Chat Room
  return (
    <div className="App">
      <ChatRoom />
    </div>
  );
}

export default App;
