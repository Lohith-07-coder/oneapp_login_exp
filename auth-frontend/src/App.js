import React, { useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api/auth';

async function requestAuth(path, payload) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

function App() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')));

  const isLogin = mode === 'login';

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setMessage('');
    setMessageType('');
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!name || !email || !password) {
      showMessage('Please fill in name, email, and password.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const res = await requestAuth('/register', { name, email, password });

      showMessage(`Registered ${res.email}. You can log in now.`, 'success');
      setMode('login');
    } catch (err) {
      showMessage(err.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      showMessage('Please enter your email and password.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const res = await requestAuth('/login', { email, password });

      localStorage.setItem('token', res.token);
      setIsLoggedIn(true);
      setMessage('');
      setMessageType('');
    } catch (err) {
      showMessage(err.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setPassword('');
    switchMode('login');
  };

  if (isLoggedIn) {
    return (
      <main className="welcome-shell">
        <section className="welcome-card landing-card">
          <header className="landing-nav">
            <div className="brand-mark">
              <span className="brand-icon">O</span>
              <div>
                <p className="brand-title">OneApp</p>
                <p className="brand-subtitle">BMSCE</p>
              </div>
            </div>

            <nav className="landing-links" aria-label="Welcome shortcuts">
              <span>Campus</span>
              <span>Clubs</span>
              <span>Placements</span>
              <span>Support</span>
            </nav>

            <button type="button" className="nav-signout" onClick={handleLogout}>
              Logout
            </button>
          </header>

          <div className="landing-grid">
            <section className="landing-copy-block">
              <p className="welcome-kicker">Student portal</p>
              <h1>Welcome to OneApp BMSCE.</h1>
              <p className="welcome-copy">
                Your campus companion for B.M.S. College of Engineering, Bengaluru. Stay connected
                with academics, student updates, events, and everyday resources from one place.
              </p>

              <div className="landing-search" aria-hidden="true">
                <span>Explore departments, notices, and campus life</span>
                <span className="search-icon">Q</span>
              </div>

              <div className="landing-actions">
                <button type="button" className="submit-button">
                  Explore portal
                </button>
                <button type="button" className="ghost-button" onClick={handleLogout}>
                  Sign out
                </button>
              </div>
            </section>

            <section className="landing-visual" aria-hidden="true">
              <div className="line-art art-one" />
              <div className="line-art art-two" />
              <div className="landing-panel">
                <p className="panel-kicker">BMSCE</p>
                <h2>Learning, innovation, and campus life.</h2>
                <p>
                  Discover academic departments, student communities, cultural events, and important
                  updates designed for the BMSCE experience.
                </p>
              </div>
            </section>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-shell">
      <section className="auth-hero">
        <p className="auth-kicker">Secure access</p>
        <h1>Welcome back to OneApp BMSCE.</h1>
        <p className="auth-copy">
          Sign in or create your account to access campus updates, student resources, clubs, and
          academic information in one place.
        </p>
        <div className="auth-orbs" aria-hidden="true">
          <span className="orb orb-one" />
          <span className="orb orb-two" />
          <span className="orb orb-three" />
        </div>
      </section>

      <section className="auth-card">
        <div className="mode-switch" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={isLogin ? 'mode-button active' : 'mode-button'}
            onClick={() => switchMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={!isLogin ? 'mode-button active' : 'mode-button'}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        <div className="auth-heading">
          <h2>{isLogin ? 'Sign in' : 'Create account'}</h2>
          <p>
            {isLogin
              ? 'Use your BMSCE portal credentials to continue.'
              : 'Create your OneApp account in a few seconds.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin ? (
            <>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                value={name}
                placeholder="Lohith"
                onChange={(e) => setName(e.target.value)}
              />
            </>
          ) : null}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="lohith@test.com"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {message ? <div className={`auth-message ${messageType}`}>{message}</div> : null}

          <button className="submit-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;
