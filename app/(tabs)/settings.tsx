import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import TopBar from '@/components/TopBar';
import { AppColors } from '@/constants/theme';

export default function SettingsScreen() {
  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '로그아웃', 
          style: 'destructive',
          onPress: () => router.replace('/login')
        },
      ]
    );
  };

  const settingItems = [
    { title: '프로필 수정', description: '개인정보 및 환자정보 수정' },
    { title: '알림 설정', description: '혜택 알림 및 푸시 알림 설정' },
    { title: '문의하기', description: '서비스 관련 문의 및 건의사항' },
    { title: '이용약관', description: '서비스 이용약관 확인' },
    { title: '개인정보처리방침', description: '개인정보 처리방침 확인' },
  ];

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>설정</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정</Text>
          {settingItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingDescription}>{item.description}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기타</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>앱 버전</Text>
              <Text style={styles.settingDescription}>v1.0.0</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.gray,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 20,
  },
  section: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.secondary,
    padding: 20,
    backgroundColor: AppColors.gray,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightGray,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: AppColors.darkGray,
  },
  arrow: {
    fontSize: 16,
    color: AppColors.darkGray,
  },
  logoutButton: {
    backgroundColor: AppColors.error,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoutText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});