import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { AppColors } from '@/constants/theme';
import { useUser } from '@/context/UserContext';

export default function GuardianSignup4Screen() {
  const params = useLocalSearchParams();
  const { setGuardianInfo, setPatientInfo, addPrescription } = useUser();
  
  const [documents, setDocuments] = useState<Array<{
    name: string;
    uri: string;
    type: string;
  }>>([]);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    kakao: false,
    sms: false,
    app: false,
  });

  const toggleNotification = (type: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled) {
        setDocuments([...documents, ...result.assets.map(asset => ({
          name: asset.name,
          uri: asset.uri,
          type: asset.mimeType || 'unknown',
        }))]);
      }
    } catch (error) {
      Alert.alert('오류', '파일 선택 중 오류가 발생했습니다.');
    }
  };

  const handleImagePicker = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permission.status !== 'granted') {
      Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newImages = result.assets.map(asset => ({
          name: asset.fileName || `image_${Date.now()}.jpg`,
          uri: asset.uri,
          type: 'image/jpeg',
        }));
        setDocuments([...documents, ...newImages]);
      }
    } catch (error) {
      Alert.alert('오류', '이미지 선택 중 오류가 발생했습니다.');
    }
  };

  const removeDocument = (index: number) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    setDocuments(newDocuments);
  };

  const handleComplete = () => {
    if (!agreePrivacy) {
      Alert.alert('오류', '개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    // 가입 정보 저장
    const guardianInfo = {
      phoneNumber: params.phoneNumber as string,
      password: params.password as string,
      guardianName: params.guardianName as string,
      guardianPhone: params.guardianPhone as string,
      relationship: params.relationship as string,
      region: params.region as string,
    };

    const patientInfo = {
      patientName: params.patientName as string,
      birthDate: params.birthDate as string,
      patientRelationship: params.patientRelationship as string,
      patientRegion: params.patientRegion as string,
      diseases: params.diseases as string,
    };

    setGuardianInfo(guardianInfo);
    setPatientInfo(patientInfo);
    
    // 기본 처방전 추가
    addPrescription({
      hospitalName: '마산병원',
      date: '2025-12-10',
      imageUri: 'placeholder', // 실제 앱에서는 기본 이미지 또는 업로드된 이미지 사용
    });

    Alert.alert(
      '회원가입 완료',
      '회원가입이 성공적으로 완료되었습니다.',
      [
        {
          text: '확인',
          onPress: () => router.replace('/login'),
        },
      ]
    );
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>보호자 회원가입</Text>
          <Text style={styles.subtitle}>4단계: 서류 업로드 및 완료</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressStep, styles.activeStep]} />
            <View style={[styles.progressStep, styles.activeStep]} />
            <View style={[styles.progressStep, styles.activeStep]} />
            <View style={[styles.progressStep, styles.activeStep]} />
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>서류 업로드 (선택사항)</Text>
            <Text style={styles.sectionDescription}>
              가족관계증명서, 처방전, 진단서 등을 업로드하면{'\n'}
              더 정확한 혜택 추천을 받을 수 있습니다.
            </Text>

            <View style={styles.uploadButtonContainer}>
              <TouchableOpacity style={styles.uploadButton} onPress={handleDocumentPicker}>
                <Text style={styles.uploadButtonText}>📄 문서 선택</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.uploadButton} onPress={handleImagePicker}>
                <Text style={styles.uploadButtonText}>📷 사진 선택</Text>
              </TouchableOpacity>
            </View>

            {documents.length > 0 && (
              <View style={styles.documentsContainer}>
                <Text style={styles.documentsTitle}>업로드된 파일:</Text>
                {documents.map((doc, index) => (
                  <View key={index} style={styles.documentItem}>
                    <Text style={styles.documentName} numberOfLines={1}>
                      {doc.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeDocument(index)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>개인정보 수집 및 이용 동의</Text>
            <View style={styles.agreementContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAgreePrivacy(!agreePrivacy)}
              >
                <View style={[styles.checkbox, agreePrivacy && styles.checkedBox]}>
                  {agreePrivacy && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.agreementText}>
                  개인정보 수집 및 이용에 동의합니다. (필수)
                </Text>
              </TouchableOpacity>
              
              <Text style={styles.agreementDetail}>
                • 수집목적: 의료지원 혜택 추천 서비스 제공{'\n'}
                • 수집항목: 이름, 전화번호, 환자정보 등{'\n'}
                • 보유기간: 회원탈퇴 시까지
              </Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>혜택 및 공지 알림 설정 (선택)</Text>
            <Text style={styles.sectionDescription}>
              새로운 복지 혜택과 주요 공지사항이 있을 때{'\n'}
              알림을 받을 수단을 선택해 주세요.
            </Text>
            <View style={styles.notificationOptions}>
              <TouchableOpacity
                style={styles.notifOptionItem}
                onPress={() => toggleNotification('kakao')}
              >
                <View style={[styles.checkbox, notificationSettings.kakao && styles.checkedBox]}>
                  {notificationSettings.kakao && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.notifOptionText}>카카오톡</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.notifOptionItem}
                onPress={() => toggleNotification('sms')}
              >
                <View style={[styles.checkbox, notificationSettings.sms && styles.checkedBox]}>
                  {notificationSettings.sms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.notifOptionText}>문자 메시지</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.notifOptionItem}
                onPress={() => toggleNotification('app')}
              >
                <View style={[styles.checkbox, notificationSettings.app && styles.checkedBox]}>
                  {notificationSettings.app && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.notifOptionText}>앱 푸시 알림</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>회원가입 완료</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.darkGray,
    marginBottom: 20,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
  },
  progressStep: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: AppColors.lightGray,
  },
  activeStep: {
    backgroundColor: AppColors.primary,
  },
  formContainer: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: AppColors.darkGray,
    marginBottom: 20,
    lineHeight: 20,
  },
  uploadButtonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: AppColors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  documentsContainer: {
    backgroundColor: AppColors.gray,
    borderRadius: 8,
    padding: 15,
  },
  documentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 10,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightGray,
  },
  documentName: {
    flex: 1,
    fontSize: 14,
    color: AppColors.text,
  },
  removeButton: {
    padding: 5,
  },
  removeButtonText: {
    fontSize: 16,
    color: AppColors.error,
    fontWeight: 'bold',
  },
  agreementContainer: {
    backgroundColor: AppColors.gray,
    borderRadius: 8,
    padding: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: AppColors.lightGray,
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  checkmark: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  agreementText: {
    flex: 1,
    fontSize: 16,
    color: AppColors.text,
    fontWeight: '600',
  },
  agreementDetail: {
    fontSize: 12,
    color: AppColors.darkGray,
    lineHeight: 18,
  },
  notificationOptions: {
    backgroundColor: AppColors.gray,
    borderRadius: 8,
    padding: 15,
    gap: 15,
  },
  notifOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifOptionText: {
    fontSize: 16,
    color: AppColors.text,
  },
  completeButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});