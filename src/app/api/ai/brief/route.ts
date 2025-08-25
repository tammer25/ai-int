import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

interface BriefGenerationRequest {
  projectId: string
  consultationData: {
    projectName: string
    projectType: string
    location: string
    roomType: string
    roomDimensions: string
    preferredStyle: string[]
    colorScheme: string
    favoriteColors: string
    dislikedColors: string
    mood: string
    primaryUse: string
    occupants: number
    specialNeeds: string
    storageNeeds: string[]
    lightingPreferences: string[]
    budget: string
    timeline: string
    priority: string
    existingFurniture: string
    keepItems: string[]
    removeItems: string[]
    inspirationSources: string[]
    specificRequirements: string
    additionalNotes: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BriefGenerationRequest = await request.json()
    const { projectId, consultationData } = body

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
    const prompt = `You are an expert interior designer. Based on the following client consultation data, generate a comprehensive design brief for an interior design project.

Project Details:
- Project Name: ${consultationData.projectName}
- Project Type: ${consultationData.projectType}
- Location: ${consultationData.location}
- Room Type: ${consultationData.roomType}
- Room Dimensions: ${consultationData.roomDimensions}

Style Preferences:
- Preferred Styles: ${consultationData.preferredStyle.join(', ')}
- Color Scheme: ${consultationData.colorScheme}
- Favorite Colors: ${consultationData.favoriteColors}
- Disliked Colors: ${consultationData.dislikedColors}
- Desired Mood: ${consultationData.mood}

Functional Requirements:
- Primary Use: ${consultationData.primaryUse}
- Number of Occupants: ${consultationData.occupants}
- Special Needs: ${consultationData.specialNeeds}
- Storage Needs: ${consultationData.storageNeeds.join(', ')}
- Lighting Preferences: ${consultationData.lightingPreferences.join(', ')}

Budget & Timeline:
- Budget Range: ${consultationData.budget}
- Timeline: ${consultationData.timeline}
- Priority: ${consultationData.priority}

Existing Elements:
- Existing Furniture: ${consultationData.existingFurniture}
- Items to Keep: ${consultationData.keepItems.join(', ')}
- Items to Remove: ${consultationData.removeItems.join(', ')}

Additional Information:
- Inspiration Sources: ${consultationData.inspirationSources.join(', ')}
- Specific Requirements: ${consultationData.specificRequirements}
- Additional Notes: ${consultationData.additionalNotes}

Please generate a comprehensive design brief that includes:
1. Executive Summary
2. Design Concept & Vision
3. Style Direction
4. Color Palette Recommendations
5. Material & Finish Suggestions
6. Space Planning Recommendations
7. Furniture & Fixture Recommendations
8. Lighting Design Strategy
9. Key Design Features
10. Project Phasing Recommendations
11. Budget Considerations
12. Timeline Overview

Format the response as a structured JSON object with the following structure:
{
  "title": "Design Brief Title",
  "description": "Brief description of the project",
  "executiveSummary": "Executive summary text",
  "designConcept": "Design concept and vision",
  "styleDirection": "Style direction details",
  "colorPalette": {
    "primary": ["color1", "color2"],
    "secondary": ["color3", "color4"],
    "accent": ["color5"]
  },
  "materials": ["material1", "material2", "material3"],
  "spacePlanning": "Space planning recommendations",
  "furnitureRecommendations": ["furniture1", "furniture2", "furniture3"],
  "lightingStrategy": "Lighting design strategy",
  "keyFeatures": ["feature1", "feature2", "feature3"],
  "phasing": ["phase1", "phase2", "phase3"],
  "budgetConsiderations": "Budget considerations",
  "timelineOverview": "Timeline overview"
}`

    // Generate the design brief using AI
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert interior designer with extensive experience in residential and commercial design. You provide detailed, practical, and creative design recommendations.'
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
    let briefData
    try {
      briefData = JSON.parse(aiResponse)
    } catch (error) {
      // If JSON parsing fails, create a basic structure from the text
      briefData = {
        title: `${consultationData.projectName} Design Brief`,
        description: `AI-generated design brief for ${consultationData.roomType}`,
        executiveSummary: aiResponse.substring(0, 500) + '...',
        designConcept: aiResponse,
        styleDirection: consultationData.preferredStyle.join(', '),
        colorPalette: {
          primary: consultationData.favoriteColors.split(',').slice(0, 2),
          secondary: ['neutral'],
          accent: ['accent']
        },
        materials: ['wood', 'metal', 'fabric'],
        spacePlanning: 'Based on room dimensions and requirements',
        furnitureRecommendations: ['essential furniture items'],
        lightingStrategy: 'Based on lighting preferences',
        keyFeatures: ['key design features'],
        phasing: ['planning', 'implementation', 'finalization'],
        budgetConsiderations: `Budget range: ${consultationData.budget}`,
        timelineOverview: `Timeline: ${consultationData.timeline}`
      }
    }

    // Create or update the design brief in the database
    const designBrief = await db.designBrief.upsert({
      where: { projectId },
      update: {
        title: briefData.title,
        description: briefData.description,
        style: briefData.styleDirection,
        colorScheme: JSON.stringify(briefData.colorPalette),
        budget: parseFloat(consultationData.budget.replace(/[^0-9.]/g, '')) || 0,
        timeline: consultationData.timeline,
        requirements: JSON.stringify(briefData),
        aiGenerated: true
      },
      create: {
        projectId,
        title: briefData.title,
        description: briefData.description,
        style: briefData.styleDirection,
        colorScheme: JSON.stringify(briefData.colorPalette),
        budget: parseFloat(consultationData.budget.replace(/[^0-9.]/g, '')) || 0,
        timeline: consultationData.timeline,
        requirements: JSON.stringify(briefData),
        aiGenerated: true
      }
    })

    // Update project status
    await db.project.update({
      where: { id: projectId },
      data: { status: 'IN_PROGRESS' }
    })

    return NextResponse.json({
      message: 'Design brief generated successfully',
      brief: designBrief,
      briefData: briefData
    })

  } catch (error) {
    console.error('AI brief generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate design brief', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}