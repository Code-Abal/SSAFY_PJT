package com.ssafy.home.model.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.ssafy.home.model.DongCodeDto;
import com.ssafy.util.DbUtil;

public class HomeDaoImpl implements HomeDao {

    private static HomeDao instance = new HomeDaoImpl();

    private HomeDaoImpl() {}

    public static HomeDao getInstance() {
        return instance;
    }

    // 동코드 전체 조회
    @Override
    public List<DongCodeDto> listDongCodes() throws SQLException {
        List<DongCodeDto> list = new ArrayList<>();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            conn = DbUtil.getConnection();
            String sql = "SELECT dong_code, sido_name, gugun_name, dong_name FROM dongcode";
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                DongCodeDto dto = new DongCodeDto();
                dto.setDong_code(rs.getString("dong_code"));
                dto.setSido_name(rs.getString("sido_name"));
                dto.setGugun_name(rs.getString("gugun_name"));
                dto.setDong_name(rs.getString("dong_name"));
                list.add(dto);
            }
        } finally {
            DbUtil.close(rs, pstmt, conn);
        }
        return list;
    }

    // 동코드 상세 조회
    @Override
    public DongCodeDto getDongCode(String dongCode) throws SQLException {
        DongCodeDto dto = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            conn = DbUtil.getConnection();
            String sql = "SELECT dong_code, sido_name, gugun_name, dong_name FROM dongcode WHERE dong_code = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, dongCode);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                dto = new DongCodeDto();
                dto.setDong_code(rs.getString("dong_code"));
                dto.setSido_name(rs.getString("sido_name"));
                dto.setGugun_name(rs.getString("gugun_name"));
                dto.setDong_name(rs.getString("dong_name"));
            }
        } finally {
            DbUtil.close(rs, pstmt, conn);
        }
        return dto;
    }
}