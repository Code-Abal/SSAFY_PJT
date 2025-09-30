<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> <%@ include
file="/jsp/header.jsp" %>
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>부동산 거래 플랫폼</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <!-- Google Fonts -->
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="${root}/css/styles.css" />
    <script
      type="text/javascript"
      src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=fa616dfbdd589d3c53f274115351ca72&libraries=services"
    ></script>
    <style>
      ...existing code...;
    </style>
  </head>
  <body>
    <!-- 상단 네비게이션 -->
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="${root}/jsp/index.jsp"> <i class="fas fa-home me-2"></i>부동산 플랫폼 </a>
        <!-- 모바일 메뉴 토글 -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item" id="loginNavItem">
              <a class="nav-link" href="${root}/jsp/login.jsp"> <i class="fas fa-sign-in-alt me-1"></i>로그인 </a>
            </li>
            <li class="nav-item" id="registerNavItem">
              <a class="nav-link" href="${root}/jsp/member_register.jsp">
                <i class="fas fa-user-plus me-1"></i>회원가입
              </a>
            </li>
            <li class="nav-item" id="logoutNavItem" style="display: none">
              <a class="nav-link" href="#" onclick="logout()"> <i class="fas fa-sign-out-alt me-1"></i>로그아웃 </a>
            </li>
            <li class="nav-item" id="userDisplay" style="display: none">
              <div class="dropdown">
                <button
                  class="nav-link text-light dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  style="background: none; border: none"
                >
                  <i class="fas fa-user me-1"></i><span id="userDisplayText"></span>
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#userInfoModal">
                      <i class="fas fa-user-edit me-2"></i>내 정보
                    </a>
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <a class="dropdown-item text-danger" href="#" onclick="logout()">
                      <i class="fas fa-sign-out-alt me-2"></i>로그아웃
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <!-- 지도 컨테이너 -->
    <div class="map-container">
      <div id="map"></div>
      ...existing code...
    </div>
    <!-- User Info Modal -->
    <div class="modal fade" id="userInfoModal" tabindex="-1">...existing code...</div>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="${root}/js/config.js"></script>
    <script src="${root}/js/main.js"></script>
    <script src="${root}/js/auth.js"></script>
    <script>
      ...existing code...
    </script>
  </body>
</html>
