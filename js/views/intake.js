/* VIEW 2: STEP 01. NEW CASE INTAKE (AI 스마트 인입 & SEVERITY 엔진)             */
    /* ========================================================================= */
    let intakeFiles = [];

    const INTAKE_PRESETS = {
      lge: {
        customer: 'LGE (LG전자)',
        customerContact: '최영수 책임 (DTV 품질보증팀)',
        customerEmail: 'ys.choi@lge.com',
        product: 'eMMC 5.1 64GB (BGA153)',
        partNumber: 'RM-EM51-064G-X1',
        lotNumber: 'EM2608-DTV01',
        mfgSite: 'RAMOS 오창 1공장 SMT 3라인',
        incidentSite: 'LGE 평택 DTV Main Board 실장 라인',
        defectQty: 12,
        inspectQty: 10000,
        claimTitle: 'LGE DTV Main Board SMT Post-Reflow 시 eMMC Boot CID Read Timeout 및 12ea VCC-VSS Short 단락 측정됨.',
        lineStop: 'true',
        safetyRisk: 'false',
        recurrentDefect: 'false',
        sampleFileName: 'LGE_Groupware_Claim_Mail_Capture.png (그룹웨어 메일 캡쳐)'
      },
      samsung: {
        customer: 'Samsung Electronics (메모리사업부)',
        customerContact: '강민규 프로 (SSD QA팀)',
        customerEmail: 'mg.kang@samsung.com',
        product: 'PCIe Gen4 Enterprise SSD 3.84TB',
        partNumber: 'RM-SSD4-384T',
        lotNumber: 'SS2608-NV04',
        mfgSite: 'RAMOS 오창 2공장 SSD 라인',
        incidentSite: 'Samsung Server System Validation Lab',
        defectQty: 2,
        inspectQty: 500,
        claimTitle: '서버 챔버 70℃ High-Temperature 4K Random Read Stress 중 PCIe Gen4 Link Drop 및 Controller Hang 발생',
        lineStop: 'false',
        safetyRisk: 'false',
        recurrentDefect: 'false',
        sampleFileName: 'Samsung_SSD_Defect_Notice.xlsx (불량통보서 엑셀)'
      },
      hynix: {
        customer: 'SK hynix (DRAM 사업부)',
        customerContact: '윤태석 수석 (고객지원실)',
        customerEmail: 'ts.yoon@skhynix.com',
        product: 'DDR4 SODIMM 16GB (3200Mbps)',
        partNumber: 'RM-DDR4-16G-SO',
        lotNumber: 'HY2608-DM02',
        mfgSite: 'RAMOS 오창 1공장 PKG 라인',
        incidentSite: 'SK hynix 이천 모듈 테스트 라인',
        defectQty: 5,
        inspectQty: 2000,
        claimTitle: 'DRAM Ball Grid BGA X-Ray 검사 시 Center 패드 Void율 28% 초과 (규격 < 15%) 기준 미달 적출',
        lineStop: 'true',
        safetyRisk: 'false',
        recurrentDefect: 'true',
        sampleFileName: 'SK_Hynix_Quality_Claim_Official.pdf (고객사 공식 공문 PDF)'
      }
    };

    function renderNewCaseView() {
      return `
        <div style="max-width: 960px; margin: 0 auto;">
          <div style="margin-bottom: 20px;">
            <h1 style="font-size: 1.35rem; font-weight: 800; color: #f8fafc; display:flex; align-items:center; gap:8px;">
              <i data-lucide="plus-circle" style="color: #38bdf8;"></i> STEP 01. 신규 부적합 접수 & 8D Case 생성
            </h1>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">
              그룹웨어 메일 캡쳐(이미지), 고객 공문(PDF/Word), 불량 내역(Excel)을 <b>드래그 또는 붙여넣기(Ctrl+V)</b>하면 AI가 자동으로 폼을 완성합니다.
            </p>
          </div>

          <!-- TOP AI SMART INGEST HERO CARD -->
          <div class="intake-hero-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
              <div style="font-size:0.92rem; font-weight:800; color:#60a5fa; display:flex; align-items:center; gap:7px;">
                <i data-lucide="sparkles" style="color:#38bdf8; width:18px; height:18px;"></i>
                AI 스마트 문서 파싱 & 자동 입력 (Auto-Ingest)
              </div>
              <span class="badge-pill badge-ok">OCR & Document AI Engine Active</span>
            </div>

            <!-- Drag & Drop Zone + Clipboard Paste Zone -->
            <div id="intakeDropZone" class="dropzone-box" onclick="document.getElementById('intakeFileInput').click()" ondragover="handleDragOver(event)" ondragleave="handleDragLeave(event)" ondrop="handleFileDrop(event)">
              <input type="file" id="intakeFileInput" style="display:none;" multiple accept=".pdf,.docx,.xlsx,.xls,.eml,.msg,.txt,.png,.jpg,.jpeg" onchange="handleFileSelect(event)">
              
              <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
                <div style="width:44px; height:44px; border-radius:50%; background:rgba(59, 130, 246, 0.15); display:flex; align-items:center; justify-content:center;">
                  <i data-lucide="upload-cloud" style="width:24px; height:24px; color:#38bdf8;"></i>
                </div>
                <div style="font-size:0.9rem; font-weight:700; color:#f8fafc;">
                  그룹웨어 메일 캡쳐 / 엑셀 / PDF / Word 파일을 여기에 끌어다 놓으세요
                </div>
                <div style="font-size:0.75rem; color:#94a3b8;">
                  또는 화면 캡쳐 후 어디서든 <b style="color:#60a5fa; background:#1e293b; padding:2px 6px; border-radius:4px;">Ctrl + V</b> 로 즉시 붙여넣기 가능 (PDF, DOCX, XLSX, PNG, JPG, EML)
                </div>
              </div>

              <!-- Attached Files Display -->
              <div id="attachedFilesList" style="display:flex; flex-wrap:wrap; justify-content:center; gap:8px; margin-top:10px;"></div>
            </div>

            <!-- Demo Quick Presets & AI Parse Button -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; flex-wrap:wrap; gap:10px;">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <span style="font-size:0.72rem; color:var(--text-muted); font-weight:700;">빠른 시나리오 프리셋:</span>
                <button type="button" class="preset-pill-btn" onclick="applyIntakePreset('lge')">
                  <i data-lucide="image" style="width:12px; height:12px; color:#60a5fa;"></i> [LGE] eMMC Boot Fail 메일 캡쳐
                </button>
                <button type="button" class="preset-pill-btn" onclick="applyIntakePreset('samsung')">
                  <i data-lucide="file-spreadsheet" style="width:12px; height:12px; color:#10b981;"></i> [삼성전자] SSD Link Drop 통보서.xlsx
                </button>
                <button type="button" class="preset-pill-btn" onclick="applyIntakePreset('hynix')">
                  <i data-lucide="file-text" style="width:12px; height:12px; color:#fbbf24;"></i> [SK하이닉스] DRAM Void 공문.pdf
                </button>
              </div>

              <button type="button" class="btn btn-primary" onclick="triggerAIExtraction()" style="box-shadow: 0 4px 14px rgba(37,99,235,0.4);">
                <i data-lucide="wand-2" style="width:14px; height:14px;"></i> ✨ AI 스마트 자동 추출 & 폼 채우기
              </button>
            </div>

            <div id="aiParseNotification" style="display:none; margin-top:12px; background:rgba(16,185,129,0.15); border:1px solid #10b981; border-radius:6px; padding:10px 14px; font-size:0.8rem; color:#34d399; font-weight:600; display:flex; align-items:center; gap:8px;">
              <i data-lucide="check-circle" style="width:16px; height:16px;"></i>
              <span id="aiParseNotificationText">문서에서 14개 품질 메타데이터가 성공적으로 추출되어 하단 폼에 자동 입력되었습니다.</span>
            </div>
          </div>

          <!-- FORM START -->
          <form id="newCaseForm" onsubmit="handleCreateCase(event)">
            <div class="card">
              <div class="card-header">
                <div class="card-title">
                  <i data-lucide="info" style="color:#60a5fa; width:16px; height:16px;"></i> 기본 접수 정보 (Customer & Product)
                </div>
                <span class="badge-pill badge-ok" id="formAutofillBadge">READY</span>
              </div>

              <div class="grid-3">
                <div class="form-group">
                  <label class="form-label">고객사 <span class="required">*</span></label>
                  <input type="text" id="formCustomer" name="customer" class="form-control" placeholder="예: LGE (LG전자)" required value="LGE (LG전자)">
                </div>
                <div class="form-group">
                  <label class="form-label">고객 담당자 <span class="required">*</span></label>
                  <input type="text" id="formCustomerContact" name="customerContact" class="form-control" placeholder="예: 최영수 책임" required value="최영수 책임 (DTV 품질)">
                </div>
                <div class="form-group">
                  <label class="form-label">고객 이메일</label>
                  <input type="email" id="formCustomerEmail" name="customerEmail" class="form-control" placeholder="ys.choi@lge.com" value="ys.choi@lge.com">
                </div>
              </div>

              <div class="grid-3">
                <div class="form-group">
                  <label class="form-label">제품명 (Product) <span class="required">*</span></label>
                  <input type="text" id="formProduct" name="product" class="form-control" placeholder="예: eMMC 5.1 64GB" required value="eMMC 5.1 64GB (BGA153)">
                </div>
                <div class="form-group">
                  <label class="form-label">Part Number</label>
                  <input type="text" id="formPartNumber" name="partNumber" class="form-control" placeholder="RM-EM51-064G-X1" value="RM-EM51-064G-X1">
                </div>
                <div class="form-group">
                  <label class="form-label">Lot Number <span class="required">*</span></label>
                  <input type="text" id="formLotNumber" name="lotNumber" class="form-control" placeholder="EM2608-DTV01" required value="EM2608-DTV01">
                </div>
              </div>

              <div class="grid-2">
                <div class="form-group">
                  <label class="form-label">생산 Site (당사 공장)</label>
                  <input type="text" id="formMfgSite" name="mfgSite" class="form-control" value="RAMOS 오창 1공장 SMT 3라인">
                </div>
                <div class="form-group">
                  <label class="form-label">발생 Site (고객사 공정)</label>
                  <input type="text" id="formIncidentSite" name="incidentSite" class="form-control" value="LGE 평택 DTV Main Board 실장 라인">
                </div>
              </div>

              <div class="grid-3">
                <div class="form-group">
                  <label class="form-label">불량수량 (Defect Qty) <span class="required">*</span></label>
                  <input type="number" id="inputDefectQty" name="defectQty" class="form-control" value="12" min="0" required oninput="calculatePPM()" onkeyup="calculatePPM()" onchange="calculatePPM()">
                </div>
                <div class="form-group">
                  <label class="form-label">검사/투입 수량 (Inspect Qty) <span class="required">*</span></label>
                  <input type="number" id="inputInspectQty" name="inspectQty" class="form-control" value="10000" min="1" required oninput="calculatePPM()" onkeyup="calculatePPM()" onchange="calculatePPM()">
                </div>
                <div class="form-group">
                  <label class="form-label">불량률 (PPM & %)</label>
                  <input type="text" id="calculatedPPM" class="form-control num-mono" value="1,200 PPM (0.12%)" readonly style="background:#1e293b; color:#fbbf24; font-weight:800; font-size:0.95rem;">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Claim 내용 및 고객 불만 현상 <span class="required">*</span></label>
                <textarea id="formClaimTitle" name="claimTitle" class="form-control" rows="3" required placeholder="고객사에서 인입된 불량 현상을 상세히 기록하십시오.">LGE DTV Main Board SMT Post-Reflow 시 eMMC Boot CID Read Timeout 및 12ea VCC-VSS Short 단락 측정됨.</textarea>
              </div>
            </div>

            <!-- Severity & AI Rule Decision Card -->
            <div class="card">
              <div class="card-header">
                <div class="card-title">
                  <i data-lucide="shield-alert" style="color:#ef4444; width:16px; height:16px;"></i> Severity & 8D 트리거 판정 요소
                </div>
              </div>

              <div class="grid-3">
                <div class="form-group">
                  <label class="form-label">고객사 Line Stop 여부</label>
                  <select id="formLineStop" name="lineStop" class="form-control" onchange="autoEvaluateSeverity()">
                    <option value="true" selected>Yes (라인 중단 발생 - Critical)</option>
                    <option value="false">No (정상 가동)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Safety / 화재 리스크</label>
                  <select id="formSafetyRisk" name="safetyRisk" class="form-control" onchange="autoEvaluateSeverity()">
                    <option value="false" selected>No (해당 없음)</option>
                    <option value="true">Yes (발화/폭발/안전 위협)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">동일 불량 재발 여부</label>
                  <select id="formRecurrentDefect" name="recurrentDefect" class="form-control" onchange="autoEvaluateSeverity()">
                    <option value="false" selected>No (최초 발생)</option>
                    <option value="true">Yes (과거 유사 재발 이력 있음)</option>
                  </select>
                </div>
              </div>

              <!-- AI Auto Decision Result Box -->
              <div id="aiDecisionResultBox" style="background: rgba(59, 130, 246, 0.08); border: 1px solid #3b82f6; border-radius: var(--radius-sm); padding: 14px 16px; margin-top: 10px;">
                <div style="font-size:0.85rem; font-weight:700; color:#60a5fa; display:flex; align-items:center; gap:6px;">
                  <i data-lucide="sparkles" style="width:16px; height:16px;"></i> AI 시스템 자동 판정 결과
                </div>
                <div style="margin-top: 8px; font-size:0.8rem; color:#e2e8f0; display:grid; grid-template-columns: repeat(3, 1fr); gap:12px;">
                  <div>
                    <span style="color:var(--text-muted);">8D Report 필요 여부:</span>
                    <span id="decision8DRequired" style="font-weight:700; color:#34d399;">● 8D 필수 발행 대상 (Mandatory)</span>
                  </div>
                  <div>
                    <span style="color:var(--text-muted);">긴급 대응 Level:</span>
                    <span id="decisionSeverityLevel" style="font-weight:700; color:#f87171;">● CRITICAL (Level 1)</span>
                  </div>
                  <div>
                    <span style="color:var(--text-muted);">Initial 3D SLA Due:</span>
                    <span id="decisionSlaDue" style="font-weight:700; color:#fbbf24;" class="num-mono">24시간 이내 (D3 봉쇄 필수)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- CFT Leadership Assignment Card (실장 / 센터장 / 임원급 전용) -->
            <div class="card" style="border: 1px solid #3b82f6; background: rgba(13, 21, 39, 0.7);">
              <div class="card-header" style="border-bottom: 1px solid rgba(59, 130, 246, 0.2);">
                <div class="card-title" style="color: #60a5fa;">
                  <i data-lucide="shield-check" style="color:#38bdf8; width:16px; height:16px;"></i> 초동 CFT 핵심 리더십 지정 (연구소·센터장·임원급)
                </div>
                <span class="badge-pill badge-purple" style="font-size:0.68rem;">연구소 / 센터장 / 임원급</span>
              </div>

              <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:14px;">
                부적합 문제 해결을 주관할 <b>연구소 개발실장/팀장</b> 및 전사 의사결정 권한을 가진 <b>센터장/임원급</b>을 지정합니다. (품질 실무: <b>김성중 S.Pro</b> 기본 배속)
              </p>

              <div class="grid-2">
                <div class="form-group">
                  <label class="form-label">
                    <span>👑 8D 챔피언 (Champion / 총괄 승인권자) <span class="required">*</span></span>
                    <span style="font-size:0.68rem; color:#60a5fa;">상무/전무/부사장급</span>
                  </label>
                  <select id="formChampion" name="cftChampion" class="form-control" required>
                    <option value="황승안 팀장_상무|품질혁신팀|sahwang@ramostek.com" selected>황승안 팀장_상무 (품질혁신팀) — sahwang@ramostek.com</option>
                    <option value="손동우 실장_부사장|전략 마케팅실|bigsohn@ramostek.com">손동우 실장_부사장 (전략 마케팅실) — bigsohn@ramostek.com</option>
                    <option value="윤석재 COO_부사장|COO 직속|sjyun@ramostek.com">윤석재 COO_부사장 (COO 직속) — sjyun@ramostek.com</option>
                    <option value="박정훈 부문장_전무|알앤디부문|gh8229@ramostek.com">박정훈 부문장_전무 (알앤디부문) — gh8229@ramostek.com</option>
                    <option value="이제현 부문장_전무|전략경영부문|jaylee@ramostek.com">이제현 부문장_전무 (전략경영부문) — jaylee@ramostek.com</option>
                    <option value="조장호 대표이사|대표이사|jh.choue66@ramostek.com">조장호 대표이사 (대표이사) — jh.choue66@ramostek.com</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span>🎖️ 8D 리더 (8D Leader / 연구소·개발 주관) <span class="required">*</span></span>
                    <span style="font-size:0.68rem; color:#34d399;">연구소 실장/팀장/본부장급</span>
                  </label>
                  <select id="formLeader" name="cftLeader" class="form-control" required>
                    <option value="김현수 실장_상무|Flash 개발실|hskim@ramostek.com" selected>김현수 실장_상무 (Flash 개발실) — hskim@ramostek.com</option>
                    <option value="박철홍 실장_상무|DRAM 개발실|chpark@ramostek.com">박철홍 실장_상무 (DRAM 개발실) — chpark@ramostek.com</option>
                    <option value="정현석 팀장_S.Pro|Flash 개발1팀|hsjeong@ramostek.com">정현석 팀장_S.Pro (Flash 개발1팀) — hsjeong@ramostek.com</option>
                    <option value="박재환 팀장_S.Pro|Flash 개발2팀|jhpark@ramostek.com">박재환 팀장_S.Pro (Flash 개발2팀) — jhpark@ramostek.com</option>
                    <option value="이성우 팀장_P.Pro|Flash 개발3팀|fog1007@ramostek.com">이성우 팀장_P.Pro (Flash 개발3팀) — fog1007@ramostek.com</option>
                    <option value="신덕용 팀장_P.Pro|DRAM 개발2팀|satiou@ramostek.com">신덕용 팀장_P.Pro (DRAM 개발2팀) — satiou@ramostek.com</option>
                    <option value="이민호 담당_이사|DRAM 개발실|aden@ramostek.com">이민호 담당_이사 (DRAM 개발실) — aden@ramostek.com</option>
                    <option value="박정훈 부문장_전무|알앤디부문|gh8229@ramostek.com">박정훈 부문장_전무 (알앤디부문) — gh8229@ramostek.com</option>
                  </select>
                </div>
              </div>

              <div class="grid-2">
                <div class="form-group">
                  <label class="form-label">
                    <span>🔬 불량 분석 리더 (FA / Technical Lead) <span class="required">*</span></span>
                    <span style="font-size:0.68rem; color:#a78bfa;">개발/분석 팀장급</span>
                  </label>
                  <select id="formFaLead" name="cftFaLead" class="form-control" required>
                    <option value="박재환 팀장_S.Pro|Flash 개발2팀|jhpark@ramostek.com" selected>박재환 팀장_S.Pro (Flash 개발2팀) — jhpark@ramostek.com</option>
                    <option value="정현석 팀장_S.Pro|Flash 개발1팀|hsjeong@ramostek.com">정현석 팀장_S.Pro (Flash 개발1팀) — hsjeong@ramostek.com</option>
                    <option value="이성우 팀장_P.Pro|Flash 개발3팀|fog1007@ramostek.com">이성우 팀장_P.Pro (Flash 개발3팀) — fog1007@ramostek.com</option>
                    <option value="신덕용 팀장_P.Pro|DRAM 개발2팀|satiou@ramostek.com">신덕용 팀장_P.Pro (DRAM 개발2팀) — satiou@ramostek.com</option>
                    <option value="이민호 담당_이사|DRAM 개발실|aden@ramostek.com">이민호 담당_이사 (DRAM 개발실) — aden@ramostek.com</option>
                    <option value="김현수 실장_상무|Flash 개발실|hskim@ramostek.com">김현수 실장_상무 (Flash 개발실) — hskim@ramostek.com</option>
                    <option value="박철홍 실장_상무|DRAM 개발실|chpark@ramostek.com">박철홍 실장_상무 (DRAM 개발실) — chpark@ramostek.com</option>
                    <option value="박정훈 부문장_전무|알앤디부문|gh8229@ramostek.com">박정훈 부문장_전무 (알앤디부문) — gh8229@ramostek.com</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span>📦 물류/자재 격리 관리자 (Material Containment Lead) <span class="required">*</span></span>
                    <span style="font-size:0.68rem; color:#fbbf24;">센터장 / 부문장급</span>
                  </label>
                  <select id="formContainmentLead" name="cftContainmentLead" class="form-control" required>
                    <option value="이은산 센터장_상무|제조기획센터|eunsan.lee@ramostek.com" selected>이은산 센터장_상무 (제조기획센터) — eunsan.lee@ramostek.com</option>
                    <option value="윤석재 COO_부사장|COO 직속|sjyun@ramostek.com">윤석재 COO_부사장 (COO 직속) — sjyun@ramostek.com</option>
                    <option value="John_Woo_우준수 팀장_이사|전략소싱팀|johnwoo@ramostek.com">John_Woo_우준수 팀장_이사 (전략소싱팀) — johnwoo@ramostek.com</option>
                    <option value="Robin_Myung_명노광 부문장_전무|영업부문|rkmyung@ramostek.com">Robin_Myung_명노광 부문장_전무 (영업부문) — rkmyung@ramostek.com</option>
                  </select>
                </div>
              </div>

              <!-- Fixed Quality Facilitator Info Box -->
              <div style="background:rgba(59,130,246,0.06); border:1px dashed #3b82f6; border-radius:6px; padding:10px 14px; margin-top:10px; display:flex; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <i data-lucide="clipboard-check" style="width:16px; height:16px; color:#60a5fa;"></i>
                  <div>
                    <span style="font-size:0.8rem; font-weight:700; color:#f8fafc;">8D 품질 실무 간사 (Quality QA / Facilitator):</span>
                    <span style="font-size:0.8rem; color:#93c5fd; font-weight:600; margin-left:6px;">김성중 S.Pro (품질혁신팀)</span>
                  </div>
                </div>
                <span style="font-size:0.7rem; color:#34d399; font-weight:700;">● CFT 품질 실무 배속 완료</span>
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:12px; margin-bottom:40px;">
              <button type="button" class="btn btn-secondary" onclick="switchNav('dashboard')">취소</button>
              <button type="submit" class="btn btn-primary" style="padding: 10px 24px;">
                <i data-lucide="check" style="width:16px; height:16px;"></i> Case 생성 및 8D Workspace 진입
              </button>
            </div>
          </form>
        </div>
      `;
    }

    /* Ingest Drag & Drop & Clipboard Handlers */
    function handleDragOver(e) {
      e.preventDefault();
      document.getElementById('intakeDropZone').classList.add('dragover');
    }

    function handleDragLeave(e) {
      e.preventDefault();
      document.getElementById('intakeDropZone').classList.remove('dragover');
    }

    function handleFileDrop(e) {
      e.preventDefault();
      document.getElementById('intakeDropZone').classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processIncomingFiles(e.dataTransfer.files);
      }
    }

    function handleFileSelect(e) {
      if (e.target.files && e.target.files.length > 0) {
        processIncomingFiles(e.target.files);
      }
    }

    // Global Clipboard Paste (Ctrl+V)
    window.addEventListener('paste', (e) => {
      if (appData.currentView !== 'new-case') return;
      
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      let pastedFiles = [];
      for (let index in items) {
        const item = items[index];
        if (item.kind === 'file') {
          const blob = item.getAsFile();
          const fileName = `Groupware_Screenshot_${new Date().toISOString().slice(0,10)}_${Date.now()}.png`;
          const fileObj = new File([blob], fileName, { type: blob.type });
          pastedFiles.push(fileObj);
        } else if (item.kind === 'string' && item.type === 'text/plain') {
          item.getAsString((text) => {
            if (text && text.trim().length > 10) {
              parseRawTextIntoForm(text);
            }
          });
        }
      }
      if (pastedFiles.length > 0) {
        processIncomingFiles(pastedFiles);
      }
    });

    function processIncomingFiles(files) {
      for (let i = 0; i < files.length; i++) {
        intakeFiles.push({
          name: files[i].name,
          size: (files[i].size / 1024).toFixed(1) + ' KB',
          fileObj: files[i]
        });
      }
      renderAttachedFilesList();
      triggerAIExtraction();
    }

    function renderAttachedFilesList() {
      const container = document.getElementById('attachedFilesList');
      if (!container) return;
      container.innerHTML = intakeFiles.map((f, idx) => `
        <div class="file-chip">
          <i data-lucide="paperclip" style="width:12px; height:12px;"></i>
          <span>${f.name} (${f.size})</span>
          <i data-lucide="x" style="width:12px; height:12px; cursor:pointer; color:#f87171;" onclick="event.stopPropagation(); removeIntakeFile(${idx})"></i>
        </div>
      `).join('');
      lucide.createIcons();
    }

    function removeIntakeFile(idx) {
      intakeFiles.splice(idx, 1);
      renderAttachedFilesList();
    }

    function applyIntakePreset(presetKey) {
      const p = INTAKE_PRESETS[presetKey];
      if (!p) return;

      intakeFiles = [{
        name: p.sampleFileName,
        size: '1.4 MB',
        fileObj: null
      }];
      renderAttachedFilesList();

      document.getElementById('formCustomer').value = p.customer;
      document.getElementById('formCustomerContact').value = p.customerContact;
      document.getElementById('formCustomerEmail').value = p.customerEmail;
      document.getElementById('formProduct').value = p.product;
      document.getElementById('formPartNumber').value = p.partNumber;
      document.getElementById('formLotNumber').value = p.lotNumber;
      document.getElementById('formMfgSite').value = p.mfgSite;
      document.getElementById('formIncidentSite').value = p.incidentSite;
      document.getElementById('inputDefectQty').value = p.defectQty;
      document.getElementById('inputInspectQty').value = p.inspectQty;
      document.getElementById('formClaimTitle').value = p.claimTitle;
      document.getElementById('formLineStop').value = p.lineStop;
      document.getElementById('formSafetyRisk').value = p.safetyRisk;
      document.getElementById('formRecurrentDefect').value = p.recurrentDefect;

      calculatePPM();
      autoEvaluateSeverity();

      const notif = document.getElementById('aiParseNotification');
      const notifText = document.getElementById('aiParseNotificationText');
      if (notif && notifText) {
        notifText.innerText = `[${p.customer}] 첨부 문서 (${p.sampleFileName})로부터 14개 품질 메타데이터가 완벽하게 추출되었습니다!`;
        notif.style.display = 'flex';
      }
    }

    function triggerAIExtraction() {
      // Simulate quick intelligent extraction from attached files
      const notif = document.getElementById('aiParseNotification');
      const notifText = document.getElementById('aiParseNotificationText');
      if (notif && notifText) {
        notif.style.display = 'flex';
        notifText.innerText = '🧠 AI 문서 인식 엔진이 그룹웨어 메일 및 첨부파일을 파싱하여 폼을 자동으로 완성하였습니다!';
      }
      calculatePPM();
      autoEvaluateSeverity();
    }

    function calculatePPM() {
      const defEl = document.getElementById('inputDefectQty');
      const insEl = document.getElementById('inputInspectQty');
      const ppmEl = document.getElementById('calculatedPPM');
      if (!defEl || !insEl || !ppmEl) return;

      const def = parseFloat(defEl.value) || 0;
      const ins = parseFloat(insEl.value) || 0;

      if (ins <= 0) {
        ppmEl.value = '0 PPM (검사수량 필요)';
        ppmEl.style.color = '#94a3b8';
        return;
      }

      const ppm = Math.round((def / ins) * 1000000);
      const percent = ((def / ins) * 100).toFixed(2);
      ppmEl.value = `${ppm.toLocaleString()} PPM (${percent}%)`;

      // Dynamic color alert based on PPM level
      if (ppm >= 5000) {
        ppmEl.style.color = '#ef4444'; // Red (Critical)
      } else if (ppm >= 1000) {
        ppmEl.style.color = '#f59e0b'; // Amber (High)
      } else if (ppm > 0) {
        ppmEl.style.color = '#38bdf8'; // Blue
      } else {
        ppmEl.style.color = '#10b981'; // Green (0 PPM)
      }
    }

    function autoEvaluateSeverity() {
      const lineStop = document.getElementById('formLineStop')?.value === 'true';
      const safetyRisk = document.getElementById('formSafetyRisk')?.value === 'true';
      const recurrent = document.getElementById('formRecurrentDefect')?.value === 'true';

      const req = document.getElementById('decision8DRequired');
      const sev = document.getElementById('decisionSeverityLevel');
      const sla = document.getElementById('decisionSlaDue');

      if (lineStop || safetyRisk) {
        if (req) req.innerHTML = '● 8D 필수 발행 대상 (Mandatory)';
        if (sev) sev.innerHTML = '● CRITICAL (Level 1 긴급)';
        if (sla) sla.innerHTML = '24시간 이내 (D3 봉쇄 필수)';
      } else if (recurrent) {
        if (req) req.innerHTML = '● 8D 필수 발행 대상 (재발 방지)';
        if (sev) sev.innerHTML = '● MAJOR (Level 2)';
        if (sla) sla.innerHTML = '48시간 이내 (D3 봉쇄)';
      } else {
        if (req) req.innerHTML = '○ 8D 발행 권고 (Standard)';
        if (sev) sev.innerHTML = '○ MINOR (Level 3)';
        if (sla) sla.innerHTML = '72시간 이내';
      }
    }

        function handleCreateCase(e) {
      e.preventDefault();
      const form = e.target;
      const newCaseId = `RAMOS-8D-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-0${appData.cases.length + 1}`;
      
      const newCaseObj = {
        id: newCaseId,
        customer: form.customer.value,
        customerContact: form.customerContact.value,
        customerEmail: form.customerEmail.value,
        product: form.product.value,
        partNumber: form.partNumber.value,
        lotNumber: form.lotNumber.value,
        mfgSite: form.mfgSite.value,
        incidentSite: form.incidentSite.value,
        application: '고객사 주요 장비 실장 보드',
        receiptDate: new Date().toISOString().slice(0,16).replace('T',' '),
        incidentDate: new Date().toISOString().slice(0,16).replace('T',' '),
        dueDateInitial: '24시간 후 (초동 3D SLA)',
        dueDateFinal: '14일 후',
        defectQty: parseInt(form.defectQty.value),
        inspectQty: parseInt(form.inspectQty.value),
        ppm: Math.round((parseInt(form.defectQty.value) / parseInt(form.inspectQty.value)) * 1000000),
        claimTitle: form.claimTitle.value,
        severityLevel: form.lineStop.value === 'true' ? 'Critical' : 'Major',
        lineStop: form.lineStop.value === 'true',
        safetyRisk: form.safetyRisk.value === 'true',
        recurrentDefect: form.recurrentDefect.value === 'true',
        currentStage: 'D1',
        team: [
          {
            role: '8D Champion',
            name: form.cftChampion.value.split('|')[0],
            dept: form.cftChampion.value.split('|')[1],
            contact: form.cftChampion.value.split('|')[2],
            status: 'Active'
          },
          {
            role: '8D Leader (연구소/개발 주관)',
            name: form.cftLeader.value.split('|')[0],
            dept: form.cftLeader.value.split('|')[1],
            contact: form.cftLeader.value.split('|')[2],
            status: 'Active'
          },
          {
            role: 'Technical / FA Lead',
            name: form.cftFaLead.value.split('|')[0],
            dept: form.cftFaLead.value.split('|')[1],
            contact: form.cftFaLead.value.split('|')[2],
            status: 'Active'
          },
          {
            role: 'Material Containment Lead',
            name: form.cftContainmentLead.value.split('|')[0],
            dept: form.cftContainmentLead.value.split('|')[1],
            contact: form.cftContainmentLead.value.split('|')[2],
            status: 'Active'
          },
          {
            role: '8D Quality Facilitator / 실무',
            name: '김성중 S.Pro',
            dept: '품질혁신팀',
            contact: 'sjkim@ramostek.com',
            status: 'Active'
          }
        ],
        d2: {
          problemWhat: form.claimTitle.value,
          problemWhere: form.incidentSite.value,
          problemWhen: new Date().toISOString().slice(0,10),
          problemWho: '고객사 라인 검사원',
          problemWhich: form.partNumber.value,
          problemHow: '라인 가동 중 결함 적출',
          problemHowMany: `${form.defectQty.value} / ${form.inspectQty.value}ea`,
          isIsNot: [],
          hypotheses: []
        },
        d3: { materialFlow: [], actions: [], effectivenessStatement: '' },
        d4: { faMatrix: [], occurrence5Why: [], escape5Why: [], candidateCauses: [] },
        d5: { candidates: [] },
        d6: { validationTests: [] },
        d7: { systemUpdates: [], horizontalDeployment: [] },
        d8: { checklist: [], approvalFlow: [] },
        evidenceList: intakeFiles.map((f, i) => ({
          id: `EVD-0${i+1}`,
          title: `[초동 접수 원본] ${f.name}`,
          type: f.name.includes('.png') || f.name.includes('.jpg') ? 'Email/Screen Capture' : f.name.includes('.xls') ? 'Defect Sheet' : 'Official Document',
          file: f.name,
          linkedStages: ['D2', 'D3']
        }))
      };

      intakeFiles = [];
      appData.cases.unshift(newCaseObj);
      appData.activeCaseId = newCaseId;
      saveAppData();
      alert(`신규 Case [${newCaseId}]가 성공적으로 등록되었습니다. D1 단계로 이동합니다.`);
      switchStage('D1');
    }