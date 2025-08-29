'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function BriefDetailPage() {
  const { projectId } = useParams();
  const [brief, setBrief] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch or mock brief data:
    setBrief({
      projectTitle: 'Modern Living Room',
      client: 'John Doe',
      style: 'Minimalist, Scandinavian',
      colorScheme: 'Neutral, Earth Tones',
      mainGoals: 'Open feeling, more light, maximize storage',
      inspiration: ['Pinterest', 'Instagram'],
      keyRooms: ['Living Room', 'Dining'],
      mustHave: ['Built-in shelves', 'Ergonomic desk space'],
      avoid: ['Dark paint', 'Clutter'],
      timeline: '1-2 months',
      budget: '$15,000',
      notes: 'Family-friendly, pet-resistant materials'
    });
  }, [projectId]);

  if (!brief) return <div className='p-8 text-center'>Loading design brief…</div>;

  return (
    <main className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Design Brief for Project: {brief.projectTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2"><strong>Client:</strong> {brief.client}</div>
          <div className="mb-2"><strong>Main Style:</strong> {brief.style}</div>
          <div className="mb-2"><strong>Preferred Colors:</strong> {brief.colorScheme}</div>
          <div className="mb-2"><strong>Key Goals:</strong> {brief.mainGoals}</div>
          <div className="mb-2"><strong>Inspiration Sources:</strong> {brief.inspiration.join(', ')}</div>
          <div className="mb-2"><strong>Rooms:</strong> {brief.keyRooms.join(', ')}</div>
          <div className="mb-2"><strong>Must Have Elements:</strong> {brief.mustHave.join(', ')}</div>
          <div className="mb-2"><strong>Things to Avoid:</strong> {brief.avoid.join(', ')}</div>
          <div className="mb-2"><strong>Timeline:</strong> {brief.timeline}</div>
          <div className="mb-2"><strong>Budget:</strong> {brief.budget}</div>
          <div className="mb-2"><strong>Notes:</strong> {brief.notes}</div>
          <Button
            className="mt-4"
            variant="secondary"
            onClick={() => {
              navigator.clipboard.writeText(
                `Design Brief for ${brief.client}:\n\nProject: ${brief.projectTitle}\nStyle: ${brief.style}\nColors: ${brief.colorScheme}\nGoals: ${brief.mainGoals}\nRooms: ${brief.keyRooms}\nTimeline: ${brief.timeline}\nBudget: ${brief.budget}\nNotes: ${brief.notes}`
              );
              toast({ title: 'Brief copied', description: 'The design brief was copied to clipboard.' });
            }}
          >
            Copy Brief
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
