import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ContentCard from '../../src/components/ContentCard';
import Header from '../../src/components/Header';
import MemeCard from '../../src/components/MemeCard';
import { clearHistory, getHistory, HistoryItem } from '../../src/db/database';
import { THEME } from '../../src/utils/colors';

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const historyData = await getHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Error', 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all saved content? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearHistory();
              setHistory([]);
              Alert.alert('Success', 'History cleared successfully!');
            } catch (error) {
              console.error('Error clearing history:', error);
              Alert.alert('Error', 'Failed to clear history');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const renderHistoryItem = (item: HistoryItem, index: number) => {
    const isMeme = item.type === 'meme';
    
    return (
      <MotiView
        key={item.id}
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300, delay: index * 100 }}
      >
        {isMeme ? (
          <MemeCard
            caption={item.content}
            templateIndex={item.templateIndex}
            onSave={() => {}} // Already saved
            isSaved={true}
          />
        ) : (
          <ContentCard
            caption={item.content}
            templateIndex={item.templateIndex}
            contentType={item.type as any}
            onSave={() => {}} // Already saved
            isSaved={true}
          />
        )}
        <Text style={styles.dateText}>
          {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </MotiView>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="History" showBack showSettings gradient />
      
      <View style={styles.content}>
        {history.length > 0 && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearHistory}
            >
              <Text style={styles.clearButtonText}>🗑️ Clear All</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your fun content... 🎭</Text>
          </View>
        ) : history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🎭</Text>
            <Text style={styles.emptyTitle}>No History Yet!</Text>
            <Text style={styles.emptySubtitle}>
              Start generating content and it will appear here for you to save and revisit!
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <AnimatePresence>
              {history.map((item, index) => renderHistoryItem(item, index))}
            </AnimatePresence>
            <View style={styles.bottomPadding} />
          </ScrollView>
        )}
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
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  clearButton: {
    backgroundColor: THEME.danger,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: THEME.text.secondary,
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.text.primary,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  emptySubtitle: {
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter-SemiBold',
  },
  scrollContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: THEME.text.muted,
    textAlign: 'right',
    marginTop: 8,
    marginRight: 4,
    fontFamily: 'Inter-Regular',
  },
  bottomPadding: {
    height: 100,
  },
});