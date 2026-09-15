export interface AIProviderConfig {
  id: string;
  name: string;
  nameFa: string;
  type: "gemini" | "openai-compatible" | "github";
  baseURL?: string;
  defaultModel: string;
  models: string[];
  isConfigured: boolean;
  description: string;
}

export interface GenerationRequest {
  messages: Array<{ role: string; content: string }>;
  systemInstruction?: string;
  provider?: string;
  model?: string;
  contextSummary?: string;
  temperature?: number;
}

export interface GenerationResult {
  reply: string;
  provider: string;
  model: string;
  fallbackUsed?: boolean;
}

export interface StreamMeta {
  provider: string;
  model: string;
  fallbackUsed?: boolean;
}
