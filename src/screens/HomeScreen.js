import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, SafeAreaView,
  KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { useInference } from '../hooks/useInference';
import usePocketCoderStore from '../store';

export default function HomeScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const { sendMessage, stopGeneration, isGenerating } = useInference();
  const { messages, activeModel } = usePocketCoderStore();

  const handleSend = async () => {
    if (!inputText.trim() || isGenerating) return;
    const text = inputText.trim();
    setInputText('');
    await sendMessage(text);
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        {!isUser && (
          <Text style={styles.roleLabel}>⚡ PocketCoder</Text>
        )}
        <Text style={[styles.messageText, isUser && styles.userText]}>
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>PocketCoder</Text>
          <Text style={styles.headerSub}>
            {activeModel ? `⚡ ${activeModel.name}` : '⚠️ No model loaded'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.modelsBtn}
          onPress={() => navigation.navigate('Models')}
        >
          <Text style={styles.modelsBtnText}>Models</Text>
        </TouchableOpacity>
      </View>

      {/* Empty State */}
      {messages.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💻</Text>
          <Text style={styles.emptyTitle}>Ready to code</Text>
          <Text style={styles.emptySubtitle}>
            {activeModel
              ? `${activeModel.name} is loaded.\nAsk me anything about code.`
              : 'Tap Models to download\nyour first AI model.'}
          </Text>
          {!activeModel && (
            <TouchableOpacity
              style={styles.getStartedBtn}
              onPress={() => navigation.navigate('Models')}
            >
              <Text style={styles.getStartedText}>Browse Models →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Typing Indicator */}
      {isGenerating && (
        <View style={styles.typingRow}>
          <ActivityIndicator size="small" color="#22c55e" />
          <Text style={styles.typingText}>Generating...</Text>
          <TouchableOpacity onPress={stopGeneration} style={styles.stopBtn}>
            <Text style={styles.stopText}>Stop</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask about code..."
            placeholderTextColor="#475569"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={2000}
            editable={!isGenerating}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!inputText.trim() || isGenerating) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isGenerating}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#0f172a' },
  header:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  headerTitle:      { color: '#f1f5f9', fontSize: 18, fontWeight: '700' },
  headerSub:        { color: '#64748b', fontSize: 12, marginTop: 2 },
  modelsBtn:        { backgroundColor: '#1e293b', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  modelsBtnText:    { color: '#22c55e', fontWeight: '600', fontSize: 13 },
  emptyState:       { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyIcon:        { fontSize: 48, marginBottom: 16 },
  emptyTitle:       { color: '#f1f5f9', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  emptySubtitle:    { color: '#64748b', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  getStartedBtn:    { marginTop: 24, backgroundColor: '#22c55e', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  getStartedText:   { color: '#0f172a', fontWeight: '700', fontSize: 15 },
  messageList:      { padding: 16, paddingBottom: 8 },
  bubble:           { marginBottom: 12, maxWidth: '88%', borderRadius: 16, padding: 14 },
  userBubble:       { backgroundColor: '#22c55e', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  assistantBubble:  { backgroundColor: '#1e293b', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  roleLabel:        { color: '#22c55e', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  messageText:      { color: '#f1f5f9', fontSize: 14, lineHeight: 21 },
  userText:         { color: '#0f172a' },
  typingRow:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  typingText:       { color: '#64748b', fontSize: 13, flex: 1 },
  stopBtn:          { backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  stopText:         { color: '#fff', fontSize: 12, fontWeight: '600' },
  inputRow:         { flexDirection: 'row', padding: 12, gap: 8, borderTopWidth: 1, borderTopColor: '#1e293b', alignItems: 'flex-end' },
  input:            { flex: 1, backgroundColor: '#1e293b', color: '#f1f5f9', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, maxHeight: 120 },
  sendBtn:          { backgroundColor: '#22c55e', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled:  { backgroundColor: '#1e293b' },
  sendIcon:         { color: '#0f172a', fontSize: 20, fontWeight: '700' },
});
