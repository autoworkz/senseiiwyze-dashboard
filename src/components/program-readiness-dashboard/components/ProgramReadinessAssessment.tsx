import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, XCircle, BookOpen, Brain, Lightbulb, Code, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

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

  return (
  <>
    <Card>
    <CardHeader>
      <CardTitle>Program Readiness Assessment</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programReadiness.map((program) => (
        <Card key={program.program} className="flex flex-col">
          <CardHeader className="p-0">
            {program.image && (
              <div className="relative h-32 w-full overflow-hidden rounded-t-lg">
                <Image
                  src={program.image}
                  alt={program.program}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
            )}
          </CardHeader>
          <CardContent className="p-4 flex-grow flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold">{program.program}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Readiness: {program.overallReadiness}%
              </p>
              <Progress value={program.overallReadiness} className="h-2 mt-2" />
              {program.metrics.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium">Key Requirements:</h4>
                  <ul className="list-disc list-inside text-xs text-muted-foreground">
                    {program.metrics.map((metric) => (
                      <li key={metric.name}>
                        {metric.name}: {metric.required}% required
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </CardContent>
  </Card>
  </>
  );

};