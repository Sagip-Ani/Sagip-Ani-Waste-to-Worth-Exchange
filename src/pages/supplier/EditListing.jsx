import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { listingService } from '../../services/listingService';
import SupplierNavbar from '../../components/supplier/SupplierNavbar';

export default function EditListing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [error, setError] = useState('');
  const [listing, setListing] = useState(null);

  const [formData, setFormData] = useState({
    material_type: 'Pineapple Crowns',
    quantity_kg: '',
    available_from: '',
    available_until: '',
    lat: '',
    lng: '',
    status: 'listed'
  });

  useEffect(() => {
    async function loadListing() {
      const { data, error } = await listingService.getListingById(id);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (!data) {
        setError('Listing not found');
        setLoading(false);
        return;
      }

      setListing(data);
      
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

      setFormData({
        material_type: data.material_type,
        quantity_kg: data.quantity_kg,
        available_from: data.available_from,
        available_until: data.available_until,
        lat,
        lng,
        status: data.status
      });
      setLoading(false);
    }
    loadListing();
  }, [id]);

  const handleGetLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('Browser does not support geolocation.');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6)
        }));
        setGeoLoading(false);
      },
      () => {
        setGeoError('Location permission denied. Please enter coordinates manually.');
        setGeoLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const pointLocation = `POINT(${formData.lng} ${formData.lat})`;

    const { error } = await listingService.updateListing(id, {
      material_type: formData.material_type,
      quantity_kg: parseFloat(formData.quantity_kg),
      location: pointLocation,
      available_from: formData.available_from,
      available_until: formData.available_until,
      status: formData.status
    });

    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      navigate('/supplier/dashboard');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    const { error } = await listingService.deleteListing(id);
    if (error) {
      setError(error.message);
    } else {
      navigate('/supplier/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <SupplierNavbar />
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center py-20 text-gray-400">Loading listing...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SupplierNavbar />

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#13422e]/10 text-[#13422e] px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#13422e]"></span>
            Edit Material Listing
          </div>
          <h1 className="text-3xl font-extrabold text-[#143d2b]">Update Your Listing</h1>
          <p className="text-sm text-gray-500 mt-1">
            Modify your agricultural residue details to improve matching with buyers.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-3xl p-8 bg-white shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Material Type
            </label>
            <select
              value={formData.material_type}
              onChange={(e) => setFormData({ ...formData, material_type: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] bg-white transition"
            >
              <option value="Pineapple Crowns">Pineapple Crowns</option>
              <option value="Corn Stalks">Corn Stalks</option>
              <option value="Corn Husks">Corn Husks</option>
              <option value="Cosmetically-Rejected Produce">Cosmetically-Rejected Produce</option>
              <option value="Sugarcane Bagasse">Sugarcane Bagasse</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Quantity Available (kg)
            </label>
            <input
              type="number"
              step="1"
              required
              placeholder="e.g. 500"
              value={formData.quantity_kg}
              onChange={(e) => setFormData({ ...formData, quantity_kg: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Available From
              </label>
              <input
                type="date"
                required
                value={formData.available_from}
                onChange={(e) => setFormData({ ...formData, available_from: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Available Until
              </label>
              <input
                type="date"
                required
                value={formData.available_until}
                onChange={(e) => setFormData({ ...formData, available_until: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] bg-white transition"
            >
              <option value="listed">Listed</option>
              <option value="paused">Paused</option>
              <option value="sold">Sold</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Location Box */}
          <div className="p-5 bg-[#eef8f2] border border-emerald-100 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#143d2b] uppercase tracking-wider">
                Farm Geolocation
              </span>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={geoLoading}
                className="text-xs bg-[#143d2b] hover:bg-[#0e3021] text-white font-semibold px-3 py-1.5 rounded-lg transition"
              >
                {geoLoading ? 'Detecting...' : '📍 Auto-detect GPS'}
              </button>
            </div>
            {geoError && <p className="text-xs text-red-600">{geoError}</p>}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Latitude (e.g. 8.3597)"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white text-gray-800"
              />
              <input
                type="text"
                required
                placeholder="Longitude (e.g. 124.8688)"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white text-gray-800"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="flex gap-3">
              <Link
                to="/supplier/dashboard"
                className="text-sm font-semibold text-gray-500 hover:text-gray-800"
              >
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
              className="px-6 py-3 bg-[#13422e] hover:bg-[#0e3021] text-white text-sm font-semibold rounded-xl shadow-sm transition"
            >
              {saving ? 'Updating...' : 'Update Listing'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}