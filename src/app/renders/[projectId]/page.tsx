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
  Cube,
  Box,
  View3D,
  Palette2,
  Sun,
  Moon,
  Lightbulb,
  Settings as SettingsIcon,
  Sliders,
  Crop,
  RotateCw as RotateIcon
} from 'lucide-react'

interface Render {
  id: string
  projectId: string
  title: string
  description?: string
  imageUrl?: string
  style?: string
  lighting?: string
  materials?: string
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

interface RenderSettings {
  style: string
  lighting: string
  timeOfDay: 'day' | 'night' | 'dusk' | 'dawn'
  cameraAngle: 'front' | 'corner' | 'overhead' | 'eye-level'
  quality: 'draft' | 'medium' | 'high' | 'ultra'
  materials: string[]
}

interface RenderVariant {
  id: string
  title: string
  description: string
  imageUrl: string
  settings: RenderSettings
  selected: boolean
}

export default function RendersPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string
  const [project, setProject] = useState<Project | null>(null)
  const [renders, setRenders] = useState<Render[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedRender, setSelectedRender] = useState<string | null>(null)
  const [renderSettings, setRenderSettings] = useState<RenderSettings>({
    style: 'modern',
    lighting: 'natural',
    timeOfDay: 'day',
    cameraAngle: 'corner',
    quality: 'high',
    materials: ['wood', 'metal', 'fabric']
  })
  const [variants, setVariants] = useState<RenderVariant[]>([])
  const { toast } = useToast()

  const styles = ['modern', 'contemporary', 'traditional', 'minimalist', 'scandinavian', 'industrial']
  const lightingOptions = ['natural', 'warm', 'cool', 'dramatic', 'soft']
  const materials = ['wood', 'metal', 'glass', 'fabric', 'stone', 'leather', 'marble']

  useEffect(() => {
    fetchProjectAndRenders()
  }, [projectId])

  const fetchProjectAndRenders = async () => {
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

      // Mock renders data
      const mockRenders: Render[] = [
        {
          id: '1',
          projectId: projectId,
          title: 'Modern Living Room - Day View',
          description: '3D render of modern living room with natural daylight',
          imageUrl: '/api/placeholder/800/600',
          style: 'modern',
          lighting: 'natural',
          materials: 'wood, metal, fabric',
          aiGenerated: true,
          createdAt: '2024-01-20T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z'
        },
        {
          id: '2',
          projectId: projectId,
          title: 'Modern Living Room - Night View',
          description: '3D render of modern living room with evening lighting',
          imageUrl: '/api/placeholder/800/600',
          style: 'modern',
          lighting: 'warm',
          materials: 'wood, metal, fabric',
          aiGenerated: true,
          createdAt: '2024-01-20T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z'
        }
      ]
      setRenders(mockRenders)

      // Mock variants
      const mockVariants: RenderVariant[] = [
        {
          id: '1',
          title: 'Corner View - Day',
          description: 'Corner angle with natural daylight',
          imageUrl: '/api/placeholder/800/600',
          settings: {
            style: 'modern',
            lighting: 'natural',
            timeOfDay: 'day',
            cameraAngle: 'corner',
            quality: 'high',
            materials: ['wood', 'metal', 'fabric']
          },
          selected: true
        },
        {
          id: '2',
          title: 'Front View - Evening',
          description: 'Front view with warm evening lighting',
          imageUrl: '/api/placeholder/800/600',
          settings: {
            style: 'modern',
            lighting: 'warm',
            timeOfDay: 'night',
            cameraAngle: 'front',
            quality: 'high',
            materials: ['wood', 'metal', 'fabric']
          },
          selected: false
        },
        {
          id: '3',
          title: 'Overhead View',
          description: 'Bird\'s eye view of the complete layout',
          imageUrl: '/api/placeholder/800/600',
          settings: {
            style: 'modern',
            lighting: 'natural',
            timeOfDay: 'day',
            cameraAngle: 'overhead',
            quality: 'high',
            materials: ['wood', 'metal', 'fabric']
          },
          selected: false
        }
      ]
      setVariants(mockVariants)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project and renders data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateAIRender = async () => {
    setGenerating(true)
    
    try {
      // Simulate AI render generation
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      // Generate new render
      const newRender: Render = {
        id: Date.now().toString(),
        projectId: projectId,
        title: `${renderSettings.style.charAt(0).toUpperCase() + renderSettings.style.slice(1)} Living Room - ${renderSettings.timeOfDay.charAt(0).toUpperCase() + renderSettings.timeOfDay.slice(1)}`,
        description: `AI-generated 3D render with ${renderSettings.lighting} lighting`,
        imageUrl: '/api/placeholder/800/600',
        style: renderSettings.style,
        lighting: renderSettings.lighting,
        materials: renderSettings.materials.join(', '),
        aiGenerated: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setRenders(prev => [...prev, newRender])
      setSelectedRender(newRender.id)
      
      toast({
        title: "Render Generated!",
        description: "AI has created a photorealistic 3D render of your space",
      })
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate render. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const generateVariant = async (baseSettings: Partial<RenderSettings>) => {
    setGenerating(true)
    
    try {
      // Simulate variant generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const variantSettings: RenderSettings = {
        ...renderSettings,
        ...baseSettings
      }
      
      const newVariant: RenderVariant = {
        id: Date.now().toString(),
        title: `${variantSettings.cameraAngle.charAt(0).toUpperCase() + variantSettings.cameraAngle.slice(1)} View - ${variantSettings.timeOfDay}`,
        description: `${variantSettings.lighting} lighting from ${variantSettings.cameraAngle} angle`,
        imageUrl: '/api/placeholder/800/600',
        settings: variantSettings,
        selected: false
      }
      
      setVariants(prev => [...prev, newVariant])
      
      toast({
        title: "Variant Created!",
        description: "New render variant has been generated",
      })
    } catch (error) {
      toast({
        title: "Variant generation failed",
        description: "Failed to generate variant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const deleteRender = (renderId: string) => {
    setRenders(prev => prev.filter(render => render.id !== renderId))
    if (selectedRender === renderId) {
      setSelectedRender(null)
    }
    toast({
      title: "Render deleted",
      description: "3D render has been removed",
    })
  }

  const downloadRender = (renderId: string) => {
    const render = renders.find(r => r.id === renderId)
    if (render) {
      toast({
        title: "Download started",
        description: `Downloading ${render.title}...`,
      })
    }
  }

  const updateRenderSettings = (key: keyof RenderSettings, value: any) => {
    setRenderSettings(prev => ({ ...prev, [key]: value }))
  }

  const toggleMaterial = (material: string) => {
    setRenderSettings(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading 3D renders...</p>
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
                <p className="text-muted-foreground">3D Renders & Visualization</p>
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
            <Button onClick={generateAIRender} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <View3D className="w-4 h-4 mr-2" />
                  Generate 3D Render
                </>
              )}
            </Button>
            
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Reference
            </Button>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
            
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share Gallery
            </Button>
          </div>

          {/* 3D Renders Content */}
          <Tabs defaultValue="renders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="renders">3D Renders</TabsTrigger>
              <TabsTrigger value="settings">Render Settings</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
            </TabsList>

            <TabsContent value="renders" className="space-y-6">
              {renders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {renders.map((render) => (
                    <Card key={render.id} className="relative group overflow-hidden">
                      <CardContent className="p-0">
                        <img
                          src={render.imageUrl}
                          alt={render.title}
                          className="w-full h-64 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold mb-1">{render.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{render.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="text-xs">
                                {render.style}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {render.lighting}
                              </Badge>
                            </div>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => downloadRender(render.id)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteRender(render.id)}
                                className="text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <View3D className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No 3D Renders Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Generate your first AI-powered 3D render to visualize your space
                    </p>
                    <Button onClick={generateAIRender} disabled={generating}>
                      {generating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <View3D className="w-4 h-4 mr-2" />
                          Generate 3D Render
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <SettingsIcon className="w-5 h-5 mr-2" />
                      Render Settings
                    </CardTitle>
                    <CardDescription>
                      Configure the appearance and quality of your 3D renders
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Style</Label>
                      <Select value={renderSettings.style} onValueChange={(value) => updateRenderSettings('style', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {styles.map(style => (
                            <SelectItem key={style} value={style}>
                              {style.charAt(0).toUpperCase() + style.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Lighting</Label>
                      <Select value={renderSettings.lighting} onValueChange={(value) => updateRenderSettings('lighting', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {lightingOptions.map(option => (
                            <SelectItem key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Time of Day</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'day', icon: Sun, label: 'Day' },
                          { value: 'night', icon: Moon, label: 'Night' },
                          { value: 'dusk', icon: Sun, label: 'Dusk' },
                          { value: 'dawn', icon: Sun, label: 'Dawn' }
                        ].map(({ value, icon: Icon, label }) => (
                          <Button
                            key={value}
                            variant={renderSettings.timeOfDay === value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateRenderSettings('timeOfDay', value)}
                            className="justify-start"
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Camera Angle</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'front', label: 'Front' },
                          { value: 'corner', label: 'Corner' },
                          { value: 'overhead', label: 'Overhead' },
                          { value: 'eye-level', label: 'Eye Level' }
                        ].map(({ value, label }) => (
                          <Button
                            key={value}
                            variant={renderSettings.cameraAngle === value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateRenderSettings('cameraAngle', value)}
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Quality</Label>
                      <Select value={renderSettings.quality} onValueChange={(value) => updateRenderSettings('quality', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft (Fast)</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="ultra">Ultra (Slow)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette2 className="w-5 h-5 mr-2" />
                      Materials
                    </CardTitle>
                    <CardDescription>
                      Select materials to include in your render
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {materials.map(material => (
                        <Button
                          key={material}
                          variant={renderSettings.materials.includes(material) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleMaterial(material)}
                          className="justify-start"
                        >
                          {material.charAt(0).toUpperCase() + material.slice(1)}
                        </Button>
                      ))}
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-medium text-sm mb-1">Current Selection</h3>
                        <div className="flex flex-wrap gap-1">
                          {renderSettings.materials.map(material => (
                            <Badge key={material} variant="secondary" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button onClick={generateAIRender} disabled={generating} className="w-full">
                        {generating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <View3D className="w-4 h-4 mr-2" />
                            Generate Render with Settings
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="variants" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Render Variants</CardTitle>
                  <CardDescription>
                    Different angles and lighting configurations of your design
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {variants.map((variant) => (
                      <Card key={variant.id} className={`relative overflow-hidden cursor-pointer transition-all ${
                        variant.selected ? 'ring-2 ring-primary' : ''
                      }`}>
                        <CardContent className="p-0">
                          <img
                            src={variant.imageUrl}
                            alt={variant.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-3">
                            <h3 className="font-medium text-sm mb-1">{variant.title}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{variant.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-1">
                                <Badge variant="outline" className="text-xs">
                                  {variant.settings.cameraAngle}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {variant.settings.timeOfDay}
                                </Badge>
                              </div>
                              {variant.selected && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Generate New Variants</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateVariant({ cameraAngle: 'front' })}
                        disabled={generating}
                      >
                        Front View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateVariant({ cameraAngle: 'corner' })}
                        disabled={generating}
                      >
                        Corner View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateVariant({ timeOfDay: 'night' })}
                        disabled={generating}
                      >
                        Night Scene
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateVariant({ timeOfDay: 'dusk' })}
                        disabled={generating}
                      >
                        Dusk Scene
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    AI Enhancement Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <h3 className="font-medium text-sm mb-1">Lighting Optimization</h3>
                      <p className="text-xs text-muted-foreground">
                        Add warm accent lighting to create ambiance in evening renders
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h3 className="font-medium text-sm mb-1">Material Enhancement</h3>
                      <p className="text-xs text-muted-foreground">
                        Consider adding texture maps for more realistic material appearance
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h3 className="font-medium text-sm mb-1">Camera Positioning</h3>
                      <p className="text-xs text-muted-foreground">
                        Try eye-level angles for more immersive and realistic views
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h3 className="font-medium text-sm mb-1">Post-Processing</h3>
                      <p className="text-xs text-muted-foreground">
                        Add subtle depth of field and color grading for professional look
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}