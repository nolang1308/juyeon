import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppColors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useUser } from '@/context/UserContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

// 혜택별 색상 팔레트
const BENEFIT_COLORS = [
  '#4ADE80', // green
  '#60A5FA', // blue
  '#A78BFA', // purple
  '#F472B6', // pink
  '#FBBF24', // amber
  '#2DD4BF', // teal
];

export default function ExpenditureAnalysisScreen() {
  const params = useLocalSearchParams();
  const { userData } = useUser();
  
  const originalCost = parseInt(params.originalCost as string) || 4500000;
  
  // 신청된 혜택 데이터 가공
  const appliedBenefitsData = userData.appliedBenefits.map((benefit, index) => {
    const amountStr = benefit.savings.replace(/[^0-9]/g, '');
    const amount = parseInt(amountStr, 10) * 10000;
    return {
      ...benefit,
      amount,
      color: BENEFIT_COLORS[index % BENEFIT_COLORS.length],
    };
  });

  const totalSavings = appliedBenefitsData.reduce((acc, item) => acc + item.amount, 0);
  const finalCost = Math.max(0, originalCost - totalSavings);

  // Animation values
  const bar1Anim = useRef(new Animated.Value(0)).current; // Original Cost
  const finalCostAnim = useRef(new Animated.Value(0)).current; // Base Cost (User pays)
  
  // 각 혜택별 애니메이션 값 생성
  const benefitAnims = useRef(appliedBenefitsData.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = [
      Animated.spring(bar1Anim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: false,
      }),
      Animated.spring(finalCostAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: false,
      }),
      ...benefitAnims.map(anim => 
        Animated.spring(anim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: false,
        })
      )
    ];

    Animated.stagger(100, animations).start();
  }, []);

  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const maxVal = Math.max(originalCost, finalCost + totalSavings) * 1.2;
  const chartHeight = 250;

  const bar1Height = bar1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (originalCost / maxVal) * chartHeight],
  });

  const finalCostHeight = finalCostAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (finalCost / maxVal) * chartHeight],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={AppColors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>예상 지출 분석 상세</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>월 예상 절감액</Text>
          <Text style={styles.summaryAmount}>
            <Text style={styles.highlight}>{formatCurrency(totalSavings)}</Text>원
          </Text>
          <Text style={styles.summarySub}>
            총 {appliedBenefitsData.length}건의 혜택이 적용되었습니다.
          </Text>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>비용 비교 분석</Text>
          
          <View style={styles.graphArea}>
            {/* Bar 1: Before Welfare */}
            <View style={styles.barWrapper}>
              <Text style={styles.barLabelTop}>{formatCurrency(originalCost)}</Text>
              <View style={styles.barTrack}>
                <Animated.View 
                  style={[
                    styles.bar, 
                    { height: bar1Height, backgroundColor: '#94A3B8' }
                  ]} 
                />
              </View>
              <Text style={styles.barLabelBottom}>혜택 전</Text>
            </View>

            {/* Bar 2: After Welfare (Stacked) */}
            <View style={styles.barWrapper}>
              <Text style={[styles.barLabelTop, { color: AppColors.secondary }]}>
                {formatCurrency(finalCost)}
              </Text>
              
              <View style={styles.barTrack}>
                {/* 혜택 막대들 (위에서부터 쌓임 - flex-end 기준이므로 순서 주의) */}
                {/* 실제로는 DOM 순서대로 아래에서 위로 쌓이려면 flexDirection: 'column-reverse' 쓰거나 순서 조정 필요.
                    여기서는 justifyContent: 'flex-end' 이므로, 
                    가장 아래에 있는 요소(코드상 마지막)가 바닥에 붙음.
                    따라서 [혜택들..., 본인부담금] 순서로 렌더링하면
                    본인부담금이 바닥에, 그 위에 혜택들이 쌓임.
                */}
                
                {appliedBenefitsData.map((benefit, index) => (
                  <Animated.View
                    key={benefit.id}
                    style={[
                      styles.bar,
                      {
                        height: benefitAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, (benefit.amount / maxVal) * chartHeight],
                        }),
                        backgroundColor: benefit.color,
                        marginBottom: 1, // 구분선 효과
                      }
                    ]}
                  />
                ))}

                {/* 본인 부담금 (가장 아래) */}
                <Animated.View 
                  style={[
                    styles.bar, 
                    { 
                      height: finalCostHeight, 
                      backgroundColor: AppColors.secondary,
                      borderTopLeftRadius: appliedBenefitsData.length === 0 ? 8 : 0,
                      borderTopRightRadius: appliedBenefitsData.length === 0 ? 8 : 0,
                    } 
                  ]} 
                />
              </View>
              <Text style={[styles.barLabelBottom, { fontWeight: 'bold', color: AppColors.secondary }]}>
                혜택 후
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>혜택 적용 상세 내역</Text>
          
          <View style={styles.detailItem}>
            <View style={styles.detailRow}>
              <View style={styles.labelWithDot}>
                <View style={[styles.dot, { backgroundColor: '#94A3B8' }]} />
                <Text style={styles.detailLabel}>기존 예상 비용</Text>
              </View>
              <Text style={styles.detailValue}>{formatCurrency(originalCost)}원</Text>
            </View>
          </View>

          <View style={styles.divider} />
          
          <Text style={styles.subHeader}>적용된 혜택</Text>
          {appliedBenefitsData.length > 0 ? (
            appliedBenefitsData.map((benefit) => (
              <View key={benefit.id} style={styles.benefitRow}>
                <View style={styles.labelWithDot}>
                  <View style={[styles.dot, { backgroundColor: benefit.color }]} />
                  <View>
                    <Text style={styles.benefitName}>{benefit.name}</Text>
                    <Text style={styles.benefitCategory}>{benefit.category}</Text>
                  </View>
                </View>
                <Text style={[styles.benefitAmount, { color: benefit.color }]}>
                  -{formatCurrency(benefit.amount)}원
                </Text>
              </View>
            ))
          ) : (
             <Text style={styles.emptyText}>적용된 혜택이 없습니다.</Text>
          )}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <View style={styles.labelWithDot}>
               <View style={[styles.dot, { backgroundColor: AppColors.secondary }]} />
               <Text style={styles.finalLabel}>최종 본인 부담금</Text>
            </View>
            <Text style={styles.finalValue}>{formatCurrency(finalCost)}원</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.checkButton}
          onPress={() => router.back()}
        >
          <Text style={styles.checkButtonText}>확인</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: AppColors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightGray,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    color: AppColors.darkGray,
    marginBottom: 10,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 10,
  },
  highlight: {
    color: AppColors.primary,
  },
  summarySub: {
    fontSize: 14,
    color: AppColors.darkGray,
  },
  chartContainer: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 30,
  },
  graphArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 300,
    paddingBottom: 10,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    flex: 1,
  },
  barTrack: {
    height: 250,
    justifyContent: 'flex-end', // Items stack from bottom
    width: 80,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
  },
  barLabelTop: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.darkGray,
  },
  barLabelBottom: {
    marginTop: 10,
    fontSize: 16,
    color: AppColors.darkGray,
  },
  detailsContainer: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 20,
  },
  detailItem: {
    paddingVertical: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelWithDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  detailLabel: {
    fontSize: 16,
    color: AppColors.darkGray,
  },
  detailValue: {
    fontSize: 16,
    color: AppColors.text,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.lightGray,
    marginVertical: 15,
  },
  subHeader: {
    fontSize: 14,
    color: AppColors.darkGray,
    marginBottom: 15,
    marginTop: 5,
  },
  benefitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  benefitName: {
    fontSize: 15,
    color: AppColors.text,
    fontWeight: '500',
  },
  benefitCategory: {
    fontSize: 12,
    color: AppColors.darkGray,
  },
  benefitAmount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: AppColors.darkGray,
    paddingVertical: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  finalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text,
  },
  finalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.secondary,
  },
  checkButton: {
    backgroundColor: AppColors.secondary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  checkButtonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});