import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, StyleSheet, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDeviceProfile } from '../modules/deviceIntelligence';
import { isModelDownloaded } from '../modules/modelManager';
import { useModelDownload } from '../hooks/useModelDownload';
import { useModelLoader } from '../hooks/useModelLoader';
import usePocketCoderStore from '../store';

const BADGE_COLORS = {
  'Recommended': '#22c55e',
  'Popular':     '#3b82f6',
  'New':         '#a855f7',
  'Fast':        '#f59e0b',
};

export default function ModelsScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [downloadedMap, setDownloadedMap] = useState({});

  const { startDownload, removeModel } = useModelDownload();
  const { load, isLoading: isLoadingModel } = useModelLoader();
  const { downloadProgress, activeModel, downloadedModels } = usePocketCoderStore();

  useEffect(() => {
    getDeviceProfile().then(async (p) => {
      setProfile(p);
      setActiveCategory(p.modelsByCategory[0]?.id);

      // Check which models are already downloaded
      const map = {};
      for (const cat of p.modelsByCategory) {
        for (const model of cat.models) {
          map[model.id] = await isModelDownloaded(model.id);
        }
      }
      setDownloadedMap(map);
      setLoading(false);
    });
  }, [downloadedModels]);

  const handleModelAction = async (model) => {
    if (!model.compatible) return;

    const isDownloaded = downloadedMap[model.id];

    if (isDownloaded) {
      // Already downloaded — load it
      Alert.alert(
        `Load ${model.name}?`,
        `This will load the model into memory using ${model.gpuLayers === 99 ? 'full' : model.gpuLayers + ' layer'} GPU acceleration.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Load Model',
            onPress: async () => {
              const success = await load(model);
              if (success) navigation.navigate('Home');
            }
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => removeModel(model)
          }
        ]
      );
    } else {
      // Not downloaded — start download
      Alert.alert(
        `Download ${model.name}?`,
        `This will download ${model.sizeGB}GB to your device. Make sure you are on WiFi.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Download', onPress: () => startDownload(model) }
        ]
      );
    }
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#22c55e" />
      <Text style={styles.loadingText}>Detecting your device...</Text>
    </View>
  );

  const activeSection = profile.modelsByCategory.find(c => c.id === activeCategory);

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Models</Text>
        <View style={{ width: 48 }} />
      </View>

      {/* Device Info Banner */}
      <View style={styles.deviceBanner}>
        <Text style={styles.deviceName}>{profile.deviceName}</Text>
        <View style={styles.deviceStats}>
          <Text style={styles.stat}>🧠 {profile.ramGB}GB RAM</Text>
          <Text style={styles.stat}>💾 {profile.storageGB}GB free</Text>
          <Text style={styles.stat}>⚡ {profile.gpuBackend}</Text>
        </View>
        <Text style={styles.recommended}>
          Recommended: {profile.recommendedModel.name}
        </Text>
      </View>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {profile.modelsByCategory.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.tab, activeCategory === cat.id && styles.tabActive]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Text style={[styles.tabText, activeCategory === cat.id && styles.tabTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {activeSection && (
        <Text style={styles.categoryDesc}>{activeSection.description}</Text>
      )}

      {/* Model Cards */}
      <ScrollView style={styles.modelList}>
        {activeSection?.models.map(model => {
          const isDownloaded = downloadedMap[model.id];
          const isActive = activeModel?.id === model.id;
          const progress = downloadProgress[model.id];
          const isDownloading = !!progress;

          return (
            <View key={model.id} style={[
              styles.card,
              !model.compatible && styles.cardLocked,
              isActive && styles.cardActive
            ]}>

              {/* Badge */}
              {model.badge && (
                <View style={[styles.badge, { backgroundColor: BADGE_COLORS[model.badge] }]}>
                  <Text style={styles.badgeText}>{model.badge}</Text>
                </View>
              )}

              {/* Active indicator */}
              {isActive && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>● Active</Text>
                </View>
              )}

              <View style={styles.cardHeader}>
                <Text style={[styles.modelName, !model.compatible && styles.textMuted]}>
                  {model.name}
                </Text>
                <Text style={styles.modelFamily}>{model.family}</Text>
              </View>

              <Text style={[styles.modelDesc, !model.compatible && styles.textMuted]}>
                {model.description}
              </Text>

              <View style={styles.statsRow}>
                <Text style={styles.modelStat}>📦 {model.sizeGB}GB</Text>
                <Text style={styles.modelStat}>🧠 {model.minRAMGB}GB min</Text>
                <Text style={styles.modelStat}>⚡ {model.gpuLayers === 99 ? 'Full GPU' : `${model.gpuLayers} layers`}</Text>
              </View>

              <View style={styles.tags}>
                {model.tags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Download Progress Bar */}
              {isDownloading && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${progress.percent}%` }]} />
                  </View>
                  <Text style={styles.progressText}>
                    {progress.percent}% · {progress.downloadedMB}MB / {progress.totalMB}MB · {progress.speedMBps} MB/s
                  </Text>
                </View>
              )}

              {/* Action Button */}
              {model.compatible ? (
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    isDownloaded && styles.actionBtnLoaded,
                    isActive && styles.actionBtnActive,
                    isDownloading && styles.actionBtnDownloading,
                  ]}
                  onPress={() => !isDownloading && handleModelAction(model)}
                  disabled={isDownloading || isLoadingModel}
                >
                  <Text style={styles.actionBtnText}>
                    {isDownloading ? `Downloading... ${progress.percent}%`
                      : isActive    ? '✅ Loaded — Tap to switch'
                      : isDownloaded ? '▶ Load Model'
                      : '⬇ Download Model'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.lockedBtn}>
                  <Text style={styles.lockedBtnText}>🔒 {model.reason}</Text>
                </View>
              )}

            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#0f172a' },
  center:             { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  loadingText:        { color: '#94a3b8', marginTop: 12, fontSize: 14 },
  header:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  backText:           { color: '#22c55e', fontSize: 14, fontWeight: '600' },
  headerTitle:        { color: '#f1f5f9', fontSize: 16, fontWeight: '700' },
  deviceBanner:       { backgroundColor: '#1e293b', padding: 16, margin: 12, borderRadius: 12 },
  deviceName:         { color: '#f1f5f9', fontSize: 16, fontWeight: '700' },
  deviceStats:        { flexDirection: 'row', gap: 12, marginTop: 6 },
  stat:               { color: '#94a3b8', fontSize: 13 },
  recommended:        { color: '#22c55e', fontSize: 13, marginTop: 6, fontWeight: '600' },
  tabs:               { paddingHorizontal: 12, marginBottom: 4, maxHeight: 48 },
  tab:                { paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, borderRadius: 20, backgroundColor: '#1e293b' },
  tabActive:          { backgroundColor: '#22c55e' },
  tabText:            { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  tabTextActive:      { color: '#0f172a' },
  categoryDesc:       { color: '#64748b', fontSize: 12, paddingHorizontal: 16, marginBottom: 8 },
  modelList:          { padding: 12 },
  card:               { backgroundColor: '#1e293b', borderRadius: 14, padding: 16, marginBottom: 12 },
  cardLocked:         { opacity: 0.45 },
  cardActive:         { borderWidth: 1, borderColor: '#22c55e' },
  cardHeader:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  modelName:          { color: '#f1f5f9', fontSize: 15, fontWeight: '700' },
  modelFamily:        { color: '#475569', fontSize: 12 },
  modelDesc:          { color: '#94a3b8', fontSize: 13, marginBottom: 10 },
  textMuted:          { color: '#475569' },
  statsRow:           { flexDirection: 'row', gap: 12, marginBottom: 10 },
  modelStat:          { color: '#64748b', fontSize: 12 },
  tags:               { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  tag:                { backgroundColor: '#0f172a', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText:            { color: '#475569', fontSize: 11 },
  badge:              { position: 'absolute', top: 12, right: 12, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText:          { color: '#fff', fontSize: 11, fontWeight: '700' },
  activeBadge:        { position: 'absolute', top: 38, right: 12 },
  activeBadgeText:    { color: '#22c55e', fontSize: 11, fontWeight: '700' },
  progressContainer:  { marginBottom: 10 },
  progressBg:         { height: 6, backgroundColor: '#0f172a', borderRadius: 3, marginBottom: 4 },
  progressFill:       { height: 6, backgroundColor: '#22c55e', borderRadius: 3 },
  progressText:       { color: '#64748b', fontSize: 11 },
  actionBtn:          { backgroundColor: '#22c55e', borderRadius: 10, padding: 12, alignItems: 'center' },
  actionBtnLoaded:    { backgroundColor: '#3b82f6' },
  actionBtnActive:    { backgroundColor: '#475569' },
  actionBtnDownloading: { backgroundColor: '#f59e0b' },
  actionBtnText:      { color: '#0f172a', fontWeight: '700', fontSize: 14 },
  lockedBtn:          { backgroundColor: '#0f172a', borderRadius: 10, padding: 12, alignItems: 'center' },
  lockedBtnText:      { color: '#475569', fontSize: 13 },
});
