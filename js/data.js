/* ========================================================================= */
    /* MASTER DATA STORE & BENCHMARK CASES (PHILOSOPHY ALIGNED)                   */
    /* ========================================================================= */
    // V4 strictly enforces LGE DTV eMMC B2B dedicated benchmark cases.
    const STORAGE_KEY = 'AI_QMS_8D_DATA_V7_D3_COMPLETED_BENCHMARK';

    const INITIAL_CASES = [
      {
        id: 'RAMOS-8D-20260901-01',
        customer: 'LGE (LG전자)',
        customerContact: '최영수 책임 (DTV 품질보증팀)',
        customerEmail: 'ys.choi@lge.com',
        product: 'DTV eMMC 5.1 16GB (BGA153)',
        partNumber: 'MMACGD8J0F-KV0AF0-TPAG',
        internalPartNumber: 'MMACGD8J0F-HZRAF1-LPAGA00',
        mesPartId: 'MMACGD8J0F-HZRAF1',
        lotNumber: '0QH321200A02-LPAGA00',
        rawLotId: '0QH320000A02-TN',
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
        currentStage: 'D4', // D1~D3 완료 -> D4 검증 직행 케이스!
        status: 'In Progress', // Draft, In Progress, Under Review, Approved, Closed

        // D1 Confirmation & RACI Gate Cleared
        cftRecommendation: {
          status: 'Human Confirmed',
          humanConfirmed: true,
          confirmedAt: '2026-09-01 09:00',
          confirmedBy: { name: '황승안 팀장_상무', dept: '품질혁신팀', email: 'sahwang@ramostek.com' }
        },
        cftRaci: {
          acknowledged: true,
          confirmedAt: '2026-09-01 09:00',
          confirmedBy: { name: '황승안 팀장_상무', dept: '품질혁신팀', email: 'sahwang@ramostek.com' }
        },

        // D1: Cross-Functional Team
        team: [
          { role: '8D Champion', name: '황승안 팀장_상무', dept: '품질혁신팀', contact: 'sahwang@ramostek.com', status: 'Active' },
          { role: '8D Leader (연구소/개발 주관)', name: '김현수 실장_상무', dept: 'Flash 개발실', contact: 'hskim@ramostek.com', status: 'Active' },
          { role: 'Technical / FA Lead', name: '박재환 팀장_S.Pro', dept: 'Flash 개발2팀 (FA신뢰성)', contact: 'jhpark@ramostek.com', status: 'Active' },
          { role: 'Process Engineer (공정기술)', name: '이성우 팀장_P.Pro', dept: 'Flash 개발3팀', contact: 'fog1007@ramostek.com', status: 'Active' },
          { role: 'Material Containment Lead', name: '이은산 센터장_상무', dept: '제조기획센터', contact: 'eunsan.lee@ramostek.com', status: 'Active' },
          { role: '외주(조립처) 물량 관리', name: '공아름 그룹장_P.Pro', dept: '계획운영그룹', contact: 'loveskr@ramostek.com', status: 'Active' },
          { role: 'CTST 라인·재공 관리', name: '조철민 그룹장_P.Pro', dept: '자원운영그룹', contact: 'nrjcm@ramostek.com', status: 'Active' },
          { role: '8D Quality Facilitator / 실무', name: '김성중 S.Pro', dept: '품질혁신팀', contact: 'sjkim@ramostek.com', status: 'Active' }
        ],

        // D2: Problem Description (Strict Fact vs Hypothesis Separation - APPROVED)
        d2: {
          approval: {
            status: 'Approved',
            humanConfirmed: true,
            approvedAt: '2026-09-01 10:30',
            approvedBy: { name: '황승안 팀장_상무', dept: '품질혁신팀', email: 'sahwang@ramostek.com' }
          },
          problemStatement: '2026년 8월 31일 22시 15분, LGE 평택 스마트 DTV SMT 3라인에서 Post-Reflow 통전 시 DTV eMMC 5.1 16GB(MMACGD8J0F-KV0AF0-TPAG, Lot #0QH321200A02-LPAGA00) 12대에서 Boot CID Read Fail 및 VCC-VSS 단락(0.8Ω) 불량이 적출되어 1,200 PPM이 기록되었으며, 긴급 출하 락 및 격리 조치를 시행함.',
          problemWhat: 'eMMC Boot CID Read Fail 및 CMD1 Ready Timeout (Error Code: 0x04)',
          problemWhere: 'LGE 평택 스마트 DTV 양산 실장 라인 (SMT Post-Reflow ICT Test)',
          problemWhen: '2026년 8월 31일 22시 15분 야간 양산 가동 중 초물 검출',
          problemWho: 'LGE SMT 공정 라인 검사원 (공정 품질 검사)',
          problemWhich: 'Part: MMACGD8J0F-KV0AF0-TPAG / Lot: #0QH321200A02-LPAGA00 (16GB BGA153)',
          problemHow: 'Reflow 실장 후 Power-on Booting 시그널 인가 시 12ea 응답 없음 (VCC-VSS Short 측정됨)',
          problemHowMany: '12 / 10,000ea (1,200 PPM)',

          isIsNot: [
            { factor: 'Product', is: 'DTV eMMC 5.1 16GB (BGA153)', isNot: 'eMMC 32GB / 128GB 동일 패키지' },
            { factor: 'Lot No.', is: '0QH321200A02-LPAGA00 (8월 4주차 생산)', isNot: '0QH321200A01-LPAGA00 (이전 정상 출하 Lot)' },
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

        // D3: Containment Actions (Action-based & 7-Area Material Flow - APPROVED)
        d3: {
          approval: {
            status: 'Approved',
            humanConfirmed: true,
            approvedAt: '2026-09-01 14:00',
            approvedBy: { name: '황승안 팀장_상무', dept: '품질혁신팀', email: 'sahwang@ramostek.com' }
          },
          inventorySources: {
            erp: {
              RAK4: { warehouse: 'RAK4', lot: '0QH321200A02-LPAGA00', currentQty: 1675, holdQty: 1675, evidence: 'ERP-HLD-RAK4-01', verified: true },
              RAK5: { warehouse: 'RAK5', lot: '0QH321200A02-LPAGA00', currentQty: 40, holdQty: 40, evidence: 'ERP-HLD-RAK5-01', verified: true }
            },
            mes: {
              verified: true,
              evidence: 'MES-WIP-HLD-01',
              processStocks: [
                { process: 'SHORT TEST', lot: '0QH321200A02', currentQty: 1458, holdQty: 1458, status: 'HOLD완료', evidence: 'MES-WIP-01' },
                { process: 'BI 1차', lot: '0QH321200A02', currentQty: 150, holdQty: 150, status: 'HOLD완료', evidence: 'MES-WIP-02' }
              ]
            }
          },
          lotScope: {
            affectedLot: '0QH321200A02-LPAGA00 (원Wafer Lot: 0QH320000A02-TN)',
            adjacentLots: '0QH321200A03-LPAGA00 (직후 인접), A05, A06',
            rawMaterialBatch: 'Wafer Inked NAND Die 특정 배치 #W-2608 및 MLCC #C2608',
            equipment: '오창 1공장 RF01 SMT 3라인 Reflow 및 TechL 외주라인',
            rationale: '동일 Wafer 원Lot 및 동일 SMT 프로파일/야간 시간대 투입분 전량 격리'
          },
          effectiveness: {
            noAdditionalClaim: 'yes',
            lineStable: 'yes',
            stockReconciled: 'yes',
            verificationEvidence: 'LGE 평택 3라인 48시간 무결함 가동 확인 및 ERP/MES 실재고 대사 완료',
            conclusionText: '7대 관리 영역 전반에 걸친 출하 차단 및 100% 전기적 선별로 유출 위험 0건 입증 완료'
          },
          materialFlow: [
            { area: '1. Supplier (원자재 협력사)', lot: 'Capacitor #C2608', totalQty: 100000, holdQty: 100000, screenQty: 5000, ngQty: 0, status: 'Hold & Audit', evidence: 'Supplier Lock Notice #SL-260901' },
            { area: '2. Ramos WIP (당사 재공품)', lot: '0QH321200A02-LPAGA00', totalQty: 15000, holdQty: 15000, screenQty: 15000, ngQty: 0, status: '100% Lock', evidence: 'MES WIP Lock ID #WIP-901' },
            { area: '3. Ramos FG (당사 완제품 재고)', lot: '0QH321200A02-LPAGA00', totalQty: 45000, holdQty: 45000, screenQty: 45000, ngQty: 0, status: 'Shipment Blocked', evidence: 'ERP Hold Record #ERP-8D-01' },
            { area: '4. In-Transit (운송 중 재고)', lot: '0QH321200A02-LPAGA00', totalQty: 8000, holdQty: 8000, screenQty: 0, ngQty: 0, status: 'Recalled', evidence: 'Logistics Recall Ack #TR-881' },
            { area: '5. Customer WH (고객사 창고 재고)', lot: '0QH321200A02-LPAGA00', totalQty: 22000, holdQty: 22000, screenQty: 22000, ngQty: 0, status: 'Customer Hold', evidence: 'LGE WH Isolation Mail' },
            { area: '6. Customer Production (고객사 라인)', lot: '0QH321200A02-LPAGA00', totalQty: 10000, holdQty: 10000, screenQty: 10000, ngQty: 12, status: '100% Screened', evidence: 'LGE Line Screening Sheet' },
            { area: '7. Field / Market (시장 유출 재고)', lot: '0QH321200A02-LPAGA00', totalQty: 0, holdQty: 0, screenQty: 0, ngQty: 0, status: 'Zero Leakage', evidence: 'LGE TV Outflow Check: Complete' }
          ],
          actions: [
            { id: 'ICA-01', target: '사내 창고 (RAK4/5) & CTST 공정', action: 'ERP 완제품 출하 전면 잠금(Shipment Lock) 및 CTST MES 재공품 HOLD 태그 부착', owner: '조철민 그룹장_P.Pro (자원운영그룹)', due: '2026-09-01 09:30', completion: '2026-09-01 09:15', result: 'RAK4 1,675ea 출하 잠금 및 CTST 재공 1,608ea 격리 완료', status: 'Completed', evidence: 'ERP Hold 전표 #ERP-HLD-01' },
            { id: 'ICA-02', target: '외주 가공처 (TechL 라인)', action: 'TechL 외주 SMT/TEST 공정 작업 중지 및 SHORT TEST 잔여 재공 일괄 격리 통보', owner: '김혜원 Pro (외주운영그룹)', due: '2026-09-01 10:30', completion: '2026-09-01 10:10', result: 'TechL SMT 3라인 가동 일시 중단 및 공정 락 통보 공문 발송', status: 'Completed', evidence: 'TechL 라인스톱 접수증 #TL-260901' },
            { id: 'ICA-03', target: '운송 중 물류 (In-Transit)', action: '평택행 출하 트럭 송장 추적 및 운송사 유선 통보하여 오창 창고 회차 조치', owner: '남서현 Pro (전략소싱팀 LGE 영업)', due: '2026-09-01 11:30', completion: '2026-09-01 11:00', result: '운송 중 8,000ea 트럭 회차 완료 및 RAK4 입고 대기 전환', status: 'Completed', evidence: '물류사 회차 확인서 #LOGI-881' },
            { id: 'ICA-04', target: '고객사 (LGE 평택 DTV 라인)', action: 'LGE 평택 DTV SMT 3라인 투입 중단 긴급 공문 발송 및 고객 창고 재고 격리 요청', owner: '이하영 Pro (전략소싱팀 LGE CS)', due: '2026-09-01 12:00', completion: '2026-09-01 11:40', result: 'LGE 품질팀 접수 확인 및 메인보드 SMT 투입 차단 완료', status: 'Completed', evidence: 'LGE CS 접수 회신 메일' },
            { id: 'ICA-05', target: '고객사 현장 전기 선별', action: 'LGE 평택 공장 현장 CS 급파, VCC-VSS 저항 0.8Ω 단락 선별 지그 기반 100% 전수 검사', owner: '박재환 팀장_S.Pro (Flash개발2팀 FA Lead)', due: '2026-09-02 08:30', completion: '2026-09-01 18:00', result: 'LGE 잔여 10,000ea 전수 측정 중 12ea 단락 적출, 9,988ea 양품 판정', status: 'Completed', evidence: '현장 선별 성적서 #EVD-02' }
          ],
          effectivenessStatement: '확인된 Affected Lot(#0QH321200A02-LPAGA00) 및 관리대상 재고 전량(100,000ea)에 대한 출하 차단·격리·선별 조치 완료. 공정 및 완제품 단계 유출 방지 조치 완결됨.'
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
            { product: 'DTV eMMC 5.1 16GB (BGA153) (RM-EM51-032G)', samePartUsed: 'Yes (X5R 적용 확인)', sameRisk: 'Yes (High)', action: 'BOM Rev.B로 즉시 X7R 변경 완료', status: 'Closed' },
            { product: 'DTV eMMC 5.1 16GB (BGA153) (RM-EM51-064G)', samePartUsed: 'Yes (개선 대상)', sameRisk: 'Yes (High)', action: 'ECN-260901 적용 완결', status: 'Closed' },
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

        // 3-Step Sign-Off History (D1, D2, D3 Approved!)
        signOffHistory: {
          D1: {
            status: 'Approved',
            drafter: { name: '김성중 S.Pro', dept: '품질혁신팀', email: 'sjkim@ramostek.com', signedAt: '2026-09-01 08:45' },
            leader: { name: '김현수 실장_상무', dept: 'Flash 개발실', email: 'hskim@ramostek.com', signedAt: '2026-09-01 08:50' },
            champion: { name: '황승안 팀장_상무', dept: '품질혁신팀', email: 'sahwang@ramostek.com', signedAt: '2026-09-01 09:00' }
          },
          D2: {
            status: 'Approved',
            drafter: { name: '김성중 S.Pro', dept: '품질혁신팀', email: 'sjkim@ramostek.com', signedAt: '2026-09-01 10:00' },
            leader: { name: '김현수 실장_상무', dept: 'Flash 개발실', email: 'hskim@ramostek.com', signedAt: '2026-09-01 10:15' },
            champion: { name: '황승안 팀장_상무', dept: '품질혁신팀', email: 'sahwang@ramostek.com', signedAt: '2026-09-01 10:30' }
          },
          D3: {
            status: 'Approved',
            drafter: { name: '김성중 S.Pro', dept: '품질혁신팀', email: 'sjkim@ramostek.com', signedAt: '2026-09-01 13:00' },
            leader: { name: '김현수 실장_상무', dept: 'Flash 개발실', email: 'hskim@ramostek.com', signedAt: '2026-09-01 13:30' },
            champion: { name: '황승안 팀장_상무', dept: '품질혁신팀', email: 'sahwang@ramostek.com', signedAt: '2026-09-01 14:00' }
          }
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
        customer: 'LGE (LG전자 HE사업본부 DTV)',
        customerContact: '김성식 책임 (HE DTV SMT품질팀)',
        customerEmail: 'ss.kim@lge.com',
        product: 'DTV eMMC 5.1 16GB (BGA153)',
        partNumber: 'MMACGD8J0F-KV0AF0-TPAG',
        internalPartNumber: 'MMACGD8J0F-HZRAF1-LPAGA00',
        mesPartId: 'MMACGD8J0F-HZRAF1',
        lotNumber: '0QH321200A05-LPAGA00',
        rawLotId: '0QH320000A05-TN',
        mfgSite: 'RAMOS 오창 1공장 SMT 2라인',
        incidentSite: 'LGE 평택 DTV Main Board 실장 2라인',
        application: 'LGE Smart DTV 메인보드 OS 및 저장 스토리지',
        receiptDate: '2026-09-02 10:00',
        incidentDate: '2026-09-01 19:30',
        dueDateInitial: '2026-09-03 10:00',
        dueDateFinal: '2026-09-20 18:00',
        defectQty: 5,
        inspectQty: 5000,
        ppm: 1000,
        claimTitle: 'LGE DTV 메인보드 SMT 실장 후 Cold Boot 시 eMMC 초기화 응답 불가 및 Read Timeout 발생',
        severityLevel: 'Critical',
        lineStop: true,
        safetyRisk: false,
        recurrentDefect: false,
        currentStage: 'D2',
        status: 'In Progress',
        team: [
          { role: '8D Champion', name: '황승하 상무', dept: '품질혁신팀', contact: 'sahwang@ramostek.com', status: 'Active' },
          { role: 'Customer Response Owner', name: '이하영 Pro', dept: '전략소싱팀', contact: 'lhyduddlgk@ramostek.com', status: 'Active' },
          { role: '8D Leader (연구소/개발 주관)', name: '김현수 상무', dept: 'Flash 개발실', contact: 'hskim@ramostek.com', status: 'Active' },
          { role: 'Technical / FA Lead', name: '박재환 팀장_S.Pro', dept: 'Flash 개발2팀', contact: 'jhpark@ramostek.com', status: 'Active' },
          { role: '8D Quality Facilitator / 실무', name: '김성중 Senior Pro', dept: '품질혁신팀', contact: 'sjkim@ramostek.com', status: 'Active' }
        ],
        d2: {
          problemWhat: 'DTV 부팅 시 U-Boot 단계에서 eMMC CMD1 응답 타임아웃 및 Read Retry 발생',
          problemWhere: 'LGE 평택 DTV Main Board 실장 2라인 검사 공정',
          problemWhen: '2026.09.01 19:30',
          problemWho: 'LGE DTV SMT품질팀 김성식 책임',
          problemWhich: 'MMACGD8J0F-KV0AF0-TPAG / Lot #0QH321200A05-LPAGA00',
          problemHow: 'SMT 리플로우 후 Initial Boot 단계에서 Inked NAND Bad Block 테이블 매핑 지연',
          problemHowMany: '5 / 5,000ea (1,000 PPM)',
          isIsNot: [],
          hypotheses: [
            { id: 'HYP-01', title: '당사 패키징 적용 Inked NAND Die의 Cold Boot 블록 마진 부족 및 WLT Inking 맵 대조 필요성', confidence: 'High', status: 'Under Investigation (연구소 내부 분석)', confidence: 'High', status: 'Under Investigation', requiredEvidence: ['NAND WLT Inking 맵 데이터', 'NAND CS 단면 SEM'] }
          ]
        },
        d3: { materialFlow: [], actions: [], effectivenessStatement: '해당 Inked NAND Lot 출하 잠금 및 LGE 평택 라인 재고 격리 완료' },
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
        cases: JSON.parse(JSON.stringify(INITIAL_CASES)),
        intakeQueue: [],
        activeIntakeId: null,
        activeCaseId: INITIAL_CASES[0]?.id || null,
        currentView: 'dashboard',
        activeStage: 'overview',
        sidebarTab: 'menu'
      };

      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
          return defaultState;
        }
        const parsed = JSON.parse(raw);

        // Auto-migration: If stored data contains outdated third-party customers (Samsung/Hynix/Automotive), reset to clean LGE DTV state!
        const hasOutdatedData = parsed && Array.isArray(parsed.cases) && parsed.cases.some(c =>
          c.customer && (c.customer.includes('Samsung') || c.customer.includes('hynix') || c.customer.includes('삼성') || c.customer.includes('하이닉스') || c.customer.includes('전장') || c.customer.includes('Automotive'))
        );

        if (hasOutdatedData) {
          console.log('[AI-QMS] Outdated benchmark data detected. Auto-migrating to LGE DTV eMMC benchmark state.');
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
          return defaultState;
        }

        // Case A: Parsed is legacy array of cases
        if (Array.isArray(parsed)) {
          return {
            ...defaultState,
            cases: parsed
          };
        }

        // Case B: Parsed is appData object
        if (parsed && typeof parsed === 'object') {
          const validCases = Array.isArray(parsed.cases) ? parsed.cases : [];

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

          const validActiveId = validCases.some(c => c.id === parsed.activeCaseId) ? parsed.activeCaseId : (validCases[0]?.id || null);
          return {
            cases: validCases,
            intakeQueue: Array.isArray(parsed.intakeQueue) ? parsed.intakeQueue : [],
            activeIntakeId: parsed.activeIntakeId || null,
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
      if (!appData || !Array.isArray(appData.cases) || appData.cases.length === 0) return null;
      const found = appData.cases.find(c => c.id === appData.activeCaseId) || appData.cases[0];
      if (found && appData.activeCaseId !== found.id) appData.activeCaseId = found.id;
      return found || null;
    }

    // =========================================================================
    // CURRENT LOGGED-IN USER & PERSONALIZED TASK ENGINE
    // =========================================================================
    const PRESET_USERS = [
      { username: 'sjkim', name: '김성중', position: 'Senior Pro', dept: '품질혁신팀', email: 'sjkim@ramostek.com', roleDesc: '8D 품질 실무 간사 / Facilitator', isMaster: true },
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
            roleDesc: preset?.roleDesc || 'CFT 유관부서 담당자',
            isMaster: Boolean(preset?.isMaster)
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

    function hasMasterAuthority(user = CURRENT_USER) {
      return Boolean(user?.isMaster || user?.email === 'sjkim@ramostek.com');
    }

    function getUserPendingTasks(user = CURRENT_USER) {
      const tasks = [];
      const cases = (appData && Array.isArray(appData.cases)) ? appData.cases : INITIAL_CASES;
      const intakeQueue = (appData && Array.isArray(appData.intakeQueue)) ? appData.intakeQueue : [];
      const canReviewIntake = hasMasterAuthority(user) || user?.dept === '품질혁신팀';

      if (canReviewIntake) {
        intakeQueue
          .filter(item => ['Quality Review Pending', 'Quality Review In Progress'].includes(item.status))
          .forEach(item => {
            tasks.unshift({
              caseId: item.intakeId,
              customer: item.customer,
              targetStage: 'intake-triage',
              stageCode: 'STEP 02. Triage',
              urgency: item.riskSignals?.lineStop || item.riskSignals?.safetyRisk ? 'critical' : 'high',
              isApproval: false,
              title: item.status === 'Quality Review Pending' ? '[신규 접수 품질 검토 대기]' : '[품질 검토 진행 중]',
              desc: `${item.customer} · ${item.product} · ${item.claimTitle}`
            });
          });
      }

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


    window.resetToReal16GBData = function() {
      localStorage.removeItem('AI_QMS_8D_DATA_V4');
      localStorage.removeItem('AI_QMS_8D_DATA_V5_REAL_16GB');
      localStorage.removeItem('AI_QMS_8D_DATA_V6_REAL_SCM_ACTION');
      localStorage.removeItem('AI_QMS_8D_DATA_V7_D3_COMPLETED_BENCHMARK');
      localStorage.removeItem('AI_QMS_8D_DATA_V3');
      location.reload();
    };
