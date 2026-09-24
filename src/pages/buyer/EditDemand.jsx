import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BuyerNavbar from '../../components/buyer/BuyerNavbar';
import Map from '../../components/Map';
import { useGeolocation } from '../../hooks/useGeolocation';
import { demandService } from '../../services/demandService';

const MATERIALS = ['Pineapple Crowns', 'Corn Stalks', 'Corn Husks', 'Cosmetically-Rejected Produce', 'Sugarcane Bagasse'];

export default function EditDemand() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { position, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [demand, setDemand] = useState(null);

  const [form, setForm] = useState({
    material_type: MATERIALS[0],
    quantity_needed_kg: '',
    lat: '',
    lng: '',
    max_distance_km: '25',
    status: 'active'
  });

  useEffect(() => {
    async function loadDemand() {
      const { data, error } = await demandService.getDemandById(id);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (!data) {
        setError('Demand not found');
        setLoading(false);
        return;
      }

      setDemand(data);
      
      // Parse location from PostGIS format
      let lat = '', lng = '';
      if (data.location) {
        // Handle different location formats
        if (typeof data.location === 'string') {
          const match = data.location.match(/^POINT\s*\(\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\)$/i);
          if (match) {
            lng = match[1];
            lat = match[2];
          }
        } else if (typeof data.location === 'object' && data.location.coordinates) {
          // Handle GeoJSON format
          lng = data.location.coordinates[0];
          lat = data.location.coordinates[1];
        } else if (typeof data.location === 'object' && data.location.lat && data.location.lng) {
          // Handle object format
          lat = data.location.lat;
          lng = data.location.lng;
        }
      }

      setForm({
        material_type: data.material_type,
        quantity_needed_kg: data.quantity_needed_kg,
        lat,
        lng,
        max_distance_km: data.max_distance_km,
        status: data.status
      });
      setLoading(false);
    }
    loadDemand();
  }, [id]);

  useEffect(() => {
    if (position && !form.lat) {
      setForm((current) => ({ ...current, lat: position.lat.toFixed(6), lng: position.lng.toFixed(6) }));
    }
  }, [position]);

  const selectedPoint = useMemo(() => form.lat && form.lng ? { lat: Number(form.lat), lng: Number(form.lng) } : null, [form.lat, form.lng]);

  const handleMapClick = ({ lat, lng }) => setForm((current) => ({ ...current, lat: lat.toFixed(6), lng: lng.toFixed(6) }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const quantity = Number(form.quantity_needed_kg);
    const maxDistance = Number(form.max_distance_km);
    if (!quantity || quantity <= 0) return setError('Enter a quantity greater than 0 kg.');
    if (!maxDistance || maxDistance <= 0) return setError('Enter a maximum distance greater than 0 km.');
    if (!Number.isFinite(Number(form.lat)) || !Number.isFinite(Number(form.lng))) return setError('Set your location using GPS, the map pin, or the coordinate fields.');

    setSaving(true);
    const { error: saveError } = await demandService.updateDemand(id, {
      material_type: form.material_type,
      quantity_needed_kg: quantity,
      location: `POINT(${Number(form.lng)} ${Number(form.lat)})`,
      max_distance_km: maxDistance,
      status: form.status
    });
    setSaving(false);
    if (saveError) setError(saveError.message);
    else navigate('/buyer/dashboard');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this demand? This action cannot be undone.')) {
      return;
    }

    const { error } = await demandService.deleteDemand(id);
    if (error) {
      setError(error.message);
    } else {
      navigate('/buyer/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <BuyerNavbar />
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center py-20 text-gray-400">Loading demand...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <BuyerNavbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-2">
            Edit Demand
          </div>
          <h1 className="text-3xl font-extrabold text-[#143d2b]">Update Your Material Demand</h1>
          <p className="text-sm text-gray-500 mt-1">
            Modify your demand details to improve matching with suppliers.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-6">
          <section className="border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <Field label="Material Type">
              <select 
                value={form.material_type} 
                onChange={(e) => setForm({ ...form, material_type: e.target.value })} 
                className="input"
              >
                {MATERIALS.map((material) => <option key={material}>{material}</option>)}
              </select>
            </Field>
            <Field label="Quantity Needed (kg)">
              <input 
                className="input" 
                type="number" 
                min="0.01" 
                step="0.01" 
                required 
                value={form.quantity_needed_kg} 
                onChange={(e) => setForm({ ...form, quantity_needed_kg: e.target.value })} 
                placeholder="e.g. 500" 
              />
            </Field>
            <Field label="Maximum Distance (km)">
              <input 
                className="input" 
                type="number" 
                min="0.1" 
                step="0.1" 
                required 
                value={form.max_distance_km} 
                onChange={(e) => setForm({ ...form, max_distance_km: e.target.value })} 
                placeholder="e.g. 25" 
              />
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="input"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
            </Field>
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Demand Location</p>
                  <p className="text-xs text-blue-700 mt-1">
                    {geoError ? 'GPS unavailable — place the pin manually.' : selectedPoint ? `${Number(form.lat).toFixed(5)}, ${Number(form.lng).toFixed(5)}` : 'Detecting your current location...'}
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={requestLocation} 
                  disabled={geoLoading} 
                  className="shrink-0 px-3 py-2 rounded-lg bg-[#13422e] text-white text-xs font-bold"
                >
                  {geoLoading ? 'Detecting...' : 'Use GPS'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Latitude">
                <input 
                  className="input" 
                  required 
                  value={form.lat} 
                  onChange={(e) => setForm({ ...form, lat: e.target.value })} 
                  placeholder="8.1575" 
                />
              </Field>
              <Field label="Longitude">
                <input 
                  className="input" 
                  required 
                  value={form.lng} 
                  onChange={(e) => setForm({ ...form, lng: e.target.value })} 
                  placeholder="125.1278" 
                />
              </Field>
            </div>
            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex gap-3">
                <Link to="/buyer/dashboard" className="text-sm font-semibold text-gray-500 hover:text-gray-800">
                  Cancel
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-sm font-semibold text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
              <button 
                type="submit" 
                disabled={saving} 
                className="px-6 py-3 bg-[#13422e] hover:bg-[#0e3021] text-white text-sm font-semibold rounded-xl"
              >
                {saving ? 'Updating...' : 'Update Demand'}
              </button>
            </div>
          </section>
          <section>
            <div className="mb-3">
              <h2 className="text-lg font-bold text-[#143d2b]">Pin your location</h2>
              <p className="text-xs text-gray-500">GPS is attempted first. If permission is denied, click anywhere on the map to place the manual pin.</p>
            </div>
            <Map height="520px" selectedPoint={selectedPoint} onMapClick={handleMapClick} />
          </section>
        </form>
      </main>
    </div>
  );
}

function Field({ label, children }) { 
  return (
    <label className="block">
      <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{label}</span>
      {children}
    </label>
  );
}