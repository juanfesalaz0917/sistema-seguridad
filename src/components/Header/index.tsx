// src/components/Header/index.tsx
import React, { Suspense } from "react";
import { useUiLibrary } from "../../context/UiLibraryContext";

// Para Bootstrap y MUI usamos el mismo Header de Tailwind
const HeaderTailwind = React.lazy(() => import("./Header.tailwind"));

interface HeaderProps {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg: boolean) => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { library } = useUiLibrary();

  // Por ahora todas las librerías usan el mismo header
  // Puedes crear Header.bootstrap.tsx y Header.mui.tsx más adelante si lo necesitas
  const Component = HeaderTailwind;

  return (
    <Suspense fallback={<div style={{ height: 80, background: '#fff' }} />}>
      {/* @ts-ignore */}
      <Component {...props} />
    </Suspense>
  );
};

export default Header;