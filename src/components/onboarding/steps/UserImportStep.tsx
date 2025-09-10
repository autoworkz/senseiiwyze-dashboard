"use client";

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
  UserPlus,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { OnboardingData } from '../OnboardingFlow';
import { useUserImport } from '@/hooks/useUserImport';
import { importMethods, requiredColumns } from '@/config/import-methods';
import { downloadTemplate } from '@/utils/user-import';

interface UserImportStepProps {
  data: OnboardingData & { importMethod?: string; userCount?: number };
  onComplete: (data: Partial<OnboardingData & { importMethod: string; userCount?: number }>) => void;
  onBack: () => void;
}

export function UserImportStep({ data, onComplete, onBack }: UserImportStepProps) {
  const {
    selectedMethod,
    uploadedFile,
    uploadError,
    isProcessing,
    dragActive,
    setSelectedMethod,
    handleDrag,
    handleDrop,
    handleFileInputChange,
    processImport,
    removeFile,
  } = useUserImport();

  const handleContinue = async () => {
    if (!selectedMethod) return;

    try {
      if (selectedMethod === 'manual' || selectedMethod === 'skip') {
        onComplete({ 
          importMethod: selectedMethod, 
          userCount: 0 
        });
      } else {
        // Process file import and send invitations
        const result = await processImport();
        onComplete({ 
          importMethod: selectedMethod, 
          userCount: result.userCount || 0
        });
      }
    } catch (error) {
      console.error('Import failed:', error);
      // Handle error - could show a toast or error state
    }
  };

  const handleSkip = () => {
    onComplete({ 
      importMethod: 'skip', 
      userCount: 0 
    });
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId as any);
    removeFile(); // Clear any previously uploaded file
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
                  onClick={() => handleMethodSelect(method.id)}
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
                    onClick={() => downloadTemplate(selectedMethod)}
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

        {/* Skip Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mb-6"
        >
          <div className="bg-muted/50 border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium mb-1">
                  Not ready to import users yet?
                </p>
                <p className="text-sm text-muted-foreground">
                  You can skip this step and add team members later from your dashboard. 
                  You'll be able to invite users individually or import them in bulk at any time.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="lg"
              onClick={handleSkip}
              disabled={isProcessing}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip for now
            </Button>

            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!selectedMethod || (selectedMethod !== 'manual' && selectedMethod !== 'skip' && !uploadedFile) || isProcessing}
              className="bg-primary text-white hover:bg-primary/90 min-w-32"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {selectedMethod === 'manual' ? 'Continue' : 'Import Users'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
