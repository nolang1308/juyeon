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
import { BENEFIT_DATA } from '@/constants/benefits';
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

  // Find benefit from shared data
  const benefit = BENEFIT_DATA.find(b => b.id === params.id);
  const isAlreadyApplied = userData.appliedBenefits.some(applied => applied.id === params.id);

  const getDdayInfo = (deadline?: string) => {
    if (!deadline) return null;
    const today = new Date();
    const target = new Date(deadline);
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: '마감', color: '#9E9E9E', bg: '#F5F5F5' };
    if (diffDays === 0) return { text: 'D-Day', color: '#FFFFFF', bg: '#FF5252' };
    if (diffDays <= 7) return { text: `D-${diffDays}`, color: '#FFFFFF', bg: '#FF5252' };
    return { text: `D-${diffDays}`, color: '#FFFFFF', bg: '#2196F3' };
  };

  const dDay = getDdayInfo(benefit?.deadline);

  useEffect(() => {
    if (benefit) {
      // Parse savings amount and calculate costs
      const savingsAmount = parseInt(benefit.savings.replace(/[^0-9]/g, '')) || 0;
      const originalCost = savingsAmount * 3; // Assume original cost is 3x the savings
      const discountedCost = originalCost - savingsAmount;
      const savingsPercentage = originalCost > 0 ? (savingsAmount / originalCost) * 100 : 0;

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
          
          {benefit.deadline && dDay && (
            <View style={styles.deadlineWrapper}>
              <View style={[styles.dDayBadge, { backgroundColor: dDay.bg }]}>
                <Text style={[styles.dDayText, { color: dDay.color }]}>{dDay.text}</Text>
              </View>
              <Text style={styles.deadlineText}>
                ~ {benefit.deadline}까지
              </Text>
            </View>
          )}

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
          {benefit.requirements?.map((req, index) => (
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
  deadlineWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  dDayBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dDayText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  deadlineText: {
    fontSize: 14,
    color: AppColors.darkGray,
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
