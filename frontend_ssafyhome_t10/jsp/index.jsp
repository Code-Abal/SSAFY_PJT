<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> <%@ include
file="/jsp/header.jsp" %>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Index Page</title>
    <!-- 필요한 CSS/JS 링크를 여기에 추가 -->
    <link rel="stylesheet" href="${root}/css/styles.css" />
    <link rel="stylesheet" href="${root}/css/home.css" />
  </head>
  <body>
    <h1>Welcome to SSAFY Home JSP Index</h1>
    <form action="${root}/jsp/login.jsp" method="post">
      <button type="submit">로그인</button>
    </form>
  </body>
</html>
