<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
  <title>동코드 목록 지도</title>
  <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}"></script>
  <style>#map {width:100%;height:500px;}</style>
</head>
<body>
  <h2>동코드 목록 지도</h2>
  <div id="map"></div>
  <ul>
    <c:forEach var="dong" items="${dongList}">
      <li>${dong.dong_name} (${dong.sido_name} ${dong.gugun_name}) - ${dong.dong_code}</li>
    </c:forEach>
  </ul>
  <script>
    var map = new kakao.maps.Map(document.getElementById('map'), {
      center: new kakao.maps.LatLng(37.5665, 126.9780), // 기본 중심(서울)
      level: 8
    });

    // 동코드 목록을 자바스크립트 배열로 변환
    var dongList = [
      <c:forEach var="dong" items="${dongList}" varStatus="status">
        {
          dong_code: "${dong.dong_code}",
          dong_name: "${dong.dong_name}",
          sido_name: "${dong.sido_name}",
          gugun_name: "${dong.gugun_name}"
        }<c:if test="${!status.last}">,</c:if>
      </c:forEach>
    ];

    // 주소를 좌표로 변환하여 마커 표시
    var geocoder = new kakao.maps.services.Geocoder();
    dongList.forEach(function(dong) {
      var address = dong.sido_name + ' ' + dong.gugun_name + ' ' + dong.dong_name;
      geocoder.addressSearch(address, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
          var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          var marker = new kakao.maps.Marker({
            map: map,
            position: coords,
            title: dong.dong_name
          });
          var infowindow = new kakao.maps.InfoWindow({
            content: '<div style="padding:5px;font-size:13px;">' + dong.dong_name + '<br>(' + dong.dong_code + ')</div>'
          });
          kakao.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker);
          });
        }
      });
    });
  </script>
</body>
</html>
