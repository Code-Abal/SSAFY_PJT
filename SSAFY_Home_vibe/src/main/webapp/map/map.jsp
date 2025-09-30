<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>지도 보기 - SSAFY HOME</title>
    <style>
      #map {width:100%;height:500px;}
    </style>
    <!-- 카카오맵 JS SDK (appkey는 서버에서 전달) -->
    <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=fa616dfbdd589d3c53f274115351ca72"></script>
</head>
<body>
    <h1>카카오맵 예제</h1>
    <div id="map" style="width:100%;height:500px;"></div>
    <script>
        // 카카오맵 기본 지도 표시
        var container = document.getElementById('map');
        var options = {
            center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 시청 좌표
            level: 3
        };
        var map = new kakao.maps.Map(container, options);
    </script>
</body>
</html>