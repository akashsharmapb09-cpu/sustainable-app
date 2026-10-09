import React from 'react';

export function DashboardPage() {
  return (
    <div style={{ padding: '24px', fontFamily: 'Arial' }}>
      <h1>GreenSwap Dashboard - Working ✅</h1>
      <p>Onboarding bypass successful. Demo user active.</p>
      
      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h3>120 kg</h3>
          <p>Total CO2</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h3>40 kg</h3>
          <p>Transport</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h3>2 Swaps</h3>
          <p>Recommended</p>
        </div>
      </div>

      <p style={{ marginTop: '20px', color: 'green', fontWeight: 'bold' }}>
        If you can see this, white screen is FIXED.
      </p>
    </div>
  );
}

export default DashboardPage;
