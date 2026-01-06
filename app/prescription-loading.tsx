import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppColors } from '@/constants/theme';

export default function PrescriptionLoadingScreen() {
  const params = useLocalSearchParams();

  useEffect(() => {
    // 3초 후 완료 페이지로 이동
    const timer = setTimeout(() => {
      router.replace({
        pathname: '/prescription-complete',
        params: {
          selectedItems: params.selectedItems,
          type: params.type
        }
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [params]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <View style={styles.loadingImagePlaceholder}>
            <Text style={styles.loadingImageText}>⏳</Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>복지 혜택 신청 중...</Text>
          <Text style={styles.subtitle}>
            AI가 최적의 신청 경로를 찾고 있습니다
          </Text>
          
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AppColors.primary} />
            <Text style={styles.loadingText}>처리 중</Text>
          </View>

          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, styles.completedDot]} />
              <Text style={styles.statusText}>서류 검증 완료</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, styles.completedDot]} />
              <Text style={styles.statusText}>자격 요건 확인 완료</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, styles.activeDot]} />
              <Text style={styles.statusText}>신청서 자동 작성 중...</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>담당 기관 전송 대기</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  imageContainer: {
    marginBottom: 40,
  },
  loadingImagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: AppColors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImageText: {
    fontSize: 80,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.darkGray,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: AppColors.primary,
    fontWeight: '600',
  },
  statusContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: AppColors.lightGray,
    marginRight: 12,
  },
  completedDot: {
    backgroundColor: '#10B981',
  },
  activeDot: {
    backgroundColor: AppColors.primary,
  },
  statusText: {
    fontSize: 14,
    color: AppColors.text,
  },
});