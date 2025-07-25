"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, Users } from "lucide-react"

interface UserLoadingStateProps {
  type?: "table" | "card" | "list" | "detail"
  message?: string
  className?: string
}

export function UserLoadingState({ 
  type = "table", 
  message = "Loading users...", 
  className = "" 
}: UserLoadingStateProps) {
  const renderTableLoading = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[180px]" />
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      ))}
    </div>
  )

  const renderCardLoading = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[80px] mb-2" />
            <Skeleton className="h-3 w-[120px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderListLoading = () => (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
          <Skeleton className="h-8 w-[80px]" />
        </div>
      ))}
    </div>
  )

  const renderDetailLoading = () => (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader>
          <Skeleton className="h-6 w-[100px] mb-4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center">
            <Skeleton className="h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-6 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <div className="space-y-2 pt-4 border-t">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[140px]" />
          </div>
        </CardContent>
      </Card>
      <div className="md:col-span-2">
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  )

  const renderContent = () => {
    switch (type) {
      case "table":
        return renderTableLoading()
      case "card":
        return renderCardLoading()
      case "list":
        return renderListLoading()
      case "detail":
        return renderDetailLoading()
      default:
        return renderTableLoading()
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground">{message}</span>
      </div>
      {renderContent()}
    </div>
  )
} 