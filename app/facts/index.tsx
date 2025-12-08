import { AnimatePresence, MotiView } from 'moti';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AIResultBox from '../../src/components/AIResultBox';
import AnimatedAssistant from '../../src/components/AnimatedAssistant';
import ContentCard from '../../src/components/ContentCard';
import Header from '../../src/components/Header';
import LoadingDots from '../../src/components/LoadingDots';
import { saveToHistory } from '../../src/db/database';
import { THEME } from '../../src/utils/colors';
import { AIResponse, generateContent } from '../../src/utils/geminiAPI';

export default function Facts() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFact, setGeneratedFact] = useState<AIResponse | null>(null);
  const [resultMessage, setResultMessage] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleGenerateFact = async () => {
    setIsGenerating(true);
    setShowResult(false);
    
    try {
      const response = await generateContent('fact');
      setGeneratedFact(response);
      
      if (response.caption === 'Oops! Something went wrong 😅') {
        setResultMessage('Failed to generate a fun fact. Please check your connection! 😔');
      } else {
        setResultMessage('Your fun fact is ready! 💡');
        
        // Save to history
        await saveToHistory({
          type: 'fact',
          content: response.caption,
          templateIndex: response.templateIndex,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error generating fact:', error);
      setResultMessage('Failed to generate fact. Please try again! 😔');
    } finally {
      setIsGenerating(false);
      setShowResult(true);
      
      // Hide result message after 3 seconds
      setTimeout(() => setShowResult(false), 3000);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Fun Facts" showBack gradient />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Assistant Section */}
        <View style={styles.assistantSection}>
          <AnimatedAssistant
            isThinking={isGenerating}
            isReady={!isGenerating && generatedFact !== null}
            size="large"
          />
          
          {isGenerating && (
            <View style={styles.thinkingContainer}>
              <LoadingDots size="large" color={THEME.primary} />
              <Text style={styles.thinkingText}>
                Discovering an amazing fact for you... 🔍
              </Text>
            </View>
          )}
        </View>

        {/* Action Button */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 200 }}
        >
          <TouchableOpacity
            style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
            onPress={handleGenerateFact}
            disabled={isGenerating}
          >
            <Text style={styles.generateButtonText}>
              {isGenerating ? 'Creating...' : '💡 Generate Fact'}
            </Text>
          </TouchableOpacity>
        </MotiView>

        {/* Result Message */}
        <AIResultBox
          isVisible={showResult}
          message={resultMessage}
          type={resultMessage.includes('Failed') ? 'error' : 'success'}
        />

        {/* Generated Fact */}
        <AnimatePresence>
          {generatedFact && !isGenerating && (
            <MotiView
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -20 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            >
              <ContentCard
                caption={generatedFact.caption}
                templateIndex={generatedFact.templateIndex}
                contentType="fact"
                onSave={() => {}} // Already saved automatically
                isSaved={true}
              />
            </MotiView>
          )}
        </AnimatePresence>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  content: {
    flex: 1,
  },
  assistantSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  thinkingContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  thinkingText: {
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: 'center',
    marginTop: 12,
    fontFamily: 'Inter-SemiBold',
  },
  generateButton: {
    backgroundColor: THEME.primary,
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  generateButtonDisabled: {
    backgroundColor: THEME.text.muted,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  bottomPadding: {
    height: 100,
  },
});