import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { AppColors } from '@/constants/theme';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  interpolate,
} from 'react-native-reanimated';

interface NotificationCardProps {
  patientName: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function NotificationCard({ patientName, isVisible, onClose }: NotificationCardProps) {
  const heightValue = useSharedValue(0);
  const opacityValue = useSharedValue(0);
  const waveValue = useSharedValue(0);
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      heightValue.value = withSpring(180, {
        damping: 12, 
        stiffness: 200,
        mass: 0.8,
      });
      opacityValue.value = withTiming(1, { duration: 300 });
      
      // 파동 효과 시작
      waveValue.value = withRepeat(
        withTiming(1, { duration: 2000 }),
        -1, // 무한 반복
        false
      );
    } else {
      heightValue.value = withTiming(0, { duration: 250 });
      opacityValue.value = withTiming(0, { duration: 150 });
      waveValue.value = 0; // 파동 효과 중지
      // 애니메이션 완료 후 렌더링 중단
      setTimeout(() => setShouldRender(false), 250);
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: heightValue.value,
      opacity: opacityValue.value,
    };
  });

  const waveAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      waveValue.value,
      [0, 0.25, 0.5, 0.75, 1],
      [-100, 0, 50, 100, 150]
    );
    
    return {
      transform: [{ translateX }],
    };
  });

  const handlePrescriptionCheck = () => {
    onClose();
    router.push('/prescription-check');
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.card}>
        {/* 파동 효과를 위한 그라디언트 오버레이 */}
        <View style={styles.waveContainer}>
          <Animated.View style={[styles.waveGradient, waveAnimatedStyle]}>
            <ExpoLinearGradient
              colors={['rgba(245, 158, 11, 0)', 'rgba(245, 158, 11, 0.3)', 'rgba(245, 158, 11, 0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientOverlay}
            />
          </Animated.View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>🔔 새로운 복지 처방도착!</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.message}>
          {patientName}님의 진단결과에 따른 맞춤 혜택 3종이 산출되었습니다.
        </Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handlePrescriptionCheck}
        >
          <Text style={styles.actionButtonText}>처방전 확인하기</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 7,
    position: 'relative',
    overflow: 'hidden',
  },
  waveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    borderRadius: 12,
  },
  waveGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 700,
  },
  gradientOverlay: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#92400E',
    fontWeight: 'bold',
  },
  message: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});