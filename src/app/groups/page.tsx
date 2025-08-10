import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import GroupList from '@/components/GroupList'

export default async function GroupsPage() {
  const user = await getCurrentUser()
  console.log('Current user:', user)
  if (!user) {
    redirect('/auth/login')
  }

  const groups = await prisma.group.findMany({
    where: {
      members: {
        some: {
          userId: user.userId
        }
      }
    },
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
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.username}!
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your groups and chat with AI assistants
            </p>
          </div>
          <Link
            href="/groups/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Group
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Your Groups</h2>
          </div>
          <div className="p-6">
            <GroupList groups={groups} />
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Getting Started</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Create a group and add AI assistants from various models</p>
            <p>• Use @all_llm to get responses from all LLMs in the group</p>
            <p>• Mention specific LLMs by name (e.g., @Assistant1) for targeted responses</p>
            <p>• Invite other users to collaborate in group conversations</p>
          </div>
        </div>
      </div>
    </div>
  )
}