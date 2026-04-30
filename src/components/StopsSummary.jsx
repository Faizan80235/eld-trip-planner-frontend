


import { Truck, BedDouble, Coffee, Fuel, ArrowRight, ArrowLeft, RefreshCw, Clock, MapPin } from 'lucide-react';
import './StopsSummary.css';

const STOP_CONFIG = {
  pickup:      { color: '#3B6D11', bg: '#EAF3DE', Icon: ArrowRight,  label: 'Pickup' },
  dropoff:     { color: '#A32D2D', bg: '#FCEBEB', Icon: ArrowLeft,   label: 'Dropoff' },
  driving:     { color: '#185FA5', bg: '#E6F1FB', Icon: Truck,       label: 'Driving' },
  rest:        { color: '#854F0B', bg: '#FAEEDA', Icon: Coffee,      label: 'Break' },
  sleep:       { color: '#534AB7', bg: '#EEEDFE', Icon: BedDouble,   label: 'Rest' },
  fuel:        { color: '#3B6D11', bg: '#EAF3DE', Icon: Fuel,        label: 'Fuel' },
  cycle_reset: { color: '#A32D2D', bg: '#FCEBEB', Icon: RefreshCw,   label: 'Cycle Reset' },
};

function StopsSummary({ stops }) {
  if (!stops || stops.length === 0) {
    return <p>No stops data available</p>;
  }

  const importantStops = stops.filter(s => s.type !== 'driving');
  const drivingSegments = stops.filter(s => s.type === 'driving');
  const totalDrivingHours = drivingSegments.reduce((sum, s) => sum + s.duration, 0);

  const stats = [
    {
      Icon: Truck,
      iconBg: '#E6F1FB',
      iconColor: '#185FA5',
      label: 'Drive time',
      value: `${totalDrivingHours.toFixed(1)} hrs`,
    },
    {
      Icon: BedDouble,
      iconBg: '#EEEDFE',
      iconColor: '#534AB7',
      label: 'Rest stops',
      value: stops.filter(s => s.type === 'sleep').length,
    },
    {
      Icon: Coffee,
      iconBg: '#FAEEDA',
      iconColor: '#854F0B',
      label: 'Breaks',
      value: stops.filter(s => s.type === 'rest').length,
    },
    {
      Icon: Fuel,
      iconBg: '#EAF3DE',
      iconColor: '#3B6D11',
      label: 'Fuel stops',
      value: stops.filter(s => s.type === 'fuel').length,
    },
  ];

  return (
    <div className="stops-summary">

      {/* Stats Row */}
      <div className="stops-stats">
        {stats.map(({ Icon, iconBg, iconColor, label, value }, i) => (
          <div className="stat" key={i}>
            <div className="stat-icon-wrap" style={{ background: iconBg }}>
              <Icon size={18} color={iconColor} strokeWidth={2} />
            </div>
            <div>
              <p className="stat-label">{label}</p>
              <p className="stat-value">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="stops-timeline">
        <h3>Trip timeline</h3>

        {importantStops.map((stop, index) => {
          const config = STOP_CONFIG[stop.type] || STOP_CONFIG.rest;
          const { Icon, color, label } = config;

          return (
            <div
              key={index}
              className="stop-item"
              style={{ borderLeft: `3px solid ${color}` }}
            >
              <div className="stop-header">
                <Icon size={14} color={color} strokeWidth={2} />
                <span className="stop-type" style={{ color }}>
                  {label}
                </span>
                <span className="stop-day">Day {stop.day}</span>
              </div>

              <p className="stop-location">{stop.location}</p>

              <div className="stop-meta">
                <span className="stop-meta-item">
                  <Clock size={12} strokeWidth={2} />
                  {stop.duration < 1
                    ? `${stop.duration * 60} min`
                    : `${stop.duration} hrs`}
                </span>
                <span className="stop-meta-item">
                  <MapPin size={12} strokeWidth={2} />
                  Mile {stop.miles_from_start?.toFixed(0)}
                </span>
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