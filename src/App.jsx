import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
