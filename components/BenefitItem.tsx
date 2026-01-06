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
}

interface BenefitItemProps {
  benefit: Benefit;
  onPress?: () => void;
  isApplied?: boolean;
}

export default function BenefitItem({ benefit, onPress, isApplied }: BenefitItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.badgeContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{benefit.category}</Text>
          </View>
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