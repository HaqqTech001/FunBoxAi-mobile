import { AnimatePresence, MotiView } from 'moti';
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AIResultBox from '../../src/components/AIResultBox';
import AnimatedAssistant from '../../src/components/AnimatedAssistant';
import ContentCard from '../../src/components/ContentCard';
import Header from '../../src/components/Header';
import LoadingDots from '../../src/components/LoadingDots';
import { getSubCategories } from '../../src/constants/subCategories';
import { saveToHistory } from '../../src/db/database';
import { THEME } from '../../src/utils/colors';
import { isErrorResponse } from '../../src/utils/errorDetection';
import { AIResponse, generateContent } from '../../src/utils/geminiAPI';

export default function Riddles() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRiddle, setGeneratedRiddle] = useState<AIResponse | null>(null);
  const [resultMessage, setResultMessage] = useState('');
  const [showResult, setShowResult] = useState(false);
  
  // Sub-category selection state
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [subCategoryItems, setSubCategoryItems] = useState(
    getSubCategories('riddle').map(item => ({
      label: item.label,
      value: item.id
    }))
  );

  const handleGenerateRiddle = async () => {
    setIsGenerating(true);
    setShowResult(false);
    
    try {
      // Create enhanced prompt with sub-category
      const subCategoryPrompt = selectedSubCategory 
        ? `Generate a ${getSubCategories('riddle').find(sc => sc.id === selectedSubCategory)?.label.toLowerCase().replace('tricky/hard riddles', 'tricky riddle').replace('math riddles', 'math riddle')}.`
        : 'Generate an interesting riddle.';
      
      const response = await generateContent('riddle', subCategoryPrompt);
      setGeneratedRiddle(response);
      
      if (isErrorResponse(response.caption)) {
        setResultMessage('Failed to generate a riddle. Please check your connection! 😔');
      } else {
        setResultMessage('Your riddle is ready! 🧠');
        
        // Save to history only if it's not an error response
        await saveToHistory({
          type: 'riddle',
          subCategory: selectedSubCategory,
          content: response.caption,
          templateIndex: response.templateIndex,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error generating riddle:', error);
      setResultMessage('Failed to generate riddle. Please try again! 😔');
    } finally {
      setIsGenerating(false);
      setShowResult(true);
      
      // Hide result message after 3 seconds
      setTimeout(() => setShowResult(false), 3000);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Riddles" showBack gradient />
      
      <View style={styles.content} >
        {/* Assistant Section */}
        <View style={styles.assistantSection}>
          <AnimatedAssistant
            isThinking={isGenerating}
            isReady={!isGenerating && generatedRiddle !== null}
            size="large"
          />
          
          {isGenerating && (
            <View style={styles.thinkingContainer}>
              <LoadingDots size="large" color={THEME.primary} />
              <Text style={styles.thinkingText}>
                Crafting a brain-teasing riddle for you... 🧠
              </Text>
            </View>
          )}
        </View>

        {/* Sub-Category Selection */}
        <View style={styles.subCategoryContainer}>
          <Text style={styles.subCategoryLabel}>Choose Riddle Type:</Text>
          <DropDownPicker
            open={subCategoryOpen}
            value={selectedSubCategory}
            items={subCategoryItems}
            setOpen={setSubCategoryOpen}
            setValue={setSelectedSubCategory}
            setItems={setSubCategoryItems}
            placeholder="Select riddle type"
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={1000}
          />
        </View>

        {/* Action Button */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 200 }}
        >
          <TouchableOpacity
            style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
            onPress={handleGenerateRiddle}
            disabled={isGenerating}
          >
            <Text style={styles.generateButtonText}>
              {isGenerating ? 'Creating...' : '🧩 Generate Riddle'}
            </Text>
          </TouchableOpacity>
        </MotiView>

        {/* Result Message */}
        <AIResultBox
          isVisible={showResult}
          message={resultMessage}
          type={resultMessage.includes('Failed') ? 'error' : 'success'}
        />

        {/* Generated Riddle */}
        <AnimatePresence>
          {generatedRiddle && !isGenerating && (
            <MotiView
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -20 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            >
              <ContentCard
                caption={generatedRiddle.caption}
                templateIndex={generatedRiddle.templateIndex}
                contentType="riddle"
                onSave={() => {}} // Already saved automatically
                isSaved={true}
              />
            </MotiView>
          )}
        </AnimatePresence>

        <View style={styles.bottomPadding} />
      </View>
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
  subCategoryContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  subCategoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  dropdown: {
    backgroundColor: THEME.surface,
    borderColor: THEME.border,
    borderWidth: 1,
  },
  dropdownText: {
    fontSize: 16,
    color: THEME.text.primary,
  },
  dropdownContainer: {
    backgroundColor: THEME.surface,
    borderColor: THEME.border,
  },
});