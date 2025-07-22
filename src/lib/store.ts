import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  avatar: string;
}

export interface GlobalSettings {
  theme: 'light' | 'dark' | 'auto';
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  language: string;
  timezone: string;
  compactMode: boolean;
  showOnlineStatus: boolean;
  autoSave: boolean;
}

export interface Project {
  id: string;
  name: string;
  status: 'active' | 'archived' | 'draft';
  lastAccessed: string;
  isStarred: boolean;
}

interface AppStore {
  // User Profile
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  // Global Settings
  settings: GlobalSettings;
  updateSettings: (updates: Partial<GlobalSettings>) => void;
  resetSettings: () => void;
  
  // Projects
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  toggleProjectStar: (id: string) => void;
}

const defaultProfile: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  bio: 'Full-stack developer passionate about building great user experiences.',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=faces',
};

const defaultSettings: GlobalSettings = {
  theme: 'light',
  emailNotifications: true,
  pushNotifications: false,
  marketingEmails: false,
  language: 'en',
  timezone: 'America/Los_Angeles',
  compactMode: false,
  showOnlineStatus: true,
  autoSave: true,
};

const defaultProjects: Project[] = [
  { id: '1', name: 'Heritage Collection', status: 'active', lastAccessed: '2 hours ago', isStarred: true },
  { id: '2', name: 'Vintage Portfolio', status: 'active', lastAccessed: '1 day ago', isStarred: false },
  { id: '3', name: 'Classic Archives', status: 'archived', lastAccessed: '3 days ago', isStarred: true },
  { id: '4', name: 'Retro Designs', status: 'draft', lastAccessed: '1 week ago', isStarred: false },
];

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),
      
      settings: defaultSettings,
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      
      resetSettings: () =>
        set(() => ({
          settings: defaultSettings,
        })),
      
      projects: defaultProjects,
      currentProject: defaultProjects[0],
      setCurrentProject: (project) =>
        set(() => ({
          currentProject: project,
        })),
      
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),
      
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map(project =>
            project.id === id ? { ...project, ...updates } : project
          ),
          currentProject: state.currentProject?.id === id 
            ? { ...state.currentProject, ...updates }
            : state.currentProject,
        })),
      
      toggleProjectStar: (id) =>
        set((state) => ({
          projects: state.projects.map(project =>
            project.id === id ? { ...project, isStarred: !project.isStarred } : project
          ),
          currentProject: state.currentProject?.id === id 
            ? { ...state.currentProject, isStarred: !state.currentProject.isStarred }
            : state.currentProject,
        })),
    }),
    {
      name: 'app-store',
    }
  )
);