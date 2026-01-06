import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppColors } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';

interface CostData {
  originalCost: number;
  discountedCost: number;
  savings: number;
  savingsPercentage: number;
}

export default function BenefitDetailScreen() {
  const params = useLocalSearchParams();
  const { applyBenefit, userData } = useUser();
  const [costData, setCostData] = useState<CostData | null>(null);
  
  // Animation values
  const originalBarWidth = useSharedValue(0);
  const discountedBarWidth = useSharedValue(0);
  const savingsOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.8);

  const benefitDetails = {
    '1': {
      id: '1',
      name: '장기요양보험 재가급여',
      category: '요양급여',
      savings: '월 80만원',
      description: '가정에서 요양 서비스를 받을 수 있는 혜택입니다. 방문요양, 방문목욕, 방문간호, 주·야간보호, 단기보호 서비스 등을 제공하여 환자와 가족의 부담을 크게 덜어드립니다.',
      detailedDescription: '장기요양보험 재가급여는 거동이 불편한 어르신들이 가정에서 전문적인 요양서비스를 받을 수 있도록 지원하는 제도입니다. 요양보호사가 직접 가정을 방문하여 신체활동 지원, 가사활동 지원, 인지활동형 프로그램 등을 제공합니다.',
      agency: '국민건강보험공단',
      contact: '1577-1000',
      requirements: [
        '만 65세 이상 또는 65세 미만 노인성 질병을 가진 자',
        '장기요양인정 신청 및 등급 판정 필요',
        '1~5등급 또는 인지지원등급 판정 필요'
      ]
    },
    '2': {
      id: '2',
      name: '중증환자 의료비 지원',
      category: '의료비지원',
      savings: '월 120만원',
      description: '뇌혈관질환, 심장질환 등 중증질환자를 위한 의료비 지원 제도입니다. 본인부담금을 크게 줄일 수 있습니다.',
      detailedDescription: '중증질환 의료비 지원사업은 암, 뇌혈관질환, 심장질환, 희귀질환, 중증화상 등으로 진단받은 환자의 경제적 부담을 덜어주기 위한 제도입니다. 본인부담금 상한제와 함께 적용되어 의료비 부담을 최소화합니다.',
      agency: '보건복지부',
      contact: '129 (보건복지콜센터)',
      requirements: [
        '중증질환(암, 뇌혈관질환, 심장질환 등) 진단',
        '건강보험 가입자 또는 피부양자',
        '소득수준에 따른 지원 차등 적용'
      ]
    },
    '3': {
      id: '3',
      name: '장애인활동지원서비스',
      category: '돌봄서비스',
      savings: '월 60만원',
      description: '일상생활 지원이 필요한 분을 위한 활동보조 서비스를 제공합니다.',
      detailedDescription: '장애인이 지역사회에서 자립생활을 할 수 있도록 신체활동, 가사활동, 사회활동 등을 종합적으로 지원하는 서비스입니다. 개인별 지원계획에 따라 맞춤형 서비스를 제공합니다.',
      agency: '보건복지부',
      contact: '129 (보건복지콜센터)',
      requirements: [
        '만 6세 이상 ~ 만 65세 미만 등록 장애인',
        '활동지원 인정조사표에 의한 점수 기준 충족',
        '장애인활동지원 수급자격 인정'
      ]
    },
    '4': {
      id: '4',
      name: '간병비 지원사업',
      category: '간병지원',
      savings: '월 40만원',
      description: '저소득층 환자의 간병비 부담을 덜어주는 지원사업입니다.',
      detailedDescription: '의료급여 수급권자 등 저소득층 환자가 입원 시 발생하는 간병비 부담을 줄이기 위해 간병서비스를 지원하는 사업입니다. 전문 간병인이 환자의 일상생활을 도와드립니다.',
      agency: '지역 보건소',
      contact: '지역 보건소 문의',
      requirements: [
        '의료급여 수급권자',
        '기초생활보장 수급자',
        '입원 치료가 필요한 환자'
      ]
    }
  };

  const benefit = benefitDetails[params.id as keyof typeof benefitDetails];
  const isAlreadyApplied = userData.appliedBenefits.some(applied => applied.id === params.id);

  useEffect(() => {
    if (benefit) {
      // Parse savings amount and calculate costs
      const savingsAmount = parseInt(benefit.savings.replace(/[^0-9]/g, '')) || 0;
      const originalCost = savingsAmount * 3; // Assume original cost is 3x the savings
      const discountedCost = originalCost - savingsAmount;
      const savingsPercentage = (savingsAmount / originalCost) * 100;

      setCostData({
        originalCost,
        discountedCost,
        savings: savingsAmount,
        savingsPercentage,
      });

      // Start animations
      cardScale.value = withSpring(1, { damping: 10, stiffness: 100 });
      originalBarWidth.value = withDelay(300, withTiming(100, { duration: 800 }));
      discountedBarWidth.value = withDelay(600, withTiming((discountedCost / originalCost) * 100, { duration: 800 }));
      savingsOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }));
    }
  }, [benefit]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const originalBarStyle = useAnimatedStyle(() => ({
    width: `${originalBarWidth.value}%`,
  }));

  const discountedBarStyle = useAnimatedStyle(() => ({
    width: `${discountedBarWidth.value}%`,
  }));

  const savingsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: savingsOpacity.value,
    transform: [{ scale: savingsOpacity.value }],
  }));

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()}만원`;
  };

  if (!benefit) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← 뒤로</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>혜택 정보를 찾을 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleApply = () => {
    if (isAlreadyApplied) {
      Alert.alert('알림', '이미 신청한 혜택입니다.');
      return;
    }

    Alert.alert(
      '혜택 자동신청',
      `${benefit.name} 혜택을 자동으로 신청하시겠습니까?\n\n담당기관에서 연락을 드릴 예정입니다.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '신청하기',
          onPress: () => {
            applyBenefit({
              id: benefit.id,
              name: benefit.name,
              category: benefit.category,
              savings: benefit.savings,
            });
            Alert.alert(
              '신청 완료',
              '혜택 신청이 완료되었습니다.\n담당기관에서 빠른 시일 내에 연락드릴 예정입니다.',
              [{ text: '확인', onPress: () => router.back() }]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.titleSection, cardAnimatedStyle]}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{benefit.category}</Text>
          </View>
          <Text style={styles.title}>{benefit.name}</Text>
          <View style={styles.savingsContainer}>
            <Text style={styles.savingsText}>{benefit.savings}</Text>
            <Text style={styles.savingsLabel}>예상 절감비용</Text>
          </View>
        </Animated.View>

        {costData && (
          <View style={styles.costAnalysisCard}>
            <Text style={styles.analysisTitle}>💰 비용 분석</Text>
            
            {/* Original Cost Bar */}
            <View style={styles.costSection}>
              <View style={styles.costHeader}>
                <Text style={styles.costLabel}>원래 비용</Text>
                <Text style={styles.costAmount}>{formatCurrency(costData.originalCost)}</Text>
              </View>
              <View style={styles.barContainer}>
                <Animated.View style={[styles.costBar, styles.originalBar, originalBarStyle]} />
              </View>
            </View>

            {/* Discounted Cost Bar */}
            <View style={styles.costSection}>
              <View style={styles.costHeader}>
                <Text style={styles.costLabel}>할인 적용 후</Text>
                <Text style={styles.costAmount}>{formatCurrency(costData.discountedCost)}</Text>
              </View>
              <View style={styles.barContainer}>
                <Animated.View style={[styles.costBar, styles.discountedBar, discountedBarStyle]} />
              </View>
            </View>

            {/* Savings Highlight */}
            <Animated.View style={[styles.savingsHighlight, savingsAnimatedStyle]}>
              <Text style={styles.savingsTitle}>🎉 총 절약 금액</Text>
              <Text style={styles.savingsAmount}>{formatCurrency(costData.savings)}</Text>
              <Text style={styles.savingsPercentage}>
                {costData.savingsPercentage.toFixed(1)}% 절약
              </Text>
            </Animated.View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>상세 설명</Text>
          <Text style={styles.description}>{benefit.detailedDescription}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>지원 대상</Text>
          {benefit.requirements.map((req, index) => (
            <View key={index} style={styles.requirementItem}>
              <Text style={styles.requirementBullet}>•</Text>
              <Text style={styles.requirementText}>{req}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>담당기관 정보</Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>담당기관:</Text>
              <Text style={styles.contactValue}>{benefit.agency}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>연락처:</Text>
              <Text style={styles.contactValue}>{benefit.contact}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.applyButton, isAlreadyApplied && styles.appliedButton]} 
          onPress={handleApply}
          disabled={isAlreadyApplied}
        >
          <Text style={[styles.applyButtonText, isAlreadyApplied && styles.appliedButtonText]}>
            {isAlreadyApplied ? '신청 완료' : '혜택 자동신청'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.gray,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: AppColors.white,
  },
  backButton: {
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: AppColors.secondary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleSection: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 15,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.white,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: AppColors.secondary,
    textAlign: 'center',
    marginBottom: 15,
  },
  savingsContainer: {
    alignItems: 'center',
  },
  savingsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.secondary,
  },
  savingsLabel: {
    fontSize: 14,
    color: AppColors.darkGray,
    marginTop: 4,
  },
  section: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: AppColors.text,
    lineHeight: 24,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  requirementBullet: {
    fontSize: 16,
    color: AppColors.primary,
    fontWeight: 'bold',
    marginRight: 8,
    marginTop: 2,
  },
  requirementText: {
    flex: 1,
    fontSize: 16,
    color: AppColors.text,
    lineHeight: 22,
  },
  contactInfo: {
    backgroundColor: AppColors.gray,
    borderRadius: 8,
    padding: 15,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.darkGray,
    width: 80,
  },
  contactValue: {
    flex: 1,
    fontSize: 16,
    color: AppColors.text,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  appliedButton: {
    backgroundColor: AppColors.lightGray,
  },
  applyButtonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  appliedButtonText: {
    color: AppColors.darkGray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: AppColors.darkGray,
    textAlign: 'center',
  },
  costAnalysisCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 20,
  },
  costSection: {
    marginBottom: 20,
  },
  costHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  costLabel: {
    fontSize: 14,
    color: AppColors.text,
    fontWeight: '600',
  },
  costAmount: {
    fontSize: 14,
    color: AppColors.secondary,
    fontWeight: 'bold',
  },
  barContainer: {
    height: 16,
    backgroundColor: AppColors.lightGray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  costBar: {
    height: '100%',
    borderRadius: 8,
  },
  originalBar: {
    backgroundColor: '#FF6B6B',
  },
  discountedBar: {
    backgroundColor: '#51CF66',
  },
  savingsHighlight: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#51CF66',
  },
  savingsTitle: {
    fontSize: 14,
    color: AppColors.text,
    marginBottom: 8,
  },
  savingsAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D8A2F',
    marginBottom: 4,
  },
  savingsPercentage: {
    fontSize: 12,
    color: '#2D8A2F',
    fontWeight: '600',
  },
});