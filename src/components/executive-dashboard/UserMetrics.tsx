import React from 'react';
import { CheckCircle, AlertCircle, Users, Award } from 'lucide-react';
import { useFilteredDashboardData } from '@/hooks/useFilteredUsers';
import { DashboardData } from '@/types/dashboard';

interface UserMetricsProps {
  data: DashboardData
  avgReadiness: number
}

export const UserMetrics = ({ data, avgReadiness }: UserMetricsProps) => {
  const { filteredData, hasData, totalFilteredUsers } = useFilteredDashboardData(data)

  // If no data, show empty state
  if (!hasData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4 flex items-center space-x-4">
          <div className="bg-gray-100 p-3 rounded-full">
            <Users className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-400">0</h3>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4 flex items-center space-x-4">
          <div className="bg-gray-100 p-3 rounded-full">
            <Award className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg. Readiness</p>
            <h3 className="text-2xl font-bold text-gray-400">0%</h3>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4 flex items-center space-x-4">
          <div className="bg-gray-100 p-3 rounded-full">
            <CheckCircle className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Ready for Deployment</p>
            <h3 className="text-2xl font-bold text-gray-400">0</h3>
            <p className="text-xs text-gray-400">0% of total</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4 flex items-center space-x-4">
          <div className="bg-gray-100 p-3 rounded-full">
            <AlertCircle className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Needs Coaching</p>
            <h3 className="text-2xl font-bold text-gray-400">0</h3>
            <p className="text-xs text-gray-400">0% of total</p>
          </div>
        </div>
      </div>
    );
  }

  // Recalculate metrics based on filtered users
  const filteredUsers = filteredData!.userData
  

  // Count users ready for deployment (75% or higher)
  const readyUsers = filteredUsers.filter(user => (user.overallReadiness || 0) >= 75).length

  // Count users needing coaching (below 75%)
  const coachingUsers = filteredUsers.filter(user => (user.overallReadiness || 0) < 75).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg border p-4 flex items-center space-x-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Users</p>
          <h3 className="text-2xl font-bold">{totalFilteredUsers}</h3>
          <p className="text-xs text-gray-500">with data</p>
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
            {totalFilteredUsers > 0 ? Math.round(readyUsers / totalFilteredUsers * 100) : 0}% of active users
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
            {totalFilteredUsers > 0 ? Math.round(coachingUsers / totalFilteredUsers * 100) : 0}% of active users
          </p>
        </div>
      </div>
    </div>
  );
};
