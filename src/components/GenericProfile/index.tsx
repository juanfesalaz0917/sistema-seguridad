import React, { Suspense } from "react";
import { useUiLibrary } from "../../context/UiLibraryContext";
import type { ProfileProps } from "./types";

const TailwindProfile = React.lazy(() => import("./GenericProfile.tailwind"));
const BootstrapProfile = React.lazy(() => import("./GenericProfile.bootstrap"));
const MuiProfile = React.lazy(() => import("./GenericProfile.mui"));

const GenericProfile: React.FC<ProfileProps> = (props) => {
  const { library } = useUiLibrary();

  let Component = TailwindProfile;
  if (library === "bootstrap") Component = BootstrapProfile;
  if (library === "mui") Component = MuiProfile;

  return (
    <Suspense fallback={<div>Cargando perfil...</div>}>
      {/* @ts-ignore */}
      <Component {...props} />
    </Suspense>
  );
};

export default GenericProfile;
