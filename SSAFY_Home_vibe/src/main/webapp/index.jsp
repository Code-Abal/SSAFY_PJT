<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %> <% String root =
request.getContextPath(); %> <%@ include file="/commons/header.jsp" %>

<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HISSAM</title>
  </head>
  <body>
    <!-- Navigation Bar -->
    <nav>
      <div>
        <a href="index.jsp">SSAFY HOME</a>
        <button type="button">메뉴</button>
        <div>
          <ul>
            <li><a href="${root}/map?action=show">지도 보기</a></li>
            <li><a href="#" data-bs-toggle="modal" data-bs-target="#newsModal">부동산 뉴스</a></li>
            <li><a href="#" data-bs-toggle="modal" data-bs-target="#noticeModal">공지사항</a></li>
          </ul>
          <div id="before-login">
            <a href="login.jsp">로그인</a>
            <a href="member_register.jsp">회원가입</a>
          </div>
          <div id="after-login" style="display: none">
            <div>
              <button type="button" data-bs-toggle="dropdown">사용자</button>
              <ul>
                <li><a href="#" data-bs-toggle="modal" data-bs-target="#userInfoModal">내 정보</a></li>
                <li><a href="#" data-bs-toggle="modal" data-bs-target="#favoritesModal">관심 지역</a></li>
                <li class="admin-only" style="display: none"><a href="member_list.jsp">회원관리</a></li>
                <li><a href="#" id="logout-btn">로그아웃</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section>
      <div>
        <div>
          <h1>스마트한 내 집 찾기</h1>
          <p>공공데이터와 카카오맵을 활용한 실시간 부동산 정보 서비스</p>
          <div>
            <input type="text" placeholder="동(예: 도봉동) 또는 아파트 이름으로 검색하세요" />
            <button type="button">지도에서 검색</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section>
      <div>
        <h2>주요 기능</h2>
        <p>SSAFY HOME의 다양한 기능을 확인해보세요</p>
        <div>
          <div>
            <h3>실시간 지도</h3>
            <p>카카오맵을 활용한 실시간 부동산 지도 서비스로 원하는 지역의 매물을 한눈에 확인하세요.</p>
            <a href="${root}/map">지도 보기</a>
          </div>
          <div>
            <h3>시장 분석</h3>
            <p>공공데이터를 기반으로 한 정확한 시장 동향 분석과 실거래가 정보를 제공합니다.</p>
            <a href="#" data-bs-toggle="modal" data-bs-target="#newsModal">뉴스 보기</a>
          </div>
          <div>
            <h3>관심 지역</h3>
            <p>관심 있는 지역을 저장하고 관리하여 원하는 매물을 놓치지 마세요.</p>
            <a href="#" data-bs-toggle="modal" data-bs-target="#favoritesModal">관심 지역</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer>
      <div>
        <div>
          <div>
            <h5>SSAFY HOME</h5>
            <p>공공데이터를 활용한 스마트 부동산 정보 서비스</p>
          </div>
          <div>
            <p>&copy; 2025 SSAFY. All Rights Reserved.</p>
            <small>국토교통부 실거래가 정보 활용</small>
          </div>
        </div>
      </div>
    </footer>

    <!-- News Modal -->
    <div id="newsModal" style="display: none">
      <div>
        <div>
          <div>
            <h5>부동산 뉴스</h5>
            <button type="button">닫기</button>
          </div>
          <div>
            <div>
              <div>
                <h6>서울 아파트 가격 상승세 지속</h6>
                <p>서울 지역 아파트 가격이 지속적으로 상승하고 있으며, 특히 강남권의 상승세가 두드러집니다.</p>
                <small>2025-01-15</small>
              </div>
              <div>
                <h6>부동산 정책 변화 예고</h6>
                <p>정부에서 새로운 부동산 정책을 발표할 예정이며, 시장에 미칠 영향을 분석해보겠습니다.</p>
                <small>2025-01-14</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notice Modal -->
    <div id="noticeModal" style="display: none">
      <div>
        <div>
          <div>
            <h5>공지사항</h5>
            <button type="button">닫기</button>
          </div>
          <div>
            <div>
              <div>
                <h6>서비스 업데이트 안내</h6>
                <p>더 나은 서비스를 위해 시스템을 업데이트했습니다. 새로운 기능들을 확인해보세요.</p>
                <small>2025-01-15</small>
              </div>
              <div>
                <h6>데이터 업데이트 일정</h6>
                <p>실거래가 데이터가 매주 월요일 오전 9시에 업데이트됩니다.</p>
                <small>2025-01-10</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Info Modal -->
    <div id="userInfoModal" style="display: none">
      <div>
        <div>
          <div>
            <h5>내 정보</h5>
            <button type="button">닫기</button>
          </div>
          <div>
            <div id="userInfoDisplay">
              <div>
                <div>
                  <label>아이디</label>
                  <p id="display-username">사용자</p>
                </div>
                <div>
                  <label>비밀번호</label>
                  <p id="display-password">비밀번호</p>
                </div>
                <div>
                  <label>이름</label>
                  <p id="display-name">사용자</p>
                </div>
                <div>
                  <label>주소</label>
                  <p id="display-address">주소를 입력해주세요</p>
                </div>
                <div>
                  <label>전화번호</label>
                  <p id="display-phone">전화번호를 입력해주세요</p>
                </div>
              </div>
            </div>
            <div id="userInfoEdit" style="display: none">
              <form id="userEditForm">
                <div>
                  <div>
                    <label for="edit-username">아이디</label>
                    <input type="text" id="edit-username" readonly />
                  </div>
                  <div>
                    <label for="edit-name">이름</label>
                    <input type="text" id="edit-name" required />
                  </div>
                  <div>
                    <label for="edit-address">주소</label>
                    <input type="text" id="edit-address" required />
                  </div>
                  <div>
                    <label for="edit-phone">전화번호</label>
                    <input type="tel" id="edit-phone" required />
                  </div>
                  <div>
                    <label for="edit-password">새 비밀번호</label>
                    <input type="password" id="edit-password" placeholder="변경하지 않으려면 비워두세요" />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div>
            <div id="displayButtons">
              <button type="button">닫기</button>
              <button type="button" id="editUserBtn">정보 수정</button>
            </div>
            <div id="editButtons" style="display: none">
              <button type="button" id="cancelEditBtn">취소</button>
              <button type="button" id="saveUserBtn">저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Favorites Modal -->
    <div id="favoritesModal" style="display: none">
      <div>
        <div>
          <div>
            <h5>관심 지역</h5>
            <button type="button">닫기</button>
          </div>
          <div>
            <div>
              <div>
                <span>강남구 역삼동</span>
                <button type="button">삭제</button>
              </div>
              <div>
                <span>서초구 서초동</span>
                <button type="button">삭제</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
