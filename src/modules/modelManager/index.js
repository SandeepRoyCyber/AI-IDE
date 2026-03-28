import * as FileSystem from 'expo-file-system';

// Base directory where all models are stored on device
const MODEL_BASE_DIR = `${FileSystem.documentDirectory}pocketcoder_models/`;

// Ensure the models directory exists
export async function ensureModelDirectory() {
  const info = await FileSystem.getInfoAsync(MODEL_BASE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(MODEL_BASE_DIR, { intermediates: true });
  }
}

// Get local file path for a model
export function getModelPath(modelId) {
  return `${MODEL_BASE_DIR}${modelId}.gguf`;
}

// Check if a model is already downloaded
export async function isModelDownloaded(modelId) {
  const path = getModelPath(modelId);
  const info = await FileSystem.getInfoAsync(path);
  return info.exists && info.size > 1000; // sanity size check
}

// Get size of downloaded model in GB
export async function getDownloadedModelSizeGB(modelId) {
  const path = getModelPath(modelId);
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) return 0;
  return parseFloat((info.size / 1_000_000_000).toFixed(2));
}

// List all downloaded models
export async function getDownloadedModels() {
  await ensureModelDirectory();
  const files = await FileSystem.readDirectoryAsync(MODEL_BASE_DIR);
  return files
    .filter(f => f.endsWith('.gguf'))
    .map(f => f.replace('.gguf', ''));
}

// Delete a downloaded model
export async function deleteModel(modelId) {
  const path = getModelPath(modelId);
  const info = await FileSystem.getInfoAsync(path);
  if (info.exists) {
    await FileSystem.deleteAsync(path);
    return true;
  }
  return false;
}

// Download a model with progress callback
// onProgress({ percent, downloadedMB, totalMB, speedMBps })
export async function downloadModel(model, onProgress, onComplete, onError) {
  await ensureModelDirectory();
  const destPath = getModelPath(model.id);

  // Check if already downloaded
  const alreadyExists = await isModelDownloaded(model.id);
  if (alreadyExists) {
    onComplete(destPath);
    return null;
  }

  let lastBytes = 0;
  let lastTime = Date.now();

  const downloadResumable = FileSystem.createDownloadResumable(
    model.url,
    destPath,
    {},
    (downloadProgress) => {
      const { totalBytesWritten, totalBytesExpectedToWrite } = downloadProgress;

      const now = Date.now();
      const elapsed = (now - lastTime) / 1000; // seconds
      const bytesDelta = totalBytesWritten - lastBytes;
      const speedMBps = elapsed > 0 ? (bytesDelta / 1_000_000) / elapsed : 0;

      lastBytes = totalBytesWritten;
      lastTime = now;

      const percent = totalBytesExpectedToWrite > 0
        ? Math.round((totalBytesWritten / totalBytesExpectedToWrite) * 100)
        : 0;

      onProgress({
        percent,
        downloadedMB: parseFloat((totalBytesWritten / 1_000_000).toFixed(1)),
        totalMB: parseFloat((totalBytesExpectedToWrite / 1_000_000).toFixed(1)),
        speedMBps: parseFloat(speedMBps.toFixed(1)),
      });
    }
  );

  try {
    const result = await downloadResumable.downloadAsync();
    if (result?.uri) {
      onComplete(result.uri);
    }
  } catch (error) {
    onError(error);
  }

  return downloadResumable;
}
