import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { AppColors } from '@/constants/theme';
import { useUser } from '@/context/UserContext';

export default function MyPageScreen() {
  const { userData } = useUser();

  const goBack = () => {
    router.back();
  };

  const handleEdit = () => {
    Alert.alert('알림', '정보 수정 기능은 준비 중입니다.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>마이페이지</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <Text style={styles.cardTitle}>보호자 정보</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>이름</Text>
              <Text style={styles.value}>{userData.guardian?.guardianName || '정보 없음'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>전화번호</Text>
              <Text style={styles.value}>{userData.guardian?.guardianPhone || '정보 없음'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>관계</Text>
              <Text style={styles.value}>{userData.guardian?.relationship || '정보 없음'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>거주지역</Text>
              <Text style={styles.value}>{userData.guardian?.region || '정보 없음'}</Text>
            </View>
          </View>

          <View style={styles.profileCard}>
            <Text style={styles.cardTitle}>환자 정보</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>이름</Text>
              <Text style={styles.value}>{userData.patient?.patientName || '정보 없음'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>생년월일</Text>
              <Text style={styles.value}>{userData.patient?.birthDate || '정보 없음'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>나이</Text>
              <Text style={styles.value}>{userData.patient?.age ? `${userData.patient.age}세` : '정보 없음'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>진단명</Text>
              <Text style={styles.value}>{userData.patient?.diseases || '정보 없음'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>거주지역</Text>
              <Text style={styles.value}>{userData.patient?.patientRegion || '정보 없음'}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>정보 수정</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: AppColors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightGray,
  },
  backButton: {
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: AppColors.secondary,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.secondary,
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightGray,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.darkGray,
    minWidth: 80,
  },
  value: {
    fontSize: 16,
    color: AppColors.text,
    flex: 1,
  },
  editButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});