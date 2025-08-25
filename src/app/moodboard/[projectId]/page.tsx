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
  Shuffle
} from 'lucide-react'

interface MoodBoard {
  id: string
  projectId: string
  title: string
  description?: string
  images?: string
  style?: string
  colorPalette?: string
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

interface MoodBoardImage {
  id: string
  url: string
  title: string
  category: string
  style: string
  colors: string[]
  liked: boolean
  source?: string
}

interface ColorPalette {
  primary: string[]
  secondary: string[]
  accent: string[]
}

export default function MoodBoardPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string
  const [project, setProject] = useState<Project | null>(null)
  const [moodBoard, setMoodBoard] = useState<MoodBoard | null>(null)
  const [images, setImages] = useState<MoodBoardImage[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [colorPalette, setColorPalette] = useState<ColorPalette | null>(null)
  const { toast } = useToast()

  const styles = [
    'Modern', 'Contemporary', 'Traditional', 'Transitional', 'Minimalist',
    'Scandinavian', 'Industrial', 'Bohemian', 'Coastal', 'Farmhouse',
    'Mid-Century Modern', 'Art Deco', 'Rustic', 'Glam', 'Tropical'
  ]

  useEffect(() => {
    fetchProjectAndMoodBoard()
  }, [projectId])

  const fetchProjectAndMoodBoard = async () => {
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

      // Mock mood board data
      const mockMoodBoard: MoodBoard = {
        id: '1',
        projectId: projectId,
        title: 'Modern Living Room Mood Board',
        description: 'AI-generated mood board for modern living room design',
        images: '["/api/placeholder/300/400", "/api/placeholder/300/400", "/api/placeholder/300/400"]',
        style: 'Modern, Scandinavian',
        colorPalette: '{"primary":["#2C3E50","#34495E"],"secondary":["#ECF0F1","#BDC3C7"],"accent":["#E74C3C","#3498DB"]}',
        aiGenerated: true,
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z'
      }
      setMoodBoard(mockMoodBoard)

      // Mock images data
      const mockImages: MoodBoardImage[] = [
        {
          id: '1',
          url: '/api/placeholder/300/400',
          title: 'Modern Sofa',
          category: 'Furniture',
          style: 'Modern',
          colors: ['#2C3E50', '#ECF0F1'],
          liked: true,
          source: 'AI Generated'
        },
        {
          id: '2',
          url: '/api/placeholder/300/400',
          title: 'Abstract Wall Art',
          category: 'Decor',
          style: 'Modern',
          colors: ['#E74C3C', '#3498DB'],
          liked: false,
          source: 'AI Generated'
        },
        {
          id: '3',
          url: '/api/placeholder/300/400',
          title: 'Minimalist Coffee Table',
          category: 'Furniture',
          style: 'Scandinavian',
          colors: ['#34495E', '#ECF0F1'],
          liked: true,
          source: 'AI Generated'
        },
        {
          id: '4',
          url: '/api/placeholder/300/400',
          title: 'Geometric Rug',
          category: 'Flooring',
          style: 'Modern',
          colors: ['#2C3E50', '#BDC3C7'],
          liked: false,
          source: 'AI Generated'
        },
        {
          id: '5',
          url: '/api/placeholder/300/400',
          title: 'Floor Lamp',
          category: 'Lighting',
          style: 'Scandinavian',
          colors: ['#ECF0F1', '#34495E'],
          liked: true,
          source: 'AI Generated'
        },
        {
          id: '6',
          url: '/api/placeholder/300/400',
          title: 'Accent Chair',
          category: 'Furniture',
          style: 'Modern',
          colors: ['#E74C3C', '#ECF0F1'],
          liked: false,
          source: 'AI Generated'
        }
      ]
      setImages(mockImages)

      // Mock color palette
      const mockColorPalette: ColorPalette = {
        primary: ['#2C3E50', '#34495E'],
        secondary: ['#ECF0F1', '#BDC3C7'],
        accent: ['#E74C3C', '#3498DB']
      }
      setColorPalette(mockColorPalette)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project and mood board data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateAIMoodBoard = async () => {
    setGenerating(true)
    
    try {
      // Simulate AI mood board generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Generate new AI images
      const newImages: MoodBoardImage[] = Array.from({ length: 6 }, (_, index) => ({
        id: Date.now().toString() + index,
        url: '/api/placeholder/300/400',
        title: `AI Generated ${['Sofa', 'Art', 'Table', 'Rug', 'Lamp', 'Chair'][index]}`,
        category: ['Furniture', 'Decor', 'Lighting', 'Flooring'][index % 4],
        style: styles[Math.floor(Math.random() * styles.length)],
        colors: [
          `#${Math.floor(Math.random()*16777215).toString(16)}`,
          `#${Math.floor(Math.random()*16777215).toString(16)}`
        ],
        liked: false,
        source: 'AI Generated'
      }))

      setImages(prev => [...prev, ...newImages])
      
      // Update color palette
      const newColorPalette: ColorPalette = {
        primary: ['#2C3E50', '#34495E'],
        secondary: ['#ECF0F1', '#BDC3C7'],
        accent: ['#E74C3C', '#3498DB']
      }
      setColorPalette(newColorPalette)
      
      toast({
        title: "Mood Board Generated!",
        description: "AI has created a new mood board with curated images and color palette",
      })
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate mood board. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const toggleLike = (imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, liked: !img.liked } : img
    ))
  }

  const removeImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
    toast({
      title: "Image removed",
      description: "Image has been removed from the mood board",
    })
  }

  const filteredImages = selectedStyle === 'all' 
    ? images 
    : images.filter(img => img.style.toLowerCase() === selectedStyle.toLowerCase())

  const likedImages = images.filter(img => img.liked)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading mood board...</p>
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
                <p className="text-muted-foreground">Mood Board & Inspiration</p>
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
            <Button onClick={generateAIMoodBoard} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Mood Board
                </>
              )}
            </Button>
            
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Mood Board
            </Button>
            
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Mood Board Content */}
          <Tabs defaultValue="board" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="board">Mood Board</TabsTrigger>
              <TabsTrigger value="colors">Color Palette</TabsTrigger>
              <TabsTrigger value="inspiration">Inspiration</TabsTrigger>
            </TabsList>

            <TabsContent value="board" className="space-y-6">
              {/* Filters and Controls */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4" />
                        <Label>Style:</Label>
                        <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Styles</SelectItem>
                            {styles.map(style => (
                              <SelectItem key={style} value={style.toLowerCase()}>
                                {style}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Label>View:</Label>
                        <div className="flex space-x-1">
                          <Button
                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                          >
                            <Grid className="w-4 h-4" />
                          </Button>
                          <Button
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                          >
                            <List className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span>{filteredImages.length} images</span>
                      <Heart className="w-4 h-4 ml-4" />
                      <span>{likedImages.length} liked</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Images Grid */}
              {filteredImages.length > 0 ? (
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    : "space-y-4"
                }>
                  {filteredImages.map((image) => (
                    <Card key={image.id} className="relative group overflow-hidden">
                      <CardContent className="p-0">
                        <img
                          src={image.url}
                          alt={image.title}
                          className={
                            viewMode === 'grid'
                              ? "w-full h-48 object-cover"
                              : "w-full h-32 object-cover float-left mr-4"
                          }
                        />
                        <div className={
                          viewMode === 'grid'
                            ? "p-3"
                            : "p-3 overflow-hidden"
                        }>
                          <h3 className="font-medium text-sm mb-1">{image.title}</h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="text-xs">
                                {image.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {image.style}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleLike(image.id)}
                                className="p-1 h-auto"
                              >
                                <Heart 
                                  className={`w-4 h-4 ${image.liked ? 'fill-red-500 text-red-500' : ''}`} 
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeImage(image.id)}
                                className="p-1 h-auto text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Color Swatches */}
                          <div className="flex space-x-1 mt-2">
                            {image.colors.slice(0, 3).map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Images Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Generate your first AI mood board to get started
                    </p>
                    <Button onClick={generateAIMoodBoard} disabled={generating}>
                      {generating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Mood Board
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="colors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Color Palette
                  </CardTitle>
                  <CardDescription>
                    AI-generated color palette for your design project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {colorPalette ? (
                    <>
                      {/* Color Groups */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h3 className="font-medium mb-3">Primary Colors</h3>
                          <div className="space-y-3">
                            {colorPalette.primary.map((color, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <div
                                  className="w-12 h-12 rounded-lg border"
                                  style={{ backgroundColor: color }}
                                />
                                <div>
                                  <p className="text-sm font-medium">{color}</p>
                                  <p className="text-xs text-muted-foreground">Primary</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-3">Secondary Colors</h3>
                          <div className="space-y-3">
                            {colorPalette.secondary.map((color, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <div
                                  className="w-12 h-12 rounded-lg border"
                                  style={{ backgroundColor: color }}
                                />
                                <div>
                                  <p className="text-sm font-medium">{color}</p>
                                  <p className="text-xs text-muted-foreground">Secondary</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-3">Accent Colors</h3>
                          <div className="space-y-3">
                            {colorPalette.accent.map((color, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <div
                                  className="w-12 h-12 rounded-lg border"
                                  style={{ backgroundColor: color }}
                                />
                                <div>
                                  <p className="text-sm font-medium">{color}</p>
                                  <p className="text-xs text-muted-foreground">Accent</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Palette Preview */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Palette Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-24 rounded-lg flex">
                            {colorPalette.primary.map((color, index) => (
                              <div
                                key={index}
                                className="flex-1"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                            {colorPalette.secondary.map((color, index) => (
                              <div
                                key={index}
                                className="flex-1"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                            {colorPalette.accent.map((color, index) => (
                              <div
                                key={index}
                                className="flex-1"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button variant="outline">
                          <Shuffle className="w-4 h-4 mr-2" />
                          Generate New Palette
                        </Button>
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Export Colors
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Palette className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Color Palette Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Generate a mood board to create an AI-powered color palette
                      </p>
                      <Button onClick={generateAIMoodBoard} disabled={generating}>
                        {generating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Mood Board
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inspiration" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    AI Inspiration & Recommendations
                  </CardTitle>
                  <CardDescription>
                    Curated inspiration based on your style preferences and project requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Style Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recommended Styles</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Modern</span>
                            <Badge>95% Match</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Scandinavian</span>
                            <Badge>88% Match</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Minimalist</span>
                            <Badge>82% Match</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Key Elements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Clean lines and simple forms</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Neutral color palette with accents</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Natural materials and textures</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Functional and comfortable furniture</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Trending Ideas */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Trending for Your Style</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { title: 'Sustainable Materials', trend: '+45%' },
                          { title: 'Smart Home Integration', trend: '+38%' },
                          { title: 'Biophilic Design', trend: '+52%' }
                        ].map((item, index) => (
                          <div key={index} className="text-center p-4 border rounded-lg">
                            <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                            <Badge variant="secondary">{item.trend}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Next Steps */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button className="w-full justify-start">
                          <LayoutGrid className="w-4 h-4 mr-2" />
                          Create 2D Layout
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Calculator className="w-4 h-4 mr-2" />
                          Generate BOQ
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="w-4 h-4 mr-2" />
                          View Design Brief
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}