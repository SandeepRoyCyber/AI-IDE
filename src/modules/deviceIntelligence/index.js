import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as FileSystem from 'expo-file-system';
import { MODEL_CATALOGUE, MODEL_CATEGORIES } from '../../constants/models';

// Get total device RAM in GB
export async function getDeviceRAMGB() {
  try {
    const totalMemory = Device.totalMemory; // bytes
    return totalMemory / 1_000_000_000;
  } catch {
    return 4; // safe fallback
  }
}

// Check available storage in GB
export async function getAvailableStorageGB() {
  try {
    const info = await FileSystem.getFreeDiskStorageAsync();
    return info / 1_000_000_000;
  } catch {
    return 10; // safe fallback
  }
}

// GPU backend by platform
export function getGPUBackend() {
  if (Platform.OS === 'ios') return 'Metal';
  if (Platform.OS === 'android') return 'Vulkan';
  return 'CPU';
}

// Filter catalogue by what device can actually run
export function getCompatibleModels(ramGB, storageGB) {
  return MODEL_CATALOGUE.map(model => ({
    ...model,
    compatible: ramGB >= model.minRAMGB && storageGB >= model.sizeGB + 0.5,
    reason: ramGB < model.minRAMGB
      ? `Needs ${model.minRAMGB}GB RAM (you have ${ramGB.toFixed(1)}GB)`
      : storageGB < model.sizeGB + 0.5
      ? `Needs ${model.sizeGB + 0.5}GB free storage`
      : null
  }));
}

// Get compatible models grouped by category
export function getModelsByCategory(ramGB, storageGB) {
  const compatible = getCompatibleModels(ramGB, storageGB);
  return MODEL_CATEGORIES.map(cat => ({
    ...cat,
    models: compatible.filter(m => m.category === cat.id)
  }));
}

// Pick best recommended model overall (coding category, highest tier)
export function getRecommendedModel(ramGB, storageGB) {
  const compatible = getCompatibleModels(ramGB, storageGB);
  const compatibleCoding = compatible
    .filter(m => m.compatible && m.category === 'coding')
    .sort((a, b) => b.minRAMGB - a.minRAMGB);
  return compatibleCoding[0] || compatible.find(m => m.compatible) || MODEL_CATALOGUE[0];
}

// Main profile function
export async function getDeviceProfile() {
  const ramGB = parseFloat((await getDeviceRAMGB()).toFixed(1));
  const storageGB = parseFloat((await getAvailableStorageGB()).toFixed(1));
  const gpuBackend = getGPUBackend();
  const deviceName = Device.deviceName || 'Unknown Device';
  const platform = Platform.OS;

  const recommendedModel = getRecommendedModel(ramGB, storageGB);
  const modelsByCategory = getModelsByCategory(ramGB, storageGB);

  return {
    deviceName,
    platform,
    ramGB,
    storageGB,
    gpuBackend,
    recommendedModel,
    modelsByCategory,
  };
}
