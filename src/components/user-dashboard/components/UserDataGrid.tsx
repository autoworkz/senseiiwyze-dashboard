import React, { useState, Fragment } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, XCircle, ChevronDown, ChevronUp, Search, GamepadIcon, BrainCircuit, Target } from 'lucide-react';
import { UserData, programThresholds } from './userData';
interface UserDataGridProps {
  data: UserData[];
}
export const UserDataGrid = ({
  data
}: UserDataGridProps) => {
  const [sortField, setSortField] = useState<keyof UserData>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const handleSort = (field: keyof UserData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const sortedData = [...data].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  const filteredData = sortedData.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.role.toLowerCase().includes(searchTerm.toLowerCase()) || user.level.toString().includes(searchTerm));
  const toggleExpandUser = (id: number) => {
    setExpandedUser(expandedUser === id ? null : id);
    setExpandedSection(null);
  };
  const toggleExpandSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  const StatusIcon = ({
    readiness,
    program
  }: {
    readiness: number;
    program?: string;
  }) => {
    const threshold = program ? programThresholds[program as keyof typeof programThresholds] || 75 : 75;
    if (readiness >= threshold) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (readiness >= threshold - 10) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };
  return <div className="space-y-4">
      <div className="flex justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {data.length} users
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('id')}>
                ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                Name{' '}
                {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('role')}>
                Role{' '}
                {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('level')}>
                Level{' '}
                {sortField === 'level' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead>Core Skills</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('overallReadiness')}>
                Readiness{' '}
                {sortField === 'overallReadiness' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map(user => <Fragment key={user.id}>
                <TableRow>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleExpandUser(user.id)}>
                      {expandedUser === user.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.level}</TableCell>
                  <TableCell>
                    <div className="space-y-1 w-full">
                      <div className="flex items-center justify-between text-xs">
                        <span>V</span>
                        <span>G</span>
                        <span>L</span>
                        <span>A</span>
                      </div>
                      <div className="flex gap-1">
                        <Progress value={user.skills.vision} className="h-2 flex-1" />
                        <Progress value={user.skills.grit} className="h-2 flex-1" />
                        <Progress value={user.skills.logic} className="h-2 flex-1" />
                        <Progress value={user.skills.algorithm} className="h-2 flex-1" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={user.overallReadiness} className="h-2 w-16" />
                      <span className="text-sm">{user.overallReadiness}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusIcon readiness={user.overallReadiness} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant={user.overallReadiness >= 80 ? 'default' : 'secondary'} size="sm">
                      {user.overallReadiness >= 80 ? 'View' : 'Coach'}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedUser === user.id && <TableRow>
                    <TableCell colSpan={9} className="bg-muted/30 p-0">
                      <div className="p-4 space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <Button variant={expandedSection === 'metrics' ? 'default' : 'outline'} size="sm" onClick={() => toggleExpandSection('metrics')}>
                            Program Metrics
                          </Button>
                          <Button variant={expandedSection === 'skills' ? 'default' : 'outline'} size="sm" onClick={() => toggleExpandSection('skills')}>
                            Skill Details
                          </Button>
                          <Button variant={expandedSection === 'gaming' ? 'default' : 'outline'} size="sm" onClick={() => toggleExpandSection('gaming')} className="flex items-center gap-1">
                            <GamepadIcon className="h-4 w-4" />
                            Gaming Data
                          </Button>
                          <Button variant={expandedSection === 'vision' ? 'default' : 'outline'} size="sm" onClick={() => toggleExpandSection('vision')} className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            Vision Board
                          </Button>
                          <Button variant={expandedSection === 'personality' ? 'default' : 'outline'} size="sm" onClick={() => toggleExpandSection('personality')} className="flex items-center gap-1">
                            <BrainCircuit className="h-4 w-4" />
                            Personality
                          </Button>
                        </div>
                        {expandedSection === 'metrics' && <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {Object.entries(user.programReadiness).map(([program, score]) => <div key={program} className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>{program}</span>
                                    <div className="flex items-center gap-1">
                                      <span className="font-medium">
                                        {score}%
                                      </span>
                                      <StatusIcon readiness={score} program={program} />
                                    </div>
                                  </div>
                                  <Progress value={score} className={`h-2 ${score >= (programThresholds[program as keyof typeof programThresholds] || 75) ? '[&>div]:bg-green-500' : score >= (programThresholds[program as keyof typeof programThresholds] || 75) - 10 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`} />
                                  <div className="text-xs text-muted-foreground">
                                    Threshold:{' '}
                                    {programThresholds[program as keyof typeof programThresholds] || 75}
                                    %
                                  </div>
                                </div>)}
                          </div>}
                        {expandedSection === 'skills' && <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(user.skillDetails).map(([skill, subskills]) => <div key={skill} className="space-y-2">
                                  <h4 className="text-sm font-medium">
                                    {skill}
                                  </h4>
                                  {Object.entries(subskills).map(([subskill, value]) => <div key={subskill} className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                          <span>{subskill}</span>
                                          <span>{value}%</span>
                                        </div>
                                        <Progress value={value} className="h-1" />
                                      </div>)}
                                </div>)}
                          </div>}
                        {expandedSection === 'gaming' && <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                              <div className="bg-muted p-3 rounded-md flex flex-col items-center">
                                <span className="text-xs text-muted-foreground">
                                  Levels Completed
                                </span>
                                <span className="text-xl font-bold">
                                  {user.gamingData.levelsCompleted}/
                                  {user.gamingData.totalLevels}
                                </span>
                              </div>
                              <div className="bg-muted p-3 rounded-md flex flex-col items-center">
                                <span className="text-xs text-muted-foreground">
                                  Avg Time Per Level
                                </span>
                                <span className="text-xl font-bold">
                                  {user.gamingData.avgTimePerLevel} min
                                </span>
                              </div>
                              <div className="bg-muted p-3 rounded-md flex flex-col items-center">
                                <span className="text-xs text-muted-foreground">
                                  Completion Rate
                                </span>
                                <span className="text-xl font-bold">
                                  {Math.round(user.gamingData.levelsCompleted / user.gamingData.totalLevels * 100)}
                                  %
                                </span>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">
                                Games Played
                              </h4>
                              <div className="bg-background rounded-md border overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Game</TableHead>
                                      <TableHead>Score</TableHead>
                                      <TableHead>Difficulty</TableHead>
                                      <TableHead>Time</TableHead>
                                      <TableHead>Status</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {user.gamingData.gamesPlayed.map((game, idx) => <TableRow key={idx}>
                                          <TableCell>{game.name}</TableCell>
                                          <TableCell>{game.score}</TableCell>
                                          <TableCell>
                                            <Badge variant={game.difficulty === 'easy' ? 'outline' : game.difficulty === 'medium' ? 'secondary' : 'default'}>
                                              {game.difficulty}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>
                                            {game.timeSpent ? `${game.timeSpent} min` : 'N/A'}
                                          </TableCell>
                                          <TableCell>
                                            {game.completed ? <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                                Completed
                                              </Badge> : <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                                                In Progress
                                              </Badge>}
                                          </TableCell>
                                        </TableRow>)}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </div>}
                        {expandedSection === 'vision' && <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">
                                  Goals
                                </h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {user.visionBoard.goals.map((goal, idx) => <li key={idx} className="text-sm">
                                      {goal}
                                    </li>)}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">
                                  Focus Areas
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                  {user.visionBoard.focusAreas.map((area, idx) => <Badge key={idx} variant="secondary">
                                        {area}
                                      </Badge>)}
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">
                                Journal Entries
                              </h4>
                              <div className="space-y-2">
                                {user.visionBoard.journalEntries.map((entry, idx) => <div key={idx} className="bg-muted p-3 rounded-md">
                                      <div className="text-xs text-muted-foreground mb-1">
                                        {entry.date}
                                      </div>
                                      <div className="text-sm">
                                        {entry.content}
                                      </div>
                                    </div>)}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">
                                Keywords
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {user.visionBoard.keywords.map((keyword, idx) => <Badge key={idx} variant="outline">
                                      {keyword}
                                    </Badge>)}
                              </div>
                            </div>
                          </div>}
                        {expandedSection === 'personality' && <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                              <div className="bg-muted p-3 rounded-md flex-1">
                                <h4 className="text-sm font-medium mb-2">
                                  Personality Type
                                </h4>
                                <div className="text-xl font-bold">
                                  {user.personalityExam.type}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">
                                  Traits
                                </h4>
                                <div className="space-y-2">
                                  {Object.entries(user.personalityExam.traits).map(([trait, value]) => <div key={trait} className="space-y-1">
                                      <div className="flex justify-between text-xs">
                                        <span>{trait.replace('_', ' ')}</span>
                                        <span>{value}%</span>
                                      </div>
                                      <Progress value={value} className="h-1" />
                                    </div>)}
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">
                                    Strengths
                                  </h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {user.personalityExam.strengths.map((strength, idx) => <li key={idx} className="text-sm">
                                          {strength}
                                        </li>)}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-2">
                                    Growth Areas
                                  </h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {user.personalityExam.growthAreas.map((area, idx) => <li key={idx} className="text-sm">
                                          {area}
                                        </li>)}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">
                                Recommended Roles
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {user.personalityExam.recommendedRoles.map((role, idx) => <Badge key={idx} variant="default">
                                      {role}
                                    </Badge>)}
                              </div>
                            </div>
                          </div>}
                      </div>
                    </TableCell>
                  </TableRow>}
              </Fragment>)}
          </TableBody>
        </Table>
      </div>
    </div>;
};