export interface Admin {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: string; // e.g., 'admin', 'user'
  image_url?: string | null;
  created_at: Date;
  updated_at: Date;
}
