/* VIEW 3: 8D WORKSPACE (3-PANE LAYOUT PER STAGE)                            */
    /* ========================================================================= */
    function renderStageWorkspaceView(c, stage) {
      return `
        <!-- D-Stage Step Flow Navigation Bar -->
        <div class="stage-progress-bar">
          <div class="stage-step ${stage === 'overview' ? 'active' : ''}" onclick="switchStage('overview')">
            <div class="stage-step-title">Overview ${c.status === 'Closed' ? '●' : '◐'}</div>
            <div class="stage-step-sub">종합 현황</div>
          </div>
          <div class="stage-step ${stage === 'D1' ? 'active' : ''}" onclick="switchStage('D1')">
            <div class="stage-step-title">D1. Team ${isCFTAssignmentComplete(c) && c.cftRecommendation?.humanConfirmed ? '●' : '◐'}</div>
            <div class="stage-step-sub">CFT 팀구성</div>
          </div>
          <div class="stage-step ${stage === 'D2' ? 'active' : ''}" onclick="switchStage('D2')">
            <div class="stage-step-title">D2. Problem ●</div>
            <div class="stage-step-sub">5W2H & Fact</div>
          </div>
          <div class="stage-step ${stage === 'D3' ? 'active' : ''}" onclick="switchStage('D3')">
            <div class="stage-step-title">D3. Contain ●</div>
            <div class="stage-step-sub">긴급 봉쇄 조치</div>
          </div>
          <div class="stage-step ${stage === 'D4' ? 'active' : ''}" onclick="switchStage('D4')">
            <div class="stage-step-title">D4. RootCause ●</div>
            <div class="stage-step-sub">5-Why & FA</div>
          </div>
          <div class="stage-step ${stage === 'D5' ? 'active' : ''}" onclick="switchStage('D5')">
            <div class="stage-step-title">D5. PCA ●</div>
            <div class="stage-step-sub">영구대책 수립</div>
          </div>
          <div class="stage-step ${stage === 'D6' ? 'active' : ''}" onclick="switchStage('D6')">
            <div class="stage-step-title">D6. Valid ●</div>
            <div class="stage-step-sub">효과 검증</div>
          </div>
          <div class="stage-step ${stage === 'D7' ? 'active' : ''}" onclick="switchStage('D7')">
            <div class="stage-step-title">D7. Prevent ●</div>
            <div class="stage-step-sub">재발방지/수평</div>
          </div>
          <div class="stage-step ${stage === 'D8' ? 'active' : ''}" onclick="switchStage('D8')">
            <div class="stage-step-title">D8. Closure ●</div>
            <div class="stage-step-sub">종결 & 서명</div>
          </div>
        </div>

        <!-- 3-Pane Grid: Left/Center Workspace (Pane 1 & 3) vs Right AI Side-Panel (Pane 2) -->
        <div class="stage-workspace-grid">
          
          <!-- LEFT / CENTER WORKSPACE -->
          <div>
            ${renderStageContent(c, stage)}
          </div>

          <!-- RIGHT AI QUALITY ASSISTANT (SIDE PANEL) -->
          <div class="ai-sidepanel">
            <div class="ai-sidepanel-header">
              <div style="display:flex; align-items:center; gap:8px;">
                <i data-lucide="bot" style="color: #60a5fa; width: 20px; height: 20px;"></i>
                <div>
                  <div style="font-size:0.85rem; font-weight:800; color:#f8fafc;">AI Quality Assistant</div>
                  <div style="font-size:0.68rem; color:#94a3b8;">Real-time Stage Verification</div>
                </div>
              </div>
              <span class="badge-pill badge-purple" style="font-size:0.65rem;">ACTIVE PROMPT RULE</span>
            </div>

            <div class="ai-sidepanel-body">
              ${renderAISidePanelContent(c, stage)}
            </div>
          </div>

        </div>
      `;
    }

    function renderStageContent(c, stage) {
      switch (stage) {
        case 'overview':
          return `
            <div class="card">
              <div class="card-header">
                <div class="card-title">
                  <i data-lucide="layers" style="color:#60a5fa; width:16px; height:16px;"></i> Case Summary Header
                </div>
                <span class="badge-pill badge-fail">${c.severityLevel}</span>
              </div>
              <div class="grid-4" style="font-size:0.82rem; gap:16px; margin-bottom:14px;">
                <div><span style="color:var(--text-muted);">Case No:</span> <b class="num-mono" style="color:#60a5fa;">${c.id}</b></div>
                <div><span style="color:var(--text-muted);">Customer:</span> <b>${c.customer}</b></div>
                <div><span style="color:var(--text-muted);">Product:</span> <b>${c.product}</b></div>
                <div><span style="color:var(--text-muted);">Lot No:</span> <b class="num-mono">${c.lotNumber}</b></div>
              </div>
              <div class="grid-4" style="font-size:0.82rem; gap:16px;">
                <div><span style="color:var(--text-muted);">Defect Qty:</span> <b class="num-mono" style="color:#f87171;">${c.defectQty} / ${c.inspectQty.toLocaleString()}ea</b></div>
                <div><span style="color:var(--text-muted);">PPM:</span> <b class="num-mono" style="color:#fbbf24;">${c.ppm} PPM</b></div>
                <div><span style="color:var(--text-muted);">Current Stage:</span> <b style="color:#34d399;">${c.currentStage}</b></div>
                <div><span style="color:var(--text-muted);">Initial SLA Due:</span> <b class="num-mono" style="color:#fbbf24;">${c.dueDateInitial}</b></div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <div class="card-title"><i data-lucide="clock" style="color:#fbbf24; width:16px; height:16px;"></i> 현재 상태 요약 & 오픈 이슈</div>
              </div>
              <div class="grid-3">
                <div style="background:#0e1628; border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px;">
                  <div style="font-size:0.75rem; color:var(--text-muted);">Open Actions</div>
                  <div style="font-size:1.4rem; font-weight:800; color:#38bdf8; margin-top:4px;" class="num-mono">${c.d3.actions.length} 건</div>
                  <div style="font-size:0.7rem; color:#34d399;">전원 기한 내 완료 진행 중</div>
                </div>
                <div style="background:#0e1628; border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px;">
                  <div style="font-size:0.75rem; color:var(--text-muted);">연동된 Evidence</div>
                  <div style="font-size:1.4rem; font-weight:800; color:#a855f7; margin-top:4px;" class="num-mono">${c.evidenceList.length} Files</div>
                  <div style="font-size:0.7rem; color:#a855f7;">물리/전기 성적서 완결</div>
                </div>
                <div style="background:#0e1628; border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px;">
                  <div style="font-size:0.75rem; color:var(--text-muted);">발행 가능 공식 리포트</div>
                  <div style="font-size:1.1rem; font-weight:800; color:#34d399; margin-top:6px;">Initial 3D / Interim 5D / Final 8D</div>
                  <button class="btn btn-primary btn-sm" style="margin-top:6px;" onclick="switchNav('reports-hub')">리포트 뷰어 열기</button>
                </div>
              </div>
            </div>
          `;

        case 'D1':
          return `
            <div class="card">
              <div class="card-header">
                <div class="card-title"><i data-lucide="users" style="color:#60a5fa; width:16px; height:16px;"></i> D1. Cross-Functional Team (CFT 지정)</div>
                <button class="btn btn-primary btn-sm" onclick="openOrgTreeModalForCFT()">
                  <i data-lucide="network" style="width:14px;height:14px;"></i> 조직도에서 팀원 추가
                </button>
              </div>
              <p style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:14px;">
                문제 해결을 주도할 Champion, Leader, FA, 공정엔지니어, 품질 실무자를 전사 조직도에서 명확한 역할과 함께 배속합니다.
              </p>
              ${renderAICFTRecommendationPanel(c)}
              <table class="custom-table">
                <thead>
                  <tr>
                    <th style="width:24%;">Role</th>
                    <th style="width:20%;">담당자</th>
                    <th style="width:20%;">소속 부서</th>
                    <th style="width:22%;">연락처 / Email</th>
                    <th style="width:8%;">Status</th>
                    <th style="width:6%; text-align:center;">관리</th>
                  </tr>
                </thead>
                <tbody>
                  ${c.team.map((m, idx) => `
                    <tr>
                      <td style="font-weight:700; color:#60a5fa;">${m.role}</td>
                      <td style="font-weight:600; color:#f8fafc;">${m.name}</td>
                      <td>${m.dept}</td>
                      <td class="num-mono" style="color:var(--text-secondary);">${m.contact}</td>
                      <td><span class="badge-pill badge-ok">${m.status}</span></td>
                      <td style="text-align:center;">
                        ${!isProtectedCFTMember(m) ? `
                          <button class="btn btn-secondary btn-sm" style="padding:2px 6px; color:#f87171;" onclick="removeCFTMember(${idx})" title="팀원 제외">
                            <i data-lucide="trash-2" style="width:12px;height:12px;"></i>
                          </button>
                        ` : `<span class="cft-system-lock" title="접수·품질 승인 정보에서 연결된 필수 담당자"><i data-lucide="lock" style="width:11px;height:11px;"></i> 연결</span>`}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `;

        case 'D2':
          return `
            <!-- Fact 5W2H Table -->
            <div class="card">
              <div class="card-header">
                <div class="card-title"><i data-lucide="check-circle-2" style="color:#34d399; width:16px; height:16px;"></i> D2. Problem Definition (5W2H Fact 중심)</div>
                <span class="badge-pill badge-ok">FACT CONFIRMED</span>
              </div>
              <div class="grid-2" style="gap:12px;">
                <div class="form-group">
                  <label class="form-label">What (어떤 Failure인가)</label>
                  <input type="text" class="form-control" value="${c.d2.problemWhat}" readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">Where (어디서 발생했는가)</label>
                  <input type="text" class="form-control" value="${c.d2.problemWhere}" readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">When (언제 발생했는가)</label>
                  <input type="text" class="form-control" value="${c.d2.problemWhen}" readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">Who (누가 발견했는가)</label>
                  <input type="text" class="form-control" value="${c.d2.problemWho}" readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">Which (어떤 제품/Lot인가)</label>
                  <input type="text" class="form-control" value="${c.d2.problemWhich}" readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">How Many (몇 개 발생했는가)</label>
                  <input type="text" class="form-control num-mono" value="${c.d2.problemHowMany}" readonly>
                </div>
              </div>
            </div>

            <!-- IS / IS NOT Analysis Table -->
            <div class="card">
              <div class="card-header">
                <div class="card-title"><i data-lucide="split" style="color:#a855f7; width:16px; height:16px;"></i> IS / IS NOT 비교 분석표</div>
              </div>
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>구분 (Factor)</th>
                    <th style="color:#34d399;">IS (발생 현상)</th>
                    <th style="color:#f87171;">IS NOT (비발생 대상)</th>
                  </tr>
                </thead>
                <tbody>
                  ${c.d2.isIsNot.map(row => `
                    <tr>
                      <td style="font-weight:700; color:#e2e8f0;">${row.factor}</td>
                      <td style="color:#34d399; font-weight:600;">${row.is}</td>
                      <td style="color:#94a3b8;">${row.isNot}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- SEPARATED Initial Working Hypotheses -->
            <div class="card" style="border-left: 4px solid #fbbf24;">
              <div class="card-header">
                <div class="card-title"><i data-lucide="help-circle" style="color:#fbbf24; width:16px; height:16px;"></i> 초동 원인 가설 (Initial Working Hypotheses)</div>
                <span class="badge-pill badge-warn">가설 ≠ ROOT CAUSE (엄격 분리)</span>
              </div>
              <p style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:12px;">
                초동 단계의 추정은 가설로 등록되며, 물리적/전기적 Evidence 검증 전까지 절대 결론으로 승격되지 않습니다.
              </p>
              ${c.d2.hypotheses.map(h => `
                <div style="background:#0e1628; border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px; margin-bottom:10px;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:700; color:#f8fafc; font-size:0.85rem;">[${h.id}] ${h.title}</span>
                    <span class="badge-pill ${h.confidence === 'High' ? 'badge-ok' : h.confidence === 'Excluded' ? 'badge-fail' : 'badge-warn'}">${h.status} (신뢰도: ${h.confidence})</span>
                  </div>
                  <div style="margin-top:8px; font-size:0.75rem; color:var(--text-muted);">
                    필요 증거 (Required Evidence): 
                    ${h.requiredEvidence.map(req => `<span style="display:inline-block; background:#1e293b; color:#cbd5e1; padding:2px 6px; border-radius:4px; margin-right:4px;">□ ${req}</span>`).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          `;

        case 'D3':
          return `
            <!-- 7-Area Material Flow Containment -->
            <div class="card">
              <div class="card-header">
                <div class="card-title"><i data-lucide="shield-alert" style="color:#ef4444; width:16px; height:16px;"></i> D3. 영향 범위 관리 (7-Area Material Flow)</div>
                <span class="badge-pill badge-ok">출하 차단 완결</span>
              </div>
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>관리 영역 (Material Flow)</th>
                    <th>관리 Lot</th>
                    <th>총 수량</th>
                    <th>격리/Hold</th>
                    <th>선별 완료</th>
                    <th>NG 수량</th>
                    <th>Status</th>
                    <th>근거 증거</th>
                  </tr>
                </thead>
                <tbody>
                  ${c.d3.materialFlow.map(mf => `
                    <tr>
                      <td style="font-weight:700; color:#f8fafc;">${mf.area}</td>
                      <td class="num-mono">${mf.lot}</td>
                      <td class="num-mono">${mf.totalQty.toLocaleString()}</td>
                      <td class="num-mono" style="color:#fbbf24; font-weight:700;">${mf.holdQty.toLocaleString()}</td>
                      <td class="num-mono">${mf.screenQty.toLocaleString()}</td>
                      <td class="num-mono" style="color:${mf.ngQty > 0 ? '#f87171' : '#34d399'}; font-weight:700;">${mf.ngQty}</td>
                      <td><span class="badge-pill badge-ok">${mf.status}</span></td>
                      <td style="font-size:0.72rem; color:#60a5fa;">${mf.evidence}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Containment Actions -->
            <div class="card">
              <div class="card-header">
                <div class="card-title"><i data-lucide="check-square" style="color:#60a5fa; width:16px; height:16px;"></i> Containment Actions (개별 액션 단위)</div>
              </div>
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>Action ID</th>
                    <th>대상</th>
                    <th>조치 내용</th>
                    <th>담당자</th>
                    <th>Due / 완료</th>
                    <th>결과</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${c.d3.actions.map(act => `
                    <tr>
                      <td class="num-mono" style="font-weight:700; color:#38bdf8;">${act.id}</td>
                      <td>${act.target}</td>
                      <td style="font-weight:600;">${act.action}</td>
                      <td>${act.owner}</td>
                      <td class="num-mono" style="font-size:0.75rem;">${act.due} <br><span style="color:#34d399;">${act.completion}</span></td>
                      <td style="color:#34d399;">${act.result}</td>
                      <td><span class="badge-pill badge-ok">${act.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <!-- Safety Statement Policy -->
              <div style="background:#0d1527; border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px; margin-top:14px;">
                <div style="font-size:0.78rem; font-weight:700; color:#60a5fa;">AI 검증 완료된 표준 봉쇄 유효성 문구 (Evidence Verified)</div>
                <div style="font-size:0.82rem; color:#f8fafc; margin-top:4px;">
                  "${c.d3.effectivenessStatement}"
                </div>
              </div>
            </div>
          `;

        case 'D4':
          return `
            <!-- FA Analysis Matrix -->
            <div class="card">
              <div class="card-header">
                <div class="card-title"><i data-lucide="microscope" style="color:#a855f7; width:16px; height:16px;"></i> D4. FA 분석 액션 매트릭스 (Failure Analysis)</div>
                <span class="badge-pill badge-ok">5개 시험 완료</span>
              </div>
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>분석 항목</th>
                    <th>Sample</th>
                    <th>분석 기관</th>
                    <th>측정 결과 / 물리적 소견</th>
                    <th>Status</th>
                    <th>연결 증거</th>
                  </tr>
                </thead>
                <tbody>
                  ${c.d4.faMatrix.map(fa => `
                    <tr>
                      <td style="font-weight:700; color:#60a5fa;">${fa.test}</td>
                      <td class="num-mono">${fa.sample}</td>
                      <td>${fa.lab}</td>
                      <td style="font-weight:600; color:#f8fafc;">${fa.result}</td>
                      <td><span class="badge-pill badge-ok">${fa.status}</span></td>
                      <td><span class="badge-pill badge-purple" style="font-size:0.7rem;">${fa.evidenceId}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- 5-Why Interactive Trees (Occurrence & Escape) -->
            <div class="grid-2" style="gap:20px;">
              <div class="card" style="margin-bottom:0;">
                <div class="card-header">
                  <div class="card-title" style="color:#38bdf8;"><i data-lucide="git-branch" style="width:16px;height:16px;"></i> Occurrence Root Cause 5-Why</div>
                  <span class="badge-pill badge-ok">발생 원인 규명</span>
                </div>
                <div class="why-tree">
                  ${c.d4.occurrence5Why.map((w, idx) => `
                    <div class="why-node ${w.isRoot ? 'root-found' : ''}">
                      <div style="font-size:0.72rem; color:var(--text-muted); font-weight:700;">${idx === 0 ? 'START PROBLEM' : `WHY #${idx}`}</div>
                      <div style="font-size:0.83rem; font-weight:600; color:#f8fafc; margin-top:2px;">${w.why}</div>
                      <div style="font-size:0.72rem; color:#60a5fa; margin-top:4px;">📎 Evidence: ${w.evidence}</div>
                    </div>
                    ${idx < c.d4.occurrence5Why.length - 1 ? `<div class="why-arrow">↓ Why?</div>` : ''}
                  `).join('')}
                </div>
              </div>

              <div class="card" style="margin-bottom:0;">
                <div class="card-header">
                  <div class="card-title" style="color:#c084fc;"><i data-lucide="git-branch" style="width:16px;height:16px;"></i> Escape Root Cause 5-Why</div>
                  <span class="badge-pill badge-purple">유출 원인 규명</span>
                </div>
                <div class="why-tree">
                  ${c.d4.escape5Why.map((w, idx) => `
                    <div class="why-node escape ${w.isRoot ? 'root-found' : ''}">
                      <div style="font-size:0.72rem; color:var(--text-muted); font-weight:700;">${idx === 0 ? 'START PROBLEM' : `WHY #${idx}`}</div>
                      <div style="font-size:0.83rem; font-weight:600; color:#f8fafc; margin-top:2px;">${w.why}</div>
                      <div style="font-size:0.72rem; color:#c084fc; margin-top:4px;">📎 Evidence: ${w.evidence}</div>
                    </div>
                    ${idx < c.d4.escape5Why.length - 1 ? `<div class="why-arrow">↓ Why?</div>` : ''}
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Confirmed Root Cause Gate -->
            <div class="card" style="margin-top:20px; border-left:4px solid #10b981;">
              <div class="card-header">
                <div class="card-title"><i data-lucide="check-check" style="color:#10b981; width:16px; height:16px;"></i> 확정된 Root Cause (Confirmed Root Causes)</div>
                <span class="badge-pill badge-ok">증거 충족 기준 100% 통과</span>
              </div>
              ${c.d4.candidateCauses.map(rc => `
                <div style="background:#0e1628; border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px; margin-bottom:10px;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:700; color:#34d399; font-size:0.88rem;">[${rc.type} Root Cause] ${rc.title}</span>
                    <span class="badge-pill badge-ok">${rc.status}</span>
                  </div>
                  <div style="font-size:0.75rem; color:#94a3b8; margin-top:6px;">
                    <b>입증 증거:</b> ${rc.supportingEvidence.join(', ')} | <b>배제된 가설:</b> ${rc.contradictingEvidence}
                  </div>
                </div>
              `).join('')}
            </div>
          `;

        case 'D5':
          return `
            <div class="card">
              <div class="card-header">
                <div class="card-title"><i data-lucide="wrench" style="color:#60a5fa; width:16px; height:16px;"></i> D5. Permanent Corrective Action (대책 선정 매트릭스)</div>
              </div>
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>Action Candidate (개선 대책)</th>
                    <th>원인 제거율</th>
                    <th>적용성</th>
                    <th>비용 Impact</th>
                    <th>Risk</th>
                    <th>선정 여부</th>
                  </tr>
                </thead>
                <tbody>
                  ${c.d5.candidates.map(pca => `
                    <tr style="${pca.selected ? 'background: rgba(16, 185, 129, 0.06);' : ''}">
                      <td>
                        <div style="font-weight:700; color:${pca.selected ? '#34d399' : '#f8fafc'};">${pca.title}</div>
                        <div style="font-size:0.72rem; color:var(--text-muted);">${pca.rationale}</div>
                      </td>
                      <td>${pca.rootCauseElimination}</td>
                      <td>${pca.feasibility}</td>
                      <td>${pca.costImpact}</td>
                      <td>${pca.riskLevel}</td>
                      <td>
                        <span class="badge-pill ${pca.selected ? 'badge-ok' : 'badge-gray'}">
                          ${pca.selected ? '★ 선정 완료' : '기각'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- ECN / PCN Information -->
            <div class="card">
              <div class="card-header">
                <div class="card-title"><i data-lucide="file-signature" style="color:#38bdf8; width:16px; height:16px;"></i> ECN / PCN 및 고객 승인 요건</div>
              </div>
              <div class="grid-3">
                <div class="form-group">
                  <label class="form-label">ECN 번호</label>
                  <input type="text" class="form-control num-mono" value="${c.d5.pcnEcn.ecnNumber}" readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">고객 PCN 필요 여부</label>
                  <input type="text" class="form-control" value="${c.d5.pcnEcn.pcnRequired ? '필요 (Yes)' : '불필요'}" readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">고객사 승인 상태</label>
                  <input type="text" class="form-control" value="${c.d5.pcnEcn.customerApprovalStatus}" readonly style="color:#34d399; font-weight:600;">
                </div>
              </div>
            </div>
          `;

        case 'D6':
          return `
            <div class="card">
              <div class="card-header">
                <div class="card-title"><i data-lucide="check-check" style="color:#34d399; width:16px; height:16px;"></i> D6. Implementation & Validation (효과 실증 시험)</div>
                <span class="badge-pill badge-ok">신뢰성 검증 완결</span>
              </div>

              <!-- Implementation Info -->
              <div style="background:#0e1628; border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px; margin-bottom:16px;" class="grid-4">
                <div><span style="color:var(--text-muted); font-size:0.75rem;">BOM Revision:</span> <div style="font-weight:700; color:#38bdf8;">${c.d6.implementationDetails.bomRevision}</div></div>
                <div><span style="color:var(--text-muted); font-size:0.75rem;">적용 양산 Lot:</span> <div class="num-mono" style="font-weight:700;">${c.d6.implementationDetails.appliedLot}</div></div>
                <div><span style="color:var(--text-muted); font-size:0.75rem;">적용 일자:</span> <div class="num-mono">${c.d6.implementationDetails.startDate}</div></div>
                <div><span style="color:var(--text-muted); font-size:0.75rem;">생산 라인:</span> <div>${c.d6.implementationDetails.productionSite}</div></div>
              </div>

              <table class="custom-table">
                <thead>
                  <tr>
                    <th>시험 항목</th>
                    <th>시험 조건 / 규격</th>
                    <th>Sample Size</th>
                    <th>불량 수량</th>
                    <th>판정 (Result)</th>
                  </tr>
                </thead>
                <tbody>
                  ${c.d6.validationTests.map(vt => `
                    <tr>
                      <td style="font-weight:700; color:#f8fafc;">${vt.testName}</td>
                      <td>${vt.condition}</td>
                      <td class="num-mono">${vt.sampleSize} ea</td>
                      <td class="num-mono" style="color:#34d399; font-weight:700;">${vt.failQty} Fail</td>
                      <td><span class="badge-pill badge-ok">${vt.result}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <!-- Before vs After Statistical Comparison -->
              <div style="background: rgba(59, 130, 246, 0.08); border:1px solid #3b82f6; border-radius:var(--radius-sm); padding:14px; margin-top:16px;" class="grid-2">
                <div>
                  <div style="font-size:0.75rem; color:#f87171; font-weight:700;">BEFORE IMPROVEMENT (개선 전)</div>
                  <div style="font-size:1.1rem; font-weight:800; color:#f8fafc; margin-top:4px;" class="num-mono">${c.d6.beforeAfter.beforeMetric}</div>
                </div>
                <div>
                  <div style="font-size:0.75rem; color:#34d399; font-weight:700;">AFTER IMPROVEMENT (개선 후 실증)</div>
                  <div style="font-size:1.1rem; font-weight:800; color:#34d399; margin-top:4px;" class="num-mono">${c.d6.beforeAfter.afterMetric}</div>
                </div>
              </div>
            </div>
          `;

        case 'D7':
          return `
            <!-- System Changes (PFMEA, CP, SOP) -->
            <div class="card">
              <div class="card-header">
                <div class="card-title"><i data-lucide="file-check" style="color:#60a5fa; width:16px; height:16px;"></i> D7. 시스템 문서 개정 (System Changes)</div>
                <span class="badge-pill badge-ok">문서 개정 완결</span>
              </div>
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>대상 문서명</th>
                    <th>문서 번호</th>
                    <th>개정 Rev.</th>
                    <th>주요 변경 내용</th>
                    <th>담당자</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${c.d7.systemUpdates.map(doc => `
                    <tr>
                      <td style="font-weight:700; color:#38bdf8;">${doc.docName}</td>
                      <td class="num-mono">${doc.docNo}</td>
                      <td class="num-mono" style="font-weight:700;">${doc.rev}</td>
                      <td>${doc.changeContent}</td>
                      <td>${doc.owner}</td>
                      <td><span class="badge-pill badge-ok">${doc.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Horizontal Deployment Matrix -->
            <div class="card">
              <div class="card-header">
                <div class="card-title"><i data-lucide="repeat" style="color:#a855f7; width:16px; height:16px;"></i> 수평전개 매트릭스 (Horizontal Deployment)</div>
              </div>
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>전개 대상 제품군</th>
                    <th>동일 부품 사용</th>
                    <th>동일 Risk</th>
                    <th>확인 결과 및 Action</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${c.d7.horizontalDeployment.map(hd => `
                    <tr>
                      <td style="font-weight:700; color:#f8fafc;">${hd.product}</td>
                      <td>${hd.samePartUsed}</td>
                      <td style="color:${hd.sameRisk === 'None' ? '#94a3b8' : '#fbbf24'};">${hd.sameRisk}</td>
                      <td style="font-weight:600;">${hd.action}</td>
                      <td><span class="badge-pill badge-ok">${hd.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `;

        case 'D8':
          return `
            <!-- 4-Stage 12-Item Closure Checklist -->
            <div class="card">
              <div class="card-header">
                <div class="card-title"><i data-lucide="check-square" style="color:#10b981; width:16px; height:16px;"></i> D8. Closure Checklist (최종 종결 점검)</div>
                <span class="badge-pill badge-ok">100% 점검 완료</span>
              </div>
              <div class="grid-2" style="gap:10px;">
                ${c.d8.checklist.map(chk => `
                  <div style="background:#0e1628; border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px 12px; display:flex; align-items:center; gap:8px;">
                    <i data-lucide="check-circle" style="color:#34d399; width:16px; height:16px; flex-shrink:0;"></i>
                    <div style="font-size:0.8rem;">
                      <span style="color:var(--text-muted); font-size:0.7rem;">[${chk.cat}]</span>
                      <span style="color:#f8fafc; font-weight:500;">${chk.item}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Approval Workflow Gate -->
            <div class="card">
              <div class="card-header">
                <div class="card-title"><i data-lucide="signature" style="color:#38bdf8; width:16px; height:16px;"></i> 고객 제출 공식 승인 결재선 (Sign-off Flow)</div>
              </div>
              <div class="grid-5" style="display:grid; grid-template-columns:repeat(5, 1fr); gap:10px;">
                ${c.d8.approvalFlow.map(ap => `
                  <div style="background:#0e1628; border:1px solid #22c55e; border-radius:var(--radius-sm); padding:10px; text-align:center;">
                    <div style="font-size:0.7rem; color:#94a3b8; font-weight:600;">${ap.step}</div>
                    <div style="font-size:0.8rem; font-weight:700; color:#f8fafc; margin-top:4px;">${ap.approver}</div>
                    <div style="font-size:0.68rem; color:#34d399; margin-top:2px;">✔ ${ap.status}</div>
                    <div style="font-size:0.65rem; color:var(--text-muted);" class="num-mono">${ap.date}</div>
                  </div>
                `).join('')}
              </div>

              <div style="background: rgba(16, 185, 129, 0.08); border:1px solid #10b981; border-radius:var(--radius-sm); padding:12px; margin-top:14px;">
                <div style="font-size:0.78rem; font-weight:700; color:#34d399;">CFT 포상 및 감사의 글</div>
                <div style="font-size:0.82rem; color:#f8fafc; margin-top:4px;">
                  "${c.d8.teamAppreciation}"
                </div>
              </div>
            </div>
          `;
      }
    }

    /* ========================================================================= */
    /* AI QUALITY ASSISTANT SIDE-PANEL LOGIC (SECTION 31 & 32 & 45 RULES)       */
    /* ========================================================================= */
    function renderAISidePanelContent(c, stage) {
      let checks = [];

      if (stage === 'D1' || stage === 'overview') {
        checks.push({
          type: 'success',
          title: 'CFT 인력 완전성 검증 완료',
          desc: 'Champion, Leader, FA실, 제조기술, eMMC FW, 고객품질 전원 배정됨.'
        });
      }

      if (stage === 'D2' || stage === 'overview') {
        checks.push({
          type: 'success',
          title: 'Fact vs 가설 분리 검증',
          desc: 'D2는 5W2H Fact 중심으로 기술되었으며, 가설(HYP-01~03)은 별도 관리 영역으로 격리됨.'
        });
        checks.push({
          type: 'info',
          title: '전기적 저항 측정치 정합성',
          desc: 'VCC-VSS 간 0.8Ω 저항값과 과전류 차단(850mA) 현상이 완벽하게 일치함.'
        });
      }

      if (stage === 'D3' || stage === 'overview') {
        checks.push({
          type: 'success',
          title: '봉쇄 조치 완결성 (Completeness)',
          desc: '당사 FG 45,000ea, 고객사 라인 10,000ea, 협력사 100,000ea 100% 봉쇄 완료.'
        });
        checks.push({
          type: 'warning',
          title: 'AI 안전 규칙 적용 알림',
          desc: '증거 없는 "추가 유출 위험 0%" 대신 "확인된 Affected Lot 및 관리대상 재고에 대한 출하 차단·격리·선별 조치 완료" 표준 문구가 적용되었습니다.'
        });
      }

      if (stage === 'D4' || stage === 'overview') {
        checks.push({
          type: 'success',
          title: 'Root Cause 승격 조건 충족 (Confirmed)',
          desc: '① IV Curve 단락 + ② MLCC 탈거 후 복구 + ③ SEM 유전체 수직 Crack 성적서(EVD-08)가 완벽 연결되어 Confirmed로 승격됨.'
        });
        checks.push({
          type: 'info',
          title: 'Escape Cause FMEA 갭 발견',
          desc: '체크리스트 상 고온 HTOL 125℃와 부품 X5R(85℃) 간 Cross Check 누락이 입증되었습니다.'
        });
      }

      if (stage === 'D5' || stage === 'D6' || stage === 'overview') {
        checks.push({
          type: 'success',
          title: 'PCA 인과관계 & 유효성 검증',
          desc: 'X7R 125℃ 부품 교체 후 HTOL 125℃ 504시간 231ea 전수 0 Defect PASS 달성.'
        });
      }

      if (stage === 'D7' || stage === 'D8' || stage === 'overview') {
        checks.push({
          type: 'success',
          title: '수평전개 & 재발방지 완결',
          desc: '동일 부품 사용 중인 32GB 라인업 ECN 즉시 배포 및 DFMEA/PFMEA/CP 개정 완료.'
        });
      }

      return checks.map(chk => `
        <div class="ai-check-item ${chk.type}">
          <div style="font-weight:700; color:#f8fafc; display:flex; align-items:center; gap:6px;">
            <i data-lucide="${chk.type === 'critical' ? 'alert-circle' : chk.type === 'warning' ? 'alert-triangle' : 'check-circle'}" style="width:14px;height:14px;"></i>
            ${chk.title}
          </div>
          <div style="font-size:0.75rem; color:#cbd5e1; margin-top:4px; line-height:1.4;">
            ${chk.desc}
          </div>
        </div>
      `).join('');
    }
