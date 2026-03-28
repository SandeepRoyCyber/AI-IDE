import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { releaseAll } from '../modules/inferenceEngine';
import usePocketCoderStore from '../store';

export default function SettingsScreen() {
  const { activeModel, clearMessages, setActiveModel } = usePocketCoderStore();

  const handleUnloadModel = async () => {
    Alert.alert('Unload Model', 'Free up RAM by unloading the current model?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Unload', style: 'destructive', onPress: async () => {
        await releaseAll();
        setActiveModel(null);
      }}
    ]);
  };

  const handleClearChat = () => {
    Alert.alert('Clear Chat', 'Delete all conversation history?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearMessages }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Model</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>
            {activeModel ? activeModel.name : 'None loaded'}
          </Text>
          {activeModel && (
            <TouchableOpacity onPress={handleUnloadModel}>
              <Text style={styles.danger}>Unload</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chat</Text>
        <TouchableOpacity style={styles.row} onPress={handleClearChat}>
          <Text style={styles.rowLabel}>Clear Conversation History</Text>
          <Text style={styles.danger}>Clear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>PocketCoder</Text>
          <Text style={styles.rowValue}>v1.0.0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Runtime</Text>
          <Text style={styles.rowValue}>llama.rn</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>License</Text>
          <Text style={styles.rowValue}>Apache 2.0</Text>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  heading:      { color: '#f1f5f9', fontSize: 24, fontWeight: '700', marginBottom: 24 },
  section:      { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 16 },
  sectionTitle: { color: '#64748b', fontSize: 12, fontWeight: '600', marginBottom: 12, textTransform: 'uppercase' },
  row:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#0f172a' },
  rowLabel:     { color: '#f1f5f9', fontSize: 14 },
  rowValue:     { color: '#64748b', fontSize: 14 },
  danger:       { color: '#ef4444', fontSize: 14, fontWeight: '600' },
});
