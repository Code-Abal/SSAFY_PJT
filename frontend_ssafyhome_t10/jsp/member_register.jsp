<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> <%@ include
file="/jsp/header.jsp" %>
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>회원가입 - 부동산 거래 플랫폼</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="${root}/css/styles.css" />
  </head>
  <body>
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="${root}/jsp/index.jsp"> <i class="fas fa-home me-2"></i>부동산 플랫폼 </a>
      </div>
    </nav>
    <div class="container-fluid">
      <div class="row">
        <aside class="sidebar">
          <div class="p-3">
            <h5 class="text-gradient mb-3">메뉴</h5>
            <ul class="nav flex-column">
              <li class="nav-item">
                <a href="${root}/jsp/index.jsp" class="nav-link"> <i class="fas fa-home me-2"></i>메인 </a>
              </li>
              <li class="nav-item">
                <a href="${root}/jsp/member_list.jsp" class="nav-link"> <i class="fas fa-users me-2"></i>회원관리 </a>
              </li>
            </ul>
          </div>
        </aside>
        <main class="main-content">
          <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
              <div class="card shadow-custom">
                <div class="card-header text-center">
                  <h4 class="mb-0"><i class="fas fa-user-plus me-2"></i>회원가입</h4>
                  <p class="mb-0 mt-2 opacity-75">부동산 플랫폼의 회원이 되어 다양한 서비스를 이용하세요</p>
                </div>
                <div class="card-body p-4">
                  <form id="registerForm">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="username" class="form-label">
                            <i class="fas fa-user me-2"></i>아이디
                            <span class="text-danger">*</span>
                          </label>
                          <div class="input-group">
                            <input
                              type="text"
                              class="form-control"
                              id="username"
                              name="username"
                              placeholder="아이디를 입력하세요"
                              required
                            />
                            <button class="btn btn-outline-secondary" type="button" id="checkUsername">중복확인</button>
                          </div>
                          <div class="form-text">영문, 숫자 조합 4-20자</div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="email" class="form-label">
                            <i class="fas fa-envelope me-2"></i>이메일
                            <span class="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            class="form-control"
                            id="email"
                            name="email"
                            placeholder="이메일을 입력하세요"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <!-- ...기타 member_register.html의 나머지 폼 요소도 동일하게 옮겨서 경로만 ${root}로 변경하면 됩니다... -->
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </body>
</html>
