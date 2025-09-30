<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> <%@ include
file="/jsp/header.jsp" %>
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>회원정보 등록</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="${root}/css/style.css" />
    <style>
      .form-container {
        max-width: 600px;
        margin: 0 auto;
      }
      .required-field::after {
        content: " *";
        color: red;
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
      <div class="form-container">
        <div class="text-center mb-4">
          <h2 class="text-primary"><i class="bi bi-person-plus-fill me-2"></i>회원정보 등록</h2>
          <p class="text-muted">새로운 회원을 시스템에 등록합니다</p>
        </div>
        <div class="card shadow">
          <div class="card-body p-4">
            <form id="memberRegistrationForm">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="username" class="form-label required-field">아이디</label>
                  <div class="input-group">
                    <input type="text" class="form-control" id="username" name="username" required />
                    <button class="btn btn-outline-secondary" type="button" onclick="checkUsernameAvailability()">
                      중복확인
                    </button>
                  </div>
                  <div class="form-text" id="usernameHelp"></div>
                </div>
                <div class="col-md-6">
                  <label for="password" class="form-label required-field">비밀번호</label>
                  <input type="password" class="form-control" id="password" name="password" required />
                  <div class="form-text">8자 이상, 영문/숫자/특수문자 조합</div>
                </div>
              </div>
              <!-- ...기타 member_registration.html의 나머지 폼 요소도 동일하게 옮겨서 경로만 ${root}로 변경하면 됩니다... -->
            </form>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
