'use client'

import { useState } from 'react'
import { GroupLLM } from '@/types'
import { AVAILABLE_MODELS } from '@/lib/models'

interface LLMListProps {
  llms: GroupLLM[]
  onAddLLM: (name: string, model: string) => void
  onRemoveLLM: (llmId: string) => void
}

export default function LLMList({ llms, onAddLLM, onRemoveLLM }: LLMListProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLLMName, setNewLLMName] = useState('')
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id)

  const handleAddLLM = () => {
    if (newLLMName.trim()) {
      onAddLLM(newLLMName.trim(), selectedModel)
      setNewLLMName('')
      setShowAddForm(false)
    }
  }

  return (
    <div className="bg-white border-l p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">LLMs ({llms.length})</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          {showAddForm ? 'Cancel' : '+ Add LLM'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-4 p-3 border rounded-lg bg-gray-50">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LLM Name
              </label>
              <input
                type="text"
                value={newLLMName}
                onChange={(e) => setNewLLMName(e.target.value)}
                placeholder="e.g., Assistant1, Helper, etc."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {AVAILABLE_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddLLM}
              disabled={!newLLMName.trim()}
              className="w-full bg-blue-500 text-white py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              Add LLM
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {llms.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No LLMs added yet
          </p>
        ) : (
          llms.map((llm) => (
            <div key={llm.id} className="flex justify-between items-center p-2 border rounded">
              <div>
                <div className="font-medium text-sm">🤖 {llm.name}</div>
                <div className="text-xs text-gray-500">
                  {AVAILABLE_MODELS.find(m => m.id === llm.model)?.name || llm.model}
                </div>
              </div>
              <button
                onClick={() => onRemoveLLM(llm.id)}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {llms.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-xs text-blue-800">
            <strong>Usage tips:</strong>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Use @all_llm to get responses from all LLMs</li>
              <li>Mention specific LLMs by name (e.g., @{llms[0]?.name})</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}