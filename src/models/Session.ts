export interface Session {
  id?: string;
  token: string;
  expiration: string; // datetime (ISO string)
  FACode: string;
  state: string;
}