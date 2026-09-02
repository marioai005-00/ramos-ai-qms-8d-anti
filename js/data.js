/* ========================================================================= */
    /* MASTER DATA STORE & BENCHMARK CASES (PHILOSOPHY ALIGNED)                   */
    /* ========================================================================= */
    const STORAGE_KEY = 'AI_QMS_8D_DATA_V2';

    const INITIAL_CASES = [
      {
        id: 'RAMOS-8D-20260901-01',
        customer: 'LGE (LG전자)',
        customerContact: '최영수 책임 (DTV 품질보증팀)',
        customerEmail: 'ys.choi@lge.com',
        product: 'eMMC 5.1 64GB (BGA153)',
        partNumber: 'RM-EM51-064G-X1',
        lotNumber: 'EM2608-DTV01',
        mfgSite: 'RAMOS 오창 1공장 (SMT/PKG Line 3)',
        incidentSite: 'LGE 평택 DTV Main Board 실장 라인',
        application: '4K OLED Smart TV Main SoC Sub-System',
        receiptDate: '2026-09-01 08:30',
        incidentDate: '2026-08-31 22:15',
        dueDateInitial: '2026-09-02 08:30 (24h SLA)',
        dueDateFinal: '2026-09-14 18:00',
        defectQty: 12,
        inspectQty: 10000,
        ppm: 1200,
        claimTitle: 'DTV Main Board SMT 후 Power-on 시 Boot CID Read Timeout 및 CMD1 Error',
        severityLevel: 'Critical', // Critical, Major, Minor
        lineStop: true,
        safetyRisk: false,
        recurrentDefect: false,
        currentStage: 'D3', // D1~D8
        status: 'In Progress', // Draft, In Progress, Under Review, Approved, Closed

        // D1: Cross-Functional Team
        team: [
          { role: '8D Champion', name: '황승안 팀장_상무', dept: '품질혁신팀', contact: 'sahwang@ramostek.com', status: 'Active' },
          { role: '8D Leader (연구소 주관)', name: '김현수 실장_상무', dept: 'Flash 개발실', contact: 'hskim@ramostek.com', status: 'Active' },
          { role: 'Technical / FA Lead', name: '박재환 팀장_S.Pro', dept: 'Flash 개발2팀 (FA신뢰성)', contact: 'jhpark@ramostek.com', status: 'Active' },
          { role: 'Material Containment Lead', name: '이은산 센터장_상무', dept: '제조기획센터', contact: 'eunsan.lee@ramostek.com', status: 'Active' },
          { role: '8D Quality Facilitator / 실무', name: '김성중 S.Pro', dept: '품질혁신팀', contact: 'sjkim@ramostek.com', status: 'Active' }
        ],

        // D2: Problem Description (Strict Fact vs Hypothesis Separation)
        d2: {
          problemWhat: 'eMMC Boot CID Read Fail 및 CMD1 Ready Timeout (Error Code: 0x04)',
          problemWhere: 'LGE 평택 스마트 DTV 양산 실장 라인 (SMT Post-Reflow ICT Test)',
          problemWhen: '2026년 8월 31일 22시 15분 야간 양산 가동 중 초물 검출',
          problemWho: 'LGE SMT 공정 라인 검사원 (공정 품질 검사)',
          problemWhich: 'Part: RM-EM51-064G-X1 / Lot: #EM2608-DTV01 (64GB BGA)',
          problemHow: 'Reflow 실장 후 Power-on Booting 시그널 인가 시 12ea 응답 없음 (VCC-VSS Short 측정됨)',
          problemHowMany: '12 / 10,000ea (1,200 PPM)',
          
          isIsNot: [
            { factor: 'Product', is: 'eMMC 5.1 64GB (BGA153)', isNot: 'eMMC 32GB / 128GB 동일 패키지' },
            { factor: 'Lot No.', is: 'EM2608-DTV01 (8월 4주차 생산)', isNot: 'EM2608-DTV00 (이전 정상 출하 Lot)' },
            { factor: 'Site', is: 'LGE 평택 DTV 라인', isNot: '삼성전자 / 소니 등 타사 납품 라인' },
            { factor: 'Failure Mode', is: 'Boot CID Read Fail (VCC-VSS Short)', isNot: 'Data Retention Error / Read/Write Speed Drop' },
            { factor: 'Position', is: 'Main Board U101 eMMC 위치', isNot: 'U102 DRAM / Main AP SoC' },
            { factor: 'Condition', is: 'Power-on Cold Boot 시점', isNot: '장시간 구동(Aging) 후 발생' }
          ],

          electricalSpecs: {
            errorCode: '0x04 (CMD1 Timeout)',
            shortOpen: 'VCC-VSS Short (0.8Ω 측정)',
            vccvccq: 'VCC: 3.3V / VCCQ: 1.8V',
            currentDraw: 'Over-current Trip (850mA 이상 과전류 차단)',
            bootLog: 'U-Boot CMD1 Send -> Card Response Timeout -> Boot Abort'
          },

          physicalSpecs: {
            crackCheck: 'X-Ray 상 외관 정상 / Decap 시 내부 Substrate MLCC 부위 손상 의심',
            voidPercent: 'BGA Solder Ball Void 4.2% (기준치 < 15% 만족)',
            packageDamage: 'Package Surface Scratch 없음'
          },

          // Separated Initial Working Hypotheses (NEVER mixed with root cause)
          hypotheses: [
            {
              id: 'HYP-01',
              title: 'BGA Solder Joint 접합 불량 또는 Micro Crack에 의한 Short 가능성',
              confidence: 'Low',
              status: 'Under Investigation',
              requiredEvidence: ['BGA X-Ray 3D CT', 'Daisy Chain 저항 측정', 'Cross-Section 연마 단면']
            },
            {
              id: 'HYP-02',
              title: '내부 MLCC Capacitor Crack에 의한 VCC-VSS Internal Short 가능성',
              confidence: 'High',
              status: 'Under Investigation',
              requiredEvidence: ['Decap 화학 개봉', 'MLCC 제거 전/후 저항 비교', 'SEM/EDX 단면 분석']
            },
            {
              id: 'HYP-03',
              title: 'Controller Initialization FW 버그 가능성',
              confidence: 'Low',
              status: 'Excluded',
              requiredEvidence: ['VCC-VSS 물리적 저항 0.8Ω Short 확인으로 FW 원인 배제됨']
            }
          ]
        },

        // D3: Containment Actions (Action-based & 7-Area Material Flow)
        d3: {
          materialFlow: [
            { area: '1. Supplier (원자재 협력사)', lot: 'Capacitor #C2608', totalQty: 100000, holdQty: 100000, screenQty: 5000, ngQty: 0, status: 'Hold & Audit', evidence: 'Supplier Lock Notice #SL-260901' },
            { area: '2. Ramos WIP (당사 재공품)', lot: 'EM2608-DTV01', totalQty: 15000, holdQty: 15000, screenQty: 15000, ngQty: 0, status: '100% Lock', evidence: 'MES WIP Lock ID #WIP-901' },
            { area: '3. Ramos FG (당사 완제품 재고)', lot: 'EM2608-DTV01', totalQty: 45000, holdQty: 45000, screenQty: 45000, ngQty: 0, status: 'Shipment Blocked', evidence: 'ERP Hold Record #ERP-8D-01' },
            { area: '4. In-Transit (운송 중 재고)', lot: 'EM2608-DTV01', totalQty: 8000, holdQty: 8000, screenQty: 0, ngQty: 0, status: 'Recalled', evidence: 'Logistics Recall Ack #TR-881' },
            { area: '5. Customer WH (고객사 창고 재고)', lot: 'EM2608-DTV01', totalQty: 22000, holdQty: 22000, screenQty: 22000, ngQty: 0, status: 'Customer Hold', evidence: 'LGE WH Isolation Mail' },
            { area: '6. Customer Production (고객사 라인)', lot: 'EM2608-DTV01', totalQty: 10000, holdQty: 10000, screenQty: 10000, ngQty: 12, status: '100% Screened', evidence: 'LGE Line Screening Sheet' },
            { area: '7. Field / Market (시장 유출 재고)', lot: 'EM2608-DTV01', totalQty: 0, holdQty: 0, screenQty: 0, ngQty: 0, status: 'Zero Leakage', evidence: 'LGE TV Outflow Check: Complete' }
          ],
          actions: [
            { id: 'CA-001', target: '당사 완제품 창고 (FG)', action: 'ERP 출하 시스템 전면 잠금(Shipment Lock)', owner: '공아름 선임', due: '09.01 09:30', completion: '09.01 09:15', result: '45,000ea 출하 통제 완료', status: 'Closed', evidenceId: 'EVD-01' },
            { id: 'CA-002', target: 'LGE 생산 라인 재고', action: 'SMT 투입 정지 및 잔여 10,000ea 전수 전기 검사(IV Curve)', owner: '김성중 수석', due: '09.01 12:00', completion: '09.01 11:45', result: '10,000ea 선별 중 12ea 불량 적출, 9,988ea 정상', status: 'Closed', evidenceId: 'EVD-02' },
            { id: 'CA-003', target: '협력사 원자재 재고', action: 'MLCC 특정 배치 공급 중단 및 격리 보관', owner: '장민호 책임', due: '09.01 14:00', completion: '09.01 13:30', result: '원자재 100,000ea 입고 잠금 완료', status: 'Closed', evidenceId: 'EVD-03' }
          ],
          effectivenessStatement: '확인된 Affected Lot(#EM2608-DTV01) 및 관리대상 재고 전량(100,000ea)에 대한 출하 차단·격리·선별 조치 완료. 공정 및 완제품 단계 유출 방지 조치 완결됨.'
        },

        // D4: Root Cause Analysis (Occurrence & Escape, 5-Why, FA Data)
        d4: {
          faMatrix: [
            { test: 'IV Curve 측정', sample: '#01~#12', lab: 'QRT 공인분석원', result: 'VCC-VSS 간 0.8Ω 저항 (완전 단락/Short)', status: 'Done', evidenceId: 'EVD-04' },
            { test: '3D X-Ray 비파괴검사', sample: '#01', lab: 'ART Lab', result: 'BGA Solder Ball Bridging/Void 특이사항 없음', status: 'Done', evidenceId: 'EVD-05' },
            { test: 'Decap 화학적 개봉', sample: '#01', lab: 'ART Lab', result: 'Substrate 내부 MLCC(#C102) 상단 Burnt 흔적 확인', status: 'Done', evidenceId: 'EVD-06' },
            { test: 'MLCC 제거 전/후 측정', sample: '#01', lab: 'RAMOS FA실', result: 'MLCC 제거 전: 0.8Ω Short -> MLCC 제거 후: > 10MΩ Open 정상 회복', status: 'Done', evidenceId: 'EVD-07' },
            { test: 'Cross Section (CS) 단면 SEM', sample: '#01, #02', lab: 'QRT', result: 'MLCC 내부 세라믹 Dielectric Layer 수직 Crack 발생 확인', status: 'Done', evidenceId: 'EVD-08' }
          ],

          occurrence5Why: [
            { why: 'Problem: LGE 실장 라인에서 eMMC VCC-VSS Short 및 Boot Fail 발생', evidence: 'EVD-04 (0.8Ω 측정)' },
            { why: 'Why 1: eMMC 기판 내부 C102 MLCC 내부 단락(Short) 발생', evidence: 'EVD-07 (MLCC 탈거 후 정상 회복)' },
            { why: 'Why 2: C102 MLCC 세라믹 유전체 내부에 수직 Crack 발생', evidence: 'EVD-08 (SEM CS 단면 Crack)' },
            { why: 'Why 3: Reflow 최고 온도(260℃) 및 HTOL 고온 시험 시 열팽창 스트레스 누적', evidence: 'HTOL Profile & Reflow Data' },
            { why: 'Why 4: 적용된 MLCC Spec이 85℃ 보증 등급(X5R)으로 125℃ HTOL 스트레스 마진 부족', evidence: 'BOM Spec 시트' },
            { why: 'Root Cause (Occurrence): 고온 내구성이 부족한 X5R MLCC가 BOM 승인 단계에서 선정되어 실장 열응력에 의해 Crack 발생', evidence: 'BOM Review Log #BOM-2608', isRoot: true }
          ],

          escape5Why: [
            { why: 'Problem: 내열 취약 MLCC 적용 제품이 사전에 검출되지 않고 LGE에 출하됨', evidence: '출하검사 성적서' },
            { why: 'Why 1: 양산 전 최종 출하 검사(FT) 단계에서 상온 Test만 수행하여 초기 Crack 미검출', evidence: 'FT Test Program Rev.1' },
            { why: 'Why 2: BOM 승인 및 부품 Qualification 시 온도 등급 크로스체크 프로세스 부재', evidence: 'BOM Review Checklist' },
            { why: 'Root Cause (Escape): 부품 선정 시 공정/신뢰성 평가 온도와 단품 부품 Rating 간 Cross Check Checklist 누락', evidence: 'FMEA Process Gap #Q-GAP-04', isRoot: true }
          ],

          candidateCauses: [
            {
              id: 'RC-01',
              type: 'Occurrence',
              title: 'MLCC X5R 내열 마진 부족 및 Reflow 열응력에 의한 유전체 Crack',
              status: 'Confirmed', // Candidate vs Confirmed
              supportingEvidence: ['EVD-04', 'EVD-07', 'EVD-08'],
              contradictingEvidence: '없음 (정상 시료 비교 검증 완료)',
              missingEvidence: '없음 (물리적/전기적 증거 및 메커니즘 입증 완결)'
            },
            {
              id: 'RC-02',
              type: 'Escape',
              title: 'BOM 부품 선정 및 신뢰성 검토 단계에서 사용온도 Rating Cross Check 누락',
              status: 'Confirmed',
              supportingEvidence: ['BOM Review Checklist', 'FMEA Process Gap'],
              contradictingEvidence: '없음',
              missingEvidence: '없음'
            }
          ]
        },

        // D5: Permanent Corrective Actions (PCA Candidates & Selection)
        d5: {
          candidates: [
            {
              id: 'PCA-01',
              title: 'C102 MLCC 부품 변경: X5R(85℃) → X7R(125℃ 고온 보증 등급) 100% 교체',
              rootCauseElimination: 'High (100% 근본 원인 해결)',
              feasibility: 'High (동일 Size 0603 Footprint 호환)',
              costImpact: 'Low (+0.002$/ea)',
              riskLevel: 'Low',
              selected: true,
              rationale: '물리적 Crack 유발 원인인 열팽창 스트레스 마진을 125℃까지 완벽 확보'
            },
            {
              id: 'PCA-02',
              title: 'BOM 승인 절차 개정: 고온 신뢰성(HTOL 125℃) 부품 Cross Check 필수화',
              rootCauseElimination: 'High (Escape 원인 방지)',
              feasibility: 'High (체크리스트 즉시 적용)',
              costImpact: 'Zero',
              riskLevel: 'Low',
              selected: true,
              rationale: 'BOM Review Gate에 온도 등급 대조 항목 강제 신설'
            },
            {
              id: 'PCA-03',
              title: 'Reflow Profile 최고 온도 하향 조정 (260℃ → 240℃)',
              rootCauseElimination: 'Low (Lead-free 솔더 접합 불량 리스크 발생)',
              feasibility: 'Medium',
              costImpact: 'Low',
              riskLevel: 'High',
              selected: false,
              rationale: 'BGA Solder Ball Un-melt 결함 유발 위험으로 기각됨'
            }
          ],
          pcnEcn: {
            ecnNumber: 'ECN-260901-01',
            pcnRequired: true,
            customerApprovalStatus: 'Approved by LGE (2026.09.04)',
            appliedLot: 'EM2609-001 (Rev.B 양산 Lot)'
          }
        },

        // D6: Implementation & Validation (Before vs After)
        d6: {
          implementationDetails: {
            bomRevision: 'Rev.A (X5R) → Rev.B (X7R 125℃)',
            appliedLot: 'EM2609-001',
            startDate: '2026.09.05',
            productionSite: '오창 1공장 Line 3'
          },
          validationTests: [
            { testName: 'Final Test (FT) 상온', condition: '25℃ 3.3V/1.8V', sampleSize: 231, failQty: 0, result: 'PASS' },
            { testName: 'DC Electrical Test', condition: 'VCC-VSS Resistance Check', sampleSize: 231, failQty: 0, result: 'PASS' },
            { testName: 'HTOL 신뢰성 가속 수명 시험', condition: '125℃ / 1.2 x VCC / 504 Hours', sampleSize: 231, failQty: 0, result: 'PASS' },
            { testName: 'THB 내습 시험', condition: '85℃ / 85% RH / 168 Hours', sampleSize: 75, failQty: 0, result: 'PASS' },
            { testName: 'LGE DTV 실장 파일럿 시험', condition: 'LGE SMT Line 500ea 실장 후 Boot Test', sampleSize: 500, failQty: 0, result: 'PASS' }
          ],
          beforeAfter: {
            beforeMetric: '12 / 10,000ea (1,200 PPM) - Boot CID Fail',
            afterMetric: '0 / 10,000ea (0 PPM) - 0 Defect Achieved',
            validationPeriod: '2026.09.05 ~ 2026.09.12 (신규 Lot 전수 검증)'
          }
        },

        // D7: Prevent Recurrence (System Changes & Horizontal Deployment)
        d7: {
          systemUpdates: [
            { docName: 'DFMEA (설계 FMEA)', docNo: 'FMEA-EM51-01', rev: 'Rev.1.2', changeContent: 'C102 Capacitor 고온 스트레스 Crack RPN 평가치 180 -> 24 하향', status: 'Completed', owner: '정동진 수석' },
            { docName: 'PFMEA (공정 FMEA)', docNo: 'PFMEA-SMT-03', rev: 'Rev.2.1', changeContent: '부품 실장 열충격 취약 소자 관리 기준 등록', status: 'Completed', owner: '김성중 수석' },
            { docName: 'Control Plan (관리계획서)', docNo: 'CP-EM51-064', rev: 'Rev.2.0', changeContent: 'X7R 125℃ 부품 입고 수입검사 정전용량 및 내열성 전수 체크 추가', status: 'Completed', owner: '공아름 선임' },
            { docName: 'BOM Review Checklist', docNo: 'SOP-RD-044', rev: 'Rev.3.0', changeContent: '신규 부품 승인 시 HTOL/환경시험 온도와 부품 Spec 일치 검증 게이트 신설', status: 'Completed', owner: '이창민 상무' }
          ],
          horizontalDeployment: [
            { product: 'eMMC 5.1 32GB (RM-EM51-032G)', samePartUsed: 'Yes (X5R 적용 확인)', sameRisk: 'Yes (High)', action: 'BOM Rev.B로 즉시 X7R 변경 완료', status: 'Closed' },
            { product: 'eMMC 5.1 64GB (RM-EM51-064G)', samePartUsed: 'Yes (개선 대상)', sameRisk: 'Yes (High)', action: 'ECN-260901 적용 완결', status: 'Closed' },
            { product: 'eMMC 5.1 128GB (RM-EM51-128G)', samePartUsed: 'No (기존 X7R 적용 중)', sameRisk: 'None', action: '이상 없음 확인', status: 'Closed' },
            { product: 'NVMe SSD 512GB (RM-SSD-512G)', samePartUsed: 'No (별도 고온 부품군)', sameRisk: 'Low', action: 'BOM Cross Check 완료', status: 'Closed' }
          ]
        },

        // D8: Closure & Multi-stage Approval
        d8: {
          checklist: [
            { cat: 'Root Cause', item: 'Occurrence Root Cause 입증 완료 (MLCC X7R 내열 취약 Crack)', checked: true },
            { cat: 'Root Cause', item: 'Escape Root Cause 입증 완료 (BOM Review 크로스체크 누락)', checked: true },
            { cat: 'Action', item: 'D3 봉쇄 조치 및 격리 재고 전량 선별 완료', checked: true },
            { cat: 'Action', item: 'D5 PCA (X7R 변경 및 ECN 배포) 완료', checked: true },
            { cat: 'Action', item: 'D6 신뢰성 504h HTOL 및 파일럿 500ea 0 Defect 검증 완료', checked: true },
            { cat: 'Action', item: 'D7 유사 라인업(32GB) 수평전개 및 BOM 변경 완료', checked: true },
            { cat: 'Documentation', item: 'PFMEA, Control Plan, BOM Checklist 개정 완료', checked: true },
            { cat: 'Customer', item: 'LGE 품질보증팀 최종 8D Report 제출 및 정식 승인 완료', checked: true }
          ],
          approvalFlow: [
            { step: '1. 8D Leader 작성', approver: '김성중 S.Pro (품질혁신팀)', date: '2026.09.12 14:00', status: 'Approved' },
            { step: '2. FA/기술 검증', approver: '박재환 책임 (FA분석실)', date: '2026.09.12 15:30', status: 'Approved' },
            { step: '3. 제조기술 승인', approver: '서태웅 수석 (제조기술)', date: '2026.09.12 16:10', status: 'Approved' },
            { step: '4. 품질총괄 최종 승인', approver: '이창민 상무 (품질총괄)', date: '2026.09.12 17:00', status: 'Approved' },
            { step: '5. 고객사 접수 및 종결', approver: '최영수 책임 (LGE DTV품질)', date: '2026.09.13 10:00', status: 'Approved' }
          ],
          closureDate: '2026.09.13',
          teamAppreciation: '신속한 24h D3 초동 격리 및 72h 내 물리적 Root Cause 규명으로 LGE TV 라인 Stop을 최소화한 CFT 팀원 전원에게 품질 혁신 포상 수여.'
        },

        // Evidence Repository Linked to this Case
        evidenceList: [
          { id: 'EVD-01', title: 'RAMOS ERP 완제품 창고 45,000ea Shipment Lock 전산 화면', type: 'ERP Screen', file: 'ERP_Lock_Screen_260901.png', linkedStages: ['D3'] },
          { id: 'EVD-02', title: 'LGE 평택 라인 10,000ea 선별 결과 및 NG 12ea 시료 기록서', type: 'Test Sheet', file: 'LGE_Screening_Log.xlsx', linkedStages: ['D2', 'D3'] },
          { id: 'EVD-03', title: '협력사 MLCC 원자재 입고 정지 공문', type: 'Notice', file: 'Supplier_Isolation_Ack.pdf', linkedStages: ['D3'] },
          { id: 'EVD-04', title: 'QRT 공인시험소 IV Curve 전기적 단락(0.8Ω) 분석 성적서', type: 'IV Curve', file: 'QRT_IV_Curve_Short.pdf', linkedStages: ['D2', 'D4'] },
          { id: 'EVD-05', title: 'BGA Solder Ball 3D X-Ray 비파괴 검사 사진', type: 'X-Ray', file: 'XRay_BGA_Normal.jpg', linkedStages: ['D4'] },
          { id: 'EVD-06', title: 'Decap 개봉 사진 (C102 Capacitor 표면 탄화 확인)', type: 'Decap Photo', file: 'Decap_MLCC_Burnt.png', linkedStages: ['D4'] },
          { id: 'EVD-07', title: 'MLCC 기판 탈거 전/후 단락 저항 비교 측정 로그', type: 'Log', file: 'Resistance_Before_After_Decap.csv', linkedStages: ['D4'] },
          { id: 'EVD-08', title: 'SEM Cross-Section 단면 세라믹 유전체 수직 Crack 성적서', type: 'Cross Section', file: 'SEM_CS_MLCC_Crack.pdf', linkedStages: ['D4', 'D5'] },
          { id: 'EVD-09', title: 'ECN-260901 부품 변경(X7R 125℃) 승인서 및 LGE 고객 동의서', type: 'ECN', file: 'ECN_260901_Signed.pdf', linkedStages: ['D5', 'D6'] },
          { id: 'EVD-10', title: 'HTOL 125℃ 504시간 231ea 0 Fail 가속 수명 신뢰성 성적서', type: 'Reliability', file: 'HTOL_504H_Pass_Report.pdf', linkedStages: ['D6'] }
        ]
      },
      {
        id: 'RAMOS-8D-20260902-02',
        customer: 'Samsung Electronics (메모리사업부)',
        customerContact: '강민규 프로 (SSD QA팀)',
        customerEmail: 'mg.kang@samsung.com',
        product: 'PCIe Gen4 Enterprise SSD 3.84TB',
        partNumber: 'RM-SSD4-384T',
        lotNumber: 'SS2608-NV04',
        mfgSite: 'RAMOS 오창 2공장',
        incidentSite: 'Samsung Server System Validation Lab',
        application: 'Cloud Data Center Storage Server',
        receiptDate: '2026-09-02 10:00',
        incidentDate: '2026-09-01 19:30',
        dueDateInitial: '2026-09-03 10:00',
        dueDateFinal: '2026-09-20 18:00',
        defectQty: 2,
        inspectQty: 500,
        ppm: 4000,
        claimTitle: 'High-Temperature Read Stress 중 PCIe Link Drop 및 Controller Hang',
        severityLevel: 'Major',
        lineStop: false,
        safetyRisk: false,
        recurrentDefect: false,
        currentStage: 'D2',
        status: 'In Progress',
        team: [
          { role: '8D Champion', name: '이창민 상무', dept: '품질총괄', contact: 'cm.lee@ramos.com', status: 'Active' },
          { role: '8D Leader', name: '김성중 수석', dept: 'SSD 품질팀', contact: 'sj.kim@ramos.com', status: 'Active' }
        ],
        d2: {
          problemWhat: '70℃ Read Throughput Test 시 PCIe Gen4 Link Down',
          problemWhere: 'Samsung 서버 검증 챔버',
          problemWhen: '2026.09.01 19:30',
          problemWho: 'Samsung QA 엔지니어',
          problemWhich: 'RM-SSD4-384T / Lot #SS2608-NV04',
          problemHow: '4K Random Read 장시간 구동 시 응답 중단',
          problemHowMany: '2 / 500ea',
          isIsNot: [],
          hypotheses: [
            { id: 'HYP-01', title: 'PMIC 전압 드롭에 의한 컨트롤러 리셋', confidence: 'Medium', status: 'Under Investigation', requiredEvidence: ['PMIC Scope 파형'] }
          ]
        },
        d3: { materialFlow: [], actions: [], effectivenessStatement: '해당 Lot 출하 보류 조치' },
        d4: { faMatrix: [], occurrence5Why: [], escape5Why: [], candidateCauses: [] },
        d5: { candidates: [] },
        d6: { validationTests: [] },
        d7: { systemUpdates: [], horizontalDeployment: [] },
        d8: { checklist: [], approvalFlow: [] },
        evidenceList: []
      }
    ];

    // RAmos Exact Hierarchical Organization Tree (Matching User Folder Sequence)
    const RAMOS_TREE = [
      {
            "id": "ceo",
            "name": "대표이사",
            "type": "dept",
            "members": [
                  {
                        "name": "조장호",
                        "position": "대표이사",
                        "email": "jh.choue66@ramostek.com",
                        "dept": "대표이사",
                        "isMe": false
                  }
            ]
      },
      {
            "id": "coo",
            "name": "COO 직속",
            "type": "dept",
            "members": [
                  {
                        "name": "윤석재",
                        "position": "COO_부사장",
                        "email": "sjyun@ramostek.com",
                        "dept": "COO 직속",
                        "isMe": false
                  }
            ],
            "children": [
                  {
                        "id": "mfg_center",
                        "name": "제조기획센터",
                        "type": "center",
                        "members": [
                              {
                                    "name": "이은산",
                                    "position": "센터장_상무",
                                    "email": "eunsan.lee@ramostek.com",
                                    "dept": "제조기획센터",
                                    "isMe": false
                              }
                        ],
                        "children": [
                              {
                                    "id": "goc",
                                    "name": "GOC팀",
                                    "type": "team",
                                    "members": [],
                                    "children": [
                                          {
                                                "id": "plan_grp",
                                                "name": "계획운영그룹",
                                                "type": "group",
                                                "members": [
                                                      {
                                                            "name": "공아름",
                                                            "position": "그룹장_P.Pro",
                                                            "email": "loveskr@ramostek.com",
                                                            "dept": "계획운영그룹",
                                                            "isMe": false
                                                      },
                                                      {
                                                            "name": "강순자",
                                                            "position": "Senior Pro",
                                                            "email": "daks3539@ramostek.com",
                                                            "dept": "계획운영그룹",
                                                            "isMe": false
                                                      },
                                                      {
                                                            "name": "김현수_제조",
                                                            "position": "Pro",
                                                            "email": "kimhs@ramostek.com",
                                                            "dept": "계획운영그룹",
                                                            "isMe": false
                                                      }
                                                ]
                                          },
                                          {
                                                "id": "res_grp",
                                                "name": "자원운영그룹",
                                                "type": "group",
                                                "members": [
                                                      {
                                                            "name": "조철민",
                                                            "position": "그룹장_P.Pro",
                                                            "email": "nrjcm@ramostek.com",
                                                            "dept": "자원운영그룹",
                                                            "isMe": false
                                                      },
                                                      {
                                                            "name": "우정우",
                                                            "position": "Pro",
                                                            "email": "jwwoo@ramostek.com",
                                                            "dept": "자원운영그룹",
                                                            "isMe": false
                                                      }
                                                ]
                                          },
                                          {
                                                "id": "sub_grp",
                                                "name": "외주운영그룹",
                                                "type": "group",
                                                "members": [
                                                      {
                                                            "name": "김혜원",
                                                            "position": "Pro",
                                                            "email": "hyewon@ramostek.com",
                                                            "dept": "외주운영그룹",
                                                            "isMe": false
                                                      },
                                                      {
                                                            "name": "오승현",
                                                            "position": "Pro",
                                                            "email": "shoh@ramostek.com",
                                                            "dept": "외주운영그룹",
                                                            "isMe": false
                                                      }
                                                ]
                                          }
                                    ]
                              },
                              {
                                    "id": "it_sec",
                                    "name": "IT_보안팀",
                                    "type": "team",
                                    "members": [
                                          {
                                                "name": "이우진",
                                                "position": "팀장_P.Pro",
                                                "email": "lwj@ramostek.com",
                                                "dept": "IT_보안팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "김기서",
                                                "position": "Pro",
                                                "email": "kskim@ramostek.com",
                                                "dept": "IT_보안팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "김도현",
                                                "position": "Pro",
                                                "email": "dohyun20.kim@ramostek.com",
                                                "dept": "IT_보안팀",
                                                "isMe": false
                                          }
                                    ]
                              }
                        ]
                  }
            ]
      },
      {
            "id": "strat_mkt",
            "name": "전략 마케팅실",
            "type": "dept",
            "members": [
                  {
                        "name": "손동우",
                        "position": "실장_부사장",
                        "email": "bigsohn@ramostek.com",
                        "dept": "전략 마케팅실",
                        "isMe": false
                  }
            ],
            "children": [
                  {
                        "id": "sales_div",
                        "name": "영업부문",
                        "type": "division",
                        "members": [
                              {
                                    "name": "Robin_Myung_명노광",
                                    "position": "부문장_전무",
                                    "email": "rkmyung@ramostek.com",
                                    "dept": "영업부문",
                                    "isMe": false
                              }
                        ],
                        "children": [
                              {
                                    "id": "sales_team",
                                    "name": "영업팀",
                                    "type": "team",
                                    "members": [
                                          {
                                                "name": "Sahong_Kim_김사홍",
                                                "position": "팀장_P.Pro",
                                                "email": "shk@ramostek.com",
                                                "dept": "영업팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "Aria_김애정",
                                                "position": "Pro",
                                                "email": "anasta@ramostek.com",
                                                "dept": "영업팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "Jinyi Ahn_안진의",
                                                "position": "Pro",
                                                "email": "jinyi711@ramostek.com",
                                                "dept": "영업팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "Jun Lee_이학준",
                                                "position": "Pro",
                                                "email": "junlee@ramostek.com",
                                                "dept": "영업팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "Martin Lee_이지훈",
                                                "position": "Pro",
                                                "email": "homebot@ramostek.com",
                                                "dept": "영업팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "Roen Kim_김려은",
                                                "position": "Pro",
                                                "email": "roenkim@ramostek.com",
                                                "dept": "영업팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "Selly Park_박소진",
                                                "position": "Pro",
                                                "email": "sjpark@ramostek.com",
                                                "dept": "영업팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "빈철우_Benjamin",
                                                "position": "Pro",
                                                "email": "cwbeen@ramostek.com",
                                                "dept": "영업팀",
                                                "isMe": false
                                          }
                                    ]
                              }
                        ]
                  },
                  {
                        "id": "sourcing_team",
                        "name": "전략소싱팀",
                        "type": "team",
                        "members": [
                              {
                                    "name": "John_Woo_우준수",
                                    "position": "팀장_이사",
                                    "email": "johnwoo@ramostek.com",
                                    "dept": "전략소싱팀",
                                    "isMe": false
                              },
                              {
                                    "name": "강병주",
                                    "position": "Pro",
                                    "email": "kbj8420@ramostek.com",
                                    "dept": "전략소싱팀",
                                    "isMe": false
                              },
                              {
                                    "name": "남서현",
                                    "position": "Pro",
                                    "email": "shnam1228@ramostek.com",
                                    "dept": "전략소싱팀",
                                    "isMe": false
                              },
                              {
                                    "name": "이하영",
                                    "position": "Pro",
                                    "email": "lhyduddlgk@ramostek.com",
                                    "dept": "전략소싱팀",
                                    "isMe": false
                              }
                        ]
                  },
                  {
                        "id": "qi_team",
                        "name": "품질혁신팀",
                        "type": "team",
                        "members": [
                              {
                                    "name": "황승안",
                                    "position": "팀장_상무",
                                    "email": "sahwang@ramostek.com",
                                    "dept": "품질혁신팀",
                                    "isMe": false
                              },
                              {
                                    "name": "김성중",
                                    "position": "Senior Pro",
                                    "email": "sjkim@ramostek.com",
                                    "dept": "품질혁신팀",
                                    "isMe": true
                              },
                              {
                                    "name": "이봉건",
                                    "position": "Pro",
                                    "email": "special2947@ramostek.com",
                                    "dept": "품질혁신팀",
                                    "isMe": false
                              }
                        ]
                  }
            ]
      },
      {
            "id": "rnd",
            "name": "알앤디부문",
            "type": "dept",
            "members": [
                  {
                        "name": "박정훈",
                        "position": "부문장_전무",
                        "email": "gh8229@ramostek.com",
                        "dept": "알앤디부문",
                        "isMe": false
                  }
            ],
            "children": [
                  {
                        "id": "dram_div",
                        "name": "DRAM 개발실",
                        "type": "center",
                        "members": [
                              {
                                    "name": "박철홍",
                                    "position": "실장_상무",
                                    "email": "chpark@ramostek.com",
                                    "dept": "DRAM 개발실",
                                    "isMe": false
                              },
                              {
                                    "name": "이민호",
                                    "position": "담당_팀장_이사",
                                    "email": "aden@ramostek.com",
                                    "dept": "DRAM 개발실",
                                    "isMe": false
                              }
                        ],
                        "children": [
                              {
                                    "id": "dram_1",
                                    "name": "DRAM 개발1팀",
                                    "type": "team",
                                    "members": [
                                          {
                                                "name": "박재훈",
                                                "position": "Principal Pro",
                                                "email": "hope@ramostek.com",
                                                "dept": "DRAM 개발1팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "배진성",
                                                "position": "Principal Pro",
                                                "email": "sean@ramostek.com",
                                                "dept": "DRAM 개발1팀",
                                                "isMe": false
                                          }
                                    ]
                              },
                              {
                                    "id": "dram_2",
                                    "name": "DRAM 개발2팀",
                                    "type": "team",
                                    "members": [
                                          {
                                                "name": "신덕용",
                                                "position": "팀장_P.Pro",
                                                "email": "satiou@ramostek.com",
                                                "dept": "DRAM 개발2팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "정선혁",
                                                "position": "Pro",
                                                "email": "jsh@ramostek.com",
                                                "dept": "DRAM 개발2팀",
                                                "isMe": false
                                          }
                                    ]
                              }
                        ]
                  },
                  {
                        "id": "flash_div",
                        "name": "Flash 개발실",
                        "type": "center",
                        "members": [
                              {
                                    "name": "김현수",
                                    "position": "실장_상무",
                                    "email": "hskim@ramostek.com",
                                    "dept": "Flash 개발실",
                                    "isMe": false
                              }
                        ],
                        "children": [
                              {
                                    "id": "flash_1",
                                    "name": "Flash 개발1팀",
                                    "type": "team",
                                    "members": [
                                          {
                                                "name": "정현석",
                                                "position": "팀장_S.Pro",
                                                "email": "hsjeong@ramostek.com",
                                                "dept": "Flash 개발1팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "김영태",
                                                "position": "Pro",
                                                "email": "ytkim@ramostek.com",
                                                "dept": "Flash 개발1팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "심병진",
                                                "position": "Pro",
                                                "email": "bjsim@ramostek.com",
                                                "dept": "Flash 개발1팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "양태욱",
                                                "position": "Pro",
                                                "email": "tuyang@ramostek.com",
                                                "dept": "Flash 개발1팀",
                                                "isMe": false
                                          }
                                    ]
                              },
                              {
                                    "id": "flash_2",
                                    "name": "Flash 개발2팀",
                                    "type": "team",
                                    "members": [
                                          {
                                                "name": "박재환",
                                                "position": "팀장_S.Pro",
                                                "email": "jhpark@ramostek.com",
                                                "dept": "Flash 개발2팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "정유석",
                                                "position": "Senior Pro",
                                                "email": "jys@ramostek.com",
                                                "dept": "Flash 개발2팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "김상우",
                                                "position": "Pro",
                                                "email": "sangwoo2352@ramostek.com",
                                                "dept": "Flash 개발2팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "김태규",
                                                "position": "Pro",
                                                "email": "ktgstar2007@ramostek.com",
                                                "dept": "Flash 개발2팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "조성근",
                                                "position": "Pro",
                                                "email": "sg.cho@ramostek.com",
                                                "dept": "Flash 개발2팀",
                                                "isMe": false
                                          }
                                    ]
                              },
                              {
                                    "id": "flash_3",
                                    "name": "Flash 개발3팀",
                                    "type": "team",
                                    "members": [
                                          {
                                                "name": "이성우",
                                                "position": "팀장_P.Pro",
                                                "email": "fog1007@ramostek.com",
                                                "dept": "Flash 개발3팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "김유진",
                                                "position": "Pro",
                                                "email": "yjkim@ramostek.com",
                                                "dept": "Flash 개발3팀",
                                                "isMe": false
                                          },
                                          {
                                                "name": "홍종혁",
                                                "position": "Pro",
                                                "email": "jhhong@ramostek.com",
                                                "dept": "Flash 개발3팀",
                                                "isMe": false
                                          }
                                    ]
                              }
                        ]
                  }
            ]
      },
      {
            "id": "strat_mgmt",
            "name": "전략경영부문",
            "type": "dept",
            "members": [
                  {
                        "name": "이제현",
                        "position": "부문장_전무",
                        "email": "jaylee@ramostek.com",
                        "dept": "전략경영부문",
                        "isMe": false
                  },
                  {
                        "name": "이용희",
                        "position": "담당_팀장_이사",
                        "email": "iscra74@ramostek.com",
                        "dept": "전략1팀/2팀",
                        "isMe": false
                  }
            ],
            "children": [
                  {
                        "id": "strat_1",
                        "name": "전략1팀",
                        "type": "team",
                        "members": [
                              {
                                    "name": "박상연",
                                    "position": "Senior Pro",
                                    "email": "parksy@ramostek.com",
                                    "dept": "전략1팀",
                                    "isMe": false
                              },
                              {
                                    "name": "고현우",
                                    "position": "Pro",
                                    "email": "hwko@ramostek.com",
                                    "dept": "전략1팀",
                                    "isMe": false
                              },
                              {
                                    "name": "박중민",
                                    "position": "Pro",
                                    "email": "jungmin16@ramostek.com",
                                    "dept": "전략1팀",
                                    "isMe": false
                              }
                        ]
                  },
                  {
                        "id": "strat_2",
                        "name": "전략2팀",
                        "type": "team",
                        "members": [
                              {
                                    "name": "고진규",
                                    "position": "Pro",
                                    "email": "wlsrb9010@ramostek.com",
                                    "dept": "전략2팀",
                                    "isMe": false
                              },
                              {
                                    "name": "김아영",
                                    "position": "Pro",
                                    "email": "kay153@ramostek.com",
                                    "dept": "전략2팀",
                                    "isMe": false
                              },
                              {
                                    "name": "김혜성",
                                    "position": "Pro",
                                    "email": "hyeskim@ramostek.com",
                                    "dept": "전략2팀",
                                    "isMe": false
                              }
                        ]
                  },
                  {
                        "id": "infra_team",
                        "name": "인프라혁신팀",
                        "type": "team",
                        "members": [
                              {
                                    "name": "이상주",
                                    "position": "팀장_P.Pro",
                                    "email": "sjlee@ramostek.com",
                                    "dept": "인프라혁신팀",
                                    "isMe": false
                              },
                              {
                                    "name": "탁현준",
                                    "position": "Pro",
                                    "email": "thj@ramostek.com",
                                    "dept": "인프라혁신팀",
                                    "isMe": false
                              }
                        ]
                  },
                  {
                        "id": "people_grp",
                        "name": "피플그룹",
                        "type": "team",
                        "members": [
                              {
                                    "name": "고미영",
                                    "position": "그룹장_P.Pro",
                                    "email": "turf2313@ramostek.com",
                                    "dept": "피플그룹",
                                    "isMe": false
                              },
                              {
                                    "name": "윤선혜",
                                    "position": "Senior Pro",
                                    "email": "shyun@ramostek.com",
                                    "dept": "피플그룹",
                                    "isMe": false
                              }
                        ]
                  }
            ]
      }
];

    // Bulletproof Data State Management (Prevents any corrupt localStorage or blank screen)
    function loadStoredAppData() {
      const defaultState = {
        cases: INITIAL_CASES,
        intakeQueue: [],
        activeCaseId: INITIAL_CASES[0]?.id || 'RAMOS-8D-20260901-01',
        currentView: 'dashboard',
        activeStage: 'overview',
        sidebarTab: 'menu'
      };

      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultState;
        const parsed = JSON.parse(raw);

        // Case A: Parsed is legacy array of cases
        if (Array.isArray(parsed)) {
          return {
            ...defaultState,
            cases: parsed.length > 0 ? parsed : INITIAL_CASES
          };
        }

        // Case B: Parsed is appData object
        if (parsed && typeof parsed === 'object') {
          let validCases = (Array.isArray(parsed.cases) && parsed.cases.length > 0) ? parsed.cases : INITIAL_CASES;
          
          // Strictly sanitize all gates across all cases to remove customer sign-off
          validCases.forEach(c => {
            if (c.gates) {
              ['gate3D', 'gate5D', 'gate8D'].forEach(gk => {
                if (c.gates[gk] && Array.isArray(c.gates[gk].approvers)) {
                  c.gates[gk].approvers = c.gates[gk].approvers.filter(a => !a.role.includes('고객사')).slice(0, 4);
                }
              });
            }
          });

          const validActiveId = validCases.some(c => c.id === parsed.activeCaseId) ? parsed.activeCaseId : validCases[0].id;
          return {
            cases: validCases,
            intakeQueue: Array.isArray(parsed.intakeQueue) ? parsed.intakeQueue : [],
            activeCaseId: validActiveId,
            currentView: parsed.currentView || 'dashboard',
            activeStage: parsed.activeStage || 'overview',
            sidebarTab: parsed.sidebarTab || 'menu'
          };
        }
      } catch (err) {
        console.warn('Recovered from corrupted localStorage state:', err);
      }
      return defaultState;
    }

    let appData = loadStoredAppData();

    function saveAppData() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
    }

    function getActiveCase() {
      if (!appData || !Array.isArray(appData.cases) || appData.cases.length === 0) {
        appData.cases = INITIAL_CASES;
      }
      let found = appData.cases.find(c => c.id === appData.activeCaseId);
      if (!found) {
        found = appData.cases[0];
        appData.activeCaseId = found.id;
      }
      return found;
    }

    // =========================================================================
    // CURRENT LOGGED-IN USER & PERSONALIZED TASK ENGINE
    // =========================================================================
    const PRESET_USERS = [
      { username: 'sjkim', name: '김성중', position: 'Senior Pro', dept: '품질혁신팀', email: 'sjkim@ramostek.com', roleDesc: '8D 품질 실무 간사 / Facilitator' },
      { name: '김현수', position: '실장_상무', dept: 'Flash 개발실', email: 'hskim@ramostek.com', roleDesc: '8D Leader (Flash 개발 총괄)' },
      { name: '박재환', position: '팀장_S.Pro', dept: 'Flash 개발2팀', email: 'jhpark@ramostek.com', roleDesc: '불량 분석 리더 (FA / Technical Lead)' },
      { name: '이은산', position: '센터장_상무', dept: '제조기획센터', email: 'eunsan.lee@ramostek.com', roleDesc: '물류/자재 격리 책임자 (Containment Lead)' },
      { name: '황승안', position: '팀장_상무', dept: '품질혁신팀', email: 'sahwang@ramostek.com', roleDesc: '8D Champion (품질혁신 총괄)' },
      { name: '정현석', position: '팀장_S.Pro', dept: 'Flash 개발1팀', email: 'hsjeong@ramostek.com', roleDesc: 'D1 CFT 엔지니어 / 펌웨어' },
      { name: '이성우', position: '팀장_P.Pro', dept: 'Flash 개발3팀', email: 'fog1007@ramostek.com', roleDesc: 'D1 CFT 엔지니어 / 공정기술' },
      { name: '신덕용', position: '팀장_P.Pro', dept: 'DRAM 개발2팀', email: 'satiou@ramostek.com', roleDesc: '8D Leader (DRAM 개발)' },
      { name: '박정훈', position: '부문장_전무', dept: '알앤디부문', email: 'gh8229@ramostek.com', roleDesc: '연구소장 / R&D 총괄' },
      { name: '조장호', position: '대표이사', dept: '대표이사', email: 'jh.choue66@ramostek.com', roleDesc: 'CEO / 최고 의사결정권자' }
    ];

    let CURRENT_USER = PRESET_USERS[0]; // Default: 김성중 S.Pro

    function setCurrentUser(userName) {
      const found = PRESET_USERS.find(u => u.name === userName);
      if (found) {
        CURRENT_USER = found;
        localStorage.setItem('RAMOS_CURRENT_USER', userName);
      }
    }

    function loadCurrentUser() {
      const saved = localStorage.getItem('RAMOS_CURRENT_USER');
      if (saved) {
        const found = PRESET_USERS.find(u => u.name === saved);
        if (found) CURRENT_USER = found;
      }
    }
    loadCurrentUser();

    function getAllUserAccounts() {
      const accounts = [];
      const seenEmails = new Set();

      function traverse(node, parentDept = '') {
        const deptName = node.name || parentDept;
        (node.members || []).forEach(member => {
          if (!member.email || !member.email.includes('@')) return;
          const email = member.email.toLowerCase();
          if (seenEmails.has(email)) return;
          seenEmails.add(email);
          const preset = PRESET_USERS.find(user => user.email.toLowerCase() === email);
          accounts.push({
            username: email.split('@')[0],
            password: '1',
            name: member.name,
            position: member.position || 'Pro',
            dept: member.dept || deptName,
            email: member.email,
            isMe: Boolean(member.isMe),
            roleDesc: preset?.roleDesc || 'CFT 유관부서 담당자'
          });
        });
        (node.children || []).forEach(child => traverse(child, deptName));
      }

      RAMOS_TREE.forEach(root => traverse(root));
      PRESET_USERS.forEach(user => {
        if (!seenEmails.has(user.email.toLowerCase())) accounts.push({ ...user, password: '1' });
      });
      return accounts;
    }

    const ALL_USER_ACCOUNTS = getAllUserAccounts();

    function authenticateUser(username, password) {
      const cleanUser = String(username || '').trim().toLowerCase();
      const cleanPassword = String(password || '').trim();
      if (!cleanUser || cleanPassword !== '1') return null;

      return ALL_USER_ACCOUNTS.find(account =>
        account.username.toLowerCase() === cleanUser ||
        account.email.toLowerCase() === cleanUser ||
        account.name.toLowerCase() === cleanUser
      ) || null;
    }

    function getUserPendingTasks(user = CURRENT_USER) {
      const tasks = [];
      const cases = (appData && Array.isArray(appData.cases)) ? appData.cases : INITIAL_CASES;

      cases.forEach(c => {
        const cft = c.team || [];
        const isMember = cft.some(m => m.name && m.name.includes(user.name));
        
        // Ensure gates sanitized
        if (typeof ensureCaseGates === 'function') {
          ensureCaseGates(c);
        }
        const gates = c.gates || {};

        // A. DIRECT ELECTRONIC SIGN-OFF & APPROVAL TASKS (우선순위 최고: 1차/2차/3차 내부결재 및 4차 고객송부)
        ['gate3D', 'gate5D', 'gate8D'].forEach(gk => {
          const g = gates[gk];
          if (!g || !Array.isArray(g.approvers)) return;

          // Find the active pending approver
          for (let i = 0; i < g.approvers.length; i++) {
            const appr = g.approvers[i];
            if (appr.status !== 'Approved') {
              // If this pending step is for the current user
              if (appr.name.includes(user.name) || (i === 3 && user.name === '김성중')) {
                const isDispatch = (i === 3);
                tasks.push({
                  caseId: c.id,
                  customer: c.customer,
                  targetStage: 'reports-hub',
                  gateKey: gk,
                  stageCode: isDispatch ? '고객 송부' : '결재 대기',
                  urgency: 'critical',
                  isApproval: true,
                  stepNum: i + 1,
                  role: appr.role,
                  title: isDispatch 
                    ? `[고객사 공식 송부 대기] ${g.title} 내부 승인 완료 ➔ 고객사 송부 실행 필요` 
                    : `[전자 결재 승인 대기] ${g.title} (${appr.role}) 승인 필요`,
                  desc: isDispatch 
                    ? `3차 8D Champion 결재 완료됨. SLA 준수를 위해 ${c.customerContact || '고객품질팀'} 앞 메일 발송을 처리하세요.` 
                    : `이전 결재 단계 완료됨. 8D 공식 보고서 내용 검토 후 [${appr.name}] 님의 승인 서명을 완료하세요.`
                });
              }
              break; // Only the first pending approver in sequence is active
            }
          }
        });

        // B. ROLE-SPECIFIC 8D PROBLEM SOLVING TASKS
        // 1. 김성중 S.Pro (품질 실무 간사)
        if (user.name === '김성중') {
          if (cft.length < 4) {
            tasks.push({
              caseId: c.id,
              customer: c.customer,
              targetStage: 'D1',
              stageCode: 'D1. Team',
              urgency: 'high',
              isApproval: false,
              title: `[CFT 편성 누락] 전사 조직도에서 8D 리더 및 FA/물류 책임자 배속 필요`,
              desc: `현재 CFT 인원이 ${cft.length}명으로 부족합니다. 조직도에서 엔지니어를 추가 배속하세요.`
            });
          }
        }

        // 2. 김현수 실장 / 신덕용 팀장 (8D Leader)
        if (user.name === '김현수' || user.name === '신덕용' || user.roleDesc.includes('Leader')) {
          if (c.currentStage === 'D4' && (!c.d4?.candidateCauses || c.d4?.candidateCauses.length === 0)) {
            tasks.push({
              caseId: c.id,
              customer: c.customer,
              targetStage: 'D4',
              stageCode: 'D4. Root Cause',
              urgency: 'high',
              isApproval: false,
              title: `[원인분석 주관] 5-Why 및 물리적 FA 메커니즘 기술 검토 및 원인 확정 필요`,
              desc: `불량 현상(${c.claimTitle})에 대한 개발실 주관의 5-Why 원인 확정 및 검증이 필요합니다.`
            });
          }
        }

        // 3. 박재환 팀장 (FA 불량 분석 리더)
        if (user.name === '박재환' || user.roleDesc.includes('FA')) {
          const hasFAEvidence = (c.evidenceList || []).some(e => e.type === 'FA Analysis' || (e.linkedStages || []).includes('D4'));
          if (!hasFAEvidence) {
            tasks.push({
              caseId: c.id,
              customer: c.customer,
              targetStage: 'D4',
              stageCode: 'D4. FA 성적서',
              urgency: 'critical',
              isApproval: false,
              title: `[물리적 분석 증거 누락] Decap 및 SEM 단면 분석 성적서(EVD) 등록 필요`,
              desc: `불량 시료 ${c.defectQty}ea에 대한 X-Ray, Decap, SEM 단면 Crack 정밀 분석 보고서를 등록하세요.`
            });
          }
        }

        // 4. 이은산 센터장 (물류/자재 격리 책임자)
        if (user.name === '이은산' || user.roleDesc.includes('격리')) {
          const hasMaterialFlow = c.d3?.materialFlow && c.d3.materialFlow.length > 0;
          if (!hasMaterialFlow || c.currentStage === 'D1' || c.currentStage === 'D2' || c.currentStage === 'D3') {
            tasks.push({
              caseId: c.id,
              customer: c.customer,
              targetStage: 'D3',
              stageCode: 'D3. Containment',
              urgency: 'high',
              isApproval: false,
              title: `[긴급 재고 봉쇄] 평택공장 완제품 ERP 출하 락 및 원부자재 격리 조치 필요`,
              desc: `Lot ${c.lotNumber} 관련 창고 재고 및 협력사 입고분 100% 격리 현황을 확정하세요.`
            });
          }
        }

        // 5. 일반 CFT 팀원 (정현석, 이성우, 양태욱 등)
        if (isMember && user.name !== '김성중' && user.name !== '황승안') {
          tasks.push({
            caseId: c.id,
            customer: c.customer,
            targetStage: c.currentStage || 'D1',
            stageCode: `${c.currentStage} 단계`,
            urgency: 'normal',
            isApproval: false,
            title: `[CFT 참여] Case ${c.id} (${c.product}) 문제 해결 액션 실행`,
            desc: `현재 ${c.currentStage} 단계 작업 및 소속 부서별 개선 대책에 협업하세요.`
          });
        }
      });

      return tasks;
    }
