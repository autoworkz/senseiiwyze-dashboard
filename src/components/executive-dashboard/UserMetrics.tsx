import React from 'react';
import { CheckCircle, AlertCircle, Users, Award } from 'lucide-react';

interface DashboardData {
  userData: any[]
  totalUsers: number
  avgReadiness: number
  readyUsers: number
  coachingUsers: number
  success: boolean
}

interface UserMetricsProps {
  data: DashboardData
}

export const UserMetrics = ({ data }: UserMetricsProps) => {
  const { totalUsers, avgReadiness, readyUsers, coachingUsers } = data

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg border p-4 flex items-center space-x-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Users</p>
          <h3 className="text-2xl font-bold">{totalUsers}</h3>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4 flex items-center space-x-4">
        <div className="bg-green-100 p-3 rounded-full">
          <Award className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Avg. Readiness</p>
          <h3 className="text-2xl font-bold">{avgReadiness}%</h3>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4 flex items-center space-x-4">
        <div className="bg-emerald-100 p-3 rounded-full">
          <CheckCircle className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Ready for Deployment</p>
          <h3 className="text-2xl font-bold">{readyUsers}</h3>
          <p className="text-xs text-gray-500">
            {totalUsers > 0 ? Math.round(readyUsers / totalUsers * 100) : 0}% of total
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4 flex items-center space-x-4">
        <div className="bg-amber-100 p-3 rounded-full">
          <AlertCircle className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Needs Coaching</p>
          <h3 className="text-2xl font-bold">{coachingUsers}</h3>
          <p className="text-xs text-gray-500">
            {totalUsers > 0 ? Math.round(coachingUsers / totalUsers * 100) : 0}% of total
          </p>
        </div>
      </div>
    </div>
  );
};