// 회원관리 시스템 JavaScript

class MemberManagement {
    constructor() {
        this.members = [];
        this.init();
    }

    // 초기화
    init() {
        this.loadMembers();
        this.updateStats();
        this.renderMemberTable();
        this.checkAdminAuth();
    }

    // 관리자 권한 확인
    checkAdminAuth() {
        const userData = localStorage.getItem("userData") || sessionStorage.getItem("userData");
        if (!userData) {
            this.showNotification("로그인이 필요합니다.", "warning");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
            return;
        }

        const user = JSON.parse(userData);
        if (user.role !== "admin") {
            this.showNotification("관리자 권한이 필요합니다.", "danger");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
            return;
        }
    }

    // 회원 목록 로드
    loadMembers() {
        this.members = JSON.parse(localStorage.getItem("users") || "[]");

        // 데모 데이터가 없으면 생성
        if (this.members.length === 0) {
            this.createDemoMembers();
        }
    }

    // 데모 회원 데이터 생성
    createDemoMembers() {
        const demoMembers = [
            {
                id: 1,
                username: "SSAFY",
                password: "1234",
                email: "ssafy@ssafy.com",
                name: "SSAFY",
                role: "admin",
                joinDate: "2025-01-01",
                address: "서울특별시 강남구 역삼동",
                phone: "010-1234-5678",
                status: "active"
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
                phone: "010-9876-5432",
                status: "active"
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
                phone: "010-5555-1234",
                status: "active"
            }
        ];

        this.members = demoMembers;
        localStorage.setItem("users", JSON.stringify(this.members));
    }

    // 통계 업데이트
    updateStats() {
        const totalMembers = this.members.length;
        const activeMembers = this.members.filter(m => m.status === "active").length;
        const newMembers = this.members.filter(m => {
            const joinDate = new Date(m.joinDate);
            const now = new Date();
            const diffDays = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
        }).length;
        const adminMembers = this.members.filter(m => m.role === "admin").length;

        document.getElementById("totalMembers").textContent = totalMembers;
        document.getElementById("activeMembers").textContent = activeMembers;
        document.getElementById("newMembers").textContent = newMembers;
        document.getElementById("adminMembers").textContent = adminMembers;
    }

    // 회원 테이블 렌더링
    renderMemberTable() {
        const tbody = document.getElementById("memberTableBody");
        tbody.innerHTML = "";

        this.members.forEach((member, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${index + 1}</td>
        <td>${member.username}</td>
        <td>${member.name}</td>
        <td>${member.email}</td>
        <td>
          <span class="badge ${member.role === 'admin' ? 'bg-danger' : 'bg-primary'}">
            ${member.role === 'admin' ? '관리자' : '일반사용자'}
          </span>
        </td>
        <td>${member.joinDate}</td>
        <td>
          <span class="badge ${member.status === 'active' ? 'bg-success' : 'bg-secondary'}">
            ${member.status === 'active' ? '활성' : '비활성'}
          </span>
        </td>
        <td>
          <div class="btn-group btn-group-sm" role="group">
            <button type="button" class="btn btn-outline-info" onclick="memberManagement.viewMember(${member.id})" title="상세보기">
              <i class="bi bi-eye"></i>
            </button>
            <button type="button" class="btn btn-outline-warning" onclick="memberManagement.editMember(${member.id})" title="수정">
              <i class="bi bi-pencil"></i>
            </button>
            <button type="button" class="btn btn-outline-danger" onclick="memberManagement.deleteMember(${member.id})" title="삭제">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
            tbody.appendChild(row);
        });
    }

    // 회원 상세보기
    viewMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;

        const modal = `
      <div class="modal fade" id="viewMemberModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="bi bi-person-circle me-2"></i>회원 상세정보
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">아이디</label>
                  <p class="form-control-plaintext">${member.username}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">이름</label>
                  <p class="form-control-plaintext">${member.name}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">이메일</label>
                  <p class="form-control-plaintext">${member.email}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">역할</label>
                  <p class="form-control-plaintext">
                    <span class="badge ${member.role === 'admin' ? 'bg-danger' : 'bg-primary'}">
                      ${member.role === 'admin' ? '관리자' : '일반사용자'}
                    </span>
                  </p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">주소</label>
                  <p class="form-control-plaintext">${member.address}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">전화번호</label>
                  <p class="form-control-plaintext">${member.phone}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">가입일</label>
                  <p class="form-control-plaintext">${member.joinDate}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">상태</label>
                  <p class="form-control-plaintext">
                    <span class="badge ${member.status === 'active' ? 'bg-success' : 'bg-secondary'}">
                      ${member.status === 'active' ? '활성' : '비활성'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
              <button type="button" class="btn btn-warning" onclick="memberManagement.editMember(${member.id})">
                <i class="bi bi-pencil me-1"></i>수정
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

        // 기존 모달 제거
        const existingModal = document.getElementById("viewMemberModal");
        if (existingModal) {
            existingModal.remove();
        }

        // 새 모달 추가
        document.body.insertAdjacentHTML("beforeend", modal);

        // 모달 표시
        const modalInstance = new bootstrap.Modal(document.getElementById("viewMemberModal"));
        modalInstance.show();
    }

    // 회원 수정
    editMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;

        const modal = `
      <div class="modal fade" id="editMemberModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="bi bi-pencil-square me-2"></i>회원정보 수정
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="editMemberForm">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="edit-username" class="form-label">아이디</label>
                    <input type="text" class="form-control" id="edit-username" value="${member.username}" readonly>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="edit-name" class="form-label">이름</label>
                    <input type="text" class="form-control" id="edit-name" value="${member.name}" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="edit-email" class="form-label">이메일</label>
                    <input type="email" class="form-control" id="edit-email" value="${member.email}" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="edit-role" class="form-label">역할</label>
                    <select class="form-select" id="edit-role" required>
                      <option value="user" ${member.role === 'user' ? 'selected' : ''}>일반사용자</option>
                      <option value="admin" ${member.role === 'admin' ? 'selected' : ''}>관리자</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="edit-address" class="form-label">주소</label>
                    <input type="text" class="form-control" id="edit-address" value="${member.address}" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="edit-phone" class="form-label">전화번호</label>
                    <input type="tel" class="form-control" id="edit-phone" value="${member.phone}" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="edit-status" class="form-label">상태</label>
                    <select class="form-select" id="edit-status" required>
                      <option value="active" ${member.status === 'active' ? 'selected' : ''}>활성</option>
                      <option value="inactive" ${member.status === 'inactive' ? 'selected' : ''}>비활성</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="edit-password" class="form-label">새 비밀번호</label>
                    <input type="password" class="form-control" id="edit-password" placeholder="변경하지 않으려면 비워두세요">
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
              <button type="button" class="btn btn-primary" onclick="memberManagement.saveMemberEdit(${member.id})">
                <i class="bi bi-check me-1"></i>저장
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

        // 기존 모달 제거
        const existingModal = document.getElementById("editMemberModal");
        if (existingModal) {
            existingModal.remove();
        }

        // 새 모달 추가
        document.body.insertAdjacentHTML("beforeend", modal);

        // 모달 표시
        const modalInstance = new bootstrap.Modal(document.getElementById("editMemberModal"));
        modalInstance.show();
    }

    // 회원 수정 저장
    saveMemberEdit(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;

        const name = document.getElementById("edit-name").value;
        const email = document.getElementById("edit-email").value;
        const role = document.getElementById("edit-role").value;
        const address = document.getElementById("edit-address").value;
        const phone = document.getElementById("edit-phone").value;
        const status = document.getElementById("edit-status").value;
        const newPassword = document.getElementById("edit-password").value;

        if (!name || !email || !address || !phone) {
            this.showNotification("모든 필수 항목을 입력해주세요.", "warning");
            return;
        }

        // 회원 정보 업데이트
        member.name = name;
        member.email = email;
        member.role = role;
        member.address = address;
        member.phone = phone;
        member.status = status;

        if (newPassword) {
            member.password = newPassword;
        }

        // localStorage 업데이트
        localStorage.setItem("users", JSON.stringify(this.members));

        // 모달 닫기
        const modal = bootstrap.Modal.getInstance(document.getElementById("editMemberModal"));
        modal.hide();

        // 테이블 및 통계 업데이트
        this.renderMemberTable();
        this.updateStats();

        this.showNotification("회원정보가 성공적으로 수정되었습니다.", "success");
    }

    // 회원 삭제
    deleteMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;

        // 현재 로그인한 사용자 확인
        const currentUser = JSON.parse(localStorage.getItem("userData") || sessionStorage.getItem("userData") || "{}");

        // 자기 자신을 삭제하려는 경우
        if (currentUser.username === member.username) {
            this.showNotification("자기 자신을 삭제할 수 없습니다.", "warning");
            return;
        }

        if (confirm(`정말로 '${member.name}' 회원을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
            // 회원 삭제
            this.members = this.members.filter(m => m.id !== memberId);

            // localStorage 업데이트
            localStorage.setItem("users", JSON.stringify(this.members));

            // 테이블 및 통계 업데이트
            this.renderMemberTable();
            this.updateStats();

            this.showNotification("회원이 성공적으로 삭제되었습니다.", "success");
        }
    }

    // 회원 검색
    searchMembers() {
        const searchTerm = document.getElementById("searchInput").value.toLowerCase();
        const roleFilter = document.getElementById("roleFilter").value;
        const statusFilter = document.getElementById("statusFilter").value;

        let filteredMembers = this.members.filter(member => {
            // 검색어 필터
            const matchesSearch =
                member.username.toLowerCase().includes(searchTerm) ||
                member.name.toLowerCase().includes(searchTerm) ||
                member.email.toLowerCase().includes(searchTerm) ||
                member.phone.includes(searchTerm);

            // 역할 필터
            const matchesRole = !roleFilter || member.role === roleFilter;

            // 상태 필터
            const matchesStatus = !statusFilter || member.status === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });

        this.renderFilteredMemberTable(filteredMembers);
    }

    // 역할별 필터링
    filterByRole() {
        this.searchMembers();
    }

    // 상태별 필터링
    filterByStatus() {
        this.searchMembers();
    }

    // 필터링된 회원 테이블 렌더링
    renderFilteredMemberTable(filteredMembers) {
        const tbody = document.getElementById("memberTableBody");
        tbody.innerHTML = "";

        if (filteredMembers.length === 0) {
            tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-muted py-4">
            <i class="bi bi-search fs-1 d-block mb-2"></i>
            검색 결과가 없습니다.
          </td>
        </tr>
      `;
            return;
        }

        filteredMembers.forEach((member, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${index + 1}</td>
        <td>${member.username}</td>
        <td>${member.name}</td>
        <td>${member.email}</td>
        <td>
          <span class="badge ${member.role === 'admin' ? 'bg-danger' : 'bg-primary'}">
            ${member.role === 'admin' ? '관리자' : '일반사용자'}
          </span>
        </td>
        <td>${member.joinDate}</td>
        <td>
          <span class="badge ${member.status === 'active' ? 'bg-success' : 'bg-secondary'}">
            ${member.status === 'active' ? '활성' : '비활성'}
          </span>
        </td>
        <td>
          <div class="btn-group btn-group-sm" role="group">
            <button type="button" class="btn btn-outline-info" onclick="memberManagement.viewMember(${member.id})" title="상세보기">
              <i class="bi bi-eye"></i>
            </button>
            <button type="button" class="btn btn-outline-warning" onclick="memberManagement.editMember(${member.id})" title="수정">
              <i class="bi bi-pencil"></i>
            </button>
            <button type="button" class="btn btn-outline-danger" onclick="memberManagement.deleteMember(${member.id})" title="삭제">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
            tbody.appendChild(row);
        });
    }

    // 회원 목록 새로고침
    refreshMemberList() {
        this.loadMembers();
        this.updateStats();
        this.renderMemberTable();
        this.showNotification("회원 목록이 새로고침되었습니다.", "info");
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

// 전역 함수들
function openMemberRegistration() {
    window.location.href = "member_register.html";
}

function openMemberEdit() {
    // 회원 목록에서 수정 버튼을 사용하도록 안내
    memberManagement.showNotification("회원 목록에서 수정하고 싶은 회원의 수정 버튼을 클릭하세요.", "info");
}

function openMemberDelete() {
    // 회원 목록에서 삭제 버튼을 사용하도록 안내
    memberManagement.showNotification("회원 목록에서 삭제하고 싶은 회원의 삭제 버튼을 클릭하세요.", "info");
}

function openMemberSearch() {
    // 검색 기능 구현
    const searchModal = `
    <div class="modal fade" id="searchMemberModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-search me-2"></i>회원 검색
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="searchInput" class="form-label">검색어</label>
              <input type="text" class="form-control" id="searchInput" 
                     placeholder="아이디, 이름, 이메일, 전화번호로 검색">
            </div>
            <div class="d-grid">
              <button type="button" class="btn btn-primary" onclick="memberManagement.searchMembers()">
                <i class="bi bi-search me-1"></i>검색
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
            <button type="button" class="btn btn-outline-secondary" onclick="memberManagement.renderMemberTable()">
              전체 목록 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

    // 기존 모달 제거
    const existingModal = document.getElementById("searchMemberModal");
    if (existingModal) {
        existingModal.remove();
    }

    // 새 모달 추가
    document.body.insertAdjacentHTML("beforeend", searchModal);

    // 모달 표시
    const modalInstance = new bootstrap.Modal(document.getElementById("searchMemberModal"));
    modalInstance.show();
}

function refreshMemberList() {
    memberManagement.refreshMemberList();
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

// 회원관리 시스템 초기화
let memberManagement;

document.addEventListener('DOMContentLoaded', function () {
    memberManagement = new MemberManagement();
    window.memberManagement = memberManagement;
});
