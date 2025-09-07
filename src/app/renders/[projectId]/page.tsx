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
  RectangleHorizontal,
  Cube, // Use Cube as replacement for View3D
  Box,
  Sun,
  Moon,
  Lightbulb,
  Settings as SettingsIcon,
  Sliders,
  Crop,
  RotateCw as RotateIcon
} from 'lucide-react'

interface PageProps {
  params: {
    projectId: string
  }
}

export default function RendersPage({ params }: PageProps) {
  const { projectId } = params
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<any>(null)
  const [renders, setRenders] = useState<any[]>([])
  const [selectedRender, setSelectedRender] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('gallery')

  useEffect(() => {
    // Simulate loading project data
    const loadProject = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would fetch from an API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setProject({
          id: projectId,
          name: `Project ${projectId}`,
          status: 'In Progress',
          description: 'AI-powered interior design renders'
        })
        
        setRenders([
          {
            id: '1',
            name: 'Living Room Concept A',
            style: 'Modern',
            status: 'Complete',
            thumbnail: '/api/placeholder/300/200',
            createdAt: new Date().toISOString()
          },
          {
            id: '2', 
            name: 'Kitchen Design',
            style: 'Contemporary',
            status: 'Processing',
            thumbnail: '/api/placeholder/300/200',
            createdAt: new Date().toISOString()
          }
        ])
        
      } catch (error) {
        console.error('Failed to load project:', error)
        toast({
          title: 'Error',
          description: 'Failed to load project data',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      loadProject()
    }
  }, [projectId, toast])

  const handleGenerateRender = () => {
    toast({
      title: 'Render Started',
      description: 'Your new render is being generated...'
    })
  }

  const handleDownloadRender = (renderId: string) => {
    toast({
      title: 'Download Started',
      description: `Downloading render ${renderId}...`
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading project renders...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested project could not be found.</p>
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={project.status === 'Complete' ? 'default' : 'secondary'}>
            {project.status}
          </Badge>
          <Button onClick={handleGenerateRender}>
            <Plus className="h-4 w-4 mr-2" />
            Generate New Render
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gallery">
            <Grid className="h-4 w-4 mr-2" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-6">
          {renders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Renders Yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Generate your first AI-powered interior design render to get started.
                </p>
                <Button onClick={handleGenerateRender}>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate First Render
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renders.map((render) => (
                <Card key={render.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    <img 
                      src={render.thumbnail} 
                      alt={render.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={render.status === 'Complete' ? 'default' : 'secondary'}>
                        {render.status}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{render.name}</CardTitle>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDownloadRender(render.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      Style: {render.style} • Created {new Date(render.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Render Settings</CardTitle>
              <CardDescription>
                Configure default settings for new renders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="style">Default Style</Label>
                  <Select defaultValue="modern">
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="contemporary">Contemporary</SelectItem>
                      <SelectItem value="traditional">Traditional</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quality">Render Quality</Label>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="ultra">Ultra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Describe your interior design project..."
                  defaultValue={project.description}
                />
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project History</CardTitle>
              <CardDescription>
                View all activities and changes for this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {renders.map((render, index) => (
                  <div key={render.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        Render "{render.name}" {render.status.toLowerCase()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(render.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {render.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
