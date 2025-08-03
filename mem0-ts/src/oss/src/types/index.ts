import { z } from "zod";

export interface MultiModalMessages {
  type: "image_url";
  image_url: {
    url: string;
  };
}

export interface Message {
  role: string;
  content: string | MultiModalMessages;
}

export interface EmbeddingConfig {
  apiKey?: string;
  model?: string | any;
  url?: string;
  modelProperties?: Record<string, any>;
}

export interface VectorStoreConfig {
  collectionName?: string;
  dimension?: number;
  client?: any;
  instance?: any;
  [key: string]: any;
}

export type HistoryStoreProvider = "supabase" | "memory";

export interface HistoryStoreConfig {
  provider: HistoryStoreProvider;
  config: {
    historyDbPath?: string;
    supabaseUrl?: string;
    supabaseKey?: string;
    tableName?: string;
  };
}

export type LLMProvider =
  | "openai"
  | "openai_structured"
  | "anthropic"
  | "groq"
  | "ollama"
  | "google"
  | "gemini"
  | "azure_openai"
  | "mistral"
  | "langchain";

export interface LLMConfig {
  provider?: LLMProvider;
  baseURL?: string;
  config?: Record<string, any>;
  apiKey?: string;
  model?: string | any;
  modelProperties?: Record<string, any>;
}

export interface Neo4jConfig {
  url: string;
  username: string;
  password: string;
}

export type GraphStoreProvider = "neo4j";

export interface GraphStoreConfig {
  provider: GraphStoreProvider;
  config: Neo4jConfig;
  llm?: LLMConfig;
  customPrompt?: string;
}

export type EmbedderProvider =
  | "openai"
  | "ollama"
  | "google"
  | "gemini"
  | "azure_openai"
  | "langchain";

export type VectorStoreProvider =
  | "qdrant"
  | "redis"
  | "supabase"
  | "langchain"
  | "vectorize"
  | "pgvector";

export interface MemoryConfig {
  version?: string;
  embedder: {
    provider: EmbedderProvider;
    config: EmbeddingConfig;
  };
  vectorStore: {
    provider: VectorStoreProvider;
    config: VectorStoreConfig;
  };
  llm: {
    provider: LLMProvider;
    config: LLMConfig;
  };
  historyStore?: HistoryStoreConfig;
  disableHistory?: boolean;
  historyDbPath?: string;
  customPrompt?: string;
  graphStore?: GraphStoreConfig;
  enableGraph?: boolean;
}

export interface MemoryItem {
  id: string;
  memory: string;
  hash?: string;
  createdAt?: string;
  updatedAt?: string;
  score?: number;
  metadata?: Record<string, any>;
}

export interface SearchFilters {
  userId?: string;
  agentId?: string;
  runId?: string;
  [key: string]: any;
}

export interface SearchResult {
  results: MemoryItem[];
  relations?: any[];
}

export interface VectorStoreResult {
  id: string;
  payload: Record<string, any>;
  score?: number;
}

export const MemoryConfigSchema = z.object({
  version: z.string().optional(),
  embedder: z.object({
    provider: z.literal([
      "openai",
      "ollama",
      "google",
      "gemini",
      "azure_openai",
      "langchain",
    ]),
    config: z.object({
      modelProperties: z.record(z.string(), z.any()).optional(),
      apiKey: z.string().optional(),
      model: z.union([z.string(), z.any()]).optional(),
      baseURL: z.string().optional(),
    }),
  }),
  vectorStore: z.object({
    provider: z.literal([
      "qdrant",
      "redis",
      "supabase",
      "langchain",
      "vectorize",
    ]),
    config: z
      .object({
        collectionName: z.string().optional(),
        dimension: z.number().optional(),
        client: z.any().optional(),
      })
      .loose(),
  }),
  llm: z.object({
    provider: z.literal([
      "openai",
      "openai_structured",
      "anthropic",
      "groq",
      "ollama",
      "google",
      "gemini",
      "azure_openai",
      "mistral",
      "langchain",
    ]),
    config: z.object({
      apiKey: z.string().optional(),
      model: z.union([z.string(), z.any()]).optional(),
      modelProperties: z.record(z.string(), z.any()).optional(),
      baseURL: z.string().optional(),
    }),
  }),
  historyDbPath: z.string().optional(),
  customPrompt: z.string().optional(),
  enableGraph: z.boolean().optional(),
  graphStore: z
    .object({
      provider: z.literal("neo4j"),
      config: z.object({
        url: z.string(),
        username: z.string(),
        password: z.string(),
      }),
      llm: z
        .object({
          provider: z.literal([
            "openai",
            "openai_structured",
            "anthropic",
            "groq",
            "ollama",
            "google",
            "gemini",
            "azure_openai",
            "mistral",
            "langchain",
          ]),
          config: z.record(z.string(), z.any()),
        })
        .optional(),
      customPrompt: z.string().optional(),
    })
    .optional(),
  historyStore: z
    .object({
      provider: z.literal(["supabase", "memory"]),
      config: z.record(z.string(), z.any()),
    })
    .optional(),
  disableHistory: z.boolean().optional(),
});
