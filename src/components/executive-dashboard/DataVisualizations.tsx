"use client"
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface DataVisualizationsProps {
  data: DashboardData
}

export const DataVisualizations = ({ data }: DataVisualizationsProps) => {
  const { readinessRanges, avgSkills, programReadiness } = data

  const getReadinessColor = (range: string) => {
    const rangeMap: { [key: string]: string } = {
      '86-100': '#008006', // Bright Green
      '75-85': '#640080',  // Purple
      '66-75': '#FFFF00',  // Yellow
      '51-65': '#FF6600',  // Orange
      '0-50': '#FF0000',   // Red
    };
    return rangeMap[range] || '#8884d8'; // Default color
  };

  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    <Card>
      <CardHeader>
        <CardTitle>Readiness Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={readinessRanges}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#00098e' }} />
            <YAxis tick={{ fill: '#00098e' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Users">
              {readinessRanges.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getReadinessColor(entry.name)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Average Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={avgSkills}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#00098e' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#00098e' }} />
            <Radar
              name="Average"
              dataKey="A"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Legend wrapperStyle={{ color: '#00098e' }} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Program Readiness</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={programReadiness}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#00098e' }}/>
            <YAxis domain={[0, 100]} tick={{ fill: '#00098e' }}/>
            <Tooltip />
            <Legend />
            <Bar dataKey="readiness" fill="#82ca9d" name="Avg. Readiness" />
            <Bar dataKey="threshold" fill="#8884d8" name="Required Threshold" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>;
};
