import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { AppColors } from '@/constants/theme';

export default function SignupTypeScreen() {
  const handleGuardianSignup = () => {
    router.push('/guardian-signup-1');
  };

  const handleSelfSignup = () => {
    // TODO: 본인용 회원가입 구현
    console.log('본인용 회원가입');
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

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>회원가입</Text>
          <Text style={styles.subtitle}>가입 유형을 선택해주세요</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.typeButton}
            onPress={handleGuardianSignup}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTitle}>보호자용 가입</Text>
              <Text style={styles.buttonDescription}>
                환자의 보호자로서 가입합니다{'\n'}
                환자 정보와 보호자 정보를 함께 등록합니다
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.typeButton}
            onPress={handleSelfSignup}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTitle}>본인용 가입</Text>
              <Text style={styles.buttonDescription}>
                본인이 직접 가입합니다{'\n'}
                본인의 정보를 등록합니다
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.darkGray,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 20,
  },
  typeButton: {
    borderWidth: 2,
    borderColor: AppColors.primary,
    borderRadius: 12,
    padding: 25,
    backgroundColor: AppColors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContent: {
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 10,
  },
  buttonDescription: {
    fontSize: 14,
    color: AppColors.darkGray,
    textAlign: 'center',
    lineHeight: 20,
  },
});