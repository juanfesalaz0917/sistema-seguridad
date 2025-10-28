import React from "react";
import { useUiLibrary } from "../context/UiLibraryContext";
import { FaBootstrap, FaCss3Alt } from "react-icons/fa";
import { SiMaterialdesign } from "react-icons/si";

const UiLibrarySwitcher: React.FC = () => {
  const { library, setLibrary } = useUiLibrary();

  const items: { id: "bootstrap" | "tailwind" | "mui"; label: string; icon: React.ReactNode }[] = [
    { id: "bootstrap", label: "Bootstrap", icon: <FaBootstrap size={18} /> },
    { id: "tailwind", label: "Tailwind", icon: <FaCss3Alt size={18} /> },
    { id: "mui", label: "Material UI", icon: <SiMaterialdesign size={18} /> },
  ];

  return (
    <div className="flex items-center gap-2">
      {items.map((it) => (
        <button
          key={it.id}
          aria-pressed={library === it.id}
          title={it.label}
          onClick={() => setLibrary(it.id)}
          className={`flex items-center gap-2 px-2 py-1 rounded-md focus:outline-none transition ${
            library === it.id ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          {it.icon}
          <span className="hidden sm:inline-block text-xs">{it.label}</span>
        </button>
      ))}
    </div>
  );
};

export default UiLibrarySwitcher;
