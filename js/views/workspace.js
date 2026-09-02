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
              ${renderD1RACIMatrix(c)}
            </div>
          `;

        case 'D2':
          return renderD2QualityWorkspace(c);

        case 'D3':
          return renderD3QualityWorkspace(c);

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
            <div class="quality-tool-head inline-head"><div><span class="quality-tool-kicker">QUALITY TOOL · IS / IS NOT</span><h3>문제의 경계 비교</h3><p>발생 대상과 유사하지만 발생하지 않은 대상을 비교합니다.</p></div><button type="button" class="btn btn-secondary btn-sm" onclick="addD2IsIsNotRow()"><i data-lucide="plus" style="width:13px;height:13px;"></i> 비교행 추가</button></div>
            <div class="quality-table-wrap"><table class="custom-table quality-edit-table"><thead><tr><th>구분</th><th class="is-col">IS · 발생함</th><th class="isnot-col">IS NOT · 발생하지 않음</th><th>차이/특이점</th><th>관리</th></tr></thead><tbody>
              ${d2.isIsNot.length ? d2.isIsNot.map((row, idx) => `<tr>
                <td><input class="form-control" name="d2Factor${idx}" value="${escapeWorkspaceValue(row.factor)}" placeholder="제품/LOT/공정"></td>
                <td><input class="form-control" name="d2Is${idx}" value="${escapeWorkspaceValue(row.is)}" placeholder="발생 대상"></td>
                <td><input class="form-control" name="d2IsNot${idx}" value="${escapeWorkspaceValue(row.isNot)}" placeholder="비발생 비교대상"></td>
                <td><input class="form-control" name="d2Difference${idx}" value="${escapeWorkspaceValue(row.difference)}" placeholder="확인된 차이"></td>
                <td><button type="button" class="icon-danger-btn" onclick="removeD2IsIsNotRow(${idx})"><i data-lucide="trash-2"></i></button></td>
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
        difference: form.elements[`d2Difference${idx}`]?.value?.trim() || ''
      }));
      return d2;
    }

    function addD2IsIsNotRow() {
      const c = getActiveCase();
      const d2 = captureD2Form(c);
      d2.isIsNot.push({ factor:'', is:'', isNot:'', difference:'' });
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
      return c.d3;
    }

    function renderD3QualityWorkspace(c) {
      const d3 = ensureD3Structure(c);
      const approved = isD3StageComplete(c);
      return `
        <form id="d3QualityForm" onsubmit="event.preventDefault()">
          <div class="card quality-stage-card">
            <div class="card-header"><div class="card-title"><i data-lucide="radar" style="color:#f59e0b;width:16px;height:16px;"></i> D3. 영향 LOT 및 봉쇄 범위</div><span class="quality-gate-state ${approved ? 'is-complete' : ''}">${approved ? '봉쇄 승인 완료' : '범위 확인 필요'}</span></div>
            <div class="quality-boundary-note danger"><strong>D3는 원인 제거가 아니라 추가 유출 차단 단계입니다.</strong><span>원인 확정 전에도 의심 범위를 보수적으로 Hold하고, 안전성이 입증된 제품만 Release합니다.</span></div>
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
      const areas = ['1. 원자재/협력사','2. 입고검사/원자재 창고','3. 공정 재공품(WIP)','4. 완제품 창고','5. 출하 대기/운송 중','6. 고객 창고','7. 고객 생산라인'];
      d3.materialFlow = areas.map(area => ({area,lot:c.lotNumber,totalQty:0,holdQty:0,screenQty:0,ngQty:0,status:'미확인',evidence:''}));
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
      const scope=d3.lotScope; if (!scope.affectedLot || !scope.adjacentLots || !scope.rawMaterialBatch || !scope.equipment || !scope.rationale) { alert('LOT 영향 범위와 선정 근거를 모두 입력해 주세요.'); return; }
      if (d3.materialFlow.length !== 7 || d3.materialFlow.some(row => !row.area || !row.lot || row.status === '미확인' || !row.evidence || row.holdQty > row.totalQty || row.screenQty > row.totalQty)) { alert('7개 Material Flow 영역의 수량·상태·Evidence를 확인해 주세요. Hold/선별 수량은 총수량을 초과할 수 없습니다.'); return; }
      if (!d3.actions.length || d3.actions.some(row => !row.target || !row.action || !row.owner || !row.due || row.status !== 'Completed' || !row.result)) { alert('봉쇄조치를 한 개 이상 등록하고 담당자·기한·완료상태·결과 Evidence를 완성해 주세요.'); return; }
      if (['noAdditionalClaim','lineStable','stockReconciled'].some(key => d3.effectiveness[key] !== 'yes') || !d3.effectiveness.verificationEvidence || !d3.effectivenessStatement) { alert('봉쇄 효과성 3개 항목과 검증 Evidence·결론을 모두 충족해 주세요.'); return; }
      if (!form?.elements.humanConfirmed?.checked) { alert('[봉쇄 검토 완료]에 체크해 주세요.'); return; }
      d3.approval={status:'Approved',humanConfirmed:true,approvedAt:new Date().toISOString().replace('T',' ').slice(0,16),approvedBy:{name:CURRENT_USER.name,dept:CURRENT_USER.dept,email:CURRENT_USER.email}};
      c.currentStage='D3'; saveAppData(); alert('D3 긴급 봉쇄조치가 승인되었습니다. D4 원인분석을 시작할 수 있습니다.'); renderCurrentView();
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
