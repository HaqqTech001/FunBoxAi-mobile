import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { THEME } from '../../src/utils/colors';

interface AIResultBoxProps {
  isVisible: boolean;
  message: string;
  type?: 'success' | 'error' | 'thinking';
}

const AIResultBox: React.FC<AIResultBoxProps> = ({
  isVisible,
  message,
  type = 'success',
}) => {
  const getContainerStyle = () => {
    switch (type) {
      case 'error':
        return styles.errorContainer;
      case 'thinking':
        return styles.thinkingContainer;
      default:
        return styles.successContainer;
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'error':
        return styles.errorText;
      case 'thinking':
        return styles.thinkingText;
      default:
        return styles.successText;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <MotiView
          initial={{ opacity: 0, scale: 0.8, translateY: -20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          exit={{ opacity: 0, scale: 0.8, translateY: -20 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          style={[styles.container, getContainerStyle()]}
        >
          <View style={styles.indicator}>
            {type === 'thinking' && (
              <MotiView
                animate={{
                  rotate: 360,
                }}
                transition={{
                  type: 'linear',
                  duration: 2000,
                  repeat: Infinity,
                }}
                style={styles.spinner}
              />
            )}
            {type === 'error' && <Text style={styles.indicatorEmoji}>⚠️</Text>}
            {type === 'success' && <Text style={styles.indicatorEmoji}>✅</Text>}
          </View>
          
          <Text style={[styles.message, getTextStyle()]}>{message}</Text>
        </MotiView>
      )}
    </AnimatePresence>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  successContainer: {
    backgroundColor: '#D1FAE5',
    borderLeftWidth: 4,
    borderLeftColor: THEME.accent,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: THEME.danger,
  },
  thinkingContainer: {
    backgroundColor: '#DBEAFE',
    borderLeftWidth: 4,
    borderLeftColor: THEME.primary,
  },
  indicator: {
    marginRight: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: THEME.primary,
    borderTopColor: 'transparent',
  },
  indicatorEmoji: {
    fontSize: 16,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  successText: {
    color: '#065F46',
  },
  errorText: {
    color: '#991B1B',
  },
  thinkingText: {
    color: '#1E3A8A',
  },
});

export default AIResultBox;