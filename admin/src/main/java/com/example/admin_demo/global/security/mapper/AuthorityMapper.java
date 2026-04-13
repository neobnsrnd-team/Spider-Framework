package com.example.admin_demo.global.security.mapper;

import com.example.admin_demo.global.security.dto.MenuPermission;
import java.util.List;

public interface AuthorityMapper {

    List<MenuPermission> selectMenuPermissionsByUserId(String userId);

    List<MenuPermission> selectMenuPermissionsByRoleId(String roleId);
}
