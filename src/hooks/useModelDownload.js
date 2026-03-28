import { useCallback } from 'react';
import { Alert } from 'react-native';
import {
  downloadModel,
  deleteModel,
  isModelDownloaded
} from '../modules/modelManager';
import usePocketCoderStore from '../store';

export function useModelDownload() {
  const {
    addDownloadedModel,
    removeDownloadedModel,
    setDownloadProgress,
    clearDownloadProgress,
    setActiveModel,
  } = usePocketCoderStore();

  const startDownload = useCallback(async (model) => {
    const alreadyDownloaded = await isModelDownloaded(model.id);
    if (alreadyDownloaded) {
      setActiveModel(model);
      return;
    }

    await downloadModel(
      model,
      // onProgress
      (progress) => {
        setDownloadProgress(model.id, progress);
      },
      // onComplete
      (path) => {
        clearDownloadProgress(model.id);
        addDownloadedModel(model.id);
        setActiveModel(model);
        Alert.alert('✅ Download Complete', `${model.name} is ready to use!`);
      },
      // onError
      (error) => {
        clearDownloadProgress(model.id);
        Alert.alert('❌ Download Failed', error.message || 'Please check your connection.');
      }
    );
  }, []);

  const removeModel = useCallback(async (model) => {
    Alert.alert(
      'Delete Model',
      `Remove ${model.name} from your device? (${model.sizeGB}GB will be freed)`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteModel(model.id);
            removeDownloadedModel(model.id);
          }
        }
      ]
    );
  }, []);

  return { startDownload, removeModel };
}
