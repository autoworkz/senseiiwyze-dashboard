'use client'

import { useSession } from '@/lib/auth-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ArrowLeft,
  Target,
  Plus,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Calendar,
  Flag,
  MoreVertical,
  FileText,
  Link2,
  Upload
} from 'lucide-react'
import Link from 'next/link'

export default function TeamTasksPage() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
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
            <CardDescription>Please log in to manage tasks.</CardDescription>
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
            Team Tasks
          </h1>
          <p className="text-muted-foreground mt-2">
            Assign and track learning tasks for your team
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              12 created this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              By 18 learners
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">19</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">79%</span> completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">6</div>
            <p className="text-xs text-muted-foreground">
              Needs attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Task Management */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {[
            {
              title: 'Complete AWS Solutions Architect Practice Exam',
              description: 'Take the full practice exam and achieve at least 80% score',
              assignedTo: ['Sarah Chen', 'Marcus Thompson', 'David Kim'],
              dueDate: '2024-02-15',
              priority: 'high',
              status: 'in-progress',
              type: 'assessment',
              completedBy: ['David Kim'],
              attachments: 2
            },
            {
              title: 'Build Kubernetes Deployment Pipeline',
              description: 'Create a CI/CD pipeline using GitLab and deploy to K8s cluster',
              assignedTo: ['Emily Watson', 'James Foster'],
              dueDate: '2024-02-20',
              priority: 'medium',
              status: 'assigned',
              type: 'project',
              completedBy: [],
              attachments: 3
            },
            {
              title: 'Review Machine Learning Course Materials',
              description: 'Go through modules 1-3 and complete all exercises',
              assignedTo: ['Lisa Rodriguez', 'Alex Kumar'],
              dueDate: '2024-02-10',
              priority: 'high',
              status: 'overdue',
              type: 'learning',
              completedBy: [],
              attachments: 1
            },
            {
              title: 'Security Best Practices Documentation',
              description: 'Document team security practices and create a checklist',
              assignedTo: ['James Foster'],
              dueDate: '2024-02-18',
              priority: 'low',
              status: 'in-progress',
              type: 'documentation',
              completedBy: [],
              attachments: 0
            }
          ].map((task, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <Badge variant={
                        task.priority === 'high' ? 'destructive' :
                        task.priority === 'medium' ? 'default' :
                        'secondary'
                      }>
                        <Flag className="h-3 w-3 mr-1" />
                        {task.priority}
                      </Badge>
                      <Badge variant="outline">
                        {task.type}
                      </Badge>
                    </div>
                    <CardDescription>{task.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Assigned To */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Assigned to:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {task.assignedTo.map((person, idx) => (
                        <Badge key={idx} variant="secondary">
                          {person}
                          {task.completedBy.includes(person) && (
                            <CheckCircle className="h-3 w-3 ml-1 text-green-600" />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Status and Due Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant={
                        task.status === 'completed' ? 'default' :
                        task.status === 'in-progress' ? 'secondary' :
                        task.status === 'overdue' ? 'destructive' :
                        'outline'
                      }>
                        {task.status === 'in-progress' && <Clock className="h-3 w-3 mr-1" />}
                        {task.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {task.status === 'overdue' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {task.status.replace('-', ' ')}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    {task.attachments > 0 && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        {task.attachments} files
                      </div>
                    )}
                  </div>

                  {/* Progress */}
                  {task.status === 'in-progress' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {task.completedBy.length}/{task.assignedTo.length} completed
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(task.completedBy.length / task.assignedTo.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Send Reminder
                    </Button>
                    {task.status !== 'completed' && (
                      <Button variant="outline" size="sm">
                        Edit Task
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Task</CardTitle>
              <CardDescription>
                Assign a new learning task to your team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter a descriptive title for the task"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Provide detailed instructions and objectives"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Task Type</Label>
                    <Select>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select task type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="learning">Learning Module</SelectItem>
                        <SelectItem value="assessment">Assessment</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="documentation">Documentation</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignTo">Assign To</Label>
                    <Select>
                      <SelectTrigger id="assignTo">
                        <SelectValue placeholder="Select team members" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Team Members</SelectItem>
                        <SelectItem value="selected">Selected Members</SelectItem>
                        <SelectItem value="group">Specific Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input 
                      id="dueDate" 
                      type="date"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Attachments</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drop files here or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOC, DOCX up to 10MB
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resources">Resources & Links</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="resources" 
                      placeholder="Add helpful links or resources"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Link2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Create Task
                  </Button>
                  <Button type="button" variant="outline">
                    Save as Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}