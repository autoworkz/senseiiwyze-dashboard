# Settings Page shadcn/ui Refactoring Plan

## Overview
This document outlines the comprehensive refactoring plan to convert the existing settings page (`/src/app/settings/page.tsx`) from using hardcoded Tailwind colors to properly utilizing shadcn/ui components with semantic color utilities.

## Current Issues

### 1. Hardcoded Color Violations
The current implementation extensively uses hardcoded colors throughout, violating the project's theming guidelines:

- Background colors: `bg-white`, `bg-gray-50`, `bg-gray-200`, `bg-blue-50`, `bg-red-600`
- Text colors: `text-gray-900`, `text-gray-700`, `text-gray-600`, `text-gray-500`, `text-blue-600`
- Border colors: `border-gray-200`, `border-gray-300`, `border-blue-500`
- Focus states: `focus:ring-blue-300`, `focus:ring-blue-500`
- Checked states: `peer-checked:bg-blue-600`

### 2. Custom Component Implementations
- Custom tab navigation system instead of shadcn/ui Tabs
- Custom toggle switches instead of shadcn/ui Switch
- Native HTML inputs instead of shadcn/ui Input components
- Native select elements instead of shadcn/ui Select

## Required shadcn/ui Components

The following shadcn/ui components need to be installed:

```bash
pnpx shadcn@latest add tabs
pnpx shadcn@latest add input
pnpx shadcn@latest add textarea
pnpx shadcn@latest add switch
pnpx shadcn@latest add select
pnpx shadcn@latest add button
pnpx shadcn@latest add card
pnpx shadcn@latest add label
```

## Refactoring Examples

### 1. Page Wrapper
**Current (lines 124-130):**
```tsx
<div className="container mx-auto p-6 max-w-6xl">
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
    <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
  </div>
  <div className="bg-white rounded-lg shadow">
```

**Refactored:**
```tsx
<div className="container mx-auto p-6 max-w-6xl">
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-foreground">Settings</h1>
    <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
  </div>
  <Card>
```

### 2. Tab Navigation
**Current (lines 140-145):**
```tsx
className={`
  group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm
  ${activeTab === tab.id
    ? 'border-blue-500 text-blue-600'
    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
  }
`}
```

**Refactored:**
```tsx
<Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
  <TabsList className="grid w-full grid-cols-5">
    {tabs.map((tab) => {
      const Icon = tab.icon;
      return (
        <TabsTrigger key={tab.id} value={tab.id}>
          <Icon className="w-4 h-4 mr-2" />
          {tab.label}
        </TabsTrigger>
      );
    })}
  </TabsList>
  
  <TabsContent value="general">
    {/* General settings content */}
  </TabsContent>
  
  <TabsContent value="notifications">
    {/* Notifications content */}
  </TabsContent>
  
  {/* Other tab contents */}
</Tabs>
```

### 3. Form Inputs
**Current (lines 169-175):**
```tsx
<input
  type="text"
  value={localProfile.name}
  onChange={(e) => handleProfileChange('name', e.target.value)}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  placeholder="Enter your display name"
/>
```

**Refactored:**
```tsx
<div className="space-y-2">
  <Label htmlFor="display-name">Display Name</Label>
  <Input
    id="display-name"
    type="text"
    value={localProfile.name}
    onChange={(e) => handleProfileChange('name', e.target.value)}
    placeholder="Enter your display name"
  />
</div>
```

### 4. Toggle Switches
**Current (lines 224-231):**
```tsx
<label className="relative inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    checked={localSettings.emailNotifications}
    onChange={(e) => handleSettingsChange('emailNotifications', e.target.checked)}
    className="sr-only peer"
  />
  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
</label>
```

**Refactored:**
```tsx
<div className="flex items-center justify-between p-4 bg-muted rounded-lg">
  <div className="flex items-center">
    <Mail className="w-5 h-5 text-muted-foreground mr-3" />
    <div>
      <p className="font-medium text-foreground">Email Notifications</p>
      <p className="text-sm text-muted-foreground">Receive updates via email</p>
    </div>
  </div>
  <Switch
    checked={localSettings.emailNotifications}
    onCheckedChange={(checked) => handleSettingsChange('emailNotifications', checked)}
  />
</div>
```

### 5. Theme Selector Buttons
**Current (lines 288-295):**
```tsx
<button
  onClick={() => handleSettingsChange('theme', 'light')}
  className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
    localSettings.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
  }`}
>
  <Sun className="w-6 h-6" />
  <span className="text-sm font-medium">Light</span>
</button>
```

**Refactored:**
```tsx
<Button
  variant={localSettings.theme === 'light' ? 'default' : 'outline'}
  className="h-auto flex flex-col items-center p-4"
  onClick={() => handleSettingsChange('theme', 'light')}
>
  <Sun className="w-6 h-6 mb-2" />
  <span className="text-sm font-medium">Light</span>
</Button>
```

### 6. Select Dropdowns
**Current (lines 344-354):**
```tsx
<select 
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="en">English</option>
  <option value="es">Español</option>
  <option value="fr">Français</option>
  <option value="de">Deutsch</option>
  <option value="ja">日本語</option>
</select>
```

**Refactored:**
```tsx
<Select value={localSettings.language} onValueChange={(value) => handleSettingsChange('language', value)}>
  <SelectTrigger>
    <SelectValue placeholder="Select language" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="en">English</SelectItem>
    <SelectItem value="es">Español</SelectItem>
    <SelectItem value="fr">Français</SelectItem>
    <SelectItem value="de">Deutsch</SelectItem>
    <SelectItem value="ja">日本語</SelectItem>
  </SelectContent>
</Select>
```

### 7. Save/Cancel Buttons
**Current (lines 457-462):**
```tsx
<button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
  Cancel
</button>
<button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
  Save Changes
</button>
```

**Refactored:**
```tsx
<div className="px-6 py-4 bg-muted/50 border-t flex justify-end space-x-3">
  <Button variant="outline" onClick={handleCancel}>
    Cancel
  </Button>
  <Button onClick={handleSave}>
    <Save className="w-4 h-4 mr-2" />
    Save Changes
  </Button>
</div>
```

## Complete Import Statement

After refactoring, the imports section should be updated to:

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  Bell, 
  Globe, 
  Shield, 
  Palette, 
  Mail, 
  Smartphone,
  Moon,
  Sun,
  Monitor,
  Save,
  Check
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { debounce } from 'lodash';

// shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
```

## Color Mapping Reference

| Current Color | Semantic Replacement |
|--------------|---------------------|
| `bg-white` | `bg-background` or `bg-card` |
| `bg-gray-50` | `bg-muted` |
| `bg-gray-200` | `bg-muted` |
| `bg-blue-50` | `bg-primary/10` |
| `bg-blue-600` | `bg-primary` |
| `bg-red-600` | `bg-destructive` |
| `text-gray-900` | `text-foreground` |
| `text-gray-700` | `text-foreground` |
| `text-gray-600` | `text-muted-foreground` |
| `text-gray-500` | `text-muted-foreground` |
| `text-blue-600` | `text-primary` |
| `text-white` | `text-primary-foreground` or `text-destructive-foreground` |
| `border-gray-200` | `border` |
| `border-gray-300` | `border` |
| `border-blue-500` | `border-primary` |
| `hover:bg-gray-50` | `hover:bg-muted` |
| `hover:text-gray-700` | `hover:text-foreground` |
| `hover:border-gray-300` | `hover:border-border` |
| `focus:ring-blue-300` | `focus-visible:ring-ring` |
| `focus:ring-blue-500` | `focus-visible:ring-primary` |

## Additional Considerations

### 1. Form Validation
Consider adding form validation using react-hook-form with Zod schemas (already used in the project):

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '@/utils/validationSchema';
```

### 2. Loading States
Add loading states for async operations:

```tsx
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Saving...
    </>
  ) : (
    <>
      <Save className="mr-2 h-4 w-4" />
      Save Changes
    </>
  )}
</Button>
```

### 3. Toast Notifications
Instead of the current saved indicator, use the toast component:

```tsx
import { toast } from '@/components/ui/use-toast';

const handleSave = () => {
  // ... save logic
  toast({
    title: "Settings saved",
    description: "Your preferences have been updated successfully.",
  });
};
```

### 4. Responsive Design
Ensure the tab navigation is responsive:

```tsx
<TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
```

## Implementation Steps

1. **Install Required Components**: Run the shadcn/ui add commands listed above
2. **Update Imports**: Replace current imports with shadcn/ui components
3. **Replace Hardcoded Colors**: Systematically go through each color class and replace with semantic utilities
4. **Convert Custom Components**: Replace custom implementations with shadcn/ui components
5. **Test Theme Switching**: Verify that all components respond correctly to theme changes
6. **Add Loading States**: Implement proper loading indicators for async operations
7. **Enhance Accessibility**: Ensure all form elements have proper labels and ARIA attributes

## Benefits

- **Theme Consistency**: All components will automatically adapt to theme changes
- **Reduced Code**: Less custom CSS and component logic
- **Better Accessibility**: shadcn/ui components include proper ARIA attributes
- **Maintainability**: Easier to update and maintain with standardized components
- **Performance**: Smaller bundle size by reusing shared components

## Testing Checklist

- [ ] All hardcoded colors replaced with semantic utilities
- [ ] Theme switching works correctly (light/dark/system)
- [ ] Form inputs maintain proper focus states
- [ ] Tab navigation is keyboard accessible
- [ ] Switches toggle correctly and save state
- [ ] Select dropdowns display proper values
- [ ] Save/Cancel buttons trigger correct actions
- [ ] Responsive design works on mobile devices
- [ ] No visual regressions from current design