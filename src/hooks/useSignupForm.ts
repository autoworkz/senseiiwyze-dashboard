import { useState, useCallback } from 'react';
import { z } from 'zod';
import { signupFormSchema } from '@/utils/validationSchema';

export type SignupFormData = z.infer<typeof signupFormSchema>;
export type SignupFormErrors = Record<keyof SignupFormData | 'general', string>;

const initialFormData: SignupFormData = {
    name: '',
    email: '',
    password: '',
};

const initialErrors: Partial<SignupFormErrors> = {};

export const useSignupForm = () => {
    const [formData, setFormData] = useState<SignupFormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<SignupFormErrors>>(initialErrors);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = useCallback((field: keyof SignupFormData, value: string) => {
        setFormData((prev: SignupFormData) => ({
            ...prev,
            [field]: value,
        }));
        setErrors((prev: Partial<SignupFormErrors>) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            delete newErrors.general;
            return newErrors;
        });
    }, []);

    const validateForm = useCallback((): boolean => {
        const result = signupFormSchema.safeParse(formData);
        if (result.success) {
            setErrors({});
            return true;
        }
        const newErrors = result.error.flatten().fieldErrors as Partial<SignupFormErrors>;
        setErrors(newErrors);
        return false;
    }, [formData]);

    const resetForm = useCallback(() => {
        setFormData(initialFormData);
        setErrors(initialErrors);
        setIsSubmitting(false);
    }, []);

    return {
        formData,
        errors,
        isSubmitting,
        updateField,
        setErrors,
        setIsSubmitting,
        validateForm,
        resetForm,
    };
}; 