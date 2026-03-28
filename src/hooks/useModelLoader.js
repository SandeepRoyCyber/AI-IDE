import { useState, useCallback } from 'react';
import { loadModel, releaseModel } from '../modules/inferenceEngine';
import usePocketCoderStore from '../store';

export function useModelLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const { setActiveModel } = usePocketCoderStore();

  const load = useCallback(async (model) => {
    setIsLoading(true);
    setLoadError(null);

    const result = await loadModel(model);

    if (result.success) {
      setActiveModel(model);
      setLoadError(null);
    } else {
      setLoadError(result.error);
    }

    setIsLoading(false);
    return result.success;
  }, []);

  const unload = useCallback(async () => {
    await releaseModel();
    setActiveModel(null);
  }, []);

  return { load, unload, isLoading, loadError };
}
