import React, { Suspense } from "react";
import { useUiLibrary } from "../../context/UiLibraryContext";
import type { Action } from "./types";

const TailwindTable = React.lazy(() => import("./GenericTable.tailwind"));
const BootstrapTable = React.lazy(() => import("./GenericTable.bootstrap"));
const MuiTable = React.lazy(() => import("./GenericTable.mui"));

export interface GenericTableProps {
  data: Record<string, any>[];
  columns: string[];
  actions: Action[];
  onAction: (name: string, item: Record<string, any>) => void;
}

const GenericTable: React.FC<GenericTableProps> = (props) => {
  const { library } = useUiLibrary();

  let Component = TailwindTable;
  if (library === "bootstrap") Component = BootstrapTable;
  if (library === "mui") Component = MuiTable;

  return (
    <Suspense fallback={<div>Loading table...</div>}>
      {/* @ts-ignore */}
      <Component {...props} />
    </Suspense>
  );
};

export default GenericTable;
