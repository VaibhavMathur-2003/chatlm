export interface User {
  id: string
  email: string
  username: string
  createdAt: Date
}

export interface Group {
  id: string
  name: string
  description?: string
  createdBy: string
  createdAt: Date
  creator: User
  members: GroupMember[]
  llms: GroupLLM[]
}

export interface GroupMember {
  id: string
  userId: string
  groupId: string
  user: User
  joinedAt: Date
}

export interface GroupLLM {
  id: string
  groupId: string
  name: string
  model: string
  createdAt: Date
}

export interface Message {
  id: string
  content: string
  type: 'USER' | 'LLM'
  senderId?: string
  llmId?: string
  groupId: string
  createdAt: Date
  sender?: User
  llm?: GroupLLM
}