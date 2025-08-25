import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createFurnitureSchema = z.object({
  name: z.string().min(1, 'Furniture name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  dimensions: z.object({
    width: z.number().min(0),
    height: z.number().min(0),
    depth: z.number().min(0)
  }).optional(),
  style: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative').optional(),
  imageUrl: z.string().optional(),
  supplier: z.string().optional(),
  tags: z.array(z.string()).optional()
})

const updateFurnitureSchema = z.object({
  name: z.string().min(1, 'Furniture name is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  description: z.string().optional(),
  dimensions: z.object({
    width: z.number().min(0),
    height: z.number().min(0),
    depth: z.number().min(0)
  }).optional(),
  style: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative').optional(),
  imageUrl: z.string().optional(),
  supplier: z.string().optional(),
  tags: z.array(z.string()).optional()
})

// GET all furniture
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const style = searchParams.get('style')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    const whereClause: any = {}
    if (category && category !== 'all') {
      whereClause.category = category
    }
    if (style && style !== 'all') {
      whereClause.style = style
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

    const furniture = await db.furniture.findMany({
      where: whereClause,
      orderBy,
      take: 100 // Limit results for performance
    })

    return NextResponse.json({
      message: 'Furniture retrieved successfully',
      furniture
    })

  } catch (error) {
    console.error('Get furniture error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new furniture
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createFurnitureSchema.parse(body)

    const furniture = await db.furniture.create({
      data: {
        name: validatedData.name,
        category: validatedData.category,
        description: validatedData.description,
        dimensions: validatedData.dimensions ? JSON.stringify(validatedData.dimensions) : null,
        style: validatedData.style,
        color: validatedData.color,
        material: validatedData.material,
        price: validatedData.price,
        imageUrl: validatedData.imageUrl,
        supplier: validatedData.supplier,
        tags: validatedData.tags ? JSON.stringify(validatedData.tags) : null
      }
    })

    return NextResponse.json({
      message: 'Furniture created successfully',
      furniture
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create furniture error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}