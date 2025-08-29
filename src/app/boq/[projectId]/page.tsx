'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, Tr, Th, Td } from '@/components/ui/table'; // Adjust if your table import differs
import { useToast } from '@/hooks/use-toast';

interface BOQItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitCost: number;
}

export default function BOQDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { toast } = useToast();

  const [items, setItems] = useState<BOQItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', quantity: 1, unitCost: 0 });
  const [editItemId, setEditItemId] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch BOQ data from API. For now, use demo items.
    setItems([
      { id: '1', name: 'Paint', description: 'Wall painting', quantity: 6, unitCost: 60 },
      { id: '2', name: 'Tiles', description: 'Floor tiles for living room', quantity: 100, unitCost: 5 }
    ]);
  }, [projectId]);

  const handleAddItem = () => {
    if (!newItem.name.trim() || newItem.quantity <= 0) {
      toast({ title: 'Validation error', description: 'Name and positive quantity required.', variant: 'destructive' });
      return;
    }
    setItems(prev => [
      { ...newItem, id: Date.now().toString() },
      ...prev
    ]);
    setNewItem({ name: '', description: '', quantity: 1, unitCost: 0 });
    toast({ title: 'Item added', description: `${newItem.name} added to BOQ.` });
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast({ title: 'Item deleted', description: 'BOQ item deleted.' });
  };

  const handleEditItemSave = (item: BOQItem) => {
    setItems(prev => prev.map(i => (i.id === item.id ? item : i)));
    setEditItemId(null);
    toast({ title: 'Item updated', description: 'BOQ item updated.' });
  };

  const total = items.reduce((sum, item) => sum + item.unitCost * item.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Bill of Quantities (BOQ) for Project #{projectId}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Item name"
              value={newItem.name}
              onChange={e => setNewItem(v => ({ ...v, name: e.target.value }))}
            />
            <Input
              placeholder="Description"
              value={newItem.description}
              onChange={e => setNewItem(v => ({ ...v, description: e.target.value }))}
              className="mt-2"
            />
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                placeholder="Quantity"
                value={newItem.quantity}
                min={1}
                onChange={e => setNewItem(v => ({ ...v, quantity: Number(e.target.value) }))}
              />
              <Input
                type="number"
                placeholder="Unit Cost"
                value={newItem.unitCost}
                min={0}
                onChange={e => setNewItem(v => ({ ...v, unitCost: Number(e.target.value) }))}
              />
              <Button onClick={handleAddItem}>Add Item</Button>
            </div>
          </div>
          <Table className="mb-4">
            <thead>
              <Tr>
                <Th>Item</Th>
                <Th>Description</Th>
                <Th>Quantity</Th>
                <Th>Unit Cost</Th>
                <Th>Total</Th>
                <Th>Actions</Th>
              </Tr>
            </thead>
            <tbody>
              {items.map(item =>
                editItemId === item.id ? (
                  <Tr key={item.id}>
                    <Td>
                      <Input
                        value={item.name}
                        onChange={e =>
                          setItems(prev =>
                            prev.map(i => (i.id === item.id ? { ...i, name: e.target.value } : i))
                          )
                        }
                      />
                    </Td>
                    <Td>
                      <Input
                        value={item.description}
                        onChange={e =>
                          setItems(prev =>
                            prev.map(i => (i.id === item.id ? { ...i, description: e.target.value } : i))
                          )
                        }
                      />
                    </Td>
                    <Td>
                      <Input
                        type="number"
                        value={item.quantity}
                        min={1}
                        onChange={e =>
                          setItems(prev =>
                            prev.map(i => (i.id === item.id ? { ...i, quantity: Number(e.target.value) } : i))
                          )
                        }
                      />
                    </Td>
                    <Td>
                      <Input
                        type="number"
                        value={item.unitCost}
                        min={0}
                        onChange={e =>
                          setItems(prev =>
                            prev.map(i => (i.id === item.id ? { ...i, unitCost: Number(e.target.value) } : i))
                          )
                        }
                      />
                    </Td>
                    <Td>{item.quantity * item.unitCost}</Td>
                    <Td>
                      <Button onClick={() => handleEditItemSave(item)} size="sm" className="mr-2">
                        Save
                      </Button>
                      <Button onClick={() => setEditItemId(null)} size="sm" variant="secondary">
                        Cancel
                      </Button>
                    </Td>
                  </Tr>
                ) : (
                  <Tr key={item.id}>
                    <Td>{item.name}</Td>
                    <Td>{item.description}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>{item.unitCost}</Td>
                    <Td>{item.quantity * item.unitCost}</Td>
                    <Td>
                      <Button onClick={() => setEditItemId(item.id)} size="sm" className="mr-2">
                        Edit
                      </Button>
                      <Button onClick={() => handleDeleteItem(item.id)} size="sm" variant="destructive">
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                )
              )}
            </tbody>
          </Table>
          <div className="font-bold text-right">Total: ${total.toLocaleString()}</div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => window.print()} variant="secondary">
              Print
            </Button>
            {/* For Export: implement CSV export logic if needed */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
