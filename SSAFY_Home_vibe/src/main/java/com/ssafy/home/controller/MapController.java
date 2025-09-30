package com.ssafy.home.controller;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/map/show")
public class MapController extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // 실제 서비스에서는 web.xml 또는 환경변수에서 읽어오는 것이 안전합니다.
    private static final String KAKAO_MAP_KEY = "fa616dfbdd589d3c53f274115351ca72"; // TODO: 실제 키로 교체

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setAttribute("kakaoMapKey", KAKAO_MAP_KEY);
        request.getRequestDispatcher("/map/map.jsp").forward(request, response);
    }
}
