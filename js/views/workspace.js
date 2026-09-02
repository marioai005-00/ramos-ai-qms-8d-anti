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
            <div class="stage-step-title">D2. Problem ${isD2StageComplete(c) ? '●' : '◐'}</div>
            <div class="stage-step-sub">5W2H & Fact</div>
          </div>
          <div class="stage-step ${stage === 'D3' ? 'active' : ''}" onclick="switchStage('D3')">
            <div class="stage-step-title">D3. Contain ${isD3StageComplete(c) ? '●' : '◐'}</div>
            <div class="stage-step-sub">긴급 봉쇄 조치</div>
          </div>
          <div class="stage-step ${stage === 'D4' ? 'active' : ''}" onclick="switchStage('D4')">
            <div class="stage-step-title">D4. RootCause ${isD4StageComplete(c) ? '●' : '◐'}</div>
            <div class="stage-step-sub">Toolbox & Proof</div>
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
              ${renderD1RACIMatrix(c)}
            </div>
          `;

        case 'D2':
          return renderD2QualityWorkspace(c);

        case 'D3':
          return renderD3QualityWorkspace(c);

        case 'D4':
          return renderD4QualityWorkspace(c);

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
    function escapeWorkspaceValue(value = '') {
      return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function isD1StageComplete(c) {
      return isCFTAssignmentComplete(c) && c.cftRecommendation?.humanConfirmed === true && c.cftRaci?.acknowledged === true;
    }

    function isD2StageComplete(c) {
      return c.d2?.approval?.status === 'Approved' && c.d2?.approval?.humanConfirmed === true;
    }

    function isD3StageComplete(c) {
      return c.d3?.approval?.status === 'Approved' && c.d3?.approval?.humanConfirmed === true;
    }

    function canEnterQualityStage(c, stage) {
      if (!c?.sourceIntakeId) return { allowed: true };
      if (stage === 'D2' && !isD1StageComplete(c)) return { allowed: false, message: 'D1 CFT 역할과 RACI를 사람이 확정해야 D2를 시작할 수 있습니다.' };
      if (stage === 'D3' && !isD2StageComplete(c)) return { allowed: false, message: 'D2 5W2H·IS/IS NOT 문제 정의를 승인해야 D3를 시작할 수 있습니다.' };
      if (['D4','D5','D6','D7','D8'].includes(stage) && !isD3StageComplete(c)) return { allowed: false, message: 'D3 봉쇄 범위와 효과성을 승인해야 원인분석 단계로 이동할 수 있습니다.' };
      if (['D5','D6','D7','D8'].includes(stage) && !isD4StageComplete(c)) return { allowed: false, message: 'D4 발생·유출·시스템 근본원인을 Evidence로 승인해야 영구대책 단계로 이동할 수 있습니다.' };
      return { allowed: true };
    }

    function renderD1RACIMatrix(c) {
      const memberName = key => getCurrentCFTMemberForRule(c, key)?.name || '미지정';
      const confirmed = c.cftRaci?.acknowledged === true;
      const rows = [
        ['고객 대응·최종 송부 승인', 'Champion', 'Quality Facilitator', 'Leader / 고객 대응', 'FA·공정·물류'],
        ['불량 분석 및 원인 입증', 'Leader', 'FA Lead', '공정 / 품질', 'Champion·물류'],
        ['재고·출하·고객 봉쇄', 'Leader', 'Material Containment', '품질 / 고객 대응', 'Champion·FA'],
        ['8D 단계·Evidence 완결성', 'Champion', 'Quality Facilitator', '전 CFT', '고객 대응']
      ];
      return `
        <section class="quality-tool-panel raci-panel">
          <div class="quality-tool-head">
            <div><span class="quality-tool-kicker">D1 QUALITY TOOL · RACI</span><h3>역할과 의사결정 책임</h3><p>R=실행, A=최종책임, C=협의, I=공유 대상입니다.</p></div>
            <span class="quality-gate-state ${confirmed ? 'is-complete' : ''}">${confirmed ? 'RACI 확인 완료' : 'RACI 확인 필요'}</span>
          </div>
          <div class="raci-owner-strip">
            <span>Champion <b>${memberName('champion')}</b></span><span>Leader <b>${memberName('leader')}</b></span><span>FA <b>${memberName('fa')}</b></span><span>물류 <b>${memberName('containment')}</b></span>
          </div>
          <div class="quality-table-wrap"><table class="custom-table compact-quality-table"><thead><tr><th>주요 업무</th><th>A</th><th>R</th><th>C</th><th>I</th></tr></thead><tbody>
            ${rows.map(row => `<tr>${row.map((cell, idx) => `<td class="${idx === 0 ? 'quality-task-cell' : ''}">${cell}</td>`).join('')}</tr>`).join('')}
          </tbody></table></div>
          <label class="quality-human-check"><input type="checkbox" id="cftRaciAcknowledged" ${confirmed ? 'checked' : ''}><span><strong>RACI 책임 확인</strong> · 각 담당자가 역할과 의사결정 책임을 이해했음을 확인합니다.</span></label>
          <div class="quality-stage-actions raci-confirm-action"><button type="button" class="btn btn-primary" onclick="confirmCFTAssignments()"><i data-lucide="user-check" style="width:14px;height:14px;"></i> RACI 확인 후 CFT 확정</button></div>
        </section>
      `;
    }

    function ensureD2Structure(c) {
      c.d2 = c.d2 || {};
      c.d2.isIsNot = Array.isArray(c.d2.isIsNot) ? c.d2.isIsNot : [];
      c.d2.hypotheses = Array.isArray(c.d2.hypotheses) ? c.d2.hypotheses : [];
      return c.d2;
    }

    function renderD2QualityWorkspace(c) {
      const d2 = ensureD2Structure(c);
      const approved = isD2StageComplete(c);
      return `
        <form id="d2QualityForm" onsubmit="event.preventDefault()">
          <div class="card quality-stage-card">
            <div class="card-header"><div class="card-title"><i data-lucide="scan-search" style="color:#34d399;width:16px;height:16px;"></i> D2. 사실 기반 문제 정의</div><span class="quality-gate-state ${approved ? 'is-complete' : ''}">${approved ? '사람 승인 완료' : '작성·승인 필요'}</span></div>
            <div class="quality-boundary-note"><strong>D2에서는 원인을 결론 내리지 않습니다.</strong><span>무엇이·어디서·언제·누구에게·어떤 조건에서·얼마나 발생했는지만 Evidence로 확정합니다. 5Why는 D4에서 수행합니다.</span></div>
            <div class="quality-tool-head inline-head"><div><span class="quality-tool-kicker">QUALITY TOOL · 5W2H</span><h3>발생 사실</h3></div><span>${c.evidenceList?.length || 0}개 Evidence 연결</span></div>
            <div class="quality-field-grid">
              ${[
                ['problemWhat','What · 어떤 Failure인가',d2.problemWhat],
                ['problemWhere','Where · 어디에서 발견됐는가',d2.problemWhere],
                ['problemWhen','When · 언제 발생·발견됐는가',d2.problemWhen],
                ['problemWho','Who · 누가 발견했는가',d2.problemWho],
                ['problemWhich','Which · 제품·LOT·설비·공정',d2.problemWhich],
                ['problemHow','How · 어떤 조건에서 발생했는가',d2.problemHow],
                ['problemHowMany','How Many · 수량·PPM',d2.problemHowMany]
              ].map(([name,label,value]) => `<label><span>${label} *</span><input class="form-control" name="${name}" value="${escapeWorkspaceValue(value)}" required></label>`).join('')}
            </div>
          </div>

          <div class="card quality-stage-card">
            <div class="quality-tool-head inline-head"><div><span class="quality-tool-kicker">QUALITY TOOL · IS / IS NOT</span><h3>문제의 경계 비교</h3><p>발생 대상과 유사하지만 발생하지 않은 대상을 비교합니다. AI 초안의 비발생 정보는 실제 LOT·라인 데이터로 검증해야 합니다.</p></div><div class="inline-action-group"><button type="button" class="btn btn-primary btn-sm" onclick="generateD2IsIsNotDraft()"><i data-lucide="sparkles" style="width:13px;height:13px;"></i> AI 비교 초안 생성</button><button type="button" class="btn btn-secondary btn-sm" onclick="addD2IsIsNotRow()"><i data-lucide="plus" style="width:13px;height:13px;"></i> 비교행 추가</button></div></div>
            <div class="quality-table-wrap"><table class="custom-table quality-edit-table"><thead><tr><th>구분</th><th class="is-col">IS · 발생함</th><th class="isnot-col">IS NOT · 발생하지 않음</th><th>차이/특이점</th><th>관리</th></tr></thead><tbody>
              ${d2.isIsNot.length ? d2.isIsNot.map((row, idx) => `<tr>
                <td><input class="form-control" name="d2Factor${idx}" value="${escapeWorkspaceValue(row.factor)}" placeholder="제품/LOT/공정">${row.aiDraft ? `<span class="ai-draft-flag">AI 초안 · 사실확인 필요</span>` : ''}</td>
                <td><input class="form-control" name="d2Is${idx}" value="${escapeWorkspaceValue(row.is)}" placeholder="발생 대상"></td>
                <td><input class="form-control" name="d2IsNot${idx}" value="${escapeWorkspaceValue(row.isNot)}" placeholder="비발생 비교대상"></td>
                <td><input class="form-control" name="d2Difference${idx}" value="${escapeWorkspaceValue(row.difference)}" placeholder="확인된 차이"></td>
                <td><div class="row-manage-stack"><label class="row-verify-control"><input type="checkbox" name="d2Verified${idx}" ${isD2ComparisonRowVerified(row) ? 'checked' : ''}><span>사실 확인</span></label><button type="button" class="icon-danger-btn" onclick="removeD2IsIsNotRow(${idx})"><i data-lucide="trash-2"></i></button></div></td>
              </tr>`).join('') : `<tr><td colspan="5" class="quality-empty-row">IS / IS NOT 비교행을 한 개 이상 추가하세요.</td></tr>`}
            </tbody></table></div>
          </div>

          <div class="card quality-stage-card">
            <div class="quality-tool-head inline-head"><div><span class="quality-tool-kicker">AI FACT SYNTHESIS</span><h3>표준 문제 정의문</h3><p>입력한 사실만 조합하며 원인 추정 문구는 포함하지 않습니다.</p></div><button type="button" class="btn btn-secondary btn-sm" onclick="generateD2ProblemStatement()"><i data-lucide="sparkles" style="width:13px;height:13px;"></i> AI 초안 생성</button></div>
            <textarea class="form-control quality-statement" name="problemStatement" placeholder="AI 초안을 생성하거나 사실 기반 문제 정의문을 입력하세요.">${escapeWorkspaceValue(d2.problemStatement)}</textarea>
            <label class="quality-human-check"><input type="checkbox" name="humanConfirmed" ${approved ? 'checked' : ''}><span><strong>사실 검토 완료</strong> · 고객 원본, 수량, LOT와 비교대상을 확인했으며 원인 추정이 섞이지 않았습니다.</span></label>
            <div class="quality-stage-actions"><button type="button" class="btn btn-secondary" onclick="saveD2ProblemDefinition(false)">임시 저장</button><button type="button" class="btn btn-primary" onclick="saveD2ProblemDefinition(true)"><i data-lucide="badge-check" style="width:14px;height:14px;"></i> D2 문제 정의 승인</button></div>
          </div>
        </form>
      `;
    }

    function captureD2Form(c) {
      const form = document.getElementById('d2QualityForm');
      const d2 = ensureD2Structure(c);
      if (!form) return d2;
      ['problemWhat','problemWhere','problemWhen','problemWho','problemWhich','problemHow','problemHowMany','problemStatement'].forEach(name => {
        d2[name] = form.elements[name]?.value?.trim() || '';
      });
      d2.isIsNot = d2.isIsNot.map((row, idx) => ({
        factor: form.elements[`d2Factor${idx}`]?.value?.trim() || '',
        is: form.elements[`d2Is${idx}`]?.value?.trim() || '',
        isNot: form.elements[`d2IsNot${idx}`]?.value?.trim() || '',
        difference: form.elements[`d2Difference${idx}`]?.value?.trim() || '',
        aiDraft: Boolean(row.aiDraft),
        verificationStatus: form.elements[`d2Verified${idx}`]?.checked ? 'Verified' : 'Required'
      }));
      return d2;
    }

    function isD2ComparisonRowVerified(row) {
      if (row.verificationStatus) return row.verificationStatus === 'Verified';
      return !row.aiDraft && Boolean(row.factor && row.is && row.isNot && row.difference);
    }

    function generateD2IsIsNotDraft() {
      const c = getActiveCase();
      const d2 = captureD2Form(c);
      if (d2.isIsNot.some(row => row.factor || row.is || row.isNot || row.difference)) {
        if (!confirm('현재 IS / IS NOT 비교행을 AI 초안으로 교체하시겠습니까?')) return;
      }
      const whenAndHow = [d2.problemWhen, d2.problemHow].filter(Boolean).join(' · ') || c.receiptDate || '접수 시점/조건';
      const issue = d2.problemWhat || c.claimTitle || '접수 불량 현상';
      const affectedProduct = [c.product, c.partNumber, c.lotNumber].filter(Boolean).join(' / ');
      d2.isIsNot = [
        { factor:'제품 / LOT', is:affectedProduct || '접수 대상 제품/LOT', isNot:'[확인 필요] 동일 제품의 인접 LOT 또는 정상 LOT', difference:'[확인 필요] MES·검사이력에서 원자재/설비/시간대 차이 대조', aiDraft:true, verificationStatus:'Required' },
        { factor:'발생 위치', is:d2.problemWhere || c.incidentSite || '고객 발생 라인', isNot:'[확인 필요] 동일 고객의 타 라인 또는 정상 생산라인', difference:'[확인 필요] 라인·설비·공정조건 차이 대조', aiDraft:true, verificationStatus:'Required' },
        { factor:'시점 / 발생 조건', is:whenAndHow, isNot:'[확인 필요] 동일 제품의 비발생 시간대 또는 비발생 조건', difference:'[확인 필요] 작업시간·Recipe·Reflow 전후 조건 대조', aiDraft:true, verificationStatus:'Required' },
        { factor:'불량 현상', is:issue, isNot:'[확인 필요] 정상 동작품 또는 유사하지만 다른 불량 증상', difference:'[확인 필요] 측정값·Error Code·재현 여부 대조', aiDraft:true, verificationStatus:'Required' }
      ];
      d2.isIsNotDraft = { generatedAt:new Date().toISOString().replace('T',' ').slice(0,16), source:'Intake + 5W2H + Case metadata', status:'Human Verification Required' };
      d2.approval = { ...(d2.approval || {}), status:'Draft', humanConfirmed:false };
      saveAppData(); renderCurrentView();
    }

    function addD2IsIsNotRow() {
      const c = getActiveCase();
      const d2 = captureD2Form(c);
      d2.isIsNot.push({ factor:'', is:'', isNot:'', difference:'', aiDraft:false, verificationStatus:'Required' });
      saveAppData(); renderCurrentView();
    }

    function removeD2IsIsNotRow(idx) {
      const c = getActiveCase();
      const d2 = captureD2Form(c);
      d2.isIsNot.splice(idx, 1);
      d2.approval = { ...(d2.approval || {}), status:'Draft', humanConfirmed:false };
      saveAppData(); renderCurrentView();
    }

    function generateD2ProblemStatement() {
      const c = getActiveCase();
      const d2 = captureD2Form(c);
      d2.problemStatement = `${d2.problemWhen || '발생시점 미확인'} ${d2.problemWhere || '발생장소 미확인'}에서 ${d2.problemWhich || c.product} 대상으로 ${d2.problemHow || '조건 미확인'} 조건에서 ${d2.problemWhat || '불량 현상 미확인'}이 확인되었으며, 영향 규모는 ${d2.problemHowMany || `${c.defectQty} / ${c.inspectQty}ea (${c.ppm} PPM)`}이다.`;
      d2.aiDraft = { generatedAt:new Date().toISOString().replace('T',' ').slice(0,16), source:'5W2H facts only' };
      saveAppData(); renderCurrentView();
    }

    function saveD2ProblemDefinition(approve) {
      const c = getActiveCase();
      const form = document.getElementById('d2QualityForm');
      const d2 = captureD2Form(c);
      if (!approve) {
        d2.approval = { ...(d2.approval || {}), status:'Draft', humanConfirmed:false, savedAt:new Date().toISOString().replace('T',' ').slice(0,16) };
        saveAppData(); alert('D2 작성 내용이 임시 저장되었습니다.'); renderCurrentView(); return;
      }
      if (!isD1StageComplete(c)) { alert('D1 CFT와 RACI를 먼저 확정해 주세요.'); return; }
      const requiredFields = ['problemWhat','problemWhere','problemWhen','problemWho','problemWhich','problemHow','problemHowMany','problemStatement'];
      if (requiredFields.some(name => !d2[name])) { alert('5W2H와 표준 문제 정의문의 필수 항목을 모두 입력해 주세요.'); return; }
      if (!d2.isIsNot.length || d2.isIsNot.some(row => !row.factor || !row.is || !row.isNot || !row.difference)) { alert('IS / IS NOT 비교행을 한 개 이상 완성해 주세요.'); return; }
      if (d2.isIsNot.some(row => row.verificationStatus !== 'Verified')) { alert('각 IS / IS NOT 행의 비발생 비교대상과 차이를 실제 데이터로 확인한 뒤 [사실 확인]에 체크해 주세요.'); return; }
      if (!(c.evidenceList || []).length) { alert('문제 정의를 뒷받침할 고객 원본 또는 측정 Evidence가 필요합니다.'); return; }
      if (!form?.elements.humanConfirmed?.checked) { alert('[사실 검토 완료]에 체크해 주세요.'); return; }
      d2.approval = { status:'Approved', humanConfirmed:true, approvedAt:new Date().toISOString().replace('T',' ').slice(0,16), approvedBy:{name:CURRENT_USER.name,dept:CURRENT_USER.dept,email:CURRENT_USER.email} };
      c.currentStage = 'D2';
      saveAppData(); alert('D2 문제 정의가 승인되었습니다. D3 긴급 봉쇄조치를 시작할 수 있습니다.'); renderCurrentView();
    }

    function ensureD3Structure(c) {
      c.d3 = c.d3 || {};
      c.d3.materialFlow = Array.isArray(c.d3.materialFlow) ? c.d3.materialFlow : [];
      c.d3.actions = Array.isArray(c.d3.actions) ? c.d3.actions : [];
      c.d3.lotScope = c.d3.lotScope || {};
      c.d3.effectiveness = c.d3.effectiveness || {};
      c.d3.inventorySources = c.d3.inventorySources || {
        erp: {
          RAK4: { warehouse:'RAK4', lot:c.lotNumber || '', currentQty:0, holdQty:0, evidence:'', verified:false },
          RAK5: { warehouse:'RAK5', lot:c.lotNumber || '', currentQty:0, holdQty:0, evidence:'', verified:false }
        },
        mes: { processStocks:[], evidence:'', verified:false }
      };
      c.d3.inventorySources.erp = c.d3.inventorySources.erp || {};
      ['RAK4','RAK5'].forEach(code => {
        c.d3.inventorySources.erp[code] = c.d3.inventorySources.erp[code] || { warehouse:code, lot:c.lotNumber || '', currentQty:0, holdQty:0, evidence:'', verified:false };
      });
      c.d3.inventorySources.mes = c.d3.inventorySources.mes || { processStocks:[], evidence:'', verified:false };
      c.d3.inventorySources.mes.processStocks = Array.isArray(c.d3.inventorySources.mes.processStocks) ? c.d3.inventorySources.mes.processStocks : [];
      return c.d3;
    }

    function renderD3InventorySourcePanel(c) {
      const sources = ensureD3Structure(c).inventorySources;
      const rak4 = sources.erp.RAK4;
      const rak5 = sources.erp.RAK5;
      const mes = sources.mes;
      const erpTotal = Number(rak4.currentQty || 0) + Number(rak5.currentQty || 0);
      const mesTotal = mes.processStocks.reduce((sum,row) => sum + Number(row.currentQty || 0), 0);
      return `
        <section class="inventory-source-panel">
          <div class="quality-tool-head inventory-source-head">
            <div><span class="quality-tool-kicker">SOURCE DATA · ERP / MES</span><h3>현재 재고 확인</h3><p>Excel은 외부 서버로 전송하지 않고 이 브라우저에서만 분석합니다. 자동 매핑 결과를 반드시 사람에게 확인받습니다.</p></div>
            <div class="inventory-total-strip"><span>ERP 완제품 <b id="erpFinishedTotal">${erpTotal.toLocaleString()}</b></span><span>MES 공정재고 <b id="mesWipTotal">${mesTotal.toLocaleString()}</b></span></div>
          </div>
          <div class="erp-warehouse-grid">
            ${['RAK4','RAK5'].map(code => {
              const row = sources.erp[code];
              return `<article class="warehouse-inventory-block">
                <div class="warehouse-code"><span>ERP FINISHED GOODS</span><strong>${code}</strong><em>${row.importedAt ? `Excel ${row.importedAt}` : '수동 입력 또는 Excel'}</em></div>
                <div class="warehouse-field-grid">
                  <label><span>관리 LOT</span><input class="form-control" name="erp${code}Lot" value="${escapeWorkspaceValue(row.lot || c.lotNumber)}"></label>
                  <label><span>현재 재고</span><input class="form-control num-mono" type="number" min="0" name="erp${code}Qty" value="${Number(row.currentQty || 0)}" oninput="updateD3InventoryPreview()"></label>
                  <label><span>Hold 수량</span><input class="form-control num-mono" type="number" min="0" name="erp${code}Hold" value="${Number(row.holdQty || 0)}"></label>
                  <label><span>근거 / 파일명</span><input class="form-control" name="erp${code}Evidence" value="${escapeWorkspaceValue(row.evidence)}" placeholder="ERP 재고조회 파일"></label>
                </div>
                <div class="warehouse-actions"><input type="file" id="inventoryFile${code}" accept=".xlsx,.xls,.csv" hidden onchange="handleInventoryExcelImport(event,'erp','${code}')"><button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('inventoryFile${code}').click()"><i data-lucide="file-spreadsheet" style="width:13px;height:13px;"></i> ${code} Excel 가져오기</button><label><input type="checkbox" name="erp${code}Verified" ${row.verified ? 'checked' : ''}> ${code} 재고 확인</label></div>
              </article>`;
            }).join('')}
          </div>
          <div class="mes-inventory-block">
            <div class="mes-inventory-head"><div><span>MES WORK IN PROCESS</span><strong>공정별 현재 재공품</strong><small>${mes.importedAt ? `Excel 반영 ${mes.importedAt}` : '공정명과 현재 수량을 입력하거나 MES Excel을 가져오세요.'}</small></div><div class="inline-action-group"><input type="file" id="inventoryFileMES" accept=".xlsx,.xls,.csv" hidden onchange="handleInventoryExcelImport(event,'mes','MES')"><button type="button" class="btn btn-primary btn-sm" onclick="document.getElementById('inventoryFileMES').click()"><i data-lucide="file-spreadsheet" style="width:13px;height:13px;"></i> MES Excel 가져오기</button><button type="button" class="btn btn-secondary btn-sm" onclick="addMESProcessStockRow()"><i data-lucide="plus" style="width:13px;height:13px;"></i> 공정 추가</button></div></div>
            <div class="quality-table-wrap"><table class="custom-table quality-edit-table"><thead><tr><th>공정명</th><th>LOT</th><th>현재 WIP</th><th>Hold</th><th>상태</th><th>Evidence</th><th>관리</th></tr></thead><tbody>
              ${mes.processStocks.length ? mes.processStocks.map((row,idx) => `<tr><td><input class="form-control" name="mesProcess${idx}" value="${escapeWorkspaceValue(row.process)}" placeholder="예: SMT / TEST"></td><td><input class="form-control" name="mesLot${idx}" value="${escapeWorkspaceValue(row.lot || c.lotNumber)}"></td><td><input class="form-control num-mono" type="number" min="0" name="mesQty${idx}" value="${Number(row.currentQty || 0)}" oninput="updateD3InventoryPreview()"></td><td><input class="form-control num-mono" type="number" min="0" name="mesHold${idx}" value="${Number(row.holdQty || 0)}"></td><td><select class="form-control" name="mesStatus${idx}">${['미확인','In Process','Hold','Screening','Released'].map(status => `<option ${row.status===status?'selected':''}>${status}</option>`).join('')}</select></td><td><input class="form-control" name="mesEvidence${idx}" value="${escapeWorkspaceValue(row.evidence || mes.evidence)}" placeholder="MES 조회/파일명"></td><td><button type="button" class="icon-danger-btn" onclick="removeMESProcessStockRow(${idx})"><i data-lucide="trash-2"></i></button></td></tr>`).join('') : `<tr><td colspan="7" class="quality-empty-row">MES 공정재고가 없습니다. Excel을 가져오거나 공정행을 추가하세요.</td></tr>`}
            </tbody></table></div>
            <div class="mes-verification-row"><label><input type="checkbox" name="mesVerified" ${mes.verified ? 'checked' : ''}> MES 공정별 WIP 확인 완료</label><button type="button" class="btn btn-secondary btn-sm" onclick="applyInventorySourcesToMaterialFlow()"><i data-lucide="arrow-down-to-line" style="width:13px;height:13px;"></i> D3 Material Flow에 반영</button></div>
          </div>
        </section>
      `;
    }

    function captureD3InventoryForm(c, form) {
      const sources = ensureD3Structure(c).inventorySources;
      if (!form) return sources;
      ['RAK4','RAK5'].forEach(code => {
        const current = sources.erp[code];
        sources.erp[code] = {
          ...current,
          warehouse:code,
          lot:form.elements[`erp${code}Lot`]?.value?.trim() || c.lotNumber || '',
          currentQty:Number(form.elements[`erp${code}Qty`]?.value || 0),
          holdQty:Number(form.elements[`erp${code}Hold`]?.value || 0),
          evidence:form.elements[`erp${code}Evidence`]?.value?.trim() || '',
          verified:Boolean(form.elements[`erp${code}Verified`]?.checked)
        };
      });
      sources.mes.processStocks = sources.mes.processStocks.map((row,idx) => ({
        ...row,
        process:form.elements[`mesProcess${idx}`]?.value?.trim() || '',
        lot:form.elements[`mesLot${idx}`]?.value?.trim() || c.lotNumber || '',
        currentQty:Number(form.elements[`mesQty${idx}`]?.value || 0),
        holdQty:Number(form.elements[`mesHold${idx}`]?.value || 0),
        status:form.elements[`mesStatus${idx}`]?.value || '미확인',
        evidence:form.elements[`mesEvidence${idx}`]?.value?.trim() || ''
      }));
      sources.mes.verified = Boolean(form.elements.mesVerified?.checked);
      return sources;
    }

    function updateD3InventoryPreview() {
      const form = document.getElementById('d3QualityForm');
      if (!form) return;
      const erpTotal = ['RAK4','RAK5'].reduce((sum,code) => sum + Number(form.elements[`erp${code}Qty`]?.value || 0), 0);
      const c = getActiveCase();
      const mesCount = ensureD3Structure(c).inventorySources.mes.processStocks.length;
      const mesTotal = Array.from({length:mesCount},(_,idx) => Number(form.elements[`mesQty${idx}`]?.value || 0)).reduce((a,b)=>a+b,0);
      const erpEl=document.getElementById('erpFinishedTotal'); const mesEl=document.getElementById('mesWipTotal');
      if (erpEl) erpEl.textContent=erpTotal.toLocaleString();
      if (mesEl) mesEl.textContent=mesTotal.toLocaleString();
    }

    function addMESProcessStockRow() {
      const c=getActiveCase(); const form=document.getElementById('d3QualityForm'); const sources=captureD3InventoryForm(c,form);
      sources.mes.processStocks.push({process:'',lot:c.lotNumber || '',currentQty:0,holdQty:0,status:'미확인',evidence:''});
      sources.mes.verified=false; saveAppData(); renderCurrentView();
    }

    function removeMESProcessStockRow(idx) {
      const c=getActiveCase(); const form=document.getElementById('d3QualityForm'); const sources=captureD3InventoryForm(c,form);
      sources.mes.processStocks.splice(idx,1); sources.mes.verified=false; saveAppData(); renderCurrentView();
    }

    function createD3MaterialFlowRows(c) {
      const areas=['1. 원자재/협력사','2. 입고검사/원자재 창고','3. 공정 재공품(WIP)','4. 완제품 창고','5. 출하 대기/운송 중','6. 고객 창고','7. 고객 생산라인'];
      return areas.map(area=>({area,lot:c.lotNumber,totalQty:0,holdQty:0,screenQty:0,ngQty:0,status:'미확인',evidence:''}));
    }

    function syncInventorySourcesToMaterialFlow(c) {
      const d3=ensureD3Structure(c); const sources=d3.inventorySources;
      if (d3.materialFlow.length!==7) d3.materialFlow=createD3MaterialFlowRows(c);
      const rakRows=['RAK4','RAK5'].map(code=>sources.erp[code]);
      const finished=d3.materialFlow.find(row=>row.area.includes('완제품 창고'));
      const wip=d3.materialFlow.find(row=>row.area.includes('공정 재공품'));
      const erpQty=rakRows.reduce((sum,row)=>sum+Number(row.currentQty||0),0); const erpHold=rakRows.reduce((sum,row)=>sum+Number(row.holdQty||0),0);
      const mesQty=sources.mes.processStocks.reduce((sum,row)=>sum+Number(row.currentQty||0),0); const mesHold=sources.mes.processStocks.reduce((sum,row)=>sum+Number(row.holdQty||0),0);
      if (finished) Object.assign(finished,{lot:rakRows.map(row=>row.lot).filter(Boolean).join(', ')||c.lotNumber,totalQty:erpQty,holdQty:erpHold,status:erpQty===0?'Not Applicable':erpHold>=erpQty?'Hold':'Screening',evidence:rakRows.map(row=>`${row.warehouse}:${row.evidence}`).join(' / ')});
      if (wip) Object.assign(wip,{lot:[...new Set(sources.mes.processStocks.map(row=>row.lot).filter(Boolean))].join(', ')||c.lotNumber,totalQty:mesQty,holdQty:mesHold,status:mesQty===0?'Not Applicable':mesHold>=mesQty?'Hold':'Screening',evidence:sources.mes.processStocks.map(row=>`${row.process}:${row.evidence}`).join(' / ')});
      d3.inventoryReconciliation={erpFinishedQty:erpQty,mesWipQty:mesQty,syncedAt:new Date().toISOString().replace('T',' ').slice(0,16),source:'ERP RAK4+RAK5 / MES process WIP'};
    }

    function applyInventorySourcesToMaterialFlow() {
      const c=getActiveCase(); const form=document.getElementById('d3QualityForm'); const sources=captureD3InventoryForm(c,form);
      const warehouses=['RAK4','RAK5'].map(code=>sources.erp[code]);
      if (warehouses.some(row=>!row.verified||!row.evidence||row.holdQty>row.currentQty)) { alert('RAK4와 RAK5의 현재 재고·Hold·근거를 각각 확인하고 재고 확인에 체크해 주세요.'); return; }
      if (!sources.mes.verified||!sources.mes.processStocks.length||sources.mes.processStocks.some(row=>!row.process||!row.lot||row.status==='미확인'||!row.evidence||row.holdQty>row.currentQty)) { alert('MES 공정별 WIP·Hold·상태·Evidence를 확인하고 MES 확인 완료에 체크해 주세요.'); return; }
      syncInventorySourcesToMaterialFlow(c); saveAppData(); alert('RAK4·RAK5 완제품 재고와 MES 공정재고가 D3 Material Flow에 반영되었습니다.'); renderCurrentView();
    }

    function normalizeInventoryHeader(value) {
      return String(value||'').toLowerCase().replace(/[\s_\-\/().]/g,'');
    }

    function findInventoryColumn(rows,aliases) {
      const keys=[...new Set(rows.slice(0,30).flatMap(row=>Object.keys(row)))];
      const normalizedAliases=aliases.map(normalizeInventoryHeader);
      return keys.find(key=>normalizedAliases.includes(normalizeInventoryHeader(key))) || keys.find(key=>normalizedAliases.some(alias=>normalizeInventoryHeader(key).includes(alias)));
    }

    function parseInventoryNumber(value) {
      const num=Number(String(value??0).replace(/,/g,'').replace(/[^0-9.-]/g,''));
      return Number.isFinite(num)?num:0;
    }

    function detectInventoryColumns(rows) {
      return {
        warehouse:findInventoryColumn(rows,['창고','창고코드','저장위치','storage location','warehouse','location']),
        lot:findInventoryColumn(rows,['lot','lot no','lot number','제조lot','로트','배치']),
        part:findInventoryColumn(rows,['품번','자재코드','part number','part no','material code','item code']),
        quantity:findInventoryColumn(rows,['현재고','현재재고','재고수량','가용재고','current stock','on hand','stock qty','inventory qty','wip qty','수량','qty']),
        hold:findInventoryColumn(rows,['hold 수량','hold qty','격리수량','보류수량','홀드수량']),
        process:findInventoryColumn(rows,['공정명','공정','operation name','operation','process name','process','작업장','work center'])
      };
    }

    function filterInventoryRowsForCase(rows,columns,c) {
      const lotNeedle=normalizeInventoryHeader(c.lotNumber); const partNeedle=normalizeInventoryHeader(c.partNumber);
      const hasCaseKey=Boolean(columns.lot||columns.part);
      if (!hasCaseKey) return rows;
      return rows.filter(row=>{
        const lot=normalizeInventoryHeader(columns.lot?row[columns.lot]:''); const part=normalizeInventoryHeader(columns.part?row[columns.part]:'');
        const checks=[];
        if (columns.lot&&lotNeedle) checks.push(lot.includes(lotNeedle));
        if (columns.part&&partNeedle) checks.push(part.includes(partNeedle));
        return checks.length ? checks.every(Boolean) : true;
      });
    }

    async function handleInventoryExcelImport(event,sourceType,sourceCode) {
      const file=event.target.files?.[0]; if (!file) return;
      if (typeof XLSX==='undefined') { alert('Excel 파서를 불러오지 못했습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.'); return; }
      try {
        const workbook=XLSX.read(await file.arrayBuffer(),{type:'array'});
        const rows=workbook.SheetNames.flatMap(sheetName=>XLSX.utils.sheet_to_json(workbook.Sheets[sheetName],{defval:'',raw:false}).map(row=>({...row,__sheet:sheetName})));
        if (!rows.length) throw new Error('Excel에 읽을 수 있는 데이터 행이 없습니다.');
        const columns=detectInventoryColumns(rows); if (!columns.quantity) throw new Error('현재고/재고수량/QTY 열을 찾지 못했습니다.');
        const c=getActiveCase(); const d3=ensureD3Structure(c); let filtered=filterInventoryRowsForCase(rows,columns,c);
        if (sourceType==='erp'&&columns.warehouse) filtered=filtered.filter(row=>normalizeInventoryHeader(row[columns.warehouse]).includes(normalizeInventoryHeader(sourceCode)));
        if (!filtered.length) throw new Error(`${c.lotNumber || c.partNumber} 및 ${sourceCode} 조건에 맞는 행을 찾지 못했습니다.`);
        const importedAt=new Date().toISOString().replace('T',' ').slice(0,16);
        if (sourceType==='erp') {
          const lots=[...new Set(filtered.map(row=>columns.lot?String(row[columns.lot]).trim():'').filter(Boolean))];
          d3.inventorySources.erp[sourceCode]={...d3.inventorySources.erp[sourceCode],warehouse:sourceCode,lot:lots.join(', ')||c.lotNumber,currentQty:filtered.reduce((sum,row)=>sum+parseInventoryNumber(row[columns.quantity]),0),holdQty:columns.hold?filtered.reduce((sum,row)=>sum+parseInventoryNumber(row[columns.hold]),0):0,evidence:file.name,verified:false,importedAt,columnMapping:columns,rowCount:filtered.length};
        } else {
          if (!columns.process) throw new Error('MES Excel에서 공정명/Process 열을 찾지 못했습니다.');
          const grouped=new Map(); filtered.forEach(row=>{const process=String(row[columns.process]||'미지정 공정').trim();const current=grouped.get(process)||{process,lot:columns.lot?String(row[columns.lot]).trim():c.lotNumber,currentQty:0,holdQty:0,status:'In Process',evidence:file.name};current.currentQty+=parseInventoryNumber(row[columns.quantity]);if(columns.hold)current.holdQty+=parseInventoryNumber(row[columns.hold]);grouped.set(process,current);});
          d3.inventorySources.mes={processStocks:[...grouped.values()],evidence:file.name,verified:false,importedAt,columnMapping:columns,rowCount:filtered.length};
        }
        saveAppData(); renderCurrentView(); alert(`${file.name}에서 ${filtered.length}개 행을 읽었습니다. 자동 합산값과 열 매핑을 확인한 뒤 재고 확인에 체크해 주세요.`);
      } catch(error) { alert(`Excel 가져오기 실패: ${error.message}`); }
      finally { event.target.value=''; }
    }

    function renderD3QualityWorkspace(c) {
      const d3 = ensureD3Structure(c);
      const approved = isD3StageComplete(c);
      return `
        <form id="d3QualityForm" onsubmit="event.preventDefault()">
          <div class="card quality-stage-card">
            <div class="card-header"><div class="card-title"><i data-lucide="radar" style="color:#f59e0b;width:16px;height:16px;"></i> D3. 영향 LOT 및 봉쇄 범위</div><span class="quality-gate-state ${approved ? 'is-complete' : ''}">${approved ? '봉쇄 승인 완료' : '범위 확인 필요'}</span></div>
            <div class="quality-boundary-note danger"><strong>D3는 원인 제거가 아니라 추가 유출 차단 단계입니다.</strong><span>원인 확정 전에도 의심 범위를 보수적으로 Hold하고, 안전성이 입증된 제품만 Release합니다.</span></div>
            ${renderD3InventorySourcePanel(c)}
            <div class="quality-tool-head inline-head"><div><span class="quality-tool-kicker">QUALITY TOOL · LOT TRACEABILITY</span><h3>영향 범위 추적</h3></div></div>
            <div class="quality-field-grid">
              ${[
                ['affectedLot','문제 LOT *',d3.lotScope.affectedLot || c.lotNumber],['adjacentLots','전·후 LOT / 확대 대상 *',d3.lotScope.adjacentLots],['rawMaterialBatch','동일 원자재 Batch *',d3.lotScope.rawMaterialBatch],['equipment','동일 설비·Recipe *',d3.lotScope.equipment],['shippedQty','기출하 수량',d3.lotScope.shippedQty,'number'],['inTransitQty','운송 중 수량',d3.lotScope.inTransitQty,'number'],['customerStockQty','고객 재고 수량',d3.lotScope.customerStockQty,'number']
              ].map(([name,label,value,type]) => `<label><span>${label}</span><input class="form-control" name="${name}" type="${type || 'text'}" value="${escapeWorkspaceValue(value)}"></label>`).join('')}
            </div>
            <label class="quality-full-field"><span>영향 범위 선정 근거 *</span><textarea class="form-control" name="scopeRationale" placeholder="동일 원자재, 설비, 시간대, 전후 LOT까지 포함한 이유를 기록하세요.">${escapeWorkspaceValue(d3.lotScope.rationale)}</textarea></label>
          </div>

          <div class="card quality-stage-card">
            <div class="quality-tool-head inline-head"><div><span class="quality-tool-kicker">QUALITY TOOL · 7-AREA MATERIAL FLOW</span><h3>위치별 재고·재공·출하 통제</h3></div>${d3.materialFlow.length ? '' : `<button type="button" class="btn btn-secondary btn-sm" onclick="initializeD3MaterialFlow()"><i data-lucide="wand-sparkles" style="width:13px;height:13px;"></i> 7개 영역 생성</button>`}</div>
            <div class="quality-table-wrap"><table class="custom-table quality-edit-table wide-quality-table"><thead><tr><th>관리 영역</th><th>LOT</th><th>총수량</th><th>Hold</th><th>선별</th><th>NG</th><th>상태</th><th>Evidence *</th></tr></thead><tbody>
              ${d3.materialFlow.length ? d3.materialFlow.map((row,idx) => `<tr><td><input class="form-control" name="mfArea${idx}" value="${escapeWorkspaceValue(row.area)}"></td><td><input class="form-control" name="mfLot${idx}" value="${escapeWorkspaceValue(row.lot)}"></td>${['totalQty','holdQty','screenQty','ngQty'].map(key => `<td><input class="form-control num-mono" type="number" min="0" name="mf${key}${idx}" value="${Number(row[key] || 0)}"></td>`).join('')}<td><select class="form-control" name="mfStatus${idx}">${['미확인','Hold','Screening','Released','Not Applicable'].map(status => `<option ${row.status === status ? 'selected' : ''}>${status}</option>`).join('')}</select></td><td><input class="form-control" name="mfEvidence${idx}" value="${escapeWorkspaceValue(row.evidence)}" placeholder="ERP/MES/사진"></td></tr>`).join('') : `<tr><td colspan="8" class="quality-empty-row">7개 관리 영역을 생성해 위치별 수량을 확인하세요.</td></tr>`}
            </tbody></table></div>
          </div>

          <div class="card quality-stage-card">
            <div class="quality-tool-head inline-head"><div><span class="quality-tool-kicker">QUALITY TOOL · INTERIM CONTAINMENT ACTION</span><h3>긴급 봉쇄조치</h3></div><button type="button" class="btn btn-secondary btn-sm" onclick="addD3ContainmentAction()"><i data-lucide="plus" style="width:13px;height:13px;"></i> 조치 추가</button></div>
            <div class="quality-table-wrap"><table class="custom-table quality-edit-table wide-quality-table"><thead><tr><th>ID</th><th>대상</th><th>조치 내용</th><th>담당자</th><th>기한</th><th>상태</th><th>결과·Evidence</th><th>관리</th></tr></thead><tbody>
              ${d3.actions.length ? d3.actions.map((row,idx) => `<tr><td class="num-mono">${row.id || `ICA-${String(idx+1).padStart(2,'0')}`}</td><td><input class="form-control" name="caTarget${idx}" value="${escapeWorkspaceValue(row.target)}"></td><td><input class="form-control" name="caAction${idx}" value="${escapeWorkspaceValue(row.action)}"></td><td><input class="form-control" name="caOwner${idx}" value="${escapeWorkspaceValue(row.owner)}"></td><td><input class="form-control" name="caDue${idx}" type="datetime-local" value="${escapeWorkspaceValue(String(row.due || '').replace(' ','T'))}"></td><td><select class="form-control" name="caStatus${idx}">${['Open','In Progress','Completed'].map(status => `<option ${row.status === status ? 'selected' : ''}>${status}</option>`).join('')}</select></td><td><input class="form-control" name="caResult${idx}" value="${escapeWorkspaceValue(row.result || row.evidence)}" placeholder="결과/증거번호"></td><td><button type="button" class="icon-danger-btn" onclick="removeD3ContainmentAction(${idx})"><i data-lucide="trash-2"></i></button></td></tr>`).join('') : `<tr><td colspan="8" class="quality-empty-row">출하정지·재고격리·고객선별 등의 봉쇄조치를 등록하세요.</td></tr>`}
            </tbody></table></div>
          </div>

          <div class="card quality-stage-card">
            <div class="quality-tool-head inline-head"><div><span class="quality-tool-kicker">QUALITY TOOL · EFFECTIVENESS VERIFICATION</span><h3>봉쇄 유효성 검증</h3></div></div>
            <div class="effectiveness-check-grid">
              ${[['noAdditionalClaim','조치 후 추가 고객 불량 없음'],['lineStable','고객 라인 정상 가동 확인'],['stockReconciled','Hold·실물·시스템 수량 일치']].map(([name,label]) => `<label><select class="form-control" name="${name}"><option value="">확인 필요</option><option value="yes" ${d3.effectiveness[name] === 'yes' ? 'selected' : ''}>YES · 확인됨</option><option value="no" ${d3.effectiveness[name] === 'no' ? 'selected' : ''}>NO · 미충족</option></select><span>${label}</span></label>`).join('')}
            </div>
            <label class="quality-full-field"><span>효과성 검증 Evidence *</span><input class="form-control" name="verificationEvidence" value="${escapeWorkspaceValue(d3.effectiveness.verificationEvidence)}" placeholder="고객 확인메일, ERP Hold, 선별성적서 등"></label>
            <label class="quality-full-field"><span>봉쇄 유효성 결론 *</span><textarea class="form-control" name="effectivenessStatement" placeholder="어떤 범위를 어떻게 차단했고 추가 유출이 없음을 무엇으로 확인했는지 작성하세요.">${escapeWorkspaceValue(d3.effectivenessStatement)}</textarea></label>
            <label class="quality-human-check"><input type="checkbox" name="humanConfirmed" ${approved ? 'checked' : ''}><span><strong>봉쇄 검토 완료</strong> · 물류/품질/8D Leader가 범위, 수량, 조치와 Evidence를 확인했습니다.</span></label>
            <div class="quality-stage-actions"><button type="button" class="btn btn-secondary" onclick="saveD3Containment(false)">임시 저장</button><button type="button" class="btn btn-primary" onclick="saveD3Containment(true)"><i data-lucide="shield-check" style="width:14px;height:14px;"></i> D3 봉쇄 승인</button></div>
          </div>
        </form>
      `;
    }

    function captureD3Form(c) {
      const form = document.getElementById('d3QualityForm');
      const d3 = ensureD3Structure(c);
      if (!form) return d3;
      captureD3InventoryForm(c,form);
      d3.lotScope = {
        affectedLot:form.elements.affectedLot?.value?.trim() || '', adjacentLots:form.elements.adjacentLots?.value?.trim() || '', rawMaterialBatch:form.elements.rawMaterialBatch?.value?.trim() || '', equipment:form.elements.equipment?.value?.trim() || '', shippedQty:Number(form.elements.shippedQty?.value || 0), inTransitQty:Number(form.elements.inTransitQty?.value || 0), customerStockQty:Number(form.elements.customerStockQty?.value || 0), rationale:form.elements.scopeRationale?.value?.trim() || ''
      };
      d3.materialFlow = d3.materialFlow.map((row,idx) => ({ area:form.elements[`mfArea${idx}`]?.value?.trim() || '', lot:form.elements[`mfLot${idx}`]?.value?.trim() || '', totalQty:Number(form.elements[`mftotalQty${idx}`]?.value || 0), holdQty:Number(form.elements[`mfholdQty${idx}`]?.value || 0), screenQty:Number(form.elements[`mfscreenQty${idx}`]?.value || 0), ngQty:Number(form.elements[`mfngQty${idx}`]?.value || 0), status:form.elements[`mfStatus${idx}`]?.value || '미확인', evidence:form.elements[`mfEvidence${idx}`]?.value?.trim() || '' }));
      d3.actions = d3.actions.map((row,idx) => ({ id:row.id || `ICA-${String(idx+1).padStart(2,'0')}`, target:form.elements[`caTarget${idx}`]?.value?.trim() || '', action:form.elements[`caAction${idx}`]?.value?.trim() || '', owner:form.elements[`caOwner${idx}`]?.value?.trim() || '', due:(form.elements[`caDue${idx}`]?.value || '').replace('T',' '), status:form.elements[`caStatus${idx}`]?.value || 'Open', result:form.elements[`caResult${idx}`]?.value?.trim() || '', completion:row.completion || '' }));
      d3.effectiveness = { noAdditionalClaim:form.elements.noAdditionalClaim?.value || '', lineStable:form.elements.lineStable?.value || '', stockReconciled:form.elements.stockReconciled?.value || '', verificationEvidence:form.elements.verificationEvidence?.value?.trim() || '' };
      d3.effectivenessStatement = form.elements.effectivenessStatement?.value?.trim() || '';
      return d3;
    }

    function initializeD3MaterialFlow() {
      const c = getActiveCase(); const d3 = captureD3Form(c);
      d3.materialFlow = createD3MaterialFlowRows(c);
      saveAppData(); renderCurrentView();
    }

    function addD3ContainmentAction() {
      const c = getActiveCase(); const d3 = captureD3Form(c);
      d3.actions.push({id:`ICA-${String(d3.actions.length+1).padStart(2,'0')}`,target:'',action:'',owner:'',due:'',status:'Open',result:'',completion:''});
      saveAppData(); renderCurrentView();
    }

    function removeD3ContainmentAction(idx) {
      const c = getActiveCase(); const d3 = captureD3Form(c);
      d3.actions.splice(idx,1); d3.approval = {...(d3.approval||{}),status:'Draft',humanConfirmed:false};
      saveAppData(); renderCurrentView();
    }

    function saveD3Containment(approve) {
      const c = getActiveCase(); const form = document.getElementById('d3QualityForm'); const d3 = captureD3Form(c);
      if (!approve) { d3.approval={...(d3.approval||{}),status:'Draft',humanConfirmed:false,savedAt:new Date().toISOString().replace('T',' ').slice(0,16)}; saveAppData(); alert('D3 작성 내용이 임시 저장되었습니다.'); renderCurrentView(); return; }
      if (!isD2StageComplete(c)) { alert('D2 문제 정의를 먼저 승인해 주세요.'); return; }
      const sources=d3.inventorySources; const warehouses=['RAK4','RAK5'].map(code=>sources.erp[code]);
      if (warehouses.some(row=>!row.verified||!row.evidence||row.holdQty>row.currentQty) || !sources.mes.verified || !sources.mes.processStocks.length || sources.mes.processStocks.some(row=>!row.process||!row.evidence||row.status==='미확인'||row.holdQty>row.currentQty)) { alert('D3 승인 전에 ERP RAK4·RAK5와 MES 공정별 재고를 각각 확인하고 Material Flow에 반영해 주세요.'); return; }
      const scope=d3.lotScope; if (!scope.affectedLot || !scope.adjacentLots || !scope.rawMaterialBatch || !scope.equipment || !scope.rationale) { alert('LOT 영향 범위와 선정 근거를 모두 입력해 주세요.'); return; }
      if (d3.materialFlow.length !== 7 || d3.materialFlow.some(row => !row.area || !row.lot || row.status === '미확인' || !row.evidence || row.holdQty > row.totalQty || row.screenQty > row.totalQty)) { alert('7개 Material Flow 영역의 수량·상태·Evidence를 확인해 주세요. Hold/선별 수량은 총수량을 초과할 수 없습니다.'); return; }
      if (!d3.actions.length || d3.actions.some(row => !row.target || !row.action || !row.owner || !row.due || row.status !== 'Completed' || !row.result)) { alert('봉쇄조치를 한 개 이상 등록하고 담당자·기한·완료상태·결과 Evidence를 완성해 주세요.'); return; }
      if (['noAdditionalClaim','lineStable','stockReconciled'].some(key => d3.effectiveness[key] !== 'yes') || !d3.effectiveness.verificationEvidence || !d3.effectivenessStatement) { alert('봉쇄 효과성 3개 항목과 검증 Evidence·결론을 모두 충족해 주세요.'); return; }
      if (!form?.elements.humanConfirmed?.checked) { alert('[봉쇄 검토 완료]에 체크해 주세요.'); return; }
      d3.approval={status:'Approved',humanConfirmed:true,approvedAt:new Date().toISOString().replace('T',' ').slice(0,16),approvedBy:{name:CURRENT_USER.name,dept:CURRENT_USER.dept,email:CURRENT_USER.email}};
      c.currentStage='D3'; saveAppData(); alert('D3 긴급 봉쇄조치가 승인되었습니다. D4 원인분석을 시작할 수 있습니다.'); renderCurrentView();
    }

    const D4_CORE_TOOL_IDS = ['timeline','process-flow','change-point','fishbone','five-why'];

    function getD4ToolCatalog() {
      return [
        {id:'timeline',category:'문제 구조화',name:'발생 타임라인',desc:'마지막 정상부터 고객 불량까지 사건과 변경점을 시간축으로 정렬',needs:'생산·검사·입출고·고객 발생 일시'},
        {id:'process-flow',category:'문제 구조화',name:'Process Flow / SIPOC',desc:'Wafer·외주 Assembly·Test·입고·출하·고객 사용 경로에서 발생·검출 지점을 확인',needs:'공정 흐름도, 외주사/검사 단계'},
        {id:'change-point',category:'문제 구조화',name:'Change Point Analysis',desc:'정상과 불량 사이의 4M1E·설계·외주사 변경점을 비교',needs:'변경통보, Recipe·자재·설비 이력'},
        {id:'fishbone',category:'원인 발굴',name:'Fishbone 8M',desc:'Man·Machine·Material·Method·Measurement·Environment·Design·Supplier 후보 발굴',needs:'CFT 브레인스토밍과 사실자료'},
        {id:'five-why',category:'원인 발굴',name:'3-Track 5 Why',desc:'발생·유출·시스템 원인을 분리하여 Why마다 Evidence를 연결',needs:'검증된 현상과 원인 후보'},
        {id:'fta',category:'원인 발굴',name:'Fault Tree Analysis',desc:'복합·간헐 고장의 AND/OR 원인 경로를 논리적으로 분해',needs:'고장 Mode와 기능 블록'},
        {id:'cause-effect',category:'원인 발굴',name:'Cause & Effect Matrix',desc:'후보 원인의 연관성·재현성·Evidence 수준으로 우선순위 선정',needs:'원인 후보 목록과 평가기준'},
        {id:'stratification',category:'데이터 분석',name:'층별 분석',desc:'LOT·외주사·설비·Tester·Socket·일자·교대조별 불량 집중도를 비교',needs:'조건 열이 포함된 불량 데이터'},
        {id:'pareto',category:'데이터 분석',name:'Pareto 분석',desc:'복수 불량 Mode·Bin·조건 중 주요 기여 항목을 선별',needs:'범주별 건수 또는 불량수량'},
        {id:'run-chart',category:'데이터 분석',name:'Trend / Run Chart',desc:'시간에 따른 불량률·측정값·설비 Parameter 변화 확인',needs:'시간순 연속 데이터'},
        {id:'spc',category:'데이터 분석',name:'SPC 관리도',desc:'공정의 우연변동과 이상원인을 관리한계 기준으로 구분',needs:'충분한 시계열 표본과 관리 기준'},
        {id:'distribution',category:'데이터 분석',name:'Histogram / Box Plot',desc:'정상·불량 LOT 또는 설비 간 평균과 산포를 비교',needs:'수치형 측정 원본'},
        {id:'correlation',category:'데이터 분석',name:'산점도 / 상관분석',desc:'공정조건과 불량률·측정값 사이의 연관 패턴 확인',needs:'짝을 이룬 두 개 이상의 수치 변수'},
        {id:'statistics',category:'데이터 분석',name:'가설검정 / ANOVA / 회귀',desc:'그룹 간 차이와 변수 영향이 통계적으로 유의한지 검증',needs:'표본수와 분포조건을 만족하는 원시 데이터'},
        {id:'genealogy',category:'반도체·외주',name:'LOT Genealogy',desc:'Wafer·Assembly·Test·당사 입고·고객 출하 LOT 연결관계 추적',needs:'외주 Trace, CoA, Packing/입고 이력'},
        {id:'wafer-bin-map',category:'반도체·외주',name:'Wafer Map / Bin Map',desc:'Edge·Center·Ring·Die 위치·특정 Bin 집중 패턴 탐색',needs:'Wafer 좌표 또는 Test Bin 데이터'},
        {id:'cross-swap',category:'반도체·외주',name:'Cross / Swap Test',desc:'제품·Board·Socket·Program·자재를 교환하여 원인 위치 분리',needs:'정상/불량 비교시료와 교환 시험'},
        {id:'reproduction',category:'반도체·외주',name:'재현시험',desc:'의심 조건의 투입·제거를 반복해 동일 Failure Mode 재현',needs:'시험조건, 반복수, 대조군'},
        {id:'physical-fa',category:'반도체·외주',name:'Physical FA Tree',desc:'외관·X-ray·SAT·Decap·SEM/EDS·Cross Section 결과를 단계적으로 연결',needs:'시료정보와 공인 분석 성적서'},
        {id:'shainin',category:'반도체·외주',name:'Shainin 기법',desc:'Paired Comparison·Component Search·Multi-Vari로 핵심 변수를 압축',needs:'Best/Worst 시료와 비교 가능한 변수'},
        {id:'test-coverage',category:'유출원인',name:'검사 Coverage 분석',desc:'해당 Failure Mode를 어느 검사에서 어떤 조건으로 검출해야 했는지 확인',needs:'검사 Flow, 항목, 조건, 검출능력'},
        {id:'test-limit',category:'유출원인',name:'Test Limit / Guard Band',desc:'정상·불량 분포와 Spec/Test Limit 사이 False Pass 영역 확인',needs:'측정 원본, Limit, 고객 사용조건'},
        {id:'msa',category:'유출원인',name:'MSA / Gage R&R',desc:'장비·검사자·반복측정 변동과 불량 구분 능력 평가',needs:'반복·재현 측정 데이터'},
        {id:'sampling-risk',category:'유출원인',name:'Sampling Risk / AQL',desc:'샘플링 검사에서 Lot Accept 및 Escape 확률 평가',needs:'검사수량, AQL, 허용불량 기준'},
        {id:'fmea-gap',category:'유출·시스템',name:'PFMEA / Control Plan Gap',desc:'Failure Mode의 예방·검출 관리 누락과 실제 작업 불일치 확인',needs:'PFMEA, Control Plan, 작업표준, Audit 결과'}
      ];
    }

    function ensureD4Structure(c) {
      c.d4 = c.d4 || {};
      const d4 = c.d4;
      d4.faMatrix = Array.isArray(d4.faMatrix) ? d4.faMatrix : [];
      d4.occurrence5Why = Array.isArray(d4.occurrence5Why) ? d4.occurrence5Why : [];
      d4.escape5Why = Array.isArray(d4.escape5Why) ? d4.escape5Why : [];
      d4.candidateCauses = Array.isArray(d4.candidateCauses) ? d4.candidateCauses : [];
      d4.analysisProfile = d4.analysisProfile || {failureMode:'unknown',pattern:'unknown',dataScope:'limited',productionModel:'outsourced',escapeConcern:'unknown'};
      d4.recommendations = Array.isArray(d4.recommendations) ? d4.recommendations : [];
      d4.selectedTools = Array.isArray(d4.selectedTools) ? d4.selectedTools : [];
      const legacyCause = type => d4.candidateCauses.find(row => String(row.type || '').toLowerCase().includes(type.toLowerCase()));
      const makeCause = (type, legacy) => ({type,statement:legacy?.title || '',evidence:(legacy?.supportingEvidence || []).join(', '),contraryEvidence:legacy?.contradictingEvidence || '',validationMethod:'',status:legacy?.status === 'Confirmed' ? 'Confirmed' : 'Candidate',checks:{reproduced:false,removed:false,boundary:false,evidence:false}});
      d4.rootCauses = d4.rootCauses || {};
      d4.rootCauses.Occurrence = {...makeCause('Occurrence',legacyCause('occurrence')),...(d4.rootCauses.Occurrence || {})};
      d4.rootCauses.Escape = {...makeCause('Escape',legacyCause('escape')),...(d4.rootCauses.Escape || {})};
      d4.rootCauses.System = {...makeCause('System',legacyCause('system')),...(d4.rootCauses.System || {})};
      ['Occurrence','Escape','System'].forEach(type => { d4.rootCauses[type].checks = {reproduced:false,removed:false,boundary:false,evidence:false,...(d4.rootCauses[type].checks || {})}; });
      d4.approval = d4.approval || {status:'Draft',humanConfirmed:false};
      return d4;
    }

    function buildD4ToolRecommendations(d4) {
      const p=d4.analysisProfile; const scores={}; const reasons={};
      const add=(id,score,reason)=>{scores[id]=(scores[id]||0)+score; reasons[id]=reasons[id] ? `${reasons[id]} · ${reason}` : reason;};
      D4_CORE_TOOL_IDS.forEach((id,idx)=>add(id,100-idx,idx===0?'모든 D4의 시간 기준선 확보':'D4 필수 원인분석 흐름'));
      if (p.failureMode==='electrical' || p.failureMode==='functional') { add('fta',30,'전기·기능 고장의 복수 경로 분해'); add('cross-swap',28,'제품/Board/Test 조건 분리'); add('test-limit',26,'False Pass 가능성 확인'); }
      if (p.failureMode==='physical') { add('physical-fa',34,'물리적 고장 메커니즘 입증'); add('genealogy',27,'동일 자재·공정 노출 LOT 추적'); add('reproduction',25,'파손 조건 재현'); }
      if (p.failureMode==='reliability') { add('run-chart',29,'시간·Stress 누적 변화 확인'); add('reproduction',28,'가속조건 재현'); add('fta',24,'복합 열화 경로 분해'); }
      if (p.pattern==='intermittent') { add('fta',32,'간헐 고장의 조건 조합 분석'); add('cross-swap',30,'간헐 발생 위치 분리'); add('reproduction',29,'Trigger 조건 확인'); }
      if (p.pattern==='lot-cluster' || p.pattern==='multiple') { add('stratification',34,'조건별 집중도 비교'); add('genealogy',32,'공통 투입요소 추적'); add('pareto',26,'주요 Failure Mode 우선순위화'); }
      if (p.dataScope==='continuous') { add('run-chart',32,'시계열 변화점 탐색'); add('spc',28,'이상변동 판단'); add('distribution',24,'정상/불량 분포 비교'); }
      if (p.dataScope==='map') { add('wafer-bin-map',38,'좌표·Bin 공간 패턴 확인'); add('stratification',28,'Wafer·Tester별 층별 비교'); }
      if (p.productionModel==='outsourced' || p.productionModel==='mixed') { add('genealogy',70,'외주 Assembly/Test Trace 연결'); add('fmea-gap',22,'외주 관리·변경통제 누락 확인'); }
      if (p.escapeConcern==='yes') { add('test-coverage',70,'미검출 검사 단계 확인'); add('test-limit',34,'Limit/Guard Band 검토'); add('msa',26,'측정시스템 검출력 확인'); add('fmea-gap',24,'관리계획 누락 확인'); }
      const adaptive=Object.keys(scores).filter(id=>!D4_CORE_TOOL_IDS.includes(id)).sort((a,b)=>scores[b]-scores[a]).slice(0,4);
      return [...D4_CORE_TOOL_IDS,...adaptive].map(id=>({id,priority:D4_CORE_TOOL_IDS.includes(id)?'필수':'AI 추천',reason:reasons[id]}));
    }

    function getD4ToolById(id) { return getD4ToolCatalog().find(tool=>tool.id===id); }

    function renderD4QualityWorkspace(c) {
      const d4=ensureD4Structure(c); const catalog=getD4ToolCatalog();
      if (!d4.recommendations.length) d4.recommendations=buildD4ToolRecommendations(d4);
      const selectedIds=d4.selectedTools.map(row=>row.id); const approved=d4.approval.status==='Approved'&&d4.approval.humanConfirmed;
      const recommendationRows=d4.recommendations.map(rec=>{ const tool=getD4ToolById(rec.id); return `<div class="d4-recommend-row"><span class="d4-priority ${rec.priority==='필수'?'core':'adaptive'}">${rec.priority}</span><div><strong>${tool?.name||rec.id}</strong><span>${rec.reason}</span></div><span class="d4-tool-state">${selectedIds.includes(rec.id)?'적용됨':'대기'}</span></div>`; }).join('');
      const groups=[...new Set(catalog.map(tool=>tool.category))].map(category=>`<details class="d4-library-group"><summary>${category}<span>${catalog.filter(tool=>tool.category===category).length}개</span></summary><div class="d4-library-grid">${catalog.filter(tool=>tool.category===category).map(tool=>`<div class="d4-library-item"><div><strong>${tool.name}</strong><p>${tool.desc}</p><small>필요자료 · ${tool.needs}</small></div><button type="button" class="btn btn-secondary btn-sm" onclick="addD4Tool('${tool.id}')" ${selectedIds.includes(tool.id)?'disabled':''}>${selectedIds.includes(tool.id)?'적용됨':'추가'}</button></div>`).join('')}</div></details>`).join('');
      return `<form id="d4QualityForm" onsubmit="return false;">
        <div class="quality-boundary-note d4-boundary"><strong>AI는 원인 후보와 분석 도구를 추천할 뿐 Root Cause를 확정하지 않습니다.</strong><span>발생·유출·시스템 원인을 각각 Evidence와 검증시험으로 입증한 후 품질 담당자가 승인합니다.</span></div>
        <div class="card quality-stage-card d4-selector-panel">
          <div class="quality-tool-head inline-head"><div><span class="quality-tool-kicker">D4 · AI QUALITY TOOL SELECTOR</span><h3>Case 특성 기반 분석 도구 선정</h3><p>생산형태와 불량 패턴, 확보 데이터 수준에 따라 필수 도구와 선택형 도구를 조합합니다.</p></div><button type="button" class="btn btn-primary" onclick="recommendD4Tools()"><i data-lucide="sparkles"></i> AI 추천 다시 계산</button></div>
          <div class="d4-profile-grid">
            <label><span>불량 유형</span><select class="form-control" name="d4FailureMode"><option value="unknown" ${d4.analysisProfile.failureMode==='unknown'?'selected':''}>미확정</option><option value="electrical" ${d4.analysisProfile.failureMode==='electrical'?'selected':''}>전기적 불량</option><option value="functional" ${d4.analysisProfile.failureMode==='functional'?'selected':''}>기능 불량</option><option value="physical" ${d4.analysisProfile.failureMode==='physical'?'selected':''}>외관·물리적 불량</option><option value="reliability" ${d4.analysisProfile.failureMode==='reliability'?'selected':''}>신뢰성·열화 불량</option><option value="process" ${d4.analysisProfile.failureMode==='process'?'selected':''}>공정 변동</option></select></label>
            <label><span>발생 패턴</span><select class="form-control" name="d4Pattern"><option value="unknown" ${d4.analysisProfile.pattern==='unknown'?'selected':''}>미확정</option><option value="single" ${d4.analysisProfile.pattern==='single'?'selected':''}>단발</option><option value="intermittent" ${d4.analysisProfile.pattern==='intermittent'?'selected':''}>간헐</option><option value="lot-cluster" ${d4.analysisProfile.pattern==='lot-cluster'?'selected':''}>특정 LOT 집중</option><option value="trend" ${d4.analysisProfile.pattern==='trend'?'selected':''}>시간 추세</option><option value="multiple" ${d4.analysisProfile.pattern==='multiple'?'selected':''}>복수 Mode</option></select></label>
            <label><span>확보 데이터</span><select class="form-control" name="d4DataScope"><option value="none" ${d4.analysisProfile.dataScope==='none'?'selected':''}>거의 없음</option><option value="limited" ${d4.analysisProfile.dataScope==='limited'?'selected':''}>성적서·요약자료</option><option value="lot" ${d4.analysisProfile.dataScope==='lot'?'selected':''}>LOT별 데이터</option><option value="continuous" ${d4.analysisProfile.dataScope==='continuous'?'selected':''}>연속 측정 원본</option><option value="map" ${d4.analysisProfile.dataScope==='map'?'selected':''}>Wafer/Bin Map</option></select></label>
            <label><span>생산 형태</span><select class="form-control" name="d4ProductionModel"><option value="outsourced" ${d4.analysisProfile.productionModel==='outsourced'?'selected':''}>Assembly·Test 외주</option><option value="mixed" ${d4.analysisProfile.productionModel==='mixed'?'selected':''}>내부+외주 혼합</option><option value="internal" ${d4.analysisProfile.productionModel==='internal'?'selected':''}>사내 생산</option></select></label>
            <label><span>검사 유출 의심</span><select class="form-control" name="d4EscapeConcern"><option value="unknown" ${d4.analysisProfile.escapeConcern==='unknown'?'selected':''}>미확정</option><option value="yes" ${d4.analysisProfile.escapeConcern==='yes'?'selected':''}>있음</option><option value="no" ${d4.analysisProfile.escapeConcern==='no'?'selected':''}>낮음</option></select></label>
          </div>
          <div class="d4-recommend-board">${recommendationRows}</div>
          <div class="d4-selector-actions"><button type="button" class="btn btn-primary" onclick="applyD4Recommendations()"><i data-lucide="wand-sparkles"></i> 추천 도구 작업대에 적용</button><span>핵심 5개 + Case 특화 최대 4개</span></div>
        </div>

        <div class="card quality-stage-card">
          <div class="quality-tool-head"><span class="quality-tool-kicker">ACTIVE ANALYSIS WORKBENCH</span><h3>선택된 품질도구 · ${d4.selectedTools.length}개</h3><p>가설과 Evidence, 분석결과를 입력하고 사실 검증을 완료하세요. 선택 도구가 없으면 위 추천을 적용합니다.</p></div>
          <div class="d4-active-stack">${d4.selectedTools.length?d4.selectedTools.map((row,idx)=>renderD4ActiveTool(row,idx)).join(''):'<div class="quality-empty-row">아직 적용된 품질도구가 없습니다. AI 추천을 적용하거나 라이브러리에서 추가하세요.</div>'}</div>
        </div>

        <div class="card quality-stage-card d4-library-panel">
          <div class="quality-tool-head"><span class="quality-tool-kicker">QUALITY TOOL LIBRARY · 25</span><h3>추가 분석 도구</h3><p>AI 추천 외에도 CFT 판단에 따라 필요한 도구를 추가할 수 있습니다.</p></div>${groups}
        </div>

        ${d4.faMatrix.length?`<div class="card quality-stage-card"><div class="quality-tool-head"><span class="quality-tool-kicker">LEGACY / RECEIVED FA EVIDENCE</span><h3>기존 FA 분석자료</h3></div><div class="quality-table-wrap"><table class="custom-table"><thead><tr><th>분석</th><th>시료</th><th>기관</th><th>결과</th><th>증거</th></tr></thead><tbody>${d4.faMatrix.map(fa=>`<tr><td>${fa.test}</td><td>${fa.sample}</td><td>${fa.lab}</td><td>${fa.result}</td><td class="num-mono">${fa.evidenceId}</td></tr>`).join('')}</tbody></table></div></div>`:''}

        <div class="card quality-stage-card d4-cause-gate">
          <div class="quality-tool-head"><span class="quality-tool-kicker">ROOT CAUSE PROOF GATE</span><h3>발생·유출·시스템 원인 분리 확정</h3><p>세 원인을 각각 기술하고 인과관계 4개 기준을 모두 확인해야 D4를 승인할 수 있습니다.</p></div>
          <div class="d4-cause-grid">${['Occurrence','Escape','System'].map(type=>renderD4CauseLane(type,d4.rootCauses[type])).join('')}</div>
          <label class="quality-human-check"><input type="checkbox" name="d4HumanConfirmed" ${approved?'checked':''}><span><strong>D4 원인 검토 완료</strong> · AI 추천이 아닌 CFT 시험결과와 원본 Evidence를 확인했으며 발생·유출·시스템 원인을 승인합니다.</span></label>
          <div class="quality-stage-actions"><button type="button" class="btn btn-secondary" onclick="saveD4Analysis(false)">임시 저장</button><button type="button" class="btn btn-primary" onclick="saveD4Analysis(true)"><i data-lucide="badge-check"></i> D4 근본원인 승인</button></div>
        </div>
      </form>`;
    }

    function renderD4ActiveTool(row,idx) {
      const tool=getD4ToolById(row.id)||{name:row.id,category:'기타',desc:'',needs:''};
      return `<section class="d4-active-tool ${row.verified?'verified':''}"><header><div><span>${tool.category}</span><h4>${tool.name}</h4><p>${tool.desc}</p></div><div class="d4-tool-actions"><span class="d4-tool-state">${row.source==='AI'?'AI 추천':'CFT 추가'}</span><button type="button" class="icon-danger-btn" onclick="removeD4Tool(${idx})" title="도구 제외"><i data-lucide="trash-2"></i></button></div></header><div class="d4-tool-form"><label><span>분석 목적·가설 *</span><textarea class="form-control" name="d4ToolHypothesis${idx}" placeholder="이 도구로 무엇을 확인하거나 기각할 것인지">${escapeWorkspaceValue(row.hypothesis)}</textarea></label><label><span>연결 Evidence *</span><textarea class="form-control" name="d4ToolEvidence${idx}" placeholder="파일명, 성적서 번호, 원시데이터 위치">${escapeWorkspaceValue(row.evidence)}</textarea></label><label class="wide"><span>분석 결과·해석 *</span><textarea class="form-control" name="d4ToolFinding${idx}" placeholder="관찰된 사실과 가설에 대한 결론을 구분해서 작성">${escapeWorkspaceValue(row.finding)}</textarea></label><label><span>담당자</span><input class="form-control" name="d4ToolOwner${idx}" value="${escapeWorkspaceValue(row.owner)}" placeholder="분석 담당"></label><label><span>상태</span><select class="form-control" name="d4ToolStatus${idx}">${['Planned','Testing','Rejected','Supported','Confirmed'].map(status=>`<option value="${status}" ${row.status===status?'selected':''}>${status}</option>`).join('')}</select></label></div><footer><small>필요자료 · ${tool.needs}</small><label class="row-verify-control"><input type="checkbox" name="d4ToolVerified${idx}" ${row.verified?'checked':''}><span>Evidence와 결과 사실 확인</span></label></footer></section>`;
    }

    function renderD4CauseLane(type,cause) {
      const meta={Occurrence:['발생원인','왜 불량이 만들어졌는가','#38bdf8'],Escape:['유출원인','왜 검사에서 발견하지 못했는가','#c084fc'],System:['시스템원인','왜 관리체계가 예방하지 못했는가','#f59e0b']}[type]; const checks=cause.checks||{};
      return `<section class="d4-cause-lane" style="--lane-color:${meta[2]}"><header><span>${type.toUpperCase()}</span><h4>${meta[0]}</h4><p>${meta[1]}</p></header><label><span>원인 문장 *</span><textarea class="form-control" name="d4CauseStatement${type}">${escapeWorkspaceValue(cause.statement)}</textarea></label><label><span>입증 Evidence *</span><textarea class="form-control" name="d4CauseEvidence${type}">${escapeWorkspaceValue(cause.evidence)}</textarea></label><label><span>반대 Evidence·기각 가설</span><textarea class="form-control" name="d4CauseContrary${type}">${escapeWorkspaceValue(cause.contraryEvidence)}</textarea></label><label><span>검증 방법·결과 *</span><textarea class="form-control" name="d4CauseValidation${type}" placeholder="재현시험, 제거시험, 통계검정 등">${escapeWorkspaceValue(cause.validationMethod)}</textarea></label><label><span>판정</span><select class="form-control" name="d4CauseStatus${type}">${['Candidate','Testing','Supported','Confirmed'].map(status=>`<option ${cause.status===status?'selected':''}>${status}</option>`).join('')}</select></label><div class="d4-proof-checks"><label><input type="checkbox" name="d4CheckReproduced${type}" ${checks.reproduced?'checked':''}> 원인 투입 시 재현 또는 동등 검증</label><label><input type="checkbox" name="d4CheckRemoved${type}" ${checks.removed?'checked':''}> 원인 제거 시 불량 제거</label><label><input type="checkbox" name="d4CheckBoundary${type}" ${checks.boundary?'checked':''}> IS / IS NOT 경계 설명</label><label><input type="checkbox" name="d4CheckEvidence${type}" ${checks.evidence?'checked':''}> 원본 Evidence 확인</label></div></section>`;
    }

    function captureD4Form(c) {
      const d4=ensureD4Structure(c); const form=document.getElementById('d4QualityForm'); if(!form)return d4;
      d4.analysisProfile={failureMode:form.elements.d4FailureMode?.value||'unknown',pattern:form.elements.d4Pattern?.value||'unknown',dataScope:form.elements.d4DataScope?.value||'limited',productionModel:form.elements.d4ProductionModel?.value||'outsourced',escapeConcern:form.elements.d4EscapeConcern?.value||'unknown'};
      d4.selectedTools=d4.selectedTools.map((row,idx)=>({...row,hypothesis:form.elements[`d4ToolHypothesis${idx}`]?.value?.trim()||'',evidence:form.elements[`d4ToolEvidence${idx}`]?.value?.trim()||'',finding:form.elements[`d4ToolFinding${idx}`]?.value?.trim()||'',owner:form.elements[`d4ToolOwner${idx}`]?.value?.trim()||'',status:form.elements[`d4ToolStatus${idx}`]?.value||'Planned',verified:Boolean(form.elements[`d4ToolVerified${idx}`]?.checked)}));
      ['Occurrence','Escape','System'].forEach(type=>{d4.rootCauses[type]={type,statement:form.elements[`d4CauseStatement${type}`]?.value?.trim()||'',evidence:form.elements[`d4CauseEvidence${type}`]?.value?.trim()||'',contraryEvidence:form.elements[`d4CauseContrary${type}`]?.value?.trim()||'',validationMethod:form.elements[`d4CauseValidation${type}`]?.value?.trim()||'',status:form.elements[`d4CauseStatus${type}`]?.value||'Candidate',checks:{reproduced:Boolean(form.elements[`d4CheckReproduced${type}`]?.checked),removed:Boolean(form.elements[`d4CheckRemoved${type}`]?.checked),boundary:Boolean(form.elements[`d4CheckBoundary${type}`]?.checked),evidence:Boolean(form.elements[`d4CheckEvidence${type}`]?.checked)}};});
      return d4;
    }

    function recommendD4Tools() { const c=getActiveCase(); const d4=captureD4Form(c); d4.recommendations=buildD4ToolRecommendations(d4); d4.approval={status:'Draft',humanConfirmed:false}; saveAppData(); renderCurrentView(); }
    function applyD4Recommendations() { const c=getActiveCase(); const d4=captureD4Form(c); d4.recommendations=buildD4ToolRecommendations(d4); d4.recommendations.forEach(rec=>{if(!d4.selectedTools.some(row=>row.id===rec.id))d4.selectedTools.push({id:rec.id,source:'AI',hypothesis:'',evidence:'',finding:'',owner:'',status:'Planned',verified:false});}); d4.approval={status:'Draft',humanConfirmed:false}; saveAppData(); renderCurrentView(); }
    function addD4Tool(id) { const c=getActiveCase(); const d4=captureD4Form(c); if(!getD4ToolById(id)||d4.selectedTools.some(row=>row.id===id))return; d4.selectedTools.push({id,source:'CFT',hypothesis:'',evidence:'',finding:'',owner:'',status:'Planned',verified:false}); d4.approval={status:'Draft',humanConfirmed:false}; saveAppData(); renderCurrentView(); }
    function removeD4Tool(idx) { const c=getActiveCase(); const d4=captureD4Form(c); d4.selectedTools.splice(idx,1); d4.approval={status:'Draft',humanConfirmed:false}; saveAppData(); renderCurrentView(); }
    function isD4StageComplete(c) { return c.d4?.approval?.status==='Approved'&&c.d4?.approval?.humanConfirmed===true; }

    function saveD4Analysis(approve) {
      const c=getActiveCase(); const d4=captureD4Form(c); const form=document.getElementById('d4QualityForm');
      if(!approve){d4.approval={status:'Draft',humanConfirmed:false,savedAt:new Date().toISOString().replace('T',' ').slice(0,16)};saveAppData();alert('D4 분석 내용이 임시 저장되었습니다.');renderCurrentView();return;}
      if(!isD3StageComplete(c)){alert('D4 승인 전 D3 봉쇄 범위와 효과성 승인이 필요합니다.');return;}
      const ids=d4.selectedTools.map(row=>row.id); if(D4_CORE_TOOL_IDS.some(id=>!ids.includes(id))){alert('D4 필수 도구 5개(타임라인·Process Flow·Change Point·Fishbone·3-Track 5 Why)를 적용해 주세요.');return;}
      if(d4.selectedTools.some(row=>!row.hypothesis||!row.evidence||!row.finding||!row.owner||row.status==='Planned'||row.status==='Testing'||!row.verified)){alert('선택한 모든 품질도구의 가설·Evidence·결과·담당자·판정을 작성하고 사실 확인해 주세요.');return;}
      const incomplete=['Occurrence','Escape','System'].some(type=>{const root=d4.rootCauses[type];return !root.statement||!root.evidence||!root.validationMethod||root.status!=='Confirmed'||Object.values(root.checks||{}).some(value=>!value);});
      if(incomplete){alert('발생·유출·시스템 원인 각각의 문장·Evidence·검증결과와 인과관계 4개 기준을 모두 충족해 주세요.');return;}
      if(!form?.elements.d4HumanConfirmed?.checked){alert('[D4 원인 검토 완료]에 체크해 주세요.');return;}
      d4.candidateCauses=['Occurrence','Escape','System'].map((type,idx)=>({id:`RC-${String(idx+1).padStart(2,'0')}`,type,title:d4.rootCauses[type].statement,status:'Confirmed',supportingEvidence:d4.rootCauses[type].evidence.split(',').map(v=>v.trim()).filter(Boolean),contradictingEvidence:d4.rootCauses[type].contraryEvidence||'반대 Evidence 없음',missingEvidence:'없음 · 인과관계 Gate 확인'}));
      d4.approval={status:'Approved',humanConfirmed:true,approvedAt:new Date().toISOString().replace('T',' ').slice(0,16),approvedBy:{name:CURRENT_USER.name,dept:CURRENT_USER.dept,email:CURRENT_USER.email}}; c.currentStage='D4'; saveAppData(); alert('D4 발생·유출·시스템 근본원인이 승인되었습니다. D5 영구대책을 시작할 수 있습니다.'); renderCurrentView();
    }

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
        const d4 = ensureD4Structure(c);
        const verifiedTools = d4.selectedTools.filter(row => row.verified).length;
        const confirmedCauses = ['Occurrence','Escape','System'].filter(type => d4.rootCauses[type]?.status === 'Confirmed').length;
        checks.push({
          type: isD4StageComplete(c) ? 'success' : 'warning',
          title: isD4StageComplete(c) ? 'D4 Root Cause 사람 승인 완료' : 'D4 분석 증거 Gate 진행 중',
          desc: `선택 도구 ${d4.selectedTools.length}개 중 ${verifiedTools}개 Evidence 확인 · 발생/유출/시스템 원인 ${confirmedCauses}/3개 Confirmed.`
        });
        checks.push({
          type: 'info',
          title: 'AI 품질도구 선택 원칙',
          desc: '타임라인·Process Flow·Change Point·Fishbone·3-Track 5 Why는 필수이며 Case 특성에 따라 최대 4개 도구를 추가 추천합니다.'
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
