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
  Package,
  ShoppingCart,
  Percent,
  TrendingDown,
  TrendingUp as TrendingUpIcon,
  Info,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'

interface BOQ {
  id: string
  projectId: string
  title: string
  description?: string
  items?: string
  totalCost?: number
  currency: string
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

interface BOQItem {
  id: string
  category: string
  name: string
  description: string
  unit: string
  quantity: number
  unitPrice: number
  totalPrice: number
  supplier?: string
  priority: 'essential' | 'recommended' | 'optional'
  alternatives?: BOQItem[]
  notes?: string
}

interface BudgetBreakdown {
  category: string
  amount: number
  percentage: number
  color: string
}

export default function BOQPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string
  const [project, setProject] = useState<Project | null>(null)
  const [boq, setBOQ] = useState<BOQ | null>(null)
  const [boqItems, setBOQItems] = useState<BOQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const { toast } = useToast()

  const categories = [
    'all', 'furniture', 'lighting', 'flooring', 'paint', 'accessories', 'labor', 'contingency'
  ]

  useEffect(() => {
    fetchProjectAndBOQ()
  }, [projectId])

  const fetchProjectAndBOQ = async () => {
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

      // Mock BOQ data
      const mockBOQ: BOQ = {
        id: '1',
        projectId: projectId,
        title: 'Living Room Bill of Quantities',
        description: 'Comprehensive BOQ for modern living room renovation',
        items: JSON.stringify([
          {
            id: '1',
            category: 'furniture',
            name: 'Modern Sofa',
            description: '3-seater modern sofa with premium fabric',
            unit: 'piece',
            quantity: 1,
            unitPrice: 2500,
            totalPrice: 2500,
            supplier: 'Furniture Store A',
            priority: 'essential',
            notes: 'Client preferred navy blue color'
          },
          {
            id: '2',
            category: 'furniture',
            name: 'Coffee Table',
            description: 'Glass top coffee table with metal base',
            unit: 'piece',
            quantity: 1,
            unitPrice: 800,
            totalPrice: 800,
            supplier: 'Furniture Store B',
            priority: 'essential'
          },
          {
            id: '3',
            category: 'lighting',
            name: 'LED Ceiling Lights',
            description: 'Dimmable LED ceiling light fixtures',
            unit: 'set',
            quantity: 1,
            unitPrice: 600,
            totalPrice: 600,
            supplier: 'Lighting Co',
            priority: 'recommended'
          },
          {
            id: '4',
            category: 'flooring',
            name: 'Hardwood Flooring',
            description: 'Engineered hardwood flooring, installation included',
            unit: 'sq ft',
            quantity: 300,
            unitPrice: 8,
            totalPrice: 2400,
            supplier: 'Flooring Experts',
            priority: 'essential'
          },
          {
            id: '5',
            category: 'paint',
            name: 'Premium Paint',
            description: 'High-quality interior paint, labor included',
            unit: 'gallon',
            quantity: 5,
            unitPrice: 65,
            totalPrice: 325,
            supplier: 'Paint Store',
            priority: 'essential'
          }
        ]),
        totalCost: 6625,
        currency: 'USD',
        aiGenerated: true,
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z'
      }
      setBOQ(mockBOQ)

      // Parse BOQ items
      const parsedItems = JSON.parse(mockBOQ.items || '[]')
      setBOQItems(parsedItems)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project and BOQ data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateAIBOQ = async () => {
    setGenerating(true)
    
    try {
      // Simulate AI BOQ generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Generate AI-optimized BOQ items
      const aiBOQItems: BOQItem[] = [
        {
          id: Date.now().toString() + '1',
          category: 'furniture',
          name: 'Modern Sectional Sofa',
          description: 'L-shaped sectional sofa with storage, premium fabric',
          unit: 'piece',
          quantity: 1,
          unitPrice: 3200,
          totalPrice: 3200,
          supplier: 'Premium Furniture',
          priority: 'essential',
          alternatives: [
            {
              id: 'alt1',
              category: 'furniture',
              name: 'Standard Sofa',
              description: '3-seater sofa, good quality fabric',
              unit: 'piece',
              quantity: 1,
              unitPrice: 2200,
              totalPrice: 2200,
              priority: 'recommended'
            }
          ]
        },
        {
          id: Date.now().toString() + '2',
          category: 'furniture',
          name: 'Media Console',
          description: 'Modern media console with cable management',
          unit: 'piece',
          quantity: 1,
          unitPrice: 950,
          totalPrice: 950,
          supplier: 'Furniture Store A',
          priority: 'essential'
        },
        {
          id: Date.now().toString() + '3',
          category: 'lighting',
          name: 'Smart Lighting System',
          description: 'WiFi-enabled smart bulbs and dimmer switches',
          unit: 'set',
          quantity: 1,
          unitPrice: 450,
          totalPrice: 450,
          supplier: 'Smart Home Co',
          priority: 'recommended'
        },
        {
          id: Date.now().toString() + '4',
          category: 'flooring',
          name: 'Luxury Vinyl Plank',
          description: 'Waterproof luxury vinyl plank flooring',
          unit: 'sq ft',
            quantity: 300,
          unitPrice: 6.50,
          totalPrice: 1950,
          supplier: 'Flooring Pros',
          priority: 'essential'
        },
        {
          id: Date.now().toString() + '5',
          category: 'paint',
          name: 'Designer Paint Collection',
          description: 'Premium designer paint with primer included',
          unit: 'gallon',
          quantity: 4,
          unitPrice: 85,
          totalPrice: 340,
          supplier: 'Paint Boutique',
          priority: 'essential'
        },
        {
          id: Date.now().toString() + '6',
          category: 'accessories',
          name: 'Window Treatments',
          description: 'Custom curtains and hardware',
          unit: 'set',
          quantity: 2,
          unitPrice: 400,
          totalPrice: 800,
          supplier: 'Window Decor',
          priority: 'recommended'
        },
        {
          id: Date.now().toString() + '7',
          category: 'labor',
          name: 'Installation Labor',
          description: 'Professional installation for all items',
          unit: 'hour',
          quantity: 40,
          unitPrice: 75,
          totalPrice: 3000,
          supplier: 'General Contractor',
          priority: 'essential'
        },
        {
          id: Date.now().toString() + '8',
          category: 'contingency',
          name: 'Contingency Fund',
          description: '10% contingency for unexpected costs',
          unit: 'lump sum',
          quantity: 1,
          unitPrice: 1069,
          totalPrice: 1069,
          priority: 'essential'
        }
      ]
      
      setBOQItems(aiBOQItems)
      
      // Update BOQ with new total
      const totalCost = aiBOQItems.reduce((sum, item) => sum + item.totalPrice, 0)
      const updatedBOQ = {
        ...boq!,
        totalCost,
        items: JSON.stringify(aiBOQItems)
      }
      setBOQ(updatedBOQ)
      
      toast({
        title: "BOQ Generated!",
        description: "AI has created a comprehensive bill of quantities with cost optimization",
      })
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate BOQ. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const filteredItems = selectedCategory === 'all' 
    ? boqItems 
    : boqItems.filter(item => item.category === selectedCategory)

  const totalCost = boqItems.reduce((sum, item) => sum + item.totalPrice, 0)
  const budgetUtilization = project?.budget ? (totalCost / project.budget) * 100 : 0

  const budgetBreakdown: BudgetBreakdown[] = [
    { category: 'Furniture', amount: 4150, percentage: 38, color: '#3B82F6' },
    { category: 'Lighting', amount: 450, percentage: 4, color: '#F59E0B' },
    { category: 'Flooring', amount: 1950, percentage: 18, color: '#10B981' },
    { category: 'Paint', amount: 340, percentage: 3, color: '#EF4444' },
    { category: 'Accessories', amount: 800, percentage: 7, color: '#8B5CF6' },
    { category: 'Labor', amount: 3000, percentage: 28, color: '#F97316' },
    { category: 'Contingency', amount: 1069, percentage: 10, color: '#6B7280' }
  ]

  const updateItemPrice = (itemId: string, newPrice: number) => {
    setBOQItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, unitPrice: newPrice, totalPrice: newPrice * item.quantity }
        return updatedItem
      }
      return item
    }))
  }

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    setBOQItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice }
        return updatedItem
      }
      return item
    }))
  }

  const saveBOQ = async () => {
    try {
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedBOQ = {
        ...boq!,
        items: JSON.stringify(boqItems),
        totalCost
      }
      
      setBOQ(updatedBOQ)
      
      toast({
        title: "BOQ saved!",
        description: "Bill of quantities has been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save BOQ. Please try again.",
        variant: "destructive",
      })
    }
  }

  const exportBOQ = () => {
    // In a real implementation, this would export as Excel or PDF
    toast({
      title: "Export started",
      description: "BOQ export is being prepared",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'essential': return 'bg-red-100 text-red-800 border-red-200'
      case 'recommended': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'optional': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading bill of quantities...</p>
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
                <p className="text-muted-foreground">Bill of Quantities & Cost Estimation</p>
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

          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {project.budget && (
                    <span className={budgetUtilization > 100 ? 'text-red-500' : 'text-green-500'}>
                      {budgetUtilization.toFixed(1)}% of budget
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${project.budget ? Math.max(0, project.budget - totalCost).toLocaleString() : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {project.budget && budgetUtilization > 100 && (
                    <span className="text-red-500">Over budget</span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{boqItems.length}</div>
                <p className="text-xs text-muted-foreground">
                  {boqItems.filter(item => item.priority === 'essential').length} essential
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Optimized</CardTitle>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {boq?.aiGenerated ? 'Yes' : 'No'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Cost-optimized recommendations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button onClick={generateAIBOQ} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI BOQ
                </>
              )}
            </Button>
            
            <Button onClick={saveBOQ}>
              <Save className="w-4 h-4 mr-2" />
              Save BOQ
            </Button>
            
            <Button variant="outline" onClick={exportBOQ}>
              <Download className="w-4 h-4 mr-2" />
              Export BOQ
            </Button>
            
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* BOQ Content */}
          <Tabs defaultValue="items" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="items">Items List</TabsTrigger>
              <TabsTrigger value="breakdown">Budget Breakdown</TabsTrigger>
              <TabsTrigger value="optimization">Cost Optimization</TabsTrigger>
              <TabsTrigger value="timeline">Procurement Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="space-y-6">
              {/* Category Filter */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <Label>Filter by Category:</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* BOQ Items Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Bill of Quantities Items</CardTitle>
                  <CardDescription>
                    Detailed breakdown of all materials, labor, and costs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium">{item.name}</h3>
                              <Badge className={getPriorityColor(item.priority)}>
                                {item.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>Supplier: {item.supplier || 'TBD'}</span>
                              <span>Unit: {item.unit}</span>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="text-lg font-semibold">${item.totalPrice.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">
                              ${item.unitPrice} × {item.quantity}
                            </div>
                          </div>
                        </div>
                        
                        {/* Editable Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t">
                          <div>
                            <Label className="text-xs">Quantity</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Unit Price ($)</Label>
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                              className="text-sm"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Total Price ($)</Label>
                            <div className="text-sm font-medium p-2 bg-gray-50 rounded">
                              ${item.totalPrice.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Alternatives */}
                        {item.alternatives && item.alternatives.length > 0 && (
                          <div className="pt-3 border-t">
                            <Label className="text-xs font-medium mb-2">Alternatives:</Label>
                            <div className="space-y-2">
                              {item.alternatives.map((alt, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
                                  <div>
                                    <span className="text-sm font-medium">{alt.name}</span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      ${alt.unitPrice} × {alt.quantity} = ${alt.totalPrice}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className="text-xs">
                                      Save ${(item.totalPrice - alt.totalPrice).toLocaleString()}
                                    </Badge>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        // Replace item with alternative
                                        const replacement = { ...item, ...alt }
                                        setBOQItems(prev => prev.map(i => i.id === item.id ? replacement : i))
                                      }}
                                    >
                                      Use Alternative
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="breakdown" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Budget Breakdown by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {budgetBreakdown.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{item.category}</span>
                            <span className="text-sm">${item.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={item.percentage} className="flex-1" />
                            <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Budget vs Actual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Original Budget</span>
                        <span className="text-sm">${project.budget?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Estimated Cost</span>
                        <span className="text-sm">${totalCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center font-medium">
                        <span>Difference</span>
                        <span className={budgetUtilization > 100 ? 'text-red-500' : 'text-green-500'}>
                          {project.budget ? (project.budget - totalCost).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      
                      {project.budget && (
                        <div className="pt-4 border-t">
                          <div className="text-center">
                            <div className="text-2xl font-bold mb-2">
                              {budgetUtilization.toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Budget Utilization
                            </div>
                            {budgetUtilization > 100 ? (
                              <div className="flex items-center justify-center text-red-500 mt-2">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                Over Budget
                              </div>
                            ) : (
                              <div className="flex items-center justify-center text-green-500 mt-2">
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Within Budget
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingDown className="w-5 h-5 mr-2" />
                    AI Cost Optimization Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Percent className="w-5 h-5 text-green-500" />
                          <h3 className="font-medium">Bulk Purchase Savings</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Buy paint and flooring together to save 15%
                        </p>
                        <div className="text-sm font-medium text-green-600">
                          Potential savings: $412
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <ShoppingCart className="w-5 h-5 text-blue-500" />
                          <h3 className="font-medium">Alternative Suppliers</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Consider alternative lighting supplier for better pricing
                        </p>
                        <div className="text-sm font-medium text-blue-600">
                          Potential savings: $150
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Package className="w-5 h-5 text-purple-500" />
                          <h3 className="font-medium">Material Substitution</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Luxury vinyl plank instead of hardwood - similar look, lower cost
                        </p>
                        <div className="text-sm font-medium text-purple-600">
                          Potential savings: $450
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-5 h-5 text-orange-500" />
                          <h3 className="font-medium">Off-Season Purchases</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Purchase furniture during holiday sales for additional discounts
                        </p>
                        <div className="text-sm font-medium text-orange-600">
                          Potential savings: $320
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Info className="w-5 h-5 text-blue-500" />
                      <h3 className="font-medium">Total Potential Savings</h3>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      $1,332
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Apply these optimizations to reduce total cost from ${totalCost.toLocaleString()} to ${(totalCost - 1332).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Procurement Timeline</CardTitle>
                  <CardDescription>
                    Recommended timeline for purchasing and installing items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm font-medium mb-2">Week 1-2</div>
                        <div className="space-y-1 text-sm">
                          <div>• Order flooring materials</div>
                          <div>• Purchase paint and supplies</div>
                          <div>• Schedule labor</div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm font-medium mb-2">Week 3-4</div>
                        <div className="space-y-1 text-sm">
                          <div>• Install flooring</div>
                          <div>• Paint walls and ceiling</div>
                          <div>• Install lighting</div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm font-medium mb-2">Week 5-6</div>
                        <div className="space-y-1 text-sm">
                          <div>• Deliver furniture</div>
                          <div>• Install window treatments</div>
                          <div>• Final styling</div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-3">Critical Path Items</h3>
                      <div className="space-y-2">
                        {boqItems.filter(item => item.priority === 'essential').map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                            <span className="text-sm font-medium">{item.name}</span>
                            <Badge variant="outline" className="text-xs">
                              Order by Week {index + 1}
                            </Badge>
                          </div>
                        ))}
                      </div>
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