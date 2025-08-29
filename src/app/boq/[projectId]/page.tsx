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
  photo?: string; // Data URL for product photo
}

export default function BOQDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { toast } = useToast();
  const [items, setItems] = useState<BOQItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', quantity: 1, unitCost: 0, photo: '' });
  const [editItemId, setEditItemId] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch BOQ data from API. For now, use demo items.
    setItems([
      { id: '1', name: 'Paint', description: 'Wall painting', quantity: 6, unitCost: 60 },
      { id: '2', name: 'Tiles', description: 'Floor tiles for living room', quantity: 100, unitCost: 5 }
    ]);
  }, [projectId]);

  // Handle file upload and convert to Data URL
  const handleFileUpload = (file: File, isNewItem: boolean, itemId?: string) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please select an image file.', variant: 'destructive' });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please select an image under 5MB.', variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      
      if (isNewItem) {
        setNewItem(prev => ({ ...prev, photo: dataUrl }));
      } else if (itemId) {
        setItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, photo: dataUrl } : item
        ));
      }

      toast({ title: 'Photo uploaded', description: 'Product photo has been added.' });
    };
    reader.readAsDataURL(file);
  };

  const handleAddItem = () => {
    if (!newItem.name.trim() || newItem.quantity <= 0) {
      toast({ title: 'Validation error', description: 'Name and positive quantity required.', variant: 'destructive' });
      return;
    }
    setItems(prev => [
      { ...newItem, id: Date.now().toString() },
      ...prev
    ]);
    setNewItem({ name: '', description: '', quantity: 1, unitCost: 0, photo: '' });
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
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Bill of Quantities (BOQ) for Project #{projectId}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add New Item Form */}
          <div className="mb-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-3">Add New Item</h3>
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
                step="0.01"
                onChange={e => setNewItem(v => ({ ...v, unitCost: Number(e.target.value) }))}
              />
            </div>
            {/* Photo Upload for New Item */}
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">Product Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file, true);
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {newItem.photo && (
                <div className="mt-2">
                  <img src={newItem.photo} alt="Product preview" className="w-16 h-16 object-cover rounded" />
                </div>
              )}
            </div>
            <Button onClick={handleAddItem} className="mt-3">Add Item</Button>
          </div>

          {/* BOQ Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Item</th>
                  <th className="border border-gray-300 p-2 text-left">Description</th>
                  <th className="border border-gray-300 p-2 text-left">Photo</th>
                  <th className="border border-gray-300 p-2 text-left">Quantity</th>
                  <th className="border border-gray-300 p-2 text-left">Unit Cost</th>
                  <th className="border border-gray-300 p-2 text-left">Total</th>
                  <th className="border border-gray-300 p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item =>
                  editItemId === item.id ? (
                    <tr key={item.id}>
                      <td className="border border-gray-300 p-2">
                        <Input
                          value={item.name}
                          onChange={e =>
                            setItems(prev =>
                              prev.map(i => (i.id === item.id ? { ...i, name: e.target.value } : i))
                            )
                          }
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          value={item.description}
                          onChange={e =>
                            setItems(prev =>
                              prev.map(i => (i.id === item.id ? { ...i, description: e.target.value } : i))
                            )
                          }
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, false, item.id);
                              }
                            }}
                            className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
                          />
                          {item.photo && (
                            <img src={item.photo} alt={item.name} className="w-12 h-12 object-cover rounded" />
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
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
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          type="number"
                          value={item.unitCost}
                          min={0}
                          step="0.01"
                          onChange={e =>
                            setItems(prev =>
                              prev.map(i => (i.id === item.id ? { ...i, unitCost: Number(e.target.value) } : i))
                            )
                          }
                        />
                      </td>
                      <td className="border border-gray-300 p-2">${(item.quantity * item.unitCost).toFixed(2)}</td>
                      <td className="border border-gray-300 p-2">
                        <div className="flex gap-1">
                          <Button onClick={() => handleEditItemSave(item)} size="sm" className="mr-1">
                            Save
                          </Button>
                          <Button onClick={() => setEditItemId(null)} size="sm" variant="secondary">
                            Cancel
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={item.id}>
                      <td className="border border-gray-300 p-2">{item.name}</td>
                      <td className="border border-gray-300 p-2">{item.description}</td>
                      <td className="border border-gray-300 p-2">
                        {item.photo ? (
                          <img src={item.photo} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            No photo
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">{item.quantity}</td>
                      <td className="border border-gray-300 p-2">${item.unitCost.toFixed(2)}</td>
                      <td className="border border-gray-300 p-2">${(item.quantity * item.unitCost).toFixed(2)}</td>
                      <td className="border border-gray-300 p-2">
                        <div className="flex gap-1">
                          <Button onClick={() => setEditItemId(item.id)} size="sm" className="mr-1">
                            Edit
                          </Button>
                          <Button onClick={() => handleDeleteItem(item.id)} size="sm" variant="destructive">
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="font-bold text-right text-lg mb-4">Total: ${total.toFixed(2)}</div>
          
          <div className="flex gap-2">
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
