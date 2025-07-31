'use client'

import { useSession } from '@/lib/auth-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ArrowLeft,
  MessageSquare,
  Send,
  Search,
  Star,
  Archive,
  Trash2,
  MoreVertical,
  Paperclip,
  Bell,
  Users,
  Clock,
  CheckCheck,
  Circle
} from 'lucide-react'
import Link from 'next/link'

export default function TeamMessagesPage() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
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
            <CardDescription>Please log in to access messages.</CardDescription>
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
            Team Messages
          </h1>
          <p className="text-muted-foreground mt-2">
            Communicate with your team members
          </p>
        </div>
        <Button className="gap-2">
          <MessageSquare className="h-4 w-4" />
          New Message
        </Button>
      </div>

      {/* Message Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Circle className="h-4 w-4 text-blue-600 fill-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              New messages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              Active threads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">
              Average response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Important</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Starred messages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Messages Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Message List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Archive className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search messages..." 
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[450px]">
              {[
                {
                  name: 'Sarah Chen',
                  role: 'Senior Developer',
                  message: 'Thanks for the feedback on my AWS project!',
                  time: '2 min ago',
                  unread: 2,
                  online: true
                },
                {
                  name: 'Marcus Thompson',
                  role: 'Full Stack Developer',
                  message: 'I completed the Kubernetes assessment',
                  time: '1 hour ago',
                  unread: 0,
                  online: true
                },
                {
                  name: 'Lisa Rodriguez',
                  role: 'Data Scientist',
                  message: 'Can we schedule a 1-on-1 for tomorrow?',
                  time: '3 hours ago',
                  unread: 1,
                  online: false
                },
                {
                  name: 'David Kim',
                  role: 'DevOps Engineer',
                  message: 'The CI/CD pipeline is now working perfectly',
                  time: 'Yesterday',
                  unread: 0,
                  online: false
                },
                {
                  name: 'Emily Watson',
                  role: 'SRE',
                  message: 'Question about the monitoring setup...',
                  time: '2 days ago',
                  unread: 0,
                  online: true
                }
              ].map((conversation, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer border-b"
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${conversation.name}`} />
                      <AvatarFallback>{conversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{conversation.name}</p>
                      <span className="text-xs text-muted-foreground">{conversation.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{conversation.role}</p>
                    <p className="text-sm text-muted-foreground truncate mt-1">{conversation.message}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                      {conversation.unread}
                    </Badge>
                  )}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Sarah Chen" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Sarah Chen</h3>
                  <p className="text-sm text-muted-foreground">Senior Developer • Online</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Star className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[450px]">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {/* Received Message */}
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Sarah Chen" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-3 max-w-md">
                      <p className="text-sm">Hi! I just completed the AWS Solutions Architect practice exam.</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">2:30 PM</p>
                  </div>
                </div>

                {/* Sent Message */}
                <div className="flex gap-3 justify-end">
                  <div className="flex-1 text-right">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-md ml-auto">
                      <p className="text-sm">That's great! How did it go? What was your score?</p>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <p className="text-xs text-muted-foreground">2:32 PM</p>
                      <CheckCheck className="h-3 w-3 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Received Message */}
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Sarah Chen" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-3 max-w-md">
                      <p className="text-sm">I scored 88%! I'm really happy with the result. The practice questions you shared were really helpful.</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">2:35 PM</p>
                  </div>
                </div>

                {/* Sent Message */}
                <div className="flex gap-3 justify-end">
                  <div className="flex-1 text-right">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-md ml-auto">
                      <p className="text-sm">Excellent work! 88% is a fantastic score. You're definitely ready for the real exam. When are you planning to take it?</p>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <p className="text-xs text-muted-foreground">2:37 PM</p>
                      <CheckCheck className="h-3 w-3 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Received Message with Typing Indicator */}
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Sarah Chen" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-3 max-w-md">
                      <p className="text-sm">Thanks for the feedback on my AWS project! I've implemented the changes you suggested.</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Just now</p>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-4">
              <form className="flex gap-2">
                <Button type="button" variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea 
                  placeholder="Type your message..." 
                  className="flex-1 min-h-[44px] max-h-[120px] resize-none"
                  rows={1}
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Message Templates</CardTitle>
          <CardDescription>Quick responses for common scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Great progress! Keep it up 👍
            </Button>
            <Button variant="outline" size="sm">
              Let's schedule a 1-on-1 to discuss
            </Button>
            <Button variant="outline" size="sm">
              Have you tried the practice exercises?
            </Button>
            <Button variant="outline" size="sm">
              Check the resources I shared
            </Button>
            <Button variant="outline" size="sm">
              Congratulations on completing the module!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}