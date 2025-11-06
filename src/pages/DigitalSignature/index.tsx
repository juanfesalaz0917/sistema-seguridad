// src/pages/DigitalSignature/index.tsx
import React, { Suspense } from "react";
import { useUiLibrary } from "../../context/UiLibraryContext";

// Lazy loading de las implementaciones
const DigitalSignatureTailwind = React.lazy(() => import("./DigitalSignature.tailwind"));
const DigitalSignatureBootstrap = React.lazy(() => import("./DigitalSignature.bootstrap"));
const DigitalSignatureMui = React.lazy(() => import("./DigitalSignature.mui"));

const DigitalSignature: React.FC = () => {
  const { library } = useUiLibrary();

  let Component = DigitalSignatureTailwind; // default
  if (library === "bootstrap") Component = DigitalSignatureBootstrap;
  if (library === "mui") Component = DigitalSignatureMui;

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

export default DigitalSignature;