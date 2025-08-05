"use client"
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface DashboardData {
  userData: any[]
  totalUsers: number
  avgReadiness: number
  readyUsers: number
  coachingUsers: number
  readinessRanges: any[]
  avgSkills: any[]
  programReadiness: any[]
  programThresholds: any
  success: boolean
}

interface ProgramReadinessCardsProps {
  data: DashboardData
}

export const ProgramReadinessCards = ({ data }: ProgramReadinessCardsProps) => {
  const { programReadiness } = data;
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {programReadiness.map((program: any) => {
      const { name, readiness, threshold, readyUsers, readyPercentage } = program;
      
      let statusColor = 'text-red-500';
      let StatusIcon = XCircle;
      if (readiness >= threshold) {
        statusColor = 'text-green-500';
        StatusIcon = CheckCircle;
      } else if (readiness >= threshold - 10) {
        statusColor = 'text-yellow-500';
        StatusIcon = AlertCircle;
      }
      
      return <Card key={name}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>Threshold: {threshold}%</CardDescription>
                </div>
                <StatusIcon className={`h-5 w-5 ${statusColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Readiness</span>
                    <span className="font-medium">{readiness}%</span>
                  </div>
                  <Progress value={readiness} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Users Ready</span>
                    <span className="font-medium">
                      {readyUsers}/{data.totalUsers} ({readyPercentage}%)
                    </span>
                  </div>
                  <Progress value={readyPercentage} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>;
    })}
    </div>;
};