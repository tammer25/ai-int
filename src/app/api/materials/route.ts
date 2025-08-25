import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createMaterialSchema = z.object({
  name: z.string().min(1, 'Material name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  color: z.string().optional(),
  texture: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative').optional(),
  unit: z.string().default('sq ft'),
  imageUrl: z.string().optional(),
  supplier: z.string().optional(),
  sustainability: z.string().optional(),
  tags: z.array(z.string()).optional()
})

const updateMaterialSchema = z.object({
  name: z.string().min(1, 'Material name is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  texture: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative').optional(),
  unit: z.string().optional(),
  imageUrl: z.string().optional(),
  supplier: z.string().optional(),
  sustainability: z.string().optional(),
  tags: z.array(z.string()).optional()
})

// GET all materials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    const whereClause: any = {}
    if (category && category !== 'all') {
      whereClause.category = category
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { supplier: { contains: search, mode: 'insensitive' } }
      ]
    }

    const orderBy: any = {}
    orderBy[sortBy] = sortOrder.toLowerCase()

    const materials = await db.material.findMany({
      where: whereClause,
      orderBy,
      take: 100 // Limit results for performance
    })

    return NextResponse.json({
      message: 'Materials retrieved successfully',
      materials
    })

  } catch (error) {
    console.error('Get materials error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new material
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createMaterialSchema.parse(body)

    const material = await db.material.create({
      data: {
        name: validatedData.name,
        category: validatedData.category,
        description: validatedData.description,
        color: validatedData.color,
        texture: validatedData.texture,
        price: validatedData.price,
        unit: validatedData.unit,
        imageUrl: validatedData.imageUrl,
        supplier: validatedData.supplier,
        sustainability: validatedData.sustainability,
        tags: validatedData.tags ? JSON.stringify(validatedData.tags) : null
      }
    })

    return NextResponse.json({
      message: 'Material created successfully',
      material
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create material error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}