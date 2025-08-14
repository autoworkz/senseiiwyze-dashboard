"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, XCircle, ChevronsLeft, ChevronsRight, Users, Search } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserDetailView } from './UserDetailView';

interface UserData {
  id: number;
  name: string;
  role: string;
  level: number;
  skills: {
    vision: number;
    grit: number;
    logic: number;
    algorithm: number;
    problemSolving: number;
  };
  overallReadiness: number;
  programReadiness: {
    [program: string]: number;
  };
  skillDetails: {
    [category: string]: {
      [subskill: string]: number;
    };
  };
  gamingData: {
    levelsCompleted: number;
    totalLevels: number;
    avgTimePerLevel: number;
    gamesPlayed: Array<{
      name: string;
      score: number;
      difficulty: 'easy' | 'medium' | 'hard';
      completed: boolean;
      timeSpent?: number;
    }>;
  };
  visionBoard: {
    goals: string[];
    focusAreas: string[];
    journalEntries: { date: string; content: string }[];
    keywords: string[];
  };
  personalityExam: {
    type: string;
    traits: {
      [trait: string]: number;
    };
    strengths: string[];
    growthAreas: string[];
    recommendedRoles: string[];
  };
}

interface UserTableProps {
  activeTab?: string;
  data: {
    userData: UserData[];
    success: boolean;
  };
}

export const UserTable = ({
  activeTab = 'all',
  data
}: UserTableProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userData = data?.userData || [];
  const [sortField, setSortField] = useState<keyof UserData>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [readinessFilter, setReadinessFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const router = useRouter();

  // Handle data loading errors
  useEffect(() => {
    if (!data?.success) {
      setError('Failed to load user data');
    }
  }, [data]);

  // Reset to page 1 when items per page changes to avoid empty pages
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchQuery, roleFilter, readinessFilter, activeTab]);

  const handleSort = (field: keyof UserData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Find the best program for each user
  const getBestProgram = (user: UserData) => {
    const programs = Object.keys(user.programReadiness);
    let bestProgram = {
      name: '',
      readiness: 0,
      meetsThreshold: false
    };
    
    for (const program of programs) {
      const readiness = user.programReadiness[program];
      const threshold = 70; // Default threshold
      
      // If this is the first program or it has higher readiness than current best
      if (!bestProgram.name || readiness > bestProgram.readiness) {
        bestProgram = {
          name: program,
          readiness,
          meetsThreshold: readiness >= threshold
        };
      }
      // If it meets threshold and current best doesn't, or both meet threshold but this one has higher readiness
      else if (readiness >= threshold && !bestProgram.meetsThreshold || readiness >= threshold && bestProgram.meetsThreshold && readiness > bestProgram.readiness) {
        bestProgram = {
          name: program,
          readiness,
          meetsThreshold: true
        };
      }
    }
    return bestProgram;
  };

  // Filter data based on search query, filters, and active tab
  const filteredData = userData.filter(user => {
    // Tab-based filtering
    if (activeTab === 'ready' && user.overallReadiness < 75) {
      return false;
    }
    if (activeTab === 'coaching' && user.overallReadiness >= 75) {
      return false;
    }
    
    // Search filter
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.id.toString().includes(searchQuery);
    
    // Role filter
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase().includes(roleFilter.toLowerCase());
    
    // Readiness filter
    let matchesReadiness = true;
    if (readinessFilter === 'high') {
      matchesReadiness = user.overallReadiness >= 80;
    } else if (readinessFilter === 'medium') {
      matchesReadiness = user.overallReadiness >= 65 && user.overallReadiness < 80;
    } else if (readinessFilter === 'low') {
      matchesReadiness = user.overallReadiness < 65;
    }
    
    return matchesSearch && matchesRole && matchesReadiness;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
  };

  const toggleUserSelection = (userId: number, isMultiSelect: boolean = false) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return isMultiSelect ? [...prev, userId] : [userId];
      }
    });
  };

  const handleRowClick = (user: UserData) => {
    setSelectedUser(user);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => goToPage(i)} isActive={i === currentPage}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      pageNumbers.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => goToPage(1)} isActive={1 === currentPage}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Calculate start and end of the middle section
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning or end
      if (currentPage <= 3) {
        endPage = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(totalPages - 3, 2);
      }
      
      // Add ellipsis if needed at the beginning
      if (startPage > 2) {
        pageNumbers.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => goToPage(i)} isActive={i === currentPage}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // Add ellipsis if needed at the end
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Always show last page
      pageNumbers.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => goToPage(totalPages)} isActive={totalPages === currentPage}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">Error Loading Users</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-8" 
            value={searchQuery} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={readinessFilter} onValueChange={setReadinessFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Readiness level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="high">High (80%+)</SelectItem>
              <SelectItem value="medium">Medium (65-80%)</SelectItem>
              <SelectItem value="low">Low (&lt;65%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Individual Program Readiness</CardTitle>
            {activeTab === 'ready' && (
              <Badge variant="outline" className="ml-2">
                Showing users with 75%+ readiness
              </Badge>
            )}
            {activeTab === 'coaching' && (
              <Badge variant="outline" className="ml-2">
                Showing users below 75% readiness
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300" 
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedUserIds(currentItems.map(user => user.id));
                        } else {
                          setSelectedUserIds([]);
                        }
                      }} 
                      checked={currentItems.length > 0 && currentItems.every(user => selectedUserIds.includes(user.id))} 
                    />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('id')}>
                    ID{' '}
                    {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                    Name{' '}
                    {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Best Program Match</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('overallReadiness')}>
                    Overall Readiness{' '}
                    {sortField === 'overallReadiness' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? currentItems.map(user => {
                  const bestProgram = getBestProgram(user);
                  return (
                    <TableRow 
                      key={user.id} 
                      className={`hover:bg-muted ${selectedUserIds.includes(user.id) ? 'bg-accent/40' : ''}`}
                    >
                      <TableCell>
                                                 <input 
                           type="checkbox" 
                           className="h-4 w-4 rounded border-gray-300" 
                           checked={selectedUserIds.includes(user.id)} 
                           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                             e.stopPropagation();
                             toggleUserSelection(user.id, false);
                           }} 
                           onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                             e.stopPropagation();
                             toggleUserSelection(user.id, e.shiftKey);
                           }} 
                         />
                      </TableCell>
                      <TableCell>{user.id}</TableCell>
                      <TableCell className="font-medium cursor-pointer" onClick={() => handleRowClick(user)}>
                        <div>{user.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={bestProgram.meetsThreshold ? 'default' : 'secondary'} className="text-xs">
                              {bestProgram.name || 'No Program'}
                            </Badge>
                            <span className="text-sm font-medium">
                              {bestProgram.readiness}%
                            </span>
                          </div>
                          <Progress value={bestProgram.readiness} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={user.overallReadiness} className="h-2 w-16" />
                          <span className="text-sm">
                            {user.overallReadiness}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/user-dashboard/${user.id}/program-readiness`} passHref>
                          <Button 
                            variant={user.overallReadiness >= 80 ? 'default' : 'secondary'} 
                            size="sm" 
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              router.push(`/user-dashboard/${user.id}/program-readiness`);
                            }}
                          >
                            Individual Program Readiness Snapshot
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                }) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Showing {sortedData.length > 0 ? indexOfFirstItem + 1 : 0}-
                  {Math.min(indexOfLastItem, sortedData.length)} of{' '}
                  {sortedData.length}
                </span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <label htmlFor="itemsPerPage" className="text-sm text-muted-foreground">
                  Show:
                </label>
                <select 
                  id="itemsPerPage" 
                  value={itemsPerPage} 
                  onChange={handleItemsPerPageChange} 
                  className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">All</option>
                </select>
              </div>
            </div>
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => goToPage(1)} 
                      disabled={currentPage === 1} 
                      className="h-8 w-8"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                      <span className="sr-only">First page</span>
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => goToPage(currentPage - 1)} 
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} 
                    />
                  </PaginationItem>
                  {renderPageNumbers()}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => goToPage(currentPage + 1)} 
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} 
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => goToPage(totalPages)} 
                      disabled={currentPage === totalPages} 
                      className="h-8 w-8"
                    >
                      <ChevronsRight className="h-4 w-4" />
                      <span className="sr-only">Last page</span>
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      {selectedUser && <UserDetailView user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
};
