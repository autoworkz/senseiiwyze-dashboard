'use client'

import { useSession } from '@/lib/auth-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft,
  Users, 
  Award,
  Target,
  Clock,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  MoreVertical
} from 'lucide-react'
import Link from 'next/link'

export default function TeamProfilePage() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading team profile...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access team profiles.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/coach/team" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Team Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your team members and track individual progress
          </p>
        </div>
        <Button className="gap-2">
          <Users className="h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      {/* Team Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Team Overview</CardTitle>
          <CardDescription>Engineering Team - Cloud Infrastructure Division</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">24</p>
              <p className="text-sm text-muted-foreground">Total Members</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">18</p>
              <p className="text-sm text-muted-foreground">Active Learners</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">75%</p>
              <p className="text-sm text-muted-foreground">Avg. Readiness</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">92%</p>
              <p className="text-sm text-muted-foreground">Certification Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            name: 'Sarah Chen',
            role: 'Senior Cloud Architect',
            email: 'sarah.chen@company.com',
            location: 'San Francisco, CA',
            readiness: 87,
            certifications: 5,
            currentPath: 'AWS Solutions Architect Professional',
            progress: 85,
            lastActive: '2 hours ago',
            status: 'active'
          },
          {
            name: 'Marcus Thompson',
            role: 'DevOps Engineer',
            email: 'marcus.t@company.com',
            location: 'Austin, TX',
            readiness: 92,
            certifications: 3,
            currentPath: 'Kubernetes Administrator',
            progress: 72,
            lastActive: '1 day ago',
            status: 'active'
          },
          {
            name: 'Lisa Rodriguez',
            role: 'Data Engineer',
            email: 'lisa.r@company.com',
            location: 'New York, NY',
            readiness: 68,
            certifications: 2,
            currentPath: 'Machine Learning Specialist',
            progress: 45,
            lastActive: '3 days ago',
            status: 'support'
          },
          {
            name: 'David Kim',
            role: 'Platform Engineer',
            email: 'david.kim@company.com',
            location: 'Seattle, WA',
            readiness: 95,
            certifications: 6,
            currentPath: 'Google Cloud Professional',
            progress: 90,
            lastActive: '5 hours ago',
            status: 'active'
          },
          {
            name: 'Emily Watson',
            role: 'Site Reliability Engineer',
            email: 'emily.w@company.com',
            location: 'Denver, CO',
            readiness: 78,
            certifications: 4,
            currentPath: 'Terraform Associate',
            progress: 60,
            lastActive: '12 hours ago',
            status: 'active'
          },
          {
            name: 'James Foster',
            role: 'Cloud Security Engineer',
            email: 'james.f@company.com',
            location: 'Chicago, IL',
            readiness: 82,
            certifications: 4,
            currentPath: 'Security Specialty',
            progress: 55,
            lastActive: '2 days ago',
            status: 'inactive'
          }
        ].map((member, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{member.location}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 py-3 border-y">
                <div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Readiness</span>
                  </div>
                  <p className="text-2xl font-bold">{member.readiness}%</p>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Certs</span>
                  </div>
                  <p className="text-2xl font-bold">{member.certifications}</p>
                </div>
              </div>

              {/* Current Learning */}
              <div>
                <p className="text-sm font-medium mb-2">Current Path</p>
                <p className="text-sm text-muted-foreground mb-2">{member.currentPath}</p>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${member.progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium ml-3">{member.progress}%</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between pt-2">
                <Badge variant={
                  member.status === 'active' ? 'default' :
                  member.status === 'support' ? 'destructive' :
                  'secondary'
                }>
                  {member.status === 'active' ? 'Active' :
                   member.status === 'support' ? 'Needs Support' :
                   'Inactive'}
                </Badge>
                <span className="text-xs text-muted-foreground">{member.lastActive}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View Profile
                </Button>
                <Button size="sm" className="flex-1">
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Team Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Email All Members
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Team Meeting
            </Button>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Generate Team Report
            </Button>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Team Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}