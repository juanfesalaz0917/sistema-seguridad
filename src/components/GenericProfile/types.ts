export interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  avatarUrl?: string;
}

export interface ProfileProps {
  data: ProfileData;
  onEdit?: () => void;
  onLogout?: () => void;
}
