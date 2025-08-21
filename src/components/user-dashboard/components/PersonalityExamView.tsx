import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { getAssessmentLevelDescription, opennessLevels, extraversionLevels, agreeablenessLevels, conscientiousnessLevels, neuroticismLevels } from '@/utils/assessments';
import _ from "lodash";
interface PersonalityExamData {
  id: string;
  name: string;
  personalityExam: {
    type: string;
    traits: Record<string, number>;
    evaluations: any[],
    strengths: string[];
    growthAreas: string[];
    recommendedRoles: string[];
  };
  programReadiness: Record<string, number>;
}

interface PersonalityExamViewProps {
  selectedUserId: string;
  onUserSelection: (userId: string) => void;
}

export const PersonalityExamView = ({
  selectedUserId,
  onUserSelection
}: PersonalityExamViewProps) => {
  const [usersData, setUsersData] = useState<PersonalityExamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluationsData, setEvaluationsData] = useState<any>(null)
  const [evaluationsRadarData, setEvaluationsRadarData] = useState<any>(null)
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/personality-exam');
        const result = await response.json();
        if (Array.isArray(result)) {
          setUsersData(result);
          if (result.length > 0 && !selectedUserId) {
            onUserSelection(result[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch personality exam data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedUserId, onUserSelection]);

  const user = useMemo(() => usersData.find(u => u.id === selectedUserId) || usersData[0], [usersData, selectedUserId]);
  const generatePieChartData = (results: any) => {
    return [
      {
        name: "Openness",
        value: _.round(results?.openness * 100, 2),
        description: getAssessmentLevelDescription(
          _.round(results?.openness * 100, 2),
          opennessLevels
        ),
      },
      {
        name: "Conscientiousness",
        value: _.round(results.conscientiousness * 100, 2),
        description: getAssessmentLevelDescription(
          _.round(results?.conscientiousness * 100, 2),
          conscientiousnessLevels
        ),
      },
      {
        name: "Extraversion",
        value: _.round(results?.extraversion * 100, 2),
        description: getAssessmentLevelDescription(
          _.round(results?.extraversion * 100, 2),
          extraversionLevels
        ),
      },
      {
        name: "Agreeableness",
        value: _.round(results?.agreeableness * 100, 2),
        description: getAssessmentLevelDescription(
          _.round(results?.agreeableness * 100, 2),
          agreeablenessLevels
        ),
      },
      {
        name: "Neuroticism",
        value: _.round(results?.neuroticism * 100, 2),
        description: getAssessmentLevelDescription(
          _.round(results?.neuroticism * 100, 2),
          neuroticismLevels
        ),
      },
    ];
  };

  useEffect(() => {
    if (user?.personalityExam?.evaluations?.length) {
      const data = generatePieChartData(user.personalityExam.evaluations[0].results)
      setEvaluationsData(data);
      const radarData = data.map(({ name, value }) => ({
        subject:name,
        value,
      }));
      setEvaluationsRadarData(radarData)
    } else {
      setEvaluationsData(null);
      setEvaluationsRadarData(null)
    }
  }, [user?.personalityExam?.evaluations]);

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
          <p className="text-muted-foreground">No personality exam data available</p>
        </div>
      </div>
    );
  }

  // Prepare trait data for radar chart




  // Prepare data for program compatibility
  const programCompatibilityData = Object.entries(user.programReadiness).map(([program, readiness]) => {
    // Calculate compatibility based on personality traits and program
    let compatibility = 0;
    if (program === 'AI/ML Fundamentals') {
      compatibility = ((user.personalityExam.traits.Analytical || 0) * 0.3 + (user.personalityExam.traits.Logical || 0) * 0.3 + (user.personalityExam.traits.Innovative || 0) * 0.2 + (user.personalityExam.traits.Creative || 0) * 0.2) / 1;
    } else if (program === 'Cyber Security') {
      compatibility = ((user.personalityExam.traits.Analytical || 0) * 0.3 + (user.personalityExam.traits.Detail_oriented || 0) * 0.3 + (user.personalityExam.traits.Protective || 0) * 0.2 + (user.personalityExam.traits.Logical || 0) * 0.2) / 1;
    } else if (program === 'Data Analytics') {
      compatibility = ((user.personalityExam.traits.Analytical || 0) * 0.4 + (user.personalityExam.traits.Logical || 0) * 0.3 + (user.personalityExam.traits.Detail_oriented || 0) * 0.3) / 1;
    } else if (program === 'Computer Networking') {
      compatibility = ((user.personalityExam.traits.Practical || 0) * 0.3 + (user.personalityExam.traits.Logical || 0) * 0.3 + (user.personalityExam.traits.Detail_oriented || 0) * 0.2 + (user.personalityExam.traits.Reliable || 0) * 0.2) / 1;
    } else if (program === 'IoT Tech Support') {
      compatibility = ((user.personalityExam.traits.Practical || 0) * 0.3 + (user.personalityExam.traits.Adaptable || 0) * 0.3 + (user.personalityExam.traits.Reliable || 0) * 0.2 + (user.personalityExam.traits.Detail_oriented || 0) * 0.2) / 1;
    }
    // Ensure compatibility is between 0-100
    compatibility = Math.min(100, Math.max(0, compatibility));
    return {
      name: program,
      compatibility: Math.round(compatibility),
      readiness
    };
  });
 

  //   if(user.personalityExam.evaluations.length){
  //     setEvaluationsData(generatePieChartData(user.personalityExam.evaluations))
  // }
  // else setEvaluationsData([])
  const hasPersonalityData = user.personalityExam.evaluations.length > 0;
    const traitRadarData = Object.entries(user.personalityExam.traits).map(([trait, value]) => ({
    subject: trait.replace('_', ' '),
    value
  }));
  // Colors for charts
  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];
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
      <div className="bg-muted px-4 py-2 rounded-md">
        <span className="font-medium">{user.personalityExam.type}</span>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Personality Traits</CardTitle>
          <CardDescription>
            Key personality characteristics based on assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          {hasPersonalityData ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={evaluationsRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Trait Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No personality assessment data available</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Personality Distribution</CardTitle>
          <CardDescription>
            Balance of personality characteristics
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          {evaluationsData?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={evaluationsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${(value || 0 * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {evaluationsData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No personality distribution data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Program Compatibility</CardTitle>
          <CardDescription>
            How personality traits align with program requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {programCompatibilityData.map((program, idx) => <Card key={idx} className="overflow-hidden">
              <div className={`h-2 ${program.compatibility >= 80 ? 'bg-green-500' : program.compatibility >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">{program.name}</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Personality Fit</span>
                      <span>{program.compatibility}%</span>
                    </div>
                    <Progress value={program.compatibility} className={`h-2 ${program.compatibility >= 80 ? '[&>div]:bg-green-500' : program.compatibility >= 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Current Readiness</span>
                      <span>{program.readiness}%</span>
                    </div>
                    <Progress value={program.readiness} className={`h-2 ${program.name === 'AI/ML Fundamentals' && program.readiness >= 85 ? '[&>div]:bg-green-500' : program.name === 'IoT Tech Support' && program.readiness >= 60 ? '[&>div]:bg-green-500' : program.name === 'Data Analytics' && program.readiness >= 75 ? '[&>div]:bg-green-500' : program.name === 'Computer Networking' && program.readiness >= 75 ? '[&>div]:bg-green-500' : program.name === 'Cyber Security' && program.readiness >= 80 ? '[&>div]:bg-green-500' : program.readiness >= program.readiness - 10 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>)}
          </div>
        </CardContent>
      </Card>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {user.personalityExam.strengths.map((strength, idx) => <li key={idx} className="flex items-start gap-2">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span>{strength}</span>
            </li>)}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Growth Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {user.personalityExam.growthAreas.map((area, idx) => <li key={idx} className="flex items-start gap-2">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m15 9-6 6"></path>
                  <path d="m9 9 6 6"></path>
                </svg>
              </div>
              <span>{area}</span>
            </li>)}
          </ul>
        </CardContent>
      </Card>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Recommended Roles</CardTitle>
        <CardDescription>
          Career paths that align with personality type
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {user.personalityExam.recommendedRoles.map((role, idx) => <Badge key={idx} className="px-3 py-1.5 text-sm">
            {role}
          </Badge>)}
        </div>
      </CardContent>
    </Card>
  </div>;
};