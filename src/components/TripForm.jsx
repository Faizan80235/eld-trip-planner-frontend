import { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Circle, CircleDot, Clock, Truck, Loader2 } from 'lucide-react';
import './TripForm.css';

function isValidLocation(value) {
  if (!value) return false;

  const trimmed = value.trim();

  if (trimmed.length < 4) return false;

  if (!/[a-zA-Z]/.test(trimmed)) return false;

  if (!/^[a-zA-Z\s,.-]+$/.test(trimmed)) return false;

  const words = trimmed.split(" ").filter(w => w.length > 1);
  if (words.length < 1) return false;

  return true;
}

function LocationInput({ label, icon: Icon, iconColor, name, value, onChange, placeholder }) {
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
        {
          signal: abortRef.current.signal,
          headers: { 'Accept-Language': 'en' },
        }
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
      if (err.name !== 'AbortError') {
        console.error(err);
      }
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

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) handleSelect(suggestions[activeIndex]);
    }
  };

  return (
    <div className="form-group autocomplete-wrapper" ref={wrapperRef}>
      <label className="form-label">
        {Icon && <Icon size={15} color={iconColor} strokeWidth={2} />}
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length && setShowSuggestions(true)}
        placeholder={placeholder}
        autoComplete="off"
        required
      />

      {loading && (
        <div className="autocomplete-loading">
          <Loader2 size={13} className="spin" />
          Searching...
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="autocomplete-list">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className={i === activeIndex ? 'active' : ''}
              onMouseDown={() => handleSelect(s)}
            >
              <MapPin size={13} />
              {s.display}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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

  const isFormValid =
    isValidLocation(formData.current_location) &&
    isValidLocation(formData.pickup_location) &&
    isValidLocation(formData.dropoff_location);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("Invalid input. Please enter real city names like Chicago, IL or Lahore, Punjab");
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="trip-form">
      <h2>Plan Your Trip</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">

          <LocationInput
            label="Current Location"
            icon={Navigation}
            iconColor="#185FA5"
            name="current_location"
            value={formData.current_location}
            onChange={handleChange}
            placeholder="e.g. Chicago, IL"
          />

          <LocationInput
            label="Pickup Location"
            icon={CircleDot}
            iconColor="#3B6D11"
            name="pickup_location"
            value={formData.pickup_location}
            onChange={handleChange}
            placeholder="e.g. Dallas, TX"
          />

          <LocationInput
            label="Dropoff Location"
            icon={Circle}
            iconColor="#A32D2D"
            name="dropoff_location"
            value={formData.dropoff_location}
            onChange={handleChange}
            placeholder="e.g. New York, NY"
          />

          <div className="form-group">
            <label className="form-label">
              <Clock size={15} />
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
          </div>

        </div>
         
        <button type="submit" disabled={loading || !isFormValid} className='submit-btn'>
          {loading ? 'Calculating...' : 'Calculate Route'}
        </button>
      </form>
    </div>
  );
}

export default TripForm;