import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { THEME } from '../../src/utils/colors';

interface AnimatedAssistantProps {
  isThinking: boolean;
  isReady: boolean;
  size?: 'small' | 'medium' | 'large';
}

const AnimatedAssistant: React.FC<AnimatedAssistantProps> = ({
  isThinking,
  isReady,
  size = 'medium',
}) => {
  const assistantSize = size === 'small' ? 40 : size === 'large' ? 80 : 60;

  return (
    <View style={styles.container}>
      {/* Thinking Animation */}
      <MotiView
        animate={isThinking ? {
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        } : {}}
        transition={{
          type: 'timing',
          duration: 2000,
          repeat: isThinking ? Infinity : 0,
        }}
        style={[
          styles.assistant,
          { width: assistantSize, height: assistantSize }
        ]}
      >
        <MotiView
          animate={isThinking ? {
            opacity: [0.7, 1, 0.7],
          } : {}}
          transition={{
            type: 'timing',
            duration: 1500,
            repeat: isThinking ? Infinity : 0,
          }}
          style={styles.face}
        >
          <View style={styles.eyes}>
            <MotiView
              animate={isThinking ? {
                scaleY: [1, 0.1, 1],
              } : {}}
              transition={{
                type: 'timing',
                duration: 2000,
                repeat: isThinking ? Infinity : 0,
              }}
              style={[styles.eye, styles.leftEye]}
            />
            <MotiView
              animate={isThinking ? {
                scaleY: [1, 0.1, 1],
              } : {}}
              transition={{
                type: 'timing',
                duration: 2000,
                repeat: isThinking ? Infinity : 0,
                delay: 500,
              }}
              style={[styles.eye, styles.rightEye]}
            />
          </View>
          
          <MotiView
            animate={isThinking ? {
              scaleY: [1, 1.5, 1],
              scaleX: [1, 1.2, 1],
            } : {}}
            transition={{
              type: 'timing',
              duration: 2000,
              repeat: isThinking ? Infinity : 0,
              delay: 1000,
            }}
            style={styles.mouth}
          />
        </MotiView>
      </MotiView>

      {/* Ready Animation */}
      <MotiView
        animate={isReady ? {
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        } : {}}
        transition={{
          type: 'spring',
          damping: 15,
          stiffness: 300,
        }}
        style={[
          styles.readyEmoji,
        ]}
      >
        <Text style={{ fontSize: assistantSize * 0.4 }}
        >
        🎉</Text>
      </MotiView>

      {/* Thinking Dots */}
      {isThinking && (
        <MotiView
          style={styles.thinkingDots}
        >
          <MotiView
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              type: 'timing',
              duration: 1000,
              repeat: Infinity,
            }}
            style={styles.dot}
          />
          <MotiView
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              type: 'timing',
              duration: 1000,
              repeat: Infinity,
              delay: 200,
            }}
            style={styles.dot}
          />
          <MotiView
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              type: 'timing',
              duration: 1000,
              repeat: Infinity,
              delay: 400,
            }}
            style={styles.dot}
          />
        </MotiView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  assistant: {
    backgroundColor: THEME.primary,
    borderRadius: 30,
    justifyContent: 'center',
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
  face: {
    width: '80%',
    height: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyes: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  eye: {
    width: 8,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  leftEye: {
    marginRight: 4,
  },
  rightEye: {
    marginLeft: 4,
  },
  mouth: {
    width: 20,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  readyEmoji: {
    marginTop: 10,
  },
  thinkingDots: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: THEME.secondary,
    borderRadius: 3,
  },
});

export default AnimatedAssistant;