import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { THEME } from '../../src/utils/colors';

interface LoadingDotsProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  count?: number;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 'medium',
  color = THEME.primary,
  count = 3,
}) => {
  const getDotSize = () => {
    switch (size) {
      case 'small':
        return 4;
      case 'large':
        return 8;
      default:
        return 6;
    }
  };

  const dotSize = getDotSize();

  return (
    <View style={styles.container}>
      {Array.from({ length: count }, (_, index) => (
        <MotiView
          key={index}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            type: 'timing',
            duration: 1000,
            repeat: Infinity,
            delay: index * 200,
          }}
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: color,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  dot: {
    marginHorizontal: 2,
  },
});

export default LoadingDots;