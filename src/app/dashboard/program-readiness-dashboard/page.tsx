'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Download, 
  MessageCircle, 
  Database,
  ChevronDown
} from 'lucide-react';

// Mock data
const userData = {
  name: 'testuser',
  level: 5,
  avatar: 'https://ui-avatars.com/api/?name=testuser&background=e2e8f0&color=64748b&size=128',
  metrics: {
    vision: 59,
    grit: 59,
    logic: 59,
    algorithm: 59
  },
  recommended: {
    program: 'Maze',
    score: 68
  }
};

const skillsData = [
  { name: 'Technical', score: 59, color: 'bg-blue-500' },
  { name: 'Problem Solving', score: 59, color: 'bg-red-500' },
  { name: 'Creativity', score: 59, color: 'bg-orange-500' },
  { name: 'Emotional Intelligence', score: 59, color: 'bg-purple-500' }
];

const programsData = [
  { 
    name: 'Turtle', 
    score: 59, 
    status: 'Not Ready', 
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    metrics: { vision: 59, grit: 59, logic: 59, algorithm: 59 }
  },
  { 
    name: 'Pond', 
    score: 51, 
    status: 'Not Ready', 
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    metrics: { vision: 51, grit: 51, logic: 51, algorithm: 51 }
  },
  { 
    name: 'Plane', 
    score: 62, 
    status: 'Almost', 
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    metrics: { vision: 62, grit: 62, logic: 62, algorithm: 62 }
  },
  { 
    name: 'Maze', 
    score: 68, 
    status: 'Almost', 
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    metrics: { vision: 68, grit: 68, logic: 68, algorithm: 68 }
  },
  { 
    name: 'Movie', 
    score: 57, 
    status: 'Not Ready', 
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    metrics: { vision: 57, grit: 57, logic: 57, algorithm: 57 }
  },
  { 
    name: 'Music', 
    score: 58, 
    status: 'Not Ready', 
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    metrics: { vision: 58, grit: 58, logic: 58, algorithm: 58 }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Ready': return 'bg-green-500';
    case 'Almost': return 'bg-yellow-500';
    case 'Not Ready': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getStatusTextColor = (status: string) => {
  switch (status) {
    case 'Ready': return 'text-green-700 bg-green-100';
    case 'Almost': return 'text-yellow-700 bg-yellow-100';
    case 'Not Ready': return 'text-red-700 bg-red-100';
    default: return 'text-gray-700 bg-gray-100';
  }
};
  averageReadiness: 82,
  readyForDeployment: 32,
  needsCoaching: 4,
  readinessDistribution: [
    { range: "0-50%", count: 2, percentage: 6 },
    { range: "51-65%", count: 2, percentage: 6 },
    { range: "66-75%", count: 4, percentage: 11 },
    { range: "76-85%", count: 10, percentage: 28 },
    { range: "86-100%", count: 18, percentage: 50 },
  ],
  averageSkills: {
    vision: 78,
    grit: 85,
    logic: 80,
    algorithm: 76,
    problemSolving: 89,
  },
  programReadiness: [
    { name: "AI/ML Fundamentals", average: 84, required: 75 },
    { name: "IoT Tech Support", average: 79, required: 70 },
    { name: "Data Analytics", average: 88, required: 80 },
    { name: "Computer Networking", average: 76, required: 75 },
    { name: "Cyber Security", average: 81, required: 85 },
  ],
  users: [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.j@example.com",
      bestProgram: "Data Analytics",
      overallReadiness: 92,
      programReadiness: {
        "AI/ML Fundamentals": 88,
        "IoT Tech Support": 75,
        "Data Analytics": 95,
        "Computer Networking": 82,
        "Cyber Security": 86,
      },
    },
    {
      id: 2,
      name: "Jamie Smith",
      email: "jamie.s@example.com",
      bestProgram: "Cyber Security",
      overallReadiness: 88,
      programReadiness: {
        "AI/ML Fundamentals": 82,
        "IoT Tech Support": 70,
        "Data Analytics": 85,
        "Computer Networking": 79,
        "Cyber Security": 94,
      },
    },
    {
      id: 3,
      name: "Taylor Wilson",
      email: "taylor.w@example.com",
      bestProgram: "AI/ML Fundamentals",
      overallReadiness: 85,
      programReadiness: {
        "AI/ML Fundamentals": 91,
        "IoT Tech Support": 78,
        "Data Analytics": 83,
        "Computer Networking": 75,
        "Cyber Security": 80,
      },
    },
    {
      id: 4,
      name: "Morgan Lee",
      email: "morgan.l@example.com",
      bestProgram: "IoT Tech Support",
      overallReadiness: 79,
      programReadiness: {
        "AI/ML Fundamentals": 72,
        "IoT Tech Support": 88,
        "Data Analytics": 76,
        "Computer Networking": 81,
        "Cyber Security": 74,
      },
    },
    {
      id: 5,
      name: "Casey Brown",
      email: "casey.b@example.com",
      bestProgram: "Computer Networking",
      overallReadiness: 83,
      programReadiness: {
        "AI/ML Fundamentals": 78,
        "IoT Tech Support": 82,
        "Data Analytics": 80,
        "Computer Networking": 90,
        "Cyber Security": 79,
      },
    },
    {
      id: 6,
      name: "Jordan Rivera",
      email: "jordan.r@example.com",
      bestProgram: "Data Analytics",
      overallReadiness: 62,
      programReadiness: {
        "AI/ML Fundamentals": 58,
        "IoT Tech Support": 60,
        "Data Analytics": 72,
        "Computer Networking": 65,
        "Cyber Security": 55,
      },
    },
  ],
}

export default function ProgramReadinessDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])

  const filteredUsers = mockData.users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bestProgram.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const getProgressColor = (value: number, threshold: number) => {
    if (value >= threshold) return "bg-green-500"
    if (value >= threshold - 10) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Executive Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Enrolled in skills assessment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Readiness</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.averageReadiness}%</div>
            <Progress value={mockData.averageReadiness} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ready for Deployment</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.readyForDeployment}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockData.readyForDeployment / mockData.totalUsers) * 100)}% of total users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Needs Coaching</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.needsCoaching}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockData.needsCoaching / mockData.totalUsers) * 100)}% of total users
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Readiness Distribution</CardTitle>
            <CardDescription>User readiness percentage ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.readinessDistribution.map((item) => (
                <div key={item.range} className="flex items-center">
                  <div className="w-16 text-sm">{item.range}</div>
                  <div className="flex-1 mx-2">
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                  <div className="w-12 text-right text-sm">{item.count} users</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Skills</CardTitle>
            <CardDescription>Across all assessed users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(mockData.averageSkills).map(([skill, value]) => (
                <div key={skill} className="flex items-center">
                  <div className="w-28 text-sm capitalize">{skill.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div className="flex-1 mx-2">
                    <Progress value={value} className="h-2" />
                  </div>
                  <div className="w-12 text-right text-sm">{value}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Program Readiness</CardTitle>
          <CardDescription>Average user readiness vs. required levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockData.programReadiness.map((program) => (
              <div key={program.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{program.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Required: {program.required}%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={program.average} 
                    className={`h-2 flex-1 ${getProgressColor(program.average, program.required)}`} 
                  />
                  <span className="text-sm font-medium">{program.average}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Individual Program Readiness</CardTitle>
              <CardDescription>Detailed view of user readiness for each program</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="ready">Ready for Deployment</TabsTrigger>
              <TabsTrigger value="program">Program Readiness</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-[25px_1fr_1fr_1fr_120px] gap-4 p-4 font-medium border-b">
                  <div className="flex items-center">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers(filteredUsers.map((user) => user.id))
                        } else {
                          setSelectedUsers([])
                        }
                      }}
                    />
                  </div>
                  <div>User</div>
                  <div>Best Program Match</div>
                  <div>Overall Readiness</div>
                  <div className="text-right">Actions</div>
                </div>
                {filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No users found</div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-[25px_1fr_1fr_1fr_120px] gap-4 p-4 items-center border-b last:border-0"
                    >
                      <div>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleUserSelection(user.id)}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://avatar.vercel.sh/${user.id}.png`} alt={user.name} />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                      <div>{user.bestProgram}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={user.overallReadiness}
                            className={`h-2 w-[100px] ${
                              user.overallReadiness >= 80
                                ? "bg-green-500"
                                : user.overallReadiness >= 70
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span>{user.overallReadiness}%</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="ready" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-[25px_1fr_1fr_1fr_120px] gap-4 p-4 font-medium border-b">
                  <div className="flex items-center">
                    <Checkbox />
                  </div>
                  <div>User</div>
                  <div>Best Program Match</div>
                  <div>Overall Readiness</div>
                  <div className="text-right">Actions</div>
                </div>
                {filteredUsers
                  .filter((user) => user.overallReadiness >= 80)
                  .map((user) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-[25px_1fr_1fr_1fr_120px] gap-4 p-4 items-center border-b last:border-0"
                    >
                      <div>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleUserSelection(user.id)}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://avatar.vercel.sh/${user.id}.png`} alt={user.name} />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                      <div>{user.bestProgram}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={user.overallReadiness}
                            className="h-2 w-[100px] bg-green-500"
                          />
                          <span>{user.overallReadiness}%</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="program" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-[1fr_repeat(5,_80px)_120px] gap-4 p-4 font-medium border-b">
                  <div>User</div>
                  {mockData.programReadiness.map((program) => (
                    <div key={program.name} className="text-center text-xs">
                      {program.name.split(' ')[0]}
                    </div>
                  ))}
                  <div className="text-right">Actions</div>
                </div>
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-[1fr_repeat(5,_80px)_120px] gap-4 p-4 items-center border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${user.id}.png`} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    {mockData.programReadiness.map((program) => {
                      const readiness = user.programReadiness[program.name]
                      return (
                        <div key={program.name} className="flex flex-col items-center justify-center">
                          <Badge
                            className={
                              readiness >= program.required
                                ? "bg-green-500"
                                : readiness >= program.required - 10
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }
                          >
                            {readiness}%
                          </Badge>
                        </div>
                      )
                    })}
                    <div className="flex justify-end">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}