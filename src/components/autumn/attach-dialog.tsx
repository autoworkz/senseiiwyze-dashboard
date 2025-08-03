'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface AttachDialogProps {
  dialogProps: {
    open: boolean;
    title?: string;
    description?: string;
    content?: React.ReactNode;
    setOpen: (open: boolean) => void;
  };
}

export default function AttachDialog({ dialogProps }: AttachDialogProps) {
  const { open, title, description, content, setOpen } = dialogProps;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{title || 'Complete Your Purchase'}</DialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
          )}
        </DialogHeader>
        
        <div className="mt-4">
          {content ? (
            content
          ) : (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}