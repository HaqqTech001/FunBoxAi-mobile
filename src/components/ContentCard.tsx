// import { LinearGradient } from 'expo-linear-gradient';
// import { MotiView } from 'moti';
// import React from 'react';
// import { Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { getTemplateByIndex } from '../../src/utils/colors';

// interface ContentCardProps {
//   caption: string;
//   templateIndex: number;
//   contentType: 'joke' | 'riddle' | 'story' | 'fact' | 'pickup';
//   onSave: () => void;
//   isSaved?: boolean;
// }

// const ContentCard: React.FC<ContentCardProps> = ({
//   caption,
//   templateIndex,
//   contentType,
//   onSave,
//   isSaved = false,
// }) => {
//   const template = getTemplateByIndex(contentType + 's' as any, templateIndex);

//   const handleShare = async () => {
//     try {
//       await Share.share({
//         message: caption,
//       });
//     } catch (error) {
//       console.log('Share failed:', error);
//     }
//   };

//   return (
//     <MotiView
//       from={{ opacity: 0, scale: 0.9, translateY: 20 }}
//       animate={{ opacity: 1, scale: 1, translateY: 0 }}
//       transition={{ type: 'spring', damping: 15, stiffness: 300 }}
//       style={styles.container}
//     >
//       <LinearGradient
//         colors={template.colors}
//         start={template.start}
//         end={template.end}
//         style={styles.gradientContainer}
//       >
//         <View style={styles.card}>
//           <Text style={styles.caption}>{caption}</Text>
          
//           <View style={styles.actions}>
//             <TouchableOpacity
//               style={[styles.actionButton, isSaved && styles.savedButton]}
//               onPress={onSave}
//             >
//               <Text style={styles.actionButtonText}>
//                 {isSaved ? '💾' : '💾'}
//               </Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={handleShare}
//             >
//               <Text style={styles.actionButtonText}>📤</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </LinearGradient>
//     </MotiView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 8,
//   },
//   gradientContainer: {
//     borderRadius: 20,
//     padding: 1,
//   },
//   card: {
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//     borderRadius: 19,
//     padding: 20,
//     minHeight: 120,
//     justifyContent: 'space-between',
//   },
//   caption: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//     textAlign: 'center',
//     lineHeight: 26,
//     marginBottom: 16,
//     fontFamily: 'Inter-SemiBold',
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   actionButton: {
//     backgroundColor: '#F3F4F6',
//     borderRadius: 12,
//     padding: 10,
//     minWidth: 50,
//     alignItems: 'center',
//   },
//   savedButton: {
//     backgroundColor: '#10B981',
//   },
//   actionButtonText: {
//     fontSize: 20,
//   },
// });

// export default ContentCard;

import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React from 'react';
import { Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getTemplateByIndex } from '../../src/utils/colors';

interface ContentCardProps {
  caption: string;
  templateIndex: number;
  contentType: 'joke' | 'riddle' | 'story' | 'fact' | 'pickup';
  onSave: () => void;
  isSaved?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({
  caption,
  templateIndex,
  contentType,
  onSave,
  isSaved = false,
}) => {
  // Map content types to template keys
  const templateKeyMap = {
    'joke': 'jokes',
    'riddle': 'riddles', 
    'story': 'stories',
    'fact': 'facts',
    'pickup': 'pickup'
  } as const;
  
  const templateKey = templateKeyMap[contentType] || 'jokes';
  const template = getTemplateByIndex(templateKey as any, templateIndex);

  const handleShare = async () => {
    try {
      await Share.share({
        message: caption,
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
          <Text style={styles.caption}>{caption}</Text>
          
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, isSaved && styles.savedButton]}
              onPress={onSave}
            >
              <Text style={styles.actionButtonText}>
                {isSaved ? '💾' : '💾'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Text style={styles.actionButtonText}>📤</Text>
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
    minHeight: 120,
    justifyContent: 'space-between',
  },
  caption: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
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

export default ContentCard