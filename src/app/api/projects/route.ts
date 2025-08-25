import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().optional(),
  location: z.string().optional(),
  budget: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  clientId: z.string().min(1, 'Client ID is required'),
  designerId: z.string().optional()
})

const updateProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required').optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  budget: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED']).optional(),
  designerId: z.string().optional()
})

// GET all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const designerId = searchParams.get('designerId')
    const status = searchParams.get('status')

    const whereClause: any = {}
    if (clientId) whereClause.clientId = clientId
    if (designerId) whereClause.designerId = designerId
    if (status) whereClause.status = status

    const projects = await db.project.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true
          }
        },
        designer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true
          }
        },
        brief: true,
        analysis: true,
        moodBoard: true,
        layout: true,
        boq: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json({
      message: 'Projects retrieved successfully',
      projects
    })

  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    // Verify client exists
    const client = await db.user.findUnique({
      where: { id: validatedData.clientId }
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    // If designerId is provided, verify designer exists
    if (validatedData.designerId) {
      const designer = await db.user.findUnique({
        where: { id: validatedData.designerId }
      })

      if (!designer) {
        return NextResponse.json(
          { error: 'Designer not found' },
          { status: 404 }
        )
      }
    }

    const project = await db.project.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        location: validatedData.location,
        budget: validatedData.budget,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        clientId: validatedData.clientId,
        designerId: validatedData.designerId
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true
          }
        },
        designer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Project created successfully',
      project
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}