'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
  Trash2,
  Download
} from 'lucide-react'

interface User {
  id: string
  email: string
  name?: string
  role: 'CLIENT' | 'DESIGNER' | 'ADMIN'
  avatar?: string
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
  client: User
  designer?: User
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
  const [creatingProject, setCreatingProject] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // In a real app, this would come from authentication context
      const userResponse = await fetch('/api/auth/me')
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData.user)
      } else {
        // Fallback to mock user for demo
        const mockUser: User = {
          id: '1',
          email: 'client@example.com',
          name: 'John Doe',
          role: 'CLIENT',
          avatar: ''
        }
        setUser(mockUser)
      }

      // Fetch projects from API
      const projectsResponse = await fetch('/api/projects')
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData.projects)
      } else {
        // Fallback to mock projects for demo
        const mockProjects: Project[] = [
          {
            id: '1',
            title: 'Modern Living Room',
            description: 'Complete renovation of living room with modern aesthetic',
            status: 'IN_PROGRESS',
            clientId: '1',
            location: 'New York, NY',
            budget: 15000,
            startDate: '2024-01-15',
            endDate: '2024-03-15',
            createdAt: '2024-01-10T00:00:00Z',
            updatedAt: '2024-01-20T00:00:00Z',
            client: { id: '1', email: 'client@example.com', name: 'John Doe', role: 'CLIENT' }
          },
          {
            id: '2',
            title: 'Home Office Design',
            description: 'Functional and ergonomic home office space',
            status: 'PLANNING',
            clientId: '1',
            location: 'Home Office',
            budget: 8000,
            startDate: '2024-02-01',
            endDate: '2024-02-28',
            createdAt: '2024-01-18T00:00:00Z',
            updatedAt: '2024-01-18T00:00:00Z',
            client: { id: '1', email: 'client@example.com', name: 'John Doe', role: 'CLIENT' }
          }
        ]
        setProjects(mockProjects)
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      // Fallback to mock data
      const mockUser: User = {
        id: '1',
        email: 'client@example.com',
        name: 'John Doe',
        role: 'CLIENT',
        avatar: ''
      }
      setUser(mockUser)
      
      const mockProjects: Project[] = [
        {
          id: '1',
          title: 'Modern Living Room',
          description: 'Complete renovation of living room with modern aesthetic',
          status: 'IN_PROGRESS',
          clientId: '1',
          location: 'New York, NY',
          budget: 15000,
          startDate: '2024-01-15',
          endDate: '2024-03-15',
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z',
          client: { id: '1', email: 'client@example.com', name: 'John Doe', role: 'CLIENT' }
        }
      ]
      setProjects(mockProjects)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING': return 'bg-yellow-500'
      case 'IN_PROGRESS': return 'bg-blue-500'
      case 'REVIEW': return 'bg-purple-500'
      case 'COMPLETED': return 'bg-green-500'
      case 'CANCELLED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'PLANNING': return 20
      case 'IN_PROGRESS': return 50
      case 'REVIEW': return 80
      case 'COMPLETED': return 100
      case 'CANCELLED': return 0
      default: return 0
    }
  }

  // Project creation form state
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    location: '',
    budget: '',
    startDate: '',
    endDate: ''
  })

  const handleCreateProject = async () => {
    if (!newProject.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Project title is required",
        variant: "destructive",
      })
      return
    }

    setCreatingProject(true)
    
    try {
      const projectData = {
        title: newProject.title,
        description: newProject.description || undefined,
        location: newProject.location || undefined,
        budget: newProject.budget ? parseFloat(newProject.budget) : undefined,
        startDate: newProject.startDate || undefined,
        endDate: newProject.endDate || undefined,
        clientId: user?.id || '1'
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        const result = await response.json()
        setProjects(prev => [result.project, ...prev])
        setIsCreateProjectOpen(false)
        setNewProject({
          title: '',
          description: '',
          location: '',
          budget: '',
          startDate: '',
          endDate: ''
        })
        toast({
          title: "Project Created!",
          description: "Your new project has been created successfully",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Creation Failed",
          description: error.error || "Failed to create project",
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
      setCreatingProject(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isClient = user.role === 'CLIENT'
  const isDesigner = user.role === 'DESIGNER'

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
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user.name?.split(' ')[0]}!
          </h2>
          <p className="text-muted-foreground">
            {isClient ? "Manage your interior design projects and track progress" : "Manage your design projects and client collaborations"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">
                {projects.filter(p => p.status === 'IN_PROGRESS').length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter(p => p.status === 'IN_PROGRESS').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter(p => p.status === 'COMPLETED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully finished
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all projects
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="briefs">Design Briefs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Your Projects</h3>
              <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Start a new interior design project with AI-powered assistance
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Modern Living Room Renovation"
                        value={newProject.title}
                        onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of your project"
                        value={newProject.description}
                        onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                        className="min-h-[80px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., New York, NY"
                        value={newProject.location}
                        onChange={(e) => setNewProject(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget ($)</Label>
                        <Input
                          id="budget"
                          type="number"
                          placeholder="0"
                          value={newProject.budget}
                          onChange={(e) => setNewProject(prev => ({ ...prev, budget: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newProject.startDate}
                          onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date (Optional)</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newProject.endDate}
                        onChange={(e) => setNewProject(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsCreateProjectOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateProject} disabled={creatingProject}>
                        {creating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Creating...
                          </>
                        ) : (
                          'Create Project'
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(project.status)} text-white`}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Progress</span>
                        <span>{getStatusProgress(project.status)}%</span>
                      </div>
                      <Progress value={getStatusProgress(project.status)} className="w-full" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Location:</span>
                          <p className="text-muted-foreground">{project.location}</p>
                        </div>
                        <div>
                          <span className="font-medium">Budget:</span>
                          <p className="text-muted-foreground">${project.budget?.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Timeline:</span>
                          <p className="text-muted-foreground">
                            {new Date(project.startDate || '').toLocaleDateString()} - {new Date(project.endDate || '').toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          View Designs
                        </Button>
                        {isClient && project.status === 'PLANNING' && (
                          <Button size="sm">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Start AI Design
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="briefs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Design Briefs</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Brief
              </Button>
            </div>

            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">No design briefs yet</h4>
              <p className="text-muted-foreground mb-4">
                Create your first design brief to get started with AI-powered interior design
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Design Brief
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Analytics Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Project Performance Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Performance Overview</CardTitle>
                    <CardDescription>Key metrics and insights about your design projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{projects.length}</div>
                        <div className="text-sm text-muted-foreground">Total Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {projects.filter(p => p.status === 'COMPLETED').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {projects.filter(p => p.status === 'IN_PROGRESS').length}
                        </div>
                        <div className="text-sm text-muted-foreground">In Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          ${projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Budget</div>
                      </div>
                    </div>
                    
                    {/* Project Status Distribution */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Project Status Distribution</h4>
                      <div className="space-y-2">
                        {['PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED'].map(status => {
                          const count = projects.filter(p => p.status === status).length
                          const percentage = projects.length > 0 ? (count / projects.length) * 100 : 0
                          return (
                            <div key={status} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  status === 'PLANNING' ? 'bg-yellow-500' :
                                  status === 'IN_PROGRESS' ? 'bg-blue-500' :
                                  status === 'REVIEW' ? 'bg-purple-500' :
                                  status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                                <span className="text-sm">{status.replace('_', ' ')}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      status === 'PLANNING' ? 'bg-yellow-500' :
                                      status === 'IN_PROGRESS' ? 'bg-blue-500' :
                                      status === 'REVIEW' ? 'bg-purple-500' :
                                      status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-500'
                                    }`} 
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground w-8">{count}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Budget Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Budget Analysis</CardTitle>
                    <CardDescription>Financial insights across all projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-xl font-bold text-blue-600">
                            ${projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}
                          </div>
                          <div className="text-sm text-blue-600">Total Budget</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-xl font-bold text-green-600">
                            ${Math.floor(projects.reduce((sum, p) => sum + (p.budget || 0), 0) * 0.75).toLocaleString()}
                          </div>
                          <div className="text-sm text-green-600">Estimated Spent</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-xl font-bold text-purple-600">
                            ${Math.floor(projects.reduce((sum, p) => sum + (p.budget || 0), 0) * 0.25).toLocaleString()}
                          </div>
                          <div className="text-sm text-purple-600">Remaining</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Average Project Budget</span>
                          <span className="font-medium">
                            ${projects.length > 0 ? Math.floor(projects.reduce((sum, p) => sum + (p.budget || 0), 0) / projects.length).toLocaleString() : 0}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Largest Project</span>
                          <span className="font-medium">
                            ${projects.length > 0 ? Math.max(...projects.map(p => p.budget || 0)).toLocaleString() : 0}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Budget Utilization</span>
                          <span className="font-medium">75%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Timeline Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Timeline Analysis</CardTitle>
                    <CardDescription>Project duration and completion insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Average Project Duration</span>
                            <span className="font-medium">45 days</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Fastest Completion</span>
                            <span className="font-medium">21 days</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Longest Duration</span>
                            <span className="font-medium">89 days</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>On-Time Completion</span>
                            <span className="font-medium text-green-600">85%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Delayed Projects</span>
                            <span className="font-medium text-yellow-600">12%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Over Budget</span>
                            <span className="font-medium text-red-600">8%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Analytics Sidebar */}
              <div className="space-y-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Project Completed</p>
                          <p className="text-xs text-muted-foreground">Modern Living Room - 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New Project Created</p>
                          <p className="text-xs text-muted-foreground">Home Office Design - 1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Design Brief Generated</p>
                          <p className="text-xs text-muted-foreground">Kitchen Renovation - 3 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Mood Board Updated</p>
                          <p className="text-xs text-muted-foreground">Master Bedroom - 5 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* AI Usage Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Usage Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Design Briefs Generated</span>
                          <span className="font-medium">24</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Mood Boards Created</span>
                          <span className="font-medium">18</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Layouts Generated</span>
                          <span className="font-medium">15</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>3D Renders Created</span>
                          <span className="font-medium">12</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>BOQs Generated</span>
                          <span className="font-medium">9</span>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Total AI Features Used</span>
                          <span>78</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Export Analytics Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Summary PDF
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Detailed Charts
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Settings */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your account information and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-lg">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" size="sm">Change Avatar</Button>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max size of 2MB.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          defaultValue={user?.name || ''} 
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          defaultValue={user?.email || ''} 
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Profile</Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Notification Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Get real-time updates in your browser</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Project Updates</p>
                        <p className="text-sm text-muted-foreground">Notifications about your projects</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Account Settings Sidebar */}
              <div className="space-y-6">
                {/* Account Security */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input type="password" placeholder="Enter current password" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <Input type="password" placeholder="Confirm new password" />
                    </div>
                    <Button className="w-full">Update Password</Button>
                  </CardContent>
                </Card>
                
                {/* Account Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Export My Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Download Invoices
                    </Button>
                    <div className="pt-2 border-t">
                      <Button variant="destructive" className="w-full justify-start">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">Toggle dark theme</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Language</p>
                        <p className="text-sm text-muted-foreground">Interface language</p>
                      </div>
                      <Button variant="outline" size="sm">English</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Timezone</p>
                        <p className="text-sm text-muted-foreground">Your local timezone</p>
                      </div>
                      <Button variant="outline" size="sm">UTC-5</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}