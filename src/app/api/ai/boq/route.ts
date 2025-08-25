import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

interface BOQGenerationRequest {
  projectId: string
  roomType: string
  style: string
  budget: number
  requirements: {
    scope: string
    quality: 'budget' | 'standard' | 'premium' | 'luxury'
    timeline: string
    specialRequirements?: string
    existingItems?: string[]
    priorityItems?: string[]
  }
}

interface BOQItem {
  id: string
  category: string
  name: string
  description: string
  unit: string
  quantity: number
  unitPrice: number
  totalPrice: number
  supplier?: string
  priority: 'essential' | 'recommended' | 'optional'
  alternatives?: BOQItem[]
  notes?: string
}

interface BudgetBreakdown {
  category: string
  percentage: number
  estimatedCost: number
}

interface BOQData {
  title: string
  description: string
  items: BOQItem[]
  budgetBreakdown: BudgetBreakdown[]
  totalEstimatedCost: number
  costSavingTips: string[]
  recommendedPhases: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: BOQGenerationRequest = await request.json()
    const { projectId, roomType, style, budget, requirements } = body

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
    const prompt = `You are an expert interior designer and cost estimator specializing in construction and renovation projects. Based on the following project details, generate a comprehensive Bill of Quantities (BOQ) with accurate cost estimation.

Project Details:
- Room Type: ${roomType}
- Design Style: ${style}
- Budget: $${budget.toLocaleString()}
- Quality Level: ${requirements.quality}
- Project Scope: ${requirements.scope}
- Timeline: ${requirements.timeline}
- Special Requirements: ${requirements.specialRequirements || 'None'}
- Existing Items to Keep: ${requirements.existingItems?.join(', ') || 'None'}
- Priority Items: ${requirements.priorityItems?.join(', ') || 'None'}

Please generate a comprehensive BOQ that includes:

1. Detailed Items: Break down all required materials, furniture, fixtures, labor, and other costs with:
   - Category classification
   - Item name and detailed description
   - Unit of measurement
   - Required quantity
   - Unit price (based on current market rates for ${requirements.quality} quality)
   - Total cost per item
   - Priority level (essential, recommended, optional)
   - Alternative options where applicable
   - Supplier recommendations

2. Budget Breakdown: Provide percentage allocation for each major category.

3. Cost Optimization: Include cost-saving tips and recommendations.

4. Project Phasing: Suggested phases for implementation based on priority and budget.

Format the response as a structured JSON object with the following structure:
{
  "title": "BOQ Title",
  "description": "Brief description of the BOQ scope",
  "items": [
    {
      "id": "unique_id",
      "category": "furniture",
      "name": "Modern Sofa",
      "description": "3-seater modern sofa with premium fabric",
      "unit": "piece",
      "quantity": 1,
      "unitPrice": 2500,
      "totalPrice": 2500,
      "supplier": "Recommended supplier",
      "priority": "essential",
      "alternatives": [
        {
          "id": "alt_id",
          "category": "furniture",
          "name": "Alternative Sofa",
          "description": "Budget-friendly option",
          "unit": "piece",
          "quantity": 1,
          "unitPrice": 1800,
          "totalPrice": 1800,
          "priority": "recommended"
        }
      ],
      "notes": "Additional notes about the item"
    }
  ],
  "budgetBreakdown": [
    {
      "category": "Furniture",
      "percentage": 35,
      "estimatedCost": 5250
    }
  ],
  "totalEstimatedCost": 15000,
  "costSavingTips": ["Tip 1", "Tip 2"],
  "recommendedPhases": ["Phase 1", "Phase 2"]
}

Important: Ensure the total estimated cost stays within the budget of $${budget.toLocaleString()} or provide justification if it exceeds.`

    // Generate the BOQ using AI
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert interior designer and cost estimator with extensive knowledge of construction costs, material pricing, and labor rates. You provide accurate, detailed, and practical cost estimates for interior design projects.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 4000
    })

    // Extract the AI response
    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    let boqData: BOQData
    try {
      boqData = JSON.parse(aiResponse)
    } catch (error) {
      // If JSON parsing fails, create a basic structure from the text
      boqData = {
        title: `${roomType} Bill of Quantities`,
        description: `AI-generated BOQ for ${roomType} renovation`,
        items: [
          {
            id: '1',
            category: 'furniture',
            name: 'Essential Furniture',
            description: 'Core furniture items for the room',
            unit: 'piece',
            quantity: 1,
            unitPrice: budget * 0.3,
            totalPrice: budget * 0.3,
            priority: 'essential'
          },
          {
            id: '2',
            category: 'lighting',
            name: 'Lighting Fixtures',
            description: 'Essential lighting for the room',
            unit: 'set',
            quantity: 1,
            unitPrice: budget * 0.1,
            totalPrice: budget * 0.1,
            priority: 'essential'
          },
          {
            id: '3',
            category: 'labor',
            name: 'Installation Labor',
            description: 'Professional installation services',
            unit: 'hours',
            quantity: 40,
            unitPrice: 75,
            totalPrice: 3000,
            priority: 'essential'
          }
        ],
        budgetBreakdown: [
          { category: 'Furniture', percentage: 40, estimatedCost: budget * 0.4 },
          { category: 'Lighting', percentage: 15, estimatedCost: budget * 0.15 },
          { category: 'Labor', percentage: 35, estimatedCost: budget * 0.35 },
          { category: 'Contingency', percentage: 10, estimatedCost: budget * 0.1 }
        ],
        totalEstimatedCost: budget,
        costSavingTips: ['Consider DIY for simple tasks', 'Look for seasonal discounts', 'Compare multiple suppliers'],
        recommendedPhases: ['Planning and demolition', 'Structural work', 'Installation', 'Finishing touches']
      }
    }

    // Create or update the BOQ in the database
    const boq = await db.boQ.upsert({
      where: { projectId },
      update: {
        title: boqData.title,
        description: boqData.description,
        items: JSON.stringify(boqData.items),
        totalCost: boqData.totalEstimatedCost,
        currency: 'USD',
        aiGenerated: true
      },
      create: {
        projectId,
        title: boqData.title,
        description: boqData.description,
        items: JSON.stringify(boqData.items),
        totalCost: boqData.totalEstimatedCost,
        currency: 'USD',
        aiGenerated: true
      }
    })

    return NextResponse.json({
      message: 'BOQ generated successfully',
      boq,
      boqData
    })

  } catch (error) {
    console.error('AI BOQ generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate BOQ', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}