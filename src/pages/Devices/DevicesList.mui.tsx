// src/pages/Devices/DevicesList.mui.tsx
import React from "react";

const DevicesListMui: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Dispositivos - Material UI</h2>
      <div style={{ 
        padding: '16px', 
        background: '#fff3cd', 
        border: '1px solid #ffc107',
        borderRadius: '4px',
        marginTop: '20px'
      }}>
        <p style={{ fontWeight: 'bold', margin: 0 }}>En desarrollo</p>
        <p style={{ margin: '8px 0 0 0' }}>La versión Material UI de la lista de dispositivos está en desarrollo.</p>
      </div>
    </div>
  );
};

export default DevicesListMui;