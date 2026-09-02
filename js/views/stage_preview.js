/* Interactive example case and D1~D8 stage report preview */
const EXAMPLE_CASE_ID = 'RAMOS-SAMPLE-8D-001';

function createInteractiveExampleCase() {
  const c = JSON.parse(JSON.stringify(INITIAL_CASES[0]));
  c.id = EXAMPLE_CASE_ID;
  c.isExampleCase = true;
  c.sourceIntakeId = 'RAMOS-SAMPLE-INTAKE-001';
  c.currentStage = 'D8';
  c.status = 'Closed';
  c.receiptDate = '2026-09-01 08:30';
  c.dueDateInitial = '2026-09-02 08:30 (24h SLA)';
  c.dueDateFinal = '2026-09-14 18:00';
  c.team = [
    { role:'Customer Response Owner', name:'이하영 Pro', dept:'전략소싱팀', contact:'1hyduddlqk@ramostek.com', status:'Active' },
    { role:'8D Champion', name:'황승안 팀장_상무', dept:'품질혁신팀', contact:'sahwang@ramostek.com', status:'Active' },
    { role:'8D Leader (연구소/개발 주관)', name:'김현수 실장_상무', dept:'Flash 개발실', contact:'hskim@ramostek.com', status:'Active' },
    { role:'Technical / FA Lead', name:'박재환 팀장_S.Pro', dept:'Flash 개발2팀', contact:'jhpark@ramostek.com', status:'Active' },
    { role:'Process Engineer (공정기술)', name:'이성우 팀장_P.Pro', dept:'Flash 개발3팀', contact:'fog1007@ramostek.com', status:'Active' },
    { role:'Material Containment Lead', name:'이은산 센터장_상무', dept:'제조기획센터', contact:'eunsan.lee@ramostek.com', status:'Active' },
    { role:'8D Quality Facilitator / 실무', name:'김성중 Senior Pro', dept:'품질혁신팀', contact:'sjkim@ramostek.com', status:'Active' }
  ];
  c.cftRecommendation = { humanConfirmed:true, confirmedAt:'2026-09-01 10:20', confirmedBy:'김성중 Senior Pro' };
  c.cftRaci = { acknowledged:true, acknowledgedAt:'2026-09-01 10:30', acknowledgedBy:'김성중 Senior Pro' };
  c.d2.problemStatement = '2026년 8월 31일 LGE 평택 DTV SMT Post-Reflow ICT에서 RM-EM51-064G-X1, LOT EM2608-DTV01 중 12/10,000ea가 Power-on 시 CID Read Timeout과 VCC-VSS 0.8Ω Short를 나타냈다.';
  c.d2.isIsNot = c.d2.isIsNot.map(row => ({ ...row, difference: `${row.factor} 조건에서 발생/비발생 경계 확인`, verificationStatus:'Verified' }));
  c.d2.approval = { status:'Approved', humanConfirmed:true, approvedAt:'2026-09-01 13:10', approvedBy:{name:'김성중 Senior Pro',dept:'품질혁신팀'} };
  c.d3.lotScope = { affectedLot:'EM2608-DTV01', adjacentLots:'EM2608-DTV00, EM2608-DTV02', rawMaterialBatch:'Assembly AS260828-A / Test TS260829-B', equipment:'외주 Assembly Line A3 / Tester T-07', shippedQty:10000, inTransitQty:0, customerStockQty:9988, rationale:'동일 자재 Batch와 외주 Assembly/Test 조건을 공유한 인접 LOT까지 임시 관리범위로 선정' };
  c.d3.inventorySources = {
    erp: {
      RAK4:{warehouse:'RAK4',lot:'EM2608-DTV02',currentQty:18000,holdQty:18000,evidence:'ERP_RAK4_HOLD_0901.xlsx',verified:true},
      RAK5:{warehouse:'RAK5',lot:'EM2608-DTV02',currentQty:27000,holdQty:27000,evidence:'ERP_RAK5_HOLD_0901.xlsx',verified:true}
    },
    mes:{processStocks:[{process:'외주 Assembly 회신',lot:'AS260828-A',currentQty:6000,holdQty:6000,status:'Hold',evidence:'Supplier_Assembly_Trace.xlsx'},{process:'외주 Final Test 회신',lot:'TS260829-B',currentQty:9000,holdQty:9000,status:'Hold',evidence:'Supplier_Test_WIP.xlsx'}],evidence:'Supplier_WIP_Trace_Package.zip',verified:true}
  };
  c.d3.actions = [
    {id:'ICA-01',target:'RAK4·RAK5 동일 품번 재고',action:'출하 Block 및 인접 LOT 100% 전기 선별',owner:'이은산 센터장_상무',due:'2026-09-01 12:00',status:'Completed',result:'45,000ea Hold, 선별대기 등록',completion:'2026-09-01 11:40'},
    {id:'ICA-02',target:'LGE 고객 보유재고',action:'LOT EM2608-DTV01 사용중지 및 현장 선별',owner:'이하영 Pro',due:'2026-09-01 15:00',status:'Completed',result:'10,000ea 확인, NG 12ea 격리',completion:'2026-09-01 14:35'},
    {id:'ICA-03',target:'외주 Assembly·Test WIP',action:'공통 자재/설비 조건 LOT Hold 및 Trace 회신',owner:'박재환 팀장_S.Pro',due:'2026-09-02 10:00',status:'Completed',result:'15,000ea Hold 및 Genealogy 수신',completion:'2026-09-02 09:20'}
  ];
  c.d3.effectiveness = {noAdditionalClaim:'yes',lineStable:'yes',stockReconciled:'yes',verificationEvidence:'ERP Hold 화면, 고객 선별결과, 외주사 Trace 회신 대조 완료'};
  c.d3.approval = {status:'Approved',humanConfirmed:true,approvedAt:'2026-09-02 11:00',approvedBy:{name:'김성중 Senior Pro',dept:'품질혁신팀'}};

  const toolRows = [
    ['timeline','고객 불량 전후 변경점과 마지막 정상 LOT 확인','생산/출하 Timeline, EVD-01','8/28 외주 Assembly 자재 변경 이후 최초 발생'],
    ['process-flow','불량 발생·검출 가능 공정 위치 확인','외주 Assembly/Test Flow, 검사 Flow','Assembly 열이력에서 발생, 상온 FT에서 유출 가능'],
    ['change-point','정상 LOT 대비 변경 요소 확인','4M Change Notice, BOM Review','C102 MLCC 자재 Grade가 X7R에서 X5R로 변경'],
    ['fishbone','8M 기준 원인 후보 누락 방지','CFT Fishbone 회의록','Material·Measurement·Supplier 축의 6개 후보 우선 검증'],
    ['five-why','발생·유출·시스템 원인 연결','3-Track 5 Why Sheet','내열 마진·검사 Coverage·변경관리 기준 부재로 수렴'],
    ['genealogy','외주 LOT와 당사/고객 LOT 연결','Supplier Trace Package','Assembly AS260828-A와 Test TS260829-B 공통 확인'],
    ['test-coverage','고온 열화 불량의 검사 검출 가능성 확인','FT Program Rev.1, Coverage Review','상온 FT만 수행하여 잠재 Crack 검출 불가'],
    ['physical-fa','불량 메커니즘 물리적 입증','EVD-04~EVD-08','MLCC 탈거 후 Short 해소 및 SEM 유전체 Crack 확인']
  ];
  c.d4.analysisProfile = {failureMode:'electrical',pattern:'lot-cluster',dataScope:'lot',productionModel:'outsourced',escapeConcern:'yes'};
  c.d4.recommendations = [];
  c.d4.selectedTools = toolRows.map(([id,hypothesis,evidence,finding]) => ({id,source:'AI',hypothesis,evidence,finding,owner:id==='physical-fa'?'박재환 팀장_S.Pro':'김성중 Senior Pro',status:'Confirmed',verified:true}));
  const proofChecks = {reproduced:true,removed:true,boundary:true,evidence:true};
  c.d4.rootCauses = {
    Occurrence:{type:'Occurrence',statement:'C102 X5R MLCC의 고온 마진 부족과 Reflow 열응력이 유전체 Crack 및 VCC-VSS Short를 발생시켰다.',evidence:'EVD-04, EVD-07, EVD-08',contraryEvidence:'BGA Joint와 FW 가설은 X-Ray 및 탈거시험으로 기각',validationMethod:'MLCC 탈거 시 저항 정상 복구, SEM Crack 확인, X7R 대체품 재현시험 0 Fail',status:'Confirmed',checks:{...proofChecks}},
    Escape:{type:'Escape',statement:'외주 Final Test가 상온 기능시험만 수행하여 열응력 잠재 Crack을 검출하지 못했다.',evidence:'FT Program Rev.1, Test Coverage Review',contraryEvidence:'출하검사 기록은 정상이나 고온 조건 미포함',validationMethod:'125℃ Stress 후 검사에서 불량 재현, Guard Band 조건 추가 후 검출 확인',status:'Confirmed',checks:{...proofChecks}},
    System:{type:'System',statement:'외주 자재 변경 시 신뢰성 등급과 고객 사용조건을 대조하는 변경 승인 Gate가 없었다.',evidence:'BOM Review Checklist Rev.2, Supplier Change Audit',contraryEvidence:'일반 외관·전기 승인항목은 존재하나 온도등급 항목 없음',validationMethod:'개정 Checklist 모의심사에서 X5R 변경 자동 차단 확인',status:'Confirmed',checks:{...proofChecks}}
  };
  c.d4.candidateCauses = ['Occurrence','Escape','System'].map((type,index) => ({id:`RC-${String(index+1).padStart(2,'0')}`,type,title:c.d4.rootCauses[type].statement,status:'Confirmed',supportingEvidence:c.d4.rootCauses[type].evidence.split(',').map(v=>v.trim()),contradictingEvidence:c.d4.rootCauses[type].contraryEvidence,missingEvidence:'없음'}));
  c.d4.approval = {status:'Approved',humanConfirmed:true,approvedAt:'2026-09-05 16:20',approvedBy:{name:'김성중 Senior Pro',dept:'품질혁신팀'}};
  delete c.gates;
  return c;
}

function loadInteractiveExampleCase() {
  const example = createInteractiveExampleCase();
  const index = appData.cases.findIndex(c => c.id === EXAMPLE_CASE_ID);
  if (index >= 0) appData.cases[index] = example;
  else appData.cases.unshift(example);
  appData.activeCaseId = example.id;
  appData.currentView = 'stage';
  appData.activeStage = 'D1';
  saveAppData();
  renderCaseSelector();
  renderCurrentView();
  alert('D1~D8 입력 예시와 단계별 Report 미리보기가 준비되었습니다. 상단 단계와 [현재 단계 Report 미리보기]를 차례대로 확인하세요.');
}

function openStageReportPreview(stage) {
  const c = getActiveCase();
  if (!c) return;
  if (stage === 'D2' && typeof captureD2Form === 'function') captureD2Form(c);
  if (stage === 'D3' && typeof captureD3Form === 'function') captureD3Form(c);
  if (stage === 'D4' && typeof captureD4Form === 'function') captureD4Form(c);
  const modal = document.getElementById('globalModal');
  const container = document.getElementById('modalContainer');
  if (!modal || !container) return;
  container.style.width = '1080px';
  container.style.maxWidth = '96vw';
  container.innerHTML = `<div class="stage-preview-shell">
    <header class="stage-preview-header no-print"><div><span>LIVE REPORT PREVIEW</span><h2>${stage} 단계 고객 보고서 미리보기</h2><p>현재 화면에 입력된 내용을 고객 제출 문서 구조로 변환한 초안입니다.</p></div><div><button class="btn btn-secondary btn-sm" onclick="document.getElementById('globalModal').style.display='none';switchNav('reports-hub')">공식 Report Hub</button><button class="btn btn-secondary btn-sm" onclick="document.getElementById('globalModal').style.display='none'">닫기</button></div></header>
    ${renderStageReportPreview(c,stage)}
  </div>`;
  modal.style.display = 'flex';
  if (window.lucide) lucide.createIcons();
}

function renderStageImplementationGuide(stage) {
  const guides = {
    D1:['조직도 기반 AI 역할 추천','잘못 배정한 CFT 인원 삭제','RACI 책임 확인','사람의 최종 구성 확정'],
    D2:['5W2H 사실 입력','IS / IS NOT AI 비교 초안','행별 원본 사실 확인','표준 문제 정의문 승인'],
    D3:['LOT 영향범위 설정','ERP RAK4·RAK5 분리 확인','공정/외주 WIP Evidence','봉쇄조치와 효과성 승인'],
    D4:['25개 품질도구 라이브러리','Case 특성별 AI 도구 추천','도구별 가설·Evidence·결론','발생·유출·시스템 원인 Gate'],
    D5:['영구대책 후보 비교','원인 제거율·비용·Risk 평가','PCA 선택 근거','ECN/PCN 연결'],
    D6:['대책 적용 정보','Before / After 비교','신뢰성·양산 검증시험','0 Fail 효과성 확인'],
    D7:['DFMEA·PFMEA·Control Plan 개정','표준문서 Revision 관리','유사 제품 위험 확인','수평전개 완료 추적'],
    D8:['종결 필수조건 Checklist','단계별 Evidence 완결','내부 결재와 고객 송부','CFT 성과·감사 기록']
  };
  const items=guides[stage]||[];
  return `<section class="stage-implementation-guide no-print"><header><span>IMPLEMENTED IN ${stage}</span><strong>이 단계에서 확인할 기능</strong></header><div>${items.map((item,index)=>`<p><b>${String(index+1).padStart(2,'0')}</b>${item}</p>`).join('')}</div></section>`;
}

function reportEmpty(value, fallback='작성 대기') { return value || `<span class="stage-report-empty">${fallback}</span>`; }
function reportRows(rows, emptyCols, mapper) { return rows?.length ? rows.map(mapper).join('') : `<tr><td colspan="${emptyCols}" class="stage-report-empty">등록된 내용 없음</td></tr>`; }

function renderStageReportPreview(c, stage) {
  const stageMeta = {
    D1:['Cross-Functional Team','CFT 구성과 역할·책임'], D2:['Problem Description','5W2H와 문제 경계'],
    D3:['Interim Containment','영향 범위와 봉쇄조치'], D4:['Root Cause Analysis','발생·유출·시스템 원인'],
    D5:['Permanent Corrective Action','영구대책 선정'], D6:['Implementation & Validation','대책 적용과 효과검증'],
    D7:['Prevent Recurrence','표준 개정과 수평전개'], D8:['Closure & Recognition','최종 승인과 종결']
  }[stage] || ['8D Report','단계 미선택'];
  return `<article class="stage-report-paper">
    <div class="stage-report-watermark">${c.isExampleCase?'SAMPLE · TRAINING DATA':'DRAFT · HUMAN APPROVAL REQUIRED'}</div>
    <table class="stage-report-head"><tr><td class="brand"><b>RAMOS</b><small>QUALITY MANAGEMENT SYSTEM</small></td><td><h1>${stage}. ${stageMeta[0]}</h1><p>${stageMeta[1]}</p></td><td><b>Report No.</b><span>${c.id}</span><b>Status</b><span>${c.status}</span></td></tr></table>
    <table class="stage-report-summary"><tr><th>Customer</th><td>${c.customer}</td><th>Product / P.N</th><td>${c.product}<br>${c.partNumber}</td></tr><tr><th>LOT</th><td>${c.lotNumber}</td><th>Failure</th><td>${c.defectQty}/${Number(c.inspectQty||0).toLocaleString()}ea · ${c.ppm} PPM</td></tr><tr><th>Symptom</th><td colspan="3">${c.claimTitle}</td></tr></table>
    ${renderStageReportSection(c,stage)}
    <footer class="stage-report-foot"><span>Evidence 기반 자동 편집 초안 · AI 판단은 품질 담당자의 승인을 대체하지 않습니다.</span><span>${stage} / ${new Date().toISOString().slice(0,10)}</span></footer>
  </article>`;
}

function renderStageReportSection(c,stage) {
  if(stage==='D1') return `<section class="stage-report-section"><h3>D1 · CFT Assignment & RACI</h3><table><thead><tr><th>Role</th><th>Name</th><th>Department</th><th>Status</th></tr></thead><tbody>${reportRows(c.team,4,m=>`<tr><td>${m.role}</td><td><b>${m.name}</b></td><td>${m.dept}</td><td>${m.status}</td></tr>`)}</tbody></table><div class="stage-report-callout">RACI 확인: ${c.cftRaci?.acknowledged?'완료':'대기'} · AI 추천 사람 확정: ${c.cftRecommendation?.humanConfirmed?'완료':'대기'}</div></section>`;
  if(stage==='D2') return `<section class="stage-report-section"><h3>D2 · Verified Problem Statement</h3><p class="stage-report-statement">${reportEmpty(c.d2?.problemStatement,c.d2?.problemWhat)}</p><table><thead><tr><th>5W2H</th><th>Verified Fact</th></tr></thead><tbody>${[['What',c.d2?.problemWhat],['Where',c.d2?.problemWhere],['When',c.d2?.problemWhen],['Who',c.d2?.problemWho],['Which',c.d2?.problemWhich],['How',c.d2?.problemHow],['How Many',c.d2?.problemHowMany]].map(r=>`<tr><th>${r[0]}</th><td>${reportEmpty(r[1])}</td></tr>`).join('')}</tbody></table><h4>IS / IS NOT Boundary</h4><table><thead><tr><th>Factor</th><th>IS</th><th>IS NOT</th><th>Difference</th></tr></thead><tbody>${reportRows(c.d2?.isIsNot,4,r=>`<tr><td>${r.factor}</td><td>${r.is}</td><td>${r.isNot}</td><td>${reportEmpty(r.difference)}</td></tr>`)}</tbody></table></section>`;
  if(stage==='D3'){const erp=c.d3?.inventorySources?.erp||{};const mes=c.d3?.inventorySources?.mes?.processStocks||[];return `<section class="stage-report-section"><h3>D3 · Containment Scope & Inventory</h3><table><thead><tr><th>Source</th><th>LOT</th><th>Current</th><th>Hold</th><th>Evidence</th></tr></thead><tbody>${['RAK4','RAK5'].map(code=>`<tr><td>ERP ${code}</td><td>${reportEmpty(erp[code]?.lot)}</td><td>${Number(erp[code]?.currentQty||0).toLocaleString()}</td><td>${Number(erp[code]?.holdQty||0).toLocaleString()}</td><td>${reportEmpty(erp[code]?.evidence)}</td></tr>`).join('')}${reportRows(mes,5,r=>`<tr><td>${r.process}</td><td>${r.lot}</td><td>${Number(r.currentQty||0).toLocaleString()}</td><td>${Number(r.holdQty||0).toLocaleString()}</td><td>${r.evidence}</td></tr>`)}</tbody></table><h4>Interim Actions</h4><table><thead><tr><th>ID</th><th>Target</th><th>Action</th><th>Owner</th><th>Result</th></tr></thead><tbody>${reportRows(c.d3?.actions,5,r=>`<tr><td>${r.id}</td><td>${r.target}</td><td>${r.action}</td><td>${r.owner}</td><td>${r.result}</td></tr>`)}</tbody></table><div class="stage-report-callout">Effectiveness: ${reportEmpty(c.d3?.effectivenessStatement)}</div></section>`;}
  if(stage==='D4'){const roots=c.d4?.rootCauses||{};return `<section class="stage-report-section"><h3>D4 · Quality Tools & Root Cause Proof</h3><table><thead><tr><th>Selected Tool</th><th>Hypothesis / Objective</th><th>Finding</th><th>Evidence</th></tr></thead><tbody>${reportRows(c.d4?.selectedTools,4,r=>`<tr><td>${typeof getD4ToolById==='function'?(getD4ToolById(r.id)?.name||r.id):r.id}</td><td>${r.hypothesis}</td><td>${r.finding}</td><td>${r.evidence}</td></tr>`)}</tbody></table><div class="stage-report-cause-grid">${['Occurrence','Escape','System'].map(type=>`<div><b>${type} Root Cause</b><p>${reportEmpty(roots[type]?.statement)}</p><small>Evidence · ${reportEmpty(roots[type]?.evidence)}</small></div>`).join('')}</div></section>`;}
  if(stage==='D5') return `<section class="stage-report-section"><h3>D5 · Permanent Corrective Action Selection</h3><table><thead><tr><th>Candidate</th><th>Root Cause Elimination</th><th>Feasibility</th><th>Risk</th><th>Decision</th></tr></thead><tbody>${reportRows(c.d5?.candidates,5,r=>`<tr><td><b>${r.title}</b><br><small>${r.rationale||''}</small></td><td>${r.rootCauseElimination}</td><td>${r.feasibility}</td><td>${r.riskLevel}</td><td>${r.selected?'SELECTED':'NOT SELECTED'}</td></tr>`)}</tbody></table></section>`;
  if(stage==='D6') return `<section class="stage-report-section"><h3>D6 · Implementation & Validation</h3><div class="stage-report-callout">Before: ${reportEmpty(c.d6?.beforeAfter?.beforeMetric)} → After: ${reportEmpty(c.d6?.beforeAfter?.afterMetric)}</div><table><thead><tr><th>Validation Test</th><th>Condition</th><th>Sample</th><th>Fail</th><th>Result</th></tr></thead><tbody>${reportRows(c.d6?.validationTests,5,r=>`<tr><td>${r.testName}</td><td>${r.condition}</td><td>${r.sampleSize}</td><td>${r.failQty}</td><td>${r.result}</td></tr>`)}</tbody></table></section>`;
  if(stage==='D7') return `<section class="stage-report-section"><h3>D7 · System Prevention & Horizontal Deployment</h3><h4>System Documents</h4><table><thead><tr><th>Document</th><th>Revision</th><th>Change</th><th>Owner</th></tr></thead><tbody>${reportRows(c.d7?.systemUpdates,4,r=>`<tr><td>${r.docName}<br><small>${r.docNo}</small></td><td>${r.rev}</td><td>${r.changeContent}</td><td>${r.owner}</td></tr>`)}</tbody></table><h4>Horizontal Deployment</h4><table><thead><tr><th>Product</th><th>Same Risk</th><th>Action</th><th>Status</th></tr></thead><tbody>${reportRows(c.d7?.horizontalDeployment,4,r=>`<tr><td>${r.product}</td><td>${r.sameRisk}</td><td>${r.action}</td><td>${r.status}</td></tr>`)}</tbody></table></section>`;
  return `<section class="stage-report-section"><h3>D8 · Closure Checklist & Approval</h3><table><thead><tr><th>Category</th><th>Closure Requirement</th><th>Result</th></tr></thead><tbody>${reportRows(c.d8?.checklist,3,r=>`<tr><td>${r.cat}</td><td>${r.item}</td><td>${r.checked?'PASS':'OPEN'}</td></tr>`)}</tbody></table><h4>Approval Flow</h4><table><thead><tr><th>Step</th><th>Approver</th><th>Date</th><th>Status</th></tr></thead><tbody>${reportRows(c.d8?.approvalFlow,4,r=>`<tr><td>${r.step}</td><td>${r.approver}</td><td>${r.date}</td><td>${r.status}</td></tr>`)}</tbody></table><div class="stage-report-callout">Team Recognition · ${reportEmpty(c.d8?.teamAppreciation)}</div></section>`;
}
