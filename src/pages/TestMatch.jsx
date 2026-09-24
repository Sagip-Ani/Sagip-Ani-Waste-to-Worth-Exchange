import { useState } from 'react';
import { matchService } from '../services/matchService';

export default function TestMatch() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // These IDs are from your existing data
  const DEMAND_ID = '7ece15be-9d60-4a84-97d9-d6b993a12986'; // Pineapple Crowns demand
  const LISTING_ID = 'b0cb50c3-c962-4095-8a83-aa9b81b48cde'; // Pineapple Crowns listing

  const createTestMatch = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const { data, error } = await matchService.createMatch({
        demandId: DEMAND_ID,
        listingId: LISTING_ID,
        score: 0.95,
        distanceKm: 5.2
      });

      if (error) {
        setResult(`Error: ${error.message}`);
      } else {
        setResult(`Success! Match created with ID: ${data.id}`);
      }
    } catch (err) {
      setResult(`Error: ${err.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Test Match Creation</h1>
      <p>This page creates a test match between your existing supplier listing and buyer demand.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Demand ID:</strong> {DEMAND_ID}</p>
        <p><strong>Listing ID:</strong> {LISTING_ID}</p>
        <p><strong>Material:</strong> Pineapple Crowns</p>
        <p><strong>Score:</strong> 0.95 (95%)</p>
        <p><strong>Distance:</strong> 5.2 km</p>
      </div>

      <button 
        onClick={createTestMatch}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#13422e',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Creating Match...' : 'Create Test Match'}
      </button>

      {result && (
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: result.startsWith('Error') ? '#fee' : '#efe',
          border: '1px solid ' + (result.startsWith('Error') ? '#fcc' : '#cfc'),
          borderRadius: '5px'
        }}>
          {result}
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <p><strong>Next steps after creating the match:</strong></p>
        <ul>
          <li>Go to <a href="/supplier/matches">Supplier Matches</a> to see the ranked matches</li>
          <li>Go to <a href="/supplier/map">Supplier Map</a> to see the buyer location pin</li>
          <li>Go to <a href="/buyer/matches">Buyer Matches</a> to see the supplier matches</li>
          <li>Go to <a href="/buyer/map">Buyer Map</a> to see the supplier location pin</li>
        </ul>
      </div>
    </div>
  );
}