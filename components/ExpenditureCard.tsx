import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppColors } from '@/constants/theme';
import { IconSymbol } from './ui/icon-symbol';

interface ExpenditureCardProps {
  originalCost: number;
  savings: number;
  onPress: () => void;
}

export default function ExpenditureCard({ originalCost, savings, onPress }: ExpenditureCardProps) {
  const finalCost = originalCost - savings;

  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          <IconSymbol name="chart.bar.fill" size={20} color={AppColors.white} />
        </View>
        <Text style={styles.title}>예상 지출 분석</Text>
        <IconSymbol name="chevron.right" size={16} color={AppColors.darkGray} style={styles.arrow} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>혜택 적용 전 간병비</Text>
          <Text style={styles.originalCost}>{formatCurrency(originalCost)}원</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>혜택 적용 후 예상액</Text>
          <Text style={styles.finalCost}>{formatCurrency(finalCost)}원</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.savingContainer}>
           <Text style={styles.savingText}>
             {savings > 0 ? (
               <>매월 약 <Text style={styles.highlight}>{Math.floor(savings / 10000)}만원</Text>의 예산이 절감됩니다!</>
             ) : (
               <>혜택을 신청하고 <Text style={styles.highlight}>예상 절감액</Text>을 확인해보세요!</>
             )}
           </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    borderColor: '#2c2c2c',
    borderWidth: 2,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text,
    flex: 1,
  },
  arrow: {
    marginLeft: 'auto',
  },
  contentContainer: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: AppColors.darkGray,
  },
  originalCost: {
    fontSize: 14,
    color: AppColors.darkGray,
    textDecorationLine: 'line-through',
  },
  finalCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.lightGray,
    marginVertical: 8,
  },
  savingContainer: {
    backgroundColor: '#F0F9FF', // Light blue background
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  savingText: {
    fontSize: 15,
    color: AppColors.secondary,
    fontWeight: '600',
  },
  highlight: {
    color: AppColors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
