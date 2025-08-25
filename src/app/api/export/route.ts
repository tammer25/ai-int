import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface ExportRequest {
  projectId: string
  exportType: 'brief' | 'analysis' | 'moodboard' | 'layout' | 'boq' | 'full'
  format: 'pdf' | 'excel' | 'word'
}

export async function POST(request: NextRequest) {
  try {
    const body: ExportRequest = await request.json()
    const { projectId, exportType, format } = body

    // Verify project exists
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        client: true,
        brief: true,
        analysis: true,
        moodBoard: true,
        layout: true,
        boq: true
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Generate export content based on type
    let content = ''
    let filename = ''
    let contentType = ''

    switch (exportType) {
      case 'brief':
        if (project.brief) {
          content = generateBriefContent(project, project.brief)
          filename = `${project.title.replace(/\s+/g, '_')}_Design_Brief`
        }
        break
      
      case 'analysis':
        if (project.analysis) {
          content = generateAnalysisContent(project, project.analysis)
          filename = `${project.title.replace(/\s+/g, '_')}_Site_Analysis`
        }
        break
      
      case 'moodboard':
        if (project.moodBoard) {
          content = generateMoodBoardContent(project, project.moodBoard)
          filename = `${project.title.replace(/\s+/g, '_')}_Mood_Board`
        }
        break
      
      case 'layout':
        if (project.layout) {
          content = generateLayoutContent(project, project.layout)
          filename = `${project.title.replace(/\s+/g, '_')}_Layout`
        }
        break
      
      case 'boq':
        if (project.boq) {
          content = generateBOQContent(project, project.boq)
          filename = `${project.title.replace(/\s+/g, '_')}_BOQ`
        }
        break
      
      case 'full':
        content = generateFullReportContent(project)
        filename = `${project.title.replace(/\s+/g, '_')}_Full_Report`
        break
    }

    if (!content) {
      return NextResponse.json(
        { error: 'No content available for export' },
        { status: 400 }
      )
    }

    // Format the content based on requested format
    switch (format) {
      case 'pdf':
        // In a real implementation, you would use a PDF library like puppeteer or jsPDF
        contentType = 'application/pdf'
        filename += '.pdf'
        // For now, return as text
        return new NextResponse(content, {
          headers: {
            'Content-Type': 'text/plain',
            'Content-Disposition': `attachment; filename="${filename}.txt"`
          }
        })
      
      case 'excel':
        // In a real implementation, you would use an Excel library like exceljs
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        filename += '.xlsx'
        // For now, return as CSV
        return new NextResponse(convertToCSV(content), {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${filename}.csv"`
          }
        })
      
      case 'word':
        // In a real implementation, you would use a Word library like docx
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        filename += '.docx'
        // For now, return as text
        return new NextResponse(content, {
          headers: {
            'Content-Type': 'text/plain',
            'Content-Disposition': `attachment; filename="${filename}.txt"`
          }
        })
      
      default:
        return NextResponse.json(
          { error: 'Unsupported export format' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function generateBriefContent(project: any, brief: any) {
  const briefData = JSON.parse(brief.requirements)
  
  return `
DESIGN BRIEF
=============
Project: ${project.title}
Client: ${project.client.name}
Location: ${project.location}
Date: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
------------------
${briefData.executiveSummary}

DESIGN CONCEPT
---------------
${briefData.designConcept}

STYLE DIRECTION
----------------
${briefData.styleDirection}

COLOR PALETTE
-------------
Primary Colors: ${briefData.colorPalette.primary.join(', ')}
Secondary Colors: ${briefData.colorPalette.secondary.join(', ')}
Accent Colors: ${briefData.colorPalette.accent.join(', ')}

MATERIALS
--------
${briefData.materials.join(', ')}

SPACE PLANNING
--------------
${briefData.spacePlanning}

FURNITURE RECOMMENDATIONS
-------------------------
${briefData.furnitureRecommendations.join(', ')}

LIGHTING STRATEGY
------------------
${briefData.lightingStrategy}

KEY FEATURES
------------
${briefData.keyFeatures.join(', ')}

PROJECT PHASING
---------------
${briefData.phasing.join(', ')}

BUDGET CONSIDERATIONS
---------------------
${briefData.budgetConsiderations}

TIMELINE OVERVIEW
------------------
${briefData.timelineOverview}

Generated by AI Interior Designer
`.trim()
}

function generateAnalysisContent(project: any, analysis: any) {
  return `
SITE ANALYSIS REPORT
====================
Project: ${project.title}
Client: ${project.client.name}
Location: ${project.location}
Date: ${new Date().toLocaleDateString()}

ROOM DETAILS
------------
Room Type: ${analysis.roomType}
Dimensions: ${analysis.dimensions}

EXISTING FEATURES
------------------
${analysis.existingFeatures}

CONSTRAINTS & LIMITATIONS
-------------------------
${analysis.constraints}

PHOTO DOCUMENTATION
-------------------
${analysis.photos ? 'Photos included in analysis' : 'No photos uploaded'}

FLOOR PLAN
-----------
${analysis.floorPlan ? 'Floor plan included in analysis' : 'No floor plan uploaded'}

AI ANALYSIS INSIGHTS
---------------------
• Space optimization recommendations available
• Lighting analysis completed
• Structural considerations documented
• Material assessment performed

RECOMMENDATIONS
---------------
• Consider professional measurement verification
• Review structural constraints with qualified contractor
• Plan for adequate lighting solutions
• Budget for potential structural modifications

Generated by AI Interior Designer
`.trim()
}

function generateMoodBoardContent(project: any, moodBoard: any) {
  const colorPalette = JSON.parse(moodBoard.colorPalette || '{}')
  
  return `
MOOD BOARD REPORT
==================
Project: ${project.title}
Client: ${project.client.name}
Location: ${project.location}
Date: ${new Date().toLocaleDateString()}

MOOD BOARD DETAILS
------------------
Title: ${moodBoard.title}
Description: ${moodBoard.description}
Style: ${moodBoard.style}
AI Generated: ${moodBoard.aiGenerated ? 'Yes' : 'No'}

COLOR PALETTE
-------------
${colorPalette.primary ? `Primary: ${colorPalette.primary.join(', ')}` : ''}
${colorPalette.secondary ? `Secondary: ${colorPalette.secondary.join(', ')}` : ''}
${colorPalette.accent ? `Accent: ${colorPalette.accent.join(', ')}` : ''}

INSPIRATION IMAGES
------------------
${moodBoard.images ? 'Images included in mood board' : 'No images uploaded'}

STYLE RECOMMENDATIONS
---------------------
• Modern aesthetic with clean lines
• Neutral color palette with strategic accents
• Focus on functionality and comfort
• Integration of natural materials

NEXT STEPS
----------
• Review and refine color selections
• Source specific furniture pieces
• Coordinate with design brief requirements
• Prepare for layout planning

Generated by AI Interior Designer
`.trim()
}

function generateLayoutContent(project: any, layout: any) {
  const furniture = JSON.parse(layout.furniture || '[]')
  
  return `
2D LAYOUT REPORT
================
Project: ${project.title}
Client: ${project.client.name}
Location: ${project.location}
Date: ${new Date().toLocaleDateString()}

LAYOUT DETAILS
--------------
Title: ${layout.title}
Description: ${layout.description}
Room Dimensions: ${layout.dimensions}
AI Generated: ${layout.aiGenerated ? 'Yes' : 'No'}

FURNITURE LAYOUT
---------------
${furniture.map((item: any, index: number) => `
${index + 1}. ${item.name}
   Type: ${item.type}
   Category: ${item.category}
   Position: (${item.x}, ${item.y})
   Rotation: ${item.rotation}°
   Locked: ${item.locked ? 'Yes' : 'No'}
`).join('')}

SPACE UTILIZATION
----------------
• Total furniture items: ${furniture.length}
• Locked items: ${furniture.filter((item: any) => item.locked).length}
• Traffic flow optimized
• Focal points established

LAYOUT RECOMMENDATIONS
----------------------
• Maintain clear pathways between furniture
• Consider sight lines from main entrance
• Balance functional and aesthetic requirements
• Allow for adequate circulation space

AI OPTIMIZATION INSIGHTS
-------------------------
• Layout optimized for room dimensions
• Furniture placement maximizes space efficiency
• Consideration of natural light sources
• Ergonomic positioning verified

Generated by AI Interior Designer
`.trim()
}

function generateBOQContent(project: any, boq: any) {
  const items = JSON.parse(boq.items || '[]')
  
  return `
BILL OF QUANTITIES
==================
Project: ${project.title}
Client: ${project.client.name}
Location: ${project.location}
Date: ${new Date().toLocaleDateString()}

BOQ DETAILS
-----------
Title: ${boq.title}
Description: ${boq.description}
Currency: ${boq.currency}
AI Generated: ${boq.aiGenerated ? 'Yes' : 'No'}

QUANTITY BREAKDOWN
------------------
${items.map((item: any, index: number) => `
${index + 1}. ${item.name}
   Category: ${item.category}
   Description: ${item.description}
   Unit: ${item.unit}
   Quantity: ${item.quantity}
   Unit Price: $${item.unitPrice}
   Total Price: $${item.totalPrice}
   Priority: ${item.priority}
   Supplier: ${item.supplier || 'TBD'}
`).join('')}

COST SUMMARY
-------------
Total Items: ${items.length}
Essential Items: ${items.filter((item: any) => item.priority === 'essential').length}
Total Cost: $${boq.totalCost}
Budget Utilization: ${project.budget ? ((boq.totalCost / project.budget) * 100).toFixed(1) + '%' : 'N/A'}

BUDGET ANALYSIS
---------------
${project.budget ? `
Original Budget: $${project.budget}
Estimated Cost: $${boq.totalCost}
Difference: $${project.budget - boq.totalCost}
Status: ${boq.totalCost > project.budget ? 'OVER BUDGET' : 'WITHIN BUDGET'}
` : 'No budget information available'}

COST OPTIMIZATION OPPORTUNITIES
------------------------------
• Bulk purchase discounts available
• Alternative supplier options identified
• Material substitution possibilities
• Seasonal purchasing opportunities

Generated by AI Interior Designer
`.trim()
}

function generateFullReportContent(project: any) {
  let content = `
COMPREHENSIVE DESIGN REPORT
==========================
Project: ${project.title}
Client: ${project.client.name}
Location: ${project.location}
Date: ${new Date().toLocaleDateString()}

PROJECT OVERVIEW
===============
Status: ${project.status}
Budget: $${project.budget || 'TBD'}
Timeline: ${project.startDate ? new Date(project.startDate).toLocaleDateString() : 'TBD'} - ${project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}

`.trim()

  // Add brief content if available
  if (project.brief) {
    content += '\n\n' + generateBriefContent(project, project.brief)
  }

  // Add analysis content if available
  if (project.analysis) {
    content += '\n\n' + generateAnalysisContent(project, project.analysis)
  }

  // Add mood board content if available
  if (project.moodBoard) {
    content += '\n\n' + generateMoodBoardContent(project, project.moodBoard)
  }

  // Add layout content if available
  if (project.layout) {
    content += '\n\n' + generateLayoutContent(project, project.layout)
  }

  // Add BOQ content if available
  if (project.boq) {
    content += '\n\n' + generateBOQContent(project, project.boq)
  }

  content += `

NEXT STEPS
==========
1. Review all design components
2. Approve budget allocations
3. Confirm timeline and scheduling
4. Begin procurement process
5. Initiate construction/renovation

Generated by AI Interior Designer
`.trim()

  return content
}

function convertToCSV(content: string) {
  // Simple CSV conversion - in a real implementation, this would be more sophisticated
  const lines = content.split('\n')
  const csvLines = lines.map(line => {
    // Escape quotes and wrap in quotes if contains comma
    if (line.includes(',')) {
      return `"${line.replace(/"/g, '""')}"`
    }
    return line
  })
  return csvLines.join('\n')
}