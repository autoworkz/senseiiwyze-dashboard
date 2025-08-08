import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { skills, skillCorrelations, programs } from './skillsData';
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

interface SkillBubbleChartProps {
  user: UserData
}

export const SkillBubbleChart = ({ user }: SkillBubbleChartProps) => {
  // Map user database skills to predefined skill structure
  const overlayUserDataOnPredefinedSkills = () => {
    const skillMapping = {
      vision: 'creativity',
      grit: 'leadership', 
      logic: 'problem_solving',
      algorithm: 'technical',
      problemSolving: 'problem_solving'
    };

    return skills.map(skill => {
      // Find corresponding user skill from database
      const userSkillKey = Object.keys(skillMapping).find(key => 
        skillMapping[key as keyof typeof skillMapping] === skill.id
      );
      
      // Use user's actual data from database, fallback to predefined value
      const userProficiency = userSkillKey ? user.skills[userSkillKey as keyof typeof user.skills] : skill.proficiency;
      
      // Map subskills from user data
      const mappedSubskills = skill.subskills.map(subskill => {
        // Find corresponding subskill in user's skillDetails
        const userSkillDetails = user.skillDetails[skill.name] || {};
        const subskillValue = userSkillDetails[subskill.name] || subskill.proficiency;
        
        return {
          ...subskill,
          proficiency: subskillValue
        };
      });

      return {
        ...skill,
        proficiency: userProficiency,
        subskills: mappedSubskills
      };
    });
  };

  const skillsData = overlayUserDataOnPredefinedSkills();
  console.log(skillsData)
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
  const getSkillValue = (skill: any) => {
    return viewMode === 'current' ? skill.proficiency : skill.required[selectedProgram] || 0;
  };

  // Calculate subskill value based on view mode
  const getSubskillValue = (subskill: any) => {
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
                      {skill.certifications.map(cert => (
                        <span key={cert.id} className="inline-block" title={cert.name}>
                          {cert.icon}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Subskill bubbles */}
              {isExpanded && skill.subskills.map(subskill => {
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
                          {subskill.certifications.map(cert => (
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