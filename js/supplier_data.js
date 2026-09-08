/* ========================================================================= */
/* RAMOS SUPPLIER QUALITY & 4M PCN DATA MANAGEMENT LAYER                     */
/* ========================================================================= */

const SUPPLIER_STORAGE_KEY = 'RAMOS_SUPPLIER_RECORDS_V1';

const SUPPLIER_CATEGORIES = {
  OSAT_PKG: 'OSAT 조립/패키징 (PKG)',
  SMT_MODULE: 'SMT 모듈 외주 (SMT)',
  PCB_SUBSTRATE: 'PCB 기판 제조 (PCB)',
  PASSIVE_COMPONENT: '수동소자/원자재 (MLCC/IC)',
  TEST_HOUSE: '외주 테스트 하우스 (FT/SLT)',
  OTHER: '기타 외주 협력사'
};

const MASTER_SUPPLIERS = [
  { id: 'SUP-HANA', name: '하나마이크론(주)', category: 'OSAT_PKG', plant: '아산 사업장 PKG Line 3', defaultContact: '박민우 과장', email: 'mwpark@hana.com', phone: '010-3344-5566' },
  { id: 'SUP-ASE', name: 'ASE Korea (에이피씨이)', category: 'OSAT_PKG', plant: '파주 사업장 BGA Line 2', defaultContact: '정진호 차장', email: 'jh.jung@asekr.com', phone: '010-8899-1122' },
  { id: 'SUP-AMKOR', name: '앰코테크놀로지코리아(주)', category: 'OSAT_PKG', plant: '송도 K5 사업장', defaultContact: '강동원 수석', email: 'dw.kang@amkor.co.kr', phone: '010-7711-2233' },
  { id: 'SUP-SIG', name: '시그네틱스(주)', category: 'OSAT_PKG', plant: '안산 공장 Line 1', defaultContact: '임채원 책임', email: 'cw.lim@signetics.com', phone: '010-5544-7788' },
  { id: 'SUP-DAEDUCK', name: '대덕전자(주)', category: 'PCB_SUBSTRATE', plant: '안산 사업장 PCB 라인', defaultContact: '최현우 수석', email: 'hwchoi@daeduck.biz', phone: '010-4422-9988' },
  { id: 'SUP-KOREA-CKT', name: '코리아써키트', category: 'PCB_SUBSTRATE', plant: '평택 공장 패키지서브스트레이트 라인', defaultContact: '윤지훈 과장', email: 'jhyun@kckt.co.kr', phone: '010-9988-3344' },
  { id: 'SUP-SEMCO', name: '삼성전기(주)', category: 'PASSIVE_COMPONENT', plant: '수원 사업장 LCR 부품라인', defaultContact: '오세훈 책임', email: 'sh.oh@samsung.com', phone: '010-1234-9876' },
  { id: 'SUP-MURATA', name: '한국무라타전자(주)', category: 'PASSIVE_COMPONENT', plant: '일본 후쿠이 제작소 (국내 공급창구)', defaultContact: '김태균 차장', email: 'tk.kim@murata.com', phone: '010-2345-6789' }
];

const INITIAL_SUPPLIER_RECORDS = [
  {
    ticketId: 'PCN-2026-001',
    ticketType: 'PCN',
    status: 'Under_Review',
    createdAt: '2026-09-08 11:20',
    supplier: {
      category: 'OSAT_PKG',
      companyName: '하나마이크론(주)',
      plant: '아산 사업장 PKG Line 3',
      submitter: '박민우 과장',
      email: 'mwpark@hana.com',
      phone: '010-3344-5566'
    },
    targetProduct: {
      customer: 'LGE DTV',
      partName: '16GB eMMC v5.1 (BGA153)',
      partNumber: 'MMACGD8J0F-KV0AF0-TPAG',
      lotNo: 'HN260901-A'
    },
    classification: {
      change4M: ['Material', 'Machine'],
      issueCategory: '4M_Change_Request',
      riskLevel: 'MAJOR',
      reasonType: 'Cost_Reduction_And_Reliability'
    },
    details: {
      title: 'C102 수동소자 제조사 대체(무라타 X7R) 및 SMT 리플로우 피크온도 조정 건',
      description: '기존 X5R 등급 MLCC의 고온 내열 마진 부족 이슈 해소를 위해 고온보증(125℃) X7R 등급 소재로 대체하고 리플로우 피크 온도를 250℃로 안정화 제어 요청.',
      comparisonTable: [
        {
          item: 'MLCC 유전체 정격',
          current: '삼성전기 0603 X5R 10uF 6.3V (85℃ 정격)',
          proposed: '무라타 0603 X7R 10uF 10V (125℃ 고온보증)',
          riskAssessment: '고온 신뢰성 마진 40℃ 대폭 증가 (PASS 예상)'
        },
        {
          item: 'SMT 리플로우 Peak 온도',
          current: '255℃ (기존 Lead-free 권장치)',
          proposed: '250℃ (피크 5℃ 하향 제어)',
          riskAssessment: '소자 단자 열응력 대폭 완화 (BGA Void율 4.2% 합격)'
        }
      ],
      plannedSampleDate: '2026-09-12',
      plannedMassDate: '2026-09-25'
    },
    evidenceFiles: [
      { name: 'Murata_X7R_MLCC_SpecSheet.pdf', size: '1.4 MB', type: 'pdf' },
      { name: 'TC_1000Cycles_Reliability_Report.xlsx', size: '2.8 MB', type: 'xlsx' }
    ],
    sqeReview: {
      reviewer: '김성중 Senior Pro (SQE Master)',
      reviewedAt: '2026-09-08 14:15',
      decision: 'Under_Review',
      comment: '8D D5 영구대책 및 D7 재발방지와 직결된 핵심 건. 125℃ 가속 신뢰성 시험 데이터 추가 검증 중.',
      bound8DCaseId: 'RAMOS-8D-20260901-01'
    }
  },
  {
    ticketId: 'SQ-2026-002',
    ticketType: 'Issue',
    status: '8D_Escalated',
    createdAt: '2026-09-01 08:45',
    supplier: {
      category: 'OSAT_PKG',
      companyName: 'ASE Korea (에이피씨이)',
      plant: '파주 사업장 BGA Line 2',
      submitter: '정진호 차장',
      email: 'jh.jung@asekr.com',
      phone: '010-8899-1122'
    },
    targetProduct: {
      customer: 'LGE DTV',
      partName: 'DTV eMMC 5.1 16GB (BGA153)',
      partNumber: 'MMACGD8J0F-KV0AF0-TPAG',
      lotNo: '0QH321200A02-LPAGA00'
    },
    classification: {
      change4M: ['Machine', 'Method'],
      issueCategory: 'Subcontractor_Process_Abnormal',
      riskLevel: 'MAJOR',
      reasonType: 'Process_Abnormal'
    },
    details: {
      title: 'eMMC BGA 언더필 노즐 디스펜서 압력 저하로 인한 공정 이상 발생',
      description: '8월 31일 야간조 BGA 라인 #2 디스펜서 압력 센서 오동작으로 언더필 도포 불균일 발생. Affected Lot 4,800개 중 12개 샘플 X-Ray 단면 보이드 18% 검출. 외주 라인 전량 출하 락(Lock) 및 긴급 통보.',
      comparisonTable: [
        {
          item: '디스펜서 공압 제어',
          current: '0.45 MPa (정상 범위)',
          proposed: '0.31 MPa (센서 유격으로 인한 압력 강하)',
          riskAssessment: '솔더 볼 주위 보이드 형성 위험 급증 (전량 선별 필요)'
        }
      ],
      plannedSampleDate: '2026-09-01',
      plannedMassDate: '2026-09-02'
    },
    evidenceFiles: [
      { name: 'ASE_Dispenser_Pressure_Log.csv', size: '450 KB', type: 'csv' },
      { name: 'Xray_Void_Defect_Inspection.png', size: '3.1 MB', type: 'image' }
    ],
    sqeReview: {
      reviewer: '김성중 Senior Pro (SQE Master)',
      reviewedAt: '2026-09-01 09:30',
      decision: '8D_Escalated',
      comment: '고객사 LGE Claim과 일치하는 공정 불량. 사내 8D Case (RAMOS-8D-20260901-01)로 즉시 연계 승격 완료.',
      bound8DCaseId: 'RAMOS-8D-20260901-01'
    }
  },
  {
    ticketId: 'PCN-2026-003',
    ticketType: 'PCN',
    status: 'Approved',
    createdAt: '2026-08-25 15:10',
    supplier: {
      category: 'PCB_SUBSTRATE',
      companyName: '대덕전자(주)',
      plant: '안산 사업장 PCB 라인',
      submitter: '최현우 수석',
      email: 'hwchoi@daeduck.biz',
      phone: '010-4422-9988'
    },
    targetProduct: {
      customer: 'LGE DTV',
      partName: 'eMMC 153-Ball Substrate 8-Layer',
      partNumber: 'SUB-EMMC153-8L-V2',
      lotNo: 'DD-260815-C'
    },
    classification: {
      change4M: ['Material'],
      issueCategory: 'Dual_Sourcing_Approval',
      riskLevel: 'MINOR',
      reasonType: 'Dual_Sourcing'
    },
    details: {
      title: 'PCB Core 동박(Copper Foil) 원소재 2차 벤더(두산전자) 추가 승인 건',
      description: '글로벌 공급망 안정화를 위해 기존 미츠이금속 외 두산전자 고내열 동박을 2차 벤더로 추가 승인 요청.',
      comparisonTable: [
        {
          item: '동박(Copper Foil) 공급사',
          current: '미츠이금속 (단독 공급)',
          proposed: '두산전자 (Dual Sourcing)',
          riskAssessment: '전기적/열적 임피던스 및 박리 강도 동등 이상 확인'
        }
      ],
      plannedSampleDate: '2026-08-28',
      plannedMassDate: '2026-09-05'
    },
    evidenceFiles: [
      { name: 'Daeduck_Dual_Sourcing_Evaluation.pdf', size: '3.6 MB', type: 'pdf' },
      { name: 'Signal_Integrity_PASS_Data.xlsx', size: '1.8 MB', type: 'xlsx' }
    ],
    sqeReview: {
      reviewer: '김성중 Senior Pro (SQE Master)',
      reviewedAt: '2026-08-30 11:00',
      decision: 'Approved',
      comment: '신뢰성 시험 및 전기적 임피던스 측정 결과 100% 만족. ECN-2026-PCB04로 정식 4M 변경 승인 발행.',
      bound8DCaseId: null
    }
  }
];

function loadSupplierRecords() {
  try {
    const raw = localStorage.getItem(SUPPLIER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[SupplierData] Failed to load records, falling back to initial data:', e);
  }
  saveSupplierRecords(INITIAL_SUPPLIER_RECORDS);
  return INITIAL_SUPPLIER_RECORDS;
}

function saveSupplierRecords(records) {
  try {
    localStorage.setItem(SUPPLIER_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('[SupplierData] Failed to save records:', e);
  }
}

function generateSupplierTicketId(type) {
  const prefix = type === 'PCN' ? 'PCN' : 'SQ';
  const year = new Date().getFullYear();
  const records = loadSupplierRecords();
  const sameYearRecords = records.filter(r => r.ticketId && r.ticketId.startsWith(`${prefix}-`));
  const nextSeq = String(sameYearRecords.length + 1).padStart(3, '0');
  return `${prefix}-${year}-${nextSeq}`;
}

function determine4MRiskLevel(change4M = [], reasonType = '') {
  if (change4M.includes('Material') || reasonType === 'Process_Abnormal' || reasonType === 'Cost_Reduction_And_Reliability') {
    return 'MAJOR';
  }
  if (change4M.length >= 2) {
    return 'MAJOR';
  }
  return 'MINOR';
}

function createSupplierTicket(data) {
  const records = loadSupplierRecords();
  const ticketId = generateSupplierTicketId(data.ticketType || 'PCN');
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const createdAt = `${yyyy}-${mm}-${dd} ${hh}:${min}`;

  const newTicket = {
    ticketId,
    ticketType: data.ticketType || 'PCN',
    status: 'Submitted',
    createdAt,
    supplier: {
      category: data.supplierCategory || 'OSAT_PKG',
      companyName: data.companyName || '미지정 협력사',
      plant: data.plant || '',
      submitter: data.submitter || '',
      email: data.email || '',
      phone: data.phone || ''
    },
    targetProduct: {
      customer: data.customer || 'LGE DTV',
      partName: data.partName || '16GB eMMC v5.1',
      partNumber: data.partNumber || 'RMS-EMMC-16G-LGE01',
      lotNo: data.lotNo || ''
    },
    classification: {
      change4M: Array.isArray(data.change4M) ? data.change4M : ['Material'],
      issueCategory: data.issueCategory || (data.ticketType === 'PCN' ? '4M_Change_Request' : 'Process_Abnormal'),
      riskLevel: determine4MRiskLevel(data.change4M, data.reasonType),
      reasonType: data.reasonType || 'Quality_Improvement'
    },
    details: {
      title: data.title || '신규 접수 건',
      description: data.description || '',
      comparisonTable: Array.isArray(data.comparisonTable) && data.comparisonTable.length > 0 ? data.comparisonTable : [
        { item: '주요 변경 사항', current: '현행 사양', proposed: '신규 사양', riskAssessment: '신뢰성 영향 분석 완료' }
      ],
      plannedSampleDate: data.plannedSampleDate || '',
      plannedMassDate: data.plannedMassDate || ''
    },
    evidenceFiles: Array.isArray(data.evidenceFiles) ? data.evidenceFiles : [],
    sqeReview: {
      reviewer: '미지정 (접수 대기)',
      reviewedAt: null,
      decision: 'Pending',
      comment: '',
      bound8DCaseId: null
    }
  };

  records.unshift(newTicket);
  saveSupplierRecords(records);
  return newTicket;
}

function updateSupplierTicketStatus(ticketId, decision, reviewComment = '', reviewerName = '') {
  const records = loadSupplierRecords();
  const ticket = records.find(r => r.ticketId === ticketId);
  if (!ticket) return null;

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const reviewedAt = `${yyyy}-${mm}-${dd} ${hh}:${min}`;

  ticket.status = decision;
  ticket.sqeReview = {
    reviewer: reviewerName || (window.CURRENT_USER ? window.CURRENT_USER.name : 'SQE 담당자'),
    reviewedAt,
    decision,
    comment: reviewComment,
    bound8DCaseId: ticket.sqeReview?.bound8DCaseId || null
  };

  saveSupplierRecords(records);
  return ticket;
}

function bindSupplierTicketTo8DCase(ticketId, caseId) {
  const records = loadSupplierRecords();
  const ticket = records.find(r => r.ticketId === ticketId);
  if (!ticket) return false;

  ticket.status = '8D_Escalated';
  if (!ticket.sqeReview) ticket.sqeReview = {};
  ticket.sqeReview.bound8DCaseId = caseId;
  ticket.sqeReview.decision = '8D_Escalated';
  saveSupplierRecords(records);
  return true;
}

// Global exports
if (typeof window !== 'undefined') {
  window.SUPPLIER_STORAGE_KEY = SUPPLIER_STORAGE_KEY;
  window.SUPPLIER_CATEGORIES = SUPPLIER_CATEGORIES;
  window.MASTER_SUPPLIERS = MASTER_SUPPLIERS;
  window.loadSupplierRecords = loadSupplierRecords;
  window.saveSupplierRecords = saveSupplierRecords;
  window.createSupplierTicket = createSupplierTicket;
  window.updateSupplierTicketStatus = updateSupplierTicketStatus;
  window.bindSupplierTicketTo8DCase = bindSupplierTicketTo8DCase;
}
