// src/components/GenericTable/types.ts
export interface Action {
  name: string;
  label: string;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
  icon?: string;
}