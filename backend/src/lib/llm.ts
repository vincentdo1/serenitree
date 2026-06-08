/**
 * Pluggable LLM provider — a skeleton for a future feature, not wired into
 * production. One small interface, three implementations (Anthropic, OpenAI,
 * stub), selected from the environment. Both real providers call the vendor's
 * HTTP API directly, so there is no SDK dependency to ship. To add a provider,
 * implement `complete` and add a branch in `resolveProvider`.
 *
 * `llm.enabled` is false when no key is set, so callers fall back to deterministic
 * local content (see services/insights.ts) and the app works with zero setup.
 */
import { env } from '../env'

export interface CompletionInput {
  system?: string
  prompt: string
  maxTokens?: number
}

export interface LlmProvider {
  readonly name: string
  readonly enabled: boolean
  complete(input: CompletionInput): Promise<string>
}

function createAnthropicProvider(apiKey: string): LlmProvider {
  return {
    name: 'anthropic',
    enabled: true,
    async complete({ system, prompt, maxTokens = 1024 }) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: env.ANTHROPIC_MODEL,
          max_tokens: maxTokens,
          ...(system ? { system } : {}),
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      if (!res.ok) {
        throw new Error(`Anthropic request failed: ${res.status} ${await res.text()}`)
      }
      const data = (await res.json()) as { content?: { type: string; text?: string }[] }
      return (data.content ?? [])
        .map((block) => (block.type === 'text' ? (block.text ?? '') : ''))
        .join('')
        .trim()
    },
  }
}

function createOpenAiProvider(apiKey: string): LlmProvider {
  return {
    name: 'openai',
    enabled: true,
    async complete({ system, prompt, maxTokens = 1024 }) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL,
          max_tokens: maxTokens,
          messages: [
            ...(system ? [{ role: 'system', content: system }] : []),
            { role: 'user', content: prompt },
          ],
        }),
      })
      if (!res.ok) {
        throw new Error(`OpenAI request failed: ${res.status} ${await res.text()}`)
      }
      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
      return (data.choices?.[0]?.message?.content ?? '').trim()
    },
  }
}

const stubProvider: LlmProvider = {
  name: 'stub',
  enabled: false,
  async complete() {
    throw new Error('No LLM provider configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.')
  },
}

function resolveProvider(): LlmProvider {
  const { LLM_PROVIDER, ANTHROPIC_API_KEY, OPENAI_API_KEY } = env

  if (LLM_PROVIDER === 'anthropic') {
    return ANTHROPIC_API_KEY ? createAnthropicProvider(ANTHROPIC_API_KEY) : stubProvider
  }
  if (LLM_PROVIDER === 'openai') {
    return OPENAI_API_KEY ? createOpenAiProvider(OPENAI_API_KEY) : stubProvider
  }
  if (LLM_PROVIDER === 'stub') {
    return stubProvider
  }
  // 'auto': prefer Anthropic, then OpenAI, then stub.
  if (ANTHROPIC_API_KEY) return createAnthropicProvider(ANTHROPIC_API_KEY)
  if (OPENAI_API_KEY) return createOpenAiProvider(OPENAI_API_KEY)
  return stubProvider
}

export const llm = resolveProvider()
