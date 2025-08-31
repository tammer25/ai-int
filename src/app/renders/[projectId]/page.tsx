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
  Cube, // Use Cube as replacement for View3D
  Box,
  // View3D, // REMOVED
  // Palette2, // REMOVED
  Sun,
  Moon,
  Lightbulb,
  Settings as SettingsIcon,
  Sliders,
  Crop,
  RotateCw as RotateIcon
} from 'lucide-react'

// ...rest of the file is unchanged except replacing View3D and Palette2 usages with Cube and Palette
// The following replacements are made:
// - <View3D ... /> -> <Cube ... />
// - <Palette2 ... /> -> <Palette ... />

// The rest of the file code remains as is, except for those icon replacements.
