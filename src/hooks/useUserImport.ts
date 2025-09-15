import { useState, useCallback } from 'react';
import authClient from '@/lib/auth-client';
import { InviteRow, ImportMethod, ImportResult } from '@/types/user-import';
import { 
  parseCSV, 
  parseXLSX, 
  dedupeRows, 
  validateFileType, 
  validateFileSize 
} from '@/utils/user-import';
import { useCustomer } from "autumn-js/react";

export function useUserImport() {
  const [selectedMethod, setSelectedMethod] = useState<ImportMethod | ''>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Get customer data from Autumn
  const { allowed, check } = useCustomer();
  
  // Check organization seats feature locally
  const canAddMoreUsers = allowed({ featureId: "organization_seats" });
  console.log('Can add more users (local check):', canAddMoreUsers);
  
  // Check organization seats feature via API
  const checkSeats = async () => {
    try {
      const { data } = await check({ featureId: "organization_seats" });
      console.log('Organization seats check (API):', data);
      return data;
    } catch (error) {
      console.error('Error checking organization seats:', error);
      return null;
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  }, [selectedMethod]);

  const handleFileUpload = useCallback((file: File) => {
    setUploadError('');
    
    // Validate file type
    const typeError = validateFileType(file, selectedMethod);
    if (typeError) {
      setUploadError(typeError);
      return;
    }
    
    // Validate file size
    const sizeError = validateFileSize(file, selectedMethod);
    if (sizeError) {
      setUploadError(sizeError);
      return;
    }
    
    setUploadedFile(file);
  }, [selectedMethod]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const parseFile = useCallback(async (file: File): Promise<InviteRow[]> => {
    if (selectedMethod === 'csv') {
      return parseCSV(file);
    } else if (selectedMethod === 'excel') {
      return parseXLSX(file);
    }
    return [];
  }, [selectedMethod]);

  const inviteBatch = useCallback(async (rows: InviteRow[]): Promise<ImportResult[]> => {
    // Get the active organization ID from the session
    const session = await authClient.getSession();
    const activeOrganizationId = session.data?.session?.activeOrganizationId;
    
    if (!activeOrganizationId) {
      throw new Error("No active organization found. Please select an organization first.");
    }

    const CONCURRENCY = 8;
    let idx = 0;
    const results: ImportResult[] = [];

    async function worker() {
      while (idx < rows.length) {
        const i = idx++;
        const row = rows[i];
        try {
          const res = await fetch(`/api/organization/${activeOrganizationId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: row.email,
              role: row.role ?? "admin-manager",
              name: row.first_name, // optional, pass what you have
            }),
          });
  
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            results.push({ row, ok: false, error: err.error ?? res.statusText });
          } else {
            results.push({ row, ok: true });
          }
        } catch (e: any) {
          results.push({ row, ok: false, error: e?.message ?? "unknown error" });
        }
      }
    }

    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    return results;
  }, []);

  const processImport = useCallback(async (): Promise<{ success: boolean; userCount: number; results?: ImportResult[] }> => {
    if (!uploadedFile || !selectedMethod || selectedMethod === 'manual' || selectedMethod === 'skip') {
      return { success: true, userCount: 0 };
    }

    setIsProcessing(true);
    try {
      // Check organization seats limit via Autumn API
      const seatsData = await checkSeats();
      console.log('Seats data from Autumn:', seatsData);
      
      // Parse the uploaded file
      const rows = await parseFile(uploadedFile);
      
      // Dedupe and filter valid emails
      const validRows = dedupeRows(rows).filter(row => row.email && row.email.includes('@'));
      
      if (validRows.length === 0) {
        throw new Error('No valid email addresses found in the file');
      }

      console.log('validRows', validRows);
      
      // TODO: Apply user limit cap based on Autumn data
      // For now, just log the data we get from Autumn
      
      // Send invitations
      const results = await inviteBatch(validRows);
      
      const successCount = results.filter(r => r.ok).length;
      return { 
        success: true, 
        userCount: successCount, 
        results 
      };
      
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [uploadedFile, selectedMethod, parseFile, inviteBatch, checkSeats]);

  const removeFile = useCallback(() => {
    setUploadedFile(null);
    setUploadError('');
  }, []);

  const resetImport = useCallback(() => {
    setSelectedMethod('');
    setUploadedFile(null);
    setUploadError('');
    setIsProcessing(false);
    setDragActive(false);
  }, []);

  return {
    // State
    selectedMethod,
    uploadedFile,
    uploadError,
    isProcessing,
    dragActive,
    
    // Actions
    setSelectedMethod,
    handleDrag,
    handleDrop,
    handleFileUpload,
    handleFileInputChange,
    processImport,
    removeFile,
    resetImport,
  };
}
