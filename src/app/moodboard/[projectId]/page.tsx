'use client';

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MoodImage {
  id: string;
  url: string;
  name: string;
}

export default function MoodboardDetailPage() {
  const { projectId } = useParams();
  const [images, setImages] = useState<MoodImage[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImgs: MoodImage[] = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = evt => {
        newImgs.push({
          id: Date.now().toString() + file.name,
          url: evt.target?.result as string,
          name: file.name
        });
        if (newImgs.length === files.length) {
          setImages(prev => [...prev, ...newImgs]);
          toast({ title: 'Moodboard updated', description: `${files.length} image(s) added.` });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // Drag-and-drop sort handlers
  const onDragStart = (id: string) => setDraggedId(id);
  const onDrop = (id: string) => {
    if (!draggedId) return;
    const ids = images.map(img => img.id);
    const draggedIdx = ids.indexOf(draggedId);
    const dropIdx = ids.indexOf(id);
    if (draggedIdx < 0 || dropIdx < 0) return;
    const reordered = [...images];
    const [removed] = reordered.splice(draggedIdx, 1);
    reordered.splice(dropIdx, 0, removed);
    setImages(reordered);
    setDraggedId(null);
  };

  // Remove image
  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    toast({ title: 'Image removed', description: 'Image removed from mood board.' });
  };

  return (
    <main className="max-w-4xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Mood Board for Project: {projectId}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <Button onClick={() => fileInputRef.current?.click()}>Upload Images</Button>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <span className="text-gray-500">{images.length} images</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map(img => (
              <div
                key={img.id}
                draggable
                onDragStart={() => onDragStart(img.id)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => onDrop(img.id)}
                className="relative bg-gray-100 rounded-lg shadow overflow-hidden group"
              >
                <img src={img.url} alt={img.name} className="object-cover h-40 w-full" />
                <button
                  className="absolute top-2 right-2 bg-white opacity-80 rounded p-1 text-red-700 hover:bg-red-100"
                  onClick={() => removeImage(img.id)}
                  title="Remove image"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {images.length > 0 && (
            <Button
              className="mt-8"
              variant="secondary"
              onClick={() => {
                // Download moodboard as image or PDF not implemented; this just acknowledges the feature spot.
                toast({ title: 'Export', description: 'Export feature coming soon!' });
              }}
            >
              Export Mood Board
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
