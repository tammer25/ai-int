'use client';

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LayoutPlan {
  id: string;
  url: string;
  name: string;
}

export default function LayoutPlanPage() {
  const { projectId } = useParams();
  const [layouts, setLayouts] = useState<LayoutPlan[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Upload handler for floor plan images
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newLayouts: LayoutPlan[] = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = evt => {
        newLayouts.push({
          id: Date.now().toString() + file.name,
          url: evt.target?.result as string,
          name: file.name
        });
        if (newLayouts.length === files.length) {
          setLayouts(prev => [...prev, ...newLayouts]);
          toast({ title: 'Layout updated', description: `${files.length} plan(s) added.` });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // Remove layout
  const removeLayout = (id: string) => {
    setLayouts(prev => prev.filter(plan => plan.id !== id));
    toast({ title: 'Layout removed', description: 'Floor plan was deleted.' });
  };

  return (
    <main className="max-w-4xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Room Layouts & Floor Plans for Project: {projectId}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <Button onClick={() => fileInputRef.current?.click()}>Upload Layout Plan</Button>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <span className="text-gray-500">{layouts.length} plans</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {layouts.map(plan => (
              <div
                key={plan.id}
                className="relative bg-gray-50 rounded-lg shadow overflow-hidden group"
              >
                <img src={plan.url} alt={plan.name} className="object-contain h-44 w-full" />
                <button
                  className="absolute top-2 right-2 bg-white opacity-80 rounded p-1 text-red-700 hover:bg-red-100"
                  onClick={() => removeLayout(plan.id)}
                  title="Remove layout"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
