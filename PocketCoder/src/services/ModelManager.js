import * as FileSystem from 'expo-file-system';

const MODEL_URL = 'https://huggingface.co/Qwen/Qwen2.5-Coder-3B-Instruct-GGUF/resolve/main/qwen2.5-coder-3b-instruct-q4_k_m.gguf';
const MODEL_DIR = FileSystem.documentDirectory + 'models/';
const MODEL_PATH = MODEL_DIR + 'qwen2.5-coder-3b.gguf';

/**
 * Check if model file exists at MODEL_PATH
 * @returns {Promise<boolean>}
 */
export async function isModelDownloaded() {
  try {
    const fileInfo = await FileSystem.getInfoAsync(MODEL_PATH);
    return fileInfo.exists;
  } catch (error) {
    console.error('Error checking model existence:', error);
    return false;
  }
}

/**
 * Return the model path string
 * @returns {string}
 */
export function getModelPath() {
  return MODEL_PATH;
}

/**
 * Return the model size as a string
 * @returns {string}
 */
export function getModelSize() {
  return "1.8 GB";
}

/**
 * Download the model file with progress tracking
 * @param {function(number)} onProgress - Callback with progress value from 0.0 to 1.0
 * @returns {Promise<string>} - The file URI when complete
 */
export async function downloadModel(onProgress) {
  try {
    // Create models directory if it doesn't exist
    const dirInfo = await FileSystem.getInfoAsync(MODEL_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(MODEL_DIR, { intermediates: true });
    }

    // Create resumable download
    const downloadResumable = FileSystem.createDownloadResumable(
      MODEL_URL,
      MODEL_PATH,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        if (onProgress && typeof onProgress === 'function') {
          onProgress(progress);
        }
      }
    );

    // Start download and wait for completion
    const result = await downloadResumable.downloadAsync();
    
    if (onProgress && typeof onProgress === 'function') {
      onProgress(1.0);
    }

    return result.uri;
  } catch (error) {
    console.error('Error downloading model:', error);
    throw error;
  }
}

/**
 * Delete the model file if it exists
 * @returns {Promise<void>}
 */
export async function deleteModel() {
  try {
    const fileInfo = await FileSystem.getInfoAsync(MODEL_PATH);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(MODEL_PATH);
    }
  } catch (error) {
    console.error('Error deleting model:', error);
    throw error;
  }
}
