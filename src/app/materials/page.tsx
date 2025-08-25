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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { 
  Search, 
  Filter, 
  Plus, 
  Palette, 
  Sofa, 
  Lamp, 
  Table, 
  Chair, 
  Bed, 
  Cabinet,
  Tile,
  Wood,
  Fabric,
  Metal,
  Glass,
  Stone,
  Paint,
  Wallpaper,
  Ruler,
  DollarSign,
  Star,
  Heart,
  Share2,
  Download,
  Eye,
  Grid,
  List,
  SortAsc,
  SortDesc,
  X
} from 'lucide-react'

interface Material {
  id: string
  name: string
  category: string
  description?: string
  color?: string
  texture?: string
  price?: number
  unit: string
  imageUrl?: string
  supplier?: string
  sustainability?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

interface Furniture {
  id: string
  name: string
  category: string
  description?: string
  dimensions?: { width: number; height: number; depth: number }
  style?: string
  color?: string
  material?: string
  price?: number
  imageUrl?: string
  supplier?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [furniture, setFurniture] = useState<Furniture[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStyle, setSelectedStyle] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('materials')
  const { toast } = useToast()

  const materialCategories = ['flooring', 'wall', 'ceiling', 'countertop', 'backsplash', 'textile', 'paint', 'hardware']
  const furnitureCategories = ['seating', 'tables', 'storage', 'bedding', 'lighting', 'decor', 'outdoor']
  const styles = ['modern', 'contemporary', 'traditional', 'minimalist', 'scandinavian', 'industrial', 'bohemian']

  useEffect(() => {
    fetchLibraryData()
  }, [])

  const fetchLibraryData = async () => {
    try {
      // Fetch materials from API
      const materialsResponse = await fetch('/api/materials')
      let materialsData: Material[] = []
      
      if (materialsResponse.ok) {
        const materialsResult = await materialsResponse.json()
        materialsData = materialsResult.materials
      } else {
        // Fallback to mock materials data
        materialsData = [
          {
            id: '1',
            name: 'Oak Hardwood Flooring',
            category: 'flooring',
            description: 'Premium solid oak hardwood flooring with natural finish',
            color: '#8B4513',
            texture: 'smooth',
            price: 8.50,
            unit: 'sq ft',
            imageUrl: '/api/placeholder/300/200',
            supplier: 'WoodCraft Inc.',
            sustainability: 'FSC Certified',
            tags: ['hardwood', 'natural', 'durable'],
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z'
          },
          {
            id: '2',
            name: 'Marble Countertop',
            category: 'countertop',
            description: 'Carrara marble with elegant veining',
            color: '#F8F8FF',
            texture: 'polished',
            price: 85.00,
            unit: 'sq ft',
            imageUrl: '/api/placeholder/300/200',
            supplier: 'Stone Masters',
            sustainability: 'Natural Stone',
            tags: ['marble', 'luxury', 'classic'],
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z'
          },
          {
            id: '3',
            name: 'Velvet Upholstery Fabric',
            category: 'textile',
            description: 'Premium velvet fabric in deep emerald green',
            color: '#50C878',
            texture: 'velvet',
            price: 45.00,
            unit: 'yard',
            imageUrl: '/api/placeholder/300/200',
            supplier: 'Fabric House',
            sustainability: 'OEKO-TEX Certified',
            tags: ['velvet', 'upholstery', 'luxury'],
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z'
          }
        ]
      }

      // Fetch furniture from API
      const furnitureResponse = await fetch('/api/furniture')
      let furnitureData: Furniture[] = []
      
      if (furnitureResponse.ok) {
        const furnitureResult = await furnitureResponse.json()
        furnitureData = furnitureResult.furniture
      } else {
        // Fallback to mock furniture data
        furnitureData = [
          {
            id: '1',
            name: 'Modern Sectional Sofa',
            category: 'seating',
            description: 'Contemporary L-shaped sectional with clean lines',
            dimensions: { width: 120, height: 32, depth: 85 },
            style: 'modern',
            color: 'gray',
            material: 'fabric',
            price: 2499.00,
            imageUrl: '/api/placeholder/300/200',
            supplier: 'Modern Living',
            tags: ['sectional', 'modern', 'L-shaped'],
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z'
          },
          {
            id: '2',
            name: 'Scandinavian Dining Table',
            category: 'tables',
            description: 'Light oak dining table for 6 people',
            dimensions: { width: 72, height: 30, depth: 36 },
            style: 'scandinavian',
            color: 'light oak',
            material: 'wood',
            price: 1299.00,
            imageUrl: '/api/placeholder/300/200',
            supplier: 'Nordic Designs',
            tags: ['dining', 'scandinavian', 'oak'],
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z'
          },
          {
            id: '3',
            name: 'Industrial Floor Lamp',
            category: 'lighting',
            description: 'Metal floor lamp with adjustable arm',
            dimensions: { width: 12, height: 72, depth: 12 },
            style: 'industrial',
            color: 'black',
            material: 'metal',
            price: 299.00,
            imageUrl: '/api/placeholder/300/200',
            supplier: 'Light Works',
            tags: ['floor lamp', 'industrial', 'adjustable'],
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z'
          }
        ]
      }

      setMaterials(materialsData)
      setFurniture(furnitureData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load library data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredFurniture = furniture.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesStyle = selectedStyle === 'all' || item.style === selectedStyle
    return matchesSearch && matchesCategory && matchesStyle
  })

  const sortItems = <T extends Material | Furniture>(items: T[]): T[] => {
    return [...items].sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'price':
          const priceA = 'price' in a ? (a.price || 0) : 0
          const priceB = 'price' in b ? (b.price || 0) : 0
          comparison = priceA - priceB
          break
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }

  const addToProject = (item: Material | Furniture) => {
    toast({
      title: "Added to Project",
      description: `${item.name} has been added to your current project`,
    })
  }

  const toggleFavorite = (itemId: string) => {
    toast({
      title: "Favorite Updated",
      description: "Item has been added to your favorites",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading materials library...</p>
        </div>
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
              <Palette className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-bold">Materials & Furniture Library</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                    <DialogDescription>
                      Add a new material or furniture item to the library
                    </DialogDescription>
                  </DialogHeader>
                  <AddItemForm onSuccess={() => setIsAddDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search materials and furniture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {activeTab === 'materials' ? 
                    materialCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                    )) :
                    furnitureCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              {activeTab === 'furniture' && (
                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Styles</SelectItem>
                    {styles.map(style => (
                      <SelectItem key={style} value={style}>{style.charAt(0).toUpperCase() + style.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'price' | 'date')}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
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
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="furniture">Furniture</TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Materials Library</h2>
              <Badge variant="secondary">{filteredMaterials.length} items</Badge>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortItems(filteredMaterials).map((material) => (
                  <Card key={material.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <img
                        src={material.imageUrl}
                        alt={material.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-sm">{material.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(material.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {material.description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="text-xs">
                            {material.category}
                          </Badge>
                          {material.price && (
                            <span className="text-sm font-medium">
                              ${material.price.toFixed(2)}/{material.unit}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => addToProject(material)}
                          >
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
            ) : (
              <div className="space-y-4">
                {sortItems(filteredMaterials).map((material) => (
                  <Card key={material.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={material.imageUrl}
                          alt={material.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{material.name}</h3>
                              <p className="text-sm text-muted-foreground">{material.description}</p>
                            </div>
                            <div className="text-right">
                              {material.price && (
                                <p className="font-medium">${material.price.toFixed(2)}/{material.unit}</p>
                              )}
                              <Badge variant="outline" className="text-xs mt-1">
                                {material.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            {material.tags?.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm"
                            onClick={() => addToProject(material)}
                          >
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
            )}
          </TabsContent>

          <TabsContent value="furniture" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Furniture Library</h2>
              <Badge variant="secondary">{filteredFurniture.length} items</Badge>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortItems(filteredFurniture).map((item) => (
                  <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-sm">{item.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(item.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex space-x-1">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {item.style}
                            </Badge>
                          </div>
                          {item.price && (
                            <span className="text-sm font-medium">
                              ${item.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {item.dimensions && (
                          <p className="text-xs text-muted-foreground mb-3">
                            {item.dimensions.width}"W × {item.dimensions.height}"H × {item.dimensions.depth}"D
                          </p>
                        )}
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => addToProject(item)}
                          >
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
            ) : (
              <div className="space-y-4">
                {sortItems(filteredFurniture).map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <div className="text-right">
                              {item.price && (
                                <p className="font-medium">${item.price.toFixed(2)}</p>
                              )}
                              <div className="flex space-x-1 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {item.category}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {item.style}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          {item.dimensions && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Dimensions: {item.dimensions.width}"W × {item.dimensions.height}"H × {item.dimensions.depth}"D
                            </p>
                          )}
                          <div className="flex items-center space-x-2 mt-2">
                            {item.tags?.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm"
                            onClick={() => addToProject(item)}
                          >
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
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function AddItemForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [itemType, setItemType] = useState<'material' | 'furniture'>('material')
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    unit: 'sq ft',
    style: '',
    material: '',
    color: '',
    supplier: '',
    tags: ''
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Item Added!",
        description: "New item has been added to the library",
      })
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Item Type</Label>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant={itemType === 'material' ? 'default' : 'outline'}
            onClick={() => setItemType('material')}
            className="flex-1"
          >
            Material
          </Button>
          <Button
            type="button"
            variant={itemType === 'furniture' ? 'default' : 'outline'}
            onClick={() => setItemType('furniture')}
            className="flex-1"
          >
            Furniture
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Item name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {itemType === 'material' ? (
                <>
                  <SelectItem value="flooring">Flooring</SelectItem>
                  <SelectItem value="wall">Wall</SelectItem>
                  <SelectItem value="countertop">Countertop</SelectItem>
                  <SelectItem value="textile">Textile</SelectItem>
                  <SelectItem value="paint">Paint</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="seating">Seating</SelectItem>
                  <SelectItem value="tables">Tables</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                  <SelectItem value="lighting">Lighting</SelectItem>
                  <SelectItem value="decor">Decor</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Item description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      {itemType === 'material' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sq ft">sq ft</SelectItem>
                <SelectItem value="yard">yard</SelectItem>
                <SelectItem value="piece">piece</SelectItem>
                <SelectItem value="linear ft">linear ft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              placeholder="Color name or hex code"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </div>
        </div>
      )}

      {itemType === 'furniture' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <Select value={formData.style} onValueChange={(value) => setFormData({ ...formData, style: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="contemporary">Contemporary</SelectItem>
                <SelectItem value="traditional">Traditional</SelectItem>
                <SelectItem value="scandinavian">Scandinavian</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="material">Material</Label>
            <Input
              id="material"
              placeholder="Primary material"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier</Label>
          <Input
            id="supplier"
            placeholder="Supplier name"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          placeholder="tag1, tag2, tag3"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Item"}
      </Button>
    </form>
  )
}