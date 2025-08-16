"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { UserData } from '@/types/user-data';

interface SkillsChartsProps {
    user: UserData;
}

const COLORS = ['#FF00FF', '#FFC000', '#800080', '#0000FF', '#FF0000', '#008000'];

const generateSkillsPieData = (user: UserData) => {
    const originalSkills: any = {
        'Leadership': user.skills.vision,
        'Creativity': user.skills.grit,
        'Emotional Intelligence': user.skills.logic,
        'Technical': user.skills.algorithm,
        'Problem Solving': user.skills.problemSolving
    };

    const skillNames = Object.keys(originalSkills);
    const skillValues = Object.values(originalSkills);
    const total: any = skillValues.reduce((sum: any, val: any) => sum + val, 0);

    // Choose a random deduction amount between 5 and 15 (or max 25% of total)
    const minDeduct = 5;
    const maxDeduct = Math.min(15, total * 0.25);
    const targetDeduct = parseFloat(
        (Math.random() * (maxDeduct - minDeduct) + minDeduct).toFixed(2)
    );

    let remaining = targetDeduct;

    // Generate small random deduction from each skill so the total adds up to targetDeduct
    const deductions = skillNames.map((skill, index) => {
        const maxPossible = Math.min(originalSkills[skill] * 0.3, remaining);
        const isLast = index === skillNames.length - 1;
        const deduct = isLast ? remaining : parseFloat((Math.random() * maxPossible).toFixed(2));
        remaining -= deduct;
        return deduct;
    });

    // Build final pie data
    const skillsPieData = skillNames.map((skill, i) => ({
        name: skill,
        value: parseFloat((originalSkills[skill] - deductions[i]).toFixed(2))
    }));

    // Add Communications as the total deducted amount
    skillsPieData.push({
        name: 'Communication',
        value: parseFloat(targetDeduct.toFixed(2))
    });

    return skillsPieData;
}

export const SkillsCharts = ({ user }: SkillsChartsProps) => {
    // Prepare data for skills radar chart using original user skill names
    const skillsRadarData = [{
        subject: 'Vision',
        value: user.skills.vision
    }, {
        subject: 'Grit',
        value: user.skills.grit
    }, {
        subject: 'Logic',
        value: user.skills.logic
    }, {
        subject: 'Algorithm',
        value: user.skills.algorithm
    }, {
        subject: 'Problem Solving',
        value: user.skills.problemSolving
    }];

    // Prepare data for skills pie chart
    const skillsPieData = generateSkillsPieData(user);
    const pieDataForChart = skillsPieData.map(d =>
        d.name === 'Emotional Intelligence'
            ? { ...d, name: 'EI' }
            : d
    );

    const labelFormatter = (value: string) => {
        if (value === 'EI') return 'EI (Emotional Intelligence)';
        return value;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Core Skills</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                            cx="50%"
                            cy="50%"
                            outerRadius="80%"
                            data={skillsRadarData}
                        >
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#00098e' }} />
                            <PolarRadiusAxis
                                angle={30}
                                domain={[0, 100]}
                                tick={{ fill: '#00098e' }}
                            />
                            <Radar
                                name={"Skills"}
                                dataKey="value"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.6}
                            />
                            <Tooltip
                                contentStyle={{ color: '#00098e' }}
                                itemStyle={{ color: '#00098e' }}
                            />
                            <Legend wrapperStyle={{ color: '#00098e' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Skills Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieDataForChart}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent ? (percent * 100).toFixed(0) : 0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {skillsPieData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name) => [value, labelFormatter(name as string)]}/>
                            <Legend formatter={labelFormatter} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};
