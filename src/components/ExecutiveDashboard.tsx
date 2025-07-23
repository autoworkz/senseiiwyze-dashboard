"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  CheckCircle, 
  AlertCircle, 
  BarChart3, 
  ChevronFirst, 
  ChevronLast, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal 
} from "lucide-react";

// Mock data for the dashboard
const mockData = {
  totalUsers: 36,
  avgReadiness: 82,
  readyForDeployment: 32,
  needsCoaching: 4,
  readinessDistribution: [
    { range: "0-50%", count: 0 },
    { range: "51-65%", count: 0 },
    { range: "66-75%", count: 5 },
    { range: "76-85%", count: 20 },
    { range: "86-100%", count: 11 }
  ],
  skillsData: {
    vision: 80,
    grit: 75,
    logic: 85,
    algorithm: 90,
    problemSolving: 82
  },
  programReadiness: [
    { program: "AI/ML Fundamentals", avgReadiness: 70, requiredThreshold: 85 },
    { program: "IoT Tech Support", avgReadiness: 72, requiredThreshold: 60 },
    { program: "Data Analytics", avgReadiness: 78, requiredThreshold: 75 },
    { program: "Computer Networking", avgReadiness: 73, requiredThreshold: 75 },
    { program: "Cyber Security", avgReadiness: 75, requiredThreshold: 80 }
  ],
  individualReadiness: [
    { 
      id: 1, 
      name: "Alex Thompson", 
      bestProgram: "AI/ML Fundamentals", 
      bestProgramScore: 88, 
      overallReadiness: 85 
    },
    { 
      id: 2, 
      name: "Sarah Johnson", 
      bestProgram: "Computer Networking", 
      bestProgramScore: 92, 
      overallReadiness: 82 
    },
    { 
      id: 3, 
      name: "Michael Chen", 
      bestProgram: "Data Analytics", 
      bestProgramScore: 95, 
      overallReadiness: 90 
    },
    { 
      id: 4, 
      name: "Emily Rodriguez", 
      bestProgram: "Data Analytics", 
      bestProgramScore: 82, 
      overallReadiness: 75 
    },
    { 
      id: 5, 
      name: "David Wilson", 
      bestProgram: "Cyber Security", 
      bestProgramScore: 96, 
      overallReadiness: 88 
    }
  ]
};

// Helper function to get program badge color
const getProgramBadgeColor = (program: string) => {
  const colors: Record<string, string> = {
    "AI/ML Fundamentals": "bg-slate-800",
    "Computer Networking": "bg-blue-800",
    "Data Analytics": "bg-indigo-800",
    "Cyber Security": "bg-emerald-800",
    "IoT Tech Support": "bg-amber-800"
  };
  return colors[program] || "bg-gray-800";
};

const ExecutiveDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all-users");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Executive Dashboard</h1>
      <p className="text-muted-foreground mb-6">Track and manage user skills and program readiness</p>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h2 className="text-3xl font-bold">{mockData.totalUsers}</h2>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <BarChart3 className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Readiness</p>
              <h2 className="text-3xl font-bold">{mockData.avgReadiness}%</h2>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ready for Deployment</p>
              <h2 className="text-3xl font-bold">{mockData.readyForDeployment}</h2>
              <p className="text-xs text-muted-foreground">89% of total</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <AlertCircle className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Needs Coaching</p>
              <h2 className="text-3xl font-bold">{mockData.needsCoaching}</h2>
              <p className="text-xs text-muted-foreground">11% of total</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="all-users" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all-users">All Users</TabsTrigger>
          <TabsTrigger value="ready-for-deployment">Ready for Deployment</TabsTrigger>
          <TabsTrigger value="needs-coaching">Needs Coaching</TabsTrigger>
          <TabsTrigger value="program-readiness">Program Readiness</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Charts and Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Readiness Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end justify-between">
              {mockData.readinessDistribution.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-indigo-500 w-12 rounded-t-md" 
                    style={{ 
                      height: `${Math.max(20, item.count * 12)}px`,
                      minHeight: '20px'
                    }}
                  ></div>
                  <p className="text-xs mt-2">{item.range}</p>
                  <p className="text-xs font-medium text-muted-foreground">Users</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Average Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              {/* This would be a radar chart in a real implementation */}
              <div className="grid grid-cols-1 gap-4 w-full">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Vision</span>
                    <span className="text-sm font-medium">{mockData.skillsData.vision}%</span>
                  </div>
                  <Progress value={mockData.skillsData.vision} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Grit</span>
                    <span className="text-sm font-medium">{mockData.skillsData.grit}%</span>
                  </div>
                  <Progress value={mockData.skillsData.grit} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Logic</span>
                    <span className="text-sm font-medium">{mockData.skillsData.logic}%</span>
                  </div>
                  <Progress value={mockData.skillsData.logic} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Algorithm</span>
                    <span className="text-sm font-medium">{mockData.skillsData.algorithm}%</span>
                  </div>
                  <Progress value={mockData.skillsData.algorithm} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Problem Solving</span>
                    <span className="text-sm font-medium">{mockData.skillsData.problemSolving}%</span>
                  </div>
                  <Progress value={mockData.skillsData.problemSolving} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Program Readiness Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Program Readiness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {mockData.programReadiness.map((program, index) => (
              <div key={index} className="flex flex-col items-center">
                <p className="text-sm text-center mb-2">{program.program}</p>
                <div className="w-full h-[200px] flex flex-col items-center justify-end space-x-2">
                  <div className="flex w-full justify-center space-x-4">
                    <div className="flex flex-col items-center">
                      <div 
                        className="bg-green-400 w-12 rounded-t-md" 
                        style={{ height: `${program.avgReadiness * 1.5}px` }}
                      ></div>
                      <p className="text-xs mt-1">Avg.</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div 
                        className="bg-indigo-400 w-12 rounded-t-md" 
                        style={{ height: `${program.requiredThreshold * 1.5}px` }}
                      ></div>
                      <p className="text-xs mt-1">Req.</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Individual Program Readiness Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Individual Program Readiness</CardTitle>
          <div className="flex space-x-2">
            <Input 
              placeholder="Search users..." 
              className="max-w-[200px]" 
            />
            <Select defaultValue="all-roles">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-roles">All Roles</SelectItem>
                <SelectItem value="developers">Developers</SelectItem>
                <SelectItem value="analysts">Analysts</SelectItem>
                <SelectItem value="managers">Managers</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-levels">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-levels">All Levels</SelectItem>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="mid">Mid-level</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox />
                </TableHead>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Best Program Match</TableHead>
                <TableHead>Overall Readiness</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.individualReadiness.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-md text-xs text-white ${getProgramBadgeColor(user.bestProgram)}`}>
                          {user.bestProgram}
                        </span>
                        <span>{user.bestProgramScore}%</span>
                      </div>
                      <Progress value={user.bestProgramScore} className="h-2 mt-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{user.overallReadiness}%</span>
                      <Progress value={user.overallReadiness} className="h-2 mt-2" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Individual Program Readiness Snapshot
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing 1-{Math.min(itemsPerPage, mockData.individualReadiness.length)} of {mockData.totalUsers}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm mr-2">Show:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                  <ChevronFirst className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="bg-primary text-primary-foreground">
                  1
                </Button>
                <Button variant="outline" size="icon">
                  2
                </Button>
                <Button variant="outline" size="icon">
                  3
                </Button>
                <Button variant="outline" size="icon">
                  4
                </Button>
                <Button variant="outline" size="icon" disabled>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  8
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage * itemsPerPage >= mockData.totalUsers}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(Math.ceil(mockData.totalUsers / itemsPerPage))} disabled={currentPage * itemsPerPage >= mockData.totalUsers}>
                  <ChevronLast className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveDashboard;