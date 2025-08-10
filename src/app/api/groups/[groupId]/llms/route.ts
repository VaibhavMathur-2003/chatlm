import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { AVAILABLE_MODELS } from '@/lib/models'

interface RouteParams {
  params: { groupId: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { groupId } = params
    
    
    const membership = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: user.userId,
          groupId
        }
      }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const llms = await prisma.groupLLM.findMany({
      where: { groupId },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(llms)
  } catch (error) {
    console.error('Get group LLMs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { groupId } = params
    const { name, model } = await request.json()

    if (!name || !model) {
      return NextResponse.json(
        { error: 'LLM name and model are required' },
        { status: 400 }
      )
    }

    
    const isValidModel = AVAILABLE_MODELS.some(m => m.id === model)
    if (!isValidModel) {
      return NextResponse.json(
        { error: 'Invalid model selected' },
        { status: 400 }
      )
    }

    
    const membership = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: user.userId,
          groupId
        }
      }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    
    const existingLLM = await prisma.groupLLM.findUnique({
      where: {
        groupId_name: {
          groupId,
          name
        }
      }
    })

    if (existingLLM) {
      return NextResponse.json(
        { error: 'LLM with this name already exists in the group' },
        { status: 409 }
      )
    }

    const llm = await prisma.groupLLM.create({
      data: {
        groupId,
        name,
        model
      }
    })

    return NextResponse.json(llm)
  } catch (error) {
    console.error('Add LLM to group error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { groupId } = params
    const { searchParams } = new URL(request.url)
    const llmId = searchParams.get('llmId')

    if (!llmId) {
      return NextResponse.json(
        { error: 'LLM ID is required' },
        { status: 400 }
      )
    }

    
    const membership = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: user.userId,
          groupId
        }
      }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    await prisma.groupLLM.delete({
      where: {
        id: llmId,
        groupId
      }
    })

    return NextResponse.json({ message: 'LLM removed successfully' })
  } catch (error) {
    console.error('Remove LLM from group error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}