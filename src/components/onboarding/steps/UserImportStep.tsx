"use client";

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Users, 
  FileText, 
  Download, 
  Check, 
  X, 
  ArrowLeft, 
  ArrowRight,
  AlertCircle,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { OnboardingData } from '../OnboardingFlow';

interface UserImportStepProps {
  data: OnboardingData & { importMethod?: string; userCount?: number };
  onComplete: (data: Partial<OnboardingData & { importMethod: string; userCount?: number }>) => void;
  onBack: () => void;
}

const importMethods = [
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

const requiredColumns = [
  'First Name',
  'Last Name', 
  'Email',
  'Department (Optional)',
  'Role (Optional)'
];

export function UserImportStep({ data, onComplete, onBack }: UserImportStepProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>(data.importMethod || '');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>('');

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

  const handleFileUpload = (file: File) => {
    setUploadError('');
    
    // Validate file type based on selected method
    if (selectedMethod === 'excel' && !file.name.match(/\.(xlsx|xls)$/)) {
      setUploadError('Please upload an Excel file (.xlsx or .xls)');
      return;
    }
    
    if (selectedMethod === 'csv' && !file.name.match(/\.csv$/)) {
      setUploadError('Please upload a CSV file (.csv)');
      return;
    }
    
    // Validate file size (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = selectedMethod === 'excel' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(`File size must be less than ${selectedMethod === 'excel' ? '10MB' : '5MB'}`);
      return;
    }
    
    setUploadedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const downloadTemplate = () => {
    // In a real app, this would download an actual template file
    const csvContent = "First Name,Last Name,Email,Department,Role\nJohn,Doe,john.doe@company.com,Engineering,Developer\nJane,Smith,jane.smith@company.com,Marketing,Manager";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_import_template.${selectedMethod === 'excel' ? 'xlsx' : 'csv'}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleContinue = () => {
    if (selectedMethod) {
      const mockUserCount = selectedMethod === 'manual' ? 0 : Math.floor(Math.random() * 50) + 10;
      onComplete({ 
        importMethod: selectedMethod, 
        userCount: mockUserCount 
      });
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadError('');
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-custom-blue rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Import your team</h1>
          <p className="text-muted-foreground text-lg">
            Add your team members to get started with personalized learning paths
          </p>
        </div>

        {/* Import Method Selection */}
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-4">Choose import method:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {importMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-lg",
                    selectedMethod === method.id && "ring-2 ring-primary shadow-lg scale-105",
                    method.borderColor
                  )}
                  onClick={() => {
                    setSelectedMethod(method.id);
                    setUploadedFile(null);
                    setUploadError('');
                  }}
                >
                  <CardHeader className="text-center pb-2">
                    <div className={cn("mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2", method.bgColor)}>
                      <method.icon className={cn("w-6 h-6", method.color)} />
                    </div>
                    <CardTitle className="text-lg">{method.name}</CardTitle>
                    <CardDescription className="text-sm">{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1 text-center">
                      <div className="flex justify-center gap-1 mb-2">
                        {method.formats.map((format, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {format}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">Max size: {method.maxSize}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* File Upload Section */}
        {selectedMethod && selectedMethod !== 'manual' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload File
                </CardTitle>
                <CardDescription>
                  Drag and drop your file or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!uploadedFile ? (
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                      dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                      "hover:border-primary hover:bg-primary/5"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Drop your {selectedMethod.toUpperCase()} file here
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      or click to browse your computer
                    </p>
                    <input
                      type="file"
                      accept={selectedMethod === 'excel' ? '.xlsx,.xls' : '.csv'}
                      onChange={handleFileInputChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button asChild variant="outline">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Choose File
                      </label>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">{uploadedFile.name}</p>
                        <p className="text-sm text-green-600">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {uploadError && (
                  <Alert className="mt-4 border-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-destructive">
                      {uploadError}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Required Columns Info */}
                <div className="mt-6 p-4 bg-custom-blue/5 border border-custom-blue/20 rounded-lg">
                  <h4 className="font-medium text-custom-blue mb-2">Required columns:</h4>
                  <div className="flex flex-wrap gap-2">
                    {requiredColumns.map((column, i) => (
                      <Badge key={i} variant="outline" className="text-custom-blue border-custom-blue/30">
                        {column}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={downloadTemplate}
                    className="mt-2 p-0 h-auto text-custom-blue"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Manual Entry Info */}
        {selectedMethod === 'manual' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <Alert>
              <UserPlus className="h-4 w-4" />
              <AlertDescription>
                You can add team members manually after completing the setup. You'll be able to invite users 
                through the dashboard and they'll receive email invitations to join your organization.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedMethod || (selectedMethod !== 'manual' && !uploadedFile && selectedMethod !== 'manual')}
            className="bg-primary text-white hover:bg-primary/90 min-w-32"
          >
            {selectedMethod === 'manual' ? 'Skip for now' : 'Import Users'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
