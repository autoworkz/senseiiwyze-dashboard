"use client"

import { UserDashboardLayout, DashboardGrid, DashboardSection } from "@/components/dashboard/user-dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserProfileCard } from "@/components/dashboard/user-profile-card"
import { MetricsOverview } from "@/components/dashboard/metrics-overview"
import { DetailedMetricsCards } from "@/components/dashboard/detailed-metrics-cards"
import { GoalsObjectives } from "@/components/dashboard/goals-objectives"
import { ActivityTimeline } from "@/components/dashboard/activity-timeline"
import { PerformanceAnalytics } from "@/components/dashboard/performance-analytics"
import { DashboardFooter } from "@/components/dashboard/dashboard-footer"

// Mock data
const mockUser = {
  full_name: "Sarah Johnson",
  employee_id: "EMP-2024-0156",
  department: "Engineering",
  position: "Senior Software Engineer",
  manager_name: "Michael Chen",
  start_date: "2022-03-15",
  avatar_url: null,
  employment_status: "active" as const,
  program_readiness: "in_progress" as const
}

const mockMetrics = {
  overall_score: 87,
  goal_achievement: 92,
  skill_development: 78,
  team_collaboration: 85
}

const mockDetailedMetrics = {
  productivity_score: 89,
  quality_rating: 4,
  attendance_rate: 96,
  project_completion: 87,
  technical_skills: 85,
  communication: 92,
  leadership: 75,
  problem_solving: 88,
  program_readiness: {
    status: "in_progress" as const,
    required_training: true,
    certifications: true,
    performance_threshold: true,
    manager_approval: false
  },
  training_programs: [
    {
      name: "Advanced React Development",
      status: "in_progress" as const,
      progress: 75
    },
    {
      name: "Leadership Fundamentals",
      status: "completed" as const,
      progress: 100
    },
    {
      name: "AWS Cloud Architecture",
      status: "not_started" as const,
      progress: 0
    }
  ]
}

const mockGoals = [
  {
    id: "1",
    title: "Q4 Sales Target",
    status: "in_progress" as const,
    progress: 75,
    due_date: "2024-12-31",
    description: "Achieve 120% of quarterly sales target through improved client engagement and new product launches."
  },
  {
    id: "2", 
    title: "Leadership Training",
    status: "completed" as const,
    progress: 100,
    completion_date: "2024-10-15",
    description: "Complete the comprehensive leadership development program including mentoring and team management modules."
  },
  {
    id: "3",
    title: "Team Collaboration",
    status: "pending" as const,
    progress: 30,
    due_date: "2024-11-30",
    description: "Implement cross-functional collaboration strategies to improve team productivity and communication."
  }
]

const mockActivities = [
  {
    id: "1",
    date: "2024-10-20",
    type: "feedback" as const,
    title: "Quarterly Review",
    description: "Excellent performance in Q3 with outstanding leadership in the mobile app project. Demonstrated strong technical skills and team collaboration."
  },
  {
    id: "2",
    date: "2024-10-15", 
    type: "achievement" as const,
    title: "Certification Completed",
    description: "Successfully completed AWS Solutions Architect certification with a score of 92%. This enhances our cloud infrastructure capabilities."
  },
  {
    id: "3",
    date: "2024-10-10",
    type: "goal" as const,
    title: "Goal Updated",
    description: "Q4 targets revised upward due to excellent performance. New stretch goals added for professional development."
  },
  {
    id: "4",
    date: "2024-10-05",
    type: "training" as const,
    title: "Training Enrolled",
    description: "Enrolled in Advanced React Development course to strengthen frontend development skills and mentor junior developers."
  }
]

export default function UserDashboardDemo() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Users", href: "/dashboard/users" },
    { label: "User Details", current: true }
  ]

  const headerActions = [
    {
      type: "button" as const,
      variant: "secondary" as const,
      label: "Export Data",
      icon: "download",
      onClick: () => console.log("Export data clicked")
    },
    {
      type: "button" as const,
      variant: "primary" as const,
      label: "Edit User",
      icon: "edit",
      onClick: () => console.log("Edit user clicked")
    }
  ]

  return (
    <UserDashboardLayout>
      {/* Header */}
      <DashboardHeader
        title="User Data Dashboard"
        subtitle="Comprehensive view of user metrics and program readiness data"
        breadcrumb={breadcrumbItems}
        actions={headerActions}
      />

      {/* Main Content Grid */}
      <DashboardGrid columns={12} gap={6}>
        {/* User Profile Card */}
        <DashboardSection gridSpan={4}>
          <UserProfileCard user={mockUser} />
        </DashboardSection>

        {/* Performance Metrics Overview */}
        <DashboardSection gridSpan={8}>
          <MetricsOverview metrics={mockMetrics} />
        </DashboardSection>

        {/* Detailed Metrics Cards */}
        <DashboardSection gridSpan={12}>
          <DetailedMetricsCards data={mockDetailedMetrics} />
        </DashboardSection>

        {/* Goals & Objectives */}
        <DashboardSection gridSpan={6}>
          <GoalsObjectives goals={mockGoals} />
        </DashboardSection>

        {/* Recent Activity & Feedback */}
        <DashboardSection gridSpan={6}>
          <ActivityTimeline activities={mockActivities} />
        </DashboardSection>

        {/* Performance Analytics */}
        <DashboardSection gridSpan={12}>
          <PerformanceAnalytics />
        </DashboardSection>
      </DashboardGrid>

      {/* Footer */}
      <DashboardFooter
        lastUpdated="2024-10-21T14:30:00Z"
        onGenerateReport={() => console.log("Generate report clicked")}
        onScheduleReview={() => console.log("Schedule review clicked")}
        onSendFeedback={() => console.log("Send feedback clicked")}
      />
    </UserDashboardLayout>
  )
}