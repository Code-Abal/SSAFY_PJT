package com.ssafy.home.controller;

import java.io.IOException;
import java.util.List;

import com.ssafy.home.model.DongCodeDto;
import com.ssafy.home.model.service.HomeServiceImpl;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/dongcode")
public class HomeController extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String action = request.getParameter("action");
		String path = "/index.jsp";
		try {
			if ("list".equals(action)) {
				List<DongCodeDto> list = HomeServiceImpl.getInstance().listDongCodes();
				request.setAttribute("dongcodes", list);
				path = "/dong/list.jsp";
			} else if ("view".equals(action)) {
				String dongCode = request.getParameter("dongCode");
				DongCodeDto dto = HomeServiceImpl.getInstance().getDongCode(dongCode);
				request.setAttribute("dongcode", dto);
				path = "/dong/view.jsp";
			}
		} catch (Exception e) {
			e.printStackTrace();
			path = "/error/error.jsp";
		}
		RequestDispatcher dispatcher = request.getRequestDispatcher(path);
		dispatcher.forward(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
}
