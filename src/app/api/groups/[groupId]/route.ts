import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

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

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            email: true,
            createdAt: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                createdAt: true
              }
            }
          }
        },
        llms: true
      }
    })

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    return NextResponse.json(group)
  } catch (error) {
    console.error('Get group error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}