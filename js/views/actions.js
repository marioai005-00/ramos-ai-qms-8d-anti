/* VIEW 5: INTEGRATED ACTIONS HUB                                            */
    /* ========================================================================= */
    function renderActionsHubView(c) {
      return `
        <div style="margin-bottom: 20px;">
          <h1 style="font-size: 1.3rem; font-weight: 800; color: #f8fafc; display:flex; align-items:center; gap:8px;">
            <i data-lucide="list-todo" style="color: #fbbf24;"></i> 통합 Action 관리 트래커 (Multi-Action System)
          </h1>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">
            D3 봉쇄, D4 FA분석, D5 PCA, D7 수평전개 등 8D 전 과정의 모든 조치 항목을 하나의 통제 체계로 관리합니다.
          </p>
        </div>

        <div class="card">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Action ID</th>
                <th>Stage</th>
                <th>조치 대상 및 내용</th>
                <th>담당자</th>
                <th>Due Date</th>
                <th>완료 일시</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${c.d3.actions.map(act => `
                <tr>
                  <td class="num-mono" style="font-weight:700; color:#38bdf8;">${act.id}</td>
                  <td><span class="badge-pill badge-warn">D3 Contain</span></td>
                  <td style="font-weight:600;">[${act.target}] ${act.action}</td>
                  <td>${act.owner}</td>
                  <td class="num-mono" style="font-size:0.75rem;">${act.due}</td>
                  <td class="num-mono" style="font-size:0.75rem; color:#34d399;">${act.completion}</td>
                  <td><span class="badge-pill badge-ok">${act.status}</span></td>
                </tr>
              `).join('')}
              <tr>
                <td class="num-mono" style="font-weight:700; color:#38bdf8;">ACT-FA-01</td>
                <td><span class="badge-pill badge-purple">D4 RootCause</span></td>
                <td style="font-weight:600;">[QRT 공인원] SEM 단면 Cross-Section Crack 정밀 분석</td>
                <td>박재환 책임</td>
                <td class="num-mono" style="font-size:0.75rem;">09.03 18:00</td>
                <td class="num-mono" style="font-size:0.75rem; color:#34d399;">09.03 16:30</td>
                <td><span class="badge-pill badge-ok">Closed</span></td>
              </tr>
              <tr>
                <td class="num-mono" style="font-weight:700; color:#38bdf8;">ACT-PCA-01</td>
                <td><span class="badge-pill badge-ok">D5 Corrective</span></td>
                <td style="font-weight:600;">[BOM 변경] MLCC X5R → X7R 고온 사양 교체 및 ECN 발행</td>
                <td>정동진 수석</td>
                <td class="num-mono" style="font-size:0.75rem;">09.05 18:00</td>
                <td class="num-mono" style="font-size:0.75rem; color:#34d399;">09.05 17:00</td>
                <td><span class="badge-pill badge-ok">Closed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }