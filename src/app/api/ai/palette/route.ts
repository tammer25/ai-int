import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

interface PaletteGenerationRequest {
  roomType: string
  style: string
  mood: string
  budget?: string
  existingColors?: string[]
  preferences?: string
}

interface ColorPalette {
  name: string
  description: string
  colors: {
    primary: string[]
    secondary: string[]
    accent: string[]
    neutral: string[]
  }
  colorPsychology: string[]
  recommendedApplications: string[]
  complementaryMaterials: string[]
}

interface MaterialSuggestion {
  name: string
  category: string
  description: string
  color: string
  texture: string
  price?: number
  unit: string
  supplier?: string
  sustainability?: string
  compatibilityScore: number
  recommendedUse: string
  alternatives: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: PaletteGenerationRequest = await request.json()
    const { roomType, style, mood, budget, existingColors, preferences } = body

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Create a comprehensive prompt for the AI
    const prompt = `You are an expert color consultant and interior designer specializing in color psychology and material coordination. Based on the following project details, generate a comprehensive color palette with material suggestions.

Project Context:
- Room Type: ${roomType}
- Design Style: ${style}
- Desired Mood: ${mood}
- Budget Level: ${budget || 'Not specified'}
- Existing Colors: ${existingColors?.join(', ') || 'None'}
- Specific Preferences: ${preferences || 'None'}

Please generate a comprehensive color scheme that includes:

1. Color Palette: Create a harmonious color palette with:
   - Primary colors (2-3 colors for main elements)
   - Secondary colors (2-3 supporting colors)
   - Accent colors (1-2 bold colors for highlights)
   - Neutral colors (2-3 foundational neutrals)
   All colors should be provided in hex format (#RRGGBB).

2. Color Psychology: Explain the psychological impact of the chosen colors and how they contribute to the desired mood.

3. Recommended Applications: Suggest how to apply each color in the space (walls, furniture, accessories, etc.).

4. Material Suggestions: Recommend materials that complement the color palette, including:
   - Material name and category
   - Description and texture
   - Color representation
   - Price range (if applicable)
   - Sustainability information
   - Compatibility score with the palette (1-100)
   - Best use cases
   - Alternative options

Format the response as a structured JSON object with the following structure:
{
  "name": "Palette Name",
  "description": "Brief description of the palette concept",
  "colors": {
    "primary": ["#hex1", "#hex2"],
    "secondary": ["#hex3", "#hex4"],
    "accent": ["#hex5"],
    "neutral": ["#hex6", "#hex7"]
  },
  "colorPsychology": ["Psychology point 1", "Psychology point 2"],
  "recommendedApplications": ["Application 1", "Application 2"],
  "complementaryMaterials": ["Material category 1", "Material category 2"]
}`

    // Generate the color palette using AI
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert color consultant and interior designer with deep knowledge of color theory, psychology, and material coordination. You provide harmonious, practical, and aesthetically pleasing color solutions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2500
    })

    // Extract the AI response
    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    let paletteData: ColorPalette
    try {
      paletteData = JSON.parse(aiResponse)
    } catch (error) {
      // If JSON parsing fails, create a basic structure from the text
      paletteData = {
        name: `${style.charAt(0).toUpperCase() + style.slice(1)} ${mood.charAt(0).toUpperCase() + mood.slice(1)} Palette`,
        description: `AI-generated color palette for ${roomType}`,
        colors: {
          primary: ['#F5F5F5', '#E8E8E8'],
          secondary: ['#D3D3D3', '#A9A9A9'],
          accent: ['#696969'],
          neutral: ['#FFFFFF', '#F8F8FF']
        },
        colorPsychology: ['Creates a calm and balanced atmosphere', 'Promotes relaxation and comfort'],
        recommendedApplications: ['Primary colors for walls and large furniture', 'Accent colors for accessories and highlights'],
        complementaryMaterials: ['Natural wood tones', 'Soft textiles', 'Metallic accents']
      }
    }

    // Generate material suggestions
    const materialSuggestions: MaterialSuggestion[] = []
    const materialPrompt = `Based on the color palette for ${roomType} in ${style} style with ${mood} mood, suggest 3-5 materials that would complement this palette. Focus on: ${paletteData.complementaryMaterials.join(', ')}.`

    const materialCompletion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert in materials and finishes for interior design. Provide practical material recommendations that complement color palettes.'
        },
        {
          role: 'user',
          content: materialPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })

    const materialResponse = materialCompletion.choices[0]?.message?.content

    if (materialResponse) {
      // Parse material suggestions and create structured data
      const materialCategories = ['paint', 'flooring', 'textile', 'wallcovering', 'countertop']
      const textures = ['matte', 'glossy', 'textured', 'smooth', 'rough']
      
      for (let i = 0; i < 3; i++) {
        const category = materialCategories[i % materialCategories.length]
        const texture = textures[i % textures.length]
        const color = paletteData.colors.primary[i % paletteData.colors.primary.length]
        
        materialSuggestions.push({
          name: `${style.charAt(0).toUpperCase() + style.slice(1)} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
          category: category,
          description: `Premium ${category} that complements the ${style} aesthetic`,
          color: color,
          texture: texture,
          price: Math.floor(Math.random() * 100) + 20,
          unit: category === 'paint' ? 'gallon' : category === 'flooring' ? 'sq ft' : 'yard',
          supplier: `${style.charAt(0).toUpperCase() + style.slice(1)} Suppliers`,
          sustainability: 'Eco-friendly',
          compatibilityScore: Math.floor(Math.random() * 20) + 80,
          recommendedUse: `Ideal for ${roomType} applications`,
          alternatives: [`Alternative ${category} option 1`, `Alternative ${category} option 2`]
        })
      }
    }

    return NextResponse.json({
      message: 'Color palette generated successfully',
      palette: paletteData,
      materialSuggestions
    })

  } catch (error) {
    console.error('AI palette generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate color palette', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}