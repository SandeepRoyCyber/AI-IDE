import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: '💻',
    title: 'Code with AI\nOn Your Device',
    subtitle: 'PocketCoder runs powerful AI models entirely offline. No internet needed. No data leaves your phone.',
  },
  {
    icon: '⚡',
    title: 'GPU Powered\nFast Inference',
    subtitle: 'Uses your phone\'s Metal (iPhone) or Vulkan (Android) GPU for fast, real-time code generation.',
  },
  {
    icon: '🔒',
    title: '100% Private\nForever Offline',
    subtitle: 'Your code, your conversations, your models. Everything stays on your device. Always.',
  },
  {
    icon: '🧠',
    title: 'Pick Your Model\nFor Your Device',
    subtitle: 'PocketCoder auto-detects your device and recommends the best model that fits your RAM and storage.',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = async () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      await AsyncStorage.setItem('onboarding_complete', 'true');
      navigation.replace('Home');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('onboarding_complete', 'true');
    navigation.replace('Home');
  };

  const slide = SLIDES[currentSlide];
  const isLast = currentSlide === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.container}>

      {/* Skip */}
      {!isLast && (
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slide Content */}
      <View style={styles.slideContent}>
        <Text style={styles.icon}>{slide.icon}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentSlide && styles.dotActive]}
          />
        ))}
      </View>

      {/* Next / Get Started */}
      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextText}>
          {isLast ? '🚀 Get Started' : 'Next →'}
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#0f172a', justifyContent: 'space-between', padding: 24 },
  skipBtn:      { alignSelf: 'flex-end', padding: 8 },
  skipText:     { color: '#475569', fontSize: 14 },
  slideContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 },
  icon:         { fontSize: 80, marginBottom: 32 },
  title:        { color: '#f1f5f9', fontSize: 32, fontWeight: '800', textAlign: 'center', lineHeight: 40, marginBottom: 20 },
  subtitle:     { color: '#94a3b8', fontSize: 16, textAlign: 'center', lineHeight: 26 },
  dots:         { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  dot:          { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1e293b' },
  dotActive:    { width: 24, backgroundColor: '#22c55e' },
  nextBtn:      { backgroundColor: '#22c55e', borderRadius: 16, padding: 18, alignItems: 'center', marginBottom: 8 },
  nextText:     { color: '#0f172a', fontSize: 17, fontWeight: '700' },
});
