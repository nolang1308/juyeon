import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { AppColors } from '@/constants/theme';

interface PrescriptionRecord {
  id: string;
  hospitalName: string;
  date: string;
  imageUri: string;
  addedDate: string;
}

interface PrescriptionCardProps {
  prescription: PrescriptionRecord;
  onPress?: () => void;
}

export default function PrescriptionCard({ prescription, onPress }: PrescriptionCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderPrescriptionImage = () => {
    if (prescription.imageUri === 'placeholder') {
      return (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderImageText}>📋</Text>
        </View>
      );
    }
    
    return (
      <Image 
        source={{ uri: prescription.imageUri }} 
        style={styles.prescriptionImage}
        resizeMode="cover"
      />
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {renderPrescriptionImage()}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.hospitalName}>{prescription.hospitalName}</Text>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{formatDate(prescription.date)}</Text>
          </View>
        </View>
        
        <Text style={styles.addedDate}>
          등록일: {formatDate(prescription.addedDate)}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.viewText}>처방전 보기 →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
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
  imageContainer: {
    marginRight: 16,
  },
  prescriptionImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: AppColors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImageText: {
    fontSize: 24,
    color: AppColors.darkGray,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text,
    flex: 1,
  },
  dateBadge: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.white,
  },
  addedDate: {
    fontSize: 12,
    color: AppColors.darkGray,
    marginBottom: 8,
  },
  footer: {
    alignItems: 'flex-end',
  },
  viewText: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '600',
  },
});