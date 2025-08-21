import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ReferenceLine } from 'recharts';
import { skills } from '@/lib/skills-data';
import { UserData } from '@/types/user-data';

interface UserDataChartsProps {
    data: UserData[];
    loading: boolean;
    selectedUserId: string;
    onUserSelection: (userId: string) => void;
}

// Program thresholds (hardcoded for now, can be moved to database later)
const programThresholds: Record<string, number> = {
    'Cyber Security': 85,
    'Computer Networking': 75,
    'Data Analytics': 80,
    'AI/ML Fundamentals': 85,
    'IoT Tech Support': 70
};

// Map user database skills to predefined skill structure
const mapUserSkillsToPredefinedSkills = (userSkills: UserData['skills']) => {
    const skillMapping = {
        vision: 'creativity',
        grit: 'leadership',
        logic: 'problem_solving',
        algorithm: 'technical',
        problemSolving: 'problem_solving'
    };

    return skills.map((skill: any) => {
        // Find corresponding user skill from database
        const userSkillKey = Object.keys(skillMapping).find(key =>
            skillMapping[key as keyof typeof skillMapping] === skill.id
        );

        // Use user's actual data from database, fallback to predefined value
        const userProficiency = userSkillKey ? userSkills[userSkillKey as keyof typeof userSkills] : skill.proficiency;

        return {
            ...skill,
            proficiency: userProficiency
        };
    });
};

export const UserDataCharts = ({
    data,
    loading,
    selectedUserId,
    
}: UserDataChartsProps) => {
    const [chartType, setChartType] = useState('programs');
    // Set initial selected user when data loads
    const user = data.find(u => u.id === selectedUserId) || data[0];

    // Map user skills to predefined structure for pie chart only
    const mappedSkills = mapUserSkillsToPredefinedSkills(user.skills);
    // Prepare data for program readiness bar chart
    const programReadinessData = Object.entries(user.programReadiness || {}).map(([program, value]) => ({
        name: program,
        value,
        threshold: programThresholds[program as keyof typeof programThresholds] || 75,
        status: value >= (programThresholds[program as keyof typeof programThresholds] || 75) ? 'Pass' : 'Needs Improvement'
    }));

    // Prepare data for skill details
    const skillDetailsData = Object.entries(user.skillDetails || {}).flatMap(([skill, subskills]) => Object.entries(subskills || {}).map(([subskill, value]) => ({
        name: `${skill}: ${subskill}`,
        value,
        category: skill
    })));

    // Prepare data for comparison with other users
    const comparisonData = Object.keys(user.skills).map(skill => ({
        name: skill.charAt(0).toUpperCase() + skill.slice(1),
        [user.name]: user.skills[skill as keyof typeof user.skills],
        average: data.reduce((sum, u) => sum + u.skills[skill as keyof typeof u.skills], 0) / data.length
    }));

    // Colors for charts
    const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

    // Get color based on program readiness compared to threshold


    const getProgramReadinessColor = (program: string, value: number) => {
        const threshold = programThresholds[program as keyof typeof programThresholds] || 75;
        if (value >= threshold) return '#10b981'; // Green if meeting threshold
        if (value >= threshold - 10) return '#f59e0b'; // Yellow if close to threshold
        return '#ef4444'; // Red if far from threshold
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-64"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-[350px] bg-gray-200 rounded"></div>
                        <div className="h-[350px] bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">No user data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                {/* <Select value={selectedUserId} onValueChange={onUserSelection}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Select User" />
                    </SelectTrigger>
                    <SelectContent>
                        {data.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                                {user.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select> */}
                <Tabs value={chartType} className="w-full sm:w-auto">
                    <TabsList>
                        <TabsTrigger value="programs" onClick={() => setChartType('programs')}>
                            Programs
                        </TabsTrigger>
                        <TabsTrigger value="details" onClick={() => setChartType('details')}>
                            Details
                        </TabsTrigger>
                        <TabsTrigger value="comparison" onClick={() => setChartType('comparison')}>
                            Comparison
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chartType === 'programs' && (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Program Readiness</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={programReadinessData}
                                        layout="vertical"
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 100,
                                            bottom: 5
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" domain={[0, 100]} />
                                        <YAxis type="category" dataKey="name" width={90} />
                                        <Tooltip
                                            formatter={(value, name, props) => {
                                                if (name === 'value') {
                                                    return [`${value}% (Threshold: ${props.payload.threshold}%)`, 'Readiness'];
                                                }
                                                return [value, name];
                                            }}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="value"
                                            name="Readiness"
                                            fill="#3b82f6"
                                            background={{
                                                fill: '#eee'
                                            }}
                                            label={{
                                                position: 'right',
                                                formatter: (props: any) => {
                                                    const value = props.value;
                                                    const entry = props.payload;
                                                    const status = entry?.status || (value >= entry?.threshold ? 'Pass' : 'Needs Improvement');
                                                    return `${value}% (${status})`;
                                                }
                                            }}
                                        >
                                            {programReadinessData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={getProgramReadinessColor(entry.name, entry.value)} />
                                            ))}
                                        </Bar>
                                        {/* Add reference lines for thresholds */}
                                        {programReadinessData.map((entry, index) => (
                                            <ReferenceLine
                                                key={`ref-${index}`}
                                                y={entry.name}
                                                x={entry.threshold}
                                                stroke="#000"
                                                strokeDasharray="3 3"
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Program Readiness vs Thresholds
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={programReadinessData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            name="Current Readiness"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            dot={{
                                                r: 6,
                                                fill: "#3b82f6"
                                            }}
                                            activeDot={{
                                                r: 8
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="threshold"
                                            name="Required Threshold"
                                            stroke="#000"
                                            strokeDasharray="5 5"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </>
                )}

                {chartType === 'details' && (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Skill Details</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={skillDetailsData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" name="Proficiency" fill="#3b82f6">
                                            {skillDetailsData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[Object.keys(user.skillDetails || {}).indexOf(entry.category) % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Skill Categories</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={Object.entries(user.skillDetails || {}).map(([skill, subskills]) => ({
                                                name: skill,
                                                value: Object.values(subskills || {}).reduce((sum, val) => sum + val, 0) / Object.values(subskills || {}).length
                                            }))}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={true}
                                            label={({ name, percent }) => `${name} ${(percent ? (percent * 100).toFixed(0) : 0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {Object.keys(user.skillDetails || {}).map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </>
                )}

                {chartType === 'comparison' && (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">User vs. Average</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={comparisonData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey={user.name} fill="#3b82f6" />
                                        <Bar dataKey="average" fill="#ef4444" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
};
