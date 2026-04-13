package com.example.admin_demo.domain.gateway.dto;

import com.example.admin_demo.domain.gwsystem.dto.SystemResponse;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GatewayDetailResponse {

    private GatewayResponse gateway;
    private List<SystemResponse> systems;
}
