import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

interface MoodBoardGenerationRequest {
  projectId: string
  style: string
  colorScheme: string
  roomType: string
  mood: string
  preferences: {
    materials?: string[]
    furnitureStyles?: string[]
    lighting?: string[]
    textures?: string[]
  }
}

interface MoodBoardImage {
  url: string
  title: string
  category: string
  style: string
  colors: string[]
  description: string
}

export async function POST(request: NextRequest) {
  try {
    const body: MoodBoardGenerationRequest = await request.json()
    const { projectId, style, colorScheme, roomType, mood, preferences } = body

    // Verify project exists
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { client: true }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Create a comprehensive prompt for the AI
    const prompt = `You are an expert interior designer and visual curator. Based on the following project details, generate a comprehensive mood board with curated image suggestions and color palette.

Project Details:
- Room Type: ${roomType}
- Design Style: ${style}
- Color Scheme: ${colorScheme}
- Desired Mood: ${mood}

Additional Preferences:
- Materials: ${preferences.materials?.join(', ') || 'Not specified'}
- Furniture Styles: ${preferences.furnitureStyles?.join(', ') || 'Not specified'}
- Lighting: ${preferences.lighting?.join(', ') || 'Not specified'}
- Textures: ${preferences.textures?.join(', ') || 'Not specified'}

Please generate a mood board that includes:

1. Color Palette: Extract and suggest a cohesive color palette with primary, secondary, and accent colors in hex format.

2. Curated Images: Generate 6-8 image suggestions for the mood board. For each image, provide:
   - A descriptive title
   - Category (Furniture, Lighting, Decor, Textiles, Art, Accessories, etc.)
   - Style classification
   - Dominant colors in hex format
   - Brief description of why it fits the mood board

3. Overall Theme: A brief description of the mood board's overall theme and aesthetic direction.

Format the response as a structured JSON object with the following structure:
{
  "title": "Mood Board Title",
  "description": "Brief description of the mood board concept",
  "theme": "Overall theme description",
  "colorPalette": {
    "primary": ["#hex1", "#hex2"],
    "secondary": ["#hex3", "#hex4"],
    "accent": ["#hex5", "#hex6"]
  },
  "images": [
    {
      "title": "Image Title",
      "category": "Furniture",
      "style": "Modern",
      "colors": ["#hex1", "#hex2"],
      "description": "Description of the image and its relevance"
    }
  ]
}`

    // Generate the mood board using AI
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert interior designer with extensive experience in creating mood boards and visual concepts. You provide detailed, creative, and cohesive design recommendations.'
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
    let moodBoardData
    try {
      moodBoardData = JSON.parse(aiResponse)
    } catch (error) {
      // If JSON parsing fails, create a basic structure from the text
      moodBoardData = {
        title: `${roomType} Mood Board`,
        description: `AI-generated mood board for ${style} ${roomType}`,
        theme: aiResponse.substring(0, 200) + '...',
        colorPalette: {
          primary: ['#2C3E50', '#34495E'],
          secondary: ['#ECF0F1', '#BDC3C7'],
          accent: ['#E74C3C', '#3498DB']
        },
        images: [
          {
            title: 'Featured Furniture',
            category: 'Furniture',
            style: style,
            colors: ['#2C3E50', '#ECF0F1'],
            description: 'Key furniture piece that defines the space'
          },
          {
            title: 'Accent Lighting',
            category: 'Lighting',
            style: style,
            colors: ['#E74C3C', '#34495E'],
            description: 'Lighting that enhances the mood'
          },
          {
            title: 'Textural Elements',
            category: 'Textiles',
            style: style,
            colors: ['#BDC3C7', '#ECF0F1'],
            description: 'Textiles that add depth and comfort'
          }
        ]
      }
    }

    // Generate actual images using the AI image generation
    const generatedImages: MoodBoardImage[] = []
    for (let i = 0; i < Math.min(moodBoardData.images.length, 6); i++) {
      const imagePrompt = `Interior design ${moodBoardData.images[i].category} in ${style} style with ${colorScheme} colors, ${mood} mood, professional photography, high quality, interior design magazine style`
      
      try {
        const imageResponse = await zai.images.generations.create({
          prompt: imagePrompt,
          size: '1024x1024'
        })

        const imageBase64 = imageResponse.data[0].base64
        const imageUrl = `data:image/png;base64,${imageBase64}`

        generatedImages.push({
          url: imageUrl,
          title: moodBoardData.images[i].title,
          category: moodBoardData.images[i].category,
          style: moodBoardData.images[i].style,
          colors: moodBoardData.images[i].colors,
          description: moodBoardData.images[i].description
        })
      } catch (imageError) {
        console.error('Image generation failed:', imageError)
        // Use placeholder if image generation fails
        generatedImages.push({
          url: '/api/placeholder/400/400',
          title: moodBoardData.images[i].title,
          category: moodBoardData.images[i].category,
          style: moodBoardData.images[i].style,
          colors: moodBoardData.images[i].colors,
          description: moodBoardData.images[i].description
        })
      }
    }

    // Create or update the mood board in the database
    const moodBoard = await db.moodBoard.upsert({
      where: { projectId },
      update: {
        title: moodBoardData.title,
        description: moodBoardData.description,
        style: moodBoardData.theme,
        colorPalette: JSON.stringify(moodBoardData.colorPalette),
        images: JSON.stringify(generatedImages),
        aiGenerated: true
      },
      create: {
        projectId,
        title: moodBoardData.title,
        description: moodBoardData.description,
        style: moodBoardData.theme,
        colorPalette: JSON.stringify(moodBoardData.colorPalette),
        images: JSON.stringify(generatedImages),
        aiGenerated: true
      }
    })

    return NextResponse.json({
      message: 'Mood board generated successfully',
      moodBoard,
      moodBoardData,
      generatedImages
    })

  } catch (error) {
    console.error('AI mood board generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate mood board', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}