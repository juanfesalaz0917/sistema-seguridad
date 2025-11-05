// src/pages/Devices/DevicesList.tailwind.tsx
import React from "react";

const DevicesListTailwind: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dispositivos - Tailwind</h2>
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p className="font-bold">En desarrollo</p>
        <p>La versión Tailwind de la lista de dispositivos está en desarrollo.</p>
      </div>
    </div>
  );
};

export default DevicesListTailwind;