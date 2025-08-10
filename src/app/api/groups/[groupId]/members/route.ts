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

    const members = await prisma.groupMember.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        joinedAt: 'asc'
      }
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error('Get group members error:', error)
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
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    
    const targetUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User with this email not found' },
        { status: 404 }
      )
    }

    
    const existingMembership = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: targetUser.id,
          groupId
        }
      }
    })

    if (existingMembership) {
      return NextResponse.json(
        { error: 'User is already a member of this group' },
        { status: 409 }
      )
    }

    
    const newMember = await prisma.groupMember.create({
      data: {
        userId: targetUser.id,
        groupId
      },
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
    })

    return NextResponse.json(newMember)
  } catch (error) {
    console.error('Add member to group error:', error)
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
    const memberId = searchParams.get('memberId')

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
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

    
    await prisma.groupMember.delete({
      where: {
        id: memberId,
        groupId
      }
    })

    return NextResponse.json({ message: 'Member removed successfully' })
  } catch (error) {
    console.error('Remove member from group error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}