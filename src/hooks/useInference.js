import { useCallback } from 'react';
import { runInference, stopInference, loadModel, isModelLoaded } from '../modules/inferenceEngine';
import { SYSTEM_PROMPTS } from '../../constants/models';
import usePocketCoderStore from '../store';

export function useInference() {
  const {
    activeModel,
    messages,
    addMessage,
    setIsGenerating,
    isGenerating,
  } = usePocketCoderStore();

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim() || isGenerating) return;
    if (!activeModel) {
      alert('Please download and select a model first.');
      return;
    }

    // Add user message to store
    addMessage({ role: 'user', content: userText });
    setIsGenerating(true);

    // Placeholder for streaming assistant response
    const assistantMsgId = Date.now().toString();
    let streamedText = '';

    // Build conversation history (last 10 messages for context)
    const history = messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content,
    }));

    const systemPrompt = SYSTEM_PROMPTS[activeModel.category] || SYSTEM_PROMPTS.coding;

    await runInference({
      userMessage: userText,
      conversationHistory: history,
      systemPrompt,

      onToken: (token) => {
        streamedText += token;
        // Update the last assistant message live
        usePocketCoderStore.setState(state => {
          const msgs = [...state.messages];
          const lastIdx = msgs.findIndex(m => m.id === assistantMsgId);
          if (lastIdx === -1) {
            msgs.push({ id: assistantMsgId, role: 'assistant', content: streamedText });
          } else {
            msgs[lastIdx] = { ...msgs[lastIdx], content: streamedText };
          }
          return { messages: msgs };
        });
      },

      onDone: (fullText) => {
        setIsGenerating(false);
      },

      onError: (err) => {
        setIsGenerating(false);
        addMessage({
          role: 'assistant',
          content: `❌ Error: ${err}`,
        });
      },
    });

  }, [activeModel, messages, isGenerating]);

  const stopGeneration = useCallback(() => {
    stopInference();
    setIsGenerating(false);
  }, []);

  return { sendMessage, stopGeneration, isGenerating };
}
