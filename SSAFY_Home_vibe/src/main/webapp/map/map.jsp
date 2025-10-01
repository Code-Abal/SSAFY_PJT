<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> <%@ taglib prefix="c"
uri="jakarta.tags.core" %> <%@ include file="/commons/header.jsp" %>
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>지도 보기 - SSAFY HOME</title>
    <link rel="stylesheet" href="/assets/css/styles.css" />
    <!-- 카카오맵 JS SDK (appkey는 서버에서 전달) -->
    <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=fa616dfbdd589d3c53f274115351ca72"></script>
  </head>
  <body>
    <div class="main-content">
      <h1 class="text-gradient" style="margin-bottom: 24px">카카오맵 예제</h1>
      <div id="map" style="height: 500px"></div>
      <div class="realprice-overlay">
        <div class="search-panel" style="left: 20px; top: 20px">
          <div class="panel-header">
            <h5><i class="fas fa-search me-2"></i>실거래가 검색</h5>
          </div>
          <div class="search-section">
            <form action="${root}/map" method="POST">
              <input type="hidden" name="action" value="show_section" />
              <div class="mb-2">
                <label class="form-label"><i class="fas fa-map-marker-alt me-2"></i>지역</label>
                <select class="form-select" id="sidoSelect" name="sido" required>
                  <option value="">시/도를 선택하세요</option>
                </select>
              </div>
              <div class="row g-2">
                <div class="col-6">
                  <label class="form-label"><i class="fas fa-building me-2"></i>구/군</label>
                  <select class="form-select" id="gugunSelect" name="gugun" required>
                    <option value="">구/군</option>
                  </select>
                </div>
                <div class="col-6">
                  <label class="form-label"><i class="fas fa-map-pin me-2"></i>읍면동</label>
                  <select class="form-select" id="dongSelect" name="dong" required>
                    <option value="">읍면동</option>
                  </select>
                </div>
              </div>
              <div class="d-grid mt-3">
                <button type="submit" class="btn btn-primary w-100"><i class="fas fa-search me-2"></i>검색</button>
              </div>
            </form>
            <script>
              // 카카오맵 기본 지도 표시
              var container = document.getElementById("map");
              var options = {
                center: new kakao.maps.LatLng(37.5665, 126.978), // 서울 시청 좌표
                level: 3,
              };
              var map = new kakao.maps.Map(container, options);

              // 동코드 목록을 JS 배열로 변환 (JSTL -> JS)
              var dongList = [
                <c:forEach var="dong" items="${dongList}" varStatus="status">
                  {
                    dong_code: "${dong.dong_code}",
                    sido_name: "${dong.sido_name}",
                    gugun_name: "${dong.gugun_name}",
                    dong_name: "${dong.dong_name}"
                  }<c:if test="${!status.last}">,</c:if>
                </c:forEach>
              ];

              // 시/도 select 채우기
              const sidoSelect = document.getElementById('sidoSelect');
              const gugunSelect = document.getElementById('gugunSelect');
              const dongSelect = document.getElementById('dongSelect');

              // 시/도 목록 추출
              const sidoSet = new Set(dongList.map(d => d.sido_name));
              sidoSet.forEach(sido => {
                // 값이 null이거나 빈 문자열이면 시/도 option을 추가하지 않음
                if (!sido) return;
                const opt = document.createElement('option');
                opt.value = sido;
                opt.textContent = sido;
                sidoSelect.appendChild(opt);
              });

              // 시/도 선택 시 구/군 채우기
              sidoSelect.addEventListener('change', function() {
                gugunSelect.innerHTML = '<option value="">구/군</option>';
                dongSelect.innerHTML = '<option value="">읍면동</option>';
                if (!this.value) return;
                const gugunSet = new Set(dongList.filter(d => d.sido_name === this.value).map(d => d.gugun_name));
                gugunSet.forEach(gugun => {
                  // 값이 null이거나 빈 문자열이면 구/군 option을 추가하지 않음
                  if (!gugun) return;
                  const opt = document.createElement('option');
                  opt.value = gugun;
                  opt.textContent = gugun;
                  gugunSelect.appendChild(opt);
                });
              });

              // 구/군 선택 시 읍면동 채우기
              gugunSelect.addEventListener('change', function() {
                dongSelect.innerHTML = '<option value="">읍면동</option>';
                if (!this.value || !sidoSelect.value) return;
                dongList.filter(d => d.sido_name === sidoSelect.value && d.gugun_name === this.value)
                  .forEach(dong => {
                    // 값이 null이거나 빈 문자열이면 읍면동 option을 추가하지 않음
                    if (!dong.dong_code || !dong.dong_name) return;
                    const opt = document.createElement('option');
                    opt.value = dong.dong_name; // ← 동코드가 value로 들어감
                    opt.textContent = dong.dong_name;
                    dongSelect.appendChild(opt);
                  });
              });
            </script>
          </div>
          <!-- .search-section -->
        </div>
        <!-- .search-panel -->
      </div>
      <!-- .realprice-overlay -->
    </div>
    <!-- .main-content -->
  </body>
</html>
