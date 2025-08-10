'use client'

import { useState } from 'react'
import { GroupMember } from '@/types'

interface MemberListProps {
  members: GroupMember[]
  onAddMember: (email: string) => void
  onRemoveMember: (memberId: string) => void
  currentUserId: string
}

export default function MemberList({ 
  members, 
  onAddMember, 
  onRemoveMember,
  currentUserId 
}: MemberListProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAddMember = async () => {
    if (newMemberEmail.trim()) {
      setIsLoading(true)
      await onAddMember(newMemberEmail.trim())
      setNewMemberEmail('')
      setShowAddForm(false)
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white border-b p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Members ({members.length})</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          {showAddForm ? 'Cancel' : '+ Add Member'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-4 p-3 border rounded-lg bg-gray-50">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Enter user's email address"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleAddMember}
              disabled={!newMemberEmail.trim() || isLoading}
              className="w-full bg-blue-500 text-white py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {members.map((member) => (
          <div key={member.id} className="flex justify-between items-center p-2 border rounded">
            <div>
              <div className="font-medium text-sm">
                👤 {member.user.username}
                {member.user.id === currentUserId && (
                  <span className="text-xs text-blue-600 ml-1">(You)</span>
                )}
              </div>
              <div className="text-xs text-gray-500">{member.user.email}</div>
              <div className="text-xs text-gray-400">
                Joined {new Date(member.joinedAt).toLocaleDateString()}
              </div>
            </div>
            {member.user.id !== currentUserId && (
              <button
                onClick={() => onRemoveMember(member.id)}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <div className="text-xs text-green-800">
          <strong>Tip:</strong> Add members by their registered email address. Theyll be able to see all group messages and chat with the LLMs.
        </div>
      </div>
    </div>
  )
}