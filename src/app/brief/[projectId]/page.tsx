'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
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
  DollarSign
} from 'lucide-react'

interface DesignBrief {
  id: string
  projectId: string
  title: string
  description: string
  style?: string
  colorScheme?: string
  budget?: number
  timeline?: string
  requirements: string
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

interface BriefData {
  title: string
  description: string
  executiveSummary: string
  designConcept: string
  styleDirection: string
  colorPalette: {
    primary: string[]
    secondary: string[]
    accent: string[]
  }
  materials: string[]
  spacePlanning: string
  furnitureRecommendations: string[]
  lightingStrategy: string
  keyFeatures: string[]
  phasing: string[]
  budgetConsiderations: string
  timelineOverview: string
}

export default function BriefPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string
  const [project, setProject] = useState<Project | null>(null)
  const [brief, setBrief] = useState<DesignBrief | null>(null)
  const [briefData, setBriefData] = useState<BriefData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editedBrief, setEditedBrief] = useState<BriefData | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchProjectAndBrief()
  }, [projectId])

  const fetchProjectAndBrief = async () => {
    try {
      // Fetch project from API
      const projectResponse = await fetch(`/api/projects/${projectId}`)
      if (projectResponse.ok) {
        const projectData = await projectResponse.json()
        setProject(projectData.project)
      } else {
        // Fallback to mock project data
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
      }

      // For demo purposes, use mock brief data
      // In a real app, this would fetch from the database
      const mockBrief: DesignBrief = {
        id: '1',
        projectId: projectId,
        title: 'Modern Living Room Design Brief',
        description: 'AI-generated design brief for modern living room renovation',
        style: 'Modern, Contemporary',
        colorScheme: '{"primary":["navy blue","charcoal gray"],"secondary":["white","light gray"],"accent":["mustard yellow"]}',
        budget: 15000,
        timeline: '3 months',
        requirements: JSON.stringify({
          title: 'Modern Living Room Design Brief',
          description: 'AI-generated design brief for modern living room renovation',
          executiveSummary: 'This modern living room design project aims to create a sophisticated, functional space that balances contemporary aesthetics with comfortable livability. The design will incorporate clean lines, a neutral color palette with strategic accent colors, and multi-functional furniture pieces.',
          designConcept: 'The design concept centers around creating a harmonious living space that serves as both a relaxing retreat and an entertainment hub. Key elements include an open floor plan, abundant natural light, and a seamless blend of textures and materials.',
          styleDirection: 'Modern contemporary with Scandinavian influences, emphasizing simplicity, functionality, and clean aesthetics.',
          colorPalette: {
            primary: ['navy blue', 'charcoal gray'],
            secondary: ['white', 'light gray'],
            accent: ['mustard yellow']
          },
          materials: ['hardwood flooring', 'leather', 'linen', 'metal accents', 'glass'],
          spacePlanning: 'Open concept layout with defined zones for seating, entertainment, and conversation. Furniture arrangement promotes flow while maintaining intimate areas for relaxation.',
          furnitureRecommendations: ['Modular sofa', 'Coffee table with storage', 'Accent chairs', 'Media console', 'Bookshelves', 'Ottoman'],
          lightingStrategy: 'Layered lighting approach with ambient ceiling fixtures, task lighting for reading areas, and accent lighting to highlight architectural features and artwork.',
          keyFeatures: ['Feature wall with textured finish', 'Built-in media center', 'Cozy reading nook', 'Indoor plants', 'Art gallery wall'],
          phasing: ['Demolition and preparation', 'Structural and electrical work', 'Flooring and painting', 'Furniture and fixture installation', 'Final styling and accessories'],
          budgetConsiderations: 'Budget allocation prioritizes quality seating and foundational elements, with flexibility for accent pieces and accessories to be added over time.',
          timelineOverview: '12-week project timeline with 2 weeks for planning, 6 weeks for construction, and 4 weeks for furnishing and final touches.'
        }),
        aiGenerated: true,
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z'
      }
      setBrief(mockBrief)
      
      const parsedBriefData = JSON.parse(mockBrief.requirements)
      setBriefData(parsedBriefData)
      setEditedBrief(parsedBriefData)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project and brief data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateBrief = async () => {
    setGenerating(true)
    
    try {
      // Mock consultation data - in a real app, this would come from the consultation form
      const consultationData = {
        projectName: project?.title || '',
        projectType: 'Residential - Single Room',
        location: project?.location || '',
        roomType: 'Living Room',
        roomDimensions: '15\' x 20\' x 8\'',
        preferredStyle: ['Modern', 'Contemporary', 'Scandinavian'],
        colorScheme: 'Neutral & Earth Tones',
        favoriteColors: 'Navy blue, charcoal gray, white',
        dislikedColors: 'Bright yellow, orange',
        mood: 'Clean, sophisticated, comfortable',
        primaryUse: 'Relaxation & Entertainment',
        occupants: 2,
        specialNeeds: '',
        storageNeeds: ['Built-in cabinets', 'Hidden storage'],
        lightingPreferences: ['Natural light', 'Warm lighting', 'Dimmable lights'],
        budget: '$10,000 - $25,000',
        timeline: '3-6 months',
        priority: 'Design-led',
        existingFurniture: 'None',
        keepItems: [],
        removeItems: [],
        inspirationSources: ['Pinterest', 'Design websites'],
        specificRequirements: 'Modern aesthetic with comfortable seating',
        additionalNotes: ''
      }

      const response = await fetch('/api/ai/brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          consultationData
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setBrief(data.brief)
        setBriefData(data.briefData)
        setEditedBrief(data.briefData)
        toast({
          title: "Success!",
          description: "Design brief generated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate design brief",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const saveBrief = async () => {
    if (!editedBrief) return

    try {
      // In a real app, this would save to the API
      setBriefData(editedBrief)
      setEditing(false)
      toast({
        title: "Success!",
        description: "Design brief updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save design brief",
        variant: "destructive",
      })
    }
  }

  const exportBrief = () => {
    if (!briefData) return
    
    const briefText = `
DESIGN BRIEF
==============

Project: ${briefData.title}
${briefData.description}

EXECUTIVE SUMMARY
------------------
${briefData.executiveSummary}

DESIGN CONCEPT
---------------
${briefData.designConcept}

STYLE DIRECTION
----------------
${briefData.styleDirection}

COLOR PALETTE
-------------
Primary: ${briefData.colorPalette.primary.join(', ')}
Secondary: ${briefData.colorPalette.secondary.join(', ')}
Accent: ${briefData.colorPalette.accent.join(', ')}

MATERIALS
---------
${briefData.materials.join(', ')}

SPACE PLANNING
--------------
${briefData.spacePlanning}

FURNITURE RECOMMENDATIONS
-------------------------
${briefData.furnitureRecommendations.join(', ')}

LIGHTING STRATEGY
------------------
${briefData.lightingStrategy}

KEY FEATURES
------------
${briefData.keyFeatures.join(', ')}

PROJECT PHASING
---------------
${briefData.phasing.join(', ')}

BUDGET CONSIDERATIONS
---------------------
${briefData.budgetConsiderations}

TIMELINE OVERVIEW
------------------
${briefData.timelineOverview}
    `

    const blob = new Blob([briefText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${briefData.title.replace(/\s+/g, '_')}_Design_Brief.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading design brief...</p>
        </div>
      </div>
    )
  }

  if (!project || !brief) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Project Not Found</CardTitle>
            <CardDescription>The requested project or design brief could not be found</CardDescription>
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
                <p className="text-muted-foreground">{project.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-500 text-white">
                  {project.status.replace('_', ' ')}
                </Badge>
                {brief.aiGenerated && (
                  <Badge variant="secondary">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Generated
                  </Badge>
                )}
              </div>
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
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {brief.timeline}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button onClick={generateBrief} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate with AI
                </>
              )}
            </Button>
            
            {briefData && (
              <>
                <Button variant="outline" onClick={() => setEditing(!editing)}>
                  {editing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Brief
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={exportBrief}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </>
            )}
          </div>

          {/* Design Brief Content */}
          {briefData && (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="design">Design Details</TabsTrigger>
                <TabsTrigger value="implementation">Implementation</TabsTrigger>
                <TabsTrigger value="timeline">Timeline & Budget</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Executive Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editing ? (
                      <Textarea
                        value={editedBrief?.executiveSummary || ''}
                        onChange={(e) => setEditedBrief(prev => prev ? {...prev, executiveSummary: e.target.value} : null)}
                        rows={4}
                      />
                    ) : (
                      <p className="text-muted-foreground">{briefData.executiveSummary}</p>
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Design Concept</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editing ? (
                        <Textarea
                          value={editedBrief?.designConcept || ''}
                          onChange={(e) => setEditedBrief(prev => prev ? {...prev, designConcept: e.target.value} : null)}
                          rows={4}
                        />
                      ) : (
                        <p className="text-muted-foreground">{briefData.designConcept}</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Style Direction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editing ? (
                        <Textarea
                          value={editedBrief?.styleDirection || ''}
                          onChange={(e) => setEditedBrief(prev => prev ? {...prev, styleDirection: e.target.value} : null)}
                          rows={4}
                        />
                      ) : (
                        <p className="text-muted-foreground">{briefData.styleDirection}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="design" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Color Palette</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Primary Colors</h4>
                        <div className="space-y-2">
                          {briefData.colorPalette.primary.map((color, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div 
                                className="w-8 h-8 rounded border"
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-sm">{color}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Secondary Colors</h4>
                        <div className="space-y-2">
                          {briefData.colorPalette.secondary.map((color, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div 
                                className="w-8 h-8 rounded border"
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-sm">{color}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Accent Colors</h4>
                        <div className="space-y-2">
                          {briefData.colorPalette.accent.map((color, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div 
                                className="w-8 h-8 rounded border"
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-sm">{color}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Materials</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editing ? (
                        <Textarea
                          value={editedBrief?.materials.join(', ') || ''}
                          onChange={(e) => setEditedBrief(prev => prev ? {...prev, materials: e.target.value.split(',').map(m => m.trim())} : null)}
                          rows={4}
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {briefData.materials.map((material, index) => (
                            <Badge key={index} variant="outline">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editing ? (
                        <Textarea
                          value={editedBrief?.keyFeatures.join(', ') || ''}
                          onChange={(e) => setEditedBrief(prev => prev ? {...prev, keyFeatures: e.target.value.split(',').map(f => f.trim())} : null)}
                          rows={4}
                        />
                      ) : (
                        <ul className="space-y-1">
                          {briefData.keyFeatures.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="implementation" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Space Planning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editing ? (
                      <Textarea
                        value={editedBrief?.spacePlanning || ''}
                        onChange={(e) => setEditedBrief(prev => prev ? {...prev, spacePlanning: e.target.value} : null)}
                        rows={4}
                      />
                    ) : (
                      <p className="text-muted-foreground">{briefData.spacePlanning}</p>
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Furniture Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editing ? (
                        <Textarea
                          value={editedBrief?.furnitureRecommendations.join(', ') || ''}
                          onChange={(e) => setEditedBrief(prev => prev ? {...prev, furnitureRecommendations: e.target.value.split(',').map(f => f.trim())} : null)}
                          rows={6}
                        />
                      ) : (
                        <ul className="space-y-1">
                          {briefData.furnitureRecommendations.map((item, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <ArrowRight className="w-4 h-4 text-primary" />
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Lighting Strategy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editing ? (
                        <Textarea
                          value={editedBrief?.lightingStrategy || ''}
                          onChange={(e) => setEditedBrief(prev => prev ? {...prev, lightingStrategy: e.target.value} : null)}
                          rows={6}
                        />
                      ) : (
                        <p className="text-muted-foreground">{briefData.lightingStrategy}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Phasing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editing ? (
                        <Textarea
                          value={editedBrief?.phasing.join(', ') || ''}
                          onChange={(e) => setEditedBrief(prev => prev ? {...prev, phasing: e.target.value.split(',').map(p => p.trim())} : null)}
                          rows={6}
                        />
                      ) : (
                        <div className="space-y-3">
                          {briefData.phasing.map((phase, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <span className="text-sm">{phase}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Budget Considerations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editing ? (
                        <Textarea
                          value={editedBrief?.budgetConsiderations || ''}
                          onChange={(e) => setEditedBrief(prev => prev ? {...prev, budgetConsiderations: e.target.value} : null)}
                          rows={4}
                        />
                      ) : (
                        <p className="text-muted-foreground">{briefData.budgetConsiderations}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Timeline Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editing ? (
                      <Textarea
                        value={editedBrief?.timelineOverview || ''}
                        onChange={(e) => setEditedBrief(prev => prev ? {...prev, timelineOverview: e.target.value} : null)}
                        rows={4}
                      />
                    ) : (
                      <p className="text-muted-foreground">{briefData.timelineOverview}</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {!briefData && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Design Brief Generated Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Generate your first AI-powered design brief to get started
                </p>
                <Button onClick={generateBrief} disabled={generating}>
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Design Brief
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}