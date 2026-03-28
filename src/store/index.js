import { create } from 'zustand';

const usePocketCoderStore = create((set, get) => ({

  // ── Device Profile ──────────────────────
  deviceProfile: null,
  setDeviceProfile: (profile) => set({ deviceProfile: profile }),

  // ── Active Model ────────────────────────
  activeModel: null,
  setActiveModel: (model) => set({ activeModel: model }),

  // ── Downloaded Models ───────────────────
  downloadedModels: [],
  setDownloadedModels: (models) => set({ downloadedModels: models }),
  addDownloadedModel: (modelId) => set(state => ({
    downloadedModels: [...new Set([...state.downloadedModels, modelId])]
  })),
  removeDownloadedModel: (modelId) => set(state => ({
    downloadedModels: state.downloadedModels.filter(id => id !== modelId)
  })),

  // ── Download Progress ───────────────────
  downloadProgress: {}, // { modelId: { percent, downloadedMB, totalMB, speedMBps } }
  setDownloadProgress: (modelId, progress) => set(state => ({
    downloadProgress: { ...state.downloadProgress, [modelId]: progress }
  })),
  clearDownloadProgress: (modelId) => set(state => {
    const updated = { ...state.downloadProgress };
    delete updated[modelId];
    return { downloadProgress: updated };
  }),

  // ── Chat History ────────────────────────
  messages: [],
  addMessage: (message) => set(state => ({
    messages: [...state.messages, { ...message, id: Date.now().toString() }]
  })),
  clearMessages: () => set({ messages: [] }),

  // ── Inference State ─────────────────────
  isGenerating: false,
  setIsGenerating: (val) => set({ isGenerating: val }),

}));

export default usePocketCoderStore;
