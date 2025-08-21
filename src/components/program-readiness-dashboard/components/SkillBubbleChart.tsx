import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface Certification {
  id: string;
  name: string;
  icon: string;
}

interface Subskill {
  id: string;
  name: string;
  proficiency: number;
  required: Record<string, number>;
  certifications: Certification[];
}

interface Skill {
  id: string;
  name: string;
  category: string;
  color: string;
  proficiency: number;
  required: Record<string, number>;
  subskills: Subskill[];
  certifications: Certification[];
}

interface SkillCorrelation {
  source: string;
  target: string;
  strength: number;
}

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
  parentSkillsProficiency?: Record<string, number>
  initials: string
}

interface SkillBubbleChartProps {
  user: UserData
  skillRequirements?: Record<string, Record<string, number>>
  subskillRequirements?: Record<string, Record<string, number>>
}

export const SkillBubbleChart = ({ user, skillRequirements, subskillRequirements }: SkillBubbleChartProps) => {
  // Define colors for each skill type
  const skillColors: Record<string, string> = {
    'Technical': '#3b82f6',
    'Problem Solving': '#ef4444', 
    'Communication': '#10b981',
    'Emotional Intelligence': '#8b5cf6',
    'Creativity': '#f59e0b',
    'Leadership': '#ec4899'
  };

  // Build dynamic skills data from user data
  const buildSkillsData = (): Skill[] => {
    const dynamicSkills: Skill[] = [];

    // Create skills from user's parent skills and skill details
    if (user.parentSkillsProficiency && user.skillDetails) {
      Object.entries(user.parentSkillsProficiency).forEach(([skillName, proficiency]) => {
        const subskills = user.skillDetails[skillName] || {};
        const subskillArray: Subskill[] = Object.entries(subskills).map(([subskillName, subskillValue]) => ({
          id: subskillName.toLowerCase().replace(/\s+/g, '_'),
          name: subskillName,
          proficiency: subskillValue,
          required: subskillRequirements?.[subskillName] || {},
          certifications: []
        }));

        dynamicSkills.push({
          id: skillName.toLowerCase().replace(/\s+/g, '_'),
          name: skillName,
          category: 'Skills',
          color: skillColors[skillName] || '#6b7280',
          proficiency: proficiency,
          required: skillRequirements?.[skillName] || {},
          subskills: subskillArray,
          certifications: []
        });
      });
    }

    return dynamicSkills;
  };

  const skillsData = buildSkillsData();
  
  // Get available programs from skillRequirements
  const programs = skillRequirements ? 
    Array.from(new Set(Object.values(skillRequirements).flatMap(skill => Object.keys(skill)))) : 
    ['Cyber Security', 'Computer Networking', 'Data Analytics', 'AI/ML Fundamentals', 'IoT Tech Support'];
    
  // Create simple correlations between skills
  const skillCorrelations: SkillCorrelation[] = skillsData.length > 1 ? skillsData.slice(0, -1).map((skill, index) => ({
    source: skill.id,
    target: skillsData[index + 1]?.id || skillsData[0].id,
    strength: 0.7
  })) : [];
  
  console.log('user', user)
  console.log('skillRequirements', skillRequirements)
  console.log('subskillRequirements', subskillRequirements)
  
  const [selectedProgram, setSelectedProgram] = useState(programs[0] || 'Cyber Security');
  const [viewMode, setViewMode] = useState<'current' | 'required'>('current');
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0
  });

  // Update chart dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        setChartDimensions({
          width: chartRef.current.offsetWidth,
          height: chartRef.current.offsetHeight
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calculate positions for the bubbles
  const getBubblePositions = () => {
    const positions: Record<string, {
      x: number;
      y: number;
    }> = {};
    const centerX = chartDimensions.width / 2;
    const centerY = chartDimensions.height / 2;
    const radius = Math.min(centerX, centerY) * 0.6;
    skillsData.forEach((skill, index) => {
      const angle = index * (2 * Math.PI) / skillsData.length;
      positions[skill.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
    return positions;
  };

  const positions = getBubblePositions();

  // Calculate subskill positions around a main skill
  const getSubskillPositions = (skillId: string) => {
    const skill = skillsData.find(s => s.id === skillId);
    if (!skill) return {};
    const mainPosition = positions[skillId];
    const subPositions: Record<string, {
      x: number;
      y: number;
    }> = {};
    const subRadius = 100;
    skill.subskills.forEach((subskill, index) => {
      const angle = index * (2 * Math.PI) / skill.subskills.length;
      subPositions[subskill.id] = {
        x: mainPosition.x + subRadius * Math.cos(angle),
        y: mainPosition.y + subRadius * Math.sin(angle)
      };
    });
    return subPositions;
  };

  // Handle bubble click
  const handleBubbleClick = (skillId: string) => {
    setExpandedSkill(expandedSkill === skillId ? null : skillId);
  };

  // Calculate skill value based on view mode
  const getSkillValue = (skill: Skill) => {
    return viewMode === 'current' ? skill.proficiency : skill.required[selectedProgram] || 0;
  };

  // Calculate subskill value based on view mode
  const getSubskillValue = (subskill: Subskill) => {
    return viewMode === 'current' ? subskill.proficiency : subskill.required[selectedProgram] || 0;
  };

  // Calculate bubble size based on proficiency
  const getBubbleSize = (value: number) => {
    const minSize = 60;
    const maxSize = 120;
    return minSize + value / 100 * (maxSize - minSize);
  };

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setViewMode(value[0] === 0 ? 'current' : 'required');
  };

  return (
    <Card className="w-full h-[600px]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Skills Visualization</CardTitle>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {viewMode === 'current' ? 'Current Skills' : `${selectedProgram} Requirements`}
            </span>
            <div className="w-48">
              <Slider defaultValue={[0]} max={1} step={1} onValueChange={handleSliderChange} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative h-[calc(100%-5rem)]" ref={chartRef}>
        {/* Correlation lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {skillCorrelations.map(correlation => {
            // Only show correlations for non-expanded skills or for the expanded skill
            if (expandedSkill && correlation.source !== expandedSkill && correlation.target !== expandedSkill) {
              return null;
            }
            const sourcePos = positions[correlation.source];
            const targetPos = positions[correlation.target];
            if (!sourcePos || !targetPos) return null;
            return (
              <line 
                key={`${correlation.source}-${correlation.target}`} 
                x1={sourcePos.x} 
                y1={sourcePos.y} 
                x2={targetPos.x} 
                y2={targetPos.y} 
                stroke={`rgba(156, 163, 175, ${correlation.strength * 0.5})`} 
                strokeWidth={correlation.strength * 3} 
                strokeDasharray="5,5" 
              />
            );
          })}
        </svg>

        {/* Main skill bubbles */}
        {skillsData.map(skill => {
          const pos = positions[skill.id];
          const value = getSkillValue(skill);
          const size = getBubbleSize(value);
          const isExpanded = expandedSkill === skill.id;

          // Skip rendering if not the expanded skill and there is an expanded skill
          if (expandedSkill && !isExpanded) return null;

          return (
            <Fragment key={skill.id}>
              <div 
                className="absolute rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden" 
                style={{
                  left: pos.x - size / 2,
                  top: pos.y - size / 2,
                  width: size,
                  height: size,
                  backgroundColor: skill.color,
                  boxShadow: isExpanded ? '0 0 20px rgba(0,0,0,0.3)' : 'none',
                  zIndex: isExpanded ? 10 : 1,
                  transform: isExpanded ? 'scale(1.1)' : 'scale(1)'
                }} 
                onClick={() => handleBubbleClick(skill.id)}
              >
                <div className="text-center p-2 text-white">
                  <div className="font-bold text-sm">{skill.name}</div>
                  <div className="text-xs">{value}%</div>
                  {skill.subskills.length > 0 && (
                    <div className="text-xs mt-1 opacity-75">
                      {skill.subskills.length} subskill{skill.subskills.length > 1 ? 's' : ''}
                    </div>
                  )}
                  {skill.certifications.length > 0 && (
                    <div className="flex justify-center gap-1 mt-1">
                      {skill.certifications.map((cert: Certification) => (
                        <span key={cert.id} className="inline-block" title={cert.name}>
                          {cert.icon}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Subskill bubbles */}
              {isExpanded && skill.subskills.map((subskill: Subskill) => {
                const subPositions = getSubskillPositions(skill.id);
                const subPos = subPositions[subskill.id];
                const subValue = getSubskillValue(subskill);
                const subSize = getBubbleSize(subValue) * 0.6;
                if (!subPos) return null;

                return (
                  <div 
                    key={subskill.id} 
                    className="absolute rounded-full flex items-center justify-center transition-all duration-300 animate-in fade-in" 
                    style={{
                      left: subPos.x - subSize / 2,
                      top: subPos.y - subSize / 2,
                      width: subSize,
                      height: subSize,
                      backgroundColor: `${skill.color}99`,
                      zIndex: 5
                    }}
                  >
                    <div className="text-center p-1 text-white">
                      <div className="font-semibold text-xs">
                        {subskill.name}
                      </div>
                      <div className="text-xs">{subValue}%</div>
                      {subskill.certifications.length > 0 && (
                        <div className="flex justify-center gap-1">
                          {subskill.certifications.map((cert: Certification) => (
                            <span key={cert.id} className="inline-block text-xs" title={cert.name}>
                              {cert.icon}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </Fragment>
          );
        })}

        {/* Program selector */}
        {viewMode === 'required' && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-2">
            {programs.map(program => (
              <Badge 
                key={program} 
                variant={selectedProgram === program ? 'default' : 'outline'} 
                className="cursor-pointer" 
                onClick={() => setSelectedProgram(program)}
              >
                {program}
              </Badge>
            ))}
          </div>
        )}

        {/* Instructions */}
        {!expandedSkill && (
          <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
            Click on a bubble to explore subskills
          </div>
        )}

        {/* Back button when expanded */}
        {expandedSkill && (
          <button 
            className="absolute top-4 left-4 text-sm text-muted-foreground hover:text-foreground" 
            onClick={() => setExpandedSkill(null)}
          >
            ← Back to all skills
          </button>
        )}
      </CardContent>
    </Card>
  );
};