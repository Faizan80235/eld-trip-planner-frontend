import './StopsSummary.css';

const STOP_COLORS = {
  pickup: { bg: '#c6f6d5', color: '#276749', icon: '🟢' },
  dropoff: { bg: '#fed7d7', color: '#9b2c2c', icon: '🔴' },
  driving: { bg: '#bee3f8', color: '#2c5282', icon: '🚛' },
  rest: { bg: '#fefcbf', color: '#744210', icon: '☕' },
  sleep: { bg: '#e9d8fd', color: '#553c9a', icon: '😴' },
  fuel: { bg: '#fbd38d', color: '#7b341e', icon: '⛽' },
  cycle_reset: { bg: '#fed7d7', color: '#9b2c2c', icon: '🔄' },
};

function StopsSummary({ stops }) {
  if (!stops || stops.length === 0) {
    return <p>No stops data available</p>;
  }

  // Filter out driving segments for cleaner view
  const importantStops = stops.filter(s => s.type !== 'driving');
  const drivingSegments = stops.filter(s => s.type === 'driving');

  const totalDrivingHours = drivingSegments.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="stops-summary">

      {/* Stats Row */}
      <div className="stops-stats">
        <div className="stat">
          <span className="stat-icon">🚛</span>
          <div>
            <p className="stat-label">Drive Time</p>
            <p className="stat-value">{totalDrivingHours.toFixed(1)} hrs</p>
          </div>
        </div>
        <div className="stat">
          <span className="stat-icon">😴</span>
          <div>
            <p className="stat-label">Rest Stops</p>
            <p className="stat-value">{stops.filter(s => s.type === 'sleep').length}</p>
          </div>
        </div>
        <div className="stat">
          <span className="stat-icon">☕</span>
          <div>
            <p className="stat-label">Breaks</p>
            <p className="stat-value">{stops.filter(s => s.type === 'rest').length}</p>
          </div>
        </div>
        <div className="stat">
          <span className="stat-icon">⛽</span>
          <div>
            <p className="stat-label">Fuel Stops</p>
            <p className="stat-value">{stops.filter(s => s.type === 'fuel').length}</p>
          </div>
        </div>
      </div>

      {/* Stops Timeline */}
      <div className="stops-timeline">
        <h3>Trip Timeline</h3>
        {importantStops.map((stop, index) => {
          const style = STOP_COLORS[stop.type] || STOP_COLORS.rest;
          return (
            <div key={index} className="stop-item" style={{ borderLeft: `4px solid ${style.color}` }}>
              <div className="stop-header">
                <span className="stop-icon">{style.icon}</span>
                <span className="stop-type" style={{ color: style.color }}>
                  {stop.type.replace('_', ' ').toUpperCase()}
                </span>
                <span className="stop-day">Day {stop.day}</span>
              </div>
              <p className="stop-location">{stop.location}</p>
              <div className="stop-meta">
                <span>⏱️ {stop.duration < 1 ? `${stop.duration * 60} min` : `${stop.duration} hrs`}</span>
                <span>📍 Mile {stop.miles_from_start?.toFixed(0)}</span>
              </div>
              <p className="stop-desc">{stop.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StopsSummary;