"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'

interface UserData {
  id: string
  name: string
  role: string
  level: number
  skills: {
    vision: number
    grit: number
    logic: number
    algorithm: number
    problemSolving: number
  }
  overallReadiness: number
  programReadiness: Record<string, number>
  bestProgram: {
    name: string
    readiness: number
  }
  skillDetails: Record<string, Record<string, number>>
  initials: string
}

export function UserProfileCard({ user }: { user: UserData }) {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-2xl font-bold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.role}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Readiness</span>
            <span>{user.overallReadiness}%</span>
          </div>
          <Progress value={user.overallReadiness} className="h-2" />
          <div className="flex justify-between text-sm">
            <span>Level</span>
            <span>{user.level}</span>
          </div>
          <Progress value={user.level * 10} className="h-2" />
        </div>
        <div className="mt-4">
          <h3 className="text-md font-semibold">Best Program Match:</h3>
          <p className="text-sm text-muted-foreground">
            {user.bestProgram.name} ({user.bestProgram.readiness}%)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
