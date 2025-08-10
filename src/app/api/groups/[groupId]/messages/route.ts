import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { generateLLMResponse } from '@/lib/groq'

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

    const messages = await prisma.message.findMany({
      where: {
        groupId
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        llm: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Get messages error:', error)
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
    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
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

    
    const message = await prisma.message.create({
      data: {
        content,
        type: 'USER',
        senderId: user.userId,
        groupId
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    })

    
    const io = (global as any).io
    if (io) {
      io.to(`group_${groupId}`).emit('new_message', message)
    }

    
    const llmMentions = parseLLMMentions(content)
    
    if (llmMentions.length > 0) {
      
      
      processLLMResponses(groupId, content, llmMentions).catch(error => {
        console.error('Error processing LLM responses:', error)
      })
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function parseLLMMentions(content: string): string[] {
  const mentions: string[] = []
  
  
  if (content.includes('@all_llm')) {
    mentions.push('all')
  }
  
  
  const specificMentions = content.match(/@(\w+)/g)
  if (specificMentions) {
    specificMentions.forEach(mention => {
      const cleanMention = mention.slice(1) 
      if (cleanMention !== 'all_llm') { 
        mentions.push(cleanMention)
      }
    })
  }
  
  return mentions
}

async function processLLMResponses(groupId: string, userMessage: string, mentions: string[]) {
  try {
    const groupLLMs = await prisma.groupLLM.findMany({
      where: { groupId }
    })

    let llmsToRespond = groupLLMs

    
    if (!mentions.includes('all')) {
      llmsToRespond = groupLLMs.filter(llm => 
        mentions.some(mention => 
          llm.name.toLowerCase().includes(mention.toLowerCase()) ||
          llm.model.toLowerCase().includes(mention.toLowerCase())
        )
      )
    }

    
    const recentMessages = await prisma.message.findMany({
      where: { groupId },
      include: {
        sender: true,
        llm: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    const conversationContext = recentMessages
      .reverse()
      .map(msg => ({
        role: msg.type === 'USER' ? 'user' : 'assistant' as const,
        content: `${msg.type === 'USER' ? msg.sender?.username : msg.llm?.name}: ${msg.content}`
      }))

    
    for (const llm of llmsToRespond) {
      try {
        const response = await generateLLMResponse(
          llm.model,
          [
            {
              role: 'system',
              content: `You are ${llm.name}, an AI assistant in a group chat. Respond naturally and helpfully to the conversation.`
            },
            ...conversationContext,
            {
              role: 'user',
              content: userMessage
            }
          ]
        )

        const llmMessage = await prisma.message.create({
          data: {
            content: response,
            type: 'LLM',
            llmId: llm.id,
            groupId
          },
          include: {
            llm: true
          }
        })

        
        const io = (global as any).io
        if (io) {
          io.to(`group_${groupId}`).emit('new_message', llmMessage)
        }

        
        if (mentions.includes('all')) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch (error) {
        console.error(`Error generating response for ${llm.name}:`, error)
      }
    }
  } catch (error) {
    console.error('Error processing LLM responses:', error)
  }
}