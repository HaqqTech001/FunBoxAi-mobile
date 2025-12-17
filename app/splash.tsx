import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { THEME } from '../src/utils/colors';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreenSimple({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    console.log('🚀 Splash screen mounted');
    const timer = setTimeout(() => {
      console.log('⏰ Splash screen timer completed');
      onComplete();
    }, 3000);

    return () => {
      console.log('🧹 Clearing splash timer');
      clearTimeout(timer);
    };
  }, [onComplete]);

  try {
    return (
      <LinearGradient
        colors={[THEME.primary, THEME.secondary, '#1e1b4b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Simple Logo - No Animation */}
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🎭</Text>
          </View>

          {/* Simple Title - No Custom Fonts */}
          <Text style={styles.title}>FunBox</Text>
          <Text style={styles.subtitle}>AI</Text>

          {/* Simple Tagline */}
          <Text style={styles.tagline}>AI-Powered Entertainment</Text>

          {/* Simple Loading Indicator */}
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  } catch (error) {
    console.error('❌ Splash screen error:', error);
    // Fallback to simple view
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>🎭 FunBox AI</Text>
        <Text style={styles.fallbackSubtext}>Loading...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logo: {
    fontSize: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    // Remove custom font family
  },
  subtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: THEME.accent,
    textAlign: 'center',
    marginTop: -10,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 60,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  fallbackContainer: {
    flex: 1,
    backgroundColor: '#1e1b4b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fallbackSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});