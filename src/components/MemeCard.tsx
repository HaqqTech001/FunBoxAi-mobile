import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React from 'react';
import { Image, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getTemplateByIndex } from '../../src/utils/colors';

interface MemeCardProps {
  caption: string;
  templateIndex: number;
  uploadedImage?: string | null;
  onSave: () => void;
  isSaved?: boolean;
}

const MemeCard: React.FC<MemeCardProps> = ({
  caption,
  templateIndex,
  uploadedImage,
  onSave,
  isSaved = false,
}) => {
  const template = getTemplateByIndex('memes', templateIndex);

  const handleShare = async () => {
    try {
      const shareMessage = uploadedImage 
        ? `Check out this meme I created! 🎭\n\n${caption}`
        : `🎭 ${caption}`;
      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9, translateY: 20 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 15, stiffness: 300 }}
      style={styles.container}
    >
      <LinearGradient
        colors={template.colors}
        start={template.start}
        end={template.end}
        style={styles.gradientContainer}
      >
        <View style={styles.card}>
          {uploadedImage ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: uploadedImage }}
                style={styles.uploadedImage}
                resizeMode="cover"
              />
              <View style={styles.captionOverlay}>
                <Text style={styles.memeCaption}>{caption}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.memeCaption}>{caption}</Text>
          )}
          
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, isSaved && styles.savedButton]}
              onPress={onSave}
            >
              <Text style={styles.actionButtonText}>
                {isSaved ? '💾' : '💾'} <br /> Save
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Text style={styles.actionButtonText}>📤 <br />
              Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  gradientContainer: {
    borderRadius: 20,
    padding: 1,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 19,
    padding: 20,
    minHeight: 150,
    justifyContent: 'space-between',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    minHeight: 120,
  },
  uploadedImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 12,
  },
  memeCaption: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'Inter-Bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 10,
    minWidth: 50,
    alignItems: 'center',
  },
  savedButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    fontSize: 20,
  },
});

export default MemeCard;