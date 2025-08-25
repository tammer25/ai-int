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
  PlusCircle
} from 'lucide-react'

interface SiteAnalysis {
  id: string
  projectId: string
  dimensions?: string
  roomType?: string
  existingFeatures?: string
  constraints?: string
  photos?: string
  floorPlan?: string
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

interface UploadedFile {
  id: string
  name: string
  type: 'photo' | 'floorplan'
  url: string
  size: number
  uploadedAt: string
}

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string
  const [project, setProject] = useState<Project | null>(null)
  const [analysis, setAnalysis] = useState<SiteAnalysis | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [analysisData, setAnalysisData] = useState({
    dimensions: '',
    roomType: '',
    existingFeatures: '',
    constraints: '',
    floorPlan: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchProjectAndAnalysis()
  }, [projectId])

  const fetchProjectAndAnalysis = async () => {
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

      // Mock analysis data
      const mockAnalysis: SiteAnalysis = {
        id: '1',
        projectId: projectId,
        dimensions: '15\' x 20\' x 8\'',
        roomType: 'Living Room',
        existingFeatures: 'Large window on north wall, hardwood floors, standard electrical outlets',
        constraints: 'Load-bearing wall on east side, limited natural light in corners',
        photos: '["/api/placeholder/400/300", "/api/placeholder/400/300"]',
        floorPlan: '/api/placeholder/600/400',
        createdAt: '2024-01-18T00:00:00Z',
        updatedAt: '2024-01-18T00:00:00Z'
      }
      setAnalysis(mockAnalysis)
      
      setAnalysisData({
        dimensions: mockAnalysis.dimensions || '',
        roomType: mockAnalysis.roomType || '',
        existingFeatures: mockAnalysis.existingFeatures || '',
        constraints: mockAnalysis.constraints || '',
        floorPlan: mockAnalysis.floorPlan || ''
      })

      // Mock uploaded files
      const mockFiles: UploadedFile[] = [
        {
          id: '1',
          name: 'living-room-current.jpg',
          type: 'photo',
          url: '/api/placeholder/400/300',
          size: 2048000,
          uploadedAt: '2024-01-18T10:00:00Z'
        },
        {
          id: '2',
          name: 'living-room-angle2.jpg',
          type: 'photo',
          url: '/api/placeholder/400/300',
          size: 1849000,
          uploadedAt: '2024-01-18T10:05:00Z'
        },
        {
          id: '3',
          name: 'floor-plan-existing.png',
          type: 'floorplan',
          url: '/api/placeholder/600/400',
          size: 1024000,
          uploadedAt: '2024-01-18T10:10:00Z'
        }
      ]
      setUploadedFiles(mockFiles)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project and analysis data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'floorplan') => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
        id: Date.now().toString() + index,
        name: file.name,
        type,
        url: type === 'floorplan' ? '/api/placeholder/600/400' : '/api/placeholder/400/300',
        size: file.size,
        uploadedAt: new Date().toISOString()
      }))

      setUploadedFiles(prev => [...prev, ...newFiles])
      
      toast({
        title: "Upload successful!",
        description: `${files.length} file(s) uploaded successfully`,
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
    toast({
      title: "File removed",
      description: "File has been removed from the analysis",
    })
  }

  const saveAnalysis = async () => {
    setSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedAnalysis = {
        ...analysis,
        dimensions: analysisData.dimensions,
        roomType: analysisData.roomType,
        existingFeatures: analysisData.existingFeatures,
        constraints: analysisData.constraints,
        floorPlan: analysisData.floorPlan,
        photos: JSON.stringify(uploadedFiles.filter(f => f.type === 'photo').map(f => f.url))
      }
      
      setAnalysis(updatedAnalysis)
      
      toast({
        title: "Analysis saved!",
        description: "Site analysis has been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save analysis. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const generateAIAnalysis = async () => {
    setUploading(true)
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock AI-generated insights
      const aiInsights = {
        spaceOptimization: "The room has good potential for open-concept living. Consider removing non-load-bearing walls to create better flow.",
        lightingAnalysis: "Natural light is adequate but could be enhanced with additional artificial lighting in darker corners.",
        structuralConsiderations: "The load-bearing wall on the east side presents both a constraint and an opportunity for feature wall design.",
        recommendations: [
          "Consider adding skylights to improve natural light",
          "The hardwood floors are in good condition and can be refinished",
          "Electrical panel has capacity for additional lighting circuits",
          "Window placement allows for good cross-ventilation"
        ]
      }
      
      toast({
        title: "AI Analysis Complete!",
        description: "AI has analyzed your site and provided insights and recommendations",
      })
      
      // In a real implementation, this would update the analysis with AI insights
      console.log('AI Analysis Results:', aiInsights)
      
    } catch (error) {
      toast({
        title: "AI Analysis failed",
        description: "Failed to generate AI analysis. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading site analysis...</p>
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
        <div className="max-w-6xl mx-auto">
          {/* Project Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
                <p className="text-muted-foreground">Site Analysis & Measurements</p>
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
            <Button onClick={saveAnalysis} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Analysis
                </>
              )}
            </Button>
            
            <Button onClick={generateAIAnalysis} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Analysis
                </>
              )}
            </Button>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Analysis Content */}
          <Tabs defaultValue="measurements" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="measurements">Measurements</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="floorplan">Floor Plan</TabsTrigger>
              <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="measurements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Ruler className="w-5 h-5 mr-2" />
                      Room Dimensions
                    </CardTitle>
                    <CardDescription>
                      Enter the exact measurements of your space
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dimensions">Dimensions (L x W x H)</Label>
                      <Input
                        id="dimensions"
                        placeholder="e.g., 15' x 20' x 8'"
                        value={analysisData.dimensions}
                        onChange={(e) => setAnalysisData(prev => ({ ...prev, dimensions: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="roomType">Room Type</Label>
                      <Select value={analysisData.roomType} onValueChange={(value) => setAnalysisData(prev => ({ ...prev, roomType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Living Room">Living Room</SelectItem>
                          <SelectItem value="Bedroom">Bedroom</SelectItem>
                          <SelectItem value="Kitchen">Kitchen</SelectItem>
                          <SelectItem value="Bathroom">Bathroom</SelectItem>
                          <SelectItem value="Dining Room">Dining Room</SelectItem>
                          <SelectItem value="Home Office">Home Office</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Maximize className="w-5 h-5 mr-2" />
                      Existing Features
                    </CardTitle>
                    <CardDescription>
                      Describe existing architectural features and fixtures
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="existingFeatures">Features & Fixtures</Label>
                      <Textarea
                        id="existingFeatures"
                        placeholder="e.g., Large windows, hardwood floors, fireplace, built-in shelves"
                        value={analysisData.existingFeatures}
                        onChange={(e) => setAnalysisData(prev => ({ ...prev, existingFeatures: e.target.value }))}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Minimize className="w-5 h-5 mr-2" />
                    Constraints & Limitations
                  </CardTitle>
                  <CardDescription>
                    Note any structural, electrical, or other constraints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="constraints">Constraints</Label>
                    <Textarea
                      id="constraints"
                      placeholder="e.g., Load-bearing walls, limited electrical capacity, plumbing locations"
                      value={analysisData.constraints}
                      onChange={(e) => setAnalysisData(prev => ({ ...prev, constraints: e.target.value }))}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="photos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Room Photos
                  </CardTitle>
                  <CardDescription>
                    Upload photos of your current space from multiple angles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Upload Section */}
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Upload Room Photos</h3>
                    <p className="text-muted-foreground mb-4">
                      Take photos from multiple angles to give us a complete view of your space
                    </p>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, 'photo')}
                        disabled={uploading}
                        className="hidden"
                        id="photo-upload"
                      />
                      <Button asChild disabled={uploading}>
                        <label htmlFor="photo-upload" className="cursor-pointer">
                          {uploading ? 'Uploading...' : 'Choose Photos'}
                        </label>
                      </Button>
                    </div>
                  </div>

                  {/* Photo Gallery */}
                  {uploadedFiles.filter(f => f.type === 'photo').length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Uploaded Photos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {uploadedFiles.filter(f => f.type === 'photo').map((file) => (
                          <Card key={file.id} className="relative group">
                            <CardContent className="p-0">
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                              <div className="p-3">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeFile(file.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="floorplan" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LayoutGrid className="w-5 h-5 mr-2" />
                    Floor Plan
                  </CardTitle>
                  <CardDescription>
                    Upload your existing floor plan or create a new one
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Upload Section */}
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <LayoutGrid className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Upload Floor Plan</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload an existing floor plan or sketch of your space
                    </p>
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(e, 'floorplan')}
                        disabled={uploading}
                        className="hidden"
                        id="floorplan-upload"
                      />
                      <Button asChild disabled={uploading}>
                        <label htmlFor="floorplan-upload" className="cursor-pointer">
                          {uploading ? 'Uploading...' : 'Choose Floor Plan'}
                        </label>
                      </Button>
                    </div>
                  </div>

                  {/* Floor Plan Display */}
                  {uploadedFiles.filter(f => f.type === 'floorplan').length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Floor Plan</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {uploadedFiles.filter(f => f.type === 'floorplan').map((file) => (
                          <Card key={file.id} className="relative group">
                            <CardContent className="p-0">
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-64 object-cover rounded-t-lg"
                              />
                              <div className="p-3">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeFile(file.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    AI Analysis & Insights
                  </CardTitle>
                  <CardDescription>
                    AI-powered analysis of your space with recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Analysis Results */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Space Optimization</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          The room has good potential for open-concept living. Consider removing non-load-bearing walls to create better flow between spaces.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Lighting Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Natural light is adequate but could be enhanced with additional artificial lighting in darker corners. Consider adding dimmable fixtures.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Structural Considerations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          The load-bearing wall on the east side presents both a constraint and an opportunity for feature wall design.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Material Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Existing hardwood floors are in good condition and can be refinished. Walls are standard drywall in good condition.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">AI Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Consider adding skylights to improve natural light</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">The hardwood floors are in good condition and can be refinished</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Electrical panel has capacity for additional lighting circuits</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Window placement allows for good cross-ventilation</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Consider built-in storage solutions to maximize space</span>
                        </li>
                      </ul>
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
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Generate Mood Board
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <LayoutGrid className="w-4 h-4 mr-2" />
                          Create 2D Layout
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Calculator className="w-4 h-4 mr-2" />
                          Generate BOQ
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