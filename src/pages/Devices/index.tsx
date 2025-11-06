// src/pages/Devices/index.tsx
import React, { Suspense } from "react";
import { useUiLibrary } from "../../context/UiLibraryContext";

// Lazy loading de las implementaciones
const DevicesListTailwind = React.lazy(() => import("./DevicesList.tailwind"));
const DevicesListBootstrap = React.lazy(() => import("./DevicesList.bootstrap"));
const DevicesListMui = React.lazy(() => import("./DevicesList.mui"));

const DevicesList: React.FC = () => {
  const { library } = useUiLibrary();

  let Component = DevicesListTailwind; // default
  if (library === "bootstrap") Component = DevicesListBootstrap;
  if (library === "mui") Component = DevicesListMui;

  return (
    <Suspense 
      fallback={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px' 
        }}>
          <div>Cargando...</div>
        </div>
      }
    >
      <Component />
    </Suspense>
  );
};

export default DevicesList;