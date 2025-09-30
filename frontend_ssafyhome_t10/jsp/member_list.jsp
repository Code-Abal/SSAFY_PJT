<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> <%@ include
file="/jsp/header.jsp" %> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>회원관리 시스템</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="${root}/css/styles.css" />
    <style>
      .feature-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer;
      }
      .feature-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      }
      .stats-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      .stats-card.success {
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      }
      .stats-card.warning {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      .stats-card.info {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
    </style>
  </head>
  <body>
    <!-- 네비게이션 바 -->
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
              <a class="nav-link" href="${root}/jsp/index.jsp"> <i class="bi bi-house me-1"></i>홈 </a>
            </li>
            <li class="nav-item" id="logoutNavItem" style="display: none">
              <a class="nav-link" href="#" onclick="logout()"> <i class="bi bi-box-arrow-right me-1"></i>로그아웃 </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container py-5">
      <!-- 페이지 헤더 -->
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="text-primary"><i class="bi bi-people-fill me-2"></i>회원관리 시스템</h2>
          <p class="text-muted">관리자 전용 회원 정보 관리 도구</p>
        </div>
      </div>
      <!-- 통계 카드 (JSTL 변수 예시) -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card stats-card text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="mb-0">${totalMembers}</h4>
                  <small>전체 회원</small>
                </div>
                <div class="align-self-center">
                  <i class="bi bi-people-fill fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card stats-card success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="mb-0">${activeMembers}</h4>
                  <small>활성 회원</small>
                </div>
                <div class="align-self-center">
                  <i class="bi bi-person-check-fill fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card stats-card warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="mb-0">${newMembers}</h4>
                  <small>신규 회원</small>
                </div>
                <div class="align-self-center">
                  <i class="bi bi-person-plus-fill fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card stats-card info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="mb-0">${adminMembers}</h4>
                  <small>관리자</small>
                </div>
                <div class="align-self-center">
                  <i class="bi bi-shield-fill-check fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 주요 기능 카드 (경로 JSTL 적용) -->
      <div class="row mb-4">
        <div class="col-md-6 col-lg-3 mb-3">
          <div class="card feature-card h-100" onclick="openMemberRegistration()">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="bi bi-person-plus-fill text-success" style="font-size: 3rem"></i>
              </div>
              <h5 class="card-title">회원정보 등록</h5>
              <p class="card-text text-muted">새로운 회원을 시스템에 등록합니다.</p>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-3">
          <div class="card feature-card h-100" onclick="openMemberEdit()">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="bi bi-pencil-square text-warning" style="font-size: 3rem"></i>
              </div>
              <h5 class="card-title">회원정보 수정</h5>
              <p class="card-text text-muted">기존 회원 정보를 수정합니다.</p>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-3">
          <div class="card feature-card h-100" onclick="openMemberDelete()">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="bi bi-person-x-fill text-danger" style="font-size: 3rem"></i>
              </div>
              <h5 class="card-title">회원정보 삭제</h5>
              <p class="card-text text-muted">회원을 시스템에서 삭제합니다.</p>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-3">
          <div class="card feature-card h-100" onclick="openMemberSearch()">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="bi bi-search text-info" style="font-size: 3rem"></i>
              </div>
              <h5 class="card-title">회원정보 조회</h5>
              <p class="card-text text-muted">회원 정보를 검색하고 조회합니다.</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 검색 및 필터 -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-4">
                  <label for="searchInput" class="form-label">빠른 검색</label>
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      id="searchInput"
                      placeholder="아이디, 이름, 이메일, 전화번호로 검색"
                    />
                    <button class="btn btn-primary" type="button" onclick="memberManagement.searchMembers()">
                      <i class="bi bi-search"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-3">
                  <label for="roleFilter" class="form-label">역할 필터</label>
                  <select class="form-select" id="roleFilter" onchange="memberManagement.filterByRole()">
                    <option value="">전체</option>
                    <option value="admin">관리자</option>
                    <option value="user">일반사용자</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="statusFilter" class="form-label">상태 필터</label>
                  <select class="form-select" id="statusFilter" onchange="memberManagement.filterByStatus()">
                    <option value="">전체</option>
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                  </select>
                </div>
                <div class="col-md-2 d-flex align-items-end">
                  <button class="btn btn-outline-secondary w-100" onclick="memberManagement.renderMemberTable()">
                    <i class="bi bi-arrow-clockwise me-1"></i>초기화
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 최근 회원 목록 (JSTL 반복문 적용) -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0"><i class="bi bi-clock-history me-2"></i>최근 등록된 회원</h5>
              <button class="btn btn-outline-primary btn-sm" onclick="refreshMemberList()">
                <i class="bi bi-arrow-clockwise me-1"></i>새로고침
              </button>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover" id="memberTable">
                  <thead class="table-light">
                    <tr>
                      <th>#</th>
                      <th>아이디</th>
                      <th>이름</th>
                      <th>이메일</th>
                      <th>역할</th>
                      <th>가입일</th>
                      <th>상태</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody id="memberTableBody">
                    <c:forEach var="member" items="${memberList}">
                      <tr>
                        <td>${member.index}</td>
                        <td>${member.username}</td>
                        <td>${member.name}</td>
                        <td>${member.email}</td>
                        <td>${member.role}</td>
                        <td>${member.joinDate}</td>
                        <td>${member.status}</td>
                        <td>
                          <button class="btn btn-sm btn-outline-info" onclick="editMember('${member.username}')">
                            수정
                          </button>
                          <button class="btn btn-sm btn-outline-danger" onclick="deleteMember('${member.username}')">
                            삭제
                          </button>
                        </td>
                      </tr>
                    </c:forEach>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="${root}/js/member_management.js"></script>
  </body>
</html>
