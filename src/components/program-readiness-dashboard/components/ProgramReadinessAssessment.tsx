import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, XCircle, BookOpen, Brain, Lightbulb, Code, ChevronDown, ChevronUp } from 'lucide-react';

interface UserData {
  id: string
  name: string
  role: string
  level: number
  skills: {
    vision: number
    grit: number
    logic: number
    algorithm: number
    problemSolving: number
  }
  overallReadiness: number
  programReadiness: Record<string, number>
  bestProgram: {
    name: string
    readiness: number
  }
  skillDetails: Record<string, Record<string, number>>
  initials: string
}

interface ProgramReadinessAssessmentProps {
  user: UserData
  programRequirements: Record<string, Record<string, number>>
  programCoverUrls: Record<string, string | null>
}
type ReadinessMetric = {
  name: string;
  score: number;
  required: number;
  icon: React.ReactNode;
};
type ProgramReadiness = {
  program: string;
  overallReadiness: number;
  status: 'ready' | 'almost' | 'not-ready';
  metrics: ReadinessMetric[];
  recommendation: string;
  prerequisites: string[];
  image: string;
};

const StatusBadge = ({
  status
}: {
  status: string;
}) => {
  switch (status) {
    case 'ready':
      return <Badge className="bg-green-500 hover:bg-green-600">Ready</Badge>;
    case 'almost':
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Almost</Badge>;
    default:
      return <Badge className="bg-red-500 hover:bg-red-600">Not Ready</Badge>;
  }
};
const StatusIcon = ({
  status
}: {
  status: string;
}) => {
  switch (status) {
    case 'ready':
      return <CheckCircle2 className="h-6 w-6 text-green-500" />;
    case 'almost':
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    default:
      return <XCircle className="h-6 w-6 text-red-500" />;
  }
};
export const ProgramReadinessAssessment = ({ user, programRequirements, programCoverUrls }: ProgramReadinessAssessmentProps) => {
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  
  const toggleExpand = (program: string) => {
    setExpandedProgram(expandedProgram === program ? null : program);
  };

  // Transform user data into program readiness format
  const transformUserDataToProgramReadiness = (): ProgramReadiness[] => {
    const skillIcons = {
      vision: <Lightbulb className="h-4 w-4" />,
      grit: <Brain className="h-4 w-4" />,
      logic: <BookOpen className="h-4 w-4" />,
      algorithm: <Code className="h-4 w-4" />,
      problemSolving: <Code className="h-4 w-4" />
    };

    return Object.entries(user.programReadiness).map(([programName, readiness]) => {
      // Calculate metrics for each skill
      const metrics: ReadinessMetric[] = Object.entries(user.skills).map(([skillKey, skillValue]) => {
        const skillName = skillKey.charAt(0).toUpperCase() + skillKey.slice(1);
        const required = getRequiredScoreForProgram(programName, skillKey);
        
        return {
          name: skillName,
          score: skillValue,
          required,
          icon: skillIcons[skillKey as keyof typeof skillIcons]
        };
      });

      // Determine status based on readiness
      let status: 'ready' | 'almost' | 'not-ready';
      if (readiness >= 80) {
        status = 'ready';
      } else if (readiness >= 60) {
        status = 'almost';
      } else {
        status = 'not-ready';
      }

      // Generate recommendation based on readiness
      let recommendation = '';
      if (status === 'ready') {
        recommendation = 'Ready to enroll - you meet all requirements';
      } else if (status === 'almost') {
        recommendation = 'Almost ready - complete a few more prerequisites';
      } else {
        recommendation = 'Complete prerequisite programs before attempting';
      }

      // Generate prerequisites based on missing skills
      const prerequisites = metrics
        .filter(metric => metric.score < metric.required)
        .map(metric => `${metric.name} Training`);

      return {
        program: programName,
        overallReadiness: readiness,
        status,
        metrics,
        recommendation,
        prerequisites: prerequisites.length > 0 ? prerequisites : ['Basic Skills Training'],
        image: getProgramImage(programName)
      };
    });
  };

  // Helper function to get required scores for each program
  const getRequiredScoreForProgram = (programName: string, skillKey: string): number => {
    return programRequirements[programName]?.[skillKey] || 70;
  };

  // Helper function to get program images
  const getProgramImage = (programName: string): string => {
    return programCoverUrls[programName] || 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  };

  const programReadiness = transformUserDataToProgramReadiness();

  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Program Readiness</h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {programReadiness.map(program => <Card key={program.program} className={`border-l-4 overflow-hidden ${program.status === 'ready' ? 'border-l-green-500' : program.status === 'almost' ? 'border-l-yellow-500' : 'border-l-red-500'}`}>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/4 h-[120px] md:h-auto overflow-hidden">
                <img src={program.image} alt={program.program} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <CardHeader className="pb-1 pt-3 px-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={program.status} />
                      <CardTitle className="text-lg">
                        {program.program}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold">
                        {program.overallReadiness}%
                      </div>
                      <StatusBadge status={program.status} />
                      <Button variant="ghost" size="sm" className="p-0 h-8 w-8" onClick={() => toggleExpand(program.program)}>
                        {expandedProgram === program.program ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {expandedProgram === program.program && <CardContent className="pt-2 px-4 pb-4">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {program.metrics.map(metric => <div key={metric.name} className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <div className="flex items-center gap-1">
                                {metric.icon}
                                <span>{metric.name}</span>
                              </div>
                              <span className={`font-medium ${metric.score >= metric.required ? 'text-green-500' : 'text-red-500'}`}>
                                {metric.score}%
                              </span>
                            </div>
                            <Progress value={metric.score} className={`h-2 ${metric.score >= metric.required ? 'bg-muted [&>div]:bg-green-500' : 'bg-muted [&>div]:bg-red-500'}`} />
                          </div>)}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p>{program.recommendation}</p>
                        <div className="flex flex-wrap gap-1">
                          {program.prerequisites.map(prereq => <Badge key={prereq} variant="secondary" className="text-xs">
                              {prereq}
                            </Badge>)}
                        </div>
                      </div>
                    </div>
                  </CardContent>}
              </div>
            </div>
          </Card>)}
      </div>
    </div>;
};