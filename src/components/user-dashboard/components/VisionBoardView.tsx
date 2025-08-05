import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VisionBoardData } from '@/types/vision-board';

interface VisionBoardViewProps {  
  selectedUserId: string;
  onUserSelection: (userId: string) => void;
}

export const VisionBoardView = ({
  selectedUserId,
  onUserSelection
}: VisionBoardViewProps) => {
  const [usersData, setUsersData] = useState<VisionBoardData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/vision-board');
        const result = await response.json();
        if (Array.isArray(result)) {
          setUsersData(result);
          if (result.length > 0 && !selectedUserId) {
            onUserSelection(result[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch vision board data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedUserId, onUserSelection]);

  const user = useMemo(() => usersData.find(u => u.id === selectedUserId) || usersData[0], [usersData, selectedUserId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
      </div>
    );
  }


  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No vision board data available</p>
        </div>
      </div>
    );
  }

  // Get vision board image with fallback
  const getVisionBoardImage = (goal: string) => {
    // Use coverUrl if available, otherwise use placeholder
    if (user.coverUrl) {
      return user.coverUrl;
    }
    console.log('no cover url', user);
    // Fallback to placeholder image
    return '/placeholder-vision-board.jpg';
  };
  // Use relatedSkills from API data
  const relatedSkills = user.relatedSkills || [];
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Select value={selectedUserId} onValueChange={onUserSelection}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select User" />
          </SelectTrigger>
          <SelectContent>
            {usersData.map(user => <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Vision Board</CardTitle>
              <CardDescription>
                Visual representation of {user.name}'s goals and aspirations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md mb-6">
                <div className="w-full p-2 bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {user.visionBoard.goals.map((goal, idx) => {
                      const imageUrl = getVisionBoardImage(goal);
                      return <div key={idx} className="relative rounded-md overflow-hidden shadow-sm border border-gray-100 aspect-square">
                          <img 
                            src={imageUrl} 
                            alt={`Goal: ${goal}`} 
                            className="w-full h-full object-cover"
                            
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                            <p className="text-white text-xs truncate">
                              {goal}
                            </p>
                          </div>
                        </div>;
                    })}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Goals</h3>
                  <ul className="space-y-2">
                    {user.visionBoard.goals.map((goal, idx) => <li key={idx} className="flex items-start gap-2">
                        <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span>{goal}</span>
                      </li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.visionBoard.focusAreas.map((area, idx) => <Badge key={idx} className="px-3 py-1">
                        {area}
                      </Badge>)}
                  </div>
                  <h3 className="text-lg font-medium mt-6 mb-2">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.visionBoard.keywords.map((keyword, idx) => <Badge key={idx} variant="outline" className="px-3 py-1">
                        {keyword}
                      </Badge>)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Skills Alignment</CardTitle>
              <CardDescription>
                How current skills align with vision board goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Related Skills</h3>
                <div className="space-y-3">
                  {relatedSkills.map((item, idx) => <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="flex-1">{item.skill}</span>
                      <Badge variant="outline" className="ml-auto">
                        {item.count} goal{item.count > 1 ? 's' : ''}
                      </Badge>
                    </div>)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Journal Entries</h3>
                <Tabs defaultValue="entries" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="entries">Recent</TabsTrigger>
                    <TabsTrigger value="add">Add New</TabsTrigger>
                  </TabsList>
                  <TabsContent value="entries" className="space-y-4 mt-2">
                    {user.visionBoard.journalEntries.map((entry, idx) => <Card key={idx}>
                        <CardContent className="p-4">
                          <div className="text-xs text-muted-foreground mb-1">
                            {entry.date}
                          </div>
                          <p className="text-sm">{entry.content}</p>
                        </CardContent>
                      </Card>)}
                  </TabsContent>
                  <TabsContent value="add">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground italic">
                          Journal entry feature coming soon...
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Program Alignment</CardTitle>
          <CardDescription>
            How {user.name}'s vision board aligns with available programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(user.programReadiness).map(([program, readiness]) => {
            // Calculate alignment score based on goals and program
            const programLower = program.toLowerCase();
            const alignmentScore = user.visionBoard.goals.reduce((score, goal) => {
              const goalLower = goal.toLowerCase();
              if ((programLower.includes('cyber') || programLower.includes('security')) && (goalLower.includes('security') || goalLower.includes('secure'))) {
                return score + 30;
              }
              if ((programLower.includes('ai') || programLower.includes('ml')) && (goalLower.includes('ai') || goalLower.includes('machine') || goalLower.includes('learning'))) {
                return score + 30;
              }
              if (programLower.includes('data') && (goalLower.includes('data') || goalLower.includes('analytics'))) {
                return score + 30;
              }
              if (programLower.includes('network') && (goalLower.includes('network') || goalLower.includes('infrastructure'))) {
                return score + 30;
              }
              if (programLower.includes('iot') && (goalLower.includes('iot') || goalLower.includes('device') || goalLower.includes('embedded'))) {
                return score + 30;
              }
              return score + 5; // Small alignment for any goal
            }, 20); // Base alignment score
            return <Card key={program} className={`overflow-hidden ${alignmentScore >= 70 ? 'border-green-200' : alignmentScore >= 50 ? 'border-yellow-200' : 'border-gray-200'}`}>
                    <div className={`h-2 ${alignmentScore >= 70 ? 'bg-green-500' : alignmentScore >= 50 ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">{program}</h3>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Vision Alignment</span>
                        <span>{alignmentScore}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full mb-3">
                        <div className={`h-full rounded-full ${alignmentScore >= 70 ? 'bg-green-500' : alignmentScore >= 50 ? 'bg-yellow-500' : 'bg-gray-300'}`} style={{
                    width: `${alignmentScore}%`
                  }}></div>
                      </div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Current Readiness</span>
                        <span>{readiness}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div className={`h-full rounded-full ${readiness >= 80 ? 'bg-green-500' : readiness >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{
                    width: `${readiness}%`
                  }}></div>
                      </div>
                    </CardContent>
                  </Card>;
          })}
          </div>
        </CardContent>
      </Card>
    </div>;
};
