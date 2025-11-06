// src/components/UserForm/index.tsx
import React, { Suspense } from "react";
import { useUiLibrary } from "../../context/UiLibraryContext";

const UserFormTailwind = React.lazy(() => import("../UserFormValidator")); // tu componente actual (tailwind)
const UserFormBootstrap = React.lazy(() => import("./UserForm.bootstrap"));
// Si tienes versión MUI, mantén la importación; si no, reusa Tailwind
const UserFormMui = React.lazy(() => import("../UserFormValidator"));

const UserFormSwitcher: React.FC<any> = (props) => {
  const { library } = useUiLibrary();

  let Component: React.LazyExoticComponent<any> = UserFormTailwind;
  if (library === "bootstrap") Component = UserFormBootstrap;
  if (library === "mui") Component = UserFormMui;

  return (
    <Suspense fallback={<div className="d-flex justify-content-center p-4">Cargando formulario...</div>}>
      <Component {...props} />
    </Suspense>
  );
};

export default UserFormSwitcher;
