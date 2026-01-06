// Gemini API 설정
export const GEMINI_API_KEY = 'AIzaSyBQAjLCAU4iE2vvxgnP1vPz-28DsJuc0Q0';

// 모델 이름
export const GEMINI_MODEL = 'gemini-2.5-flash';

/**
 * Gemini API 키 설정 방법:
 * 1. Google AI Studio (https://makersuite.google.com/app/apikey)에서 API 키 생성
 * 2. 위의 GEMINI_API_KEY 값을 실제 API 키로 교체
 * 
 * 보안을 위해 실제 프로덕션 환경에서는:
 * - 환경변수 사용 권장 (expo-constants의 Constants.expoConfig.extra)
 * - .env 파일 사용 (react-native-config)
 */