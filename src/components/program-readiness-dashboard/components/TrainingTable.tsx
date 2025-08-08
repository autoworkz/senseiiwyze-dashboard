"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

interface TrainingTableProps {
  user: UserData
  programRequirements: Record<string, Record<string, number>>
}

export function TrainingTable({ user, programRequirements }: TrainingTableProps) {
  const programs = Object.keys(user.programReadiness)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Readiness Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Program</TableHead>
              <TableHead>Readiness</TableHead>
              <TableHead>Required Skills</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((programName) => (
              <TableRow key={programName}>
                <TableCell className="font-medium">{programName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={user.programReadiness[programName]} className="h-2 w-24" />
                    <span>{user.programReadiness[programName]}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  {programRequirements[programName] ? (
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {Object.entries(programRequirements[programName]).map(([skill, score]) => (
                        <li key={skill}>
                          {skill}: {score}% required
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
