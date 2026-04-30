// // import { useState } from 'react';
// // import './TripForm.css';

// // function TripForm({ onSubmit, loading }) {
// //   const [formData, setFormData] = useState({
// //     current_location: '',
// //     pickup_location: '',
// //     dropoff_location: '',
// //     current_cycle_used: 0,
// //   });

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     onSubmit(formData);
// //   };

// //   return (
// //     <div className="trip-form">
// //       <h2>Plan Your Trip</h2>
// //       <p className="form-subtitle">Enter trip details to generate HOS compliant route & log sheets</p>

// //       <form onSubmit={handleSubmit}>
// //         <div className="form-grid">

// //           <div className="form-group">
// //             <label>📍 Current Location</label>
// //             <input
// //               type="text"
// //               name="current_location"
// //               value={formData.current_location}
// //               onChange={handleChange}
// //               placeholder="e.g. Chicago, IL"
// //               required
// //             />
// //           </div>

// //           <div className="form-group">
// //             <label>🟢 Pickup Location</label>
// //             <input
// //               type="text"
// //               name="pickup_location"
// //               value={formData.pickup_location}
// //               onChange={handleChange}
// //               placeholder="e.g. Dallas, TX"
// //               required
// //             />
// //           </div>

// //           <div className="form-group">
// //             <label>🔴 Dropoff Location</label>
// //             <input
// //               type="text"
// //               name="dropoff_location"
// //               value={formData.dropoff_location}
// //               onChange={handleChange}
// //               placeholder="e.g. New York, NY"
// //               required
// //             />
// //           </div>

// //           <div className="form-group">
// //             <label>⏱️ Current Cycle Used (Hours)</label>
// //             <input
// //               type="number"
// //               name="current_cycle_used"
// //               value={formData.current_cycle_used}
// //               onChange={handleChange}
// //               min="0"
// //               max="70"
// //               step="0.5"
// //               required
// //             />
// //             <span className="input-hint">Hours used in current 70hr/8-day cycle (0-70)</span>
// //           </div>

// //         </div>

// //         <button type="submit" className="submit-btn" disabled={loading}>
// //           {loading ? '⏳ Calculating...' : '🚛 Calculate Route & Generate Logs'}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }

// // export default TripForm;



// import { useState, useRef, useEffect } from 'react';
// import './TripForm.css';

// // Reusable location input with autocomplete
// function LocationInput({ label, name, value, onChange, placeholder }) {
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const debounceRef = useRef(null);
//   const wrapperRef = useRef(null);

//   // Close suggestions when clicking outside
//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
//         setShowSuggestions(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const fetchSuggestions = async (query) => {
//     if (query.length < 2) {
//       setSuggestions([]);
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&countrycodes=us&addressdetails=1`,
//         { headers: { 'Accept-Language': 'en' } }
//       );
//       const data = await res.json();
//       const formatted = data.map((item) => {
//         const addr = item.address;
//         const parts = [];
//         if (addr.city || addr.town || addr.village) {
//           parts.push(addr.city || addr.town || addr.village);
//         }
//         if (addr.state) parts.push(addr.state);
//         if (addr.country) parts.push(addr.country);
//         return {
//           display: parts.join(', ') || item.display_name,
//           full: item.display_name,
//         };
//       });
//       // Remove duplicates
//       const unique = formatted.filter(
//         (item, index, self) =>
//           index === self.findIndex((t) => t.display === item.display)
//       );
//       setSuggestions(unique);
//       setShowSuggestions(true);
//     } catch (err) {
//       console.error('Geocoding error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const val = e.target.value;
//     onChange(e);
//     // Debounce API call by 300ms
//     clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(() => {
//       fetchSuggestions(val);
//     }, 300);
//   };

//   const handleSelect = (suggestion) => {
//     // Simulate an onChange event with selected value
//     onChange({ target: { name, value: suggestion.display } });
//     setSuggestions([]);
//     setShowSuggestions(false);
//   };

//   return (
//     <div className="form-group autocomplete-wrapper" ref={wrapperRef}>
//       <label>{label}</label>
//       <input
//         type="text"
//         name={name}
//         value={value}
//         onChange={handleInputChange}
//         onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
//         placeholder={placeholder}
//         required
//         autoComplete="off"
//       />
//       {loading && <div className="autocomplete-loading">Searching...</div>}
//       {showSuggestions && suggestions.length > 0 && (
//         <ul className="autocomplete-list">
//           {suggestions.map((s, i) => (
//             <li
//               key={i}
//               className="autocomplete-item"
//               onMouseDown={() => handleSelect(s)}
//             >
//               📍 {s.display}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// function TripForm({ onSubmit, loading }) {
//   const [formData, setFormData] = useState({
//     current_location: '',
//     pickup_location: '',
//     dropoff_location: '',
//     current_cycle_used: 0,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <div className="trip-form">
//       <h2>Plan Your Trip</h2>
//       <p className="form-subtitle">
//         Enter trip details to generate HOS compliant route & log sheets
//       </p>

//       <form onSubmit={handleSubmit}>
//         <div className="form-grid">

//           <LocationInput
//             label="📍 Current Location"
//             name="current_location"
//             value={formData.current_location}
//             onChange={handleChange}
//             placeholder="e.g. Chicago, IL"
//           />

//           <LocationInput
//             label="🟢 Pickup Location"
//             name="pickup_location"
//             value={formData.pickup_location}
//             onChange={handleChange}
//             placeholder="e.g. Dallas, TX"
//           />

//           <LocationInput
//             label="🔴 Dropoff Location"
//             name="dropoff_location"
//             value={formData.dropoff_location}
//             onChange={handleChange}
//             placeholder="e.g. New York, NY"
//           />

//           <div className="form-group">
//             <label>⏱️ Current Cycle Used (Hours)</label>
//             <input
//               type="number"
//               name="current_cycle_used"
//               value={formData.current_cycle_used}
//               onChange={handleChange}
//               min="0"
//               max="70"
//               step="0.5"
//               required
//             />
//             <span className="input-hint">
//               Hours used in current 70hr/8-day cycle (0-70)
//             </span>
//           </div>

//         </div>

//         <button type="submit" className="submit-btn" disabled={loading}>
//           {loading ? '⏳ Calculating...' : '🚛 Calculate Route & Generate Logs'}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default TripForm;




import { useState, useRef, useEffect } from 'react';
import './TripForm.css';

// Reusable location input with autocomplete
function LocationInput({ label, name, value, onChange, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );

      const data = await res.json();

      const formatted = data.map((item) => {
        const addr = item.address;
        const parts = [];

        if (addr.city || addr.town || addr.village) {
          parts.push(addr.city || addr.town || addr.village);
        }
        if (addr.state) parts.push(addr.state);
        if (addr.country) parts.push(addr.country);

        return {
          display: parts.join(', ') || item.display_name,
        };
      });

      const unique = formatted.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.display === item.display)
      );

      setSuggestions(unique);
      setShowSuggestions(true);
      setActiveIndex(-1);
    } catch (err) {
      console.error('Geocoding error:', err);
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
    }, 300);
  };

  const handleSelect = (suggestion) => {
    onChange({ target: { name, value: suggestion.display } });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        handleSelect(suggestions[activeIndex]);
      }
    }
  };

  return (
    <div className="form-group autocomplete-wrapper" ref={wrapperRef}>
      <label>{label}</label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        autoComplete="off"
        required
      />

      {loading && <div className="autocomplete-loading">Searching...</div>}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="autocomplete-list">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className={`autocomplete-item ${
                i === activeIndex ? 'active' : ''
              }`}
              onMouseDown={() => handleSelect(s)}
            >
              📍 {s.display}
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
            label="📍 Current Location"
            name="current_location"
            value={formData.current_location}
            onChange={handleChange}
            placeholder="e.g. Chicago, IL"
          />

          <LocationInput
            label="🟢 Pickup Location"
            name="pickup_location"
            value={formData.pickup_location}
            onChange={handleChange}
            placeholder="e.g. Dallas, TX"
          />

          <LocationInput
            label="🔴 Dropoff Location"
            name="dropoff_location"
            value={formData.dropoff_location}
            onChange={handleChange}
            placeholder="e.g. New York, NY"
          />

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
            <span className="input-hint">
              Hours used in current 70hr/8-day cycle (0-70)
            </span>
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