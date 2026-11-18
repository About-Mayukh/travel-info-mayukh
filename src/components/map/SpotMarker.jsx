import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/format';

// Custom SVG Icon for Leaflet pin
const createCustomPin = (category = 'heritage') => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: linear-gradient(135deg, #0d9488, #0f766e);
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(13, 148, 136, 0.4);
        border: 2px solid #ffffff;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: #f97316;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export function SpotMarker({ spot }) {
  const navigate = useNavigate();

  if (!spot.latitude || !spot.longitude) return null;

  return (
    <Marker
      position={[spot.latitude, spot.longitude]}
      icon={createCustomPin(spot.category)}
    >
      <Popup className="custom-spot-popup">
        <div className="w-56 p-1 flex flex-col gap-2 font-sans select-none">
          <img
            src={spot.cover_image}
            alt={spot.name}
            className="w-full h-28 object-cover rounded-lg"
          />
          <div>
            <h5 className="font-bold text-sm text-slate-900 leading-tight">
              {spot.name}
            </h5>
            <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
              <span className="font-bold text-teal-700">
                {spot.adult_price > 0 ? formatCurrency(spot.adult_price) : 'Free'}
              </span>
              <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                {spot.average_rating || 5.0}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate(`/spot/${spot.id}`)}
            className="mt-1 w-full py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </Popup>
    </Marker>
  );
}

export default SpotMarker;
