import { initLlama, releaseAllLlama } from 'llama.rn';
import { getModelPath } from '../modelManager';
import { SYSTEM_PROMPTS } from '../../constants/models';

let activeContext = null; // holds the loaded llama context

// ── Load Model into Memory ───────────────────────
export async function loadModel(model) {
  try {
    // Release any previously loaded model first
    if (activeContext) {
      await activeContext.release();
      activeContext = null;
    }

    const modelPath = getModelPath(model.id);
    const category = model.category || 'coding';

    activeContext = await initLlama({
      model: modelPath,
      use_mlock: true,         // lock model in RAM, prevent swapping
      n_ctx: 2048,             // context window size
      n_gpu_layers: model.gpuLayers, // Metal on iOS / Vulkan on Android
      n_threads: 4,            // CPU threads for non-GPU layers
    });

    return {
      success: true,
      context: activeContext,
      systemPrompt: SYSTEM_PROMPTS[category],
    };

  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to load model',
    };
  }
}

// ── Check if a model is loaded ───────────────────
export function isModelLoaded() {
  return activeContext !== null;
}

// ── Run Inference with Streaming ─────────────────
// onToken  → called for each token as it streams
// onDone   → called when generation completes
// onError  → called on failure
export async function runInference({
  userMessage,
  conversationHistory = [],
  systemPrompt,
  onToken,
  onDone,
  onError,
}) {
  if (!activeContext) {
    onError('No model loaded. Please download and select a model first.');
    return;
  }

  try {
    // Build messages array for chat completion
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    let fullResponse = '';

    await activeContext.completion(
      {
        messages,
        n_predict: 1024,      // max tokens to generate
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
        stop: ['<|im_end|>', '</s>', '[INST]'], // stop tokens
      },
      (data) => {
        // Called for each token
        const token = data.token;
        if (token) {
          fullResponse += token;
          onToken(token);
        }
      }
    );

    onDone(fullResponse);

  } catch (error) {
    onError(error.message || 'Inference failed');
  }
}

// ── Stop Generation Mid-Stream ───────────────────
export function stopInference() {
  if (activeContext) {
    activeContext.stopCompletion();
  }
}

// ── Release Model from Memory ────────────────────
export async function releaseModel() {
  if (activeContext) {
    await activeContext.release();
    activeContext = null;
  }
}

// ── Release Everything (app background/close) ────
export async function releaseAll() {
  await releaseAllLlama();
  activeContext = null;
}
