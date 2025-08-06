"use client"
import React, { useState, useEffect } from 'react'
import { UserDataCharts } from '@/components/user-dashboard/components/UserDataCharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Download, Filter, RefreshCw } from 'lucide-react'
import { GamingDataView } from '@/components/user-dashboard/components/GamingDataView'
import { VisionBoardView } from '@/components/user-dashboard/components/VisionBoardView'
import { PersonalityExamView } from '@/components/user-dashboard/components/PersonalityExamView'
import { UserData } from '@/types/user-data'


export default function UserDashboardPage({ userId }: { userId: string }) {
    const [activeView, setActiveView] = useState<
        'charts' | 'gaming' | 'vision' | 'personality'
    >('charts')
    const [usersData, setUsersData] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedUserId, setSelectedUserId] = useState<string>(userId);
    
    const handleUserSelection = (userId: string) => {
        setSelectedUserId(userId)
    }
    // Fetch data once at page level
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/user-dashboard?userId=${selectedUserId}`)
                const result: { success: boolean; users: UserData[] } = await response.json()
                if (result.success) {
                    setUsersData(result.users)
                }
            } catch (error) {
                console.error('Failed to fetch user dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        if (selectedUserId) {
            fetchData()
        }
    }, [selectedUserId])
    
    const handleExportData = () => {
        const dataStr = JSON.stringify(usersData, null, 2)
        const dataBlob = new Blob([dataStr], {
            type: 'application/json',
        })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'user_data.json'
        link.click()
        URL.revokeObjectURL(url)
    }
    if (loading) {
        return (
            <div className="container p-6 space-y-4 mx-auto">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-64"></div>
                    <div className="h-4 bg-gray-200 rounded w-96"></div>
                    <div className="flex gap-2">
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container p-6 space-y-4 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        User Data Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Comprehensive view of user metrics and program readiness data
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                    >
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={handleExportData}
                    >
                        <Download className="h-4 w-4" />
                        Export Data
                    </Button>
                </div>
            </div>
            <Tabs defaultValue="charts" className="w-full">
                <TabsList className="mb-4 flex flex-wrap">
                    <TabsTrigger value="charts" onClick={() => setActiveView('charts')}>
                        Charts
                    </TabsTrigger>
                    <TabsTrigger value="gaming" onClick={() => setActiveView('gaming')}>
                        Gaming Data
                    </TabsTrigger>
                    <TabsTrigger value="vision" onClick={() => setActiveView('vision')}>
                        Vision Board
                    </TabsTrigger>
                    <TabsTrigger
                        value="personality"
                        onClick={() => setActiveView('personality')}
                    >
                        Personality
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="charts">
                    <UserDataCharts 
                        data={usersData} 
                        loading={loading} 
                        selectedUserId={selectedUserId}
                        onUserSelection={handleUserSelection}
                    />
                </TabsContent>
                <TabsContent value="gaming">
                    <GamingDataView 
                        selectedUserId={selectedUserId}
                        onUserSelection={handleUserSelection}
                    />
                </TabsContent>
                <TabsContent value="vision">
                    <VisionBoardView 
                        selectedUserId={selectedUserId}
                        onUserSelection={handleUserSelection}
                    />
                </TabsContent>
                <TabsContent value="personality">
                    <PersonalityExamView 
                        selectedUserId={selectedUserId}
                        onUserSelection={handleUserSelection}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
