'use client';

import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Material {
  id: string;
  name: string;
  description: string;
  image?: string; // Data URL for preview
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [newMaterial, setNewMaterial] = useState({ name: '', description: '', image: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle image upload for new material
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      setNewMaterial(mat => ({ ...mat, image: evt.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const addMaterial = () => {
    if (!newMaterial.name.trim()) {
      toast({ title: 'Validation error', description: 'Name is required', variant: 'destructive' });
      return;
    }
    setMaterials(prev => [{ ...newMaterial, id: Date.now().toString() }, ...prev]);
    setNewMaterial({ name: '', description: '', image: '' });
    toast({ title: 'Added', description: 'Material added to board.' });
  };

  const removeMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
    toast({ title: 'Removed', description: 'Material was removed.' });
  };

  return (
    <main className="max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Material Library & Swatches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-end gap-2">
            <Input
              placeholder="Material name"
              value={newMaterial.name}
              onChange={e => setNewMaterial(mat => ({ ...mat, name: e.target.value }))}
              className="w-36"
            />
            <Textarea
              placeholder="Short description"
              value={newMaterial.description}
              onChange={e => setNewMaterial(mat => ({ ...mat, description: e.target.value }))}
              className="w-56"
              rows={2}
            />
            <Button onClick={() => fileInputRef.current?.click()}>Upload Image</Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button onClick={addMaterial} className="ml-3">Add</Button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {materials.map(m => (
              <div key={m.id} className="flex flex-col items-center p-2 border rounded-lg shadow-sm">
                {m.image && (
                  <img src={m.image} alt={m.name} className="h-24 w-24 object-cover rounded mb-2"/>
                )}
                <div className="font-bold">{m.name}</div>
                <div className="text-xs text-gray-600 mb-2">{m.description}</div>
                <Button size="sm" variant="destructive" onClick={() => removeMaterial(m.id)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
