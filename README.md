# 11_AI_Customer_Nonconformance_8D_System

**AI 기반 고객사 부적합 관리 및 8D 종합 문제 해결 지원 플랫폼 (AI-QMS 8D Commander)**

---

## 🎯 시스템 핵심 개요 & 철학 (Quality Problem Solving Philosophy)

본 시스템은 단순히 **AI가 8D Report 문구를 작성해 주는 생성기**가 아니라,  
> **부적합 접수 → 초동조치 → 원인분석 → 개선 → 효과검증 → 재발방지 → 고객 8D Report 발행까지 하나의 Case로 관리하는 품질 문제 해결 통제 및 지원 시스템**

입니다.

### 5대 데이터 요소 분리 관리 (Zero Confusion Rule)
1. **Fact (사실)**: 5W2H, IS/IS-NOT, 측정값(PPM, 불량수량, 전압/전류) 등 실제 계측/확인된 사실
2. **Hypothesis (가설)**: 아직 검증되지 않은 초동 원인 추정치 (D2와 분리된 Initial Working Hypothesis로 관리)
3. **Evidence (증거)**: 물리적/전기적 사실을 입증하는 X-Ray, SEM, CS, Decap, Log, IV Curve 등 고유 ID 발급 및 D단계 다중 연결
4. **Action (조치)**: D3 긴급봉쇄, D4 FA분석, D5 PCA, D6 검증, D7 수평전개 등 Action 단위 개별 추적
5. **Conclusion (결론)**: 물리/전기 증거 및 인과관계 충족 시에만 `Confirmed Root Cause`로 승격

---

## 🚀 킬러 피처 & 세부 아키텍처

1. **STEP 01. 부적합 접수 & Severity 판정 엔진**:
   - 고객사 Claim 인입 시 Line Stop, Safety Risk, 재발 여부를 기반으로 **8D 필요 여부 / 긴급 대응 Level / 24h SLA Due Date** 자동 판정
2. **D1 ~ D8 전 주기 워크스페이스 & 3단 레이아웃 (3-Pane Workspace)**:
   - **좌측/중앙**: 5W2H Fact, 7대 Material Flow 봉쇄 테이블, 5-Why 발생/유출 인터랙티브 트리, PCA 대책 비교 선정 매트릭스, Before/After 실증 통계, 시스템 문서 개정(DFMEA/PFMEA/CP) 및 수평전개
   - **우측**: **AI Quality Assistant Side-Panel** (필수 필드 누락 검출, 수량/Lot 모순 검증, 미연결 증거 경고, 대책 후보 추천)
   - **하단**: Evidence Bar, Action Tracker, Multi-level 결재 라인
3. **AI 가드레일 (Never-Do Rules) 강제**:
   - 시험하지 않은 임의 PASS 날조 금지, 근거 없는 0% 표현 금지, *"확인된 Affected Lot 및 관리대상 재고에 대한 출하 차단·격리·선별 조치 완료"* 표준 문구 자동 적용
4. **3단계 맞춤형 공식 리포트 체계 (A4 / PDF / 인쇄 완결형)**:
   - **Initial 3D Report**: 24h 초동 회신용 (워터마크: `INITIAL REPORT – ROOT CAUSE UNDER INVESTIGATION` 및 Open Action 포함)
   - **Interim 5D Report**: Root Cause 확정 및 PCA 선정 공유용
   - **Final 8D Report**: Before/After 실증 검증, 수평전개, 5단계 결재 서명 포함 공식 고객 제출용

---

## 🌐 타인/외부 사용자 접속 및 실행 방법 (Access & Verification Guide)

### 방법 1. 웹 브라우저 즉시 접속 (GitHub Pages)
설치나 서버 구동 없이 링크 클릭만으로 모든 기능(D1~D8 워크플로우, 8D 리포트 인쇄, FA 갤러리)을 브라우저에서 즉시 체험할 수 있습니다:
* **웹 데모 접속 URL**: [https://marioai005-00.github.io/ramos-ai-qms-8d-anti/](https://marioai005-00.github.io/ramos-ai-qms-8d-anti/)
*(※ 리포지토리가 Private인 경우: GitHub 저장소 Settings → General 맨 아래에서 `Public`으로 변경하거나, Settings → Pages에서 배포 브랜치를 `main`으로 지정하시면 즉시 전 세계 어디서든 웹 브라우저로 접속 가능합니다.)*

### 방법 2. Git Clone 및 로컬 실행 (Full Python + AI Server)
```bash
# 1. 저장소 클론
git clone https://github.com/marioai005-00/ramos-ai-qms-8d-anti.git
cd ramos-ai-qms-8d-anti

# 2. 로컬 포털 원클릭 실행 (Windows)
run_portal.bat

# 또는 파이썬 없이도 index.html 파일을 더블클릭하면 100% 독립 실행됩니다!
```

---

## 🔑 데모 로그인 계정 안내 (Demo Accounts)

모든 계정의 기본 비밀번호는 **`1`** 입니다. 상단 빠른 로그인 버튼 또는 아래 ID로 접속하실 수 있습니다:

| 사내 계정 ID | 성명 / 직급 | 역할 및 권한 (RACI) | 결재/전결 권한 |
| :--- | :--- | :--- | :--- |
| **`sjkim`** | 김성중 Senior Pro | **품질 총괄 마스터 (MASTER)** | 👑 전 단계 1초 전결 승인 |
| **`chomin`** | 조철민 팀장 | **기안자 (Drafter)** | D1~D8 기안 상신 |
| **`eslee`** | 이은산 상무 | **센터장 (Leader)** | D1~D8 1차 심의 승인 |
| **`hskim`** | 김현수 대표이사 | **최고의사결정권자 (Champion)** | D1~D8 최종 종결 승인 |

---

## 🔄 프로젝트 작업 인수인계

* 이 프로젝트의 변경 이력과 다음 작업은 같은 폴더의 **`WORK_HANDOFF.md`**를 기준으로 합니다.
* 마스터 `Work` 폴더에는 공용 인수인계 파일을 만들지 않으며, 다른 프로젝트의 기록과 섞지 않습니다.
* 의미 있는 수정·추가·삭제가 발생할 때마다 코드 변경과 같은 작업 턴에서 `WORK_HANDOFF.md`도 함께 갱신합니다.

