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

  const viewExists = (await call('Runtime.evaluate', { expression: `Boolean(document.querySelector('.supplier-portal-wrap'))`, returnByValue: true })).result.value;
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

  // 2. Switch to Intake Tab
  console.log('--- Step 2: Testing Supplier Intake Form ---');
  await call('Runtime.evaluate', { expression: `switchSupplierTab('intake');` });
  await delay(400);

  const formExists = (await call('Runtime.evaluate', { expression: `Boolean(document.getElementById('supplierIntakeForm'))`, returnByValue: true })).result.value;
  assert.ok(formExists, 'Supplier intake form should be rendered');

  // Capture Intake Form Screenshot
  const intakeShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'verify_supplier_intake_form.png'), Buffer.from(intakeShot.data, 'base64'));
  console.log('✓ SAVED verify_supplier_intake_form.png');

  // 3. Submit New Ticket
  console.log('--- Step 3: Submitting New 4M PCN Ticket ---');
  const initialCount = (await call('Runtime.evaluate', { expression: `loadSupplierRecords().length`, returnByValue: true })).result.value;
  
  await call('Runtime.evaluate', { expression: `(() => {
    createSupplierTicket({
      ticketType: 'PCN',
      supplierCategory: 'OSAT_PKG',
      companyName: '하나마이크론(주)',
      plant: '아산 1공장 PKG 3라인',
      submitter: '테스트 제출자 과장',
      email: 'test@hana.com',
      phone: '010-9999-8888',
      customer: 'LGE DTV',
      partName: '16GB eMMC v5.1',
      partNumber: 'RMS-EMMC-16G-LGE01',
      lotNo: 'HN260908-LIVE01',
      change4M: ['Material', 'Machine'],
      reasonType: 'Cost_Reduction_And_Reliability',
      title: '[E2E TEST] C102 X7R 부품 대체 승인 신청',
      description: 'E2E 자동화 테스트를 통해 검증된 신규 4M PCN 신청 레코드입니다.',
      comparisonTable: [
        { item: 'MLCC 정격', current: 'X5R 85도', proposed: 'X7R 125도', riskAssessment: 'PASS' }
      ]
    });
  })()` });
  await delay(300);

  const updatedCount = (await call('Runtime.evaluate', { expression: `loadSupplierRecords().length`, returnByValue: true })).result.value;
  assert.equal(updatedCount, initialCount + 1, 'Ticket count should increase by 1');
  console.log(`✓ PASS: Ticket submitted successfully (Total: ${updatedCount})`);

  // 4. Switch back to Watchtower and open Review Modal
  console.log('--- Step 4: Testing Detailed Ticket Review Modal ---');
  await call('Runtime.evaluate', { expression: `switchSupplierTab('watchtower');` });
  await delay(400);

  await call('Runtime.evaluate', { expression: `openSupplierTicketModal('PCN-2026-001');` });
  await delay(400);

  const modalVisible = (await call('Runtime.evaluate', { expression: `document.getElementById('globalModal').style.display === 'flex'`, returnByValue: true })).result.value;
  assert.ok(modalVisible, 'Review modal should be opened');

  // Capture Review Modal Screenshot
  const modalShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'verify_supplier_review_modal.png'), Buffer.from(modalShot.data, 'base64'));
  console.log('✓ SAVED verify_supplier_review_modal.png');

  // Submit Approval
  await call('Runtime.evaluate', { expression: `(() => {
    document.getElementById('modalDecision').value = 'Approved';
    document.getElementById('modalReviewComment').value = 'E2E 테스트 통과: 고온 신뢰성 데이터 완벽 확인하여 최종 승인함.';
    submitSupplierReviewDecision('PCN-2026-001');
  })()` });
  await delay(300);

  const updatedTicketStatus = (await call('Runtime.evaluate', { expression: `loadSupplierRecords().find(r => r.ticketId === 'PCN-2026-001').status`, returnByValue: true })).result.value;
  assert.equal(updatedTicketStatus, 'Approved', 'Ticket status should be Approved');
  console.log('✓ PASS: Decision successfully saved as Approved');

  // 5. Test 8D Escalation
  console.log('--- Step 5: Testing 8D Escalation Linkage ---');
  await call('Runtime.evaluate', { expression: `handleEscalateTo8D('SQ-2026-002');` });
  await delay(400);

  const currentStage = (await call('Runtime.evaluate', { expression: `appData.activeStage`, returnByValue: true })).result.value;
  assert.equal(currentStage, 'D2', 'Should navigate to D2 stage upon escalation');
  console.log('✓ PASS: Successfully escalated to 8D Case and navigated to D2 workspace');

  try { socket.close(); } catch {}
  try { proc.kill(); } catch {}
  console.log('\n=================================================');
  console.log('🎉 ALL SUPPLIER PORTAL E2E TESTS PASSED 100%!');
  console.log('=================================================');
  setTimeout(() => process.exit(0), 100);
})().catch(err => {
  console.error(err);
  try { socket.close(); } catch {}
  try { proc.kill(); } catch {}
  process.exit(1);
});
