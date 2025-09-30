// 부동산 웹페이지 회원가입 관련 JavaScript

class MemberManager {
  constructor() {
    this.init();
  }

  init() {
    this.initEventListeners();
    this.initValidation();
  }

  // 이벤트 리스너 초기화
  initEventListeners() {
    // 회원가입 폼 제출
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleRegister();
      });
    }

    // 아이디 중복확인
    const checkUsernameBtn = document.getElementById("checkUsername");
    if (checkUsernameBtn) {
      checkUsernameBtn.addEventListener("click", () => {
        this.checkUsername();
      });
    }

    // 비밀번호 표시/숨김 토글
    const togglePasswordBtns = document.querySelectorAll(".togglePassword");
    togglePasswordBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.togglePasswordVisibility(e.target);
      });
    });

    // 모든 약관 동의 체크박스
    const agreeAllCheckbox = document.getElementById("agreeAll");
    if (agreeAllCheckbox) {
      agreeAllCheckbox.addEventListener("change", () => {
        this.toggleAllAgreements();
      });
    }

    // 주소 검색
    const searchAddressBtn = document.getElementById("searchAddress");
    if (searchAddressBtn) {
      searchAddressBtn.addEventListener("click", () => {
        this.searchAddress();
      });
    }
  }

  // 유효성 검사 초기화
  initValidation() {
    // 실시간 유효성 검사
    const inputs = document.querySelectorAll("#registerForm input, #registerForm select");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        this.validateField(input);
      });
    });
  }

  // 아이디 중복확인
  async checkUsername() {
    const username = document.getElementById("username").value;
    const checkBtn = document.getElementById("checkUsername");

    if (!username) {
      this.showNotification("아이디를 입력해주세요.", "warning");
      return;
    }

    if (username.length < 4 || username.length > 20) {
      this.showNotification("아이디는 4-20자 사이여야 합니다.", "warning");
      return;
    }

    // 아이디 형식 검사 (영문, 숫자만)
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      this.showNotification("아이디는 영문과 숫자만 사용 가능합니다.", "warning");
      return;
    }

    try {
      checkBtn.disabled = true;
      checkBtn.innerHTML = "확인 중...";

      // 실제로는 API 호출을 해야 하지만, 여기서는 시뮬레이션
      await this.simulateUsernameCheck(username);

      // 중복되지 않은 경우
      checkBtn.innerHTML = "사용 가능";
      checkBtn.className = "btn btn-success btn-sm";
      checkBtn.disabled = true;

      // 아이디 입력 필드에 사용 가능 표시
      const usernameInput = document.getElementById("username");
      usernameInput.classList.add("is-valid");
      usernameInput.classList.remove("is-invalid");

      this.showNotification("사용 가능한 아이디입니다.", "success");
    } catch (error) {
      // 중복된 경우
      checkBtn.innerHTML = "중복확인";
      checkBtn.className = "btn btn-outline-secondary btn-sm";
      checkBtn.disabled = false;

      const usernameInput = document.getElementById("username");
      usernameInput.classList.add("is-invalid");
      usernameInput.classList.remove("is-valid");

      this.showNotification(error.message, "danger");
    }
  }

  // localStorage에서 아이디 중복확인
  async simulateUsernameCheck(username) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // localStorage에서 기존 회원 목록 가져오기
          const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

          // 기본 관리자 계정들도 확인
          const defaultAccounts = ["admin", "user", "SSAFY"];

          // 중복 확인
          const isDuplicate = existingUsers.some(user => user.username === username) ||
            defaultAccounts.includes(username);

          if (isDuplicate) {
            reject(new Error("이미 사용 중인 아이디입니다."));
          } else {
            resolve({ available: true });
          }
        } catch (error) {
          reject(new Error("아이디 확인 중 오류가 발생했습니다."));
        }
      }, 500); // 응답 시간 단축
    });
  }

  // 회원가입 처리
  async handleRegister() {
    // 폼 데이터 수집
    const formData = this.collectFormData();

    // 유효성 검사
    if (!this.validateForm(formData)) {
      return;
    }

    try {
      // 로딩 상태 표시
      const submitBtn = document.querySelector('#registerForm button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>가입 중...';
      submitBtn.disabled = true;

      // localStorage에 회원 정보 저장
      const success = await this.saveMemberToStorage(formData);

      if (success) {
        this.showNotification("회원가입이 완료되었습니다!", "success");

        // 로그인 페이지로 리다이렉트
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        throw new Error("회원가입 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      this.showNotification(error.message, "danger");

      // 버튼 상태 복원
      const submitBtn = document.querySelector('#registerForm button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    }
  }

  // 폼 데이터 수집
  collectFormData() {
    const form = document.getElementById("registerForm");
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    return data;
  }

  // 폼 유효성 검사
  validateForm(data) {
    // 필수 필드 검사
    const requiredFields = ["username", "email", "password", "confirmPassword", "name", "phone"];
    for (let field of requiredFields) {
      if (!data[field] || data[field].trim() === "") {
        this.showNotification(`${this.getFieldLabel(field)}을(를) 입력해주세요.`, "warning");
        return false;
      }
    }

    // 비밀번호 확인
    if (data.password !== data.confirmPassword) {
      this.showNotification("비밀번호가 일치하지 않습니다.", "warning");
      return false;
    }

    // 비밀번호 강도 검사
    if (data.password.length < 8) {
      this.showNotification("비밀번호는 8자 이상이어야 합니다.", "warning");
      return false;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      this.showNotification("올바른 이메일 형식을 입력해주세요.", "warning");
      return false;
    }

    // 전화번호 형식 검사
    const phoneRegex = /^01[0-9]-\d{4}-\d{4}$/;
    if (!phoneRegex.test(data.phone)) {
      this.showNotification("올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)", "warning");
      return false;
    }

    // 약관 동의 검사
    const agreeTerms = document.getElementById("agreeTerms");
    const agreePrivacy = document.getElementById("agreePrivacy");

    if (!agreeTerms.checked || !agreePrivacy.checked) {
      this.showNotification("필수 약관에 동의해주세요.", "warning");
      return false;
    }

    return true;
  }

  // 필드 라벨 가져오기
  getFieldLabel(fieldName) {
    const labels = {
      username: "아이디",
      email: "이메일",
      password: "비밀번호",
      confirmPassword: "비밀번호 확인",
      name: "이름",
      phone: "전화번호",
    };
    return labels[fieldName] || fieldName;
  }

  // localStorage에 회원 정보 저장
  async saveMemberToStorage(formData) {
    try {
      // 기존 회원 목록 가져오기
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

      // 아이디 중복 확인
      const isDuplicate = existingUsers.some(user => user.username === formData.username);
      if (isDuplicate) {
        throw new Error("이미 사용 중인 아이디입니다.");
      }

      // 이메일 중복 확인
      const isEmailDuplicate = existingUsers.some(user => user.email === formData.email);
      if (isEmailDuplicate) {
        throw new Error("이미 사용 중인 이메일입니다.");
      }

      // 새 회원 정보 생성
      const newUser = {
        id: Date.now(), // 고유 ID 생성
        username: formData.username,
        password: formData.password, // 실제로는 해시화해야 함
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        birthDate: formData.birthDate || null,
        gender: formData.gender || null,
        postcode: formData.postcode || null,
        address: formData.address || null,
        detailAddress: formData.detailAddress || null,
        role: "user", // 기본 역할
        joinDate: new Date().toISOString().split('T')[0],
        agreeMarketing: document.getElementById("agreeMarketing").checked,
        isActive: true,
        lastLogin: null
      };

      // 회원 목록에 추가
      existingUsers.push(newUser);

      // localStorage에 저장
      localStorage.setItem("users", JSON.stringify(existingUsers));

      // 회원가입 성공 로그
      console.log("새 회원 가입:", newUser);

      return true;
    } catch (error) {
      console.error("회원 저장 오류:", error);
      throw error;
    }
  }

  // localStorage에서 회원 정보 조회
  getUsersFromStorage() {
    try {
      return JSON.parse(localStorage.getItem("users") || "[]");
    } catch (error) {
      console.error("회원 정보 조회 오류:", error);
      return [];
    }
  }

  // 특정 회원 정보 조회
  getUserByUsername(username) {
    const users = this.getUsersFromStorage();
    return users.find(user => user.username === username);
  }

  // 회원 정보 업데이트
  updateUserInStorage(userId, updatedData) {
    try {
      const users = this.getUsersFromStorage();
      const userIndex = users.findIndex(user => user.id === userId);

      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        localStorage.setItem("users", JSON.stringify(users));
        return true;
      }
      return false;
    } catch (error) {
      console.error("회원 정보 업데이트 오류:", error);
      return false;
    }
  }

  // 회원 삭제
  deleteUserFromStorage(userId) {
    try {
      const users = this.getUsersFromStorage();
      const filteredUsers = users.filter(user => user.id !== userId);
      localStorage.setItem("users", JSON.stringify(filteredUsers));
      return true;
    } catch (error) {
      console.error("회원 삭제 오류:", error);
      return false;
    }
  }

  // 모든 약관 동의 토글
  toggleAllAgreements() {
    const agreeAll = document.getElementById("agreeAll");
    const agreeTerms = document.getElementById("agreeTerms");
    const agreePrivacy = document.getElementById("agreePrivacy");
    const agreeMarketing = document.getElementById("agreeMarketing");

    if (agreeAll.checked) {
      agreeTerms.checked = true;
      agreePrivacy.checked = true;
      agreeMarketing.checked = true;
    } else {
      agreeTerms.checked = false;
      agreePrivacy.checked = false;
      agreeMarketing.checked = false;
    }
  }

  // 주소 검색 (카카오 주소 API 시뮬레이션)
  searchAddress() {
    // 실제로는 카카오 주소 API를 사용해야 합니다
    this.showNotification("주소 검색 기능은 준비 중입니다.", "info");

    // 시뮬레이션용 주소 데이터
    const sampleAddresses = [
      { postcode: "12345", address: "서울시 강남구 역삼동 123-45" },
      { postcode: "12346", address: "서울시 강남구 역삼동 123-46" },
      { postcode: "12347", address: "서울시 강남구 역삼동 123-47" },
    ];

    // 주소 선택 모달 표시
    this.showAddressModal(sampleAddresses);
  }

  // 주소 선택 모달 표시
  showAddressModal(addresses) {
    const modal = `
      <div class="modal fade" id="addressModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">주소 선택</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="list-group">
                ${addresses
        .map(
          (addr) => `
                  <button type="button" class="list-group-item list-group-item-action" 
                          onclick="member.selectAddress('${addr.postcode}', '${addr.address}')">
                    <div class="fw-bold">${addr.address}</div>
                    <small class="text-muted">우편번호: ${addr.postcode}</small>
                  </button>
                `
        )
        .join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // 기존 모달이 있으면 제거
    const existingModal = document.getElementById("addressModal");
    if (existingModal) {
      existingModal.remove();
    }

    // 새 모달 추가
    document.body.insertAdjacentHTML("beforeend", modal);

    // 모달 표시
    const addressModal = new bootstrap.Modal(document.getElementById("addressModal"));
    addressModal.show();
  }

  // 주소 선택
  selectAddress(postcode, address) {
    document.getElementById("postcode").value = postcode;
    document.getElementById("address").value = address;

    // 모달 닫기
    const modal = bootstrap.Modal.getInstance(document.getElementById("addressModal"));
    modal.hide();

    this.showNotification("주소가 선택되었습니다.", "success");
  }

  // 비밀번호 표시/숨김 토글
  togglePasswordVisibility(button) {
    const passwordInput = button.previousElementSibling;
    const icon = button.querySelector("i");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.className = "fas fa-eye-slash";
      button.title = "비밀번호 숨기기";
    } else {
      passwordInput.type = "password";
      icon.className = "fas fa-eye";
      button.title = "비밀번호 표시";
    }
  }

  // 필드 유효성 검사
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;

    // 필수 필드 검사
    if (field.hasAttribute("required") && !value) {
      field.classList.add("is-invalid");
      field.classList.remove("is-valid");
      return false;
    }

    // 특정 필드별 검사
    switch (fieldName) {
      case "username":
        if (value && (value.length < 4 || value.length > 20)) {
          field.classList.add("is-invalid");
          field.classList.remove("is-valid");
          return false;
        }
        break;
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          field.classList.add("is-invalid");
          field.classList.remove("is-valid");
          return false;
        }
        break;
      case "phone":
        if (value && !/^01[0-9]-\d{4}-\d{4}$/.test(value)) {
          field.classList.add("is-invalid");
          field.classList.remove("is-valid");
          return false;
        }
        break;
    }

    // 유효한 경우
    if (value) {
      field.classList.add("is-valid");
      field.classList.remove("is-invalid");
    }

    return true;
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
  
  .form-control.is-valid {
    border-color: #198754;
    padding-right: calc(1.5em + 0.75rem);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right calc(0.375em + 0.1875rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
  }
  
  .form-control.is-invalid {
    border-color: #dc3545;
    padding-right: calc(1.5em + 0.75rem);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath d='m5.8 4.6 1.4 1.4m0-1.4-1.4 1.4'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right calc(0.375em + 0.1875rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
  }
`;
document.head.appendChild(style);

// 회원 매니저 초기화
let member;
window.onload = function () {
  member = new MemberManager();
};

// 전역 함수로 노출
window.member = member;
