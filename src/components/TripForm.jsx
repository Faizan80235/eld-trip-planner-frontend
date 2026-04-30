import { useState, useRef, useEffect } from 'react';
import { MapPin, Clock, Truck, Loader2, Navigation } from 'lucide-react';
import './TripForm.css';

// Location Input with FAST autocomplete
function LocationInput({ label, icon: Icon, name, value, onChange, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  const cacheRef = useRef({});
  const abortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    if (cacheRef.current[query]) {
      setSuggestions(cacheRef.current[query]);
      setShowSuggestions(true);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1`,
        { signal: abortRef.current.signal }
      );

      const data = await res.json();

      const formatted = data.map((item) => {
        const addr = item.address;
        return {
          display:
            (addr.city || addr.town || addr.village || '') +
            (addr.state ? `, ${addr.state}` : '') +
            (addr.country ? `, ${addr.country}` : ''),
        };
      });

      const unique = formatted.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.display === item.display)
      );

      cacheRef.current[query] = unique;
      setSuggestions(unique);
      setShowSuggestions(true);
      setActiveIndex(-1);
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(e);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 200);
  };

  const handleSelect = (suggestion) => {
    onChange({ target: { name, value: suggestion.display } });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="form-group autocomplete-wrapper" ref={wrapperRef}>
      <label className="label-with-icon">
        {Icon && <Icon size={16} />}
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        autoComplete="off"
        required
      />

      {loading && (
        <div className="autocomplete-loading">
          <Loader2 size={16} className="spin" /> Searching...
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="autocomplete-list">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className={`autocomplete-item ${i === activeIndex ? 'active' : ''}`}
              onMouseDown={() => handleSelect(s)}
            >
              <MapPin size={14} /> {s.display}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// MAIN FORM
function TripForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_used: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="trip-form">
      <h2>Plan Your Trip</h2>
      <p className="form-subtitle">
        Enter trip details to generate HOS compliant route & log sheets
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">

          <LocationInput
            label="Current Location"
            icon={MapPin}
            name="current_location"
            value={formData.current_location}
            onChange={handleChange}
            placeholder="e.g. Chicago, IL"
          />

          <LocationInput
            label="Pickup Location"
            icon={Navigation}
            name="pickup_location"
            value={formData.pickup_location}
            onChange={handleChange}
            placeholder="e.g. Dallas, TX"
          />

          <LocationInput
            label="Dropoff Location"
            icon={Navigation}
            name="dropoff_location"
            value={formData.dropoff_location}
            onChange={handleChange}
            placeholder="e.g. New York, NY"
          />

          <div className="form-group">
            <label className="label-with-icon">
              <Clock size={16} />
              Current Cycle Used (Hours)
            </label>

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

            <span className="input-hint">
              Hours used in current 70hr/8-day cycle (0-70)
            </span>
          </div>

        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          <Truck size={16} />
          {loading ? ' Calculating...' : ' Calculate Route & Generate Logs'}
        </button>
      </form>
    </div>
  );
}

export default TripForm;