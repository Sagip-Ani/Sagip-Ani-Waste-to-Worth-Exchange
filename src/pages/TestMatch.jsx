import { useState } from 'react';
import { matchService } from '../services/matchService';

export default function TestMatch() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // These IDs are from your existing data
  const LISTING_ID = 'b0cb50c3-c962-4095-8a83-aa9b81b48cde'; // Pineapple Crowns listing
  
  // All buyer demand IDs
  const DEMANDS = [
    { id: '7ece15be-9d60-4a84-97d9-d6b993a12986', material: 'Pineapple Crowns', quantity: 500 },
    { id: '119ac456-adca-41c2-a430-1367dbef2d4c', material: 'Cosmetically-Rejected Produce', quantity: 1000 },
    { id: '4531f30a-866c-4b57-bf21-0ce6bd958809', material: 'Corn Stalks', quantity: 300 },
    { id: '59002f3f-fa5c-49a7-b3e0-2d1c8b93f478', material: 'Corn Husks', quantity: 500 }
  ];

  const createAllMatches = async () => {
    setLoading(true);
    setResult('');
    
    try {
      let successCount = 0;
      let errorCount = 0;
      let results = [];

      for (const demand of DEMANDS) {
        const { data, error } = await matchService.createMatch({
          demandId: demand.id,
          listingId: LISTING_ID,
          score: 0.85 + Math.random() * 0.1, // Random score between 0.85-0.95
          distanceKm: 5 + Math.random() * 10 // Random distance between 5-15 km
        });

        if (error) {
          errorCount++;
          results.push(`Failed for ${demand.material}: ${error.message}`);
        } else {
          successCount++;
          results.push(`Created match for ${demand.material} (ID: ${data.id})`);
        }
      }

      setResult(`Created ${successCount} matches, ${errorCount} failed:\n${results.join('\n')}`);
    } catch (err) {
      setResult(`Error: ${err.message}`);
    }
    
    setLoading(false);
  };

  const createSingleMatch = async (demandId) => {
    setLoading(true);
    setResult('');
    
    try {
      const { data, error } = await matchService.createMatch({
        demandId: demandId,
        listingId: LISTING_ID,
        score: 0.90,
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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test Match Creation</h1>
      <p>This page creates test matches between your supplier listing and buyer demands.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Supplier Listing ID:</strong> {LISTING_ID}</p>
        <p><strong>Material:</strong> Pineapple Crowns (500 kg)</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Available Buyer Demands:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {DEMANDS.map(demand => (
            <li key={demand.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <p><strong>{demand.material}</strong> - {demand.quantity} kg</p>
              <p><strong>ID:</strong> {demand.id}</p>
              <button 
                onClick={() => createSingleMatch(demand.id)}
                disabled={loading}
                style={{
                  padding: '5px 10px',
                  backgroundColor: loading ? '#ccc' : '#13422e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '5px'
                }}
              >
                Create Match
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button 
        onClick={createAllMatches}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#13422e',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Creating All Matches...' : 'Create All Matches'}
      </button>

      {result && (
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: result.includes('Error') ? '#fee' : '#efe',
          border: '1px solid ' + (result.includes('Error') ? '#fcc' : '#cfc'),
          borderRadius: '5px',
          whiteSpace: 'pre-line'
        }}>
          {result}
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <p><strong>Next steps after creating matches:</strong></p>
        <ul>
          <li>Go to <a href="/supplier/matches">Supplier Matches</a> to see the ranked matches</li>
          <li>Go to <a href="/supplier/map">Supplier Map</a> to see all buyer location pins</li>
          <li>Go to <a href="/buyer/matches">Buyer Matches</a> to see the supplier matches</li>
          <li>Go to <a href="/buyer/map">Buyer Map</a> to see the supplier location pin</li>
        </ul>
      </div>
    </div>
  );
}