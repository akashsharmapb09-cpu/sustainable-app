import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CardSkeleton, MetricSkeleton } from '../../shared/ui/Skeleton';
import { formatCurrency, formatRange, safeNumber } from '../../shared/lib/utils';

// Mock data taaki bina login ke dashboard khule
const mockProfile = { region: 'IN', effort_level: 'moderate', name: 'Demo User' };
const mockFootprint = { total: 120, transport: 40, food: 30, energy: 50 };
const mockLogs: any[] = [];
const mockAlternatives: any[] = [
  { id: 1, title: 'Switch to Bike for <2km', savings: '2.5 kg CO2', effort: 'low' },
  { id: 2, title: 'Meatless Monday', savings: '1.8 kg CO2', effort: 'low' },
];

export function DashboardPage() {
  const [referenceTime] = useState(() => new Date().toISOString());
  const profile = mockProfile;
  const footprint = mockFootprint;

  const scoring = {
    region: profile.region?? 'IN',
    effort_level: profile.effort_level?? 'moderate',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Dashboard</h1>
      <p style={{ color: '#666' }}>Welcome, {profile.name} | Region: {scoring.region}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h3>Total Footprint</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{footprint.total} kg CO2</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h3>Transport</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{footprint.transport} kg</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h3>Food</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{footprint.food} kg</p>
        </div>
      </div>

      <h2 style={{ marginTop: '30px' }}>Recommended Swaps</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
        {mockAlternatives.map(item => (
          <div key={item.id} style={{ border: '1px solid #e0e0e0', padding: '12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.title}</span>
            <span style={{ color: 'green', fontWeight: 'bold' }}>{item.savings}</span>
          </div>
        ))}
      </div>

      <Link to="/onboarding" style={{ display: 'block', marginTop: '30px', color: '#2e7d32' }}>← Back to Onboarding</Link>
    </div>
  );
}

export default DashboardPage;
