/* ========================================================================= */
/* RAMOS SUPPLIER QUALITY & 4M PCN PORTAL VIEW LAYER                         */
/* ========================================================================= */

let supplierPortalState = {
  activeTab: 'watchtower', // 'watchtower' | 'intake'
  filterSupplier: 'ALL',
  filterType: 'ALL',
  filterStatus: 'ALL',
  filter4M: 'ALL',
  searchQuery: '',
  comparisonRows: [
    { item: '주요 사양/공정 조건', current: '현행 사양 (기존)', proposed: '신규 사양 (제안)', riskAssessment: '신뢰성 영향 평가 완료' }
  ],
  intakeForm: {
    supplierCategory: 'OSAT_PKG',
    supplierId: 'SUP-HANA',
    companyName: '하나마이크론(주)',
    plant: '아산 사업장 PKG Line 3',
    submitter: '박민우 과장',
    email: 'mwpark@hana.com',
    phone: '010-3344-5566',
    ticketType: 'PCN', // 'PCN' | 'Issue'
    customer: 'LGE DTV',
    partName: '16GB eMMC v5.1 (BGA153)',
    partNumber: 'MMACGD8J0F-KV0AF0-TPAG',
    lotNo: 'HN260901-A',
    // Track A (PCN)
    change4M: ['Material', 'Machine'],
    reasonType: 'Cost_Reduction_And_Reliability',
    title: 'C102 MLCC 고온내열 X7R 소자 대체 및 리플로우 프로파일 조정 승인의 건',
    description: '기존 X5R 등급 MLCC의 고온 내열 마진 부족 이슈 해소를 위해 고온보증(125℃) X7R 등급 소재로 대체하고 리플로우 피크 온도를 250℃로 안정화 제어 요청.',
    plannedSampleDate: '2026-09-15',
    plannedMassDate: '2026-10-01',
    // Track B (Issue)
    defectCategory: 'Yield_Drop',
    processStep: 'Molding_Underfill',
    inputQty: 10000,
    defectQty: 320,
    defectRate: '3.20',
    lineAction: 'Line_Stop',
    quarantineQty: 9680,
    quarantineLocation: '외주 제1공장 불량격리구역 Q-Zone (RED HOLD 라벨 부착)',
    inTransitAction: '라모스 입고 대기 화물 즉시 회수 요청 및 입고 전산 Lock',
    containmentAction: '해당 설비 가동 즉시 중단, 직전 3개 생산 로트 전수 X-Ray 검사 및 금형 노즐 세척 실시',
    faReportDeadline: '2026-09-09 12:00',
    emergencySupportRequest: '라모스 SQE 엔지니어 외주 현장 방문 참관 및 불량 샘플 회수 지원 요청'
  }
};

function switchSupplierTab(tab) {
  supplierPortalState.activeTab = tab;
  renderCurrentView();
}

function setSupplierTicketType(type) {
  supplierPortalState.intakeForm.ticketType = type;
  if (type === 'Issue') {
    if (!supplierPortalState.intakeForm.title || supplierPortalState.intakeForm.title.includes('MLCC') || supplierPortalState.intakeForm.title.includes('승인')) {
      supplierPortalState.intakeForm.title = `[긴급] ${supplierPortalState.intakeForm.companyName} BGA 언더필 토출압 저하로 인한 보이드 불량 급증의 건`;
    }
    if (!supplierPortalState.intakeForm.description || supplierPortalState.intakeForm.description.includes('X5R')) {
      supplierPortalState.intakeForm.description = '금일 생산 중 BGA 라인 #2 디스펜서 압력 저하 발생. Affected Lot 전수 검사 결과 보이드 불량률 3.2% 검출되어 라인 즉시 정지 및 긴급 자진 통보함.';
    }
  } else {
    if (!supplierPortalState.intakeForm.title || supplierPortalState.intakeForm.title.includes('[긴급]')) {
      supplierPortalState.intakeForm.title = 'C102 MLCC 고온내열 X7R 소자 대체 및 리플로우 프로파일 조정 승인의 건';
    }
    if (!supplierPortalState.intakeForm.description || supplierPortalState.intakeForm.description.includes('디스펜서')) {
      supplierPortalState.intakeForm.description = '기존 X5R 등급 MLCC의 고온 내열 마진 부족 이슈 해소를 위해 고온보증(125℃) X7R 등급 소재로 대체하고 리플로우 피크 온도를 250℃로 안정화 제어 요청.';
    }
  }
  renderCurrentView();
}

function recalculateDefectRate() {
  const inputEl = document.querySelector('input[name="inputQty"]');
  const defectEl = document.querySelector('input[name="defectQty"]');
  const rateDisplay = document.getElementById('defectRateDisplay');
  const rateInput = document.getElementById('defectRateInput');
  if (inputEl && defectEl && rateDisplay) {
    const input = Number(inputEl.value) || 0;
    const defect = Number(defectEl.value) || 0;
    if (input > 0) {
      const rate = ((defect / input) * 100).toFixed(2);
      const ppm = Math.round((defect / input) * 1000000).toLocaleString();
      rateDisplay.innerHTML = `<span style="color:#f43f5e; font-weight:800; font-size:0.95rem;">${rate}%</span> <span style="font-size:0.72rem; color:var(--text-muted);">(${ppm} PPM)</span>`;
      if (rateInput) rateInput.value = rate;
      supplierPortalState.intakeForm.inputQty = input;
      supplierPortalState.intakeForm.defectQty = defect;
      supplierPortalState.intakeForm.defectRate = rate;
    }
  }
}

function onSupplierMasterSelect(suppId) {
  const supp = MASTER_SUPPLIERS.find(s => s.id === suppId);
  if (supp) {
    supplierPortalState.intakeForm.supplierId = supp.id;
    supplierPortalState.intakeForm.supplierCategory = supp.category;
    supplierPortalState.intakeForm.companyName = supp.name;
    supplierPortalState.intakeForm.plant = supp.plant;
    supplierPortalState.intakeForm.submitter = supp.defaultContact;
    supplierPortalState.intakeForm.email = supp.email;
    supplierPortalState.intakeForm.phone = supp.phone;
    renderCurrentView();
  }
}

function addComparisonRow() {
  supplierPortalState.comparisonRows.push({
    item: '',
    current: '',
    proposed: '',
    riskAssessment: ''
  });
  renderCurrentView();
}

function removeComparisonRow(index) {
  if (supplierPortalState.comparisonRows.length > 1) {
    supplierPortalState.comparisonRows.splice(index, 1);
    renderCurrentView();
  }
}

function updateComparisonField(index, field, value) {
  if (supplierPortalState.comparisonRows[index]) {
    supplierPortalState.comparisonRows[index][field] = value;
  }
}

function renderSupplierPortalView() {
  const records = loadSupplierRecords();

  const totalCount = records.length;
  const newCount = records.filter(r => r.status === 'Submitted').length;
  const underReviewCount = records.filter(r => r.status === 'Under_Review').length;
  const approvedCount = records.filter(r => r.status === 'Approved').length;
  const escalatedCount = records.filter(r => r.status === '8D_Escalated').length;

  return `
    <div class="supplier-portal-container">
      <!-- Portal Top Header -->
      <div class="supplier-portal-header">
        <div class="portal-brand">
          <div class="portal-brand-icon">
            <i data-lucide="network" style="width:24px; height:24px;"></i>
          </div>
          <div>
            <div class="portal-brand-title">
              외주사 품질 이슈 & 4M PCN 관제 센터
              <span class="portal-tag">SQE Portal</span>
              <span class="portal-live-pulse">Live Gateway</span>
            </div>
            <div class="portal-brand-subtitle">
              외주 협력사(OSAT·SMT·PKG·PCB·부품사) 공정 이상 통보(SCAR) 및 4M 변경 승인(PCN) 실시간 수신·심의·8D 연계 허브
            </div>
          </div>
        </div>

        <!-- Tab Switcher -->
        <div class="supplier-tab-nav">
          <button class="supplier-tab-btn ${supplierPortalState.activeTab === 'watchtower' ? 'active' : ''}" onclick="switchSupplierTab('watchtower')">
            <i data-lucide="clipboard-list" style="width:16px; height:16px;"></i>
            <span>📋 사내 SQE 실시간 관제 현황판</span>
          </button>
          <button class="supplier-tab-btn ${supplierPortalState.activeTab === 'intake' ? 'active' : ''}" onclick="switchSupplierTab('intake')">
            <i data-lucide="send" style="width:16px; height:16px;"></i>
            <span>📥 협력사 전용 접수 창구</span>
          </button>
        </div>
      </div>

      <!-- Tab Body -->
      <div id="supplierTabContent">
        ${supplierPortalState.activeTab === 'watchtower'
          ? renderSupplierWatchtower(records, { totalCount, newCount, underReviewCount, approvedCount, escalatedCount })
          : renderSupplierSubmitForm()}
      </div>
    </div>
  `;
}

function renderSupplierWatchtower(records, kpi) {
  let filtered = [...records];

  if (supplierPortalState.filterSupplier !== 'ALL') {
    filtered = filtered.filter(r => r.supplier.category === supplierPortalState.filterSupplier);
  }
  if (supplierPortalState.filterType !== 'ALL') {
    filtered = filtered.filter(r => r.ticketType === supplierPortalState.filterType);
  }
  if (supplierPortalState.filterStatus !== 'ALL') {
    filtered = filtered.filter(r => r.status === supplierPortalState.filterStatus);
  }
  if (supplierPortalState.filter4M !== 'ALL') {
    filtered = filtered.filter(r => r.classification?.change4M?.includes(supplierPortalState.filter4M));
  }
  if (supplierPortalState.searchQuery.trim()) {
    const q = supplierPortalState.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(r =>
      (r.ticketId && r.ticketId.toLowerCase().includes(q)) ||
      (r.supplier?.companyName && r.supplier.companyName.toLowerCase().includes(q)) ||
      (r.targetProduct?.partName && r.targetProduct.partName.toLowerCase().includes(q)) ||
      (r.targetProduct?.partNumber && r.targetProduct.partNumber.toLowerCase().includes(q)) ||
      (r.details?.title && r.details.title.toLowerCase().includes(q))
    );
  }

  return `
    <!-- Top 4 KPI Metrics -->
    <div class="supplier-kpi-grid">
      <div class="supplier-kpi-card" style="border-top-color:#38bdf8;">
        <span class="supplier-kpi-label">총 접수 건수</span>
        <span class="supplier-kpi-val num-mono" style="color:#38bdf8;">${kpi.totalCount}</span>
        <span class="supplier-kpi-sub">누적 PCN & 품질이슈</span>
      </div>
      <div class="supplier-kpi-card" style="border-top-color:#f59e0b;">
        <span class="supplier-kpi-label">신규 미검토 (NEW)</span>
        <span class="supplier-kpi-val num-mono" style="color:#f59e0b;">${kpi.newCount}</span>
        <span class="supplier-kpi-sub">SQE 1차 접수 대기</span>
      </div>
      <div class="supplier-kpi-card" style="border-top-color:#3b82f6;">
        <span class="supplier-kpi-label">심의 및 신뢰성 검증 중</span>
        <span class="supplier-kpi-val num-mono" style="color:#3b82f6;">${kpi.underReviewCount}</span>
        <span class="supplier-kpi-sub">시험 성적서 정밀 심의</span>
      </div>
      <div class="supplier-kpi-card" style="border-top-color:#10b981;">
        <span class="supplier-kpi-label">최종 승인 / 양산 적용</span>
        <span class="supplier-kpi-val num-mono" style="color:#10b981;">${kpi.approvedCount}</span>
        <span class="supplier-kpi-sub">4M ECN 승인 완료</span>
      </div>
      <div class="supplier-kpi-card" style="border-top-color:#ef4444;">
        <span class="supplier-kpi-label">8D / SCAR 즉시 승격</span>
        <span class="supplier-kpi-val num-mono" style="color:#ef4444;">${kpi.escalatedCount}</span>
        <span class="supplier-kpi-sub">8D 정식 케이스 연동</span>
      </div>
    </div>

    <!-- Filter & Action Bar -->
    <div class="supplier-filter-bar">
      <div class="filter-item">
        <label>협력사 필터</label>
        <select onchange="supplierPortalState.filterSupplier = this.value; renderCurrentView();">
          <option value="ALL" ${supplierPortalState.filterSupplier === 'ALL' ? 'selected' : ''}>전체 협력사 (All)</option>
          ${Object.entries(SUPPLIER_CATEGORIES).map(([k, v]) => `
            <option value="${k}" ${supplierPortalState.filterSupplier === k ? 'selected' : ''}>${v}</option>
          `).join('')}
        </select>
      </div>

      <div class="filter-item">
        <label>접수 유형</label>
        <select onchange="supplierPortalState.filterType = this.value; renderCurrentView();">
          <option value="ALL" ${supplierPortalState.filterType === 'ALL' ? 'selected' : ''}>전체 유형</option>
          <option value="PCN" ${supplierPortalState.filterType === 'PCN' ? 'selected' : ''}>4M 변경 통보 (PCN)</option>
          <option value="Issue" ${supplierPortalState.filterType === 'Issue' ? 'selected' : ''}>공정 품질이상 (SCAR)</option>
        </select>
      </div>

      <div class="filter-item">
        <label>심의 상태</label>
        <select onchange="supplierPortalState.filterStatus = this.value; renderCurrentView();">
          <option value="ALL" ${supplierPortalState.filterStatus === 'ALL' ? 'selected' : ''}>전체 상태</option>
          <option value="Submitted" ${supplierPortalState.filterStatus === 'Submitted' ? 'selected' : ''}>접수 대기 (New)</option>
          <option value="Under_Review" ${supplierPortalState.filterStatus === 'Under_Review' ? 'selected' : ''}>심의 중 (Reviewing)</option>
          <option value="Approved" ${supplierPortalState.filterStatus === 'Approved' ? 'selected' : ''}>승인 완료 (Approved)</option>
          <option value="8D_Escalated" ${supplierPortalState.filterStatus === '8D_Escalated' ? 'selected' : ''}>8D 승격 (Escalated)</option>
          <option value="Rejected" ${supplierPortalState.filterStatus === 'Rejected' ? 'selected' : ''}>반려 (Rejected)</option>
        </select>
      </div>

      <div class="filter-item" style="flex:1; min-width:180px;">
        <label>검색어 (제목, P/N, Lot, 번호)</label>
        <input type="text" placeholder="🔍 검색어 입력..." value="${supplierPortalState.searchQuery}" oninput="supplierPortalState.searchQuery = this.value; renderCurrentView();">
      </div>

      <div style="display:flex; gap:6px; align-items:flex-end;">
        <button class="btn btn-secondary btn-sm" onclick="supplierPortalState.filterSupplier='ALL'; supplierPortalState.filterType='ALL'; supplierPortalState.filterStatus='ALL'; supplierPortalState.searchQuery=''; renderCurrentView();" title="필터 초기화">
          <i data-lucide="rotate-ccw" style="width:14px; height:14px;"></i>
          <span>초기화</span>
        </button>
        <button class="btn btn-primary btn-sm" onclick="switchSupplierTab('intake')" style="font-weight:700;">
          <i data-lucide="plus" style="width:14px; height:14px;"></i>
          <span>+ 신규 외주 이슈/PCN 접수</span>
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="supplier-table-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div style="font-weight:800; font-size:0.92rem; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
          <i data-lucide="layers" style="width:18px; height:18px; color:#38bdf8;"></i>
          <span>실시간 수신 및 심의 현황 (${filtered.length}건)</span>
        </div>
        <span style="font-size:0.75rem; color:var(--text-muted);">
          * 접수 건 클릭 시 상세 대조표 확인 및 심의(승인/반려/8D 연계)가 가능합니다.
        </span>
      </div>

      <table class="supplier-grid-table">
        <thead>
          <tr>
            <th style="width:9%;">접수번호</th>
            <th style="width:8%;">접수일시</th>
            <th style="width:13%;">협력사명 (사업장)</th>
            <th style="width:7%;">접수구분</th>
            <th style="width:9%;">4M 항목</th>
            <th style="width:28%;">제목 및 대상 P/N / Lot No</th>
            <th style="width:6%; text-align:center;">위험도</th>
            <th style="width:9%; text-align:center;">심의상태</th>
            <th style="width:11%; text-align:center;">SQE 액션</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.length === 0 ? `
            <tr>
              <td colspan="9" style="text-align:center; padding:36px; color:var(--text-muted);">
                조건에 일치하는 외주 이슈/PCN 접수 내역이 없습니다.
              </td>
            </tr>
          ` : filtered.map(item => {
            const isPCN = item.ticketType === 'PCN';
            const isMajor = item.classification?.riskLevel === 'MAJOR';
            return `
              <tr>
                <td>
                  <a href="javascript:void(0)" class="ticket-id-link" onclick="openSupplierTicketModal('${item.ticketId}')">
                    ${item.ticketId}
                  </a>
                </td>
                <td style="font-size:0.75rem; color:var(--text-secondary);" class="num-mono">
                  ${item.createdAt}
                </td>
                <td>
                  <div style="font-weight:700; color:var(--text-primary);">${item.supplier.companyName}</div>
                  <div style="font-size:0.7rem; color:var(--text-muted);">${item.supplier.plant || '-'}</div>
                </td>
                <td>
                  <span class="badge-pill ${isPCN ? 'badge-pcn' : 'badge-issue'}">
                    ${isPCN ? '4M PCN 통보' : '공정 품질이상'}
                  </span>
                </td>
                <td>
                  <div class="chip-4m-group">
                    ${(item.classification?.change4M || []).map(m => `
                      <span class="chip-4m chip-${m.toLowerCase()}">${m}</span>
                    `).join('')}
                  </div>
                </td>
                <td>
                  <div style="font-weight:700; color:var(--text-primary); cursor:pointer;" onclick="openSupplierTicketModal('${item.ticketId}')">
                    ${item.details?.title || '제목 없음'}
                  </div>
                  <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">
                    <span class="num-mono" style="color:#38bdf8;">P/N: ${item.targetProduct?.partNumber || '-'}</span>
                    <span style="margin-left:8px;" class="num-mono">Lot: ${item.targetProduct?.lotNo || 'N/A'}</span>
                  </div>
                </td>
                <td style="text-align:center;">
                  <span class="badge-risk ${isMajor ? 'risk-major' : 'risk-minor'}">
                    ${item.classification?.riskLevel || 'MINOR'}
                  </span>
                </td>
                <td style="text-align:center;">
                  ${getSupplierStatusBadge(item.status)}
                </td>
                <td style="text-align:center;">
                  <div style="display:inline-flex; gap:4px;">
                    <button class="btn btn-secondary btn-sm" onclick="openSupplierTicketModal('${item.ticketId}')" style="padding:3px 8px; font-size:0.72rem;">
                      심의
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="handleEscalateTo8D('${item.ticketId}')" style="padding:3px 8px; font-size:0.72rem;">
                      8D연계
                    </button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function getSupplierStatusBadge(status) {
  switch (status) {
    case 'Submitted':
      return `<span class="badge-status status-new">● 신규 접수</span>`;
    case 'Under_Review':
      return `<span class="badge-status status-review">◐ 심의 중</span>`;
    case 'Approved':
      return `<span class="badge-status status-approved">✓ 승인 완료</span>`;
    case '8D_Escalated':
      return `<span class="badge-status status-escalated">⚡ 8D 승격</span>`;
    case 'Rejected':
      return `<span class="badge-status status-rejected">✕ 반려</span>`;
    default:
      return `<span class="badge-status">${status}</span>`;
  }
}

function renderSupplierSubmitForm() {
  const f = supplierPortalState.intakeForm;
  const isPCN = (f.ticketType === 'PCN');

  return `
    <div class="supplier-intake-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <i data-lucide="send" style="width:20px; height:20px; color:#38bdf8;"></i>
          <h3 style="margin:0; font-size:1.05rem; font-weight:800; color:var(--text-primary);">
            외주 협력사 품질 이상 통보 및 4M 변경(PCN) 정식 접수
          </h3>
        </div>
        <span style="font-size:0.75rem; color:#f43f5e; font-weight:700;">
          * 사전 승인 없는 4M 임의 변경 시 납품 중단 및 고객사 클레임 귀책 처리 대상
        </span>
      </div>

      <form id="supplierIntakeForm" onsubmit="handleSupplierFormSubmit(event)">
        <!-- 1. 협력사 기본 정보 -->
        <div class="form-section-title">
          <span>1. 협력사 및 제출자 기본 정보</span>
        </div>
        <div class="supplier-field-grid col-3">
          <div class="form-group">
            <label class="form-label">협력사 선택 (프리셋)</label>
            <select class="form-control" onchange="onSupplierMasterSelect(this.value)">
              ${MASTER_SUPPLIERS.map(s => `
                <option value="${s.id}" ${f.supplierId === s.id ? 'selected' : ''}>${s.name} (${s.plant})</option>
              `).join('')}
              <option value="CUSTOM">[직접 입력] 기타 협력사</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">협력사 분류</label>
            <select class="form-control" name="supplierCategory" id="formSuppCategory">
              ${Object.entries(SUPPLIER_CATEGORIES).map(([k, v]) => `
                <option value="${k}" ${f.supplierCategory === k ? 'selected' : ''}>${v}</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">협력사 상호명</label>
            <input type="text" class="form-control" name="companyName" value="${f.companyName}" required>
          </div>
          <div class="form-group">
            <label class="form-label">해당 공장 / 라인</label>
            <input type="text" class="form-control" name="plant" value="${f.plant}" placeholder="예: 아산 사업장 PKG Line 3" required>
          </div>
          <div class="form-group">
            <label class="form-label">제출 담당자 (성명/직급)</label>
            <input type="text" class="form-control" name="submitter" value="${f.submitter}" placeholder="예: 홍길동 과장" required>
          </div>
          <div class="form-group">
            <label class="form-label">연락처 / 이메일</label>
            <div style="display:flex; gap:6px;">
              <input type="text" class="form-control" name="phone" value="${f.phone}" placeholder="010-0000-0000" style="width:45%;" required>
              <input type="email" class="form-control" name="email" value="${f.email}" placeholder="name@company.com" style="width:55%;" required>
            </div>
          </div>
        </div>

        <!-- 2. 접수 구분 (PCN vs 품질이상) -->
        <div class="form-section-title" style="margin-top:18px;">
          <span>2. 접수 유형 및 대상 품목 정보</span>
        </div>
        <div style="display:flex; gap:14px; margin-bottom:14px;">
          <label class="supplier-type-card ${isPCN ? 'selected' : ''}">
            <input type="radio" name="ticketType" value="PCN" ${isPCN ? 'checked' : ''} onchange="setSupplierTicketType('PCN')">
            <div style="margin-left:8px;">
              <b style="display:block; font-size:0.88rem; color:var(--text-primary);">🔘 4M 변경 통보 (PCN: Process Change Notification)</b>
              <span style="font-size:0.72rem; color:var(--text-secondary);">설비, 금형, 자재, 공정조건 변경 시 사전 승인 요청 (샘플 및 신뢰성 평가 필수)</span>
            </div>
          </label>

          <label class="supplier-type-card danger-card ${!isPCN ? 'selected' : ''}">
            <input type="radio" name="ticketType" value="Issue" ${!isPCN ? 'checked' : ''} onchange="setSupplierTicketType('Issue')">
            <div style="margin-left:8px;">
              <b style="display:block; font-size:0.88rem; color:#f43f5e;">🚨 외주 공정 품질 이상 발생 긴급 통보 (SCAR)</b>
              <span style="font-size:0.72rem; color:var(--text-secondary);">외주 생산 라인 내 수율 급락, 설비 사고, 외관 불량 급증 긴급 자진 통보 및 출하 차단</span>
            </div>
          </label>
        </div>

        <div class="supplier-field-grid col-4">
          <div class="form-group">
            <label class="form-label">적용 고객사</label>
            <input type="text" class="form-control" name="customer" value="${f.customer}" required>
          </div>
          <div class="form-group">
            <label class="form-label">대상 제품명 (Part Name)</label>
            <input type="text" class="form-control" name="partName" value="${f.partName}" required>
          </div>
          <div class="form-group">
            <label class="form-label">라모스 품목코드 (P/N)</label>
            <input type="text" class="form-control num-mono" name="partNumber" value="${f.partNumber}" required>
          </div>
          <div class="form-group">
            <label class="form-label">생산 Lot No (Affected Lot)</label>
            <input type="text" class="form-control num-mono" name="lotNo" value="${f.lotNo}" placeholder="예: HN260901-A" required>
          </div>
        </div>

        <!-- Dynamic Track Sections: isPCN vs isIssue -->
        ${isPCN ? renderPCNTrackForm(f) : renderIssueTrackForm(f)}

        <!-- Form Submit Bar -->
        <div class="supplier-form-foot">
          <button type="button" class="btn btn-secondary" onclick="resetIntakeForm()">
            입력 초기화
          </button>
          <button type="submit" class="btn ${isPCN ? 'btn-primary' : 'btn-danger'}" style="padding:10px 24px; font-size:0.88rem; font-weight:800;">
            <i data-lucide="${isPCN ? 'send' : 'alert-circle'}" style="width:16px; height:16px;"></i>
            <span>${isPCN ? '🚀 4M 사전 변경(PCN) 승인 신청서 접수 및 고유번호 발급' : '🚨 외주 공정 품질 이상(SCAR) 긴급 접수 및 즉시 통보'}</span>
          </button>
        </div>
      </form>
    </div>
  `;
}

function renderPCNTrackForm(f) {
  return `
    <!-- 3. 4M 분류 및 사유 -->
    <div class="form-section-title" style="margin-top:18px;">
      <span>3. 4M 분류 및 세부 사유</span>
    </div>
    <div class="supplier-field-grid col-2">
      <div class="form-group">
        <label class="form-label">4M 해당 항목 (복수 선택 가능)</label>
        <div style="display:flex; gap:12px; padding:8px 12px; background:var(--bg-card-subtle); border-radius:4px; border:1px solid var(--border);">
          <label style="display:flex; align-items:center; gap:5px; font-size:0.8rem; font-weight:700;">
            <input type="checkbox" name="change4M" value="Material" ${f.change4M.includes('Material') ? 'checked' : ''}> Material (원소재/소자)
          </label>
          <label style="display:flex; align-items:center; gap:5px; font-size:0.8rem; font-weight:700;">
            <input type="checkbox" name="change4M" value="Machine" ${f.change4M.includes('Machine') ? 'checked' : ''}> Machine (설비/금형/피크온도)
          </label>
          <label style="display:flex; align-items:center; gap:5px; font-size:0.8rem; font-weight:700;">
            <input type="checkbox" name="change4M" value="Method" ${f.change4M.includes('Method') ? 'checked' : ''}> Method (공정조건/검사항목)
          </label>
          <label style="display:flex; align-items:center; gap:5px; font-size:0.8rem; font-weight:700;">
            <input type="checkbox" name="change4M" value="Man" ${f.change4M.includes('Man') ? 'checked' : ''}> Man (작업자 자격/공정원)
          </label>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">변경 사유 분류</label>
        <select class="form-control" name="reasonType">
          <option value="Cost_Reduction_And_Reliability">원소재 단종 대응 및 신뢰성 내열 개선 (Quality/Reliability)</option>
          <option value="Cost_Reduction">원가 절감 (Cost Reduction)</option>
          <option value="Dual_Sourcing">공급망 안정화 (Dual Sourcing)</option>
          <option value="Equipment_Maintenance">설비 노후 수리 및 능력 증설 (Capacity Up)</option>
        </select>
      </div>
    </div>

    <div class="form-group" style="margin-top:8px;">
      <label class="form-label">접수 제목</label>
      <input type="text" class="form-control" name="title" value="${f.title}" placeholder="예: C102 MLCC 고온내열 X7R 소자 대체 및 리플로우 프로파일 조정 승인의 건" required style="font-weight:700;">
    </div>
    <div class="form-group" style="margin-top:8px;">
      <label class="form-label">상세 변경 배경 및 이슈 설명</label>
      <textarea class="form-control" name="description" rows="3" placeholder="변경 배경, 원인 분석, 시험 결과, 위험 분석 내용을 구체적으로 기술해 주십시오." required>${f.description}</textarea>
    </div>

    <!-- 4. 변경 전 vs 변경 후 동적 대조표 -->
    <div class="form-section-title" style="margin-top:18px; display:flex; justify-content:space-between; align-items:center;">
      <span>4. 변경 전(Current) vs 변경 후(Proposed) 상세 대조표</span>
      <button type="button" class="btn btn-secondary btn-sm" onclick="addComparisonRow()" style="padding:2px 8px; font-size:0.72rem;">
        + 비교 행 추가
      </button>
    </div>

    <div class="comparison-table-wrap">
      <table class="comparison-table">
        <thead>
          <tr>
            <th style="width:22%;">비교 항목명</th>
            <th style="width:28%;">현재 사양 (변경 전 / As-Is)</th>
            <th style="width:28%;">신규 사양 (변경 후 / To-Be)</th>
            <th style="width:18%;">품질/신뢰성 영향 분석</th>
            <th style="width:4%; text-align:center;">삭제</th>
          </tr>
        </thead>
        <tbody>
          ${supplierPortalState.comparisonRows.map((row, idx) => `
            <tr>
              <td>
                <input type="text" class="form-control form-control-sm" value="${row.item}" placeholder="예: MLCC 유전체 등급" onchange="updateComparisonField(${idx}, 'item', this.value)" required>
              </td>
              <td>
                <input type="text" class="form-control form-control-sm" value="${row.current}" placeholder="현행 사양 상세" onchange="updateComparisonField(${idx}, 'current', this.value)" required>
              </td>
              <td>
                <input type="text" class="form-control form-control-sm" value="${row.proposed}" placeholder="신규 변경 사양 상세" onchange="updateComparisonField(${idx}, 'proposed', this.value)" required>
              </td>
              <td>
                <input type="text" class="form-control form-control-sm" value="${row.riskAssessment}" placeholder="신뢰성 평가 결과" onchange="updateComparisonField(${idx}, 'riskAssessment', this.value)">
              </td>
              <td style="text-align:center;">
                <button type="button" onclick="removeComparisonRow(${idx})" style="background:transparent; border:none; color:#f43f5e; cursor:pointer; font-weight:800;">✕</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- 5. 일정 및 첨부 파일 드롭존 -->
    <div class="form-section-title" style="margin-top:18px;">
      <span>5. 일정 계획 및 공인 성적서 파일 첨부</span>
    </div>
    <div class="supplier-field-grid col-2">
      <div class="form-group">
        <label class="form-label">신뢰성 평가 샘플 제출 가능일</label>
        <input type="date" class="form-control" name="plannedSampleDate" value="${f.plannedSampleDate}" required>
      </div>
      <div class="form-group">
        <label class="form-label">양산 적용 희망일</label>
        <input type="date" class="form-control" name="plannedMassDate" value="${f.plannedMassDate}" required>
      </div>
    </div>

    <div class="supplier-dropzone" onclick="simulateAttachSupplierFile('PCN')">
      <i data-lucide="upload-cloud" style="width:32px; height:32px; color:#38bdf8; margin-bottom:6px;"></i>
      <div style="font-weight:700; color:var(--text-primary); font-size:0.85rem;">
        클릭하여 신뢰성 시험 성적서, 4M 검토서, 스펙시트 첨부
      </div>
      <div style="font-size:0.72rem; color:var(--text-muted); margin-top:3px;">
        지원 포맷: PDF, XLSX, CSV, PNG, JPG (최대 50MB) · 공인 성적서 사전 검증
      </div>
      <div style="margin-top:10px; display:flex; gap:8px; justify-content:center;">
        <span class="badge-pill badge-info" style="font-size:0.72rem;">📎 Murata_X7R_Reliability_Test.pdf (1.4MB)</span>
        <span class="badge-pill badge-info" style="font-size:0.72rem;">📎 SMT_Reflow_Thermal_Profile.xlsx (2.1MB)</span>
      </div>
    </div>
  `;
}

function renderIssueTrackForm(f) {
  return `
    <!-- 긴급 통보 배너 -->
    <div class="incident-alert-banner" style="margin-top:14px;">
      <i data-lucide="alert-triangle" style="width:24px; height:24px; color:#f43f5e; flex-shrink:0;"></i>
      <div>
        <b style="color:#f43f5e; font-size:0.88rem;">[외주 공정 품질이상·긴급 통보(SCAR) 가동 중]</b><br>
        외주 생산 라인 내 수율 급락, 설비 사고, 외관 불량 급증 시 즉각적인 <b>생산 라인 정지 및 3-Point 유출 봉쇄(라인/공장/운송 락)</b>를 완료하고 24시간 이내 1차 원인분석(FA) 보고서를 제출해야 합니다.
      </div>
    </div>

    <!-- 3. 공정 불량 현상 및 발생 규모 (긴급 보고) -->
    <div class="form-section-title" style="margin-top:18px;">
      <span>3. 공정 불량 현상 및 발생 규모 (긴급 보고)</span>
    </div>

    <div class="supplier-field-grid col-2">
      <div class="form-group">
        <label class="form-label">불량 유형 분류 (Defect Category)</label>
        <select class="form-control" name="defectCategory" required>
          <option value="Yield_Drop" ${f.defectCategory === 'Yield_Drop' ? 'selected' : ''}>수율 급락 (Yield Drop - 공정 기준 미달)</option>
          <option value="Machine_Drift" ${f.defectCategory === 'Machine_Drift' ? 'selected' : ''}>설비 사고 / 파라미터 이탈 (Tool Malfunction)</option>
          <option value="Visual_Cosmetic" ${f.defectCategory === 'Visual_Cosmetic' ? 'selected' : ''}>치수 / 외관 불량 급증 (Void, Crack, Bridge, Burrs)</option>
          <option value="Contamination" ${f.defectCategory === 'Contamination' ? 'selected' : ''}>이물 / 오염 불량 (Foreign Material / Residue)</option>
          <option value="Electrical_Fail" ${f.defectCategory === 'Electrical_Fail' ? 'selected' : ''}>전기적 특성 불량 (Electrical Short / Open / Leakage)</option>
          <option value="Other" ${f.defectCategory === 'Other' ? 'selected' : ''}>기타 공정 이상 (Other Process Abnormality)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">발생 공정명 (Process Step)</label>
        <select class="form-control" name="processStep" required>
          <option value="Wafer_Sawing" ${f.processStep === 'Wafer_Sawing' ? 'selected' : ''}>Wafer Sawing (웨이퍼 절단 공정)</option>
          <option value="Die_Attach" ${f.processStep === 'Die_Attach' ? 'selected' : ''}>Die Attach (다이 어태치 / 칩 접착)</option>
          <option value="Wire_Bonding" ${f.processStep === 'Wire_Bonding' ? 'selected' : ''}>Wire Bonding (와이어 본딩 공정)</option>
          <option value="Molding_Underfill" ${f.processStep === 'Molding_Underfill' ? 'selected' : ''}>Molding / Underfill (몰딩 및 언더필 공정)</option>
          <option value="Ball_Mount" ${f.processStep === 'Ball_Mount' ? 'selected' : ''}>Solder Ball Mount (솔더 볼 마운트 공정)</option>
          <option value="Final_Test" ${f.processStep === 'Final_Test' ? 'selected' : ''}>Final Test / SLT (외주 최종 테스트 공정)</option>
          <option value="SMT_Reflow" ${f.processStep === 'SMT_Reflow' ? 'selected' : ''}>SMT Reflow (표면실장 리플로우 공정)</option>
          <option value="Visual_Inspection" ${f.processStep === 'Visual_Inspection' ? 'selected' : ''}>Visual / AOI Inspection (외관 / 자동광학검사)</option>
        </select>
      </div>
    </div>

    <!-- 발생 규모 3열 그리드 -->
    <div class="incident-metric-grid" style="margin-top:10px;">
      <div class="incident-metric-card">
        <label>해당 로트 총 투입 수량 (Input Qty)</label>
        <input type="number" class="form-control num-mono" name="inputQty" value="${f.inputQty}" oninput="recalculateDefectRate()" required>
      </div>
      <div class="incident-metric-card">
        <label>검출 불량 수량 (Defect Qty)</label>
        <input type="number" class="form-control num-mono" name="defectQty" value="${f.defectQty}" oninput="recalculateDefectRate()" required>
      </div>
      <div class="incident-metric-card" style="justify-content:center;">
        <label>실시간 산출 불량률 (%)</label>
        <div id="defectRateDisplay" style="margin-top:2px;">
          <span style="color:#f43f5e; font-weight:800; font-size:0.95rem;">${f.defectRate}%</span>
          <span style="font-size:0.72rem; color:var(--text-muted);">(32,000 PPM)</span>
        </div>
        <input type="hidden" id="defectRateInput" name="defectRate" value="${f.defectRate}">
      </div>
    </div>

    <div class="form-group" style="margin-top:12px;">
      <label class="form-label">이상 접수 제목</label>
      <input type="text" class="form-control" name="title" value="${f.title}" required style="font-weight:700; color:#f43f5e;">
    </div>

    <div class="form-group" style="margin-top:8px;">
      <label class="form-label">불량 현상 상세 기술 (5W2H 초동 이상 현상 및 파라미터 이탈 내용)</label>
      <textarea class="form-control" name="description" rows="3" placeholder="불량 발생 시점, 발견 공정, 이상 현상 및 설비 파라미터 이상 내용을 구체적으로 기술해 주십시오." required>${f.description}</textarea>
    </div>

    <!-- 4. 긴급 유출 차단 및 3-Point 봉쇄 조치 현황 -->
    <div class="form-section-title" style="margin-top:18px;">
      <span>4. 긴급 유출 차단 및 3-Point 봉쇄 조치 현황 (Containment & Quarantine)</span>
    </div>

    <div class="containment-3point-grid">
      <div class="containment-box">
        <div class="containment-box-title">
          <span>🛑 1. 생산 라인 조치 (Line Action)</span>
        </div>
        <select class="form-control" name="lineAction" required>
          <option value="Line_Stop" ${f.lineAction === 'Line_Stop' ? 'selected' : ''}>🔴 생산 라인 즉시 가동 정지 (Line Stop)</option>
          <option value="Conditional_Run" ${f.lineAction === 'Conditional_Run' ? 'selected' : ''}>🟡 파라미터 보정 후 조건부 가동 (Conditional Run)</option>
          <option value="Quarantine_And_Run" ${f.lineAction === 'Quarantine_And_Run' ? 'selected' : ''}>🟢 이상 로트 분리 후 정상 가동 (Quarantine & Run)</option>
        </select>
      </div>

      <div class="containment-box">
        <div class="containment-box-title">
          <span>🔒 2. 공장 내 의심 재고 격리 (WIP Hold)</span>
        </div>
        <div style="display:flex; gap:6px;">
          <input type="number" class="form-control num-mono" name="quarantineQty" value="${f.quarantineQty}" placeholder="격리수량" style="width:40%;" required>
          <input type="text" class="form-control" name="quarantineLocation" value="${f.quarantineLocation}" placeholder="격리 보관장소 및 HOLD태그 부착" style="width:60%;" required>
        </div>
      </div>

      <div class="containment-box">
        <div class="containment-box-title">
          <span>🚚 3. 운송 중 / 라모스 재고 조치</span>
        </div>
        <input type="text" class="form-control" name="inTransitAction" value="${f.inTransitAction}" placeholder="운송 화물 회수 및 라모스 입고 출하 Lock 요청" required>
      </div>
    </div>

    <div class="form-group" style="margin-top:10px;">
      <label class="form-label">초동 긴급 조치(ICA) 내역 및 작업자 조치 사항</label>
      <textarea class="form-control" name="containmentAction" rows="2" placeholder="작업자 재교육, 전수 선별, 임시 조건 보정, 전후 3개 로트 전수 샘플링 검사 등 초동 조치 내용" required>${f.containmentAction}</textarea>
    </div>

    <!-- 5. 원인 분석 계획 및 긴급 증빙 파일 첨부 -->
    <div class="form-section-title" style="margin-top:18px;">
      <span>5. 원인 분석 계획 및 긴급 증빙 파일 첨부</span>
    </div>

    <div class="supplier-field-grid col-2">
      <div class="form-group">
        <label class="form-label">1차 FA 분석 결과 통보 예정일시 (24시간 이내 원칙)</label>
        <input type="text" class="form-control num-mono" name="faReportDeadline" value="${f.faReportDeadline}" placeholder="예: 2026-09-09 12:00" required>
      </div>
      <div class="form-group">
        <label class="form-label">라모스 본사 긴급 기술지원 요청 사항</label>
        <input type="text" class="form-control" name="emergencySupportRequest" value="${f.emergencySupportRequest}" placeholder="예: 라모스 SQE 엔지니어 현장 파견 및 샘플 수거 요청">
      </div>
    </div>

    <div class="supplier-dropzone" onclick="simulateAttachSupplierFile('Issue')">
      <i data-lucide="upload-cloud" style="width:32px; height:32px; color:#f43f5e; margin-bottom:6px;"></i>
      <div style="font-weight:700; color:var(--text-primary); font-size:0.85rem;">
        클릭하여 불량 실물 사진 (현미경/X-Ray/SEM), 라인 비가동 일지, 설비 이상 로그 첨부
      </div>
      <div style="font-size:0.72rem; color:var(--text-muted); margin-top:3px;">
        지원 포맷: PNG, JPG, CSV, XLSX, PDF (최대 50MB) · 초동 증빙 락
      </div>
      <div style="margin-top:10px; display:flex; gap:8px; justify-content:center;">
        <span class="badge-pill badge-danger" style="font-size:0.72rem;">📎 Xray_Void_Defect_Inspection.png (3.1MB)</span>
        <span class="badge-pill badge-danger" style="font-size:0.72rem;">📎 ASE_Dispenser_Pressure_Log.csv (450KB)</span>
      </div>
    </div>
  `;
}

function simulateAttachSupplierFile(type) {
  if (type === 'Issue') {
    alert('외주 공정 불량 실물 X-Ray 분석 사진(3.1MB) 및 디스펜서 압력 로그(450KB) 2건이 첨부되었습니다.');
  } else {
    alert('신뢰성 시험 성적서(TC 1000h, HAST) 및 스펙시트 2건이 첨부되었습니다.');
  }
}

function resetIntakeForm() {
  if (confirm('입력된 접수 양식을 초기화하시겠습니까?')) {
    supplierPortalState.intakeForm.title = '';
    supplierPortalState.intakeForm.description = '';
    supplierPortalState.comparisonRows = [
      { item: '', current: '', proposed: '', riskAssessment: '' }
    ];
    renderCurrentView();
  }
}

function handleSupplierFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const ticketType = formData.get('ticketType') || 'PCN';
  const isIssue = (ticketType === 'Issue');

  const change4M = [];
  form.querySelectorAll('input[name="change4M"]:checked').forEach(cb => change4M.push(cb.value));
  if (change4M.length === 0) change4M.push(isIssue ? 'Machine' : 'Material');

  const ticketData = {
    ticketType,
    supplierCategory: formData.get('supplierCategory'),
    companyName: formData.get('companyName'),
    plant: formData.get('plant'),
    submitter: formData.get('submitter'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    customer: formData.get('customer'),
    partName: formData.get('partName'),
    partNumber: formData.get('partNumber'),
    lotNo: formData.get('lotNo'),
    change4M,
    reasonType: formData.get('reasonType') || (isIssue ? 'Process_Abnormal' : 'Quality_Improvement'),
    title: formData.get('title'),
    description: formData.get('description'),
    plannedSampleDate: formData.get('plannedSampleDate') || '',
    plannedMassDate: formData.get('plannedMassDate') || '',
    comparisonTable: isIssue ? [] : supplierPortalState.comparisonRows.filter(r => r.item.trim() !== '')
  };

  if (isIssue) {
    ticketData.incident = {
      defectCategory: formData.get('defectCategory') || 'Yield_Drop',
      processStep: formData.get('processStep') || 'Molding_Underfill',
      inputQty: Number(formData.get('inputQty') || 0),
      defectQty: Number(formData.get('defectQty') || 0),
      defectRate: formData.get('defectRate') || '0.00',
      lineAction: formData.get('lineAction') || 'Line_Stop',
      quarantineQty: Number(formData.get('quarantineQty') || 0),
      quarantineLocation: formData.get('quarantineLocation') || '',
      inTransitAction: formData.get('inTransitAction') || '',
      containmentAction: formData.get('containmentAction') || '',
      faReportDeadline: formData.get('faReportDeadline') || '',
      emergencySupportRequest: formData.get('emergencySupportRequest') || ''
    };
    ticketData.evidenceFiles = [
      { name: 'Xray_Void_Defect_Inspection.png', size: '3.1 MB', type: 'image' },
      { name: 'Dispenser_Pressure_Log.csv', size: '450 KB', type: 'csv' }
    ];
  } else {
    ticketData.evidenceFiles = [
      { name: 'Murata_X7R_Reliability_Test.pdf', size: '1.4 MB', type: 'pdf' },
      { name: 'SMT_Reflow_Thermal_Profile.xlsx', size: '2.1 MB', type: 'xlsx' }
    ];
  }

  const created = createSupplierTicket(ticketData);

  alert(`[접수 완료] 외주 접수번호 '${created.ticketId}'가 성공적으로 발급되었습니다.\n사내 SQE 관제 현황판에 즉시 실시간 등록되었습니다.`);

  supplierPortalState.activeTab = 'watchtower';
  renderCurrentView();
}

function openSupplierTicketModal(ticketId) {
  const records = loadSupplierRecords();
  const ticket = records.find(r => r.ticketId === ticketId);
  if (!ticket) {
    alert('해당 접수 건을 찾을 수 없습니다.');
    return;
  }

  const isMajor = ticket.classification?.riskLevel === 'MAJOR';
  const isPCN = (ticket.ticketType === 'PCN');
  const modalContainer = document.getElementById('modalContainer');
  const globalModal = document.getElementById('globalModal');
  if (!modalContainer) return;
  if (globalModal) globalModal.style.display = 'flex';

  modalContainer.innerHTML = `
    <div class="modal-backdrop" onclick="closeModal()"></div>
    <div class="modal-content" style="max-width:880px; width:95%; max-height:90vh; display:flex; flex-direction:column; padding:24px;">
      <!-- Modal Header -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; border-bottom:1px solid var(--border); padding-bottom:12px;">
        <div>
          <span class="badge-pill ${isPCN ? 'badge-pcn' : 'badge-issue'}" style="margin-bottom:6px; display:inline-block;">
            ${isPCN ? '4M 변경 사전 승인 요청서 (PCN)' : '외주 공정 품질 이상 발생 긴급 통보서 (SCAR)'}
          </span>
          <h3 style="margin:0; font-size:1.15rem; font-weight:800; color:var(--text-primary);">
            [${ticket.ticketId}] ${ticket.details.title}
          </h3>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="closeModal()">✕ 닫기</button>
      </div>

      <!-- Review Modal Body -->
      <div style="max-height:75vh; overflow-y:auto; padding-right:6px;">
        <!-- Top Meta Grid -->
        <div class="supplier-field-grid col-3" style="background:var(--bg-card-subtle); padding:12px; border-radius:6px; margin-bottom:14px; font-size:0.8rem;">
          <div>협력사: <b>${ticket.supplier.companyName}</b> (${ticket.supplier.plant})</div>
          <div>제출자: <b>${ticket.supplier.submitter}</b> (${ticket.supplier.email})</div>
          <div>접수일시: <b class="num-mono">${ticket.createdAt}</b></div>
          <div>적용제품: <b>${ticket.targetProduct.partName}</b> (<span class="num-mono">${ticket.targetProduct.partNumber}</span>)</div>
          <div>생산 Lot: <b class="num-mono">${ticket.targetProduct.lotNo || 'N/A'}</b></div>
          <div>위험도 판정: <span class="badge-risk ${isMajor ? 'risk-major' : 'risk-minor'}">${ticket.classification.riskLevel}</span></div>
        </div>

        <!-- Description Box -->
        <div style="margin-bottom:14px;">
          <label style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">상세 변경/이상 내용</label>
          <div style="background:var(--bg-card); border:1px solid var(--border); padding:10px 12px; border-radius:4px; font-size:0.82rem; line-height:1.45; color:var(--text-primary); margin-top:4px;">
            ${ticket.details.description || '상세 기술 내용 없음'}
          </div>
        </div>

        <!-- PCN vs Incident Body -->
        ${isPCN ? `
          <!-- Comparison Table -->
          <div style="margin-bottom:14px;">
            <label style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">변경 전(Current) vs 변경 후(Proposed) 대조표</label>
            <table class="comparison-table" style="margin-top:4px;">
              <thead>
                <tr>
                  <th>비교 항목명</th>
                  <th>현재 사양 (변경 전)</th>
                  <th>신규 사양 (변경 후)</th>
                  <th>품질/신뢰성 영향 분석</th>
                </tr>
              </thead>
              <tbody>
                ${(ticket.details.comparisonTable || []).map(row => `
                  <tr>
                    <td style="font-weight:700;">${row.item}</td>
                    <td>${row.current}</td>
                    <td style="color:#2563eb; font-weight:700;">${row.proposed}</td>
                    <td style="color:var(--text-secondary);">${row.riskAssessment || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <!-- Incident Specific Panel -->
          <div style="margin-bottom:14px; background:var(--bg-card-subtle); border:1px solid rgba(244,63,94,0.3); border-radius:6px; padding:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid var(--border); padding-bottom:6px;">
              <b style="color:#f43f5e; font-size:0.85rem;">🚨 불량 발생 규모 및 3-Point 긴급 봉쇄 현황</b>
              <span class="badge-pill badge-danger">${ticket.incident?.lineActionLabel || ticket.incident?.lineAction || 'Line_Stop'}</span>
            </div>
            <div class="supplier-field-grid col-3" style="font-size:0.8rem; margin-bottom:10px;">
              <div>투입 수량: <b class="num-mono">${Number(ticket.incident?.inputQty || 0).toLocaleString()}개</b></div>
              <div>검출 불량: <b class="num-mono" style="color:#f43f5e;">${Number(ticket.incident?.defectQty || 0).toLocaleString()}개</b></div>
              <div>불량률: <b class="num-mono" style="color:#f43f5e;">${ticket.incident?.defectRate || '0'}%</b></div>
            </div>
            <div style="font-size:0.8rem; line-height:1.5; color:var(--text-primary);">
              <div>• <b>공장 내 재고 격리:</b> ${ticket.incident?.quarantineQty || 0}개 격리 완료 (${ticket.incident?.quarantineLocation || 'Q-Zone 격리'})</div>
              <div>• <b>운송/입고 차단:</b> ${ticket.incident?.inTransitAction || '전산 Lock 조치'}</div>
              <div>• <b>초동 조치(ICA):</b> ${ticket.incident?.containmentAction || '설비 점검 및 선별'}</div>
              <div>• <b>1차 FA 통보 기한:</b> <span class="num-mono" style="color:#38bdf8;">${ticket.incident?.faReportDeadline || '24h 이내'}</span></div>
            </div>
          </div>
        `}

        <!-- Evidence Files -->
        <div style="margin-bottom:14px;">
          <label style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">제출된 증빙 및 시험 성적서 파일</label>
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:4px;">
            ${(ticket.evidenceFiles || []).map(f => `
              <span class="badge-pill badge-info" style="font-size:0.75rem; padding:4px 10px;">
                📎 <b>${f.name}</b> (${f.size})
              </span>
            `).join('')}
          </div>
        </div>

        <!-- SQE Review Form -->
        <div style="border:1px solid #2563eb; border-radius:6px; padding:14px; background:rgba(37,99,235,0.04); margin-top:16px;">
          <div style="font-weight:800; font-size:0.88rem; color:#2563eb; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
            <i data-lucide="check-circle-2" style="width:16px; height:16px;"></i>
            <span>사내 품질본부(SQE) 공식 심의 및 판정</span>
          </div>

          <div class="supplier-field-grid col-2">
            <div class="form-group">
              <label class="form-label">SQE 담당 심의자</label>
              <input type="text" class="form-control" id="modalReviewer" value="${ticket.sqeReview?.reviewer || (window.CURRENT_USER ? window.CURRENT_USER.name : '김성중 Senior Pro')}" readonly>
            </div>
            <div class="form-group">
              <label class="form-label">심의 판정 선택</label>
              <select class="form-control" id="modalDecision" style="font-weight:700;">
                <option value="Under_Review" ${ticket.status === 'Under_Review' ? 'selected' : ''}>◐ 심의 중 (신뢰성 추가 성적서 보완 요구)</option>
                <option value="Approved" ${ticket.status === 'Approved' ? 'selected' : ''}>✓ 최종 승인 (4M 변경 승인 및 양산 적용 허가)</option>
                <option value="8D_Escalated" ${ticket.status === '8D_Escalated' ? 'selected' : ''}>⚡ 사내 8D Case 즉시 승격 (심각 품질 이슈)</option>
                <option value="Rejected" ${ticket.status === 'Rejected' ? 'selected' : ''}>✕ 변경 반려 (품질/신뢰성 기준 미달)</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-top:10px;">
            <label class="form-label">품질팀 심의 종합 의견 및 조건</label>
            <textarea class="form-control" id="modalComment" rows="2" placeholder="심의 조건부 승인 사항, 신뢰성 시험 추가 요건 또는 반려 사유를 기술하십시오.">${ticket.sqeReview?.comment || ''}</textarea>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; padding-top:12px; border-top:1px solid var(--border);">
        <button class="btn btn-secondary btn-sm" onclick="printSupplierApprovalDoc('${ticket.ticketId}')">
          <i data-lucide="printer" style="width:14px; height:14px;"></i>
          <span>🖨️ A4 심의 통보 공문 출력</span>
        </button>

        <div style="display:flex; gap:8px;">
          <button class="btn btn-danger btn-sm" onclick="handleEscalateTo8D('${ticket.ticketId}')" style="font-weight:700;">
            <i data-lucide="zap" style="width:14px; height:14px;"></i>
            <span>🚀 8D Case 즉시 연계</span>
          </button>
          <button class="btn btn-primary btn-sm" onclick="submitSupplierReviewDecision('${ticket.ticketId}')" style="font-weight:800; padding:6px 16px;">
            <i data-lucide="save" style="width:14px; height:14px;"></i>
            <span>💾 심의 결과 확정 저장</span>
          </button>
        </div>
      </div>
    </div>
  `;

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

function submitSupplierReviewDecision(ticketId) {
  const decisionEl = document.getElementById('modalDecision');
  const commentEl = document.getElementById('modalComment');
  const reviewerEl = document.getElementById('modalReviewer');

  if (!decisionEl) return;

  const decision = decisionEl.value;
  const comment = commentEl ? commentEl.value : '';
  const reviewer = reviewerEl ? reviewerEl.value : '';

  updateSupplierTicketStatus(ticketId, decision, comment, reviewer);
  alert(`[심의 완료] 티켓 '${ticketId}'의 상태가 '${decision}'(으)로 업데이트되었습니다.`);
  closeModal();
  renderCurrentView();
}

function handleEscalateTo8D(ticketId) {
  const records = loadSupplierRecords();
  const ticket = records.find(r => r.ticketId === ticketId);
  if (!ticket) return;

  const isIssue = (ticket.ticketType === 'Issue');

  if (confirm(`외주 접수 건 [${ticketId}]을 사내 정식 8D 품질 문제해결 케이스로 즉시 연계 승격하시겠습니까?\n\n- 대상 협력사: ${ticket.supplier.companyName}\n- 문제 현상: ${ticket.details.title}\n- 발생 라인 및 봉쇄 내역이 8D D2/D3로 자동 전계됩니다.`)) {
    bindSupplierTicketTo8DCase(ticketId, 'RAMOS-8D-20260901-01');

    if (window.CURRENT_CASE) {
      if (isIssue && ticket.incident) {
        window.CURRENT_CASE.d2 = window.CURRENT_CASE.d2 || {};
        window.CURRENT_CASE.d2.problemStatement = `[외주사 품질이상 긴급 승격] ${ticket.supplier.companyName} (${ticket.supplier.plant}) ${ticket.details.title}\n- 발생 공정: ${ticket.incident.processStep}\n- 불량 규모: 투입 ${ticket.incident.inputQty}개 중 불량 ${ticket.incident.defectQty}개 (불량률: ${ticket.incident.defectRate}%)\n- 현상 상세: ${ticket.details.description}`;
        
        window.CURRENT_CASE.d3 = window.CURRENT_CASE.d3 || {};
        window.CURRENT_CASE.d3.containment = `[3-Point 유출 봉쇄] 라인 조치: ${ticket.incident.lineAction}, 공장 격리: ${ticket.incident.quarantineQty}개 (${ticket.incident.quarantineLocation}), 이동 재고: ${ticket.incident.inTransitAction}\n초동 조치: ${ticket.incident.containmentAction}`;
      } else {
        window.CURRENT_CASE.d2 = window.CURRENT_CASE.d2 || {};
        window.CURRENT_CASE.d2.problemStatement = `[외주 4M PCN 연계 승격] ${ticket.supplier.companyName} ${ticket.details.title}\n${ticket.details.description}`;
      }
      if (typeof window.saveCurrentCaseToStorage === 'function') {
        window.saveCurrentCaseToStorage();
      }
    }

    closeModal();
    alert(`[8D 승격 완료] 외주 접수 건 [${ticketId}]가 'RAMOS-8D-20260901-01' 케이스로 연동되었습니다. D2 현상 규명 워크스페이스로 이동합니다.`);

    if (typeof window.switchStage === 'function') {
      window.switchStage('D2');
    }
  }
}

function printSupplierApprovalDoc(ticketId) {
  const records = loadSupplierRecords();
  const ticket = records.find(r => r.ticketId === ticketId);
  if (!ticket) return;

  const isIssue = (ticket.ticketType === 'Issue');
  const printWin = window.open('', '_blank', 'width=900,height=950');
  if (!printWin) {
    alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주십시오.');
    return;
  }

  const printHtml = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>외주 협력사 심의 통보서 - ${ticket.ticketId}</title>
      <style>
        body { font-family: 'Pretendard', sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; }
        .doc-header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
        .doc-title { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .doc-sub { font-size: 13px; color: #64748b; margin-top: 4px; }
        .meta-table, .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
        .meta-table th, .meta-table td, .data-table th, .data-table td { border: 1px solid #cbd5e1; padding: 8px 12px; }
        .meta-table th, .data-table th { background: #f8fafc; font-weight: 700; color: #334155; }
        .section-title { font-size: 15px; font-weight: 800; margin: 20px 0 8px; border-left: 4px solid #2563eb; padding-left: 8px; }
        .stamp-box { display: flex; justify-content: flex-end; margin-top: 30px; }
        .stamp-table { border-collapse: collapse; text-align: center; font-size: 12px; }
        .stamp-table td { border: 1px solid #94a3b8; width: 80px; padding: 4px; }
      </style>
    </head>
    <body>
      <div class="doc-header">
        <div class="doc-title">${isIssue ? '외주 공정 품질 이상(SCAR) 조치 통보서' : '외주 4M 변경 승인(PCN) 심의 통보서'}</div>
        <div class="doc-sub">주식회사 라모스테크놀러지 품질경영본부 (SQE Team)</div>
      </div>

      <table class="meta-table">
        <tr>
          <th style="width:18%;">문서 관리번호</th>
          <td style="width:32%; font-weight:700;">${ticket.ticketId}</td>
          <th style="width:18%;">접수 일시</th>
          <td style="width:32%;">${ticket.createdAt}</td>
        </tr>
        <tr>
          <th>협력사명 / 사업장</th>
          <td>${ticket.supplier.companyName} (${ticket.supplier.plant})</td>
          <th>제출자</th>
          <td>${ticket.supplier.submitter} (${ticket.supplier.phone})</td>
        </tr>
        <tr>
          <th>적용 제품 / P/N</th>
          <td>${ticket.targetProduct.partName} / ${ticket.targetProduct.partNumber}</td>
          <th>생산 Lot No</th>
          <td>${ticket.targetProduct.lotNo || 'N/A'}</td>
        </tr>
        <tr>
          <th>4M 변경/이상 유형</th>
          <td>${ticket.classification.change4M.join(', ')} (${ticket.classification.issueCategory})</td>
          <th>위험도 판정</th>
          <td style="font-weight:700; color:${ticket.classification.riskLevel === 'MAJOR' ? '#ef4444' : '#10b981'};">
            ${ticket.classification.riskLevel}
          </td>
        </tr>
      </table>

      <div class="section-title">1. 상세 변경 배경 및 이슈 현상</div>
      <div style="border:1px solid #cbd5e1; padding:12px; font-size:13px; background:#f8fafc; border-radius:4px; margin-bottom:16px;">
        <b>제목: ${ticket.details.title}</b><br>
        ${ticket.details.description}
      </div>

      ${isPCN ? `
        <div class="section-title">2. 변경 전 (As-Is) vs 변경 후 (To-Be) 상세 대조표</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>비교 항목명</th>
              <th>현재 사양 (변경 전)</th>
              <th>신규 사양 (변경 후)</th>
              <th>품질/신뢰성 영향 분석</th>
            </tr>
          </thead>
          <tbody>
            ${(ticket.details.comparisonTable || []).map(r => `
              <tr>
                <td><b>${r.item}</b></td>
                <td>${r.current}</td>
                <td style="color:#2563eb; font-weight:700;">${r.proposed}</td>
                <td>${r.riskAssessment}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : `
        <div class="section-title">2. 불량 발생 규모 및 긴급 봉쇄(Containment) 현황</div>
        <table class="data-table">
          <tr>
            <th style="width:25%;">투입 / 불량 / 불량률</th>
            <td style="width:75%;">투입 ${ticket.incident?.inputQty || 0}개 / 불량 ${ticket.incident?.defectQty || 0}개 (불량률: ${ticket.incident?.defectRate || 0}%)</td>
          </tr>
          <tr>
            <th>생산 라인 조치</th>
            <td><b>${ticket.incident?.lineActionLabel || ticket.incident?.lineAction || 'Line Stop'}</b></td>
          </tr>
          <tr>
            <th>공장 내 의심 재고 격리</th>
            <td>${ticket.incident?.quarantineQty || 0}개 (${ticket.incident?.quarantineLocation || '-'})</td>
          </tr>
          <tr>
            <th>운송 / 입고 차단 조치</th>
            <td>${ticket.incident?.inTransitAction || '-'}</td>
          </tr>
        </table>
      `}

      <div class="section-title">3. 품질본부(SQE) 공식 심의 결과 및 승인 조건</div>
      <table class="meta-table">
        <tr>
          <th style="width:18%;">심의 판정</th>
          <td style="width:32%; font-weight:800; color:#2563eb;">${ticket.sqeReview?.decision || 'Under_Review'}</td>
          <th style="width:18%;">심의 일시 / 심의자</th>
          <td style="width:32%;">${ticket.sqeReview?.reviewedAt || '-'} / ${ticket.sqeReview?.reviewer || '김성중 Senior Pro'}</td>
        </tr>
        <tr>
          <th>품질팀 종합 의견</th>
          <td colspan="3">${ticket.sqeReview?.comment || '신뢰성 가속 수명 시험 성적서 만족하여 양산 변경 적용을 승인함.'}</td>
        </tr>
      </table>

      <div class="stamp-box">
        <table class="stamp-table">
          <tr>
            <td rowspan="2" style="background:#f1f5f9; font-weight:700;">결재</td>
            <td style="background:#f8fafc;">작성</td>
            <td style="background:#f8fafc;">검토</td>
            <td style="background:#f8fafc;">승인</td>
          </tr>
          <tr style="height:50px;">
            <td>박민우</td>
            <td>정진호</td>
            <td>김성중</td>
          </tr>
        </table>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWin.document.open();
  printWin.document.write(printHtml);
  printWin.document.close();
}

// Global exports
if (typeof window !== 'undefined') {
  window.supplierPortalState = supplierPortalState;
  window.switchSupplierTab = switchSupplierTab;
  window.setSupplierTicketType = setSupplierTicketType;
  window.recalculateDefectRate = recalculateDefectRate;
  window.onSupplierMasterSelect = onSupplierMasterSelect;
  window.addComparisonRow = addComparisonRow;
  window.removeComparisonRow = removeComparisonRow;
  window.updateComparisonField = updateComparisonField;
  window.renderSupplierPortalView = renderSupplierPortalView;
  window.renderSupplierWatchtower = renderSupplierWatchtower;
  window.renderSupplierSubmitForm = renderSupplierSubmitForm;
  window.openSupplierTicketModal = openSupplierTicketModal;
  window.submitSupplierReviewDecision = submitSupplierReviewDecision;
  window.handleEscalateTo8D = handleEscalateTo8D;
  window.printSupplierApprovalDoc = printSupplierApprovalDoc;
  window.resetIntakeForm = resetIntakeForm;
  window.handleSupplierFormSubmit = handleSupplierFormSubmit;
  window.simulateAttachSupplierFile = simulateAttachSupplierFile;
}
