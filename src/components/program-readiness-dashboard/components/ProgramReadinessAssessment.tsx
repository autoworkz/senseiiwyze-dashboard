"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'

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

interface ProgramReadinessAssessmentProps {
  user: UserData
  programRequirements: Record<string, Record<string, number>>
  programCoverUrls: Record<string, string | null>
}

export function ProgramReadinessAssessment({
  user,
  programRequirements,
  programCoverUrls,
}: ProgramReadinessAssessmentProps) {
  const programs = Object.keys(user.programReadiness)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Readiness Assessment</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((programName) => (
          <Card key={programName} className="flex flex-col">
            <CardHeader className="p-0">
              {programCoverUrls[programName] && (
                <div className="relative h-32 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src={programCoverUrls[programName]!}
                    alt={programName}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold">{programName}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Readiness: {user.programReadiness[programName]}%
                </p>
                <Progress value={user.programReadiness[programName]} className="h-2 mt-2" />
                {programRequirements[programName] && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium">Key Requirements:</h4>
                    <ul className="list-disc list-inside text-xs text-muted-foreground">
                      {Object.entries(programRequirements[programName]).map(([skill, score]) => (
                        <li key={skill}>
                          {skill}: {score}% required
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
