// API 설정 (법정동은 Vworld, 실거래가는 공공데이터)
const API_CONFIG = {
  // 공공데이터 실거래가 API (기존 유지)
  REAL_ESTATE_API: {
    // 아파트 매매 실거래 상세 조회 엔드포인트
    BASE_URL: "https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade",
    SERVICE_KEY:
      "zdpybI7fG8AAxd8CHouLNvFBJpu4Pky4NfiLgzlYis8sgF%2BvtvuVuurIno9YWCdlqhwkp%2B5jDM98OXkeeWXdKw%3D%3D",
    SERVICE_NAME: "RTMSDataSvcAptTrade",
    DATA_TYPE: "xml", // XML 응답 명시
  },

  // Vworld 법정동 코드 API (시/도)
  LEGAL_DONG_API: {
    // Vworld 법정동코드 조회 엔드포인트
    BASE_URL: "https://api.vworld.kr/req/data",
    SERVICE_KEY: "59BAE8AE-F327-37CB-B77F-BE27F65EB72F", // Vworld에서 발급받은 인증키 입력
    SERVICE_NAME: "getLegalDongCode",
    DATA_TYPE: "json",
  },

  // Vworld 시군구 코드 API (구/군)
  SIGUNGU_API: {
    // Vworld 시군구코드 조회 엔드포인트
    BASE_URL: "https://api.vworld.kr/req/data",
    SERVICE_KEY: "E55FF646-C2F9-3913-8AAE-E37D5E0B90B9", // Vworld에서 발급받은 인증키 입력
    SERVICE_NAME: "getSigunguCode",
    DATA_TYPE: "json",
  },

  // Vworld 읍면동 코드 API (읍/면/동)
  DONG_API: {
    // Vworld 읍면동코드 조회 엔드포인트
    BASE_URL: "https://api.vworld.kr/req/data",
    SERVICE_KEY: "4C2B21B2-5708-366B-BA9C-B109E695CE37", // Vworld에서 발급받은 인증키 입력
    SERVICE_NAME: "getDongCode",
    DATA_TYPE: "json",
  },

  // API 응답 타입 (기본값 - 개별 API에서 DATA_TYPE으로 재정의)
  RESPONSE_TYPE: "json",

  // 페이지당 결과 수
  PAGE_SIZE: 100,

  // 프록시 사용 여부
  USE_PROXY: false, // 직접 API 호출 시도 후 필요시 프록시 사용
};

// 환경변수에서 인증키 가져오기 (보안을 위해)
if (typeof process !== "undefined" && process.env.REAL_ESTATE_API_KEY) {
  API_CONFIG.REAL_ESTATE_API.SERVICE_KEY = process.env.REAL_ESTATE_API_KEY;
}

// 전역으로 노출
window.API_CONFIG = API_CONFIG;
