import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { GamingData, UserGamingData } from '@/types/gaming-data';
interface GamingDataViewProps {
  selectedUserId: string;
  onUserSelection: (userId: string) => void;
}

interface GamingDataApiResponse {
  success: boolean;
  users: UserGamingData[];
}


export const GamingDataView = ({
  selectedUserId,
  onUserSelection
}: GamingDataViewProps) => {
  const [usersData, setUsersData] = useState<UserGamingData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API or use prop
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/gaming-data?userId=${selectedUserId}`);
        const result: GamingDataApiResponse = await response.json();
        if (result.success) {
          setUsersData(result.users);
          if (result.users.length > 0 && !selectedUserId) {
            onUserSelection(result.users[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch gaming data:', error);
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }


  if (!user) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">No gaming data available</p>
        </div>
      </div>
    );
  }

  // Calculate completion percentage
  const completionPercentage = Math.round(user.gamingData.levelsCompleted / user.gamingData.totalLevels * 100);
  // Prepare data for game scores
  const gameScoresData = user.gamingData.gamesPlayed.map(game => ({
    name: game.name,
    score: game.score,
    maxScore: 1000,
    difficulty: game.difficulty,
    completed: game.completed
  }));
  // Prepare data for game completion time
  const gameTimeData = user.gamingData.gamesPlayed.filter(game => game.timeSpent).map(game => ({
    name: game.name,
    time: game.timeSpent,
    avgTime: user.gamingData.avgTimePerLevel
  }));
  // Prepare data for difficulty distribution
  const difficultyData = [{
    name: 'Easy',
    value: user.gamingData.gamesPlayed.filter(game => game.difficulty === 'easy').length
  }, {
    name: 'Medium',
    value: user.gamingData.gamesPlayed.filter(game => game.difficulty === 'medium').length
  }, {
    name: 'Hard',
    value: user.gamingData.gamesPlayed.filter(game => game.difficulty === 'hard').length
  }].filter(item => item.value > 0);
  // Colors for charts
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];
  // Get color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'easy') return '#10b981';
    if (difficulty === 'medium') return '#f59e0b';
    return '#ef4444';
  };
  // Compare user with other users
  const userComparisonData = usersData.map(u => ({
    name: u.name,
    levelsCompleted: u.gamingData.levelsCompleted,
    completionRate: Math.round(u.gamingData.levelsCompleted / u.gamingData.totalLevels * 100),
    avgTime: u.gamingData.avgTimePerLevel,
    isCurrentUser: u.id === user.id
  }));
  return <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      {/* <Select value={selectedUserId} onValueChange={onUserSelection}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Select User" />
        </SelectTrigger>
                  <SelectContent>
            {usersData.map(user => <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>)}
          </SelectContent>
      </Select> */}
      <div className="flex flex-wrap gap-4">
        <Card className="w-full sm:w-auto flex-1">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Levels Completed
              </p>
              <h3 className="text-2xl font-bold">
                {user.gamingData.levelsCompleted}/
                {user.gamingData.totalLevels}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full sm:w-auto flex-1">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Avg Time Per Level
              </p>
              <h3 className="text-2xl font-bold">
                {user.gamingData.avgTimePerLevel} min
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full sm:w-auto flex-1">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M12 22V8"></path>
                <path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>
                <path d="M8 5.2A10 10 0 0 1 22 12"></path>
                <path d="M8 5.2A10 10 0 0 0 2 12"></path>
                <path d="M12 2v6"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <h3 className="text-2xl font-bold">{completionPercentage}%</h3>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Game Performance Scores</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gameScoresData} margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 30
            }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis domain={[0, 1000]} />
              <Tooltip formatter={(value, name) => [value, name === 'score' ? 'Score' : 'Max Score']} labelFormatter={label => `Game: ${label}`} />
              <Legend />
              <Bar dataKey="score" name="Score" fill="#3b82f6">
                {gameScoresData.map((entry, index) => <Cell key={`cell-${index}`} fill={getDifficultyColor(entry.difficulty)} />)}
              </Bar>
              <Bar dataKey="maxScore" name="Max Score" fill="#e5e7eb" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Game Completion Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gameTimeData} margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 30
            }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis label={{
                value: 'Minutes',
                angle: -90,
                position: 'insideLeft'
              }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="time" name="Completion Time" fill="#3b82f6" />
              <Bar dataKey="avgTime" name="User Average" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Difficulty Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={difficultyData} cx="50%" cy="50%" labelLine={true} outerRadius={80} fill="#8884d8" dataKey="value" label={({
                name,
                percent
              }) => `${name}: ${(percent! * 100).toFixed(0)}%`}>
                {difficultyData.map((entry, index) => <Cell key={`cell-${index}`} fill={getDifficultyColor(entry.name.toLowerCase())} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User Comparison</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userComparisonData} margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 30
            }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completionRate" name="Completion Rate (%)" stroke="#3b82f6" strokeWidth={2} dot={props => {
                const {
                  cx,
                  cy,
                  payload
                } = props;
                return payload.isCurrentUser ? <circle cx={cx} cy={cy} r={6} fill="#3b82f6" stroke="white" strokeWidth={2} /> : <circle cx={cx} cy={cy} r={4} fill="#3b82f6" />;
              }} />
              <Line type="monotone" dataKey="avgTime" name="Avg Time (min)" stroke="#ef4444" strokeWidth={2} dot={props => {
                const {
                  cx,
                  cy,
                  payload
                } = props;
                return payload.isCurrentUser ? <circle cx={cx} cy={cy} r={6} fill="#ef4444" stroke="white" strokeWidth={2} /> : <circle cx={cx} cy={cy} r={4} fill="#ef4444" />;
              }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Games Played</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user.gamingData.gamesPlayed.map((game, idx) => <Card key={idx} className="overflow-hidden">
            <div className={`h-2 ${game.difficulty === 'easy' ? 'bg-green-500' : game.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{game.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Score: {game.score}/1000
                  </p>
                </div>
                <Badge variant={game.difficulty === 'easy' ? 'outline' : game.difficulty === 'medium' ? 'secondary' : 'default'}>
                  {game.difficulty}
                </Badge>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Score</span>
                  <span>{game.score}/1000</span>
                </div>
                <Progress value={game.score / 1000 * 100} className="h-2" />
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm">
                  {game.timeSpent ? `${game.timeSpent} min` : 'Time not recorded'}
                </div>
                <Badge variant={game.completed ? 'outline' : 'secondary'} className={game.completed ? 'bg-green-50 text-green-600 border-green-200' : 'bg-yellow-50 text-yellow-600 border-yellow-200'}>
                  {game.completed ? 'Completed' : 'In Progress'}
                </Badge>
              </div>
            </CardContent>
          </Card>)}
        </div>
      </CardContent>
    </Card>
  </div>;
};
