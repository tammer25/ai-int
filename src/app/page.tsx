'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Home, Palette, LayoutGrid, Calculator, Users, Sparkles, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const { toast } = useToast()
  const { login, register, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      title: "AI-Powered Design",
      description: "Get intelligent design suggestions and automated layouts powered by advanced AI."
    },
    {
      icon: <Palette className="w-8 h-8 text-primary" />,
      title: "Mood Board Generation",
      description: "Create beautiful mood boards with AI-curated images and color palettes."
    },
    {
      icon: <LayoutGrid className="w-8 h-8 text-primary" />,
      title: "2D Space Planning",
      description: "Generate optimized 2D layouts for your space with furniture placement."
    },
    {
      icon: <Calculator className="w-8 h-8 text-primary" />,
      title: "Bill of Quantities",
      description: "Automatically generate detailed BOQs with cost estimates for your project."
    }
  ]

  const workflow = [
    { step: 1, title: "Consultation", description: "Share your vision and requirements" },
    { step: 2, title: "AI Analysis", description: "Our AI processes your needs and preferences" },
    { step: 3, title: "Design Generation", description: "Receive personalized design concepts" },
    { step: 4, title: "Review & Refine", description: "Collaborate and perfect your design" }
  ]

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Home className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">AI Interior Designer</span>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost">Sign In</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Welcome Back</DialogTitle>
                    <DialogDescription>
                      Sign in to your account to continue your design journey
                    </DialogDescription>
                  </DialogHeader>
                  <LoginForm onSuccess={() => setIsLoginOpen(false)} />
                </DialogContent>
              </Dialog>
              
              <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                <DialogTrigger asChild>
                  <Button>Get Started</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Account</DialogTitle>
                    <DialogDescription>
                      Join us to start your AI-powered interior design journey
                    </DialogDescription>
                  </DialogHeader>
                  <RegisterForm onSuccess={() => setIsRegisterOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            AI-Powered Interior Design Platform
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Transform Your Space with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Experience the future of interior design with our AI-powered platform. 
            From concept to completion, we help you create beautiful, functional spaces 
            tailored to your unique style and needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setIsRegisterOpen(true)}>
              Start Your Project <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to bring your interior design vision to life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process makes interior design simple and enjoyable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflow.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied clients who have created their dream spaces with AI
          </p>
          <Button size="lg" variant="secondary" onClick={() => setIsRegisterOpen(true)}>
            Get Started Today <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Home className="w-6 h-6" />
              <span className="text-lg font-semibold">AI Interior Designer</span>
            </div>
            <div className="text-center md:text-right text-muted-foreground">
              <p>&copy; 2024 AI Interior Designer. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const { toast } = useToast()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        })
        onSuccess()
      } else {
        toast({
          title: "Sign in failed",
          description: result.error || "Please check your credentials and try again.",
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
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  )
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('client')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CLIENT' as 'CLIENT' | 'DESIGNER',
    specialty: ''
  })
  const { toast } = useToast()
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        specialty: formData.specialty
      })

      if (result.success) {
        toast({
          title: "Account created!",
          description: "Your account has been successfully created.",
        })
        onSuccess()
      } else {
        toast({
          title: "Registration failed",
          description: result.error || "Please check your information and try again.",
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
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value)
        setFormData({ ...formData, role: value.toUpperCase() as 'CLIENT' | 'DESIGNER' })
      }} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="client">Client</TabsTrigger>
          <TabsTrigger value="designer">Designer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="client" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-name">Full Name</Label>
            <Input
              id="client-name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-email">Email</Label>
            <Input
              id="client-email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-password">Password</Label>
            <Input
              id="client-password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
        </TabsContent>
        
        <TabsContent value="designer" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="designer-name">Full Name</Label>
            <Input
              id="designer-name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="designer-email">Email</Label>
            <Input
              id="designer-email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="designer-specialty">Specialty</Label>
            <Select value={formData.specialty} onValueChange={(value) => setFormData({ ...formData, specialty: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select your specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="hospitality">Hospitality</SelectItem>
                <SelectItem value="sustainable">Sustainable Design</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="designer-password">Password</Label>
            <Input
              id="designer-password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          `Create ${activeTab === 'client' ? 'Client' : 'Designer'} Account`
        )}
      </Button>
    </form>
  )
}