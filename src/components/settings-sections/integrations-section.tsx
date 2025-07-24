"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plug, Github, Slack, Calendar, Mail, Key, Webhook, Copy, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

const integrations = [
  {
    id: "github",
    name: "GitHub",
    description: "Connect your GitHub repositories",
    icon: Github,
    connected: true,
    status: "Active",
    category: "development",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get notifications in Slack",
    icon: Slack,
    connected: false,
    status: "Available",
    category: "communication",
  },
  {
    id: "calendar",
    name: "Google Calendar",
    description: "Sync with your calendar",
    icon: Calendar,
    connected: true,
    status: "Active",
    category: "productivity",
  },
  {
    id: "email",
    name: "Email Marketing",
    description: "Connect your email platform",
    icon: Mail,
    connected: false,
    status: "Available",
    category: "marketing",
  },
]

const apiKeys = [
  {
    id: 1,
    name: "Production API Key",
    key: "sk_live_51H7...",
    created: "2024-01-15",
    lastUsed: "2 hours ago",
    permissions: ["read", "write"],
  },
  {
    id: 2,
    name: "Development API Key",
    key: "sk_test_51H7...",
    created: "2024-01-10",
    lastUsed: "1 day ago",
    permissions: ["read"],
  },
]

const webhooks = [
  {
    id: 1,
    name: "Payment Notifications",
    url: "https://api.example.com/webhooks/payments",
    events: ["payment.succeeded", "payment.failed"],
    status: "active",
  },
  {
    id: 2,
    name: "User Events",
    url: "https://api.example.com/webhooks/users",
    events: ["user.created", "user.updated"],
    status: "inactive",
  },
]

export function IntegrationsSection() {
  const [showApiKey, setShowApiKey] = useState<{ [key: number]: boolean }>({})

  const toggleApiKeyVisibility = (id: number) => {
    setShowApiKey((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Integrations & API</h1>
        <p className="text-muted-foreground">Connect your favorite tools, manage API access, and configure webhooks</p>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Plug className="h-4 w-4" />
                Available Integrations
              </CardTitle>
              <CardDescription>Connect and manage your third-party integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {integrations.map((integration) => {
                  const Icon = integration.icon
                  return (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{integration.name}</div>
                          <div className="text-sm text-muted-foreground">{integration.description}</div>
                          <div className="text-xs text-muted-foreground capitalize mt-1">{integration.category}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Badge variant={integration.connected ? "secondary" : "outline"} className="text-xs">
                          {integration.status}
                        </Badge>
                        {integration.connected ? (
                          <div className="flex items-center gap-2">
                            <Switch checked={true} />
                            <Button variant="outline" size="sm">
                              Configure
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm">Connect</Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create API Key */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Key className="h-4 w-4" />
                  Create New API Key
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key-name" className="text-sm">
                    Key Name
                  </Label>
                  <Input id="api-key-name" placeholder="e.g., Production API Key" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Permissions</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="read-permission" defaultChecked />
                      <Label htmlFor="read-permission" className="text-sm">
                        Read access
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="write-permission" />
                      <Label htmlFor="write-permission" className="text-sm">
                        Write access
                      </Label>
                    </div>
                  </div>
                </div>
                <Button className="w-full">Generate API Key</Button>
              </CardContent>
            </Card>

            {/* API Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">API Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-foreground">1,247</div>
                  <div className="text-xs text-muted-foreground">Requests this month</div>
                  <div className="text-xs text-muted-foreground">5,000 limit</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-foreground">2</div>
                  <div className="text-xs text-muted-foreground">Active API Keys</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-foreground">99.9%</div>
                  <div className="text-xs text-muted-foreground">API Uptime</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Existing API Keys */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your API Keys</CardTitle>
              <CardDescription>Manage your existing API keys</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm font-semibold text-foreground">{apiKey.name}</h3>
                          <div className="flex gap-1">
                            {apiKey.permissions.map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {showApiKey[apiKey.id] ? apiKey.key : "sk_****_****"}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleApiKeyVisibility(apiKey.id)}
                            className="h-6 w-6 p-0"
                          >
                            {showApiKey[apiKey.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Webhook */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Webhook className="h-4 w-4" />
                  Create New Webhook
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-name" className="text-sm">
                    Webhook Name
                  </Label>
                  <Input id="webhook-name" placeholder="e.g., Payment Notifications" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook-url" className="text-sm">
                    Endpoint URL
                  </Label>
                  <Input id="webhook-url" placeholder="https://api.example.com/webhooks" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Events</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="payment-events" />
                      <Label htmlFor="payment-events" className="text-sm">
                        Payment events
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="user-events" />
                      <Label htmlFor="user-events" className="text-sm">
                        User events
                      </Label>
                    </div>
                  </div>
                </div>
                <Button className="w-full">Create Webhook</Button>
              </CardContent>
            </Card>

            {/* Webhook Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Webhook Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-foreground">156</div>
                  <div className="text-xs text-muted-foreground">Webhooks sent today</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-foreground">98.5%</div>
                  <div className="text-xs text-muted-foreground">Success rate</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-foreground">2</div>
                  <div className="text-xs text-muted-foreground">Active webhooks</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Existing Webhooks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Webhooks</CardTitle>
              <CardDescription>Manage your existing webhooks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm font-semibold text-foreground">{webhook.name}</h3>
                          <Badge variant={webhook.status === "active" ? "secondary" : "outline"} className="text-xs">
                            {webhook.status}
                          </Badge>
                        </div>

                        <div className="text-xs text-muted-foreground mb-2 font-mono bg-muted px-2 py-1 rounded">
                          {webhook.url}
                        </div>

                        <div className="flex gap-1 flex-wrap">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Test
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
