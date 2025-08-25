import Papa from 'papaparse';
import { InviteRow } from '@/types/user-import';

export function toRole(v: string | undefined | null): InviteRow["role"] {
  if (!v) return "admin-executive";
  const s = String(v).trim().toLowerCase();
  if (s === "admin-executive") return "admin-executive";
  if (s === "admin-manager" || s === "manager" || s === "admin")
    return "admin-manager";
  return "admin-executive";
}

export function normalizeHeader(h: string) {
  return h.trim().toLowerCase().replace(/\s+/g, "_");
}

export function dedupeRows(rows: InviteRow[]): InviteRow[] {
  const seen = new Set<string>();
  const out: InviteRow[] = [];
  for (const r of rows) {
    const key = r.email.toLowerCase();
    if (!seen.has(key) && r.email) {
      seen.add(key);
      out.push(r);
    }
  }
  return out;
}

export async function parseCSV(file: File): Promise<InviteRow[]> {
  return new Promise((resolve, reject) => { 
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: normalizeHeader,
      complete: (res: any) => {
        const out = (res.data as any[]).map((r) => ({
          email: String(r.email ?? "").trim(),
          role: toRole(r.role),
          first_name: r.first_name ?? r.firstname ?? r.first ?? "",
          last_name: r.last_name ?? r.lastname ?? r.last ?? "",
          title: r.title ?? "",
          department: r.department ?? "",
          team: r.team ?? "",
          notes: r.notes ?? "",
        }));
        resolve(out);
      },
      error: (err: any) => reject(err),
    });
  });
}

export async function parseXLSX(file: File): Promise<InviteRow[]> {
  const XLSX = await import("xlsx");
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json<any>(ws, { defval: "" });
  return json.map((r) => {
    // normalize keys in a tolerant way
    const obj: Record<string, any> = {};
    for (const k of Object.keys(r)) obj[normalizeHeader(k)] = r[k];
    return {
      email: String(obj.email ?? "").trim(),
      role: toRole(obj.role),
      first_name: obj.first_name ?? obj.firstname ?? obj.first ?? "",
      last_name: obj.last_name ?? obj.lastname ?? obj.last ?? "",
      title: obj.title ?? "",
      department: obj.department ?? "",
      team: obj.team ?? "",
      notes: obj.notes ?? "",
    } as InviteRow;
  });
}

export function validateFileType(file: File, method: string): string | null {
  if (method === 'excel' && !file.name.match(/\.(xlsx|xls)$/)) {
    return 'Please upload an Excel file (.xlsx or .xls)';
  }
  
  if (method === 'csv' && !file.name.match(/\.csv$/)) {
    return 'Please upload a CSV file (.csv)';
  }
  
  return null;
}

export function validateFileSize(file: File, method: string): string | null {
  const maxSize = method === 'excel' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return `File size must be less than ${method === 'excel' ? '10MB' : '5MB'}`;
  }
  
  return null;
}

export function downloadTemplate(method: string) {
  const csvContent = "email,first_name,last_name,role,department,title\njohn.doe@company.com,John,Doe,admin-executive,Engineering,Developer\njane.smith@company.com,Jane,Smith,admin-manager,Marketing,Manager";
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `user_import_template.${method === 'excel' ? 'xlsx' : 'csv'}`;
  a.click();
  window.URL.revokeObjectURL(url);
}
