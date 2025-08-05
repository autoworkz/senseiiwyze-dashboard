export interface Tag {
  id: string;
  name: string;
  color: string;
  category: string;
  description?: string;
}
export interface UserTag {
  userId: number;
  tagId: string;
}
// Sample tag data
export const tagData: Tag[] = [{
  id: 'tag-1',
  name: 'High Potential',
  color: '#10b981',
  category: 'Performance',
  description: 'Users with exceptional potential for growth'
}, {
  id: 'tag-2',
  name: 'Leadership Track',
  color: '#3b82f6',
  category: 'Career Path',
  description: 'Users being prepared for leadership roles'
}, {
  id: 'tag-3',
  name: 'Technical Expert',
  color: '#8b5cf6',
  category: 'Skill',
  description: 'Users with deep technical expertise'
}, {
  id: 'tag-4',
  name: 'Needs Mentoring',
  color: '#f59e0b',
  category: 'Development',
  description: 'Users who would benefit from mentorship'
}, {
  id: 'tag-5',
  name: 'Cross-functional',
  color: '#ec4899',
  category: 'Team',
  description: 'Users who work across multiple teams'
}, {
  id: 'tag-6',
  name: 'Remote',
  color: '#6366f1',
  category: 'Location',
  description: 'Users who work remotely'
}, {
  id: 'tag-7',
  name: 'New Hire',
  color: '#14b8a6',
  category: 'Status',
  description: 'Recently hired users (< 90 days)'
}];
// Sample user-tag assignments
export const userTagAssignments: UserTag[] = [{
  userId: 1,
  tagId: 'tag-1'
}, {
  userId: 1,
  tagId: 'tag-2'
}, {
  userId: 2,
  tagId: 'tag-3'
}, {
  userId: 3,
  tagId: 'tag-1'
}, {
  userId: 3,
  tagId: 'tag-5'
}, {
  userId: 4,
  tagId: 'tag-4'
}, {
  userId: 5,
  tagId: 'tag-3'
}, {
  userId: 8,
  tagId: 'tag-2'
}, {
  userId: 11,
  tagId: 'tag-1'
}, {
  userId: 11,
  tagId: 'tag-2'
}, {
  userId: 15,
  tagId: 'tag-6'
}, {
  userId: 20,
  tagId: 'tag-7'
}, {
  userId: 29,
  tagId: 'tag-1'
}, {
  userId: 29,
  tagId: 'tag-2'
}, {
  userId: 29,
  tagId: 'tag-3'
}];
// Helper functions for tag management
export const getUserTags = (userId: number): Tag[] => {
  const tagIds = userTagAssignments.filter(assignment => assignment.userId === userId).map(assignment => assignment.tagId);
  return tagData.filter(tag => tagIds.includes(tag.id));
};
export const getTagById = (tagId: string): Tag | undefined => {
  return tagData.find(tag => tag.id === tagId);
};