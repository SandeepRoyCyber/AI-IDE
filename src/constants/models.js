// ─────────────────────────────────────────
// PocketCoder — Universal Model Catalogue
// To add a new model: just add an object
// below. No other code changes needed.
// ─────────────────────────────────────────

export const MODEL_CATEGORIES = [
  { id: 'coding',      label: '💻 Coding',      description: 'Optimized for writing & debugging code' },
  { id: 'reasoning',   label: '🧠 Reasoning',   description: 'Best for logic, math & step-by-step thinking' },
  { id: 'general',     label: '🌐 General',     description: 'Balanced for everyday tasks' },
  { id: 'lightweight', label: '⚡ Lightweight',  description: 'Ultra fast, works on any device' },
];

export const MODEL_CATALOGUE = [

  // ── CODING ──────────────────────────────
  {
    id: 'qwen2.5-coder-7b-q4',
    name: 'Qwen2.5-Coder 7B',
    family: 'Qwen',
    category: 'coding',
    description: 'Best coding model for flagship devices. Handles complex codebases.',
    minRAMGB: 7,
    sizeGB: 4.5,
    gpuLayers: 99,
    badge: 'Recommended',
    tags: ['coding', 'debugging', 'refactoring'],
    url: 'https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct-GGUF/resolve/main/qwen2.5-coder-7b-instruct-q4_k_m.gguf'
  },
  {
    id: 'qwen2.5-coder-3b-q4',
    name: 'Qwen2.5-Coder 3B',
    family: 'Qwen',
    category: 'coding',
    description: 'Great balance of speed and capability for mid-range devices.',
    minRAMGB: 5,
    sizeGB: 2.0,
    gpuLayers: 40,
    badge: 'Popular',
    tags: ['coding', 'debugging'],
    url: 'https://huggingface.co/Qwen/Qwen2.5-Coder-3B-Instruct-GGUF/resolve/main/qwen2.5-coder-3b-instruct-q4_k_m.gguf'
  },
  {
    id: 'qwen2.5-coder-1.5b-q4',
    name: 'Qwen2.5-Coder 1.5B',
    family: 'Qwen',
    category: 'coding',
    description: 'Lightweight coding assistant for older or budget devices.',
    minRAMGB: 3,
    sizeGB: 1.0,
    gpuLayers: 20,
    badge: null,
    tags: ['coding'],
    url: 'https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf'
  },
  {
    id: 'qwen2.5-coder-0.5b-q4',
    name: 'Qwen2.5-Coder 0.5B',
    family: 'Qwen',
    category: 'coding',
    description: 'Minimum footprint. Works on almost any device.',
    minRAMGB: 2,
    sizeGB: 0.4,
    gpuLayers: 10,
    badge: null,
    tags: ['coding'],
    url: 'https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-0.5b-instruct-q4_k_m.gguf'
  },
  {
    id: 'deepseek-coder-v2-1.3b-q4',
    name: 'DeepSeek-Coder V2 1.3B',
    family: 'DeepSeek',
    category: 'coding',
    description: 'Fast and accurate coder from DeepSeek. Great alternative to Qwen.',
    minRAMGB: 3,
    sizeGB: 0.8,
    gpuLayers: 20,
    badge: 'New',
    tags: ['coding', 'fast'],
    url: 'https://huggingface.co/DeepSeek/DeepSeek-Coder-V2-Lite-Instruct-GGUF/resolve/main/deepseek-coder-v2-lite-instruct-q4_k_m.gguf'
  },

  // ── REASONING ───────────────────────────
  {
    id: 'deepseek-r1-7b-q4',
    name: 'DeepSeek R1 7B',
    family: 'DeepSeek',
    category: 'reasoning',
    description: 'Powerful reasoning model. Thinks step by step through hard problems.',
    minRAMGB: 7,
    sizeGB: 4.5,
    gpuLayers: 99,
    badge: 'Popular',
    tags: ['reasoning', 'math', 'logic'],
    url: 'https://huggingface.co/DeepSeek/DeepSeek-R1-Distill-Qwen-7B-GGUF/resolve/main/deepseek-r1-distill-qwen-7b-q4_k_m.gguf'
  },
  {
    id: 'deepseek-r1-1.5b-q4',
    name: 'DeepSeek R1 1.5B',
    family: 'DeepSeek',
    category: 'reasoning',
    description: 'Compact reasoning model. Surprisingly capable for its size.',
    minRAMGB: 3,
    sizeGB: 1.1,
    gpuLayers: 20,
    badge: null,
    tags: ['reasoning', 'math'],
    url: 'https://huggingface.co/DeepSeek/DeepSeek-R1-Distill-Qwen-1.5B-GGUF/resolve/main/deepseek-r1-distill-qwen-1.5b-q4_k_m.gguf'
  },
  {
    id: 'qwen2.5-7b-q4',
    name: 'Qwen2.5 7B',
    family: 'Qwen',
    category: 'reasoning',
    description: 'General purpose reasoning and instruction following.',
    minRAMGB: 7,
    sizeGB: 4.5,
    gpuLayers: 99,
    badge: null,
    tags: ['reasoning', 'general'],
    url: 'https://huggingface.co/Qwen/Qwen2.5-7B-Instruct-GGUF/resolve/main/qwen2.5-7b-instruct-q4_k_m.gguf'
  },

  // ── GENERAL ─────────────────────────────
  {
    id: 'gemma-3-4b-q4',
    name: 'Gemma 3 4B',
    family: 'Google',
    category: 'general',
    description: 'Google\'s compact model. Great for general chat and writing.',
    minRAMGB: 5,
    sizeGB: 2.5,
    gpuLayers: 40,
    badge: 'New',
    tags: ['general', 'chat', 'writing'],
    url: 'https://huggingface.co/google/gemma-3-4b-it-GGUF/resolve/main/gemma-3-4b-it-q4_k_m.gguf'
  },
  {
    id: 'phi-4-mini-q4',
    name: 'Phi-4 Mini 3.8B',
    family: 'Microsoft',
    category: 'general',
    description: 'Microsoft\'s efficient model. Fast responses with strong reasoning.',
    minRAMGB: 5,
    sizeGB: 2.3,
    gpuLayers: 40,
    badge: 'Popular',
    tags: ['general', 'fast', 'reasoning'],
    url: 'https://huggingface.co/microsoft/Phi-4-mini-instruct-GGUF/resolve/main/phi-4-mini-instruct-q4_k_m.gguf'
  },

  // ── LIGHTWEIGHT ─────────────────────────
  {
    id: 'gemma-3-1b-q4',
    name: 'Gemma 3 1B',
    family: 'Google',
    category: 'lightweight',
    description: 'Tiny but capable. Works on virtually any device with ease.',
    minRAMGB: 2,
    sizeGB: 0.7,
    gpuLayers: 10,
    badge: 'Fast',
    tags: ['lightweight', 'fast'],
    url: 'https://huggingface.co/google/gemma-3-1b-it-GGUF/resolve/main/gemma-3-1b-it-q4_k_m.gguf'
  },
  {
    id: 'qwen2.5-0.5b-q4',
    name: 'Qwen2.5 0.5B',
    family: 'Qwen',
    category: 'lightweight',
    description: 'Smallest possible general model. Instant responses.',
    minRAMGB: 2,
    sizeGB: 0.4,
    gpuLayers: 10,
    badge: 'Fast',
    tags: ['lightweight', 'fast'],
    url: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf'
  },
];

// System prompt per category
export const SYSTEM_PROMPTS = {
  coding: `You are PocketCoder, an expert coding assistant running entirely on-device.
You help with writing, explaining, debugging, and improving code.
Be concise, accurate, and always provide working code examples.`,

  reasoning: `You are PocketCoder, a reasoning assistant running entirely on-device.
Think through problems step by step. Show your reasoning clearly.
Be thorough, logical, and check your work before answering.`,

  general: `You are PocketCoder, a helpful assistant running entirely on-device.
Answer questions clearly and concisely. Be friendly and accurate.`,

  lightweight: `You are PocketCoder, a fast on-device assistant.
Give short, direct answers. Prioritize speed and clarity.`,
};
