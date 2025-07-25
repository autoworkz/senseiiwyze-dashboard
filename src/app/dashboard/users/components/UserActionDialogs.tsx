"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserStatus } from '@/types/user'

interface UserActionDialogsProps {
  showDeleteDialog: boolean
  showStatusDialog: boolean
  selectedCount: number
  bulkAction: 'delete' | 'activate' | 'suspend' | null
  onDeleteDialogChange: (open: boolean) => void
  onStatusDialogChange: (open: boolean) => void
  onConfirmDelete: () => void
  onConfirmStatusChange: (status: UserStatus) => void
}

export function UserActionDialogs({
  showDeleteDialog,
  showStatusDialog,
  selectedCount,
  bulkAction,
  onDeleteDialogChange,
  onStatusDialogChange,
  onConfirmDelete,
  onConfirmStatusChange
}: UserActionDialogsProps) {
  return (
    <>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={onDeleteDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Users</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCount} user{selectedCount !== 1 ? 's' : ''}? 
              This action cannot be undone and will permanently remove the selected user{selectedCount !== 1 ? 's' : ''} from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={onStatusDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkAction === 'activate' ? 'Activate' : 'Suspend'} Users
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {bulkAction === 'activate' ? 'activate' : 'suspend'} {selectedCount} user{selectedCount !== 1 ? 's' : ''}? 
              This will change their account status to {bulkAction === 'activate' ? 'active' : 'suspended'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => onConfirmStatusChange(bulkAction === 'activate' ? UserStatus.ACTIVE : UserStatus.SUSPENDED)}
              className={bulkAction === 'activate' ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' : 'bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600'}
            >
              {bulkAction === 'activate' ? 'Activate' : 'Suspend'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 