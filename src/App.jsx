import { useState } from 'react';
import TripForm from './components/TripForm';
import MapView from './components/MapView';
import LogSheet from './components/LogSheet';
import StopsSummary from './components/StopsSummary';
import { calculateRoute } from './api';

import {
  Truck,
  Map,
  ListChecks,
  FileText,
  AlertTriangle,
  Loader2,
  Calendar,
  Route
} from 'lucide-react';

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

      {/* HEADER */}
      <header className="header">
        <div className="header-content">

          <div className="logo">
            <Truck className="logo-icon" size={28} />
            <div>
              <h1>ELD Trip Planner</h1>
              <p>HOS Compliant Route Planning</p>
            </div>
          </div>

          <div className="header-badge">
            <Calendar size={14} />
            70hr/8-day Rule
          </div>

        </div>
      </header>

      <main className="main">

        {/* FORM */}
        <div className="form-section">
          <TripForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* ERROR */}
        {error && (
          <div className="error-box">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="loading-box">
            <Loader2 className="spin" size={20} />
            <p>Calculating your HOS compliant route...</p>
          </div>
        )}

        {/* RESULTS */}
        {tripResult && (
          <div className="results-section">

            {/* SUMMARY CARDS */}
            <div className="summary-cards">

              <div className="card">
                <Route className="card-icon" />
                <div>
                  <p className="card-label">Total Miles</p>
                  <p className="card-value">{tripResult.summary.total_miles} mi</p>
                </div>
              </div>

              <div className="card">
                <Loader2 className="card-icon" />
                <div>
                  <p className="card-label">Total Hours</p>
                  <p className="card-value">{tripResult.summary.total_hours?.toFixed(1)} hrs</p>
                </div>
              </div>

              <div className="card">
                <Calendar className="card-icon" />
                <div>
                  <p className="card-label">Total Days</p>
                  <p className="card-value">{tripResult.summary.total_days} days</p>
                </div>
              </div>

              <div className="card">
                <ListChecks className="card-icon" />
                <div>
                  <p className="card-label">Total Stops</p>
                  <p className="card-value">{tripResult.summary.stops_count}</p>
                </div>
              </div>

            </div>

            {/* TABS */}
            <div className="tabs">

              <button
                className={`tab ${activeTab === 'map' ? 'active' : ''}`}
                onClick={() => setActiveTab('map')}
              >
                <Map size={16} />
                Route Map
              </button>

              <button
                className={`tab ${activeTab === 'stops' ? 'active' : ''}`}
                onClick={() => setActiveTab('stops')}
              >
                <ListChecks size={16} />
                Stops
              </button>

              <button
                className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
                onClick={() => setActiveTab('logs')}
              >
                <FileText size={16} />
                Daily Logs
              </button>

            </div>

            {/* CONTENT */}
            <div className="tab-content">

              {activeTab === 'map' && (
                <MapView
                  routeData={tripResult.route}
                  stops={tripResult.trip_schedule.stops}
                />
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