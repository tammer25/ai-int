import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

interface RenderGenerationRequest {
  projectId: string
  settings: {
    style: string
    lighting: string
    timeOfDay: 'day' | 'night' | 'dusk' | 'dawn'
    cameraAngle: 'front' | 'corner' | 'overhead' | 'eye-level'
    quality: 'draft' | 'medium' | 'high' | 'ultra'
    materials: string[]
  }
  roomDetails: {
    roomType: string
    dimensions: string
    keyFeatures: string[]
    colorScheme: string[]
  }
}

interface RenderData {
  title: string
  description: string
  imageUrl: string
  settings: {
    style: string
    lighting: string
    timeOfDay: string
    cameraAngle: string
    quality: string
    materials: string[]
  }
  renderSpecifications: {
    resolution: string
    format: string
    renderTime: string
    polyCount: string
    lightingSetup: string
  }
  postProcessingTips: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: RenderGenerationRequest = await request.json()
    const { projectId, settings, roomDetails } = body

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
    const prompt = `You are an expert 3D visualization artist and interior designer specializing in photorealistic renders. Based on the following project details, generate a detailed 3D render specification.

Project Details:
- Room Type: ${roomDetails.roomType}
- Dimensions: ${roomDetails.dimensions}
- Design Style: ${settings.style}
- Key Features: ${roomDetails.keyFeatures.join(', ')}
- Color Scheme: ${roomDetails.colorScheme.join(', ')}

Render Settings:
- Lighting: ${settings.lighting}
- Time of Day: ${settings.timeOfDay}
- Camera Angle: ${settings.cameraAngle}
- Quality Level: ${settings.quality}
- Materials: ${settings.materials.join(', ')}

Please generate a comprehensive 3D render specification that includes:

1. Render Concept: Detailed description of the scene composition, mood, and artistic direction.

2. Technical Specifications: Resolution, format, estimated render time, polygon count, and lighting setup details.

3. Visual Elements: Specific guidance on furniture placement, material applications, lighting positions, and camera composition.

4. Post-Processing: Recommendations for color grading, atmosphere enhancement, and final touch-ups.

Format the response as a structured JSON object with the following structure:
{
  "title": "Render Title",
  "description": "Detailed description of the render concept",
  "imageUrl": "placeholder_url",
  "settings": {
    "style": "${settings.style}",
    "lighting": "${settings.lighting}",
    "timeOfDay": "${settings.timeOfDay}",
    "cameraAngle": "${settings.cameraAngle}",
    "quality": "${settings.quality}",
    "materials": ${JSON.stringify(settings.materials)}
  },
  "renderSpecifications": {
    "resolution": "1920x1080",
    "format": "PNG",
    "renderTime": "2-4 hours",
    "polyCount": "500K-1M",
    "lightingSetup": "Detailed lighting configuration"
  },
  "postProcessingTips": ["Tip 1", "Tip 2", "Tip 3"]
}`

    // Generate the render specification using AI
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert 3D visualization artist with extensive experience in architectural visualization, interior design rendering, and photorealistic image creation. You provide detailed, technically accurate, and artistically sound render specifications.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    // Extract the AI response
    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    let renderData: RenderData
    try {
      renderData = JSON.parse(aiResponse)
    } catch (error) {
      // If JSON parsing fails, create a basic structure from the text
      renderData = {
        title: `${settings.style.charAt(0).toUpperCase() + settings.style.slice(1)} ${roomDetails.roomType} - ${settings.timeOfDay}`,
        description: `AI-generated 3D render specification for ${roomDetails.roomType}`,
        imageUrl: '/api/placeholder/800/600',
        settings: {
          style: settings.style,
          lighting: settings.lighting,
          timeOfDay: settings.timeOfDay,
          cameraAngle: settings.cameraAngle,
          quality: settings.quality,
          materials: settings.materials
        },
        renderSpecifications: {
          resolution: '1920x1080',
          format: 'PNG',
          renderTime: '2-4 hours',
          polyCount: '500K-1M',
          lightingSetup: 'Professional lighting setup'
        },
        postProcessingTips: ['Color grading', 'Atmosphere enhancement', 'Final touch-ups']
      }
    }

    // Generate actual 3D render using AI image generation
    let generatedImageUrl = renderData.imageUrl
    try {
      const renderPrompt = `Photorealistic 3D interior render of ${roomDetails.roomType} in ${settings.style} style, ${settings.lighting} lighting, ${settings.timeOfDay} time, ${settings.cameraAngle} camera angle, professional architectural photography, high quality, detailed textures, interior design magazine style`

      const imageResponse = await zai.images.generations.create({
        prompt: renderPrompt,
        size: '1024x1024'
      })

      const imageBase64 = imageResponse.data[0].base64
      generatedImageUrl = `data:image/png;base64,${imageBase64}`
    } catch (imageError) {
      console.error('Image generation failed:', imageError)
      // Keep placeholder URL if image generation fails
    }

    // Update render data with generated image
    renderData.imageUrl = generatedImageUrl

    return NextResponse.json({
      message: '3D render generated successfully',
      renderData
    })

  } catch (error) {
    console.error('AI render generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate 3D render', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}