"use client"

import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import Link from "next/link"

export interface UserListHeaderProps {
  title: string
  description: string
  showAddButton: boolean
}

export function UserListHeader({ 
  title = "Users", 
  description = "Manage and monitor user accounts and their activities",
  showAddButton = true 
}: UserListHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {showAddButton && (
        <Button asChild>
          <Link href="/dashboard/users/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      )}
    </div>
  )
}
