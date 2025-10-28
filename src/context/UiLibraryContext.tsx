import React, { createContext, useContext, useEffect, useState } from "react";

export type UiLibrary = "tailwind" | "bootstrap" | "mui";

interface UiLibraryContextProps {
  library: UiLibrary;
  setLibrary: (lib: UiLibrary) => void;
}

const UiLibraryContext = createContext<UiLibraryContextProps | undefined>(undefined);

export const UiLibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [library, setLibrary] = useState<UiLibrary>(() => {
    const saved = localStorage.getItem("uiLibrary") as UiLibrary | null;
    return saved ?? "tailwind";
  });

  useEffect(() => {
    localStorage.setItem("uiLibrary", library);
  }, [library]);

  return (
    <UiLibraryContext.Provider value={{ library, setLibrary }}>
      {children}
    </UiLibraryContext.Provider>
  );
};

export const useUiLibrary = () => {
  const ctx = useContext(UiLibraryContext);
  if (!ctx) throw new Error("useUiLibrary must be used within UiLibraryProvider");
  return ctx;
};
