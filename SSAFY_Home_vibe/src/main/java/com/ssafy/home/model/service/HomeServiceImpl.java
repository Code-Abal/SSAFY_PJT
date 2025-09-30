package com.ssafy.home.model.service;

import java.util.List;

import com.ssafy.home.model.DongCodeDto;
import com.ssafy.home.model.dao.HomeDao;
import com.ssafy.home.model.dao.HomeDaoImpl;

public class HomeServiceImpl implements HomeService {

	private static HomeService instance = new HomeServiceImpl();
	private HomeDao homeDao;

	private HomeServiceImpl() {
		homeDao = HomeDaoImpl.getInstance();
	}

	public static HomeService getInstance() {
		return instance;
	}

	// 동코드 전체 조회
	@Override
	public List<DongCodeDto> listDongCodes() throws Exception {
		return homeDao.listDongCodes();
	}

	// 동코드 상세 조회
	@Override
	public DongCodeDto getDongCode(String dongCode) throws Exception {
		return homeDao.getDongCode(dongCode);
	}

}
