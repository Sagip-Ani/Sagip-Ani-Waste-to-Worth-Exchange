import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PlaceholderPage from './pages/PlaceholderPage';

// Supplier views
import SupplierDashboard from './pages/supplier/Dashboard';
import NewListing from './pages/supplier/NewListing';
import Matches from './pages/supplier/Matches';
import SupplierMap from './pages/supplier/Map';
import BuyerDashboard from './pages/buyer/Dashboard';
import NewDemand from './pages/buyer/NewDemand';
import BuyerMatches from './pages/buyer/Matches';
import BuyerMap from './pages/buyer/Map';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public & Informational Routes */}
        <Route path="/" element={<Landing />} />
        <Route 
          path="/about" 
          element={<PlaceholderPage title="About Sagip-Ani" description="Learn more about our mission to convert agricultural residues into economic value across Bukidnon." />} 
        />
        <Route 
          path="/how-it-works" 
          element={<PlaceholderPage title="How It Works" description="Comprehensive guide for Bukidnon suppliers and buyers participating in the exchange." />} 
        />
        <Route 
          path="/features" 
          element={<PlaceholderPage title="Platform Features" description="Explore our waste-to-worth exchange features and matching capabilities." />} 
        />
        
        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* Supplier / Seller Flow Routes */}
        <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
        <Route path="/supplier/new-listing" element={<NewListing />} />
        <Route path="/supplier/matches" element={<Matches />} />
        <Route path="/supplier/map" element={<SupplierMap />} />

        {/* Buyer Flow Routes */}
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        <Route path="/buyer/new-demand" element={<NewDemand />} />
        <Route path="/buyer/matches" element={<BuyerMatches />} />
        <Route path="/buyer/map" element={<BuyerMap />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;