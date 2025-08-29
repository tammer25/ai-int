'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface PaletteColor {
  id: string;
  name: string;
  hex: string;
}

export default function PalettePage() {
  const [palette, setPalette] = useState<PaletteColor[]>([
    { id: '1', name: 'Cloud White', hex: '#F8F8F8' },
    { id: '2', name: 'Stone Grey', hex: '#767676' },
    { id: '3', name: 'Sand Beige', hex: '#E1C699' }
  ]);
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
  const { toast } = useToast();

  const addColor = () => {
    if (!newColor.name.trim() || !/^#[0-9A-Fa-f]{6}$/.test(newColor.hex)) {
      toast({ title: 'Validation error', description: 'Must provide color name and valid hex!', variant: 'destructive' });
      return;
    }
    setPalette([{ ...newColor, id: Date.now().toString() }, ...palette]);
    setNewColor({ name: '', hex: '#000000' });
    toast({ title: 'Added', description: `Color ${newColor.name} added to palette.` });
  };
  const removeColor = (id: string) => {
    setPalette(prev => prev.filter(c => c.id !== id));
    toast({ title: 'Removed', description: 'Color removed.' });
  };

  return (
    <main className="max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Color & Material Palette</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-end gap-2">
            <Input
              placeholder="Color name"
              value={newColor.name}
              onChange={e => setNewColor(v => ({ ...v, name: e.target.value }))}
              className="w-36"
            />
            <Input
              type="color"
              value={newColor.hex}
              onChange={e => setNewColor(v => ({ ...v, hex: e.target.value }))}
              className="w-20 h-10 border-none p-0"
            />
            <Button onClick={addColor}>Add Color</Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {palette.map(color => (
              <div key={color.id} className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full border" style={{ background: color.hex }} />
                <div className="mt-1 text-sm">{color.name}</div>
                <div className="text-xs text-gray-500">{color.hex}</div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-1"
                  onClick={() => removeColor(color.id)}
                >
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
