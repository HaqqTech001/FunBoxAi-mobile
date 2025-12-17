import * as ImagePicker from 'expo-image-picker';
import { AnimatePresence, MotiView } from 'moti';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AIResultBox from '../../src/components/AIResultBox';
import AnimatedAssistant from '../../src/components/AnimatedAssistant';
import Header from '../../src/components/Header';
import LoadingDots from '../../src/components/LoadingDots';
import MemeCard from '../../src/components/MemeCard';
import { getSubCategories } from '../../src/constants/subCategories';
import { saveToHistory } from '../../src/db/database';
import { THEME } from '../../src/utils/colors';
import { isErrorResponse } from '../../src/utils/errorDetection';
import { AIResponse, generateContent } from '../../src/utils/geminiAPI';

export default function Memes() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMeme, setGeneratedMeme] = useState<AIResponse | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState('');
  const [showResult, setShowResult] = useState(false);
  
  // Sub-category selection state
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [subCategoryItems, setSubCategoryItems] = useState(
    getSubCategories('meme').map(item => ({
      label: item.label,
      value: item.id
    }))
  );

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photos to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setUploadedImage(result.assets[0].uri);
        Alert.alert('Image Uploaded', 'Great! Now generate a caption for your image. 🎭');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleGenerateMeme = async () => {
    setIsGenerating(true);
    setShowResult(false);
    
    try {
      let base64Image = undefined;
      
      if (uploadedImage) {
        // Convert image to base64 for AI processing
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        base64Image = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String.split(',')[1]); // Remove data:image/jpeg;base64, prefix
          };
          reader.readAsDataURL(blob);
        });
      }

      // Create enhanced prompt with sub-category
      const subCategoryPrompt = selectedSubCategory 
        ? `Generate a ${getSubCategories('meme').find(sc => sc.id === selectedSubCategory)?.label.toLowerCase().replace('work/school memes', 'work/school meme').replace('tech memes', 'tech meme').replace('african memes', 'african meme').replace('random funny memes', 'random funny meme')}.`
        : 'Generate a funny meme caption.';
      
      const response = await generateContent('meme', subCategoryPrompt, base64Image);
      setGeneratedMeme(response);
      
      if (isErrorResponse(response.caption)) {
        setResultMessage('Failed to generate a meme. Please check your API key! 😔');
      } else {
        setResultMessage('Your meme is ready! 🎭');
        
        // Save to history only if it's not an error response
        await saveToHistory({
          type: 'meme',
          subCategory: selectedSubCategory,
          content: response.caption,
          templateIndex: response.templateIndex,
          createdAt: new Date().toISOString(),
          imageData: base64Image, // Save the base64 image data
        });
      }
    } catch (error) {
      console.error('Error generating meme:', error);
      setResultMessage('Failed to generate meme. Please try again! 😔');
    } finally {
      setIsGenerating(false);
      setShowResult(true);
      
      // Hide result message after 3 seconds
      setTimeout(() => setShowResult(false), 3000);
    }
  };

  const handleGenerateRandomMeme = async () => {
    setUploadedImage(null); // Clear any uploaded image
    await handleGenerateMeme();
  };

  return (
    <View style={styles.container}>
      <Header title="Memes" showBack gradient />
      
      <View style={styles.content} >
      <View>
        {/* Assistant Section */}
        <View style={styles.assistantSection}>
          <AnimatedAssistant
            isThinking={isGenerating}
            isReady={!isGenerating && generatedMeme !== null}
            size="large"
          />
          
          {isGenerating && (
            <View style={styles.thinkingContainer}>
              <LoadingDots size="large" color={THEME.primary} />
              <Text style={styles.thinkingText}>
                Creating the perfect meme for you... 🎨
              </Text>
            </View>
          )}
        </View>

        {/* Uploaded Image Preview */}
        <AnimatePresence>
          {uploadedImage && (
            <MotiView
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              style={styles.imagePreviewContainer}
            >
              <Text style={styles.previewTitle}>📸 Your Image:</Text>
              <Image source={{ uri: uploadedImage }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setUploadedImage(null)}
              >
                <Text style={styles.removeImageText}>Remove Image</Text>
              </TouchableOpacity>
            </MotiView>
          )}
        </AnimatePresence>

        {/* Sub-Category Selection */}
        <View style={styles.subCategoryContainer}>
          <Text style={styles.subCategoryLabel}>Choose Meme Type:</Text>
          <DropDownPicker
            open={subCategoryOpen}
            value={selectedSubCategory}
            items={subCategoryItems}
            setOpen={setSubCategoryOpen}
            setValue={setSelectedSubCategory}
            setItems={setSubCategoryItems}
            placeholder="Select meme type"
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={1000}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 100 }}
          >
            <TouchableOpacity
              style={[styles.generateButton, styles.uploadButton]}
              onPress={pickImage}
              disabled={isGenerating}
            >
              <Text style={styles.generateButtonText}>
                📸 Upload Image
              </Text>
            </TouchableOpacity>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 150 }}
          >
            <TouchableOpacity
              style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
              onPress={handleGenerateMeme}
              disabled={isGenerating}
            >
              <Text style={styles.generateButtonText}>
                {isGenerating ? 'Creating...' : '🎭 Generate Meme'}
              </Text>
            </TouchableOpacity>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 200 }}
          >
            <TouchableOpacity
              style={[styles.generateButton, styles.randomButton, isGenerating && styles.generateButtonDisabled]}
              onPress={handleGenerateRandomMeme}
              disabled={isGenerating}
            >
              <Text style={styles.generateButtonText}>
                {isGenerating ? 'Creating...' : '🎲 Random Meme'}
              </Text>
            </TouchableOpacity>
          </MotiView>
        </View>

        {/* Result Message */}
        <AIResultBox
          isVisible={showResult}
          message={resultMessage}
          type={resultMessage.includes('Failed') ? 'error' : 'success'}
        />

        {/* Generated Meme */}
        <AnimatePresence>
          {generatedMeme && !isGenerating && (
            <MotiView
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -20 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            >
              <MemeCard
                caption={generatedMeme.caption}
                templateIndex={generatedMeme.templateIndex}
                uploadedImage={uploadedImage}
                imageData={generatedMeme.imageData}
                onSave={() => {}} // Already saved automatically
                isSaved={true}
              />
            </MotiView>
          )}
        </AnimatePresence>

        <View style={styles.bottomPadding} />

      </View>
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
  imagePreviewContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 16,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.text.primary,
    marginBottom: 12,
    fontFamily: 'Poppins-Bold',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  removeImageButton: {
    alignSelf: 'flex-end',
    backgroundColor: THEME.danger,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removeImageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  generateButton: {
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
  uploadButton: {
    backgroundColor: '#059669',
  },
  randomButton: {
    backgroundColor: THEME.secondary,
  },
  generateButtonDisabled: {
    backgroundColor: THEME.text.muted,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
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