// SSAFY HOME - 홈 화면 JavaScript

class HomeManager {
    constructor() {
        this.authManager = null;
        this.init();
    }

    init() {
        this.initAuthManager();
        this.initEventListeners();
        this.updateUI();
    }

    // 인증 매니저 초기화
    initAuthManager() {
        // 기존 auth.js의 AuthManager 인스턴스 사용
        if (window.auth) {
            this.authManager = window.auth;
        } else {
            // AuthManager가 없으면 새로 생성
            this.authManager = new AuthManager();
        }
    }

    // 이벤트 리스너 초기화
    initEventListeners() {
        // 히어로 검색 버튼
        const heroSearchBtn = document.getElementById('hero-search-btn');
        if (heroSearchBtn) {
            heroSearchBtn.addEventListener('click', () => {
                this.handleHeroSearch();
            });
        }

        // 히어로 검색 입력 필드 (Enter 키)
        const heroSearchInput = document.getElementById('hero-search');
        if (heroSearchInput) {
            heroSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleHeroSearch();
                }
            });
        }

        // 로그아웃 버튼
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // 모달 이벤트 초기화
        this.initModalEvents();
    }

    // 히어로 검색 처리
    handleHeroSearch() {
        const searchTerm = document.getElementById('hero-search').value.trim();
        if (!searchTerm) {
            this.showNotification('검색어를 입력해주세요.', 'warning');
            return;
        }

        // 검색어를 URL 파라미터로 전달하여 지도 페이지로 이동
        const searchParams = new URLSearchParams();
        searchParams.set('search', searchTerm);
        window.location.href = `map.html?${searchParams.toString()}`;
    }

    // 로그아웃 처리
    handleLogout() {
        if (this.authManager) {
            this.authManager.handleLogout();
        }
    }

    // UI 업데이트
    updateUI() {
        if (this.authManager) {
            this.authManager.updateUI();
        }
    }

    // 모달 이벤트 초기화
    initModalEvents() {
        // 사용자 정보 모달
        const userInfoModal = document.getElementById('userInfoModal');
        if (userInfoModal) {
            userInfoModal.addEventListener('shown.bs.modal', () => {
                this.updateUserInfo();
            });
        }

        // 관심 지역 모달
        const favoritesModal = document.getElementById('favoritesModal');
        if (favoritesModal) {
            favoritesModal.addEventListener('shown.bs.modal', () => {
                this.loadFavorites();
            });
        }
    }

    // 사용자 정보 업데이트
    updateUserInfo() {
        if (!this.authManager || !this.authManager.isLoggedIn()) {
            return;
        }

        const user = this.authManager.getCurrentUser();
        if (user) {
            const userName = document.getElementById('user-name');
            const userEmail = document.getElementById('user-email');
            const userJoinDate = document.getElementById('user-join-date');

            if (userName) userName.textContent = user.name || '사용자';
            if (userEmail) userEmail.textContent = user.email || 'user@example.com';
            if (userJoinDate) userJoinDate.textContent = user.joinDate || '2025-01-01';
        }
    }

    // 관심 지역 로드
    loadFavorites() {
        // 실제 구현에서는 서버에서 관심 지역 데이터를 가져옴
        console.log('관심 지역 로드');
    }

    // 알림 표시
    showNotification(message, type = 'info') {
        // Bootstrap 토스트 또는 알림 컴포넌트 사용
        const alertClass = `alert-${type}`;
        const alertHtml = `
            <div class="alert ${alertClass} alert-dismissible fade show position-fixed" 
                 style="top: 20px; right: 20px; z-index: 9999;" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', alertHtml);

        // 3초 후 자동 제거
        setTimeout(() => {
            const alert = document.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 3000);
    }
}

// 페이지 로드 시 HomeManager 초기화
document.addEventListener('DOMContentLoaded', function () {
    window.homeManager = new HomeManager();
});

// 전역 함수로 노출
window.HomeManager = HomeManager;
