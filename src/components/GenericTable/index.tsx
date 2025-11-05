import React, { Suspense } from "react";
import { useUiLibrary } from "../../context/UiLibraryContext";
import type { Action } from "./types";

const TailwindTable = React.lazy(() => import("./GenericTable.tailwind")) as React.LazyExoticComponent<React.FC<GenericTableProps>>;
const BootstrapTable = React.lazy(() => import("./GenericTable.bootstrap")) as React.LazyExoticComponent<React.FC<GenericTableProps>>;
const MuiTable = React.lazy(() => import("./GenericTable.mui")) as React.LazyExoticComponent<React.FC<GenericTableProps>>;

export interface GenericTableProps<T = Record<string, any>> {
  data: T[];
  columns: string[];
  actions?: Action[];
  onAction?: (name: string, item: T) => void;
  renderCell?: (item: T, column: string) => React.ReactNode;
}

const GenericTable: React.FC<GenericTableProps> = (props) => {
  const { library } = useUiLibrary();

  let Component: React.LazyExoticComponent<React.FC<GenericTableProps>> = TailwindTable;
  if (library === "bootstrap") Component = BootstrapTable;
  if (library === "mui") Component = MuiTable;

  return (
    <Suspense fallback={<div>Loading table...</div>}>
      <Component {...props} />
    </Suspense>
  );
};

export default GenericTable;
