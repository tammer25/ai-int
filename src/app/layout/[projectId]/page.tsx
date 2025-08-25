'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { 
  Home, 
  Palette, 
  LayoutGrid, 
  Calculator, 
  Users, 
  Sparkles, 
  Plus, 
  Settings,
  FileText,
  Image as ImageIcon,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Download,
  Share2,
  Edit,
  Save,
  Loader2,
  MapPin,
  DollarSign,
  Upload,
  Camera,
  Ruler,
  Maximize,
  Minimize,
  Trash2,
  PlusCircle,
  Heart,
  Filter,
  Search,
  Grid,
  List,
  Eye,
  Shuffle,
  Move,
  RotateCcw,
  Layers,
  ZoomIn,
  ZoomOut,
  Lock,
  Unlock,
  Square,
  Circle,
  Triangle,
  RectangleHorizontal
} from 'lucide-react'

interface Layout {
  id: string
  projectId: string
  title: string
  description?: string
  floorPlan?: string
  dimensions?: string
  furniture?: string
  aiGenerated: boolean
  createdAt: string
  updatedAt: string
}

interface Project {
  id: string
  title: string
  description?: string
  status: 'PLANNING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELLED'
  clientId: string
  designerId?: string
  location?: string
  budget?: number
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

interface FurnitureItem {
  id: string
  name: string
  type: string
  category: string
  dimensions: string
  x: number
  y: number
  rotation: number
  locked: boolean
  color: string
}

interface Room {
  width: number
  height: number
  name: string
}

export default function LayoutPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string
  const [project, setProject] = useState<Project | null>(null)
  const [layout, setLayout] = useState<Layout | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedTool, setSelectedTool] = useState<'select' | 'move' | 'rotate' | 'scale'>('select')
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null)
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([])
  const [room, setRoom] = useState<Room>({ width: 600, height: 400, name: 'Living Room' })
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const { toast } = useToast()

  const furnitureLibrary = [
    { name: 'Sofa', type: 'sofa', category: 'Seating', dimensions: '80" x 35" x 32"', color: '#8B4513' },
    { name: 'Coffee Table', type: 'table', category: 'Tables', dimensions: '48" x 24" x 18"', color: '#654321' },
    { name: 'Armchair', type: 'chair', category: 'Seating', dimensions: '32" x 32" x 32"', color: '#A0522D' },
    { name: 'TV Stand', type: 'media', category: 'Storage', dimensions: '60" x 20" x 24"', color: '#2F4F4F' },
    { name: 'Bookshelf', type: 'storage', category: 'Storage', dimensions: '36" x 12" x 72"', color: '#8B4513' },
    { name: 'Dining Table', type: 'table', category: 'Tables', dimensions: '72" x 36" x 30"', color: '#654321' },
    { name: 'Dining Chair', type: 'chair', category: 'Seating', dimensions: '18" x 20" x 36"', color: '#A0522D' },
    { name: 'Bed', type: 'bed', category: 'Bedroom', dimensions: '76" x 80" x 24"', color: '#4682B4' },
    { name: 'Desk', type: 'desk', category: 'Office', dimensions: '60" x 30" x 30"', color: '#2F4F4F' },
    { name: 'Office Chair', type: 'chair', category: 'Office', dimensions: '24" x 24" x 36"', color: '#2F4F4F' }
  ]

  useEffect(() => {
    fetchProjectAndLayout()
  }, [projectId])

  const fetchProjectAndLayout = async () => {
    try {
      // Mock project data
      const mockProject: Project = {
        id: projectId,
        title: 'Modern Living Room',
        description: 'Complete renovation of living room with modern aesthetic',
        status: 'IN_PROGRESS',
        clientId: '1',
        location: 'New York, NY',
        budget: 15000,
        startDate: '2024-01-15',
        endDate: '2024-03-15',
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z'
      }
      setProject(mockProject)

      // Mock layout data
      const mockLayout: Layout = {
        id: '1',
        projectId: projectId,
        title: 'Living Room Layout',
        description: '2D space planning layout for modern living room',
        floorPlan: '/api/placeholder/800/600',
        dimensions: '15\' x 20\'',
        furniture: JSON.stringify([
          { id: '1', name: 'Sofa', type: 'sofa', category: 'Seating', dimensions: '80" x 35" x 32"', x: 100, y: 200, rotation: 0, locked: false, color: '#8B4513' },
          { id: '2', name: 'Coffee Table', type: 'table', category: 'Tables', dimensions: '48" x 24" x 18"', x: 200, y: 250, rotation: 0, locked: false, color: '#654321' },
          { id: '3', name: 'TV Stand', type: 'media', category: 'Storage', dimensions: '60" x 20" x 24"', x: 50, y: 100, rotation: 0, locked: false, color: '#2F4F4F' }
        ]),
        aiGenerated: true,
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z'
      }
      setLayout(mockLayout)

      // Parse furniture items
      const parsedFurniture = JSON.parse(mockLayout.furniture || '[]')
      setFurnitureItems(parsedFurniture)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project and layout data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateAILayout = async () => {
    setGenerating(true)
    
    try {
      // Simulate AI layout generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Generate AI-optimized furniture layout
      const aiFurniture: FurnitureItem[] = [
        { id: Date.now().toString() + '1', name: 'Sofa', type: 'sofa', category: 'Seating', dimensions: '80" x 35" x 32"', x: 150, y: 250, rotation: 0, locked: false, color: '#8B4513' },
        { id: Date.now().toString() + '2', name: 'Coffee Table', type: 'table', category: 'Tables', dimensions: '48" x 24" x 18"', x: 250, y: 300, rotation: 0, locked: false, color: '#654321' },
        { id: Date.now().toString() + '3', name: 'Armchair', type: 'chair', category: 'Seating', dimensions: '32" x 32" x 32"', x: 100, y: 300, rotation: 0, locked: false, color: '#A0522D' },
        { id: Date.now().toString() + '4', name: 'TV Stand', type: 'media', category: 'Storage', dimensions: '60" x 20" x 24"', x: 200, y: 100, rotation: 0, locked: false, color: '#2F4F4F' },
        { id: Date.now().toString() + '5', name: 'Bookshelf', type: 'storage', category: 'Storage', dimensions: '36" x 12" x 72"', x: 450, y: 150, rotation: 0, locked: false, color: '#8B4513' }
      ]
      
      setFurnitureItems(aiFurniture)
      
      toast({
        title: "Layout Generated!",
        description: "AI has created an optimized 2D layout for your space",
      })
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate layout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const addFurniture = (furnitureTemplate: typeof furnitureLibrary[0]) => {
    const newItem: FurnitureItem = {
      id: Date.now().toString(),
      name: furnitureTemplate.name,
      type: furnitureTemplate.type,
      category: furnitureTemplate.category,
      dimensions: furnitureTemplate.dimensions,
      x: room.width / 2 - 50,
      y: room.height / 2 - 50,
      rotation: 0,
      locked: false,
      color: furnitureTemplate.color
    }
    
    setFurnitureItems(prev => [...prev, newItem])
    setSelectedFurniture(newItem.id)
  }

  const removeFurniture = (itemId: string) => {
    setFurnitureItems(prev => prev.filter(item => item.id !== itemId))
    if (selectedFurniture === itemId) {
      setSelectedFurniture(null)
    }
  }

  const toggleLock = (itemId: string) => {
    setFurnitureItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, locked: !item.locked } : item
    ))
  }

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    // Check if clicking on furniture
    const clickedFurniture = furnitureItems.find(item => {
      return x >= item.x && x <= item.x + 100 && y >= item.y && y <= item.y + 60
    })

    if (clickedFurniture) {
      setSelectedFurniture(clickedFurniture.id)
      if (selectedTool === 'move' && !clickedFurniture.locked) {
        setIsDragging(true)
        setDragOffset({
          x: x - clickedFurniture.x,
          y: y - clickedFurniture.y
        })
      }
    } else {
      setSelectedFurniture(null)
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedFurniture) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    setFurnitureItems(prev => prev.map(item => 
      item.id === selectedFurniture ? { 
        ...item, 
        x: Math.max(0, Math.min(room.width - 100, x - dragOffset.x)),
        y: Math.max(0, Math.min(room.height - 60, y - dragOffset.y))
      } : item
    ))
  }

  const handleCanvasMouseUp = () => {
    setIsDragging(false)
  }

  const rotateFurniture = (itemId: string) => {
    setFurnitureItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, rotation: (item.rotation + 90) % 360 } : item
    ))
  }

  const saveLayout = async () => {
    try {
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedLayout = {
        ...layout,
        furniture: JSON.stringify(furnitureItems)
      }
      
      setLayout(updatedLayout)
      
      toast({
        title: "Layout saved!",
        description: "2D layout has been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save layout. Please try again.",
        variant: "destructive",
      })
    }
  }

  const exportLayout = () => {
    // In a real implementation, this would export as SVG or PDF
    toast({
      title: "Export started",
      description: "Layout export is being prepared",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading 2D layout...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Project Not Found</CardTitle>
            <CardDescription>The requested project could not be found</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedItem = furnitureItems.find(item => item.id === selectedFurniture)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Home className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-bold">AI Interior Designer</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Project Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
                <p className="text-muted-foreground">2D Space Planning & Layout</p>
              </div>
              <Badge className="bg-blue-500 text-white">
                {project.status.replace('_', ' ')}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {project.location}
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                ${project.budget?.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button onClick={generateAILayout} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Layout
                </>
              )}
            </Button>
            
            <Button onClick={saveLayout}>
              <Save className="w-4 h-4 mr-2" />
              Save Layout
            </Button>
            
            <Button variant="outline" onClick={exportLayout}>
              <Download className="w-4 h-4 mr-2" />
              Export Layout
            </Button>
            
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Layout Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tools Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tool Selection */}
                <div>
                  <Label className="text-sm font-medium">Tools</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      variant={selectedTool === 'select' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTool('select')}
                    >
                      <Cursor className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={selectedTool === 'move' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTool('move')}
                    >
                      <Move className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={selectedTool === 'rotate' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTool('rotate')}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={selectedTool === 'scale' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTool('scale')}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Zoom Controls */}
                <div>
                  <Label className="text-sm font-medium">Zoom</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-sm">{Math.round(scale * 100)}%</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setScale(Math.min(2, scale + 0.1))}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Furniture Library */}
                <div>
                  <Label className="text-sm font-medium">Furniture Library</Label>
                  <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                    {furnitureLibrary.map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left"
                        onClick={() => addFurniture(item)}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-xs">{item.name}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Canvas Area */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Layout Canvas</CardTitle>
                <CardDescription>
                  {room.name} - {Math.round(room.width / 12)}' x {Math.round(room.height / 12)}'
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden bg-gray-50">
                  <div
                    className="relative cursor-crosshair"
                    style={{ 
                      width: room.width * scale, 
                      height: room.height * scale,
                      backgroundImage: `
                        linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                  >
                    {/* Room boundaries */}
                    <div className="absolute inset-0 border-2 border-gray-400 pointer-events-none" />
                    
                    {/* Furniture items */}
                    {furnitureItems.map((item) => (
                      <div
                        key={item.id}
                        className={`absolute border-2 ${
                          selectedFurniture === item.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : item.locked 
                              ? 'border-gray-400 bg-gray-100' 
                              : 'border-gray-300 bg-white hover:border-gray-400'
                        } cursor-pointer transition-colors`}
                        style={{
                          left: item.x * scale,
                          top: item.y * scale,
                          width: 100 * scale,
                          height: 60 * scale,
                          transform: `rotate(${item.rotation}deg)`,
                          backgroundColor: item.color + '20'
                        }}
                        onClick={() => setSelectedFurniture(item.id)}
                      >
                        <div className="p-1 text-xs font-medium text-center">
                          {item.name}
                        </div>
                        {item.locked && (
                          <Lock className="w-3 h-3 absolute top-1 right-1 text-gray-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Properties Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedItem ? (
                  <>
                    <div>
                      <Label className="text-sm font-medium">Selected Item</Label>
                      <div className="mt-1 p-2 bg-gray-50 rounded">
                        <p className="font-medium text-sm">{selectedItem.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedItem.category}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Position</Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                          <Label className="text-xs">X</Label>
                          <Input
                            type="number"
                            value={Math.round(selectedItem.x)}
                            onChange={(e) => setFurnitureItems(prev => 
                              prev.map(item => item.id === selectedItem.id 
                                ? { ...item, x: parseInt(e.target.value) || 0 } 
                                : item
                              )
                            )}
                            className="text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Y</Label>
                          <Input
                            type="number"
                            value={Math.round(selectedItem.y)}
                            onChange={(e) => setFurnitureItems(prev => 
                              prev.map(item => item.id === selectedItem.id 
                                ? { ...item, y: parseInt(e.target.value) || 0 } 
                                : item
                              )
                            )}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Rotation</Label>
                      <Input
                        type="number"
                        value={selectedItem.rotation}
                        onChange={(e) => setFurnitureItems(prev => 
                          prev.map(item => item.id === selectedItem.id 
                            ? { ...item, rotation: parseInt(e.target.value) || 0 } 
                            : item
                          )
                        )}
                        className="text-xs"
                        min="0"
                        max="360"
                      />
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => rotateFurniture(selectedItem.id)}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Rotate 90°
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => toggleLock(selectedItem.id)}
                      >
                        {selectedItem.locked ? (
                          <>
                            <Unlock className="w-4 h-4 mr-2" />
                            Unlock
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Lock
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => removeFurniture(selectedItem.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p className="text-sm">Select an item to view properties</p>
                  </div>
                )}

                {/* Layout Statistics */}
                <div className="pt-4 border-t">
                  <Label className="text-sm font-medium">Layout Statistics</Label>
                  <div className="space-y-1 mt-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Total Items:</span>
                      <span>{furnitureItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Locked Items:</span>
                      <span>{furnitureItems.filter(item => item.locked).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Room Area:</span>
                      <span>{Math.round((room.width * room.height) / 144)} sq ft</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Layout Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium text-sm mb-1">Traffic Flow</h3>
                  <p className="text-xs text-muted-foreground">
                    Clear pathways maintained between furniture pieces for optimal movement
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium text-sm mb-1">Space Utilization</h3>
                  <p className="text-xs text-muted-foreground">
                    78% of floor space efficiently utilized with room for improvement
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium text-sm mb-1">Focal Points</h3>
                  <p className="text-xs text-muted-foreground">
                    TV area properly positioned as primary focal point of the room
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

// Cursor icon component
function Cursor(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
  )
}