package com.example.batchwas.job.db2foreign;

import com.example.batchwas.job.common.SampleMember;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

/**
 * 외부 시스템 HTTP 연계 ItemWriter.
 *
 * <p>DB에서 읽은 SampleMember를 외부 시스템(Mock) HTTP 엔드포인트로 전송한다.
 * Chunk 단위로 처리되므로 한 Chunk 내 오류 발생 시 해당 Chunk 전체 롤백된다.</p>
 */
@Slf4j
@RequiredArgsConstructor
public class TransferItemWriter implements ItemWriter<SampleMember> {

    private final RestTemplate restTemplate;

    /** 외부 시스템 전문 연계 URL (Mock 엔드포인트) */
    private final String transferUrl;

    /**
     * Chunk 내 각 SampleMember를 외부 URL로 POST 전송.
     * 응답이 2xx가 아니면 예외를 던져 해당 Chunk를 롤백시킨다.
     */
    @Override
    public void write(Chunk<? extends SampleMember> chunk) {
        for (SampleMember member : chunk) {
            Map<String, Object> body = new HashMap<>();
            body.put("memberId", member.getMemberId());
            body.put("memberName", member.getMemberName());
            body.put("email", member.getEmail());
            body.put("phone", member.getPhone());

            log.debug("외부 전문 전송: memberId={}, url={}", member.getMemberId(), transferUrl);

            ResponseEntity<Map> response = restTemplate.postForEntity(transferUrl, body, Map.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                // 2xx 아닌 응답이면 예외 → 이 Chunk 롤백
                throw new RuntimeException(
                        "외부 전문 연계 실패: memberId=" + member.getMemberId()
                        + ", status=" + response.getStatusCode());
            }
        }
        log.info("외부 전문 전송 완료: {}건", chunk.size());
    }
}
