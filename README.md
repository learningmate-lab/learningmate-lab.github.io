# learningmate-lab

러닝메이트 시험 대비 실습 사이트 모음 · 관제

- 포털: https://learningmate-lab.github.io/
- 관리자(방문 현황): https://learningmate-lab.github.io/admin/

## 새 사이트 추가
1. 새 사이트 `<head>` 에 `<script src="https://learningmate-lab.github.io/track.js" data-site="사이트-id" defer></script>`
2. `sites.json` 에 같은 id 로 한 줄 추가 (활동을 세려면 `events` 와 사이트 코드의 `LMTrack.event('이름')`)

방문 수는 Abacus 카운터(abacus.jasoncameron.dev)에 날짜별 숫자로만 저장돼요. 개인 정보는 보내지 않아요.
