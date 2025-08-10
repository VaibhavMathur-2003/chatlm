'use server';

import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function generateLLMResponse(
  model: string,
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages,
      model,
      temperature: 0.7,
      max_tokens: 1000,
    })

    return completion.choices[0]?.message?.content || 'No response generated'
  } catch (error) {
    console.error('Groq API Error:', error)
    return 'Sorry, I encountered an error while generating a response.'
  }
}

