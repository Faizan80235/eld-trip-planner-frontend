import { useState } from 'react';
import TripForm from './components/TripForm';
import MapView from './components/MapView';
import LogSheet from './components/LogSheet';
import StopsSummary from './components/StopsSummary';
import { calculateRoute } from './api';
import './App.css';

function App() {
  const [tripResult, setTripResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('map');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setTripResult(null);

    try {
      const result = await calculateRoute(formData);
      setTripResult(result);
      setActiveTab('map');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🚛</span>
            <div>
              <h1>ELD Trip Planner</h1>
              <p>HOS Compliant Route Planning</p>
            </div>
          </div>
          <div className="header-badge">70hr/8-day Rule</div>
        </div>
      </header>

      <main className="main">
        {/* Trip Form */}
        <div className="form-section">
          <TripForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Error */}
        {error && (
          <div className="error-box">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Calculating your HOS compliant route...</p>
          </div>
        )}

        {/* Results */}
        {tripResult && (
          <div className="results-section">

            {/* Summary Cards */}
            <div className="summary-cards">
              <div className="card">
                <span className="card-icon">📍</span>
                <div>
                  <p className="card-label">Total Miles</p>
                  <p className="card-value">{tripResult.summary.total_miles} mi</p>
                </div>
              </div>
              <div className="card">
                <span className="card-icon">⏱️</span>
                <div>
                  <p className="card-label">Total Hours</p>
                  <p className="card-value">{tripResult.summary.total_hours?.toFixed(1)} hrs</p>
                </div>
              </div>
              <div className="card">
                <span className="card-icon">📅</span>
                <div>
                  <p className="card-label">Total Days</p>
                  <p className="card-value">{tripResult.summary.total_days} days</p>
                </div>
              </div>
              <div className="card">
                <span className="card-icon">🛑</span>
                <div>
                  <p className="card-label">Total Stops</p>
                  <p className="card-value">{tripResult.summary.stops_count}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'map' ? 'active' : ''}`}
                onClick={() => setActiveTab('map')}
              >
                🗺️ Route Map
              </button>
              <button
                className={`tab ${activeTab === 'stops' ? 'active' : ''}`}
                onClick={() => setActiveTab('stops')}
              >
                🛑 Stops
              </button>
              <button
                className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
                onClick={() => setActiveTab('logs')}
              >
                📋 Daily Logs
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'map' && (
                <MapView routeData={tripResult.route} stops={tripResult.trip_schedule.stops} />
              )}
              {activeTab === 'stops' && (
                <StopsSummary stops={tripResult.trip_schedule.stops} />
              )}
              {activeTab === 'logs' && (
                <LogSheet dailyLogs={tripResult.daily_logs} />
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;