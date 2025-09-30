<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> <%@ include
file="/jsp/header.jsp" %>
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>회원정보 조회</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="${root}/css/style.css" />
    <style>
      .search-section {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      }
      .filter-section {
        background-color: #e3f2fd;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      }
      .member-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .member-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
      .status-badge {
        font-size: 0.8rem;
      }
      .role-badge {
        font-size: 0.8rem;
      }
    </style>
  </head>
  <body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" href="${root}/jsp/index.jsp">
          <i class="bi bi-house-fill me-2"></i>부동산 관리 시스템
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="${root}/jsp/member_list.jsp"> <i class="bi bi-arrow-left me-1"></i>회원관리 </a>
            </li>
            <li class="nav-item" id="logoutNavItem" style="display: none">
              <a class="nav-link" href="#" onclick="logout()"> <i class="bi bi-box-arrow-right me-1"></i>로그아웃 </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container py-5">
      <div class="text-center mb-4">
        <h2 class="text-info"><i class="bi bi-search me-2"></i>회원정보 조회</h2>
        <p class="text-muted">회원 정보를 검색하고 상세 내용을 확인합니다</p>
      </div>
      <div class="search-section">
        <h5 class="mb-3"><i class="bi bi-search me-2"></i>회원 검색</h5>
        <!-- 검색 폼 및 결과 영역 추가 -->
      </div>
      <!-- ...기타 member_search.html의 나머지 내용은 동일하게 옮겨서 경로만 ${root}로 변경하면 됩니다... -->
    </div>
  </body>
</html>
