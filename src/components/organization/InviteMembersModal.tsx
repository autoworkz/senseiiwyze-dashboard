"use client";

import { useState } from 'react';
import { 
  Upload, 
  Users, 
  FileText, 
  Download, 
  Check, 
  X, 
  AlertCircle,
  UserPlus,
  Loader2,
  CreditCard,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useUserImport } from '@/hooks/useUserImport';
import { importMethods, requiredColumns } from '@/config/import-methods';
import { downloadTemplate } from '@/utils/user-import';
import { CheckoutDialog, useCustomer } from 'autumn-js/react';
import { toast } from 'sonner';
import { useModal } from '@/contexts/ModalContext';

export function InviteMembersModal() {
  const { inviteMembersModal } = useModal();
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

  // Autumn customer hook for plan updates
  const { checkout, check } = useCustomer();
  
  const [seatError, setSeatError] = useState<{
    needsPlanUpgrade: boolean;
    availableSeats: number;
    requiredSeats: number;
    totalSeats: number;
    currentUsage?: number;
  } | null>(null);

  const [importResult, setImportResult] = useState<{
    success: boolean;
    userCount: number;
    hasPartialFailures?: boolean;
    failureCount?: number;
  } | null>(null);

  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);

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

  // Handle plan upgrade
  const handleUpgradePlan = async () => {
    if (!seatError) return;
    
    setIsUpdatingPlan(true);
    try {
      const additionalSeats = seatError.requiredSeats - seatError.availableSeats;
      const newTotalSeats = seatError.totalSeats + additionalSeats;
      
      const result = await checkout({
        productId: 'starter',
        dialog: CheckoutDialog,
        options: [{ quantity: newTotalSeats, featureId: "organization_seats" }],
        successUrl: `${window.location.origin}/app/onboarding/payment/success?plan=starter&users=${newTotalSeats}&from=invite-members&upgraded=true`,
      });

      console.log('Checkout result:', result);
      
      // For dialog scenario, we need to check if payment was successful
      if (result?.data && result.data.product) {
        await pollForPaymentSuccess();
      }
      
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
    } finally {
      setIsUpdatingPlan(false);
    }
  };

  // Poll for payment success when using dialog checkout
  const pollForPaymentSuccess = async () => {
    const maxAttempts = 30; // 30 seconds max
    let attempts = 0;
    
    const poll = async () => {
      try {
        const seatsData = await checkSeats();
        if (!seatsData) {
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, 1000);
          }
          return;
        }
        
        const totalSeats = seatsData?.balance || 0;
        
        if (totalSeats >= (seatError?.requiredSeats || 0)) {
          setSeatError(null);
          setImportResult({
            success: true,
            userCount: 0,
            hasPartialFailures: false,
            failureCount: 0
          });
          
          toast.success('Plan upgraded successfully!', {
            description: 'You can now proceed with importing your team members.',
            duration: 5000,
          });
          return;
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 1000);
        } else {
          toast.error('Payment verification timeout', {
            description: 'Could not verify payment. Please try again.',
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Error polling for payment success:', error);
        toast.error('Error verifying payment', {
          description: 'Please try refreshing the page.',
          duration: 5000,
        });
      }
    };
    
    poll();
  };

  const handleContinue = async () => {
    if (!selectedMethod) return;

    setSeatError(null);
    setImportResult(null);

    try {
      if (selectedMethod === 'manual' || selectedMethod === 'skip') {
        setImportResult({
          success: true,
          userCount: 0,
          hasPartialFailures: false,
          failureCount: 0
        });
        setTimeout(() => {
          inviteMembersModal.close();
        }, 1000);
        return;
      } else {
        const result = await processImport();
        
        if (result.needsPlanUpgrade) {
          setSeatError({
            needsPlanUpgrade: true,
            availableSeats: result.availableSeats || 0,
            requiredSeats: result.requiredSeats || 0,
            totalSeats: result.totalSeats || 0,
            currentUsage: result.currentUsage
          });
          return;
        }
        
        setImportResult({
          success: result.success,
          userCount: result.userCount || 0,
          hasPartialFailures: result.hasPartialFailures,
          failureCount: result.failureCount
        });
        
        if (result.success) {
          setTimeout(() => {
            inviteMembersModal.close();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Import failed:', error);
      setImportResult({
        success: false,
        userCount: 0,
        hasPartialFailures: false,
        failureCount: 0
      });
    }
  };

  const handleClose = () => {
    setSeatError(null);
    setImportResult(null);
    removeFile();
    inviteMembersModal.close();
  };

  const displayImportMethods = importMethods.filter(method => 
    method.id !== 'skip'
  );

  const selectedMethodData = importMethods.find(method => method.id === selectedMethod);

  return (
    <Dialog open={inviteMembersModal.isOpen} onOpenChange={inviteMembersModal.close}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Team Members
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {/* Seat Error - Need Plan Upgrade */}
          {seatError && (
            <Alert className="border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-destructive">
                <div className="space-y-3">
                  <div>
                    <strong>Insufficient seats for your team:</strong>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>• Your plan includes: <strong>{seatError.totalSeats || 0} total seats</strong></div>
                    <div>• Currently used: <strong>{seatError.currentUsage || 0} seats</strong></div>
                    <div>• Available seats: <strong>{seatError.availableSeats} seats</strong></div>
                    <div>• You're trying to import: <strong>{seatError.requiredSeats} users</strong></div>
                    <div>• Additional seats needed: <strong>{seatError.requiredSeats - seatError.availableSeats} seats</strong></div>
                  </div>
                  <div className="pt-2">
                    <Button 
                      onClick={handleUpgradePlan}
                      disabled={isUpdatingPlan}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      size="sm"
                    >
                      {isUpdatingPlan ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Updating Plan...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Update Plan
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Import Result Messages */}
          {importResult && (
            <Alert className={cn(
              "border",
              importResult.success ? "border-green-500 bg-green-50" : "border-destructive"
            )}>
              <Check className="h-4 w-4" />
              <AlertDescription className={cn(
                importResult.success ? "text-green-700" : "text-destructive"
              )}>
                <div className="space-y-2">
                  <div className="font-semibold">
                    {importResult.success ? "Invitations sent successfully!" : "Failed to send invitations"}
                  </div>
                  <div className="text-sm">
                    {importResult.success ? (
                      <>
                        <div>Successfully invited {importResult.userCount} team members.</div>
                        {importResult.hasPartialFailures && importResult.failureCount && (
                          <div className="text-amber-700 mt-1">
                            Note: {importResult.failureCount} invitations failed.
                          </div>
                        )}
                      </>
                    ) : (
                      "Please check your file and try again."
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {!importResult && (
            <>
              {/* Method Selection */}
              <div className="space-y-4">
                <div className="text-sm font-medium text-foreground">Choose Import Method</div>
                <div className="grid gap-3">
                  {displayImportMethods.map((method) => (
                    <Card
                      key={method.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        selectedMethod === method.id 
                          ? "ring-2 ring-primary bg-accent/10" 
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setSelectedMethod(method.id as any)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                            {method.icon && <method.icon className="h-5 w-5 text-primary" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{method.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {method.description}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* File Upload Section */}
              {selectedMethod && selectedMethod !== 'manual' && selectedMethod !== 'skip' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-foreground">Upload File</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadTemplate(selectedMethod)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </div>

                  {!uploadedFile ? (
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center space-y-4 cursor-pointer",
                        "border-primary/30 transition-all hover:border-primary/60",
                        dragActive && "border-primary bg-primary/5",
                        uploadError && "border-destructive"
                      )}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('file-input')?.click()}
                    >
                      <Upload className="h-8 w-8 mx-auto text-primary" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {dragActive ? "Drop your file here" : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedMethodData?.formats?.join(', ')}
                        </p>
                      </div>
                      <input
                        id="file-input"
                        type="file"
                        className="hidden"
                        accept={selectedMethod === 'excel' ? '.xlsx,.xls' : selectedMethod === 'csv' ? '.csv' : ''}
                        onChange={handleFileInputChange}
                      />
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(uploadedFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removeFile}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Upload Error */}
                  {uploadError && (
                    <Alert className="border-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-destructive text-sm">
                        {uploadError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Required Columns Info */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-foreground">Required columns:</div>
                    <div className="flex flex-wrap gap-1">
                      {requiredColumns.map((column) => (
                        <Badge key={column} variant="secondary" className="text-xs">
                          {column}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          {!importResult && (
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleContinue}
                  disabled={
                    isProcessing || 
                    isUpdatingPlan ||
                    (!selectedMethod) || 
                    (selectedMethod !== 'manual' && selectedMethod !== 'skip' && !uploadedFile)
                  }
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {selectedMethod === 'manual' ? 'Continue with Manual Entry' : 'Invite Members'}
                      <Users className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Success Actions */}
          {importResult && importResult.success && (
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => inviteMembersModal.close()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Check className="w-4 h-4 mr-2" />
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}