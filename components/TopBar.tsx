import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView, Image,
} from 'react-native';
import { router } from 'expo-router';
import { AppColors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface TopBarProps {
  onNotificationPress?: () => void;
}

export default function TopBar({ onNotificationPress }: TopBarProps) {
  const handleMyPage = () => {
    router.push('/my-page');
  };

  const handleNotifications = () => {
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.logo}>
            <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>CareRo : 모두를 케어하다</Text>
        </View>
        
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton} onPress={handleNotifications}>
            <IconSymbol size={22} name="bell.fill" color={AppColors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton} onPress={handleMyPage}>
            <IconSymbol size={22} name="person.fill" color={AppColors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.primary,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.white,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
});