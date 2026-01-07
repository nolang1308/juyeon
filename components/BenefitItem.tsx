import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { AppColors } from '@/constants/theme';

interface Benefit {
  id: string;
  name: string;
  description: string;
  savings: string;
  category: string;
  deadline?: string;
}

interface BenefitItemProps {
  benefit: Benefit;
  onPress?: () => void;
  isApplied?: boolean;
}

export default function BenefitItem({ benefit, onPress, isApplied }: BenefitItemProps) {
  const getDdayInfo = (deadline?: string) => {
    if (!deadline) return null;
    
    const today = new Date();
    // For demo purposes, let's fix today as 2026-01-07 if needed, 
    // but using system date is better for real app. 
    // Assuming system date is correct.
    const target = new Date(deadline);
    
    // Normalize time to compare dates only
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: '마감', color: '#9E9E9E', bg: '#F5F5F5' };
    if (diffDays === 0) return { text: 'D-Day', color: '#FFFFFF', bg: '#FF5252' };
    if (diffDays <= 7) return { text: `D-${diffDays}`, color: '#FFFFFF', bg: '#FF5252' }; // Emergency
    return { text: `D-${diffDays}`, color: '#FFFFFF', bg: '#2196F3' }; // Normal
  };

  const dDay = getDdayInfo(benefit.deadline);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.badgeContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{benefit.category}</Text>
          </View>
          {dDay && (
            <View style={[styles.dDayBadge, { backgroundColor: dDay.bg }]}>
              <Text style={[styles.dDayText, { color: dDay.color }]}>{dDay.text}</Text>
            </View>
          )}
          {isApplied && (
            <View style={styles.appliedBadge}>
              <Text style={styles.appliedText}>신청함</Text>
            </View>
          )}
        </View>
        <View style={styles.savingsContainer}>
          <Text style={styles.savingsText}>{benefit.savings}</Text>
          <Text style={styles.savingsLabel}>절감</Text>
        </View>
      </View>
      
      <Text style={styles.name}>{benefit.name}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {benefit.description}
      </Text>
      
      <View style={styles.footer}>
        <Text style={styles.detailText}>자세히 보기 →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 1,
    borderColor: AppColors.lightGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  categoryBadge: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
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
  appliedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  appliedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.white,
  },
  savingsContainer: {
    alignItems: 'flex-end',
  },
  savingsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.secondary,
  },
  savingsLabel: {
    fontSize: 12,
    color: AppColors.darkGray,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: AppColors.darkGray,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    alignItems: 'flex-end',
  },
  detailText: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '600',
  },
});