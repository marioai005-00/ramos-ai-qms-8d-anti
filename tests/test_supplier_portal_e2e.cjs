const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');

const browserPath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'qms-supplier-test-'));
const origin = process.env.QMS_TEST_ORIGIN;
if (!origin) throw new Error('Set QMS_TEST_ORIGIN to the test server origin');

const proc = spawn(browserPath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--remote-debugging-port=0',
  `--user-data-dir=${profile}`,
  '--window-size=1600,2400',
  'about:blank'
], { windowsHide: true, stdio: 'ignore' });

let socket, seq = 0;
const pending = new Map();
const delay = ms => new Promise(r => setTimeout(r, ms));

async function send(method, params = {}, sessionId) {
  const id = ++seq;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error('CDP timeout: ' + method));
    }, 10000);
    pending.set(id, { resolve: v => { clearTimeout(timer); resolve(v); }, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}

(async () => {
  let port;
  for (let i = 0; i < 80; i++) {
    try {
      port = fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0];
      break;
    } catch {}
    await delay(150);
  }
  if (!port) throw new Error('Headless browser port not found');

  const info = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
  socket = new WebSocket(info.webSocketDebuggerUrl);
  await new Promise((r, j) => { socket.onopen = r; socket.onerror = j; });

  socket.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
    }
  };

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const call = (method, params) => send(method, params, sessionId);

  await call('Runtime.enable');
  await call('Page.enable');
  await call('Page.addScriptToEvaluateOnNewDocument', {
    source: 'window.alert=()=>{};window.confirm=()=>true;'
  });
  await call('Page.navigate', { url: origin });

  for (let i = 0; i < 80; i++) {
    const r = await call('Runtime.evaluate', { expression: `typeof initApp === 'function'`, returnByValue: true });
    if (r.result?.value) break;
    await delay(150);
  }

  // Quick Login
  await call('Runtime.evaluate', { expression: `handleQuickLogin('sjkim');` });
  await delay(400);

  // 1. Switch to supplier-portal
  console.log('--- Step 1: Navigating to Supplier Portal ---');
  await call('Runtime.evaluate', { expression: `switchNav('supplier-portal');` });
  await delay(500);

  const viewExists = (await call('Runtime.evaluate', { expression: `Boolean(document.querySelector('.supplier-portal-container'))`, returnByValue: true })).result.value;
  assert.ok(viewExists, 'Supplier portal container should exist');

  // Verify benchmark records in watchtower
  const tableRows = (await call('Runtime.evaluate', { expression: `document.querySelectorAll('.supplier-grid-table tbody tr').length`, returnByValue: true })).result.value;
  assert.ok(tableRows >= 3, 'Should render at least 3 benchmark records');
  console.log(`✓ PASS: Supplier watchtower rendered ${tableRows} records`);

  const outDir = path.resolve(__dirname, '..');

  // Capture Watchtower Screenshot
  const watchtowerShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'verify_supplier_watchtower.png'), Buffer.from(watchtowerShot.data, 'base64'));
  console.log('✓ SAVED verify_supplier_watchtower.png');

  // 2. Switch to Intake Tab (Track A: PCN)
  console.log('--- Step 2: Testing Supplier Intake Form (Track A: PCN) ---');
  await call('Runtime.evaluate', { expression: `switchSupplierTab('intake');` });
  await delay(400);

  const formExists = (await call('Runtime.evaluate', { expression: `Boolean(document.getElementById('supplierIntakeForm'))`, returnByValue: true })).result.value;
  assert.ok(formExists, 'Supplier intake form should be rendered');

  const isPCNActive = (await call('Runtime.evaluate', { expression: `Boolean(document.querySelector('.comparison-table'))`, returnByValue: true })).result.value;
  assert.ok(isPCNActive, 'Comparison table should be rendered for PCN track');

  // Capture PCN Track Screenshot
  const pcnShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'verify_supplier_intake_pcn.png'), Buffer.from(pcnShot.data, 'base64'));
  console.log('✓ SAVED verify_supplier_intake_pcn.png');

  // 3. Switch to Track B: Urgent Quality Incident (SCAR)
  console.log('--- Step 3: Switching to Track B: Urgent Quality Incident (SCAR) ---');
  await call('Runtime.evaluate', { expression: `setSupplierTicketType('Issue');` });
  await delay(400);

  const hasIncidentBanner = (await call('Runtime.evaluate', { expression: `Boolean(document.querySelector('.incident-alert-banner'))`, returnByValue: true })).result.value;
  assert.ok(hasIncidentBanner, 'Incident banner should be displayed in Issue track');

  const hasContainmentGrid = (await call('Runtime.evaluate', { expression: `Boolean(document.querySelector('.containment-3point-grid'))`, returnByValue: true })).result.value;
  assert.ok(hasContainmentGrid, '3-Point Containment grid should be displayed');

  // Test defect rate recalculation
  await call('Runtime.evaluate', { expression: `(() => {
    const inp = document.querySelector('input[name="inputQty"]');
    const def = document.querySelector('input[name="defectQty"]');
    if (inp && def) {
      inp.value = 10000;
      def.value = 500;
      recalculateDefectRate();
    }
  })()` });
  await delay(200);

  const calculatedRate = (await call('Runtime.evaluate', { expression: `document.getElementById('defectRateInput').value`, returnByValue: true })).result.value;
  assert.equal(calculatedRate, '5.00', 'Defect rate should be calculated as 5.00%');
  console.log(`✓ PASS: Defect rate calculated dynamically: ${calculatedRate}%`);

  // Capture Incident Track Screenshot
  const incidentShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'verify_supplier_intake_incident.png'), Buffer.from(incidentShot.data, 'base64'));
  fs.writeFileSync(path.join(outDir, 'verify_supplier_intake_form.png'), Buffer.from(incidentShot.data, 'base64'));
  console.log('✓ SAVED verify_supplier_intake_incident.png');

  // 4. Submit New Urgent Incident Ticket
  console.log('--- Step 4: Submitting New Urgent Incident Ticket ---');
  const initialCount = (await call('Runtime.evaluate', { expression: `loadSupplierRecords().length`, returnByValue: true })).result.value;
  
  await call('Runtime.evaluate', { expression: `(() => {
    createSupplierTicket({
      ticketType: 'Issue',
      supplierCategory: 'OSAT_PKG',
      companyName: '하나마이크론(주)',
      plant: '아산 1공장 PKG 3라인',
      submitter: '김영수 차장',
      email: 'ys.kim@hana.com',
      phone: '010-3344-9988',
      customer: 'LGE DTV',
      partName: '16GB eMMC v5.1',
      partNumber: 'RMS-EMMC-16G-LGE01',
      lotNo: 'HN260908-LIVE99',
      defectCategory: 'Machine_Drift',
      processStep: 'Molding_Underfill',
      inputQty: 10000,
      defectQty: 500,
      defectRate: '5.00',
      lineAction: 'Line_Stop',
      quarantineQty: 9500,
      quarantineLocation: '아산공장 Q-Hold Area A-12',
      inTransitAction: '운송 화물 1건 회수 완료',
      containmentAction: '디스펜서 공압 교정 및 직전 3개 로트 X-Ray 전수 검사',
      faReportDeadline: '2026-09-09 18:00',
      evidenceFiles: [
        { name: 'Xray_Void_Defect_Inspection.png', size: '3.1 MB', type: 'image' },
        { name: 'ASE_Dispenser_Pressure_Log.csv', size: '450 KB', type: 'csv' }
      ],
      title: '[긴급 E2E] 언더필 토출압 저하로 인한 보이드 급증',
      description: 'E2E 자동화 검증을 통한 긴급 공정 이상 발생 자진 신고 건입니다.'
    });
  })()` });
  await delay(300);

  const updatedCount = (await call('Runtime.evaluate', { expression: `loadSupplierRecords().length`, returnByValue: true })).result.value;
  assert.equal(updatedCount, initialCount + 1, 'Ticket count should increase by 1');
  console.log(`✓ PASS: Ticket submitted successfully (Total: ${updatedCount})`);

  // 5. Switch back to Watchtower and open Review Modal for Incident Ticket
  console.log('--- Step 5: Testing Incident Ticket Review Modal ---');
  await call('Runtime.evaluate', { expression: `switchSupplierTab('watchtower');` });
  await delay(400);

  await call('Runtime.evaluate', { expression: `openSupplierTicketModal('SQ-2026-002');` });
  await delay(400);

  const modalExists = (await call('Runtime.evaluate', { expression: `Boolean(document.querySelector('.modal-content'))`, returnByValue: true })).result.value;
  assert.ok(modalExists, 'Review modal should be opened');

  // Capture Review Modal Screenshot
  const modalShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'verify_supplier_review_modal.png'), Buffer.from(modalShot.data, 'base64'));
  console.log('✓ SAVED verify_supplier_review_modal.png');

  // Submit Approval
  await call('Runtime.evaluate', { expression: `(() => {
    document.getElementById('modalDecision').value = '8D_Escalated';
    document.getElementById('modalComment').value = 'E2E 검증: 3-Point 봉쇄 확인 및 사내 8D 즉시 승격 조치.';
    submitSupplierReviewDecision('SQ-2026-002');
  })()` });
  await delay(300);

  // 6. Test Universal Document Viewer (PDF, Excel, X-Ray Image)
  console.log('--- Step 6: Testing Universal Document & Report Viewer ---');
  
  // 6-A: PDF SpecSheet Viewer
  console.log('Testing PDF SpecSheet Viewer...');
  await call('Runtime.evaluate', { expression: `openDocumentViewer('Murata_X7R_MLCC_SpecSheet.pdf');` });
  await delay(400);

  const viewerVisible = (await call('Runtime.evaluate', { expression: `document.getElementById('documentViewerModal').style.display`, returnByValue: true })).result.value;
  assert.equal(viewerVisible, 'flex', 'Document viewer modal should be visible');

  const pdfTitle = (await call('Runtime.evaluate', { expression: `document.querySelector('.doc-viewer-title').innerText`, returnByValue: true })).result.value;
  assert.ok(pdfTitle.includes('Murata'), 'Document viewer should display Murata spec');

  const pdfShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'verify_pdf_viewer.png'), Buffer.from(pdfShot.data, 'base64'));
  console.log('✓ PASS: PDF Viewer opened successfully -> verify_pdf_viewer.png');

  // 6-B: Excel Reliability Report Viewer
  console.log('Testing Excel Reliability Report Viewer...');
  await call('Runtime.evaluate', { expression: `openDocumentViewer('TC_1000Cycles_Reliability_Report.xlsx');` });
  await delay(400);

  const hasExcelTable = (await call('Runtime.evaluate', { expression: `Boolean(document.querySelector('.excel-grid-table'))`, returnByValue: true })).result.value;
  assert.ok(hasExcelTable, 'Excel table should be rendered inside viewer');

  const excelShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'verify_excel_viewer.png'), Buffer.from(excelShot.data, 'base64'));
  console.log('✓ PASS: Excel Viewer opened successfully -> verify_excel_viewer.png');

  // 6-C: X-Ray Defect Image Viewer & 90 deg rotation
  console.log('Testing X-Ray Defect Image Viewer...');
  await call('Runtime.evaluate', { expression: `openDocumentViewer('Xray_Void_Defect_Inspection.png');` });
  await delay(400);

  const hasDefectCallout = (await call('Runtime.evaluate', { expression: `document.body.innerText.includes('DEFECT: SOLDER VOID')`, returnByValue: true })).result.value;
  assert.ok(hasDefectCallout, 'X-Ray defect callout should be rendered');

  // Test rotation
  await call('Runtime.evaluate', { expression: `rotateViewerImage();` });
  await delay(200);

  const xrayShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'verify_xray_viewer.png'), Buffer.from(xrayShot.data, 'base64'));
  console.log('✓ PASS: X-Ray Defect Viewer opened and rotated -> verify_xray_viewer.png');

  // Close Viewer
  await call('Runtime.evaluate', { expression: `closeDocumentViewer();` });
  await delay(200);

  const viewerClosed = (await call('Runtime.evaluate', { expression: `document.getElementById('documentViewerModal').style.display`, returnByValue: true })).result.value;
  assert.equal(viewerClosed, 'none', 'Document viewer modal should be closed');
  console.log('✓ PASS: Document Viewer closed cleanly');

  // 7. Test 8D Escalation Linkage
  console.log('--- Step 7: Testing 8D Escalation Linkage ---');
  await call('Runtime.evaluate', { expression: `handleEscalateTo8D('SQ-2026-002');` });
  await delay(400);

  const currentStage = (await call('Runtime.evaluate', { expression: `appData.activeStage`, returnByValue: true })).result.value;
  assert.equal(currentStage, 'D2', 'Should navigate to D2 stage upon escalation');
  console.log('✓ PASS: Successfully escalated to 8D Case and navigated to D2 workspace');

    // 8. Test Subcontractor Account Login & Dedicated External View (mwpark / 하나마이크론)
  console.log('--- Step 8: Testing Subcontractor Account View (mwpark - 하나마이크론) ---');
  
  // Switch to subcontractor account mwpark
  await call('Runtime.evaluate', { expression: `onUserSwitch('박민우');` });
  await delay(500);

  // Assert user is supplier
  const isSupplierUser = (await call('Runtime.evaluate', { expression: `Boolean(CURRENT_USER.isSupplier)`, returnByValue: true })).result.value;
  assert.ok(isSupplierUser, 'Logged in user should have isSupplier flag true');

  const supplierCompany = (await call('Runtime.evaluate', { expression: `CURRENT_USER.company`, returnByValue: true })).result.value;
  assert.equal(supplierCompany, '하나마이크론(주)', 'Subcontractor company should be 하나마이크론(주)');

  // Verify external portal header
  const brandTitle = (await call('Runtime.evaluate', { expression: `document.querySelector('.portal-brand-title').innerText`, returnByValue: true })).result.value;
  assert.ok(brandTitle.includes('하나마이크론'), 'Portal brand title should reflect 하나마이크론');

  // Verify data isolation: Only Hana Micron tickets are visible
  const supplierRows = (await call('Runtime.evaluate', { expression: `document.querySelectorAll('.supplier-grid-table tbody tr').length`, returnByValue: true })).result.value;
  assert.ok(supplierRows >= 1, 'Hana Micron tickets should be rendered');
  
  const hasASEKorea = (await call('Runtime.evaluate', { expression: `document.querySelector('.supplier-grid-table').innerText.includes('ASE Korea')`, returnByValue: true })).result.value;
  assert.equal(hasASEKorea, false, 'ASE Korea tickets must NOT be visible to Hana Micron subcontractor');
  console.log('✓ PASS: Strict Subcontractor Data Isolation verified (ASE Korea tickets hidden)');

  // Capture Subcontractor View Screenshot
  const suppViewShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'verify_supplier_account_view.png'), Buffer.from(suppViewShot.data, 'base64'));
  console.log('✓ PASS: Subcontractor account watchtower view verified -> verify_supplier_account_view.png');

  // Open Hana Micron ticket review modal in subcontractor mode
  await call('Runtime.evaluate', { expression: `openSupplierTicketModal('PCN-2026-001');` });
  await delay(400);

  const hasOfficialNotice = (await call('Runtime.evaluate', { expression: `document.body.innerText.includes('라모스테크놀러지 품질본부(SQE) 공식 심의 결과 통보')`, returnByValue: true })).result.value;
  assert.ok(hasOfficialNotice, 'Review modal should display official SQE decision notification for subcontractor');

  const hasInternalSaveBtn = (await call('Runtime.evaluate', { expression: `Boolean(document.getElementById('modalDecision'))`, returnByValue: true })).result.value;
  assert.equal(hasInternalSaveBtn, false, 'Subcontractor must NOT have internal decision edit controls');
  console.log('✓ PASS: Subcontractor Review Modal is clean read-only official notice');

  const suppModalShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'verify_supplier_account_modal.png'), Buffer.from(suppModalShot.data, 'base64'));
  console.log('✓ PASS: Subcontractor review modal verified -> verify_supplier_account_modal.png');

  await call('Runtime.evaluate', { expression: `closeModal();` });
  await delay(200);

  // Verify strict sidebar and header isolation for subcontractor
  const internalNavDisplay = (await call('Runtime.evaluate', { expression: `getComputedStyle(document.getElementById('internalCompanyNavSection')).display`, returnByValue: true })).result.value;
  assert.equal(internalNavDisplay, 'none', 'Internal 8D sections must be completely hidden from subcontractor sidebar');

  const dashboardNavDisplay = (await call('Runtime.evaluate', { expression: `getComputedStyle(document.getElementById('navItemDashboard')).display`, returnByValue: true })).result.value;
  assert.equal(dashboardNavDisplay, 'none', 'Internal Dashboard must be completely hidden from subcontractor sidebar');

  const sidebarTabsDisplay = (await call('Runtime.evaluate', { expression: `getComputedStyle(document.querySelector('.sidebar-tabs')).display`, returnByValue: true })).result.value;
  assert.equal(sidebarTabsDisplay, 'none', 'Sidebar tabs (8D / RAmos Org) must be completely hidden from subcontractor');

  const caseZoneDisplay = (await call('Runtime.evaluate', { expression: `getComputedStyle(document.querySelector('.header-case-zone')).display`, returnByValue: true })).result.value;
  assert.equal(caseZoneDisplay, 'none', 'Header internal case zone must be completely hidden from subcontractor');

  const supplierNavItemText = (await call('Runtime.evaluate', { expression: `document.getElementById('navSupplierPortalText').innerText`, returnByValue: true })).result.value;
  assert.ok(supplierNavItemText.includes('외주 협력사 품질 & 4M PCN 접수 포털'), 'Supplier portal nav label should be 외주 협력사 품질 & 4M PCN 접수 포털');
  console.log('✓ PASS: All internal 8D menus, dashboard, org tree, and case selector strictly hidden from subcontractor');

  // Switch back to internal SQE
  await call('Runtime.evaluate', { expression: `onUserSwitch('김성중');` });
  await delay(400);

  const internalNavRestored = (await call('Runtime.evaluate', { expression: `getComputedStyle(document.getElementById('internalCompanyNavSection')).display`, returnByValue: true })).result.value;
  assert.notEqual(internalNavRestored, 'none', 'Internal 8D sections must be restored when switching back to SQE master');
  console.log('✓ PASS: Successfully switched back to Internal SQE Master account & restored internal menus');

  try { socket.close(); } catch {}
  try { proc.kill(); } catch {}
  console.log('\n=================================================');
  console.log('🎉 ALL DYNAMIC 2-TRACK SUPPLIER & DOC VIEWER E2E TESTS PASSED 100%!');
  console.log('=================================================');
  setTimeout(() => process.exit(0), 100);
})().catch(err => {
  console.error(err);
  try { socket.close(); } catch {}
  try { proc.kill(); } catch {}
  process.exit(1);
});
