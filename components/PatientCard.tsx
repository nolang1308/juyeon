import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/theme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, GEMINI_MODEL } from '@/config/api';

interface PatientInfo {
  name: string;
  relationship: string;
  age: number;
  diagnosis: string;
  address: string;
}

interface PatientCardProps {
  patient: PatientInfo;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function PatientCard({ patient }: PatientCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const flipValue = useSharedValue(0);
  const heightValue = useSharedValue(200);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipValue.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipValue.value, [0, 1], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: heightValue.value,
    };
  });

  const handleFlip = () => {
    if (!isFlipped) {
      // 뒤집기 → 확장
      setIsFlipped(true);
      flipValue.value = withTiming(1, { duration: 600 });
      
      // 0.2초 후 높이 확장
      setTimeout(() => {
        heightValue.value = withTiming(600, { duration: 400 });
      }, 200);
    } else {
      // 축소 → 뒤집기
      setIsFlipped(false);
      heightValue.value = withTiming(200, { duration: 400 });
      
      // 높이 축소 후 뒤집기
      setTimeout(() => {
        flipValue.value = withTiming(0, { duration: 600 });
      }, 200);
    }
  };

  const callGeminiAPI = async (userQuestion: string) => {
    // if (GEMINI_API_KEY === 'hhjuh') {
    //   return '⚠️ Gemini API 키가 설정되지 않았습니다.\n\nconfig/api.ts 파일에서 GEMINI_API_KEY를 실제 API 키로 변경해주세요.\n\nGoogle AI Studio (https://makersuite.google.com/app/apikey)에서 무료로 API 키를 발급받을 수 있습니다.';
    // }

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

      const prompt = `당신은 의료 AI 어시스턴트입니다.

환자 정보:
- 이름: ${patient.name}
- 나이: ${patient.age}세
- 진단명: ${patient.diagnosis}

사용자 질문: ${userQuestion}

위 환자 정보를 바탕으로 친절하고 이해하기 쉽게 의료 상담을 해주세요. 단, 다음 사항을 반드시 포함해주세요:
1. 정확한 진단과 치료는 반드시 의료진과 상담이 필요함을 안내
2. 일반적인 정보 제공 차원에서 답변
3. 응급상황 시 즉시 병원 방문 권유

답변을 자세하게 써주세요.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text || '응답을 받을 수 없습니다.';
    } catch (error) {
      console.error('Gemini API 오류:', error);
      return '죄송합니다. AI 상담 서비스에 문제가 있습니다. 네트워크 연결과 API 키를 확인하고 다시 시도해주세요.';
    }
  };

  const handleSendQuestion = async () => {
    if (!question.trim()) {
      Alert.alert('알림', '질문을 입력해주세요.');
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    const aiResponse = await callGeminiAPI(question);
    
    const aiMessage: ChatMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* Front Card */}
      <Animated.View style={[styles.cardContainer, frontAnimatedStyle]}>
        <TouchableOpacity onPress={handleFlip} activeOpacity={0.9}>
          <ExpoLinearGradient
            colors={['#3B82F6', '#1E3A8A', '#1D4ED8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            {/* 상단 상태 표시 */}
            <View style={styles.statusSection}>
              <Text style={styles.statusText}>현재 돌봄 상태</Text>
              <Text style={styles.flipHint}>탭하여 AI에게 물어보기</Text>
            </View>
            
            {/* 환자 이름 */}
            <Text style={styles.patientName}>
              {patient.name} ({patient.relationship}, {patient.age}세) 님
            </Text>
            
            {/* 하단 정보 */}
            <View style={styles.bottomSection}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>진단명</Text>
                <Text style={styles.infoValue}>{patient.diagnosis}</Text>
              </View>
              
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>거주지</Text>
                <Text style={styles.infoValue}>{patient.address}</Text>
              </View>
            </View>
          </ExpoLinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Back Card - AI Consultation */}
      <Animated.View style={[styles.cardContainer, styles.backCard, backAnimatedStyle]}>
        <ExpoLinearGradient
          colors={['#10B981', '#059669', '#047857']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.aiHeader}>
            <TouchableOpacity onPress={handleFlip} style={styles.backButton}>
              <Text style={styles.backButtonText}>← 뒤로</Text>
            </TouchableOpacity>
            <Text style={styles.aiTitle}>🤖 AI에 병에대해 질문하세요</Text>
          </View>

          <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
            {messages.length === 0 ? (
              <Text style={styles.welcomeText}>
                안녕하세요! {patient.name}님의 건강에 대해 궁금한 점을 물어보세요.
              </Text>
            ) : (
              messages.map((message, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageContainer,
                    message.role === 'user' ? styles.userMessage : styles.aiMessage
                  ]}
                >
                  <Text style={styles.messageText}>{message.content}</Text>
                  <Text style={styles.timestamp}>{message.timestamp}</Text>
                </View>
              ))
            )}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={AppColors.white} />
                <Text style={styles.loadingText}>AI가 답변을 생각하고 있습니다...</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.questionInput}
              value={question}
              onChangeText={setQuestion}
              placeholder="질환에 대해 궁금한 점을 물어보세요..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              multiline
              maxLength={200}
            />
            <TouchableOpacity 
              style={[styles.sendButton, !question.trim() && styles.sendButtonDisabled]}
              onPress={handleSendQuestion}
              disabled={isLoading || !question.trim()}
            >
              <Text style={styles.sendButtonText}>전송</Text>
            </TouchableOpacity>
          </View>
        </ExpoLinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 15,
  },
  cardContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backCard: {
    zIndex: 1,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
  },
  flipHint: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.white,
    marginBottom: 15,
    textAlign: 'center',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 15,
    flex: 1,
    backdropFilter: 'blur(10px)',
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: AppColors.white,
    fontWeight: 'bold',
  },
  // AI Consultation Styles
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: AppColors.white,
    fontWeight: '600',
  },
  aiTitle: {
    fontSize: 18,
    color: AppColors.white,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 24,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    maxWidth: '85%',
  },
  userMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    color: AppColors.white,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
    textAlign: 'right',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 14,
    color: AppColors.white,
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  questionInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: AppColors.white,
    maxHeight: 80,
    minHeight: 45,
  },
  sendButton: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  sendButtonText: {
    fontSize: 16,
    color: '#047857',
    fontWeight: 'bold',
  },
});