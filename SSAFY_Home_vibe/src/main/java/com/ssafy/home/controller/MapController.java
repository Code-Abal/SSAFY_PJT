package com.ssafy.home.controller;

import java.io.IOException;


import java.util.List;
import com.ssafy.home.model.DongCodeDto;
import com.ssafy.home.model.service.HomeService;
import com.ssafy.home.model.service.HomeServiceImpl;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/map")
public class MapController extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // 실제 서비스에서는 web.xml 또는 환경변수에서 읽어오는 것이 안전합니다.
    private static final String KAKAO_MAP_KEY = "fa616dfbdd589d3c53f274115351ca72"; // TODO: 실제 키로 교체

    private static HomeService homeService = HomeServiceImpl.getInstance();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");

        if("show".equals(action)) {
            showMap(request, response);
        } else if("show_section".equals(action)) {
            show_section(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }   
        
        //request.setAttribute("kakaoMapKey", KAKAO_MAP_KEY);

    }

    // 검색 조건에서 선택된 시도, 구군을 기반으로 시점 이동?
    private void show_section(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String sido = request.getParameter("sido");
        String gugun = request.getParameter("gugun");
        String dong = request.getParameter("dong");
        
        request.getRequestDispatcher("/map?action=show").forward(request, response);
    }

    private void showMap(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            List<DongCodeDto> dongList = homeService.listDongCodes();
            request.setAttribute("dongList", dongList);
        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("dongList", null);
        }
        request.getRequestDispatcher("/map/map.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }
}
