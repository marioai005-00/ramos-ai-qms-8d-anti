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
    ticketType: 'PCN',
    customer: 'LGE DTV',
    partName: '16GB eMMC v5.1 (BGA153)',
    partNumber: 'MMACGD8J0F-KV0AF0-TPAG',
    lotNo: 'HN260901-A',
    change4M: ['Material', 'Machine'],
    reasonType: 'Cost_Reduction_And_Reliability',
    title: '',
    description: '',
    plannedSampleDate: '',
    plannedMassDate: ''
  }
};

function switchSupplierTab(tab) {
  supplierPortalState.activeTab = tab;
  renderCurrentView();
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
  }
  renderCurrentView();
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

function removeComparisonRow(idx) {
  if (supplierPortalState.comparisonRows.length > 1) {
    supplierPortalState.comparisonRows.splice(idx, 1);
    renderCurrentView();
  }
}

function updateComparisonField(idx, field, value) {
  if (supplierPortalState.comparisonRows[idx]) {
    supplierPortalState.comparisonRows[idx][field] = value;
  }
}

function renderSupplierPortalView() {
  const isWatchtower = supplierPortalState.activeTab === 'watchtower';

  return `
    <div class="supplier-portal-wrap">
      <!-- Portal Top Header -->
      <div class="supplier-portal-header">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="supplier-portal-icon">
            <i data-lucide="factory" style="width:24px; height:24px; color:#fff;"></i>
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h2 style="margin:0; font-size:1.35rem; font-weight:900; color:var(--text-primary); letter-spacing:-0.02em;">
                외주사 품질 이슈 & 4M PCN 관제 센터
              </h2>
              <span class="badge-pill badge-info" style="font-size:0.7rem;">SQE Portal</span>
              <span class="badge-pill badge-success" style="font-size:0.7rem;">Live Gateway</span>
            </div>
            <p style="margin:3px 0 0; font-size:0.78rem; color:var(--text-secondary);">
              외주 협력사(OSAT·SMT·PKG·PCB·부품사) 공정 이상 통보(SCAR) 및 4M 변경 승인(PCN) 실시간 수신·심의·8D 연계 허브
            </p>
          </div>
        </div>

        <!-- Tab Mode Switcher -->
        <div class="supplier-tabs-switcher">
          <button class="supplier-tab-btn ${isWatchtower ? 'active' : ''}" onclick="switchSupplierTab('watchtower')">
            <i data-lucide="clipboard-list" style="width:15px; height:15px;"></i>
            <span>📋 사내 SQE 실시간 관제 현황판</span>
          </button>
          <button class="supplier-tab-btn ${!isWatchtower ? 'active' : ''}" onclick="switchSupplierTab('intake')">
            <i data-lucide="send" style="width:15px; height:15px;"></i>
            <span>📥 협력사 전용 접수 창구</span>
          </button>
        </div>
      </div>

      <!-- Main Body Container -->
      <div class="supplier-portal-body">
        ${isWatchtower ? renderSupplierWatchtower() : renderSupplierSubmitForm()}
      </div>
    </div>
  `;
}

// -------------------------------------------------------------------------
// TAB 1: SQE REVIEW WATCHTOWER
// -------------------------------------------------------------------------
function renderSupplierWatchtower() {
  const records = loadSupplierRecords();

  // Metrics
  const totalCount = records.length;
  const submittedCount = records.filter(r => r.status === 'Submitted').length;
  const underReviewCount = records.filter(r => r.status === 'Under_Review').length;
  const approvedCount = records.filter(r => r.status === 'Approved' || r.status === 'Conditional_Approved').length;
  const escalatedCount = records.filter(r => r.status === '8D_Escalated').length;

  // Filter & Search
  const filtered = records.filter(r => {
    if (supplierPortalState.filterSupplier !== 'ALL' && r.supplier.companyName !== supplierPortalState.filterSupplier) return false;
    if (supplierPortalState.filterType !== 'ALL' && r.ticketType !== supplierPortalState.filterType) return false;
    if (supplierPortalState.filterStatus !== 'ALL' && r.status !== supplierPortalState.filterStatus) return false;
    if (supplierPortalState.searchQuery) {
      const q = supplierPortalState.searchQuery.toLowerCase();
      const match = (r.ticketId || '').toLowerCase().includes(q) ||
                    (r.supplier.companyName || '').toLowerCase().includes(q) ||
                    (r.details.title || '').toLowerCase().includes(q) ||
                    (r.targetProduct.partNumber || '').toLowerCase().includes(q) ||
                    (r.targetProduct.lotNo || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return `
    <!-- KPI Metrics Strip -->
    <div class="supplier-kpi-grid">
      <div class="supplier-kpi-card">
        <div class="kpi-label">총 접수 건수</div>
        <div class="kpi-val num-mono">${totalCount}</div>
        <div class="kpi-sub">누적 PCN & 품질이슈</div>
      </div>
      <div class="supplier-kpi-card warn">
        <div class="kpi-label">신규 미검토 (NEW)</div>
        <div class="kpi-val num-mono" style="color:#f59e0b;">${submittedCount}</div>
        <div class="kpi-sub">SQE 1차 접수 대기</div>
      </div>
      <div class="supplier-kpi-card info">
        <div class="kpi-label">심의 및 신뢰성 검증 중</div>
        <div class="kpi-val num-mono" style="color:#38bdf8;">${underReviewCount}</div>
        <div class="kpi-sub">시험 성적서 정밀 심의</div>
      </div>
      <div class="supplier-kpi-card success">
        <div class="kpi-label">최종 승인 / 양산 적용</div>
        <div class="kpi-val num-mono" style="color:#10b981;">${approvedCount}</div>
        <div class="kpi-sub">4M ECN 승인 완료</div>
      </div>
      <div class="supplier-kpi-card danger">
        <div class="kpi-label">8D / SCAR 즉시 승격</div>
        <div class="kpi-val num-mono" style="color:#f43f5e;">${escalatedCount}</div>
        <div class="kpi-sub">8D 정식 케이스 연동</div>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="supplier-toolbar-box">
      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <div>
          <label style="font-size:0.72rem; font-weight:700; color:var(--text-secondary); display:block; margin-bottom:2px;">협력사 필터</label>
          <select class="form-control form-control-sm" onchange="supplierPortalState.filterSupplier=this.value; renderCurrentView();">
            <option value="ALL">전체 협력사 (All)</option>
            ${MASTER_SUPPLIERS.map(s => `
              <option value="${s.name}" ${supplierPortalState.filterSupplier === s.name ? 'selected' : ''}>${s.name}</option>
            `).join('')}
          </select>
        </div>

        <div>
          <label style="font-size:0.72rem; font-weight:700; color:var(--text-secondary); display:block; margin-bottom:2px;">접수 유형</label>
          <select class="form-control form-control-sm" onchange="supplierPortalState.filterType=this.value; renderCurrentView();">
            <option value="ALL" ${supplierPortalState.filterType === 'ALL' ? 'selected' : ''}>전체 유형</option>
            <option value="PCN" ${supplierPortalState.filterType === 'PCN' ? 'selected' : ''}>4M 변경 통보 (PCN)</option>
            <option value="Issue" ${supplierPortalState.filterType === 'Issue' ? 'selected' : ''}>공정 품질 이상 통보</option>
          </select>
        </div>

        <div>
          <label style="font-size:0.72rem; font-weight:700; color:var(--text-secondary); display:block; margin-bottom:2px;">심의 상태</label>
          <select class="form-control form-control-sm" onchange="supplierPortalState.filterStatus=this.value; renderCurrentView();">
            <option value="ALL" ${supplierPortalState.filterStatus === 'ALL' ? 'selected' : ''}>전체 상태</option>
            <option value="Submitted" ${supplierPortalState.filterStatus === 'Submitted' ? 'selected' : ''}>신규 접수 (Submitted)</option>
            <option value="Under_Review" ${supplierPortalState.filterStatus === 'Under_Review' ? 'selected' : ''}>심의 중 (Under Review)</option>
            <option value="Approved" ${supplierPortalState.filterStatus === 'Approved' ? 'selected' : ''}>최종 승인 (Approved)</option>
            <option value="Conditional_Approved" ${supplierPortalState.filterStatus === 'Conditional_Approved' ? 'selected' : ''}>조건부 승인</option>
            <option value="Rejected" ${supplierPortalState.filterStatus === 'Rejected' ? 'selected' : ''}>반려 (Rejected)</option>
            <option value="8D_Escalated" ${supplierPortalState.filterStatus === '8D_Escalated' ? 'selected' : ''}>8D 연계 승격</option>
          </select>
        </div>

        <div style="flex:1; min-width:200px;">
          <label style="font-size:0.72rem; font-weight:700; color:var(--text-secondary); display:block; margin-bottom:2px;">검색어 (제목, P/N, Lot, 번호)</label>
          <input type="text" class="form-control form-control-sm" placeholder="🔍 검색어 입력..." value="${supplierPortalState.searchQuery}" oninput="supplierPortalState.searchQuery=this.value; renderCurrentView();">
        </div>
      </div>

      <div style="display:flex; gap:8px;">
        <button class="btn btn-secondary btn-sm" onclick="resetSupplierDemoData()" title="초기 3건 데이터로 복구">
          <i data-lucide="rotate-ccw" style="width:13px; height:13px;"></i>
          <span>초기화</span>
        </button>
        <button class="btn btn-primary btn-sm" onclick="switchSupplierTab('intake')">
          <i data-lucide="plus-circle" style="width:13px; height:13px;"></i>
          <span>+ 신규 외주 이슈/PCN 접수</span>
        </button>
      </div>
    </div>

    <!-- Main Watchtower Table -->
    <div class="supplier-table-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h3 style="margin:0; font-size:0.95rem; font-weight:800; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
          <i data-lucide="layers" style="width:16px; height:16px; color:#2563eb;"></i>
          실시간 수신 및 심의 현황 (${filtered.length}건)
        </h3>
        <span style="font-size:0.72rem; color:var(--text-muted);">
          * 접수 건 클릭 시 상세 대조표 확인 및 심의(승인/반려/8D 연계)가 가능합니다.
        </span>
      </div>

      <div class="supplier-grid-wrap">
        <table class="supplier-grid-table">
          <thead>
            <tr>
              <th style="width:105px;">접수번호</th>
              <th style="width:95px;">접수일시</th>
              <th style="width:140px;">협력사명 (사업장)</th>
              <th style="width:105px;">접수구분</th>
              <th style="width:100px;">4M 항목</th>
              <th>제목 및 대상 P/N / Lot No</th>
              <th style="width:85px; text-align:center;">위험도</th>
              <th style="width:105px; text-align:center;">심의상태</th>
              <th style="width:145px; text-align:center;">SQE 액션</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `
              <tr>
                <td colspan="9" style="text-align:center; padding:36px; color:var(--text-muted); font-size:0.85rem;">
                  검색 조건과 일치하는 외주사 접수 건이 없습니다.
                </td>
              </tr>
            ` : filtered.map(r => renderSupplierTableRow(r)).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderSupplierTableRow(r) {
  const isPCN = r.ticketType === 'PCN';
  const isMajor = r.classification.riskLevel === 'MAJOR';
  
  let statusBadge = '';
  switch (r.status) {
    case 'Submitted':
      statusBadge = '<span class="badge-pill badge-warn" style="font-weight:800;">● 신규 접수</span>';
      break;
    case 'Under_Review':
      statusBadge = '<span class="badge-pill badge-info" style="font-weight:800;">◑ 심의 중</span>';
      break;
    case 'Approved':
      statusBadge = '<span class="badge-pill badge-success" style="font-weight:800;">✓ 승인 완료</span>';
      break;
    case 'Conditional_Approved':
      statusBadge = '<span class="badge-pill badge-warn" style="font-weight:800;">▲ 조건부 승인</span>';
      break;
    case 'Rejected':
      statusBadge = '<span class="badge-pill badge-fail" style="font-weight:800;">✕ 반려</span>';
      break;
    case '8D_Escalated':
      statusBadge = '<span class="badge-pill badge-fail" style="font-weight:800; background:#be123c; color:#fff;">⚡ 8D 승격</span>';
      break;
    default:
      statusBadge = `<span class="badge-pill">${r.status}</span>`;
      break;
  }

  return `
    <tr class="supplier-row ${r.status === 'Submitted' ? 'is-new' : ''}">
      <td>
        <a href="javascript:void(0)" onclick="openSupplierTicketModal('${r.ticketId}')" class="ticket-id-link num-mono">
          ${r.ticketId}
        </a>
      </td>
      <td style="font-size:0.75rem; color:var(--text-secondary);">${r.createdAt}</td>
      <td>
        <div style="font-weight:700; color:var(--text-primary); font-size:0.82rem;">${r.supplier.companyName}</div>
        <div style="font-size:0.7rem; color:var(--text-muted);">${r.supplier.plant || r.supplier.category}</div>
      </td>
      <td>
        <span class="badge-pill ${isPCN ? 'badge-info' : 'badge-fail'}" style="font-size:0.72rem; font-weight:800;">
          ${isPCN ? '4M PCN 통보' : '공정 품질이상'}
        </span>
      </td>
      <td>
        <div style="display:flex; gap:3px; flex-wrap:wrap;">
          ${(r.classification.change4M || []).map(m => `
            <span class="chip-4m chip-${m.toLowerCase()}">${m}</span>
          `).join('')}
        </div>
      </td>
      <td>
        <div style="font-weight:700; color:var(--text-primary); font-size:0.82rem; margin-bottom:2px;">
          ${r.details.title}
        </div>
        <div style="font-size:0.72rem; color:var(--text-secondary); display:flex; gap:8px;">
          <span>P/N: <b class="num-mono">${r.targetProduct.partNumber}</b></span>
          ${r.targetProduct.lotNo ? `<span>Lot: <b class="num-mono">${r.targetProduct.lotNo}</b></span>` : ''}
        </div>
      </td>
      <td style="text-align:center;">
        <span class="badge-risk ${isMajor ? 'risk-major' : 'risk-minor'}">
          ${isMajor ? 'MAJOR' : 'MINOR'}
        </span>
      </td>
      <td style="text-align:center;">${statusBadge}</td>
      <td style="text-align:center;">
        <div style="display:flex; justify-content:center; gap:4px;">
          <button class="btn btn-secondary btn-sm" style="padding:2px 7px; font-size:0.72rem;" onclick="openSupplierTicketModal('${r.ticketId}')" title="상세 검토 및 심의">
            심의
          </button>
          <button class="btn btn-primary btn-sm" style="padding:2px 7px; font-size:0.72rem; background:#be123c; border-color:#9f1239;" onclick="handleEscalateTo8D('${r.ticketId}')" title="8D 정식 케이스로 연계 승격">
            8D연계
          </button>
        </div>
      </td>
    </tr>
  `;
}

// -------------------------------------------------------------------------
// TAB 2: SUPPLIER INTAKE FORM
// -------------------------------------------------------------------------
function renderSupplierSubmitForm() {
  const f = supplierPortalState.intakeForm;
  const isPCN = f.ticketType === 'PCN';

  return `
    <div class="supplier-form-card">
      <div class="supplier-form-head">
        <div style="display:flex; align-items:center; gap:10px;">
          <i data-lucide="send" style="width:22px; height:22px; color:#2563eb;"></i>
          <div>
            <h3 style="margin:0; font-size:1.15rem; font-weight:800; color:var(--text-primary);">
              외주 협력사 품질 이상 통보 및 4M 변경(PCN) 정식 접수
            </h3>
            <p style="margin:2px 0 0; font-size:0.75rem; color:var(--text-secondary);">
              작성 즉시 라모스테크놀러지 품질본부(SQE) 및 개발팀 관제 현황판으로 실시간 등록됩니다.
            </p>
          </div>
        </div>
        <div style="font-size:0.72rem; color:#f59e0b; font-weight:700;">
          * 사전 승인 없는 4M 임의 변경 시 납품 중단 및 고객사 클레임 귀책 처리 대상
        </div>
      </div>

      <form id="supplierIntakeForm" onsubmit="handleSupplierFormSubmit(event)">
        <!-- 1. 협력사 식별 정보 -->
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
            <input type="radio" name="ticketType" value="PCN" ${isPCN ? 'checked' : ''} onchange="supplierPortalState.intakeForm.ticketType='PCN'; renderCurrentView();">
            <div style="margin-left:8px;">
              <b style="display:block; font-size:0.88rem; color:var(--text-primary);">🔘 4M 변경 통보 (PCN: Process Change Notification)</b>
              <span style="font-size:0.72rem; color:var(--text-secondary);">설비, 금형, 자재, 공정조건 변경 시 사전 승인 요청 (샘플 및 신뢰성 평가 필수)</span>
            </div>
          </label>

          <label class="supplier-type-card ${!isPCN ? 'selected' : ''}">
            <input type="radio" name="ticketType" value="Issue" ${!isPCN ? 'checked' : ''} onchange="supplierPortalState.intakeForm.ticketType='Issue'; renderCurrentView();">
            <div style="margin-left:8px;">
              <b style="display:block; font-size:0.88rem; color:#f43f5e;">🔘 외주 공정 품질 이상 발생 긴급 통보 (SCAR)</b>
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
            <label class="form-label">변경/이상 사유 분류</label>
            <select class="form-control" name="reasonType">
              <option value="Cost_Reduction_And_Reliability">원소재 단종 대응 및 신뢰성 내열 개선 (Quality/Reliability)</option>
              <option value="Cost_Reduction">원가 절감 (Cost Reduction)</option>
              <option value="Dual_Sourcing">공급망 안정화 (Dual Sourcing)</option>
              <option value="Equipment_Maintenance">설비 노후 수리 및 능력 증설 (Capacity Up)</option>
              <option value="Process_Abnormal">외주 라인 공정 불량 급증 긴급 통보 (Abnormal Issue)</option>
            </select>
          </div>
        </div>

        <div class="form-group" style="margin-top:8px;">
          <label class="form-label">접수 제목</label>
          <input type="text" class="form-control" name="title" placeholder="예: C102 MLCC 고온내열 X7R 소자 대체 및 리플로우 프로파일 조정 승인의 건" required style="font-weight:700;">
        </div>
        <div class="form-group" style="margin-top:8px;">
          <label class="form-label">상세 변경 배경 및 이슈 설명</label>
          <textarea class="form-control" name="description" rows="3" placeholder="변경 배경, 원인 분석, 시험 결과, 위험 분석 내용을 구체적으로 기술해 주십시오." required></textarea>
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
            <input type="date" class="form-control" name="plannedSampleDate" value="2026-09-15" required>
          </div>
          <div class="form-group">
            <label class="form-label">양산 적용 희망일</label>
            <input type="date" class="form-control" name="plannedMassDate" value="2026-10-01" required>
          </div>
        </div>

        <!-- Dropzone Mock -->
        <div class="supplier-dropzone" onclick="simulateAttachSupplierFile()">
          <i data-lucide="upload-cloud" style="width:32px; height:32px; color:#38bdf8; margin-bottom:6px;"></i>
          <div style="font-weight:700; color:var(--text-primary); font-size:0.85rem;">
            클릭하여 신뢰성 시험 성적서, 4M 검토서, 사진 증빙 자료 첨부
          </div>
          <div style="font-size:0.72rem; color:var(--text-muted); margin-top:3px;">
            지원 포맷: PDF, XLSX, CSV, PNG, JPG (최대 50MB) · 공인 성적서 사전 검증
          </div>
          <div id="supplierAttachedList" style="margin-top:8px; display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
            <span class="badge-pill badge-info" style="font-size:0.72rem;">📎 Murata_X7R_Reliability_Test.pdf (1.4MB)</span>
            <span class="badge-pill badge-info" style="font-size:0.72rem;">📎 SMT_Reflow_Thermal_Profile.xlsx (2.1MB)</span>
          </div>
        </div>

        <!-- Form Submit Bar -->
        <div class="supplier-form-foot">
          <button type="button" class="btn btn-secondary" onclick="resetIntakeForm()">
            입력 초기화
          </button>
          <button type="submit" class="btn btn-primary" style="padding:10px 24px; font-size:0.88rem; font-weight:800;">
            <i data-lucide="send" style="width:16px; height:16px;"></i>
            <span>🚀 외주 품질 / 4M PCN 정식 접수 및 고유번호 발급</span>
          </button>
        </div>
      </form>
    </div>
  `;
}

function simulateAttachSupplierFile() {
  alert('신뢰성 시험 성적서(TC 1000h, HAST) 및 스펙시트 2건이 기본 첨부되었습니다.');
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

  const change4M = [];
  form.querySelectorAll('input[name="change4M"]:checked').forEach(cb => change4M.push(cb.value));
  if (change4M.length === 0) change4M.push('Material');

  const ticketData = {
    ticketType: formData.get('ticketType') || 'PCN',
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
    reasonType: formData.get('reasonType'),
    title: formData.get('title'),
    description: formData.get('description'),
    comparisonTable: supplierPortalState.comparisonRows.filter(r => r.item || r.proposed),
    plannedSampleDate: formData.get('plannedSampleDate'),
    plannedMassDate: formData.get('plannedMassDate'),
    evidenceFiles: [
      { name: 'Supplier_Reliability_Report.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'Process_Condition_Comparison.xlsx', size: '1.2 MB', type: 'xlsx' }
    ]
  };

  const newTicket = createSupplierTicket(ticketData);
  alert(`[접수 완료] 외주 접수번호 [${newTicket.ticketId}]가 정상 발급되었습니다.\n사내 SQE 관제 현황판으로 자동 이동합니다.`);
  
  supplierPortalState.activeTab = 'watchtower';
  renderCurrentView();
}

// -------------------------------------------------------------------------
// MODAL: DETAILED TICKET REVIEW & DECISION
// -------------------------------------------------------------------------
function openSupplierTicketModal(ticketId) {
  const records = loadSupplierRecords();
  const ticket = records.find(r => r.ticketId === ticketId);
  if (!ticket) return;

  const modal = document.getElementById('globalModal');
  const container = document.getElementById('modalContainer');
  if (!modal || !container) return;

  const isMajor = ticket.classification.riskLevel === 'MAJOR';
  const isPCN = ticket.ticketType === 'PCN';

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:12px; margin-bottom:16px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="badge-pill ${isPCN ? 'badge-info' : 'badge-fail'}" style="font-size:0.75rem;">
          ${ticket.ticketType}
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

      <!-- Attachments -->
      <div style="margin-bottom:16px;">
        <label style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">제출된 증빙 및 시험 성적서 파일</label>
        <div style="display:flex; gap:8px; margin-top:4px; flex-wrap:wrap;">
          ${(ticket.evidenceFiles || []).map(f => `
            <div style="display:flex; align-items:center; gap:6px; background:var(--bg-card-subtle); border:1px solid var(--border); padding:5px 10px; border-radius:4px; font-size:0.75rem;">
              <i data-lucide="file-text" style="width:14px; height:14px; color:#38bdf8;"></i>
              <b>${f.name}</b>
              <span style="color:var(--text-muted);">(${f.size})</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SQE Review Form -->
      <div style="background:rgba(37, 99, 235, 0.05); border:1px solid rgba(37, 99, 235, 0.3); border-radius:6px; padding:14px; margin-bottom:12px;">
        <div style="font-weight:800; font-size:0.88rem; color:#2563eb; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <i data-lucide="check-circle" style="width:16px; height:16px;"></i>
          사내 품질본부(SQE) 공식 심의 및 판정
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:8px;">
          <div class="form-group">
            <label class="form-label">SQE 담당 심의자</label>
            <input type="text" id="modalReviewer" class="form-control" value="${window.CURRENT_USER ? `${window.CURRENT_USER.name} ${window.CURRENT_USER.position}` : '김성중 Senior Pro (SQE Master)'}" readonly>
          </div>
          <div class="form-group">
            <label class="form-label">심의 판정 선택</label>
            <select id="modalDecision" class="form-control" style="font-weight:700;">
              <option value="Approved" ${ticket.status === 'Approved' ? 'selected' : ''}>✓ 최종 승인 (Approved - 양산 적용 허가)</option>
              <option value="Conditional_Approved" ${ticket.status === 'Conditional_Approved' ? 'selected' : ''}>▲ 조건부 승인 (초도품 3개 Lot 전수검사 전제)</option>
              <option value="Under_Review" ${ticket.status === 'Under_Review' ? 'selected' : ''}>◑ 심의 중 (신뢰성 추가 성적서 보완 요구)</option>
              <option value="Rejected" ${ticket.status === 'Rejected' ? 'selected' : ''}>✕ 반려 (Reject - 스펙 미달 불승인)</option>
              <option value="8D_Escalated" ${ticket.status === '8D_Escalated' ? 'selected' : ''}>⚡ 8D 연계 승격 (정식 부적합 Case 발행)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">품질팀 심의 종합 의견 및 조건</label>
          <textarea id="modalReviewComment" class="form-control" rows="2" placeholder="승인 조건, 신뢰성 검증 요건, 또는 반려 사유를 기술하십시오.">${ticket.sqeReview?.comment || ''}</textarea>
        </div>
      </div>
    </div>

    <!-- Modal Footer Actions -->
    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:12px;">
      <button class="btn btn-secondary btn-sm" onclick="printSupplierApprovalDoc('${ticket.ticketId}')">
        <i data-lucide="printer" style="width:14px; height:14px;"></i>
        <span>🖨️ A4 심의 통보 공문 출력</span>
      </button>

      <div style="display:flex; gap:8px;">
        <button class="btn btn-primary btn-sm" style="background:#be123c; border-color:#9f1239;" onclick="handleEscalateTo8D('${ticket.ticketId}')">
          <i data-lucide="zap" style="width:14px; height:14px;"></i>
          <span>8D Case 즉시 연계</span>
        </button>
        <button class="btn btn-primary btn-sm" onclick="submitSupplierReviewDecision('${ticket.ticketId}')">
          <i data-lucide="save" style="width:14px; height:14px;"></i>
          <span>심의 결과 확정 저장</span>
        </button>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  if (window.lucide) lucide.createIcons();
}

function submitSupplierReviewDecision(ticketId) {
  const decision = document.getElementById('modalDecision')?.value || 'Approved';
  const comment = document.getElementById('modalReviewComment')?.value || '';
  const reviewer = document.getElementById('modalReviewer')?.value || '';

  const updated = updateSupplierTicketStatus(ticketId, decision, comment, reviewer);
  if (updated) {
    alert(`[심의 완료] [${ticketId}] 판정 상태가 '${decision}'(으)로 갱신되었습니다.`);
    closeModal();
    renderCurrentView();
  }
}

// -------------------------------------------------------------------------
// 8D ESCALATION ACTION
// -------------------------------------------------------------------------
function handleEscalateTo8D(ticketId) {
  const records = loadSupplierRecords();
  const ticket = records.find(r => r.ticketId === ticketId);
  if (!ticket) return;

  if (!confirm(`외주 건 [${ticket.ticketId}] (${ticket.supplier.companyName})을(를) 사내 8D 부적합 공식 Case로 승격 연계하시겠습니까?`)) {
    return;
  }

  // Bind to active case or create linkage
  const activeCase = getActiveCase();
  if (activeCase) {
    bindSupplierTicketTo8DCase(ticket.ticketId, activeCase.id);
    
    // Auto-fill D2 problem statement with supplier info if empty or prompt
    if (activeCase.d2 && !activeCase.d2.problemStatement) {
      activeCase.d2.problemStatement = `[외주사 귀책 이상 발생] 협력사: ${ticket.supplier.companyName} (${ticket.supplier.plant}) / Lot: ${ticket.targetProduct.lotNo}\n내용: ${ticket.details.description}`;
      activeCase.d2.problemWhere = ticket.supplier.companyName;
      activeCase.d2.problemWhich = ticket.targetProduct.lotNo;
      saveAppData();
    }

    alert(`외주 접수 건이 현재 8D Case [${activeCase.id}]와 공식 연계되었습니다.\n8D 워크스페이스(D2)로 이동합니다.`);
    closeModal();
    switchStage('D2');
  } else {
    alert(`활성화된 8D Case가 없습니다. 신규 Case 접수 화면으로 이동합니다.`);
    closeModal();
    switchNav('new-case');
  }
}

// -------------------------------------------------------------------------
// PRINT A4 NOTIFICATION DOCUMENT
// -------------------------------------------------------------------------
function printSupplierApprovalDoc(ticketId) {
  const records = loadSupplierRecords();
  const t = records.find(r => r.ticketId === ticketId);
  if (!t) return;

  const isApproved = t.status === 'Approved' || t.status === 'Conditional_Approved';
  const printWin = window.open('', '_blank', 'width=900,height=1100');
  if (!printWin) {
    alert('팝업 차단을 해제해 주십시오.');
    return;
  }

  printWin.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>4M PCN 심의 결과 공식 통보서 - ${t.ticketId}</title>
      <style>
        @page { size: A4 portrait; margin: 15mm; }
        body { font-family: 'Segoe UI', 'Noto Sans KR', sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 11pt; line-height: 1.5; }
        .doc-paper { max-width: 800px; margin: 0 auto; border: 2px solid #1e293b; padding: 28px; }
        .doc-head { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 16px; }
        .doc-title { font-size: 18pt; font-weight: 900; color: #1e3a8a; letter-spacing: -0.02em; }
        .doc-sub { font-size: 9pt; color: #64748b; margin-top: 4px; }
        .doc-table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 9.5pt; }
        .doc-table th, .doc-table td { border: 1px solid #94a3b8; padding: 6px 8px; vertical-align: top; }
        .doc-table th { background: #f1f5f9; color: #1e293b; font-weight: 700; width: 18%; }
        .stamp-box { display: inline-block; padding: 4px 14px; border: 2px solid ${isApproved ? '#059669' : '#dc2626'}; color: ${isApproved ? '#059669' : '#dc2626'}; font-weight: 900; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="doc-paper">
        <div class="doc-head">
          <div class="doc-title">4M 변경 통보(PCN) 심의 결과 회신 공문</div>
          <div class="doc-sub">RAMOS TECHNOLOGY CO., LTD. · QUALITY ASSURANCE DIVISION</div>
        </div>

        <table class="doc-table">
          <tr>
            <th>문서 번호</th><td>${t.ticketId}</td>
            <th>심의 일자</th><td>${t.sqeReview?.reviewedAt || t.createdAt}</td>
          </tr>
          <tr>
            <th>수신 협력사</th><td>${t.supplier.companyName} (${t.supplier.submitter} 귀하)</td>
            <th>발신 부서</th><td>라모스테크놀러지 품질혁신팀 (SQE)</td>
          </tr>
          <tr>
            <th>대상 품목</th><td colspan="3">${t.targetProduct.partName} (P/N: ${t.targetProduct.partNumber}) / Lot: ${t.targetProduct.lotNo}</td>
          </tr>
          <tr>
            <th>신청 제목</th><td colspan="3"><b>${t.details.title}</b></td>
          </tr>
          <tr>
            <th>4M 항목</th><td>${(t.classification.change4M || []).join(', ')}</td>
            <th>위험도 등급</th><td><b>${t.classification.riskLevel}</b></td>
          </tr>
          <tr>
            <th>최종 판정</th>
            <td colspan="3">
              <div class="stamp-box">${t.status.toUpperCase()}</div>
            </td>
          </tr>
          <tr>
            <th>품질팀 의견</th>
            <td colspan="3" style="min-height:80px;">
              ${t.sqeReview?.comment || '특이 의견 없음'}
            </td>
          </tr>
        </table>

        <div style="margin-top:40px; text-align:right; padding-right:20px;">
          <p style="font-size:10pt;"><b>(주)라모스테크놀러지 품질혁신본부장</b></p>
          <p style="font-size:8pt; color:#64748b;">직인 생략 · 전자 결재 공문</p>
        </div>
      </div>
      <script>window.print();</script>
    </body>
    </html>
  `);
  printWin.document.close();
}

function resetSupplierDemoData() {
  if (confirm('외주사 접수 데이터를 초기 3건 벤치마크 상태로 복구하시겠습니까?')) {
    saveSupplierRecords(INITIAL_SUPPLIER_RECORDS);
    renderCurrentView();
  }
}

// Global exports
if (typeof window !== 'undefined') {
  window.supplierPortalState = supplierPortalState;
  window.renderSupplierPortalView = renderSupplierPortalView;
  window.switchSupplierTab = switchSupplierTab;
  window.onSupplierMasterSelect = onSupplierMasterSelect;
  window.addComparisonRow = addComparisonRow;
  window.removeComparisonRow = removeComparisonRow;
  window.updateComparisonField = updateComparisonField;
  window.handleSupplierFormSubmit = handleSupplierFormSubmit;
  window.openSupplierTicketModal = openSupplierTicketModal;
  window.submitSupplierReviewDecision = submitSupplierReviewDecision;
  window.handleEscalateTo8D = handleEscalateTo8D;
  window.printSupplierApprovalDoc = printSupplierApprovalDoc;
  window.resetSupplierDemoData = resetSupplierDemoData;
}
