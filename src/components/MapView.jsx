import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createIcon = (color, emoji) => L.divIcon({
  html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${emoji}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: '',
});

const currentIcon = createIcon('#3182ce', '📍');
const pickupIcon = createIcon('#38a169', '🟢');
const dropoffIcon = createIcon('#e53e3e', '🔴');
const restIcon = createIcon('#d69e2e', '😴');
const fuelIcon = createIcon('#805ad5', '⛽');

function MapView({ routeData, stops }) {
  if (!routeData || !routeData.waypoints || routeData.waypoints.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
        <p style={{ fontSize: '3rem' }}>🗺️</p>
        <p>Map data not available</p>
      </div>
    );
  }

  const waypoints = routeData.waypoints;
  const center = [
    waypoints[1]?.coords[1] || 39.5,
    waypoints[1]?.coords[0] || -98.35
  ];

  // Route line coordinates
  const routeCoords = waypoints.map(wp => [wp.coords[1], wp.coords[0]]);

  const getIcon = (type) => {
    if (type === 'current') return currentIcon;
    if (type === 'pickup') return pickupIcon;
    if (type === 'dropoff') return dropoffIcon;
    return currentIcon;
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: '#718096' }}>📍 Current &nbsp; 🟢 Pickup &nbsp; 🔴 Dropoff</span>
        <span style={{ fontSize: '0.8rem', color: '#718096', marginLeft: 'auto' }}>
          Total: <strong>{routeData.total_miles} miles</strong>
        </span>
      </div>

      <MapContainer
        center={center}
        zoom={5}
        style={{ height: '450px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Route Line */}
        <Polyline
          positions={routeCoords}
          color="#2b6cb0"
          weight={4}
          opacity={0.8}
          dashArray="10, 5"
        />

        {/* Waypoint Markers */}
        {waypoints.map((wp, index) => (
          <Marker
            key={index}
            position={[wp.coords[1], wp.coords[0]]}
            icon={getIcon(wp.type)}
          >
            <Popup>
              <strong>{wp.name}</strong><br />
              <span style={{ textTransform: 'capitalize', color: '#718096' }}>{wp.type}</span>
            </Popup>
          </Marker>
        ))}


      </MapContainer>


      {/* Route Info */}
      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
        <div style={{ background: '#f7fafc', padding: '0.8rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.75rem', color: '#718096' }}>Miles to Pickup</p>
          <p style={{ fontWeight: '700', color: '#1a365d' }}>{routeData.miles_to_pickup} mi</p>
        </div>
        <div style={{ background: '#f7fafc', padding: '0.8rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.75rem', color: '#718096' }}>Pickup to Dropoff</p>
          <p style={{ fontWeight: '700', color: '#1a365d' }}>{routeData.miles_pickup_to_dropoff} mi</p>
        </div>
      </div>
    </div>
  );
}

export default MapView;