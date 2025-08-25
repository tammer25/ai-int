'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { 
  Palette, 
  Sparkles, 
  Download, 
  Share2, 
  Heart, 
  Eye, 
  Copy,
  RefreshCw,
  Sliders,
  Lightbulb,
  Sun,
  Moon,
  Cloud,
  Leaf,
  Droplet,
  Zap,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  Minus,
  Grid3X3,
  LayoutGrid,
  List
} from 'lucide-react'

interface ColorPalette {
  id: string
  name: string
  description?: string
  colors: string[]
  style: string
  mood: string
  roomType: string
  aiGenerated: boolean
  createdAt: string
  updatedAt: string
}

interface MaterialSuggestion {
  id: string
  name: string
  category: string
  description?: string
  color: string
  texture: string
  price?: number
  unit: string
  imageUrl?: string
  supplier?: string
  sustainability?: string
  compatibilityScore: number
  recommendedUse: string
  alternatives: string[]
  createdAt: string
}

export default function PalettePage() {
  const [palettes, setPalettes] = useState<ColorPalette[]>([])
  const [suggestions, setSuggestions] = useState<MaterialSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null)
  const [projectContext, setProjectContext] = useState({
    roomType: 'living-room',
    style: 'modern',
    mood: 'calm',
    budget: 'medium',
    existingColors: '',
    preferences: ''
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { toast } = useToast()

  const roomTypes = ['living-room', 'bedroom', 'kitchen', 'bathroom', 'dining-room', 'office', 'entryway']
  const styles = ['modern', 'contemporary', 'traditional', 'minimalist', 'scandinavian', 'industrial', 'bohemian']
  const moods = ['calm', 'energetic', 'warm', 'cool', 'neutral', 'vibrant', 'earthy']
  const budgets = ['low', 'medium', 'high', 'luxury']

  useEffect(() => {
    fetchPaletteData()
  }, [])

  const fetchPaletteData = async () => {
    try {
      // Mock color palettes
      const mockPalettes: ColorPalette[] = [
        {
          id: '1',
          name: 'Serene Modern',
          description: 'A calming palette perfect for modern living spaces',
          colors: ['#F5F5F5', '#E8E8E8', '#D3D3D3', '#A9A9A9', '#696969'],
          style: 'modern',
          mood: 'calm',
          roomType: 'living-room',
          aiGenerated: true,
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'Warm Scandinavian',
          description: 'Cozy and inviting Scandinavian-inspired colors',
          colors: ['#FFF8DC', '#F5DEB3', '#DEB887', '#D2691E', '#8B4513'],
          style: 'scandinavian',
          mood: 'warm',
          roomType: 'bedroom',
          aiGenerated: true,
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '3',
          name: 'Industrial Edge',
          description: 'Bold and dramatic colors for industrial spaces',
          colors: ['#2F4F4F', '#696969', '#A9A9A9', '#C0C0C0', '#F5F5F5'],
          style: 'industrial',
          mood: 'cool',
          roomType: 'office',
          aiGenerated: true,
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        }
      ]

      // Mock material suggestions
      const mockSuggestions: MaterialSuggestion[] = [
        {
          id: '1',
          name: 'Soft Gray Wall Paint',
          category: 'paint',
          description: 'Premium matte finish paint with excellent coverage',
          color: '#D3D3D3',
          texture: 'matte',
          price: 45.00,
          unit: 'gallon',
          imageUrl: '/api/placeholder/200/200',
          supplier: 'Premium Paints Co.',
          sustainability: 'Low VOC',
          compatibilityScore: 95,
          recommendedUse: 'Accent walls or full room coverage',
          alternatives: ['Light Beige Paint', 'Soft White Paint'],
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'Natural Oak Flooring',
          category: 'flooring',
          description: 'Solid oak hardwood with natural finish',
          color: '#DEB887',
          texture: 'smooth',
          price: 8.50,
          unit: 'sq ft',
          imageUrl: '/api/placeholder/200/200',
          supplier: 'WoodCraft Inc.',
          sustainability: 'FSC Certified',
          compatibilityScore: 92,
          recommendedUse: 'Main flooring in living areas',
          alternatives: ['Engineered Oak', 'Laminate Wood'],
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '3',
          name: 'Velvet Upholstery Fabric',
          category: 'textile',
          description: 'Luxurious velvet in deep charcoal gray',
          color: '#696969',
          texture: 'velvet',
          price: 65.00,
          unit: 'yard',
          imageUrl: '/api/placeholder/200/200',
          supplier: 'Fabric House',
          sustainability: 'OEKO-TEX Certified',
          compatibilityScore: 88,
          recommendedUse: 'Upholstery for sofas and chairs',
          alternatives: ['Linen Blend', 'Cotton Velvet'],
          createdAt: '2024-01-15T00:00:00Z'
        }
      ]

      setPalettes(mockPalettes)
      setSuggestions(mockSuggestions)
      setSelectedPalette(mockPalettes[0].id)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load palette data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateAIPalette = async () => {
    setGenerating(true)
    
    try {
      // Simulate AI palette generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const newPalette: ColorPalette = {
        id: Date.now().toString(),
        name: `AI ${projectContext.style.charAt(0).toUpperCase() + projectContext.style.slice(1)} ${projectContext.mood.charAt(0).toUpperCase() + projectContext.mood.slice(1)}`,
        description: `AI-generated palette for ${projectContext.roomType.replace('-', ' ')} with ${projectContext.mood} mood`,
        colors: generateColorsForContext(projectContext),
        style: projectContext.style,
        mood: projectContext.mood,
        roomType: projectContext.roomType,
        aiGenerated: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setPalettes(prev => [newPalette, ...prev])
      setSelectedPalette(newPalette.id)
      
      toast({
        title: "Palette Generated!",
        description: "AI has created a custom color palette for your project",
      })
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate palette. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const generateColorsForContext = (context: any): string[] => {
    // Mock color generation based on context
    const colorSets = {
      'modern-calm': ['#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA', '#ADB5BD'],
      'scandinavian-warm': ['#FFF8DC', '#F5DEB3', '#DEB887', '#D2691E', '#CD853F'],
      'industrial-cool': ['#2F4F4F', '#696969', '#A9A9A9', '#C0C0C0', '#D3D3D3'],
      'traditional-neutral': ['#F5F5DC', '#F0E68C', '#DAA520', '#B8860B', '#8B7355'],
      'minimalist-clean': ['#FFFFFF', '#F8F8FF', '#F0F8FF', '#E6E6FA', '#D8BFD8']
    }
    
    const key = `${context.style}-${context.mood}`
    return colorSets[key as keyof typeof colorSets] || colorSets['modern-calm']
  }

  const generateMaterialSuggestions = async () => {
    setGenerating(true)
    
    try {
      // Simulate AI material suggestions
      await new Promise(resolve => setTimeout(resolve, 4000))
      
      const newSuggestions: MaterialSuggestion[] = [
        {
          id: Date.now().toString(),
          name: 'AI-Suggested Wall Color',
          category: 'paint',
          description: 'Perfect match for your color palette',
          color: palettes.find(p => p.id === selectedPalette)?.colors[0] || '#F5F5F5',
          texture: 'matte',
          price: 42.00,
          unit: 'gallon',
          imageUrl: '/api/placeholder/200/200',
          supplier: 'AI Paint Solutions',
          sustainability: 'Eco-friendly',
          compatibilityScore: 98,
          recommendedUse: 'Primary wall color',
          alternatives: ['Slightly lighter shade', 'Complementary accent'],
          createdAt: new Date().toISOString()
        }
      ]
      
      setSuggestions(prev => [...newSuggestions, ...prev])
      
      toast({
        title: "Materials Suggested!",
        description: "AI has recommended materials based on your palette",
      })
    } catch (error) {
      toast({
        title: "Suggestion failed",
        description: "Failed to generate material suggestions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Color code copied to clipboard",
    })
  }

  const downloadPalette = (paletteId: string) => {
    const palette = palettes.find(p => p.id === paletteId)
    if (palette) {
      toast({
        title: "Download Started",
        description: `Downloading ${palette.name} palette...`,
      })
    }
  }

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading color palettes...</p>
        </div>
      </div>
    )
  }

  const selectedPaletteData = palettes.find(p => p.id === selectedPalette)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Palette className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-bold">AI Color & Material Suggestions</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="palettes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="palettes">Color Palettes</TabsTrigger>
            <TabsTrigger value="materials">Material Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="palettes" className="space-y-6">
            {/* Project Context */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sliders className="w-5 h-5 mr-2" />
                  Project Context
                </CardTitle>
                <CardDescription>
                  Tell us about your project to get personalized color suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomType">Room Type</Label>
                    <Select value={projectContext.roomType} onValueChange={(value) => setProjectContext({ ...projectContext, roomType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="style">Style</Label>
                    <Select value={projectContext.style} onValueChange={(value) => setProjectContext({ ...projectContext, style: value })}>
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
                    <Label htmlFor="mood">Mood</Label>
                    <Select value={projectContext.mood} onValueChange={(value) => setProjectContext({ ...projectContext, mood: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {moods.map(mood => (
                          <SelectItem key={mood} value={mood}>
                            {mood.charAt(0).toUpperCase() + mood.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Label htmlFor="existingColors">Existing Colors (optional)</Label>
                  <Input
                    id="existingColors"
                    placeholder="e.g., #FFFFFF, #F0F0F0, #E0E0E0"
                    value={projectContext.existingColors}
                    onChange={(e) => setProjectContext({ ...projectContext, existingColors: e.target.value })}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <Label htmlFor="preferences">Preferences (optional)</Label>
                  <Textarea
                    id="preferences"
                    placeholder="Any specific color preferences or requirements..."
                    value={projectContext.preferences}
                    onChange={(e) => setProjectContext({ ...projectContext, preferences: e.target.value })}
                  />
                </div>
                <div className="mt-6">
                  <Button onClick={generateAIPalette} disabled={generating}>
                    {generating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate AI Palette
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Color Palettes Grid */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Color Palettes</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{palettes.length} palettes</Badge>
                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {palettes.map((palette) => (
                    <Card key={palette.id} className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer ${selectedPalette === palette.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedPalette(palette.id)}>
                      <CardContent className="p-0">
                        {/* Color swatches */}
                        <div className="flex h-32">
                          {palette.colors.map((color, index) => (
                            <div
                              key={index}
                              className="flex-1 relative group"
                              style={{ backgroundColor: color }}
                            >
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(color)
                                  }}
                                >
                                  <Copy className="w-4 h-4 text-white" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{palette.name}</h3>
                              <p className="text-sm text-muted-foreground">{palette.description}</p>
                            </div>
                            {palette.aiGenerated && (
                              <Badge variant="secondary" className="text-xs">
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-1">
                              <Badge variant="outline" className="text-xs">
                                {palette.style}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {palette.mood}
                              </Badge>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  downloadPalette(palette.id)
                                }}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Toggle favorite
                                }}
                              >
                                <Heart className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {palettes.map((palette) => (
                    <Card key={palette.id} className={`hover:shadow-lg transition-all cursor-pointer ${selectedPalette === palette.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedPalette(palette.id)}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex h-20 w-40 rounded-md overflow-hidden border">
                            {palette.colors.map((color, index) => (
                              <div
                                key={index}
                                className="flex-1"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{palette.name}</h3>
                                <p className="text-sm text-muted-foreground">{palette.description}</p>
                              </div>
                              {palette.aiGenerated && (
                                <Badge variant="secondary" className="text-xs">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {palette.style}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {palette.mood}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {palette.roomType.replace('-', ' ')}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                downloadPalette(palette.id)
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                // Toggle favorite
                              }}
                            >
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Palette Details */}
            {selectedPaletteData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    {selectedPaletteData.name} - Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Color Swatches</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {selectedPaletteData.colors.map((color, index) => (
                          <div key={index} className="text-center">
                            <div
                              className="w-full h-24 rounded-lg mb-2 border"
                              style={{ backgroundColor: color }}
                            />
                            <p className="text-sm font-mono">{color}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-1"
                              onClick={() => copyToClipboard(color)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">AI Recommendations</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">Primary Wall Color</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Use {selectedPaletteData.colors[0]} for main walls to create a {selectedPaletteData.mood} atmosphere
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Zap className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">Accent Colors</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {selectedPaletteData.colors[3]} and {selectedPaletteData.colors[4]} work well for accent walls or trim
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={generateMaterialSuggestions} disabled={generating}>
                        {generating ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Finding Materials...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Find Matching Materials
                          </>
                        )}
                      </Button>
                      <Button variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Palette
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="materials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Material Suggestions</h2>
              <Badge variant="secondary">{suggestions.length} suggestions</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <img
                      src={suggestion.imageUrl}
                      alt={suggestion.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{suggestion.name}</h3>
                          <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${getCompatibilityColor(suggestion.compatibilityScore)}`}>
                            {suggestion.compatibilityScore}% match
                          </div>
                          {suggestion.compatibilityScore >= 90 && (
                            <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: suggestion.color }}
                        />
                        <span className="text-sm font-mono">{suggestion.color}</span>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.category}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Texture:</span>
                          <span>{suggestion.texture}</span>
                        </div>
                        {suggestion.price && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Price:</span>
                            <span>${suggestion.price.toFixed(2)}/{suggestion.unit}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Supplier:</span>
                          <span>{suggestion.supplier}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium mb-1">Recommended Use:</p>
                        <p className="text-xs text-muted-foreground">{suggestion.recommendedUse}</p>
                      </div>

                      {suggestion.alternatives.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-1">Alternatives:</p>
                          <div className="flex flex-wrap gap-1">
                            {suggestion.alternatives.map((alt, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {alt}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          Add to Project
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}