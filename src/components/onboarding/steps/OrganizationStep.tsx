"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingData } from '../OnboardingFlow';
import { createOrganization, CreateOrganizationData } from '@/lib/api/organization';
import authClient from '@/lib/auth-client';
import { toSlug } from '@/lib/utils';

interface OrganizationStepProps {
  data: OnboardingData;
  onComplete: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
}

const employeeCountOptions = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
];

export function OrganizationStep({ data, onComplete }: OrganizationStepProps) {
  const [formData, setFormData] = useState({
    companyName: data.companyName || '',
    employeeCount: data.employeeCount || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.employeeCount) {
      newErrors.employeeCount = 'Employee count is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // 1. Start loading state
    setIsLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      // 2. Check if organization exists and create if it doesn't
      const createData: CreateOrganizationData = {
        companyName: formData.companyName.trim(),
        employeeCount: formData.employeeCount,
      };

      const result = await createOrganization(createData);
      
      if (result.exists) {
        // Organization already exists
        setErrors({ companyName: "Organization already exists" });
        return;
      }

      if (result.success) {
        // 3. Organization created successfully, move to next step
        onComplete(formData);
      } else {
        throw new Error(result.error || 'Failed to create organization');
      }
    } catch (error) {
      console.error('Error creating organization:', error);
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Failed to create organization' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = async (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCheckSlug = async (value: string) => {
    if(!value.trim()) return;
    const { data, error } = await authClient.organization.checkSlug({ slug: toSlug(value) });
    if(error) {
      setErrors({ companyName: error.message ?? "Something went wrong" });
    }
  }

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
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Tell us about your organization</h1>
          <p className="text-muted-foreground text-lg">
            We'll use this information to customize your SenseiiWyze experience
          </p>
        </div>

        {/* Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Organization Details
            </CardTitle>
            <CardDescription>
              Basic information about your company to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium">
                  Company Name *
                </Label>
                <Input
                  id="companyName"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  onBlur={(e) => handleCheckSlug(e.target.value)}
                  className={errors.companyName ? 'border-destructive' : ''}
                  disabled={isLoading}
                />
                {errors.companyName && (
                  <p className="text-sm text-destructive">{errors.companyName}</p>
                )}
              </div>

              {/* Employee Count */}
              <div className="space-y-2">
                <Label htmlFor="employeeCount" className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Company Size *
                </Label>
                <Select
                  value={formData.employeeCount}
                  onValueChange={(value) => handleInputChange('employeeCount', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className={errors.employeeCount ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select number of employees" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeCountOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employeeCount && (
                  <p className="text-sm text-destructive">{errors.employeeCount}</p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm">{errors.submit}</p>
                  </div>
                </div>
              )}

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-custom-blue/5 border border-custom-blue/20 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-custom-blue rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-custom-blue mb-1">
                      Why do we need this information?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This helps us create a tailored learning experience and provide 
                      insights relevant to your organization's size and industry.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-primary text-white hover:bg-primary/90 min-w-32"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground">
            Your information is secure and will only be used to improve your experience.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
