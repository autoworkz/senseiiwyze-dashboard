"use client"
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFilteredDashboardData } from '@/hooks/useFilteredUsers';
import { DashboardData } from '@/types/dashboard';

interface DataVisualizationsProps {
  data: DashboardData
}

export const DataVisualizations = ({ data }: DataVisualizationsProps) => {
  const { filteredData, hasData, totalFilteredUsers } = useFilteredDashboardData(data)

  const getReadinessColor = (range: string) => {
    // Extract numbers from the name string (handles cases like "86% - 100%")
    const match = range.match(/\d+/g);
    if (!match) return '#8884d8';

    const lowerBound = parseInt(match[0], 10); // first number in the string

    if (lowerBound >= 86) return '#008006'; // Bright Green
    if (lowerBound >= 75) return '#640080'; // Purple
    if (lowerBound >= 66) return '#FFC000'; // Yellow
    if (lowerBound >= 51) return '#FF6600'; // Orange
    return '#FF0000'; // Red
  };

  // Show message if no users have data
  if (!hasData || !filteredData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No users have completed assessments yet. Charts will appear once users start engaging with the platform.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    <Card>
      <CardHeader>
        <CardTitle>Readiness Distribution ({totalFilteredUsers} users)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={filteredData.readinessRanges || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#00098e' }} />
            <YAxis tick={{ fill: '#00098e' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Users">
              {(filteredData.readinessRanges || []).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getReadinessColor(entry.name)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Average Skills ({totalFilteredUsers} users)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={filteredData.avgSkills || []}>
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
        <CardTitle>Program Readiness ({totalFilteredUsers} users)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData.programReadiness || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#00098e' }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#00098e' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="readiness" fill="#FFC000" name="Avg. Readiness" />
            <Bar dataKey="threshold" fill="#640080" name="Required Threshold" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>;
};
