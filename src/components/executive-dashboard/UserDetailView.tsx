import React from 'react';
import { UserData } from './userData';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface UserDetailViewProps {
  user: UserData | null;
  onClose: () => void;
}
export const UserDetailView = ({
  user,
  onClose
}: UserDetailViewProps) => {
  if (!user) return null;
  return <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-background rounded-lg shadow-lg border">
        <div className="sticky top-0 bg-background z-10 flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{user.role}</Badge>
              <span className="text-sm text-muted-foreground">
                Level {user.level}
              </span>
              <span className="text-sm text-muted-foreground">
                ID: {user.id}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full border-8 border-primary flex items-center justify-center relative">
                  <span className="text-2xl font-bold">
                    {user.overallReadiness}%
                  </span>
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-medium">Readiness Status</h4>
                  <div className="flex items-center gap-2">
                    <Progress value={user.overallReadiness} className="h-2 flex-1" />
                    <span className="text-sm font-medium w-8">
                      {user.overallReadiness}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Core Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(user.skills).map(([skill, value]) => <div key={skill} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{skill}</span>
                      <span>{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>)}
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Program Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(user.programReadiness).map(([program, value]) => <div key={program} className="space-y-2 p-3 border rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">{program}</span>
                        <Badge variant={value >= 80 ? 'default' : value >= 65 ? 'secondary' : 'outline'}>
                          {value}%
                        </Badge>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Skill Details</CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              {Object.entries(user.skillDetails).map(([category, skills]) => <div key={category} className="mb-4">
                  <h4 className="font-medium mb-2">{category}</h4>
                  <div className="space-y-2">
                    {Object.entries(skills).map(([skill, value]) => <div key={skill} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{skill}</span>
                          <span>{value}%</span>
                        </div>
                        <Progress value={value} className="h-1.5" />
                      </div>)}
                  </div>
                </div>)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Personality</CardTitle>
              <CardDescription>{user.personalityExam.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Traits</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(user.personalityExam.traits).map(([trait, value]) => <div key={trait} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">
                              {trait.replace('_', ' ')}
                            </span>
                            <span>{value}%</span>
                          </div>
                          <Progress value={value} className="h-1.5" />
                        </div>)}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Strengths</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.personalityExam.strengths.map(strength => <Badge key={strength} variant="outline">
                        {strength}
                      </Badge>)}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Growth Areas</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.personalityExam.growthAreas.map(area => <Badge key={area} variant="outline">
                        {area}
                      </Badge>)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};