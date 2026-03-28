import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CodeEditor, { CodeEditorSyntaxStyles } from 'react-native-code-editor';
import { useInference } from '../hooks/useInference';
import usePocketCoderStore from '../store';

const LANGUAGES = ['javascript', 'python', 'typescript', 'java', 'cpp', 'go'];

export default function EditorScreen({ navigation }) {
  const [code, setCode] = useState('// Start coding here...\n');
  const [language, setLanguage] = useState('javascript');
  const [aiResponse, setAiResponse] = useState('');
  const [showResponse, setShowResponse] = useState(false);

  const { sendMessage, isGenerating, stopGeneration } = useInference();
  const { activeModel } = usePocketCoderStore();

  const handleAIAction = async (action) => {
    if (!activeModel) {
      Alert.alert('No Model', 'Please download a model from the Models screen first.');
      return;
    }
    if (!code.trim() || code.trim() === '// Start coding here...') {
      Alert.alert('No Code', 'Please write some code first.');
      return;
    }

    const prompts = {
      explain:  `Explain this ${language} code clearly:\n\`\`\`${language}\n${code}\n\`\`\``,
      fix:      `Find and fix any bugs in this ${language} code. Show the corrected version:\n\`\`\`${language}\n${code}\n\`\`\``,
      improve:  `Improve this ${language} code for better readability and performance:\n\`\`\`${language}\n${code}\n\`\`\``,
      comment:  `Add helpful inline comments to this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``,
    };

    setAiResponse('');
    setShowResponse(true);

    await sendMessage(prompts[action]);
  };

  // Get latest assistant message as AI response
  const { messages } = usePocketCoderStore();
  const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editor</Text>
        <Text style={styles.modelTag}>
          {activeModel ? `⚡ ${activeModel.name.split(' ').slice(0,2).join(' ')}` : '⚠️ No model'}
        </Text>
      </View>

      {/* Language Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.langBar}>
        {LANGUAGES.map(lang => (
          <TouchableOpacity
            key={lang}
            style={[styles.langBtn, language === lang && styles.langBtnActive]}
            onPress={() => setLanguage(lang)}
          >
            <Text style={[styles.langText, language === lang && styles.langTextActive]}>
              {lang}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Code Editor */}
      <View style={styles.editorContainer}>
        <CodeEditor
          style={styles.editor}
          language={language}
          syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
          initialValue={code}
          onChange={(text) => setCode(text)}
          showLineNumbers
        />
      </View>

      {/* AI Action Buttons */}
      <View style={styles.actionRow}>
        {[
          { key: 'explain',  label: '🔍 Explain' },
          { key: 'fix',      label: '🔧 Fix' },
          { key: 'improve',  label: '✨ Improve' },
          { key: 'comment',  label: '💬 Comment' },
        ].map(action => (
          <TouchableOpacity
            key={action.key}
            style={[styles.actionBtn, isGenerating && styles.actionBtnDisabled]}
            onPress={() => handleAIAction(action.key)}
            disabled={isGenerating}
          >
            <Text style={styles.actionText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* AI Response Panel */}
      {showResponse && (
        <View style={styles.responsePanel}>
          <View style={styles.responsePanelHeader}>
            <Text style={styles.responsePanelTitle}>⚡ AI Response</Text>
            <View style={styles.responsePanelActions}>
              {isGenerating && (
                <TouchableOpacity onPress={stopGeneration} style={styles.stopBtn}>
                  <Text style={styles.stopText}>Stop</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setShowResponse(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView style={styles.responseScroll}>
            <Text style={styles.responseText}>
              {lastAssistant?.content || (isGenerating ? '...' : '')}
            </Text>
          </ScrollView>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:            { flex: 1, backgroundColor: '#0f172a' },
  header:               { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  backBtn:              { padding: 4 },
  backText:             { color: '#22c55e', fontSize: 14, fontWeight: '600' },
  headerTitle:          { color: '#f1f5f9', fontSize: 16, fontWeight: '700' },
  modelTag:             { color: '#64748b', fontSize: 12 },
  langBar:              { paddingHorizontal: 12, paddingVertical: 8, maxHeight: 48 },
  langBtn:              { paddingHorizontal: 14, paddingVertical: 6, marginRight: 8, borderRadius: 16, backgroundColor: '#1e293b' },
  langBtnActive:        { backgroundColor: '#22c55e' },
  langText:             { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  langTextActive:       { color: '#0f172a' },
  editorContainer:      { flex: 1, margin: 12, borderRadius: 12, overflow: 'hidden' },
  editor:               { fontSize: 13, inputLineHeight: 21, highlighterLineHeight: 21 },
  actionRow:            { flexDirection: 'row', padding: 12, gap: 8 },
  actionBtn:            { flex: 1, backgroundColor: '#1e293b', borderRadius: 10, padding: 10, alignItems: 'center' },
  actionBtnDisabled:    { opacity: 0.4 },
  actionText:           { color: '#f1f5f9', fontSize: 12, fontWeight: '600' },
  responsePanel:        { backgroundColor: '#1e293b', margin: 12, marginTop: 0, borderRadius: 12, maxHeight: 200 },
  responsePanelHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#0f172a' },
  responsePanelTitle:   { color: '#22c55e', fontWeight: '700', fontSize: 13 },
  responsePanelActions: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  stopBtn:              { backgroundColor: '#ef4444', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  stopText:             { color: '#fff', fontSize: 12, fontWeight: '600' },
  closeBtn:             { color: '#475569', fontSize: 16 },
  responseScroll:       { padding: 12 },
  responseText:         { color: '#f1f5f9', fontSize: 13, lineHeight: 21 },
});
