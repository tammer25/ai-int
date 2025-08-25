import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

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

interface RouteParams {
  params: {
    id: string
  }
}

// GET single project
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const project = await db.project.findUnique({
      where: { id: params.id },
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
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Project retrieved successfully',
      project
    })

  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update project
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    const validatedData = updateProjectSchema.parse(body)

    // Check if project exists
    const existingProject = await db.project.findUnique({
      where: { id: params.id }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
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

    const updateData: any = { ...validatedData }
    if (validatedData.startDate) {
      updateData.startDate = new Date(validatedData.startDate)
    }
    if (validatedData.endDate) {
      updateData.endDate = new Date(validatedData.endDate)
    }

    const project = await db.project.update({
      where: { id: params.id },
      data: updateData,
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
      message: 'Project updated successfully',
      project
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE project
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check if project exists
    const existingProject = await db.project.findUnique({
      where: { id: params.id }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    await db.project.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Project deleted successfully'
    })

  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}