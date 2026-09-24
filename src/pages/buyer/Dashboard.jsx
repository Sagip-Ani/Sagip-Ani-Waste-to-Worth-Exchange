import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BuyerNavbar from '../../components/buyer/BuyerNavbar';
import { demandService } from '../../services/demandService';

const statusClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';

export default function BuyerDashboard() {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDemands = async () => {
    setLoading(true);
    const { data, error: queryError } = await demandService.getMyDemands();
    if (queryError) setError(queryError.message);
    else setDemands(data || []);
    setLoading(false);
  };

  useEffect(() => { loadDemands(); }, []);

  return (
    <div className="min-h-screen bg-white"><BuyerNavbar /><main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-200">
        <div><div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-2"><span className="w-2 h-2 rounded-full bg-blue-600" />Buyer Dashboard</div><h1 className="text-2xl sm:text-3xl font-extrabold text-[#143d2b] tracking-tight">My Buyer Demands</h1><p className="text-sm text-gray-500 mt-1">Post what agricultural material you need and let Sagip-Ani find compatible suppliers.</p></div>
        <Link to="/buyer/new-demand" className="inline-flex items-center justify-center px-5 py-2.5 bg-[#13422e] hover:bg-[#0e3021] text-white text-sm font-semibold rounded-xl shadow-sm transition">+ New Demand</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-8">
        <Metric label="Active Demands" value={demands.length} />
        <Metric label="Total Requested" value={`${demands.reduce((sum, item) => sum + (Number(item.quantity_needed_kg) || 0), 0).toLocaleString()} kg`} />
        <Link to="/buyer/matches" className="bg-white border-2 border-gray-300 hover:border-[#13422e] rounded-2xl p-5 shadow-sm transition"><span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Matching Engine</span><p className="text-sm font-bold text-[#143d2b] mt-3">View ranked supplier matches →</p></Link>
      </div>
      {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {loading ? <div className="text-center py-20 text-gray-400">Loading your demands...</div> : demands.length === 0 ? <EmptyState /> : (
        <div><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-[#143d2b]">Your Demand Posts</h2><span className="text-xs text-gray-500">{demands.length} item(s)</span></div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{demands.map((demand) => <DemandCard key={demand.id} demand={demand} />)}</div>
        </div>
      )}
    </main></div>
  );
}

function Metric({ label, value }) {
  return <div className="bg-white border-2 border-gray-300 rounded-2xl p-5 shadow-sm"><span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span><p className="text-2xl font-extrabold text-[#143d2b] mt-2">{value}</p></div>;
}

function DemandCard({ demand }) {
  return <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:border-[#13422e] transition">
    <div className="p-5"><div className="flex items-center justify-between mb-4"><span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-blue-600" />Buyer Demand</span><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusClass}`}>{demand.status || 'active'}</span></div>
      <h3 className="text-lg font-bold text-gray-900">{demand.material_type}</h3><p className="text-2xl font-extrabold text-[#143d2b] mt-1">{Number(demand.quantity_needed_kg).toLocaleString()} <span className="text-sm font-normal text-gray-500">kg</span></p>
      <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1.5"><div className="flex justify-between"><span>Maximum distance</span><span className="font-semibold text-gray-900">{demand.max_distance_km} km</span></div><div className="flex justify-between"><span>Posted</span><span className="font-semibold text-gray-900">{demand.created_at ? new Date(demand.created_at).toLocaleDateString() : '—'}</span></div></div>
    </div>
    <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
      <span className="text-[11px] font-medium text-gray-500">Geotagged Demand</span>
      <div className="flex items-center gap-3">
        <Link to={`/buyer/edit-demand/${demand.id}`} className="text-xs font-bold text-[#143d2b] hover:text-[#0e3021] hover:underline">Edit</Link>
        <Link to={`/buyer/matches?demand=${demand.id}`} className="text-xs font-bold text-[#143d2b] hover:text-[#0e3021] hover:underline flex items-center gap-1">View Matches <span>→</span></Link>
      </div>
    </div>
  </div>;
}

function EmptyState() {
  return <div className="text-center py-16 px-4 bg-gray-50/60 border-2 border-gray-200 rounded-2xl"><div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl mb-4">📦</div><h3 className="text-lg font-bold text-[#143d2b]">No demands yet</h3><p className="text-sm text-gray-500 max-w-md mx-auto mt-2 mb-6">Create your first demand to tell suppliers what material you need.</p><Link to="/buyer/new-demand" className="inline-flex px-5 py-2.5 bg-[#13422e] text-white text-sm font-semibold rounded-xl">Create Demand</Link></div>;
}
