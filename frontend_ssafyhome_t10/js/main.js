// 부동산 웹페이지 메인 JavaScript

class RealEstateApp {
  constructor() {
    this.map = null;
    this.markers = [];
    this.currentLocation = null;
    this.currentOpenInfoWindow = null; // 현재 열려있는 정보창을 추적
    this.searchResultsData = []; // 검색 결과를 저장할 배열 추가
    this.init();
  }

  init() {
    this.initMap();
    this.initSidebar();
    this.initEventListeners();
    this.loadSampleData();
    this.checkLoginStatus();

    // 페이지 로드 후 관리자 메뉴 상태 업데이트
    setTimeout(() => {
      this.checkLoginStatus();
    }, 100);
  }

  // 카카오맵 초기화
  initMap() {
    // 카카오맵 SDK가 로드되었는지 확인
    if (typeof kakao === "undefined" || typeof kakao.maps === "undefined") {
      console.log("카카오맵 SDK 로딩 대기 중...");
      setTimeout(() => this.initMap(), 100);
      return;
    }

    if (document.getElementById("map")) {
      try {
        const mapContainer = document.getElementById("map");
        const mapOption = {
          center: new kakao.maps.LatLng(37.5665, 126.978), // 서울 시청 좌표
          level: 5,
          mapTypeId: kakao.maps.MapTypeId.ROADMAP,
        };

        this.map = new kakao.maps.Map(mapContainer, mapOption);

        // 지도 컨트롤 추가
        const zoomControl = new kakao.maps.ZoomControl();
        const mapTypeControl = new kakao.maps.MapTypeControl();

        this.map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
        this.map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

        console.log("카카오맵 초기화 완료");

        // 지도 클릭 이벤트 제거
        // kakao.maps.event.addListener(this.map, "click", (mouseEvent) => {
        //   this.handleMapClick(mouseEvent);
        // });
      } catch (error) {
        console.error("카카오맵 초기화 실패:", error);
        // 에러 발생 시 재시도
        setTimeout(() => this.initMap(), 1000);
      }
    } else {
      console.log("지도 컨테이너를 찾을 수 없습니다. 재시도 중...");
      setTimeout(() => this.initMap(), 100);
    }
  }

  // 현재 위치 가져오기
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          this.currentLocation = new kakao.maps.LatLng(lat, lng);
          this.map.setCenter(this.currentLocation);
          this.map.setLevel(3);

          // 현재 위치 마커 추가
          this.addMarker(this.currentLocation, "현재 위치", "📍");

          this.showNotification("현재 위치로 이동했습니다.", "success");
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다:", error);
          this.showNotification("위치 정보를 가져올 수 없습니다.", "warning");
        }
      );
    } else {
      this.showNotification("이 브라우저에서는 위치 정보를 지원하지 않습니다.", "warning");
    }
  }

  // 지도 클릭 처리 제거
  // handleMapClick(mouseEvent) {
  //   const latlng = mouseEvent.latLng;
  //   const address = this.getAddressFromCoords(latlng);

  //   // 클릭한 위치에 마커 추가
  //   this.addMarker(latlng, address, "🏠");

  //   // 정보창 표시
  //   this.showInfoWindow(latlng, address);
  // }

  // 좌표를 주소로 변환 제거
  // getAddressFromCoords(latlng) {
  //   // 실제로는 카카오 주소 API를 사용해야 하지만, 여기서는 간단한 예시
  //   return `위도: ${latlng.getLat().toFixed(6)}, 경도: ${latlng.getLng().toFixed(6)}`;
  // }

  // 마커 추가
  addMarker(position, title, icon) {
    const marker = new kakao.maps.Marker({
      position: position,
      title: title,
    });

    marker.setMap(this.map);
    this.markers.push(marker);

    // 마커 클릭 이벤트
    kakao.maps.event.addListener(marker, "click", () => {
      // 기존 정보창이 있다면 닫기
      if (this.currentOpenInfoWindow) {
        this.currentOpenInfoWindow.close();
      }
      const infowindow = this.showInfoWindow(position, title); // showInfoWindow가 infowindow 객체를 반환하도록 가정
      this.currentOpenInfoWindow = infowindow; // 새로 열린 정보창을 추적
    });

    return marker;
  }

  // 정보창 표시
  showInfoWindow(position, content) {
    const infowindow = new kakao.maps.InfoWindow({
      position: position,
      content: `
        <div style="padding: 10px; min-width: 200px;">
          <h6 style="margin: 0 0 10px 0; color: #2563eb;">${content}</h6>
          <p style="margin: 0; font-size: 14px; color: #64748b;">
            이 위치에 대한 상세 정보를 확인하세요.
          </p>
          <button class="btn btn-sm btn-primary mt-2" onclick="app.showPropertyDetails('${position.getLat()},${position.getLng()}')">
            상세보기
          </button>
        </div>
      `,
    });

    infowindow.open(this.map);
    return infowindow; // showInfoWindow가 infowindow 객체를 반환하도록 수정
  }

  // 검색 결과 목록에서 마커를 표시하는 함수
  showOnMapFromList(address) {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      // Use arrow function to preserve 'this' context
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 기존 마커를 찾아서 재활용
        const existingMarker = this.markers.find(
          (
            marker // Use 'this.markers'
          ) => marker.searchResultItem && marker.searchResultItem.address === address
        );

        if (existingMarker) {
          // 기존 정보창 닫기
          if (this.currentOpenInfoWindow) {
            // Use 'this.currentOpenInfoWindow'
            this.currentOpenInfoWindow.close();
          }

          // 해당 마커의 정보창 열기
          const item = existingMarker.searchResultItem;
          const infowindow = new kakao.maps.InfoWindow({
            content: `
              <div style="padding: 15px; min-width: 280px; font-family: 'Inter', sans-serif;">
                <div style="border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 15px;">
                  <h6 style="margin: 0; color: #2563eb; font-weight: 600; font-size: 16px;">
                    🏢 ${item.aptName || "아파트"}
                  </h6>
                </div>
                
                <div style="margin-bottom: 12px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 600; color: #374151;">거래가격:</span>
                    <span style="color: #dc2626; font-weight: 700; font-size: 18px;">
                      ${item.price}만원
                    </span>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 600; color: #374151;">전용면적:</span>
                    <span style="color: #059669; font-weight: 600;">${item.area}㎡</span>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 600; color: #374151;">거래층수:</span>
                    <span style="color: #7c3aed; font-weight: 600;">${item.floor}층</span>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 600; color: #374151;">건축년도:</span>
                    <span style="color: #ea580c; font-weight: 600;">${
                      item.constructionYear
                    }년</span>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 600; color: #374151;">거래일자:</span>
                    <span style="color: #6b7280;">${item.date}</span>
                  </div>
                </div>
                
                <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; margin-top: 15px;">
                  <div style="font-size: 13px; color: #6b7280; line-height: 1.4;">
                    📍 ${item.address}
                  </div>
                </div>
              </div>
            `,
          });

          infowindow.open(this.map, existingMarker); // Use 'this.map'
          this.currentOpenInfoWindow = infowindow; // Use 'this.currentOpenInfoWindow'

          // 지도 중심 이동
          this.map.setCenter(coords); // Use 'this.map'
        }
      }
    });
  }

  // 사이드바 초기화
  initSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.getElementById("sidebarToggle");

    if (sidebar && toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active");
      });
    }

    // 현재 페이지에 따라 사이드바 링크 활성화
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "map.html";

    const navLinks = document.querySelectorAll(".sidebar .nav-link");
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentPage) {
        link.classList.add("active");
      }
    });
  }

  // 이벤트 리스너 초기화
  initEventListeners() {
    // 모바일 메뉴 토글
    const menuToggle = document.querySelector(".navbar-toggler");
    if (menuToggle) {
      menuToggle.addEventListener("click", () => {
        document.querySelector(".sidebar").classList.toggle("show");
      });
    }

    // 사이드바 링크 클릭 시 활성화
    document.querySelectorAll(".sidebar .nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        document
          .querySelectorAll(".sidebar .nav-link")
          .forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      });
    });
  }

  // 샘플 데이터 로드 제거 - API 기반으로 동적 로드
  loadSampleData() {
    // 샘플 데이터 제거 - 실거래가 검색 시에만 마커 표시
  }

  // 알림 표시
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
      animation: slideInRight 0.3s ease-out;
    `;

    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // 5초 후 자동 제거
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  // 매물 상세 정보 표시 (예시)
  showPropertyDetails(coords) {
    this.showNotification("매물 상세 정보를 불러오는 중...", "info");
    // 실제로는 API 호출하여 상세 정보를 가져와야 함
  }

  // 로그인 상태 확인
  checkLoginStatus() {
    const isLoggedIn =
      localStorage.getItem("isLoggedIn") === "true" ||
      sessionStorage.getItem("isLoggedIn") === "true";
    const username = localStorage.getItem("username") || sessionStorage.getItem("username");
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");

    const loginNavItem = document.getElementById("loginNavItem");
    const registerNavItem = document.getElementById("registerNavItem");
    const logoutNavItem = document.getElementById("logoutNavItem");

    if (isLoggedIn) {
      if (loginNavItem) loginNavItem.style.display = "none";
      if (registerNavItem) registerNavItem.style.display = "none";
      if (logoutNavItem) logoutNavItem.style.display = "block";

      // 관리자 메뉴 표시/숨김 처리
      if (userRole === "admin") {
        this.showAdminMenu();
      } else {
        this.hideAdminMenu();
      }
    } else {
      if (loginNavItem) loginNavItem.style.display = "block";
      if (registerNavItem) registerNavItem.style.display = "block";
      if (logoutNavItem) logoutNavItem.style.display = "none";

      // 로그아웃 시 관리자 메뉴 숨김
      this.hideAdminMenu();
    }
  }

  // 관리자 메뉴 표시
  showAdminMenu() {
    const adminElements = document.querySelectorAll(".admin-only");
    adminElements.forEach((element) => {
      element.style.display = "block";
    });
  }

  // 관리자 메뉴 숨김
  hideAdminMenu() {
    const adminElements = document.querySelectorAll(".admin-only");
    adminElements.forEach((element) => {
      element.style.display = "none";
    });
  }
}

// CSS 애니메이션 추가
const style = document.createElement("style");
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .current-location-btn button {
    transition: all 0.3s ease;
  }
  
  .current-location-btn button:hover {
    transform: scale(1.05);
  }
`;
document.head.appendChild(style);

// 앱 초기화
let app;
window.onload = function () {
  // 카카오맵 SDK가 로드될 때까지 대기
  const waitForKakaoMap = () => {
    if (typeof kakao !== "undefined" && typeof kakao.maps !== "undefined") {
      console.log("카카오맵 SDK 로드 완료, 앱 초기화 시작");
      app = new RealEstateApp();

      // config.js가 로드된 후에 초기화 함수들을 호출
      // API_CONFIG가 정의될 때까지 대기
      const waitForConfig = () => {
        if (typeof API_CONFIG !== "undefined") {
          console.log("API_CONFIG 로드 완료, 초기화 시작");
          // 페이지 로드 시 시/도 목록 초기화
          if (typeof initializeRegionOptions === "function") {
            initializeRegionOptions();
          }

          // 거래일자 옵션 초기화
          if (typeof initializeTransactionDateOptions === "function") {
            initializeTransactionDateOptions();
          }
        } else {
          console.log("API_CONFIG 대기 중...");
          setTimeout(waitForConfig, 100);
        }
      };

      waitForConfig();
    } else {
      console.log("카카오맵 SDK 로딩 대기 중...");
      setTimeout(waitForKakaoMap, 100);
    }
  };

  waitForKakaoMap();
};

// 전역 함수로 노출 (HTML에서 호출하기 위해)
window.app = app;

// 로그아웃 함수
function logout() {
  // 로컬 스토리지와 세션 스토리지에서 로그인 정보 제거
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  localStorage.removeItem("userRole");
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("userRole");

  // 로그인 상태 업데이트
  if (app) {
    app.checkLoginStatus();
  }

  // 성공 메시지 표시
  if (app) {
    app.showNotification("로그아웃되었습니다.", "success");
  }

  // 페이지 새로고침 (선택사항)
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

// 검색 패널 토글
function toggleSearchPanel() {
  const panel = document.querySelector(".search-panel");
  panel.classList.toggle("show");
}

// 검색 결과 패널 토글
function toggleResultsPanel() {
  const searchResultsSection = document.getElementById("searchResultsSection");
  if (searchResultsSection) {
    if (searchResultsSection.style.display === "none") {
      searchResultsSection.style.display = "block";
    } else {
      searchResultsSection.style.display = "none";
    }
  }
}

// 필터 패널 토글
function toggleFilterPanel() {
  const panel = document.querySelector(".filter-panel");
  panel.classList.toggle("show");
}

// 실거래가 검색
async function searchRealprice() {
  const region = document.getElementById("region").value;
  const district = document.getElementById("district").value;
  const dong = document.getElementById("dong").value;
  const transactionDate = document.getElementById("transactionDate").value;

  // 검색 조건 상세 검증
  const missingFields = [];

  if (!region) missingFields.push("시/도");
  if (!district) missingFields.push("구/군");
  if (!dong) missingFields.push("읍면동");
  if (!transactionDate) missingFields.push("거래일자");

  if (missingFields.length > 0) {
    alert(`다음 검색 조건을 선택해주세요:\n\n${missingFields.join("\n")}`);
    return;
  }

  // 거래일자 유효성 검사 (미래 날짜 방지)
  const selectedDate = new Date(
    transactionDate.substring(0, 4),
    parseInt(transactionDate.substring(4, 6)) - 1
  );
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  if (
    selectedDate.getFullYear() > currentYear ||
    (selectedDate.getFullYear() === currentYear && selectedDate.getMonth() > currentMonth)
  ) {
    alert("거래일자는 현재 또는 과거 날짜를 선택해주세요.");
    return;
  }

  // API_CONFIG가 로드되었는지 확인
  if (typeof API_CONFIG === "undefined") {
    alert("API 설정이 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  // 로딩 상태 표시 (finally에서 접근 가능하도록 먼저 선언)
  const submitBtn = document.querySelector('#searchForm button[type="submit"]');
  const originalText = submitBtn ? submitBtn.innerHTML : null;
  try {
    submitBtn.innerHTML = '<span class="loading"></span> 검색 중...';
    submitBtn.disabled = true;

    // 공공데이터 API 호출
    const results = await fetchRealEstateData({
      region,
      district,
      dong,
      transactionDate,
    });

    if (results && results.length > 0) {
      displayResults(results);
    } else {
      alert("검색 결과가 없습니다.");
    }
  } catch (error) {
    // 사용자에게는 이미 친화적인 메시지가 표시되므로 콘솔에는 간단하게 로깅
    if (
      error.message.includes("해당 지역") &&
      error.message.includes("실거래가 데이터가 없습니다")
    ) {
      console.log("🔍 검색 결과 없음:", error.message);
    } else {
      console.error("검색 오류:", error.message);
    }

    // 더 구체적인 에러 메시지 제공
    let errorMessage = "검색 중 오류가 발생했습니다.";

    if (error.message.includes("Internal Server Error")) {
      errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    } else if (error.message.includes("API 응답")) {
      errorMessage = "데이터를 가져오는데 실패했습니다. 검색 조건을 확인해주세요.";
    } else if (error.message.includes("실거래가 데이터를 찾을 수 없습니다")) {
      errorMessage = "해당 지역의 실거래가 데이터가 없습니다. 다른 지역이나 날짜를 선택해주세요.";
    } else if (
      error.message.includes("해당 지역") &&
      error.message.includes("실거래가 데이터가 없습니다")
    ) {
      // 데이터가 없는 경우 - 사용자가 선택한 지역과 날짜 정보 포함
      errorMessage = error.message;
    } else if (error.message.includes("timeout")) {
      errorMessage = "API 응답 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.";
    } else if (error.message.includes("CORS")) {
      errorMessage =
        "브라우저 보안 정책으로 인해 API 호출이 차단되었습니다. 프록시를 사용해주세요.";
    }

    alert(errorMessage);
  } finally {
    // 버튼 상태 복원
    const submitBtn = document.querySelector('#searchForm button[type="submit"]');
    if (submitBtn && originalText !== null) {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }
}

// 검색 결과 표시
function displayResults(data) {
  const resultCount = document.getElementById("resultCount");
  const resultsList = document.getElementById("resultsList");

  // 유효한 데이터만 필터링
  const validData = data.filter(
    (item) => item.aptName && item.aptName !== "-" && item.address && item.address.trim()
  );

  // 검색 결과를 앱 인스턴스에 저장
  app.searchResultsData = validData;

  resultCount.textContent = `${validData.length}건`;

  // 기존 마커 제거
  app.markers.forEach((marker) => marker.setMap(null));
  app.markers = [];

  // 아파트 실거래가 정보를 기준으로 마커 생성 (유효한 데이터만)
  validData.forEach((item, index) => {
    // 카카오맵 지오코딩 서비스를 사용하여 주소를 좌표로 변환
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(item.address, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 첫 번째 검색 결과에 대해 지도 중심 이동
        if (index === 0) {
          app.map.setCenter(coords);
        }

        // 아파트 실거래가 정보를 기반으로 마커 생성
        const marker = new kakao.maps.Marker({
          position: coords,
          map: app.map,
          title: item.aptName || "아파트", // 마커 툴팁에 아파트명 표시
        });

        // 마커에 검색 결과 데이터 연결
        marker.searchResultItem = item;

        // 마커 클릭 시 실거래가 상세 정보 표시
        const infowindow = new kakao.maps.InfoWindow({
          content: `
            <div style="padding: 15px; min-width: 280px; font-family: 'Inter', sans-serif;">
              <div style="border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 15px;">
                <h6 style="margin: 0; color: #2563eb; font-weight: 600; font-size: 16px;">
                  🏢 ${item.aptName || "아파트"}
                </h6>
              </div>
              
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-weight: 600; color: #374151;">거래가격:</span>
                  <span style="color: #dc2626; font-weight: 700; font-size: 18px;">
                    ${item.price}만원
                  </span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-weight: 600; color: #374151;">전용면적:</span>
                  <span style="color: #059669; font-weight: 600;">${item.area}㎡</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-weight: 600; color: #374151;">거래층수:</span>
                  <span style="color: #7c3aed; font-weight: 600;">${item.floor}층</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-weight: 600; color: #374151;">건축년도:</span>
                  <span style="color: #ea580c; font-weight: 600;">${item.constructionYear}년</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-weight: 600; color: #374151;">거래일자:</span>
                  <span style="color: #6b7280;">${item.date}</span>
                </div>
              </div>
              
              <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; margin-top: 15px;">
                <div style="font-size: 13px; color: #6b7280; line-height: 1.4;">
                  📍 ${item.address}
                </div>
              </div>
            </div>
          `,
        });

        // 마커 클릭 이벤트 리스너 추가
        kakao.maps.event.addListener(marker, "click", function () {
          // 기존 정보창이 있다면 닫기
          if (app.currentOpenInfoWindow) {
            app.currentOpenInfoWindow.close();
          }
          infowindow.open(app.map, marker);
          app.currentOpenInfoWindow = infowindow; // 새로 열린 정보창을 추적
        });

        // 마커를 전역 마커 배열에 추가하여 관리
        app.markers.push(marker);

        console.log(`마커 생성 완료: ${item.aptName || "아파트"} - ${item.address}`);
      } else {
        console.warn("주소 지오코딩 실패:", item.address, status);
        console.warn("실패한 아이템:", item);
      }
    });
  });

  // 검색 결과 목록 표시 (법정동 기반) - 유효한 데이터만 필터링
  resultsList.innerHTML = validData
    .map(
      (item) => `
    <div class="result-item" onclick="app.showOnMapFromList(\'${item.address}\')">
      <div class="price">${item.price}만원</div>
      <div class="address">
        <strong>📍 ${item.address}</strong>
        ${item.dong ? `<br><small class="text-muted">법정동: ${item.dong}</small>` : ""}
      </div>
      <div class="details">
        <span class="badge bg-primary me-1">${item.area}㎡</span>
        <span class="badge bg-success me-1">${item.dealType}</span>
        <span class="badge bg-info me-1">${item.buildingType}</span>
        <span class="badge bg-secondary">${item.date}</span>
      </div>
      <div class="additional-info">
        <small class="text-muted">
          ${item.floor !== "-" ? `🏢 ${item.floor}층` : ""} 
          ${item.constructionYear !== "-" ? `| 🏭 ${item.constructionYear}년` : ""}
        </small>
      </div>
    </div>
  `
    )
    .join("");

  // 검색 결과 섹션 표시
  const searchResultsSection = document.getElementById("searchResultsSection");
  if (searchResultsSection) {
    searchResultsSection.style.display = "block";
  }
}

// 지도에 위치 표시 (기존 showOnMap 함수를 수정하여 재활용)
function showOnMap(address) {
  const geocoder = new kakao.maps.services.Geocoder();
  geocoder.addressSearch(address, function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

      // 기존 마커를 찾아서 재활용
      const existingMarker = app.markers.find(
        (marker) => marker.searchResultItem && marker.searchResultItem.address === address
      );

      if (existingMarker) {
        // 기존 정보창 닫기
        if (app.currentOpenInfoWindow) {
          app.currentOpenInfoWindow.close();
        }

        // 해당 마커의 정보창 열기
        const item = existingMarker.searchResultItem;
        const infowindow = new kakao.maps.InfoWindow({
          content: `
            <div style="padding: 15px; min-width: 280px; font-family: 'Inter', sans-serif;">
              <div style="border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 15px;">
                <h6 style="margin: 0; color: #2563eb; font-weight: 600; font-size: 16px;">
                  🏢 ${item.aptName || "아파트"}
                </h6>
              </div>
              
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-weight: 600; color: #374151;">거래가격:</span>
                  <span style="color: #dc2626; font-weight: 700; font-size: 18px;">
                    ${item.price}만원
                  </span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-weight: 600; color: #374151;">전용면적:</span>
                  <span style="color: #059669; font-weight: 600;">${item.area}㎡</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-weight: 600; color: #374151;">거래층수:</span>
                  <span style="color: #7c3aed; font-weight: 600;">${item.floor}층</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-weight: 600; color: #374151;">건축년도:</span>
                  <span style="color: #ea580c; font-weight: 600;">${item.constructionYear}년</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-weight: 600; color: #374151;">거래일자:</span>
                  <span style="color: #6b7280;">${item.date}</span>
                </div>
              </div>
              
              <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; margin-top: 15px;">
                <div style="font-size: 13px; color: #6b7280; line-height: 1.4;">
                  📍 ${item.address}
                </div>
              </div>
            </div>
          `,
        });

        infowindow.open(app.map, existingMarker);
        app.currentOpenInfoWindow = infowindow; // 새로 열린 정보창을 추적

        // 지도 중심 이동
        app.map.setCenter(coords);
      } else {
        // 새로운 마커 생성 및 정보창 열기 (기존 로직 유지, 필요 시 수정)
        // 이 부분은 주소로 마커가 없는 경우에만 실행됩니다.
        // 현재는 displayResults에서 모든 마커를 생성하므로 이 else 블록에 도달할 일은 거의 없습니다.
        const newMarker = new kakao.maps.Marker({
          map: app.map,
          position: coords,
        });
        app.markers.push(newMarker);

        // 기존 정보창 닫기
        if (app.currentOpenInfoWindow) {
          app.currentOpenInfoWindow.close();
        }

        // 정보창 내용 가져오기 (여기서는 간단히 주소만)
        const infoContent = `
          <div style="padding: 10px; min-width: 200px;">
            <h6 style="margin: 0 0 10px 0; color: #2563eb;">${address}</h6>
            <p style="margin: 0; font-size: 14px; color: #64748b;">
              해당 위치에 대한 정보가 없습니다.
            </p>
          </div>
        `;

        const newInfowindow = new kakao.maps.InfoWindow({
          content: infoContent,
        });
        newInfowindow.open(app.map, newMarker);
        app.currentOpenInfoWindow = newInfowindow;

        // 지도 중심 이동
        app.map.setCenter(coords);
      }
    }
  });
}

// 검색 결과 목록에서 마커를 표시하는 함수 (기존 showOnMap을 대신하여 사용)
// function showOnMapFromList(address) {
//   const geocoder = new kakao.maps.services.Geocoder();
//   geocoder.addressSearch(address, function (result, status) {
//     if (status === kakao.maps.services.Status.OK) {
//       const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

//       // 기존 마커를 찾아서 재활용
//       const existingMarker = app.markers.find(marker =>
//         marker.searchResultItem && marker.searchResultItem.address === address
//       );

//       if (existingMarker) {
//         // 기존 정보창 닫기
//         if (app.currentOpenInfoWindow) {
//           app.currentOpenInfoWindow.close();
//         }

//         // 해당 마커의 정보창 열기
//         const item = existingMarker.searchResultItem;
//         const infowindow = new kakao.maps.InfoWindow({
//           content: `
//             <div style="padding: 15px; min-width: 280px; font-family: 'Inter', sans-serif;">
//               <div style="border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 15px;">
//                 <h6 style="margin: 0; color: #2563eb; font-weight: 600; font-size: 16px;">
//                   🏢 ${item.aptName || "아파트"}
//                 </h6>
//               </div>

//               <div style="margin-bottom: 12px;">
//                 <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
//                   <span style="font-weight: 600; color: #374151;">거래가격:</span>
//                   <span style="color: #dc2626; font-weight: 700; font-size: 18px;">
//                     ${item.price}만원
//                   </span>
//                 </div>

//                 <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
//                   <span style="font-weight: 600; color: #374151;">전용면적:</span>
//                   <span style="color: #059669; font-weight: 600;">${item.area}㎡</span>
//                 </div>

//                 <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
//                   <span style="font-weight: 600; color: #374151;">거래층수:</span>
//                   <span style="color: #7c3aed; font-weight: 600;">${item.floor}층</span>
//                 </div>

//                 <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
//                   <span style="font-weight: 600; color: #374151;">건축년도:</span>
//                   <span style="color: #ea580c; font-weight: 600;">${item.constructionYear}년</span>
//                 </div>

//                 <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
//                   <span style="font-weight: 600; color: #374151;">거래일자:</span>
//                   <span style="color: #6b7280;">${item.date}</span>
//                 </div>
//               </div>

//               <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; margin-top: 15px;">
//                 <div style="font-size: 13px; color: #6b7280; line-height: 1.4;">
//                   📍 ${item.address}
//                 </div>
//               </div>
//             </div>
//           `,
//         });

//         infowindow.open(app.map, existingMarker);
//         app.currentOpenInfoWindow = infowindow; // 새로 열린 정보창을 추적

//         // 지도 중심 이동
//         app.map.setCenter(coords);
//       }
//     }
//   });
// }

// 지역 선택 시 구/군 옵션 업데이트 (Vworld API 기반)
async function updateDistricts() {
  const region = document.getElementById("region").value;
  const districtSelect = document.getElementById("district");
  const dongSelect = document.getElementById("dong");

  // 기존 옵션 제거
  districtSelect.innerHTML = '<option value="">구/군</option>';
  dongSelect.innerHTML = '<option value="">읍면동</option>';

  if (!region) return;

  // API_CONFIG가 로드되었는지 확인
  if (typeof API_CONFIG === "undefined") {
    console.warn("API_CONFIG가 로드되지 않았습니다.");
    alert("API 설정이 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  try {
    // Vworld API를 통해 해당 시도의 구/군 목록 조회
    const districts = await fetchDistrictsByRegion(region);

    if (districts && districts.length > 0) {
      districts.forEach((district) => {
        const option = document.createElement("option");
        option.value = district.code;
        option.textContent = district.name;
        districtSelect.appendChild(option);
      });

      console.log(`${region}의 구/군 목록 로드 완료:`, districts);
      console.log(
        "드롭다운에 추가된 구/군:",
        districts.map((d) => d.name)
      );
      console.log(
        "로드된 구/군 코드들:",
        districts.map((d) => d.code)
      );
    } else {
      console.warn("구/군 데이터가 없습니다.");
      districtSelect.innerHTML = '<option value="">구/군 데이터를 불러올 수 없습니다</option>';
    }
  } catch (error) {
    console.error("구/군 목록 로드 실패:", error);
    districtSelect.innerHTML = '<option value="">구/군 목록을 불러올 수 없습니다</option>';
    alert("구/군 목록을 불러올 수 없습니다. Vworld API를 확인해주세요.");
  }
}

// 구/군 선택 시 읍면동 옵션 업데이트 (Vworld API 기반)
async function updateDongs() {
  const district = document.getElementById("district").value;
  const dongSelect = document.getElementById("dong");

  // 기존 옵션 제거
  dongSelect.innerHTML = '<option value="">읍면동</option>';

  if (!district) return;

  // API_CONFIG가 로드되었는지 확인
  if (typeof API_CONFIG === "undefined") {
    console.warn("API_CONFIG가 로드되지 않았습니다.");
    alert("API 설정이 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  try {
    // Vworld API를 통해 해당 구/군의 읍면동 목록 조회
    const dongs = await fetchDongsByDistrict(district);

    if (dongs && dongs.length > 0) {
      dongs.forEach((dong) => {
        const option = document.createElement("option");
        option.value = dong.code;
        option.textContent = dong.name;
        dongSelect.appendChild(option);
      });

      console.log(`${district}의 읍면동 목록 로드 완료:`, dongs);
      console.log(
        "드롭다운에 추가된 읍면동:",
        dongs.map((d) => d.name)
      );
      console.log(
        "로드된 읍면동 코드들:",
        dongs.map((d) => d.code)
      );
    } else {
      console.warn("읍면동 데이터가 없습니다.");
      dongSelect.innerHTML = '<option value="">읍면동 데이터를 불러올 수 없습니다</option>';
    }
  } catch (error) {
    console.error("읍면동 목록 로드 실패:", error);
    dongSelect.innerHTML = '<option value="">읍면동 목록을 불러올 수 없습니다</option>';
    alert("읍면동 목록을 불러올 수 없습니다. Vworld API를 확인해주세요.");
  }
}

// 시/도 목록 초기화
async function initializeRegionOptions() {
  const regionSelect = document.getElementById("region");
  if (!regionSelect) return;

  // API_CONFIG가 로드되었는지 확인
  if (typeof API_CONFIG === "undefined") {
    console.error("API_CONFIG가 로드되지 않았습니다.");
    alert("API 설정이 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  try {
    // Vworld API를 통해 시/도 목록 조회
    const regions = await fetchRegions();

    if (regions && regions.length > 0) {
      // 기존 옵션 제거 (첫 번째 기본 옵션 제외)
      regionSelect.innerHTML = '<option value="">시/도</option>';

      regions.forEach((region) => {
        const option = document.createElement("option");
        option.value = region.code;
        option.textContent = region.name;
        regionSelect.appendChild(option);
      });

      console.log("시/도 목록 로드 완료:", regions);
      console.log(
        "드롭다운에 추가된 시/도:",
        regions.map((r) => r.name)
      );
    } else {
      console.warn("시/도 데이터가 없습니다.");
      regionSelect.innerHTML = '<option value="">시/도 데이터를 불러올 수 없습니다</option>';
    }
  } catch (error) {
    console.error("시/도 목록 로드 실패:", error);
    regionSelect.innerHTML = '<option value="">시/도 목록을 불러올 수 없습니다</option>';
    alert("시/도 목록을 불러올 수 없습니다. Vworld API를 확인해주세요.");
  }
}

// Vworld API를 통해 시/도 목록 조회
async function fetchRegions() {
  // API_CONFIG가 로드되었는지 확인
  if (typeof API_CONFIG === "undefined") {
    throw new Error("API_CONFIG가 로드되지 않았습니다.");
  }

  // Vworld 시도 코드 API 호출 - 올바른 엔드포인트 사용
  const apiUrl = new URL("https://api.vworld.kr/ned/data/admCodeList");
  apiUrl.searchParams.append("key", API_CONFIG.LEGAL_DONG_API.SERVICE_KEY);
  apiUrl.searchParams.append("domain", "localhost");
  apiUrl.searchParams.append("format", "json");
  apiUrl.searchParams.append("numOfRows", "100");

  console.log("Vworld 시/도 API URL:", apiUrl.toString());

  try {
    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log("Vworld 시/도 API 응답:", data);
    console.log("응답 구조 분석:", {
      hasAdmVOList: !!data.admVOList,
      hasAdmVOListItems: !!(data.admVOList && data.admVOList.admVOList),
      admVOListKeys: data.admVOList ? Object.keys(data.admVOList) : [],
      dataKeys: Object.keys(data),
    });

    if (data && data.admVOList && data.admVOList.admVOList) {
      const items = data.admVOList.admVOList;
      console.log("파싱된 시/도 아이템들:", items);

      const regions = items
        .map((item) => ({
          code: item.admCode,
          name: item.lowestAdmCodeNm,
        }))
        .filter(
          (item) =>
            item.code &&
            item.name &&
            (item.name.includes("시") ||
              item.name.includes("도") ||
              item.name.includes("특별자치시") ||
              item.name.includes("광역시"))
        );

      console.log("필터링된 시/도 목록:", regions);
      return regions;
    }

    console.warn("API 응답에서 시/도 데이터를 찾을 수 없습니다:", data);
    return [];
  } catch (error) {
    console.error("시/도 API 호출 실패:", error);
    throw error;
  }
}

// Vworld API를 통해 구/군 목록 조회
async function fetchDistrictsByRegion(regionCode) {
  // API_CONFIG가 로드되었는지 확인
  if (typeof API_CONFIG === "undefined") {
    throw new Error("API_CONFIG가 로드되지 않았습니다.");
  }

  // Vworld 구군 코드 API 호출 - 올바른 엔드포인트 사용
  const apiUrl = new URL("https://api.vworld.kr/ned/data/admSiList");
  apiUrl.searchParams.append("key", API_CONFIG.SIGUNGU_API.SERVICE_KEY);
  apiUrl.searchParams.append("admCode", regionCode);
  apiUrl.searchParams.append("domain", "localhost");
  apiUrl.searchParams.append("format", "json");
  apiUrl.searchParams.append("numOfRows", "100");

  console.log("Vworld 시군구 API URL:", apiUrl.toString());

  try {
    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log("Vworld 구군 API 응답:", data);
    console.log("응답 구조 분석:", {
      hasAdmVOList: !!data.admVOList,
      hasAdmVOListItems: !!(data.admVOList && data.admVOList.admVOList),
      admVOListKeys: data.admVOList ? Object.keys(data.admVOList) : [],
      dataKeys: Object.keys(data),
    });

    if (data && data.admVOList && data.admVOList.admVOList) {
      const items = data.admVOList.admVOList;
      console.log("파싱된 구군 아이템들:", items);

      const districts = items
        .map((item) => ({
          code: item.admCode,
          name: item.lowestAdmCodeNm,
        }))
        .filter(
          (item) =>
            item.code &&
            item.name &&
            (item.name.includes("구") || item.name.includes("군") || item.name.includes("시"))
        );

      console.log("필터링된 시군구 목록:", districts);
      return districts;
    }

    console.warn("API 응답에서 시군구 데이터를 찾을 수 없습니다:", data);
    return [];
  } catch (error) {
    console.error("시군구 API 호출 실패:", error);
    throw error;
  }
}

// Vworld API를 통해 읍면동 목록 조회
async function fetchDongsByDistrict(districtCode) {
  // API_CONFIG가 로드되었는지 확인
  if (typeof API_CONFIG === "undefined") {
    throw new Error("API_CONFIG가 로드되지 않았습니다.");
  }

  // Vworld 읍면동 코드 API 호출 - 올바른 엔드포인트 사용
  const apiUrl = new URL("https://api.vworld.kr/ned/data/admDongList");
  apiUrl.searchParams.append("key", API_CONFIG.DONG_API.SERVICE_KEY);
  apiUrl.searchParams.append("admCode", districtCode);
  apiUrl.searchParams.append("domain", "localhost");
  apiUrl.searchParams.append("format", "json");
  apiUrl.searchParams.append("numOfRows", "100");

  console.log("Vworld 읍면동 API URL:", apiUrl.toString());

  try {
    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log("Vworld 읍면동 API 응답:", data);
    console.log("응답 구조 분석:", {
      hasAdmVOList: !!data.admVOList,
      hasAdmVOListItems: !!(data.admVOList && data.admVOList.admVOList),
      admVOListKeys: data.admVOList ? Object.keys(data.admVOList) : [],
      dataKeys: Object.keys(data),
    });

    if (data && data.admVOList && data.admVOList.admVOList) {
      const items = data.admVOList.admVOList;
      console.log("파싱된 읍면동 아이템들:", items);

      const dongs = items
        .map((item) => ({
          code: item.admCode,
          name: item.lowestAdmCodeNm,
        }))
        .filter(
          (item) =>
            item.code &&
            item.name &&
            (item.name.includes("동") || item.name.includes("읍") || item.name.includes("면"))
        );

      console.log("필터링된 읍면동 목록:", dongs);
      return dongs;
    }

    console.warn("API 응답에서 읍면동 데이터를 찾을 수 없습니다:", data);
    return [];
  } catch (error) {
    console.error("읍면동 API 호출 실패:", error);
    throw error;
  }
}

// 기본 시/도 목록 로드 함수 제거 - Vworld API만 사용

// 거래일자 옵션 초기화
function initializeTransactionDateOptions() {
  const transactionDateSelect = document.getElementById("transactionDate");
  if (!transactionDateSelect) return;

  // 현재 년도부터 과거 2년까지의 거래일자 생성
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // 기존 옵션 제거 (첫 번째 기본 옵션 제외)
  transactionDateSelect.innerHTML = '<option value="">거래일자를 선택하세요</option>';

  // 최근 24개월 생성
  for (let i = 0; i < 24; i++) {
    let year = currentYear;
    let month = currentMonth - i;

    if (month <= 0) {
      month += 12;
      year -= 1;
    }

    const monthStr = month.toString().padStart(2, "0");
    const yearStr = year.toString();
    const value = yearStr + monthStr;
    const displayText = `${yearStr}년 ${monthStr}월`;

    const option = document.createElement("option");
    option.value = value;
    option.textContent = displayText;
    option.appendChild(document.createTextNode(displayText));
    transactionDateSelect.appendChild(option);
  }
}

// 기본 구/군 목록 로드 함수 제거 - Vworld API만 사용

// 공공데이터포털 부동산 실거래가 API 호출
async function fetchRealEstateData({ region, district, dong, transactionDate }) {
  try {
    // 구/군 코드를 5자리로 제한 (앞 5자리만 사용)
    const lawdCode = district.toString().substring(0, 5);

    const apiUrl =
      `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade` +
      `?serviceKey=${API_CONFIG.REAL_ESTATE_API.SERVICE_KEY}` +
      `&LAWD_CD=${lawdCode}` +
      `&DEAL_YMD=${transactionDate}` +
      `&numOfRows=100&pageNo=1`;

    console.log("API 호출 URL:", apiUrl);

    // 🚀 AllOrigins 프록시 제거 → API 직접 호출
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");

    // API 에러 응답 체크
    const resultCode = xml.querySelector("resultCode")?.textContent;
    const resultMsg = xml.querySelector("resultMsg")?.textContent;

    if (resultCode !== "00" && resultCode !== "000") {
      throw new Error(`API 오류 (${resultCode}): ${resultMsg}`);
    }

    const items = xml.querySelectorAll("item");
    if (!items || items.length === 0) {
      throw new Error(`해당 지역(${dong})의 ${transactionDate} 실거래가 데이터가 없습니다`);
    }

    // XML → JS 객체 변환 (실제 API 응답 태그명에 맞게 수정)
    return Array.from(items).map((item) => ({
      aptName: item.querySelector("aptNm")?.textContent || "-",
      price: item.querySelector("dealAmount")?.textContent.trim() || "-",
      area: item.querySelector("excluUseAr")?.textContent || "-",
      floor: item.querySelector("floor")?.textContent || "-",
      constructionYear: item.querySelector("buildYear")?.textContent || "-",
      date: `${item.querySelector("dealYear")?.textContent}.${
        item.querySelector("dealMonth")?.textContent
      }.${item.querySelector("dealDay")?.textContent}`,
      address: `${item.querySelector("umdNm")?.textContent} ${
        item.querySelector("jibun")?.textContent
      }`,
      dong: item.querySelector("umdNm")?.textContent || "-",
      dealType: "매매",
      buildingType: "아파트",
    }));
  } catch (error) {
    console.error("API 호출 오류:", error.message);
    throw new Error("API 호출 실패: " + error.message);
  }
}

// 검색 조건 상태 확인 및 표시
function checkSearchConditions() {
  const region = document.getElementById("region");
  const district = document.getElementById("district");
  const dong = document.getElementById("dong");
  const transactionDate = document.getElementById("transactionDate");

  const conditions = {
    region: region ? region.value : "",
    district: district ? district.value : "",
    dong: dong ? dong.value : "",
    transactionDate: transactionDate ? transactionDate.value : "",
  };

  console.log("현재 검색 조건:", conditions);

  // 선택된 조건이 있으면 표시
  const selectedConditions = Object.entries(conditions)
    .filter(([key, value]) => value)
    .map(([key, value]) => `${key}: ${value}`);

  if (selectedConditions.length > 0) {
    console.log("선택된 검색 조건:", selectedConditions);
  }

  return conditions;
}

// 검색 조건 검증 및 안내
function validateSearchConditions() {
  const conditions = checkSearchConditions();
  const missingFields = [];

  if (!conditions.region) missingFields.push("시/도");
  if (!conditions.district) missingFields.push("구/군");
  if (!conditions.dong) missingFields.push("읍면동");
  if (!conditions.transactionDate) missingFields.push("거래일자");

  if (missingFields.length > 0) {
    return {
      valid: false,
      message: `다음 검색 조건을 선택해주세요:\n\n${missingFields.join("\n")}`,
      missing: missingFields,
    };
  }

  return { valid: true, message: "모든 검색 조건이 선택되었습니다." };
}

// 검색 조건 표시 (HTML에서 호출)
function showSearchConditions() {
  const conditions = checkSearchConditions();
  const validation = validateSearchConditions();

  let message = "📋 현재 검색 조건:\n\n";

  if (conditions.region) {
    message += `✅ 시/도: ${conditions.region}\n`;
  } else {
    message += `❌ 시/도: 선택되지 않음\n`;
  }

  if (conditions.district) {
    message += `✅ 구/군: ${conditions.district}\n`;
  } else {
    message += `❌ 구/군: 선택되지 않음\n`;
  }

  if (conditions.dong) {
    message += `✅ 읍면동: ${conditions.dong}\n`;
  } else {
    message += `❌ 읍면동: 선택되지 않음\n`;
  }

  if (conditions.transactionDate) {
    message += `✅ 거래일자: ${conditions.transactionDate}\n`;
  } else {
    message += `❌ 거래일자: 선택되지 않음\n`;
  }

  message += `\n${validation.message}`;

  alert(message);
}
