export type InviteRow = {
  email: string;
  role?: "admin-executive" | "admin-manager" | "member";
  first_name?: string;
  last_name?: string;
  title?: string;
  department?: string;
  team?: string;
  notes?: string;
};

export type ImportMethod = 'excel' | 'csv' | 'manual' | 'skip';

export type ImportResult = {
  row: InviteRow;
  ok: boolean;
  error?: string;
};

export interface ImportMethodConfig {
  id: ImportMethod;
  name: string;
  description: string;
  icon: any;
  formats: string[];
  maxSize: string;
  color: string;
  bgColor: string;
  borderColor: string;
}
