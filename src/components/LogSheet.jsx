import './LogSheet.css';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function LogGrid({ offDuty, sleeper, driving, onDuty }) {
  const renderRow = (segments, color) => (
    <div className="log-row">
      {HOURS.map(hour => {
        const isActive = segments?.some(seg => hour >= seg.start && hour < seg.end);
        return (
          <div
            key={hour}
            className={`log-cell ${isActive ? 'active' : ''}`}
            style={{ backgroundColor: isActive ? color : 'transparent' }}
          />
        );
      })}
    </div>
  );

  return (
    <div className="log-grid">
      {/* Hour Headers */}
      <div className="log-header-row">
        <div className="log-label">Mid-<br/>night</div>
        {[1,2,3,4,5,6,7,8,9,10,11,'Noon',1,2,3,4,5,6,7,8,9,10,11,'Mid-\nnight'].map((h, i) => (
          <div key={i} className="log-hour">{h}</div>
        ))}
      </div>

      {/* Rows */}
      <div className="log-row-wrapper">
        <div className="log-label">1. Off Duty</div>
        {renderRow(offDuty, '#93c5fd')}
      </div>
      <div className="log-row-wrapper">
        <div className="log-label">2. Sleeper<br/>Berth</div>
        {renderRow(sleeper, '#6ee7b7')}
      </div>
      <div className="log-row-wrapper">
        <div className="log-label">3. Driving</div>
        {renderRow(driving, '#fbbf24')}
      </div>
      <div className="log-row-wrapper">
        <div className="log-label">4. On Duty<br/>(Not Driving)</div>
        {renderRow(onDuty, '#f87171')}
      </div>
    </div>
  );
}

function LogSheet({ dailyLogs }) {
  if (!dailyLogs || dailyLogs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
        <p style={{ fontSize: '3rem' }}>📋</p>
        <p>No log data available</p>
      </div>
    );
  }

  return (
    <div className="log-sheets">
      <div className="log-legend">
        <span className="legend-item"><span className="legend-color" style={{background:'#93c5fd'}}></span> Off Duty</span>
        <span className="legend-item"><span className="legend-color" style={{background:'#6ee7b7'}}></span> Sleeper Berth</span>
        <span className="legend-item"><span className="legend-color" style={{background:'#fbbf24'}}></span> Driving</span>
        <span className="legend-item"><span className="legend-color" style={{background:'#f87171'}}></span> On Duty (Not Driving)</span>
      </div>

      {dailyLogs.map((log, index) => (
        <div key={index} className="log-sheet">

          {/* Log Header */}
          <div className="log-sheet-header">
            <div className="log-title">
              <h3>DRIVER'S DAILY LOG</h3>
              <p>U.S. Department of Transportation — FMCSA</p>
            </div>
            <div className="log-day-badge">Day {log.day}</div>
          </div>

          {/* Log Info */}
          <div className="log-info-grid">
            <div className="log-info-item">
              <span className="log-info-label">Date</span>
              <span className="log-info-value">Day {log.day} of Trip</span>
            </div>
            <div className="log-info-item">
              <span className="log-info-label">Total Miles</span>
              <span className="log-info-value">{log.total_miles?.toFixed(0) || 0} mi</span>
            </div>
            <div className="log-info-item">
              <span className="log-info-label">Carrier</span>
              <span className="log-info-value">ELD Trip Planner</span>
            </div>
            <div className="log-info-item">
              <span className="log-info-label">Rule Used</span>
              <span className="log-info-value">70hr / 8-day</span>
            </div>
          </div>

          {/* Grid */}
          <div className="log-grid-container">
            <LogGrid
              offDuty={log.off_duty}
              sleeper={log.sleeper_berth}
              driving={log.driving}
              onDuty={log.on_duty_not_driving}
            />
          </div>

          {/* Remarks */}
          {log.remarks && log.remarks.length > 0 && (
            <div className="log-remarks">
              <strong>Remarks:</strong>
              <div className="remarks-list">
                {log.remarks.map((remark, i) => (
                  <p key={i} className="remark-item">• {remark}</p>
                ))}
              </div>
            </div>
          )}

          {/* Hours Summary */}
          <div className="log-hours-summary">
            <div className="hours-item">
              <div className="hours-bar" style={{width: `${(log.driving?.reduce((s,d) => s + (d.end-d.start), 0) || 0) / 24 * 100}%`, background:'#fbbf24'}}></div>
              <span>Driving: {log.driving?.reduce((s,d) => s + (d.end-d.start), 0).toFixed(1) || 0} hrs</span>
            </div>
            <div className="hours-item">
              <div className="hours-bar" style={{width: `${(log.on_duty_not_driving?.reduce((s,d) => s + (d.end-d.start), 0) || 0) / 24 * 100}%`, background:'#f87171'}}></div>
              <span>On Duty: {log.on_duty_not_driving?.reduce((s,d) => s + (d.end-d.start), 0).toFixed(1) || 0} hrs</span>
            </div>
            <div className="hours-item">
              <div className="hours-bar" style={{width: `${(log.off_duty?.reduce((s,d) => s + (d.end-d.start), 0) || 0) / 24 * 100}%`, background:'#93c5fd'}}></div>
              <span>Off Duty: {log.off_duty?.reduce((s,d) => s + (d.end-d.start), 0).toFixed(1) || 0} hrs</span>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}

export default LogSheet;