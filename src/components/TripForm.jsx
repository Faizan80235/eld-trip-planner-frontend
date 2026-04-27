import { useState } from 'react';
import './TripForm.css';

function TripForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_used: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="trip-form">
      <h2>Plan Your Trip</h2>
      <p className="form-subtitle">Enter trip details to generate HOS compliant route & log sheets</p>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">

          <div className="form-group">
            <label>📍 Current Location</label>
            <input
              type="text"
              name="current_location"
              value={formData.current_location}
              onChange={handleChange}
              placeholder="e.g. Chicago, IL"
              required
            />
          </div>

          <div className="form-group">
            <label>🟢 Pickup Location</label>
            <input
              type="text"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              placeholder="e.g. Dallas, TX"
              required
            />
          </div>

          <div className="form-group">
            <label>🔴 Dropoff Location</label>
            <input
              type="text"
              name="dropoff_location"
              value={formData.dropoff_location}
              onChange={handleChange}
              placeholder="e.g. New York, NY"
              required
            />
          </div>

          <div className="form-group">
            <label>⏱️ Current Cycle Used (Hours)</label>
            <input
              type="number"
              name="current_cycle_used"
              value={formData.current_cycle_used}
              onChange={handleChange}
              min="0"
              max="70"
              step="0.5"
              required
            />
            <span className="input-hint">Hours used in current 70hr/8-day cycle (0-70)</span>
          </div>

        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '⏳ Calculating...' : '🚛 Calculate Route & Generate Logs'}
        </button>
      </form>
    </div>
  );
}

export default TripForm;