import React, { useEffect, useState } from 'react';
import { X, Plus, Search, Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tag, UserTag, tagData, userTagAssignments, getUserTags } from './tagData';
import { userData, UserData } from './userData';
import { TagCreationForm } from './TagCreationForm';
interface TagManagementModalProps {
  onClose: () => void;
  selectedUserIds: number[];
}
export const TagManagementModal = ({
  onClose,
  selectedUserIds
}: TagManagementModalProps) => {
  const [availableTags, setAvailableTags] = useState<Tag[]>(tagData);
  const [userTags, setUserTags] = useState<UserTag[]>(userTagAssignments);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserData[]>(userData.filter(user => selectedUserIds.includes(user.id)));
  const [showTagCreationForm, setShowTagCreationForm] = useState(false);
  const [activeTab, setActiveTab] = useState('assign');
  const [selectedTagsForBatch, setSelectedTagsForBatch] = useState<string[]>([]);
  const [draggedTagId, setDraggedTagId] = useState<string | null>(null);
  // Filter tags based on search query
  const filteredTags = availableTags.filter(tag => tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase()) || tag.category.toLowerCase().includes(tagSearchQuery.toLowerCase()));
  // Group tags by category
  const tagsByCategory = filteredTags.reduce<Record<string, Tag[]>>((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {});
  // Filter users based on search query
  const filteredUsers = userData.filter(user => (user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || user.role.toLowerCase().includes(userSearchQuery.toLowerCase())) && (selectedUserIds.length === 0 || selectedUserIds.includes(user.id)));
  const handleCreateTag = (newTag: Omit<Tag, 'id'>) => {
    const newTagWithId: Tag = {
      ...newTag,
      id: `tag-${availableTags.length + 1}`
    };
    setAvailableTags([...availableTags, newTagWithId]);
    setShowTagCreationForm(false);
  };
  const handleTagDragStart = (e: React.DragEvent, tagId: string) => {
    e.dataTransfer.setData('tagId', tagId);
    setDraggedTagId(tagId);
  };
  const handleTagDragEnd = () => {
    setDraggedTagId(null);
  };
  const handleUserDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleUserDrop = (e: React.DragEvent, userId: number) => {
    e.preventDefault();
    const tagId = e.dataTransfer.getData('tagId');
    // Check if this assignment already exists
    const existingAssignment = userTags.find(ut => ut.userId === userId && ut.tagId === tagId);
    if (!existingAssignment && tagId) {
      setUserTags([...userTags, {
        userId,
        tagId
      }]);
    }
  };
  const toggleTagSelection = (tagId: string) => {
    setSelectedTagsForBatch(prev => prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]);
  };
  const applyTagsToSelectedUsers = () => {
    if (selectedTagsForBatch.length === 0 || selectedUsers.length === 0) return;
    const newAssignments: UserTag[] = [];
    selectedUsers.forEach(user => {
      selectedTagsForBatch.forEach(tagId => {
        // Check if this assignment already exists
        const existingAssignment = userTags.find(ut => ut.userId === user.id && ut.tagId === tagId);
        if (!existingAssignment) {
          newAssignments.push({
            userId: user.id,
            tagId
          });
        }
      });
    });
    setUserTags([...userTags, ...newAssignments]);
    setSelectedTagsForBatch([]);
  };
  const removeTagFromUser = (userId: number, tagId: string) => {
    setUserTags(userTags.filter(ut => !(ut.userId === userId && ut.tagId === tagId)));
  };
  const getUserTagsById = (userId: number): Tag[] => {
    const tagIds = userTags.filter(ut => ut.userId === userId).map(ut => ut.tagId);
    return availableTags.filter(tag => tagIds.includes(tag.id));
  };
  return <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-background rounded-lg shadow-lg border flex flex-col">
        <div className="sticky top-0 bg-background z-10 flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Tag Management</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 pt-2">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="assign">Assign Tags</TabsTrigger>
              <TabsTrigger value="create">Create Tags</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="assign" className="flex-1 flex flex-col overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 flex-1 overflow-hidden">
              {/* Left Panel - Available Tags */}
              <Card className="flex flex-col overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Available Tags</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('create')}>
                      <Plus className="h-4 w-4 mr-1" /> New Tag
                    </Button>
                  </div>
                  <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search tags..." className="pl-8" value={tagSearchQuery} onChange={e => setTagSearchQuery(e.target.value)} />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto pb-6">
                  {selectedTagsForBatch.length > 0 && <div className="mb-4 p-3 bg-muted rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Selected Tags
                        </span>
                        <Button variant="default" size="sm" onClick={applyTagsToSelectedUsers}>
                          Apply to Selected Users
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedTagsForBatch.map(tagId => {
                      const tag = availableTags.find(t => t.id === tagId);
                      if (!tag) return null;
                      return <Badge key={tag.id} style={{
                        backgroundColor: tag.color,
                        color: '#fff'
                      }} className="cursor-pointer" onClick={() => toggleTagSelection(tag.id)}>
                              {tag.name}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>;
                    })}
                      </div>
                    </div>}
                  {Object.entries(tagsByCategory).length > 0 ? Object.entries(tagsByCategory).map(([category, tags]) => <div key={category} className="mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">
                          {category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {tags.map(tag => <div key={tag.id} className={`px-3 py-2 rounded-md border text-sm cursor-pointer transition-all ${selectedTagsForBatch.includes(tag.id) ? 'ring-2 ring-primary ring-offset-2' : 'hover:bg-accent'}`} style={{
                      borderLeftColor: tag.color,
                      borderLeftWidth: '4px'
                    }} draggable onDragStart={e => handleTagDragStart(e, tag.id)} onDragEnd={handleTagDragEnd} onClick={() => toggleTagSelection(tag.id)}>
                              <div className="font-medium">{tag.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {tag.description || 'No description'}
                              </div>
                            </div>)}
                        </div>
                      </div>) : <div className="text-center py-6 text-muted-foreground">
                      {tagSearchQuery ? 'No tags found matching your search.' : 'No tags available.'}
                    </div>}
                </CardContent>
              </Card>
              {/* Right Panel - Users */}
              <Card className="flex flex-col overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle>
                    Users{' '}
                    {selectedUsers.length > 0 && `(${selectedUsers.length} selected)`}
                  </CardTitle>
                  <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users..." className="pl-8" value={userSearchQuery} onChange={e => setUserSearchQuery(e.target.value)} />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto pb-6">
                  <div className="space-y-3">
                    {filteredUsers.length > 0 ? filteredUsers.map(user => <div key={user.id} className={`p-3 border rounded-md ${selectedUserIds.includes(user.id) ? 'bg-accent/40' : ''}`} onDragOver={handleUserDragOver} onDrop={e => handleUserDrop(e, user.id)}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.role}
                              </div>
                            </div>
                            <Badge variant="outline">Level {user.level}</Badge>
                          </div>
                          <div className="mt-2">
                            <div className="text-xs text-muted-foreground mb-1">
                              Tags
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {getUserTagsById(user.id).map(tag => <Badge key={`${user.id}-${tag.id}`} style={{
                          backgroundColor: tag.color,
                          color: '#fff'
                        }} className="cursor-pointer group" onClick={() => removeTagFromUser(user.id, tag.id)}>
                                  {tag.name}
                                  <X className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100" />
                                </Badge>)}
                              {getUserTagsById(user.id).length === 0 && <span className="text-xs text-muted-foreground">
                                  No tags assigned
                                </span>}
                            </div>
                          </div>
                        </div>) : <div className="text-center py-6 text-muted-foreground">
                        {userSearchQuery ? 'No users found matching your search.' : 'No users available.'}
                      </div>}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button onClick={onClose}>Done</Button>
            </div>
          </TabsContent>
          <TabsContent value="create" className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Tag</CardTitle>
              </CardHeader>
              <CardContent>
                <TagCreationForm onTagCreate={handleCreateTag} onCancel={() => setActiveTab('assign')} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};