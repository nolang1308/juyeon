import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppColors } from '@/constants/theme';
import { useUser } from '@/context/UserContext';

export default function PrescriptionCompleteScreen() {
  const params = useLocalSearchParams();
  const { applyBenefit, userData } = useUser();

  const prescriptionData = {
    'p1': { id: 'p1', name: '장기요양보험 재가급여', category: '요양급여', savings: '월 80만원' },
    'p2': { id: 'p2', name: '중증환자 의료비 지원', category: '의료비지원', savings: '월 120만원' },
    'p3': { id: 'p3', name: '간병비 지원사업', category: '간병지원', savings: '월 40만원' }
  };

  useEffect(() => {
    // 신청된 혜택들을 이력에 추가
    try {
      const selectedItems = JSON.parse(params.selectedItems as string);
      selectedItems.forEach((itemId: string) => {
        const benefit = prescriptionData[itemId as keyof typeof prescriptionData];
        if (benefit) {
          applyBenefit(benefit);
        }
      });
    } catch (error) {
      console.error('Error parsing selected items:', error);
    }
  }, [params.selectedItems]);

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  const getAppliedCount = () => {
    try {
      const selectedItems = JSON.parse(params.selectedItems as string);
      return selectedItems.length;
    } catch {
      return 0;
    }
  };

  const getTotalSavings = () => {
    try {
      const selectedItems = JSON.parse(params.selectedItems as string);
      let total = 0;
      selectedItems.forEach((itemId: string) => {
        switch (itemId) {
          case 'p1': total += 80; break;
          case 'p2': total += 120; break;
          case 'p3': total += 40; break;
        }
      });
      return total;
    } catch {
      return 0;
    }
  };

  const patientName = userData.patient?.patientName || '환자';
  const appliedCount = getAppliedCount();
  const totalSavings = getTotalSavings();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <View style={styles.completeImagePlaceholder}>
            <Text style={styles.completeImageText}>🎉</Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.title}>신청이 완료되었습니다!</Text>
          <Text style={styles.subtitle}>
            {patientName}님의 복지 혜택 {appliedCount}건이{'\n'}
            성공적으로 신청되었습니다.
          </Text>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>신청 혜택</Text>
              <Text style={styles.summaryValue}>{appliedCount}건</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>예상 절감</Text>
              <Text style={styles.summaryValue}>월 {totalSavings}만원</Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>📞 다음 단계</Text>
            <Text style={styles.infoText}>
              • 담당 기관에서 2-3일 내 연락드립니다{'\n'}
              • 추가 서류가 필요한 경우 안내해드립니다{'\n'}
              • 신청 현황은 '이력' 탭에서 확인 가능합니다
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>메인으로 돌아가기</Text>
        </TouchableOpacity>
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
  completeImagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeImageText: {
    fontSize: 80,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.darkGray,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.gray,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: AppColors.darkGray,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.secondary,
  },
  infoContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: AppColors.text,
    lineHeight: 20,
  },
  homeButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.white,
  },
});