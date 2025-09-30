package com.ssafy.home.model.dao;

import java.sql.SQLException;
import java.util.List;

import com.ssafy.home.model.DongCodeDto;

public interface HomeDao {
	// 동코드 전체 조회
	List<DongCodeDto> listDongCodes() throws SQLException;
	// 동코드 상세 조회
	DongCodeDto getDongCode(String dongCode) throws SQLException;

}
