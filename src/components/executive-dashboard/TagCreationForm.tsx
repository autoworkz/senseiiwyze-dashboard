import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { tagData } from './tagData';
interface TagCreationFormProps {
  onTagCreate: (newTag: {
    name: string;
    color: string;
    category: string;
    description?: string;
  }) => void;
  onCancel: () => void;
}
export const TagCreationForm = ({
  onTagCreate,
  onCancel
}: TagCreationFormProps) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  // Extract unique categories from existing tags for suggestions
  const existingCategories = Array.from(new Set(tagData.map(tag => tag.category)));
  // Predefined colors for easy selection
  const colorOptions = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#84cc16'];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && color && category.trim()) {
      onTagCreate({
        name: name.trim(),
        color,
        category: category.trim(),
        description: description.trim() || undefined
      });
      // Reset form
      setName('');
      setColor('#3b82f6');
      setCategory('');
      setDescription('');
    }
  };
  return <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tag-name">Tag Name</Label>
        <Input id="tag-name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter tag name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tag-color">Color</Label>
        <div className="flex items-center space-x-2">
          <Input id="tag-color" type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-10 p-1" />
          <div className="flex flex-wrap gap-1">
            {colorOptions.map(colorOption => <button key={colorOption} type="button" className="w-6 h-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" style={{
            backgroundColor: colorOption
          }} onClick={() => setColor(colorOption)} aria-label={`Select color ${colorOption}`} />)}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="tag-category">Category</Label>
        <Input id="tag-category" list="category-options" value={category} onChange={e => setCategory(e.target.value)} placeholder="Enter or select category" required />
        <datalist id="category-options">
          {existingCategories.map(cat => <option key={cat} value={cat} />)}
        </datalist>
      </div>
      <div className="space-y-2">
        <Label htmlFor="tag-description">Description (Optional)</Label>
        <Input id="tag-description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter tag description" />
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!name.trim() || !category.trim()}>
          Create Tag
        </Button>
      </div>
    </form>;
};