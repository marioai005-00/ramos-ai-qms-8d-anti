/* D4 structured quality-tool evidence builder and report appendix */
const D4_EVIDENCE_SCHEMAS = {
  'timeline': { code:'TL', title:'발생 타임라인 분석서', columns:[['time','일시/LOT'],['event','확인 사실'],['change','변경점'],['evidence','원본 Evidence']] },
  'process-flow': { code:'PF', title:'Process Flow / SIPOC 분석서', columns:[['step','공정 단계'],['input','Input/조건'],['control','관리·검사'],['finding','발생/유출 판단']] },
  'change-point': { code:'CP', title:'Change Point 비교 분석서', columns:[['factor','4M1E/설계'],['normal','정상 조건'],['failed','불량 조건'],['evidence','차이 입증 Evidence']] },
  'fishbone': { code:'FB', title:'Fishbone 8M 원인 후보 분석서', columns:[['category','8M 분류'],['cause','원인 후보'],['fact','확인 사실/시험'],['decision','판정']] },
  'five-why': { code:'5W', title:'발생·유출·시스템 3-Track 5 Why', columns:[['track','Track'],['level','Why 단계'],['why','Why / Because'],['evidence','Evidence']] },
  'genealogy': { code:'LG', title:'LOT Genealogy 추적서', columns:[['stage','Trace 단계'],['lot','LOT/Batch'],['source','공급사·공정'],['evidence','연결 Evidence']] },
  'test-coverage': { code:'TC', title:'검사 Coverage Gap 분석서', columns:[['failure','Failure Mode'],['test','검사 항목/조건'],['coverage','검출 가능성'],['gap','Gap 및 Evidence']] },
  'physical-fa': { code:'FA', title:'Physical FA 분석 흐름도', columns:[['sequence','분석 순서'],['method','분석 방법'],['finding','관찰 결과'],['evidence','성적서/이미지']] }
};

function getD4EvidenceSchema(toolId) {
  const tool = typeof getD4ToolById === 'function' ? getD4ToolById(toolId) : null;
  return D4_EVIDENCE_SCHEMAS[toolId] || {code:'QA',title:`${tool?.name || toolId} 분석 Evidence`,columns:[['item','분석 항목'],['fact','관찰 사실'],['comparison','비교/검증 결과'],['evidence','원본 Evidence']]};
}

function seedD4EvidenceRows(toolId) {
  const seeds = {
    'timeline': [
      ['2026-08-20 / EM2608-DTV00','마지막 정상 LOT 출하','변경 전 X7R 자재 사용','ERP 출하이력, EVD-01'],
      ['2026-08-22 / AS260828-A','외주 Assembly 자재 투입','C102 MLCC X7R → X5R','Supplier 4M Change Notice'],
      ['2026-08-28 / EM2608-DTV01','Reflow 및 상온 Final Test 완료','고온 Stress 검사 없음','Assembly Traveler, FT Log'],
      ['2026-08-31 / 고객 SMT','12ea CID Read Timeout 발생','변경 LOT에서 최초 발생','고객 불량 통보서'],
      ['2026-09-02 / FA Lab','MLCC 탈거 후 Short 해소','C102 원인 경로 지지','EVD-07, EVD-08']
    ],
    'process-flow': [
      ['MLCC 공급','X5R, C102','CoC·외관검사','자재 Grade 변경 유입'],['외주 Assembly','Reflow 245℃','Profile 확인','열응력 Crack 발생 가능'],['외주 Final Test','상온 기능검사','FT Program Rev.1','잠재 Crack 미검출'],['RAK4/RAK5 입고','완제품 LOT','입고검사','동일 LOT 전량 이동'],['고객 SMT','재 Reflow','ICT','열응력 누적 후 Short 검출']
    ],
    'change-point': [
      ['Material','C102 MLCC X7R','C102 MLCC X5R','4M Change Notice #C102'],['Method','변경품 신뢰성 재평가','외관·상온 전기만 승인','BOM Review Log'],['Measurement','125℃ Stress 포함','상온 FT만 적용','FT Program Rev.1'],['Supplier','승인 전 사전 통보','납기 대응 선투입','Supplier Audit 회신']
    ],
    'fishbone': [
      ['Man','변경 승인자 온도 Grade 검토 누락','승인 Checklist 확인','Supported'],['Machine','Reflow Profile 상한 초과','Logger 재측정 정상','Rejected'],['Material','X5R 고온 마진 부족','X7R/X5R A-B 시험','Confirmed'],['Method','변경품 신뢰성 평가 누락','BOM 승인 절차 검토','Confirmed'],['Measurement','상온 FT만 수행','125℃ Stress 비교','Confirmed'],['Environment','고객 2차 Reflow 열응력','온도 이력 확인','Supported'],['Design','C102 정격 Derating 부족','회로/BOM Review','Supported'],['Supplier','사전 변경통보 미준수','4M 통보 이력 확인','Confirmed']
    ],
    'five-why': [
      ['발생','Why 1','VCC-VSS Short → C102 MLCC 내부 Crack','EVD-07, EVD-08'],['발생','Why 2','내부 Crack → Reflow 열응력과 X5R 내열 마진 부족','SEM, 온도 Profile'],['발생','Why 3','X5R 적용 → 공급사 자재 Grade 변경','4M Change Notice'],['유출','Why 1','출하검사 Pass → 잠재 Crack이 상온에서 미검출','FT Log'],['유출','Why 2','미검출 → 고온 Stress 항목 미포함','Coverage Review'],['시스템','Why 1','변경 승인 → 온도등급 대조 항목 부재','BOM Checklist'],['시스템','Why 2','항목 부재 → 외주 변경관리 기준에 신뢰성 Gate 누락','Supplier Audit']
    ],
    'genealogy': [
      ['자재','C102-X5R-B240822','MLCC Supplier','CoC / Packing List'],['Assembly','AS260828-A','외주 Assembly A3','Assembly Traveler'],['Final Test','TS260829-B','외주 Tester T-07','FT Lot Summary'],['당사 입고','EM2608-DTV01','RAK4 → 고객 전량 출하','ERP 입출고 이력'],['고객','LGE-DTV-0831','평택 SMT','고객 LOT Trace 회신']
    ],
    'test-coverage': [
      ['MLCC 잠재 Crack','상온 Continuity / 25℃','낮음','열응력 전에는 False Pass · FT Rev.1'],['MLCC Short','ICT VCC-VSS 저항','높음','고객 2차 Reflow 후 검출 · 고객 ICT Log'],['고온 열화','125℃ Stress + 저항','높음','기존 미적용 · Coverage Gap'],['간헐 CID Timeout','Boot 반복 100 cycle','중간','Guard Band 추가 필요 · 재현시험']
    ],
    'physical-fa': [
      ['01','외관·3D X-Ray','BGA Joint 특이점 없음','EVD-05'],['02','IV/저항 측정','VCC-VSS 0.8Ω Short','EVD-04'],['03','Decap / 부품 탈거','C102 탈거 후 저항 정상 복귀','EVD-06, EVD-07'],['04','SEM Cross Section','MLCC 유전체 수직 Crack','EVD-08'],['05','정상 X7R A-B 검증','동일 Stress 0/30 Fail','Validation Report']
    ]
  };
  return (seeds[toolId] || []).map(values => ({values}));
}

function createD4EvidenceArtifact(toolId,row,c,useExample=false) {
  const schema=getD4EvidenceSchema(toolId);
  const rows=useExample ? seedD4EvidenceRows(toolId) : Array.from({length:3},()=>({values:schema.columns.map(()=> '')}));
  return {version:1,documentNo:`${c?.id || 'CASE'}-D4-${schema.code}`,objective:row?.hypothesis||'',sourceEvidence:row?.evidence||'',conclusion:row?.finding||'',rows,humanConfirmed:Boolean(useExample),updatedBy:useExample?'김성중 Senior Pro':'',updatedAt:useExample?'2026-09-05 15:40':''};
}

function escapeD4Evidence(value) {
  return String(value ?? '').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

let activeD4EvidenceIndex = -1;
function openD4EvidenceBuilder(index) {
  const c=getActiveCase(); if(!c)return;
  const d4=captureD4Form(c); const row=d4.selectedTools[index]; if(!row)return;
  row.artifact=row.artifact||createD4EvidenceArtifact(row.id,row,c,false);
  activeD4EvidenceIndex=index;
  const schema=getD4EvidenceSchema(row.id); const artifact=row.artifact;
  const modal=document.getElementById('globalModal'); const container=document.getElementById('modalContainer');
  container.style.width='1180px'; container.style.maxWidth='97vw';
  container.innerHTML=`<div class="d4-evidence-builder"><header><div><span>STRUCTURED D4 EVIDENCE</span><h2>${escapeD4Evidence(schema.title)}</h2><p>요약문이 아니라 원본 사실을 구조화하여 고객 보고서의 독립 Evidence 페이지를 만듭니다.</p></div><button class="btn btn-secondary btn-sm" onclick="closeD4EvidenceBuilder()">닫기</button></header>
    <div class="d4-evidence-meta"><label>문서번호<input class="form-control" id="d4EvDocNo" value="${escapeD4Evidence(artifact.documentNo)}"></label><label>분석 목적·가설<textarea class="form-control" id="d4EvObjective">${escapeD4Evidence(artifact.objective)}</textarea></label><label>원본 자료 / Evidence ID<textarea class="form-control" id="d4EvSources">${escapeD4Evidence(artifact.sourceEvidence)}</textarea></label></div>
    <div class="d4-evidence-grid-wrap"><table><thead><tr>${schema.columns.map(col=>`<th>${col[1]}</th>`).join('')}<th>관리</th></tr></thead><tbody id="d4EvidenceRows">${artifact.rows.map(item=>renderD4EvidenceBuilderRow(schema,item)).join('')}</tbody></table></div>
    <button type="button" class="btn btn-secondary btn-sm d4-add-evidence-row" onclick="addD4EvidenceBuilderRow()"><i data-lucide="plus"></i> 분석 행 추가</button>
    <label class="d4-evidence-conclusion">분석 결론<textarea class="form-control" id="d4EvConclusion">${escapeD4Evidence(artifact.conclusion)}</textarea></label>
    <footer><label class="quality-human-check"><input type="checkbox" id="d4EvConfirmed" ${artifact.humanConfirmed?'checked':''}><span><strong>분석 Evidence 확인</strong> · 원본자료와 각 분석 행을 대조했으며 이 문서를 D4 근본원인 입증자료로 사용합니다.</span></label><div><button class="btn btn-secondary" onclick="closeD4EvidenceBuilder()">취소</button><button class="btn btn-primary" onclick="saveD4EvidenceArtifact()"><i data-lucide="file-check-2"></i> Evidence 문서 저장</button></div></footer></div>`;
  modal.style.display='flex'; if(window.lucide)lucide.createIcons();
}

function renderD4EvidenceBuilderRow(schema,item={values:[]}) {
  return `<tr>${schema.columns.map((col,i)=>`<td><textarea class="form-control" data-d4-evidence-cell="${i}" placeholder="${escapeD4Evidence(col[1])}">${escapeD4Evidence(item.values?.[i]||'')}</textarea></td>`).join('')}<td><button type="button" class="icon-danger-btn" onclick="this.closest('tr').remove()" title="행 삭제"><i data-lucide="trash-2"></i></button></td></tr>`;
}
function addD4EvidenceBuilderRow(){const c=getActiveCase();const row=c?.d4?.selectedTools?.[activeD4EvidenceIndex];if(!row)return;const schema=getD4EvidenceSchema(row.id);document.getElementById('d4EvidenceRows').insertAdjacentHTML('beforeend',renderD4EvidenceBuilderRow(schema));if(window.lucide)lucide.createIcons();}
function closeD4EvidenceBuilder(){document.getElementById('globalModal').style.display='none';activeD4EvidenceIndex=-1;}
function saveD4EvidenceArtifact(){
  const c=getActiveCase(); const row=c?.d4?.selectedTools?.[activeD4EvidenceIndex]; if(!row)return;
  const schema=getD4EvidenceSchema(row.id); const rows=[...document.querySelectorAll('#d4EvidenceRows tr')].map(tr=>({values:schema.columns.map((_,i)=>tr.querySelector(`[data-d4-evidence-cell="${i}"]`)?.value.trim()||'')})).filter(item=>item.values.some(Boolean));
  const objective=document.getElementById('d4EvObjective').value.trim(); const sources=document.getElementById('d4EvSources').value.trim(); const conclusion=document.getElementById('d4EvConclusion').value.trim(); const confirmed=document.getElementById('d4EvConfirmed').checked;
  if(!objective||!sources||!conclusion||!rows.length){alert('분석 목적, 원본 Evidence, 분석 행, 분석 결론을 모두 작성해 주세요.');return;}
  if(confirmed&&rows.some(item=>item.values.some(value=>!value))){alert('사람 확인 전에 각 분석 행의 모든 칸을 작성해 주세요.');return;}
  row.hypothesis=objective;row.evidence=sources;row.finding=conclusion;row.artifact={version:1,documentNo:document.getElementById('d4EvDocNo').value.trim()||`${c.id}-D4-${schema.code}`,objective,sourceEvidence:sources,conclusion,rows,humanConfirmed:confirmed,updatedBy:CURRENT_USER.name,updatedAt:new Date().toISOString().replace('T',' ').slice(0,16)};
  c.d4.approval={status:'Draft',humanConfirmed:false};saveAppData();closeD4EvidenceBuilder();renderCurrentView();alert(`${schema.title}가 D4 Evidence 문서로 저장되었습니다.`);
}

function renderD4EvidenceAppendix(c) {
  const tools=c.d4?.selectedTools||[];
  return tools.map((row,index)=>renderD4EvidenceSheet(c,row,index)).join('');
}
function renderD4EvidenceSheet(c,row,index) {
  const schema=getD4EvidenceSchema(row.id); const artifact=row.artifact||createD4EvidenceArtifact(row.id,row,c,false); const rows=artifact.rows||[];
  return `<article class="stage-report-paper d4-evidence-paper"><div class="stage-report-watermark">${c.isExampleCase?'SAMPLE · TRAINING DATA':'DRAFT · HUMAN APPROVAL REQUIRED'}</div><div class="d4-evidence-doc-head"><div><b>RAMOS</b><small>D4 ROOT CAUSE EVIDENCE</small></div><div><span>EVIDENCE ${String(index+1).padStart(2,'0')}</span><h2>${escapeD4Evidence(schema.title)}</h2></div><dl><dt>문서번호</dt><dd>${escapeD4Evidence(artifact.documentNo)}</dd><dt>확인상태</dt><dd class="${artifact.humanConfirmed?'ok':'wait'}">${artifact.humanConfirmed?'HUMAN VERIFIED':'DRAFT'}</dd></dl></div><div class="d4-evidence-purpose"><b>분석 목적 / 가설</b><p>${escapeD4Evidence(artifact.objective)||'작성 대기'}</p><small>Source · ${escapeD4Evidence(artifact.sourceEvidence)||'연결 Evidence 대기'}</small></div>${renderD4EvidenceVisual(row.id,schema,rows)}<div class="d4-evidence-result"><b>분석 결론</b><p>${escapeD4Evidence(artifact.conclusion)||'분석 결론 작성 대기'}</p></div><footer class="stage-report-foot"><span>작성/확인 · ${escapeD4Evidence(artifact.updatedBy)||'미확인'} ${escapeD4Evidence(artifact.updatedAt)}</span><span>${c.id} · D4-E${String(index+1).padStart(2,'0')}</span></footer></article>`;
}
function renderD4EvidenceVisual(toolId,schema,rows){
  const cells=item=>schema.columns.map((_,i)=>escapeD4Evidence(item.values?.[i])||'—');
  if(toolId==='timeline')return `<div class="d4-report-timeline">${rows.map(item=>{const v=cells(item);return `<div><time>${v[0]}</time><section><b>${v[1]}</b><p>${v[2]}</p><small>${v[3]}</small></section></div>`}).join('')}</div>`;
  if(['process-flow','genealogy','physical-fa'].includes(toolId))return `<div class="d4-report-flow">${rows.map(item=>{const v=cells(item);return `<div><span>${v[0]}</span><b>${v[1]}</b><p>${v[2]}</p><small>${v[3]}</small></div>`}).join('')}</div>`;
  if(toolId==='fishbone')return `<div class="d4-report-fishbone"><div class="fish-spine"><span>FAILURE MODE</span></div>${rows.map(item=>{const v=cells(item);return `<section><b>${v[0]}</b><p>${v[1]}</p><small>${v[2]} · ${v[3]}</small></section>`}).join('')}</div>`;
  if(toolId==='five-why'){const tracks=[...new Set(rows.map(item=>item.values?.[0]||'Track'))];return `<div class="d4-report-why">${tracks.map(track=>`<section><h4>${escapeD4Evidence(track)}</h4>${rows.filter(item=>(item.values?.[0]||'Track')===track).map(item=>{const v=cells(item);return `<div><b>${v[1]}</b><p>${v[2]}</p><small>${v[3]}</small></div>`}).join('')}</section>`).join('')}</div>`;}
  return `<table class="d4-evidence-report-table"><thead><tr>${schema.columns.map(col=>`<th>${escapeD4Evidence(col[1])}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(item=>`<tr>${cells(item).map(value=>`<td>${value}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${schema.columns.length}">구조화된 분석 행 작성 대기</td></tr>`}</tbody></table>`;
}
