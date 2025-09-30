// 부동산 웹페이지 인증 관련 JavaScript

class AuthManager {
  constructor() {
    this.isLoggedIn = false;
    this.currentUser = null;
    this.init();
  }

  init() {
    // DOM이 준비된 후에 초기화
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.checkLoginStatus();
        this.initEventListeners();
        this.updateUI();
      });
    } else {
      this.checkLoginStatus();
      this.initEventListeners();
      this.updateUI();
    }
  }

  // 로그인 상태 확인
  checkLoginStatus() {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const userData = localStorage.getItem("userData") || sessionStorage.getItem("userData");

    if (token && userData) {
      this.isLoggedIn = true;
      this.currentUser = JSON.parse(userData);
    } else {
      this.isLoggedIn = false;
      this.currentUser = null;
    }
  }

  // 이벤트 리스너 초기화
  initEventListeners() {
    // 로그인 폼 제출
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    // 비밀번호 표시/숨김 토글
    const togglePassword = document.getElementById("togglePassword");
    if (togglePassword) {
      togglePassword.addEventListener("click", () => {
        this.togglePasswordVisibility();
      });
    }

    // 로그아웃 버튼 (index.html의 로그아웃 버튼)
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    }

    // 기존 로그아웃 링크
    const logoutLink = document.querySelector('a[href="logout.html"]');
    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    }
  }

  // 사용자 정보 모달 이벤트 리스너 초기화
  initUserInfoEventListeners() {
    // 정보 수정 버튼
    const editUserBtn = document.getElementById("editUserBtn");
    if (editUserBtn) {
      editUserBtn.addEventListener("click", () => {
        this.showEditMode();
      });
    }

    // 수정 취소 버튼
    const cancelEditBtn = document.getElementById("cancelEditBtn");
    if (cancelEditBtn) {
      cancelEditBtn.addEventListener("click", () => {
        this.showDisplayMode();
      });
    }

    // 저장 버튼
    const saveUserBtn = document.getElementById("saveUserBtn");
    if (saveUserBtn) {
      saveUserBtn.addEventListener("click", () => {
        this.saveUserInfo();
      });
    }

    // 수정 모드에서 비밀번호 표시/숨김 토글
    const toggleEditPassword = document.getElementById("toggleEditPassword");
    if (toggleEditPassword) {
      toggleEditPassword.addEventListener("click", () => {
        this.toggleEditPasswordVisibility();
      });
    }
  }

  // 로그인 처리
  async handleLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    if (!username || !password) {
      this.showNotification("아이디와 비밀번호를 모두 입력해주세요.", "warning");
      return;
    }

    // 로딩 상태 표시 (try 블록 밖으로 이동)
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    if (!submitBtn) {
      this.showNotification("로그인 폼을 찾을 수 없습니다.", "danger");
      return;
    }

    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> 로그인 중...';
    submitBtn.disabled = true;

    try {
      // 실제로는 API 호출을 해야 하지만, 여기서는 시뮬레이션
      const loginResult = await this.simulateLoginAPI(username, password);

      // 로그인 성공
      this.isLoggedIn = true;

      // 기존 사용자 정보가 있는지 확인
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = users.find(u => u.username === username);

      if (existingUser) {
        // 기존 사용자 정보 사용
        this.currentUser = {
          ...existingUser,
          password: password, // 비밀번호 추가
          lastLogin: new Date().toISOString()
        };
      } else {
        // 새 사용자 정보 생성
        this.currentUser = {
          id: 1,
          username: username,
          email: `${username}@example.com`,
          name: username,
          role: loginResult.role || "user",
          joinDate: new Date().toISOString().split('T')[0],
          address: "주소를 입력해주세요",
          phone: "전화번호를 입력해주세요",
          password: password
        };

        // 새 사용자를 users 배열에 추가
        users.push(this.currentUser);
        localStorage.setItem("users", JSON.stringify(users));
      }

      // 토큰 및 사용자 정보 저장
      const token = this.generateToken();
      if (rememberMe) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(this.currentUser));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("userRole", loginResult.role || "user");
      } else {
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("userData", JSON.stringify(this.currentUser));
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("userRole", loginResult.role || "user");
      }

      this.showNotification("로그인에 성공했습니다!", "success");

      // 메인 페이지로 리다이렉트
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } catch (error) {
      this.showNotification(error.message, "danger");

      // 버튼 상태 복원
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  // localStorage에서 회원 정보로 로그인 검증
  async simulateLoginAPI(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // 기본 관리자 계정 검증
          if (username === "SSAFY" && password === "1234") {
            resolve({ success: true, role: "admin" });
            return;
          } else if (username === "admin" && password === "admin") {
            resolve({ success: true, role: "admin" });
            return;
          } else if (username === "user" && password === "user") {
            resolve({ success: true, role: "user" });
            return;
          }

          // localStorage에서 회원 정보 검증
          const users = JSON.parse(localStorage.getItem("users") || "[]");
          const user = users.find(u => u.username === username && u.password === password);

          if (user) {
            // 마지막 로그인 시간 업데이트
            user.lastLogin = new Date().toISOString();
            localStorage.setItem("users", JSON.stringify(users));

            resolve({ success: true, role: user.role || "user" });
          } else {
            reject(new Error("아이디 또는 비밀번호가 올바르지 않습니다."));
          }
        } catch (error) {
          reject(new Error("로그인 처리 중 오류가 발생했습니다."));
        }
      }, 1000);
    });
  }

  // 로그아웃 처리
  handleLogout() {
    // 저장된 인증 정보 제거
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userRole");

    this.isLoggedIn = false;
    this.currentUser = null;

    this.showNotification("로그아웃되었습니다.", "info");

    // 현재 페이지가 index.html이면 UI만 업데이트, 아니면 로그인 페이지로 이동
    if (window.location.pathname.includes('index.html')) {
      this.updateUI();
    } else {
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    }
  }

  // 비밀번호 표시/숨김 토글
  togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const toggleBtn = document.getElementById("togglePassword");
    const icon = toggleBtn.querySelector("i");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.className = "fas fa-eye-slash";
      toggleBtn.title = "비밀번호 숨기기";
    } else {
      passwordInput.type = "password";
      icon.className = "fas fa-eye";
      toggleBtn.title = "비밀번호 표시";
    }
  }

  // UI 업데이트
  updateUI() {
    const beforeLogin = document.getElementById("before-login");
    const afterLogin = document.getElementById("after-login");
    const welcomeMessage = document.getElementById("welcome-message");

    if (this.isLoggedIn && this.currentUser) {
      // 로그인된 상태
      if (beforeLogin) beforeLogin.classList.add("d-none");
      if (afterLogin) afterLogin.classList.remove("d-none");

      if (welcomeMessage) {
        welcomeMessage.textContent = this.currentUser.name;
      }

      // 사용자 정보 모달 업데이트
      this.updateUserInfoModal();

      // 관리자 권한에 따른 메뉴 표시/숨김
      this.updateAdminMenu();
    } else {
      // 로그인되지 않은 상태
      if (beforeLogin) beforeLogin.classList.remove("d-none");
      if (afterLogin) afterLogin.classList.add("d-none");

      // 관리자 메뉴 숨김
      this.hideAdminMenu();
    }
  }

  // 관리자 메뉴 업데이트
  updateAdminMenu() {
    const adminOnlyElements = document.querySelectorAll(".admin-only");
    adminOnlyElements.forEach((element) => {
      if (this.currentUser && this.currentUser.role === "admin") {
        element.style.display = "block";
      } else {
        element.style.display = "none";
      }
    });
  }

  // 관리자 메뉴 숨김
  hideAdminMenu() {
    const adminOnlyElements = document.querySelectorAll(".admin-only");
    adminOnlyElements.forEach((element) => {
      element.style.display = "none";
    });
  }

  // 사용자 정보 모달 업데이트
  updateUserInfoModal() {
    if (!this.currentUser) return;

    // 표시 모드 업데이트
    const displayUsername = document.getElementById("display-username");
    const displayPassword = document.getElementById("display-password");
    const displayName = document.getElementById("display-name");
    const displayAddress = document.getElementById("display-address");
    const displayPhone = document.getElementById("display-phone");

    if (displayUsername) displayUsername.textContent = this.currentUser.username || "사용자";
    if (displayPassword) displayPassword.textContent = this.currentUser.password || "비밀번호";
    if (displayName) displayName.textContent = this.currentUser.name || "사용자";
    if (displayAddress) displayAddress.textContent = this.currentUser.address || "주소를 입력해주세요";
    if (displayPhone) displayPhone.textContent = this.currentUser.phone || "전화번호를 입력해주세요";

    // 수정 모드 업데이트
    const editUsername = document.getElementById("edit-username");
    const editName = document.getElementById("edit-name");
    const editAddress = document.getElementById("edit-address");
    const editPhone = document.getElementById("edit-phone");

    if (editUsername) editUsername.value = this.currentUser.username || "";
    if (editName) editName.value = this.currentUser.name || "";
    if (editAddress) editAddress.value = this.currentUser.address || "";
    if (editPhone) editPhone.value = this.currentUser.phone || "";

    // 이벤트 리스너 초기화 (DOM이 준비된 경우에만)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initUserInfoEventListeners();
      });
    } else {
      this.initUserInfoEventListeners();
    }
  }

  // 사용자 프로필 표시
  showUserProfile() {
    const profileModal = `
      <div class="modal fade" id="userProfileModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-user me-2"></i>사용자 프로필
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="text-center mb-3">
                <div class="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style="width: 80px; height: 80px;">
                  <i class="fas fa-user fa-2x text-white"></i>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <strong>아이디:</strong>
                  <p>${this.currentUser.username}</p>
                </div>
                <div class="col-6">
                  <strong>이름:</strong>
                  <p>${this.currentUser.name}</p>
                </div>
                <div class="col-12">
                  <strong>이메일:</strong>
                  <p>${this.currentUser.email}</p>
                </div>
                <div class="col-12">
                  <strong>권한:</strong>
                  <p>${this.currentUser.role === "admin" ? "관리자" : "일반 사용자"}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
              <button type="button" class="btn btn-primary" onclick="auth.showEditProfile()">
                <i class="fas fa-edit me-1"></i>프로필 수정
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // 기존 모달이 있으면 제거
    const existingModal = document.getElementById("userProfileModal");
    if (existingModal) {
      existingModal.remove();
    }

    // 새 모달 추가
    document.body.insertAdjacentHTML("beforeend", profileModal);

    // 모달 표시
    const modal = new bootstrap.Modal(document.getElementById("userProfileModal"));
    modal.show();
  }

  // 프로필 수정 표시
  showEditProfile() {
    this.showNotification("프로필 수정 기능은 준비 중입니다.", "info");
  }

  // 수정 모드로 전환
  showEditMode() {
    const displayDiv = document.getElementById("userInfoDisplay");
    const editDiv = document.getElementById("userInfoEdit");
    const displayButtons = document.getElementById("displayButtons");
    const editButtons = document.getElementById("editButtons");

    if (displayDiv && editDiv && displayButtons && editButtons) {
      displayDiv.style.display = "none";
      editDiv.style.display = "block";
      displayButtons.style.display = "none";
      editButtons.style.display = "block";
    }
  }

  // 표시 모드로 전환
  showDisplayMode() {
    const displayDiv = document.getElementById("userInfoDisplay");
    const editDiv = document.getElementById("userInfoEdit");
    const displayButtons = document.getElementById("displayButtons");
    const editButtons = document.getElementById("editButtons");

    if (displayDiv && editDiv && displayButtons && editButtons) {
      displayDiv.style.display = "block";
      editDiv.style.display = "none";
      displayButtons.style.display = "block";
      editButtons.style.display = "none";
    }
  }

  // 사용자 정보 저장
  async saveUserInfo() {
    const name = document.getElementById("edit-name").value;
    const address = document.getElementById("edit-address").value;
    const phone = document.getElementById("edit-phone").value;
    const newPassword = document.getElementById("edit-password").value;

    if (!name || !address || !phone) {
      this.showNotification("모든 필수 항목을 입력해주세요.", "warning");
      return;
    }

    try {
      // 사용자 정보 업데이트
      this.currentUser.name = name;
      this.currentUser.address = address;
      this.currentUser.phone = phone;

      // 비밀번호 변경이 있는 경우
      if (newPassword) {
        this.currentUser.password = newPassword;
      }

      // localStorage 업데이트
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex(u => u.username === this.currentUser.username);

      if (userIndex !== -1) {
        users[userIndex] = { ...this.currentUser };
        localStorage.setItem("users", JSON.stringify(users));
      }

      // 현재 사용자 정보 업데이트
      localStorage.setItem("userData", JSON.stringify(this.currentUser));
      sessionStorage.setItem("userData", JSON.stringify(this.currentUser));

      this.showNotification("사용자 정보가 성공적으로 업데이트되었습니다.", "success");

      // 표시 모드로 전환하고 모달 업데이트
      this.showDisplayMode();
      this.updateUserInfoModal();

    } catch (error) {
      this.showNotification("사용자 정보 업데이트 중 오류가 발생했습니다.", "danger");
    }
  }

  // 수정 모드에서 비밀번호 표시/숨김 토글
  toggleEditPasswordVisibility() {
    const passwordInput = document.getElementById("edit-password");
    const toggleBtn = document.getElementById("toggleEditPassword");
    const icon = toggleBtn.querySelector("i");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.className = "fas fa-eye-slash";
      toggleBtn.title = "비밀번호 숨기기";
    } else {
      passwordInput.type = "password";
      icon.className = "fas fa-eye";
      toggleBtn.title = "비밀번호 표시";
    }
  }

  // 토큰 생성 (실제로는 서버에서 발급)
  generateToken() {
    return "token_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
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

  // 로그인 상태 확인
  checkAuth() {
    if (!this.isLoggedIn) {
      this.showNotification("로그인이 필요합니다.", "warning");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
      return false;
    }
    return true;
  }

  // 로그인 상태 반환 (외부에서 호출)
  isLoggedIn() {
    return this.isLoggedIn;
  }

  // 현재 사용자 정보 반환 (외부에서 호출)
  getCurrentUser() {
    return this.currentUser;
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
`;
document.head.appendChild(style);

// 인증 매니저 초기화
let auth;

// 데모 사용자 데이터 생성 (테스트용)
function createDemoUsers() {
  const users = [
    {
      id: 1,
      username: "SSAFY",
      password: "1234",
      email: "ssafy@ssafy.com",
      name: "SSAFY",
      role: "admin",
      joinDate: "2025-01-01",
      address: "서울특별시 강남구 역삼동",
      phone: "010-1234-5678"
    },
    {
      id: 2,
      username: "admin",
      password: "admin",
      email: "admin@example.com",
      name: "관리자",
      role: "admin",
      joinDate: "2025-01-01",
      address: "서울특별시 서초구 서초동",
      phone: "010-9876-5432"
    },
    {
      id: 3,
      username: "user",
      password: "user",
      email: "user@example.com",
      name: "일반사용자",
      role: "user",
      joinDate: "2025-01-01",
      address: "서울특별시 마포구 합정동",
      phone: "010-5555-1234"
    }
  ];

  localStorage.setItem("users", JSON.stringify(users));
}

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function () {
  // 데모 사용자 데이터 생성 (처음 실행 시에만)
  if (!localStorage.getItem("users")) {
    createDemoUsers();
  }

  auth = new AuthManager();
  window.auth = auth;
});

// 전역 함수로 노출 (fallback)
window.auth = auth;
