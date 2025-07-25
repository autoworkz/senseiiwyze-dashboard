"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface UserSearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function UserSearchBar({
  value,
  onChange,
  placeholder = "Search users...",
  className = ""
}: UserSearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 w-80"
      />
    </div>
  )
} 