'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
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
  Sofa,
  Lightbulb,
  DollarSign,
  Calendar,
  MapPin,
  Ruler,
  Upload
} from 'lucide-react'

interface ConsultationFormData {
  // Basic Information
  projectName: string
  projectType: string
  location: string
  roomType: string
  roomDimensions: string
  
  // Style Preferences
  preferredStyle: string[]
  colorScheme: string
  favoriteColors: string
  dislikedColors: string
  mood: string
  
  // Functional Requirements
  primaryUse: string
  occupants: number
  specialNeeds: string
  storageNeeds: string[]
  lightingPreferences: string[]
  
  // Budget & Timeline
  budget: string
  timeline: string
  priority: string
  
  // Existing Elements
  existingFurniture: string
  keepItems: string[]
  removeItems: string[]
  
  // Inspiration & References
  inspirationSources: string[]
  specificRequirements: string
  
  // Contact Information
  contactPreference: string
  availability: string
  additionalNotes: string
}

const projectTypes = [
  'Residential - Full Home',
  'Residential - Single Room',
  'Residential - Multiple Rooms',
  'Commercial - Office',
  'Commercial - Retail',
  'Commercial - Hospitality',
  'Other'
]

const roomTypes = [
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Bathroom',
  'Dining Room',
  'Home Office',
  'Guest Room',
  'Entertainment Room',
  'Other'
]

const designStyles = [
  'Modern',
  'Contemporary',
  'Traditional',
  'Transitional',
  'Minimalist',
  'Scandinavian',
  'Industrial',
  'Bohemian',
  'Coastal',
  'Farmhouse',
  'Mid-Century Modern',
  'Art Deco'
]

const colorSchemes = [
  'Neutral & Earth Tones',
  'Warm & Cozy',
  'Cool & Calming',
  'Bold & Vibrant',
  'Monochromatic',
  'Pastel',
  'Jewel Tones'
]

const primaryUses = [
  'Relaxation & Leisure',
  'Work & Productivity',
  'Entertainment & Socializing',
  'Family Activities',
  'Sleeping',
  'Cooking & Dining',
  'Storage & Organization'
]

const budgetRanges = [
  'Under $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  'Over $100,000'
]

const timelines = [
  'ASAP - Within 1 month',
  'Soon - 1-3 months',
  'Flexible - 3-6 months',
  'Planning - 6+ months'
]

const priorities = [
  'Budget-conscious',
  'Quality-focused',
  'Speed-oriented',
  'Design-led',
  'Functionality-first'
]

export default function ConsultationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ConsultationFormData>({
    projectName: '',
    projectType: '',
    location: '',
    roomType: '',
    roomDimensions: '',
    preferredStyle: [],
    colorScheme: '',
    favoriteColors: '',
    dislikedColors: '',
    mood: '',
    primaryUse: '',
    occupants: 1,
    specialNeeds: '',
    storageNeeds: [],
    lightingPreferences: [],
    budget: '',
    timeline: '',
    priority: '',
    existingFurniture: '',
    keepItems: [],
    removeItems: [],
    inspirationSources: [],
    specificRequirements: '',
    contactPreference: '',
    availability: '',
    additionalNotes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: keyof ConsultationFormData, value: string | string[] | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field: keyof ConsultationFormData, value: string, checked: boolean) => {
    const currentValues = formData[field] as string[]
    if (checked) {
      handleInputChange(field, [...currentValues, value])
    } else {
      handleInputChange(field, currentValues.filter(item => item !== value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Consultation submitted successfully!",
        description: "Our AI will analyze your requirements and create a personalized design brief.",
      })
      
      // Reset form or redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit consultation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Project Basics
              </CardTitle>
              <CardDescription>
                Tell us about your project and space
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="e.g., Modern Living Room Renovation"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type</Label>
                <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., New York, NY"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type</Label>
                <Select value={formData.roomType} onValueChange={(value) => handleInputChange('roomType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomDimensions">Room Dimensions</Label>
                <Input
                  id="roomDimensions"
                  placeholder="e.g., 15' x 20' x 8'"
                  value={formData.roomDimensions}
                  onChange={(e) => handleInputChange('roomDimensions', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Style Preferences
              </CardTitle>
              <CardDescription>
                Help us understand your aesthetic preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Preferred Design Styles (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {designStyles.map(style => (
                    <div key={style} className="flex items-center space-x-2">
                      <Checkbox
                        id={style}
                        checked={formData.preferredStyle.includes(style)}
                        onCheckedChange={(checked) => handleCheckboxChange('preferredStyle', style, checked as boolean)}
                      />
                      <Label htmlFor={style} className="text-sm">{style}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="colorScheme">Color Scheme Preference</Label>
                <Select value={formData.colorScheme} onValueChange={(value) => handleInputChange('colorScheme', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorSchemes.map(scheme => (
                      <SelectItem key={scheme} value={scheme}>{scheme}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="favoriteColors">Favorite Colors</Label>
                <Input
                  id="favoriteColors"
                  placeholder="e.g., Navy blue, sage green, warm gray"
                  value={formData.favoriteColors}
                  onChange={(e) => handleInputChange('favoriteColors', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dislikedColors">Colors to Avoid</Label>
                <Input
                  id="dislikedColors"
                  placeholder="e.g., Bright yellow, orange"
                  value={formData.dislikedColors}
                  onChange={(e) => handleInputChange('dislikedColors', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood">Desired Mood/Atmosphere</Label>
                <Textarea
                  id="mood"
                  placeholder="e.g., Calm and relaxing, energizing and vibrant, cozy and warm"
                  value={formData.mood}
                  onChange={(e) => handleInputChange('mood', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sofa className="w-5 h-5 mr-2" />
                Functional Requirements
              </CardTitle>
              <CardDescription>
                Tell us how you'll use the space
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="primaryUse">Primary Use of Space</Label>
                <Select value={formData.primaryUse} onValueChange={(value) => handleInputChange('primaryUse', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary use" />
                  </SelectTrigger>
                  <SelectContent>
                    {primaryUses.map(use => (
                      <SelectItem key={use} value={use}>{use}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupants">Number of Occupants</Label>
                <Input
                  id="occupants"
                  type="number"
                  min="1"
                  value={formData.occupants}
                  onChange={(e) => handleInputChange('occupants', parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialNeeds">Special Needs or Requirements</Label>
                <Textarea
                  id="specialNeeds"
                  placeholder="e.g., Accessibility needs, pet-friendly, child-safe"
                  value={formData.specialNeeds}
                  onChange={(e) => handleInputChange('specialNeeds', e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Storage Needs (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Closet space', 'Shelving', 'Built-in cabinets', 'Hidden storage', 'Display shelves', 'Multi-functional furniture'].map(need => (
                    <div key={need} className="flex items-center space-x-2">
                      <Checkbox
                        id={need}
                        checked={formData.storageNeeds.includes(need)}
                        onCheckedChange={(checked) => handleCheckboxChange('storageNeeds', need, checked as boolean)}
                      />
                      <Label htmlFor={need} className="text-sm">{need}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Lighting Preferences (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Natural light', 'Warm lighting', 'Bright task lighting', 'Ambient lighting', 'Dimmable lights', 'Smart lighting'].map(pref => (
                    <div key={pref} className="flex items-center space-x-2">
                      <Checkbox
                        id={pref}
                        checked={formData.lightingPreferences.includes(pref)}
                        onCheckedChange={(checked) => handleCheckboxChange('lightingPreferences', pref, checked as boolean)}
                      />
                      <Label htmlFor={pref} className="text-sm">{pref}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Budget & Timeline
              </CardTitle>
              <CardDescription>
                Help us understand your budget and timing constraints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range</Label>
                <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map(range => (
                      <SelectItem key={range} value={range}>{range}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Project Timeline</Label>
                <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {timelines.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Project Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Existing Elements
              </CardTitle>
              <CardDescription>
                Tell us about existing furniture and items you want to keep or remove
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="existingFurniture">Existing Furniture & Features</Label>
                <Textarea
                  id="existingFurniture"
                  placeholder="Describe existing furniture, architectural features, fixtures, etc."
                  value={formData.existingFurniture}
                  onChange={(e) => handleInputChange('existingFurniture', e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Items to Keep (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Sofa', 'Dining table', 'Bed', 'Desk', 'Bookshelves', 'Light fixtures', 'Rugs', 'Artwork', 'Plants'].map(item => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={item}
                        checked={formData.keepItems.includes(item)}
                        onCheckedChange={(checked) => handleCheckboxChange('keepItems', item, checked as boolean)}
                      />
                      <Label htmlFor={item} className="text-sm">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Items to Remove (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Old furniture', 'Carpet', 'Wallpaper', 'Light fixtures', 'Window treatments', 'Built-ins', 'Appliances'].map(item => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={item}
                        checked={formData.removeItems.includes(item)}
                        onCheckedChange={(checked) => handleCheckboxChange('removeItems', item, checked as boolean)}
                      />
                      <Label htmlFor={item} className="text-sm">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Final Details
              </CardTitle>
              <CardDescription>
                Any additional information to help us create your perfect design
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Inspiration Sources (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Pinterest', 'Instagram', 'Magazines', 'Design websites', 'Friends\' homes', 'Hotels', 'Restaurants', 'Nature'].map(source => (
                    <div key={source} className="flex items-center space-x-2">
                      <Checkbox
                        id={source}
                        checked={formData.inspirationSources.includes(source)}
                        onCheckedChange={(checked) => handleCheckboxChange('inspirationSources', source, checked as boolean)}
                      />
                      <Label htmlFor={source} className="text-sm">{source}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specificRequirements">Specific Requirements or Ideas</Label>
                <Textarea
                  id="specificRequirements"
                  placeholder="Any specific features, materials, or design elements you have in mind"
                  value={formData.specificRequirements}
                  onChange={(e) => handleInputChange('specificRequirements', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPreference">Preferred Contact Method</Label>
                <Select value={formData.contactPreference} onValueChange={(value) => handleInputChange('contactPreference', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="in-person">In-person</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability for Consultations</Label>
                <Input
                  id="availability"
                  placeholder="e.g., Weekday evenings, weekends"
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any other information you'd like to share"
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
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
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold">Design Consultation</h2>
              <span className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-2">
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Consultation'}
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}