'use client'

import Link from 'next/link'
import { Group } from '@/types'

interface GroupListProps {
  groups: Group[]
  currentGroupId?: string
}

export default function GroupList({ groups, currentGroupId }: GroupListProps) {
  if (groups.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No groups yet.</p>
        <Link
          href="/groups/create"
          className="text-blue-500 hover:underline"
        >
          Create your first group
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {groups.map((group) => (
        <Link
          key={group.id}
          href={`/groups/${group.id}`}
          className={`block p-3 rounded-lg transition-colors ${
            currentGroupId === group.id
              ? 'bg-blue-100 border-blue-500'
              : 'hover:bg-gray-50 border-transparent'
          } border-2`}
        >
          <div className="font-semibold text-gray-800">{group.name}</div>
          {group.description && (
            <div className="text-sm text-gray-600 mt-1">{group.description}</div>
          )}
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-500">
              {group.members.length} member{group.members.length !== 1 ? 's' : ''}
              {group.llms.length > 0 && (
                <span className="ml-2">
                  • {group.llms.length} LLM{group.llms.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(group.createdAt).toLocaleDateString()}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}