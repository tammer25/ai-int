import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create sample users
  const hashedPassword = await hash('password123', 12)
  
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'CLIENT',
    },
  })

  const designer = await prisma.user.upsert({
    where: { email: 'designer@example.com' },
    update: {},
    create: {
      email: 'designer@example.com',
      name: 'Jane Smith',
      password: hashedPassword,
      role: 'DESIGNER',
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      title: 'Modern Living Room',
      description: 'Complete renovation of living room with modern aesthetic',
      status: 'IN_PROGRESS',
      clientId: client.id,
      designerId: designer.id,
      location: 'New York, NY',
      budget: 15000,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-03-15'),
    },
  })

  const project2 = await prisma.project.create({
    data: {
      title: 'Home Office Design',
      description: 'Functional and ergonomic home office space',
      status: 'PLANNING',
      clientId: client.id,
      location: 'Home Office',
      budget: 8000,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-28'),
    },
  })

  // Create sample materials
  const materials = [
    {
      name: 'Oak Hardwood Flooring',
      category: 'flooring',
      description: 'Premium solid oak hardwood flooring with natural finish',
      color: '#8B4513',
      texture: 'smooth',
      price: 8.50,
      unit: 'sq ft',
      supplier: 'WoodCraft Inc.',
      sustainability: 'FSC Certified',
      tags: JSON.stringify(['hardwood', 'natural', 'durable']),
    },
    {
      name: 'Marble Countertop',
      category: 'countertop',
      description: 'Carrara marble with elegant veining',
      color: '#F8F8FF',
      texture: 'polished',
      price: 85.00,
      unit: 'sq ft',
      supplier: 'Stone Masters',
      sustainability: 'Natural Stone',
      tags: JSON.stringify(['marble', 'luxury', 'classic']),
    },
    {
      name: 'Velvet Upholstery Fabric',
      category: 'textile',
      description: 'Premium velvet fabric in deep emerald green',
      color: '#50C878',
      texture: 'velvet',
      price: 45.00,
      unit: 'yard',
      supplier: 'Fabric House',
      sustainability: 'OEKO-TEX Certified',
      tags: JSON.stringify(['velvet', 'upholstery', 'luxury']),
    },
    {
      name: 'Premium Paint',
      category: 'paint',
      description: 'High-quality interior paint with primer included',
      color: '#FFFFFF',
      texture: 'matte',
      price: 65.00,
      unit: 'gallon',
      supplier: 'Paint Store',
      sustainability: 'Low VOC',
      tags: JSON.stringify(['paint', 'interior', 'eco-friendly']),
    },
  ]

  for (const material of materials) {
    await prisma.material.create({
      data: material,
    })
  }

  // Create sample furniture
  const furnitureItems = [
    {
      name: 'Modern Sectional Sofa',
      category: 'seating',
      description: 'Contemporary L-shaped sectional with clean lines',
      dimensions: JSON.stringify({ width: 120, height: 32, depth: 85 }),
      style: 'modern',
      color: 'gray',
      material: 'fabric',
      price: 2499.00,
      supplier: 'Modern Living',
      tags: JSON.stringify(['sectional', 'modern', 'L-shaped']),
    },
    {
      name: 'Scandinavian Dining Table',
      category: 'tables',
      description: 'Light oak dining table for 6 people',
      dimensions: JSON.stringify({ width: 72, height: 30, depth: 36 }),
      style: 'scandinavian',
      color: 'light oak',
      material: 'wood',
      price: 1299.00,
      supplier: 'Nordic Designs',
      tags: JSON.stringify(['dining', 'scandinavian', 'oak']),
    },
    {
      name: 'Industrial Floor Lamp',
      category: 'lighting',
      description: 'Metal floor lamp with adjustable arm',
      dimensions: JSON.stringify({ width: 12, height: 72, depth: 12 }),
      style: 'industrial',
      color: 'black',
      material: 'metal',
      price: 299.00,
      supplier: 'Light Works',
      tags: JSON.stringify(['floor lamp', 'industrial', 'adjustable']),
    },
    {
      name: 'Ergonomic Office Chair',
      category: 'seating',
      description: 'Comfortable ergonomic chair for long work sessions',
      dimensions: JSON.stringify({ width: 24, height: 48, depth: 24 }),
      style: 'modern',
      color: 'black',
      material: 'mesh',
      price: 599.00,
      supplier: 'Office Essentials',
      tags: JSON.stringify(['office', 'ergonomic', 'mesh']),
    },
  ]

  for (const furniture of furnitureItems) {
    await prisma.furniture.create({
      data: furniture,
    })
  }

  // Create sample design brief for project 1
  const briefData = {
    title: 'Modern Living Room Design Brief',
    description: 'AI-generated design brief for modern living room renovation',
    style: 'Modern, Contemporary',
    colorScheme: JSON.stringify({
      primary: ['navy blue', 'charcoal gray'],
      secondary: ['white', 'light gray'],
      accent: ['mustard yellow']
    }),
    budget: 15000,
    timeline: '3 months',
    requirements: JSON.stringify({
      title: 'Modern Living Room Design Brief',
      description: 'AI-generated design brief for modern living room renovation',
      executiveSummary: 'This modern living room design project aims to create a sophisticated, functional space that balances contemporary aesthetics with comfortable livability.',
      designConcept: 'The design concept centers around creating a harmonious living space that serves as both a relaxing retreat and an entertainment hub.',
      styleDirection: 'Modern contemporary with Scandinavian influences',
      colorPalette: {
        primary: ['navy blue', 'charcoal gray'],
        secondary: ['white', 'light gray'],
        accent: ['mustard yellow']
      },
      materials: ['hardwood flooring', 'leather', 'linen', 'metal accents', 'glass'],
      spacePlanning: 'Open concept layout with defined zones for seating, entertainment, and conversation.',
      furnitureRecommendations: ['Modular sofa', 'Coffee table with storage', 'Accent chairs', 'Media console'],
      lightingStrategy: 'Layered lighting approach with ambient ceiling fixtures, task lighting, and accent lighting.',
      keyFeatures: ['Feature wall with textured finish', 'Built-in media center', 'Cozy reading nook'],
      phasing: ['Demolition and preparation', 'Structural work', 'Flooring and painting', 'Furniture installation'],
      budgetConsiderations: 'Budget allocation prioritizes quality seating and foundational elements.',
      timelineOverview: '12-week project timeline with 2 weeks for planning, 6 weeks for construction, and 4 weeks for furnishing.'
    }),
    aiGenerated: true,
  }

  await prisma.designBrief.create({
    data: {
      projectId: project1.id,
      ...briefData,
    },
  })

  // Create sample BOQ for project 1
  const boqItems = [
    {
      id: '1',
      category: 'furniture',
      name: 'Modern Sofa',
      description: '3-seater modern sofa with premium fabric',
      unit: 'piece',
      quantity: 1,
      unitPrice: 2500,
      totalPrice: 2500,
      supplier: 'Furniture Store A',
      priority: 'essential',
      notes: 'Client preferred navy blue color'
    },
    {
      id: '2',
      category: 'furniture',
      name: 'Coffee Table',
      description: 'Glass top coffee table with metal base',
      unit: 'piece',
      quantity: 1,
      unitPrice: 800,
      totalPrice: 800,
      supplier: 'Furniture Store B',
      priority: 'essential'
    },
    {
      id: '3',
      category: 'lighting',
      name: 'LED Ceiling Lights',
      description: 'Dimmable LED ceiling light fixtures',
      unit: 'set',
      quantity: 1,
      unitPrice: 600,
      totalPrice: 600,
      supplier: 'Lighting Co',
      priority: 'recommended'
    },
  ]

  await prisma.bOQ.create({
    data: {
      projectId: project1.id,
      title: 'Living Room Bill of Quantities',
      description: 'Comprehensive BOQ for modern living room renovation',
      items: JSON.stringify(boqItems),
      totalCost: 3900,
      currency: 'USD',
      aiGenerated: true,
    },
  })

  console.log('Database seeded successfully!')
  console.log('Sample users:')
  console.log('- Client: client@example.com / password123')
  console.log('- Designer: designer@example.com / password123')
  console.log('- Admin: admin@example.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })