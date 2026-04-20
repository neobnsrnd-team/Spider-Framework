package com.example.reactplatform.global.security.mapper;

import com.example.reactplatform.global.security.dto.MenuPermission;
import java.util.List;

public interface AuthorityMapper {

    List<MenuPermission> selectMenuPermissionsByUserId(String userId);

    List<MenuPermission> selectMenuPermissionsByRoleId(String roleId);
}
