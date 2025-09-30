// 부동산 웹페이지 실거래가 조회 JavaScript

class RealPriceManager {
  constructor() {
    this.miniMap = null;
    this.searchResults = [];
    this.currentView = "list"; // 'list' or 'map'
    this.init();
  }

  init() {
    this.initMiniMap();
    this.initEventListeners();
    this.initRegionData();
    this.loadSampleData();
  }

  // 미니맵 초기화
  initMiniMap() {
    if (document.getElementById("miniMap")) {
      const mapContainer = document.getElementById("miniMap");
      const mapOption = {
        center: new kakao.maps.LatLng(37.5665, 126.978), // 서울 시청 좌표
        level: 8,
        mapTypeId: kakao.maps.MapTypeId.ROADMAP,
      };

      this.miniMap = new kakao.maps.Map(mapContainer, mapOption);

      // 지도 컨트롤 추가
      const zoomControl = new kakao.maps.ZoomControl();
      this.miniMap.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
    }
  }

  // 이벤트 리스너 초기화
  initEventListeners() {
    // 검색 폼 제출
    const searchForm = document.getElementById("searchForm");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSearch();
      });
    }

    // 지역 선택 시 구/군 업데이트
    const regionSelect = document.getElementById("region");
    if (regionSelect) {
      regionSelect.addEventListener("change", () => {
        this.updateDistricts();
      });
    }

    // 뷰 전환 버튼
    const listViewBtn = document.getElementById("listView");
    const mapViewBtn = document.getElementById("mapView");

    if (listViewBtn) {
      listViewBtn.addEventListener("click", () => {
        this.switchView("list");
      });
    }

    if (mapViewBtn) {
      mapViewBtn.addEventListener("click", () => {
        this.switchView("map");
      });
    }

    // 필터 적용 버튼
    const applyFilterBtn = document.getElementById("applyFilter");
    if (applyFilterBtn) {
      applyFilterBtn.addEventListener("click", () => {
        this.applyFilter();
      });
    }
  }

  // 지역 데이터 초기화
  initRegionData() {
    this.regionData = {
      seoul: [
        "강남구",
        "강동구",
        "강북구",
        "강서구",
        "관악구",
        "광진구",
        "구로구",
        "금천구",
        "노원구",
        "도봉구",
        "동대문구",
        "동작구",
        "마포구",
        "서대문구",
        "서초구",
        "성동구",
        "성북구",
        "송파구",
        "양천구",
        "영등포구",
        "용산구",
        "은평구",
        "종로구",
        "중구",
        "중랑구",
      ],
      gyeonggi: [
        "수원시",
        "성남시",
        "의정부시",
        "안양시",
        "부천시",
        "광명시",
        "평택시",
        "과천시",
        "오산시",
        "시흥시",
        "군포시",
        "의왕시",
        "하남시",
        "용인시",
        "파주시",
        "이천시",
        "안성시",
        "김포시",
        "화성시",
        "광주시",
        "여주시",
        "양평군",
        "고양시",
        "남양주시",
      ],
      incheon: [
        "중구",
        "동구",
        "미추홀구",
        "연수구",
        "남동구",
        "부평구",
        "계양구",
        "서구",
        "강화군",
        "옹진군",
      ],
      busan: [
        "중구",
        "서구",
        "동구",
        "영도구",
        "부산진구",
        "동래구",
        "남구",
        "북구",
        "해운대구",
        "사하구",
        "금정구",
        "강서구",
        "연제구",
        "수영구",
        "사상구",
        "기장군",
      ],
      daegu: ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군"],
      daejeon: ["중구", "동구", "서구", "유성구", "대덕구"],
      gwangju: ["동구", "서구", "남구", "북구", "광산구"],
      ulsan: ["중구", "남구", "동구", "북구", "울주군"],
    };
  }

  // 구/군 업데이트
  updateDistricts() {
    const regionSelect = document.getElementById("region");
    const districtSelect = document.getElementById("district");

    if (!regionSelect || !districtSelect) return;

    const selectedRegion = regionSelect.value;
    districtSelect.innerHTML = '<option value="">구/군을 선택하세요</option>';

    if (selectedRegion && this.regionData[selectedRegion]) {
      this.regionData[selectedRegion].forEach((district) => {
        const option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
      });
    }
  }

  // 검색 처리
  async handleSearch() {
    const formData = this.collectSearchData();

    if (!this.validateSearchData(formData)) {
      return;
    }

    try {
      // 로딩 상태 표시
      this.showLoadingState();

      // 실제로는 API 호출을 해야 하지만, 여기서는 시뮬레이션
      await this.simulateSearchAPI(formData);

      // 검색 결과 표시
      this.displaySearchResults();

      // 지도에 마커 표시
      this.displayMapMarkers();

      this.showNotification("검색이 완료되었습니다.", "success");
    } catch (error) {
      this.showNotification(error.message, "danger");
    } finally {
      this.hideLoadingState();
    }
  }

  // 검색 데이터 수집
  collectSearchData() {
    const form = document.getElementById("searchForm");
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    return data;
  }

  // 검색 데이터 유효성 검사
  validateSearchData(data) {
    if (!data.region) {
      this.showNotification("지역을 선택해주세요.", "warning");
      return false;
    }

    if (!data.district) {
      this.showNotification("구/군을 선택해주세요.", "warning");
      return false;
    }

    if (!data.propertyType) {
      this.showNotification("매물 유형을 선택해주세요.", "warning");
      return false;
    }

    if (!data.transactionDate) {
      this.showNotification("거래일자를 선택해주세요.", "warning");
      return false;
    }

    return true;
  }

  // 검색 API 시뮬레이션
  simulateSearchAPI(searchData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 검색 조건에 따른 샘플 데이터 생성
        this.searchResults = this.generateSampleResults(searchData);
        resolve({ success: true, data: this.searchResults });
      }, 1500);
    });
  }

  // 샘플 검색 결과 생성
  generateSampleResults(searchData) {
    const results = [];
    const propertyTypes = {
      apartment: "아파트",
      villa: "빌라/연립",
      house: "단독주택",
      commercial: "상가/사무실",
      land: "토지",
    };

    const propertyTypeName = propertyTypes[searchData.propertyType] || "매물";

    // 10개의 샘플 결과 생성
    for (let i = 1; i <= 10; i++) {
      const price = Math.floor(Math.random() * 20) + 5; // 5억 ~ 25억
      const size = Math.floor(Math.random() * 100) + 30; // 30㎡ ~ 130㎡
      const year = Math.floor(Math.random() * 20) + 2000; // 2000년 ~ 2020년

      results.push({
        id: i,
        address: `${searchData.region} ${searchData.district} ${this.getRandomDong()}`,
        propertyType: propertyTypeName,
        price: price,
        size: size,
        yearBuilt: year,
        transactionDate: this.getRandomDate(),
        floor: Math.floor(Math.random() * 20) + 1,
        rooms: Math.floor(Math.random() * 3) + 1,
        bathrooms: Math.floor(Math.random() * 2) + 1,
        parking: Math.random() > 0.5,
        elevator: Math.random() > 0.3,
        coordinates: this.getRandomCoordinates(searchData.region),
      });
    }

    return results;
  }

  // 랜덤 동 이름 생성
  getRandomDong() {
    const dongs = [
      "역삼동",
      "강남동",
      "삼성동",
      "청담동",
      "신사동",
      "압구정동",
      "논현동",
      "신논현동",
    ];
    return dongs[Math.floor(Math.random() * dongs.length)];
  }

  // 랜덤 날짜 생성
  getRandomDate() {
    const start = new Date(2021, 0, 1);
    const end = new Date(2024, 11, 31);
    const randomDate = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
    return randomDate.toISOString().split("T")[0];
  }

  // 랜덤 좌표 생성
  getRandomCoordinates(region) {
    const baseCoords = {
      seoul: { lat: 37.5665, lng: 126.978 },
      gyeonggi: { lat: 37.4138, lng: 127.5183 },
      incheon: { lat: 37.4563, lng: 126.7052 },
      busan: { lat: 35.1796, lng: 129.0756 },
      daegu: { lat: 35.8714, lng: 128.6014 },
      daejeon: { lat: 36.3504, lng: 127.3845 },
      gwangju: { lat: 35.1595, lng: 126.8526 },
      ulsan: { lat: 35.5384, lng: 129.3114 },
    };

    const base = baseCoords[region] || baseCoords.seoul;
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;

    return {
      lat: base.lat + latOffset,
      lng: base.lng + lngOffset,
    };
  }

  // 검색 결과 표시
  displaySearchResults() {
    const resultsContainer = document.getElementById("searchResults");

    if (!resultsContainer) return;

    if (this.searchResults.length === 0) {
      resultsContainer.innerHTML = `
        <div class="text-center py-5">
          <i class="fas fa-search fa-3x text-muted mb-3"></i>
          <p class="text-muted">검색 결과가 없습니다.</p>
        </div>
      `;
      return;
    }

    const resultsHTML = this.searchResults
      .map(
        (result) => `
      <div class="card mb-3 border-0 shadow-sm">
        <div class="card-body">
          <div class="row">
            <div class="col-md-8">
              <h6 class="card-title mb-2">
                <i class="fas fa-map-marker-alt text-primary me-2"></i>
                ${result.address}
              </h6>
              <p class="card-text text-muted mb-2">
                <i class="fas fa-home me-2"></i>${result.propertyType} | 
                <i class="fas fa-ruler-combined me-2"></i>${result.size}㎡ | 
                <i class="fas fa-calendar me-2"></i>${result.yearBuilt}년 준공
              </p>
              <div class="d-flex gap-3 text-muted small">
                <span><i class="fas fa-door-open me-1"></i>${result.rooms}룸</span>
                <span><i class="fas fa-bath me-1"></i>${result.bathrooms}욕실</span>
                <span><i class="fas fa-car me-1"></i>${
                  result.parking ? "주차가능" : "주차불가"
                }</span>
                <span><i class="fas fa-arrow-up me-1"></i>${
                  result.elevator ? "엘리베이터" : "계단"
                }</span>
              </div>
            </div>
            <div class="col-md-4 text-end">
              <h5 class="text-primary mb-2">${result.price}억원</h5>
              <p class="text-muted small mb-2">거래일: ${result.transactionDate}</p>
              <button class="btn btn-outline-primary btn-sm" onclick="realPriceManager.showPropertyDetail(${
                result.id
              })">
                <i class="fas fa-info-circle me-1"></i>상세보기
              </button>
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    resultsContainer.innerHTML = resultsHTML;
  }

  // 지도에 마커 표시
  displayMapMarkers() {
    if (!this.miniMap) return;

    // 기존 마커 제거
    this.clearMapMarkers();

    // 새 마커 추가
    this.searchResults.forEach((result) => {
      if (result.coordinates) {
        const position = new kakao.maps.LatLng(result.coordinates.lat, result.coordinates.lng);
        const marker = new kakao.maps.Marker({
          position: position,
          title: result.address,
        });

        marker.setMap(this.miniMap);
        this.markers = this.markers || [];
        this.markers.push(marker);

        // 마커 클릭 이벤트
        kakao.maps.event.addListener(marker, "click", () => {
          this.showPropertyInfoWindow(result, position);
        });
      }
    });

    // 지도 범위 조정
    if (this.searchResults.length > 0) {
      const bounds = new kakao.maps.LatLngBounds();
      this.searchResults.forEach((result) => {
        if (result.coordinates) {
          bounds.extend(new kakao.maps.LatLng(result.coordinates.lat, result.coordinates.lng));
        }
      });
      this.miniMap.setBounds(bounds);
    }
  }

  // 지도 마커 제거
  clearMapMarkers() {
    if (this.markers) {
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];
    }
  }

  // 매물 정보창 표시
  showPropertyInfoWindow(property, position) {
    const infowindow = new kakao.maps.InfoWindow({
      content: `
        <div style="padding: 10px; min-width: 250px;">
          <h6 style="margin: 0 0 10px 0; color: #2563eb;">${property.address}</h6>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">
            ${property.propertyType} | ${property.size}㎡ | ${property.price}억원
          </p>
          <button class="btn btn-sm btn-primary" onclick="realPriceManager.showPropertyDetail(${property.id})">
            상세보기
          </button>
        </div>
      `,
    });

    infowindow.open(this.miniMap, position);
  }

  // 매물 상세 정보 표시
  showPropertyDetail(propertyId) {
    const property = this.searchResults.find((p) => p.id === propertyId);
    if (!property) return;

    const detailModal = `
      <div class="modal fade" id="propertyDetailModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-home me-2"></i>매물 상세 정보
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <h6>기본 정보</h6>
                  <ul class="list-unstyled">
                    <li><strong>주소:</strong> ${property.address}</li>
                    <li><strong>매물 유형:</strong> ${property.propertyType}</li>
                    <li><strong>거래가:</strong> ${property.price}억원</li>
                    <li><strong>면적:</strong> ${property.size}㎡</li>
                    <li><strong>준공년도:</strong> ${property.yearBuilt}년</li>
                    <li><strong>거래일:</strong> ${property.transactionDate}</li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <h6>상세 정보</h6>
                  <ul class="list-unstyled">
                    <li><strong>층수:</strong> ${property.floor}층</li>
                    <li><strong>방 개수:</strong> ${property.rooms}개</li>
                    <li><strong>욕실 개수:</strong> ${property.bathrooms}개</li>
                    <li><strong>주차:</strong> ${property.parking ? "가능" : "불가능"}</li>
                    <li><strong>엘리베이터:</strong> ${property.elevator ? "있음" : "없음"}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
              <button type="button" class="btn btn-primary">
                <i class="fas fa-heart me-1"></i>관심매물 등록
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // 기존 모달이 있으면 제거
    const existingModal = document.getElementById("propertyDetailModal");
    if (existingModal) {
      existingModal.remove();
    }

    // 새 모달 추가
    document.body.insertAdjacentHTML("beforeend", detailModal);

    // 모달 표시
    const modal = new bootstrap.Modal(document.getElementById("propertyDetailModal"));
    modal.show();
  }

  // 뷰 전환
  switchView(view) {
    this.currentView = view;

    const listViewBtn = document.getElementById("listView");
    const mapViewBtn = document.getElementById("mapView");

    if (view === "list") {
      listViewBtn.classList.add("active");
      mapViewBtn.classList.remove("active");
      this.displaySearchResults();
    } else {
      mapViewBtn.classList.add("active");
      listViewBtn.classList.remove("active");
      this.displayMapView();
    }
  }

  // 지도 뷰 표시
  displayMapView() {
    const resultsContainer = document.getElementById("searchResults");

    if (!resultsContainer) return;

    resultsContainer.innerHTML = `
      <div id="fullMap" style="height: 600px;"></div>
    `;

    // 전체 화면 지도 생성
    this.createFullMap();
  }

  // 전체 화면 지도 생성
  createFullMap() {
    const mapContainer = document.getElementById("fullMap");
    if (!mapContainer) return;

    const mapOption = {
      center: new kakao.maps.LatLng(37.5665, 126.978),
      level: 7,
      mapTypeId: kakao.maps.MapTypeId.ROADMAP,
    };

    const fullMap = new kakao.maps.Map(mapContainer, mapOption);

    // 검색 결과를 지도에 표시
    this.searchResults.forEach((result) => {
      if (result.coordinates) {
        const position = new kakao.maps.LatLng(result.coordinates.lat, result.coordinates.lng);
        const marker = new kakao.maps.Marker({
          position: position,
          title: result.address,
        });

        marker.setMap(fullMap);

        // 마커 클릭 이벤트
        kakao.maps.event.addListener(marker, "click", () => {
          this.showPropertyInfoWindow(result, position);
        });
      }
    });

    // 지도 범위 조정
    if (this.searchResults.length > 0) {
      const bounds = new kakao.maps.LatLngBounds();
      this.searchResults.forEach((result) => {
        if (result.coordinates) {
          bounds.extend(new kakao.maps.LatLng(result.coordinates.lat, result.coordinates.lng));
        }
      });
      fullMap.setBounds(bounds);
    }
  }

  // 필터 적용
  applyFilter() {
    const minPrice = document.getElementById("minPrice").value;
    const maxPrice = document.getElementById("maxPrice").value;
    const minSize = document.getElementById("minSize").value;
    const maxSize = document.getElementById("maxSize").value;

    let filteredResults = [...this.searchResults];

    // 가격 필터
    if (minPrice || maxPrice) {
      filteredResults = filteredResults.filter((result) => {
        if (minPrice && result.price < parseInt(minPrice)) return false;
        if (maxPrice && result.price > parseInt(maxPrice)) return false;
        return true;
      });
    }

    // 면적 필터
    if (minSize || maxSize) {
      filteredResults = filteredResults.filter((result) => {
        if (minSize && result.size < parseInt(minSize)) return false;
        if (maxSize && result.size > parseInt(maxSize)) return false;
        return true;
      });
    }

    // 필터링된 결과 표시
    this.searchResults = filteredResults;
    this.displaySearchResults();
    this.displayMapMarkers();

    this.showNotification(`필터가 적용되었습니다. (${filteredResults.length}건)`, "success");
  }

  // 로딩 상태 표시
  showLoadingState() {
    const resultsContainer = document.getElementById("searchResults");
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="text-center py-5">
          <div class="loading mb-3"></div>
          <p class="text-muted">검색 중입니다...</p>
        </div>
      `;
    }
  }

  // 로딩 상태 숨김
  hideLoadingState() {
    // 이미 displaySearchResults에서 처리됨
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

  // 샘플 데이터 로드
  loadSampleData() {
    // 페이지 로드 시 기본 샘플 데이터 표시
    this.searchResults = [];
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
  
  .btn.active {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
  }
`;
document.head.appendChild(style);

// 실거래가 매니저 초기화
let realPriceManager;
window.onload = function () {
  realPriceManager = new RealPriceManager();
};

// 전역 함수로 노출
window.realPriceManager = realPriceManager;
