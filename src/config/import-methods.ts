import { FileText, UserPlus } from 'lucide-react';
import { ImportMethodConfig } from '@/types/user-import';

export const importMethods: ImportMethodConfig[] = [
  {
    id: 'excel',
    name: 'Excel Import',
    description: 'Upload an Excel file (.xlsx) with user data',
    icon: FileText,
    formats: ['.xlsx', '.xls'],
    maxSize: '10MB',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'csv',
    name: 'CSV Import',
    description: 'Upload a CSV file with comma-separated user data',
    icon: FileText,
    formats: ['.csv'],
    maxSize: '5MB',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'manual',
    name: 'Add Manually',
    description: 'Add users one by one through the interface',
    icon: UserPlus,
    formats: ['No file needed'],
    maxSize: 'Unlimited',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
];

export const requiredColumns = [
  'Email (Required)',
  'First Name',
  'Last Name', 
  'Role (admin-executive/admin-manager)',
  'Department',
  'Title'
];
