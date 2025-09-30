package com.ssafy.home.model.service;

import java.util.List;

import com.ssafy.home.model.DongCodeDto;

public interface HomeService {
	// 동코드 전체 조회
	List<DongCodeDto> listDongCodes() throws Exception;
	// 동코드 상세 조회
	DongCodeDto getDongCode(String dongCode) throws Exception;

}
