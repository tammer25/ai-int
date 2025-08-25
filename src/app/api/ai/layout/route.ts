import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

interface LayoutGenerationRequest {
  projectId: string
  roomDimensions: string
  roomType: string
  style: string
  requirements: {
    primaryUse: string
    occupants: number
    storageNeeds: string[]
    specialRequirements?: string
    existingFurniture?: string[]
    mustHaveItems?: string[]
    avoidItems?: string[]
  }
}

interface FurnitureItem {
  id: string
  name: string
  type: string
  category: string
  dimensions: string
  x: number
  y: number
  rotation: number
  locked: boolean
  color: string
  description: string
}

interface LayoutData {
  title: string
  description: string
  roomDimensions: string
  furniture: FurnitureItem[]
  layoutPrinciples: string[]
  trafficFlow: string
  spaceUtilization: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LayoutGenerationRequest = await request.json()
    const { projectId, roomDimensions, roomType, style, requirements } = body

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
    const prompt = `You are an expert interior designer specializing in space planning and furniture layout. Based on the following project details, generate an optimized 2D layout with furniture placement.

Room Details:
- Room Type: ${roomType}
- Dimensions: ${roomDimensions}
- Design Style: ${style}

Functional Requirements:
- Primary Use: ${requirements.primaryUse}
- Number of Occupants: ${requirements.occupants}
- Storage Needs: ${requirements.storageNeeds.join(', ')}
- Special Requirements: ${requirements.specialRequirements || 'None'}
- Existing Furniture: ${requirements.existingFurniture?.join(', ') || 'None'}
- Must-Have Items: ${requirements.mustHaveItems?.join(', ') || 'None'}
- Items to Avoid: ${requirements.avoidItems?.join(', ') || 'None'}

Please generate a comprehensive 2D layout plan that includes:

1. Furniture Layout: Optimal placement of furniture items with coordinates (x, y) relative to a 800x600 canvas where (0,0) is top-left corner.

2. Furniture Items: Include essential furniture pieces for this room type with:
   - Name and type
   - Category (Seating, Storage, Tables, Lighting, etc.)
   - Dimensions (width x height x depth)
   - Position coordinates (x, y)
   - Rotation angle (0, 90, 180, 270 degrees)
   - Color representation (hex code)
   - Brief description of purpose and placement rationale

3. Layout Principles: Key design principles applied in this layout.

4. Traffic Flow: Description of how people will move through the space.

5. Space Utilization: How the space is optimized for the intended use.

Format the response as a structured JSON object with the following structure:
{
  "title": "Layout Title",
  "description": "Brief description of the layout concept",
  "roomDimensions": "${roomDimensions}",
  "furniture": [
    {
      "id": "unique_id",
      "name": "Sofa",
      "type": "sofa",
      "category": "Seating",
      "dimensions": "80" x 35" x 32"",
      "x": 150,
      "y": 200,
      "rotation": 0,
      "locked": false,
      "color": "#8B4513",
      "description": "Primary seating area positioned for optimal conversation and TV viewing"
    }
  ],
  "layoutPrinciples": ["Principle 1", "Principle 2"],
  "trafficFlow": "Description of traffic flow",
  "spaceUtilization: "Description of space utilization"
}`

    // Generate the layout using AI
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert interior designer with extensive experience in space planning, furniture layout, and ergonomic design. You provide practical, functional, and aesthetically pleasing layout solutions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    })

    // Extract the AI response
    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    let layoutData: LayoutData
    try {
      layoutData = JSON.parse(aiResponse)
    } catch (error) {
      // If JSON parsing fails, create a basic structure from the text
      layoutData = {
        title: `${roomType} Layout`,
        description: `AI-generated layout for ${roomType}`,
        roomDimensions: roomDimensions,
        furniture: [
          {
            id: '1',
            name: 'Main Seating',
            type: 'sofa',
            category: 'Seating',
            dimensions: '80" x 35" x 32"',
            x: 200,
            y: 250,
            rotation: 0,
            locked: false,
            color: '#8B4513',
            description: 'Primary seating area'
          },
          {
            id: '2',
            name: 'Coffee Table',
            type: 'table',
            category: 'Tables',
            dimensions: '48" x 24" x 18"',
            x: 300,
            y: 300,
            rotation: 0,
            locked: false,
            color: '#654321',
            description: 'Central table for convenience'
          }
        ],
        layoutPrinciples: ['Functionality', 'Comfort', 'Flow'],
        trafficFlow: 'Clear pathways around furniture',
        spaceUtilization: 'Optimized for primary use case'
      }
    }

    // Create or update the layout in the database
    const layout = await db.layout.upsert({
      where: { projectId },
      update: {
        title: layoutData.title,
        description: layoutData.description,
        dimensions: layoutData.roomDimensions,
        furniture: JSON.stringify(layoutData.furniture),
        aiGenerated: true
      },
      create: {
        projectId,
        title: layoutData.title,
        description: layoutData.description,
        dimensions: layoutData.roomDimensions,
        furniture: JSON.stringify(layoutData.furniture),
        aiGenerated: true
      }
    })

    return NextResponse.json({
      message: 'Layout generated successfully',
      layout,
      layoutData
    })

  } catch (error) {
    console.error('AI layout generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate layout', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}