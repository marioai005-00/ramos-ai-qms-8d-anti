/* SIDEBAR TAB SWITCHING & EXACT FOLDER ORG TREE RENDER                      */
    /* ========================================================================= */
    function switchSidebarTab(tabName) {
      appData.sidebarTab = tabName;
      document.getElementById('tabBtnMenu').className = `sidebar-tab-btn ${tabName === 'menu' ? 'active' : ''}`;
      document.getElementById('tabBtnOrg').className = `sidebar-tab-btn ${tabName === 'org' ? 'active' : ''}`;
      
      document.getElementById('sidebarMenuView').style.display = tabName === 'menu' ? 'block' : 'none';
      document.getElementById('sidebarOrgView').style.display = tabName === 'org' ? 'block' : 'none';

      if (tabName === 'org') {
        renderOrgTree();
      }
    }

    // Tree Node Open/Closed State Cache
    let orgOpenNodes = {
      'root': true,
      'ceo': true,
      'coo': true,
      'mfg_center': true,
      'goc': true,
      'strat_mkt': true,
      'sales_div': true,
      'rnd': true,
      'dram_div': true,
      'flash_div': true,
      'strat_mgmt': true
    };

    function toggleTreeNode(nodeId, e) {
      if (e) e.stopPropagation();
      orgOpenNodes[nodeId] = !orgOpenNodes[nodeId];
      renderOrgTree(document.getElementById('orgSearchInput')?.value || '');
    }

    function expandAllOrgTree(expand) {
      function traverse(nodes) {
        nodes.forEach(n => {
          orgOpenNodes[n.id] = expand;
          if (n.children) traverse(n.children);
        });
      }
      orgOpenNodes['root'] = expand;
      traverse(RAMOS_TREE);
      renderOrgTree(document.getElementById('orgSearchInput')?.value || '');
    }

    function countTotalMembersInNode(node) {
      let cnt = (node.members || []).length;
      if (node.children) {
        node.children.forEach(c => cnt += countTotalMembersInNode(c));
      }
      return cnt;
    }

    function renderOrgTree(searchQuery = '') {
      const container = document.getElementById('orgTreeContainer');
      const q = searchQuery.toLowerCase().trim();

      // Top controls
      let html = `
        <div class="org-tree-controls">
          <span style="font-weight:700; color:#94a3b8;">조직 계통도 (총 62명)</span>
          <div style="display:flex; gap:4px;">
            <button class="btn btn-secondary btn-sm" style="padding:1px 5px; font-size:0.62rem;" onclick="expandAllOrgTree(true)">+ 전체 펼치기</button>
            <button class="btn btn-secondary btn-sm" style="padding:1px 5px; font-size:0.62rem;" onclick="expandAllOrgTree(false)">- 전체 접기</button>
          </div>
        </div>
      `;

      function renderNode(node, isRoot = false) {
        const isOpen = q ? true : !!orgOpenNodes[node.id];
        const totalMembers = countTotalMembersInNode(node);
        const hasChildren = node.children && node.children.length > 0;
        const hasMembers = node.members && node.members.length > 0;

        // Filter check
        const matchesName = node.name.toLowerCase().includes(q);
        const filteredMembers = (node.members || []).filter(m => 
          !q || m.name.toLowerCase().includes(q) || (m.position && m.position.toLowerCase().includes(q)) || (m.email && m.email.toLowerCase().includes(q))
        );

        let childrenHtml = '';
        if (hasChildren) {
          childrenHtml = node.children.map(c => renderNode(c, false)).join('');
        }

        if (q && !matchesName && filteredMembers.length === 0 && !childrenHtml) {
          return '';
        }

        return `
          <div class="tree-node-item ${isRoot ? 'root-level' : ''}">
            <div class="tree-row" onclick="toggleTreeNode('${node.id}', event)">
              <div class="tree-toggle-box">
                ${(hasChildren || hasMembers) ? (isOpen ? '−' : '+') : '•'}
              </div>
              <i data-lucide="${isOpen ? 'folder-open' : 'folder'}" class="tree-folder-icon"></i>
              <span class="tree-node-name">${node.name}</span>
              <span class="tree-member-badge num-mono">${totalMembers}명</span>
            </div>

            ${isOpen ? `
              <div class="tree-children-container">
                <!-- Direct Node Members -->
                ${(q ? filteredMembers : (node.members || [])).length > 0 ? `
                  <div class="tree-members-container">
                    ${(q ? filteredMembers : node.members).map(m => `
                      <div class="org-user-card ${m.isMe ? 'is-me' : ''}">
                        <div class="org-avatar ${m.isMe ? 'me' : ''}">
                          ${m.name.length > 2 ? m.name.slice(-2) : m.name}
                        </div>
                        <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:2px;">
                          <div style="font-size:0.82rem; font-weight:700; color:#f8fafc; line-height:1.2;">
                            ${m.name} ${m.isMe ? `<span class="badge-me" style="font-size:0.6rem; padding:0 4px; border-radius:3px;">나</span>` : ''}
                          </div>
                          <div style="font-size:0.72rem; color:#94a3b8; line-height:1.2;">
                            ${m.position || 'Pro'}
                          </div>
                          <div class="num-mono" style="font-size:0.68rem; color:#60a5fa; line-height:1.2; word-break:break-all;">
                            ${m.email}
                          </div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}

                <!-- Sub-folders -->
                ${childrenHtml}
              </div>
            ` : ''}
          </div>
        `;
      }

      // Root level: 회사구분 > 라모스테크놀러지
      const rootNode = {
        id: 'root',
        name: '라모스테크놀러지',
        children: RAMOS_TREE,
        members: []
      };

      html += `<div class="folder-tree-root">${renderNode(rootNode, true)}</div>`;
      container.innerHTML = html;
      lucide.createIcons();
    }

    function filterOrgTree(val) {
      renderOrgTree(val);
    }

    function assignOrgMemberToCFT(name, position, dept, email) {
      const c = getActiveCase();
      const existing = c.team.find(t => t.name.includes(name));
      if (existing) {
        alert(`[${name} ${position}] 님은 이미 본 Case의 CFT (${existing.role})에 등록되어 있습니다.`);
        return;
      }
      
      let suggestedRole = 'CFT Member';
      if (dept.includes('품질혁신')) suggestedRole = '8D Leader (품질혁신)';
      else if (dept.includes('FA') || dept.includes('개발') || dept.includes('DRAM') || dept.includes('Flash')) suggestedRole = 'Technical / FA Lead';
      else if (dept.includes('영업') || dept.includes('소싱') || dept.includes('CQE')) suggestedRole = 'Customer Quality';
      else if (dept.includes('제조') || dept.includes('기획') || dept.includes('운영')) suggestedRole = 'Process Engineer';
      else if (position.includes('임원') || position.includes('상무') || position.includes('전무') || position.includes('부사장') || position.includes('대표이사')) suggestedRole = '8D Champion';
      
      c.team.push({
        role: suggestedRole,
        name: `${name} ${position}`,
        dept: dept,
        contact: email,
        status: 'Active'
      });
      c.cftRecommendation = { ...(c.cftRecommendation || {}), humanConfirmed: false, status: 'Human Review Required' };
      saveAppData();
      alert(`[${name} ${position}] 님이 현재 Case [${c.id}]의 D1 CFT (${suggestedRole}) 팀원으로 배정되었습니다!`);
      if (appData.activeStage === 'D1' && appData.currentView === 'stage') {
        renderCurrentView();
      }
    }

    const CFT_ROLE_RULES = [
      { key: 'champion', role: '8D Champion', matches: role => role.includes('Champion') },
      { key: 'leader', role: '8D Leader (연구소/개발 주관)', matches: role => role.includes('Leader') && !role.includes('Quality Facilitator') },
      { key: 'fa', role: 'Technical / FA Lead', matches: role => role.includes('Technical') || role.includes('FA') },
      { key: 'process', role: 'Process Engineer (공정기술)', matches: role => role.includes('Process Engineer') || role.includes('공정기술') },
      { key: 'containment', role: 'Material Containment Lead', matches: role => role.includes('Containment') || role.includes('Logistics') || role.includes('물류') },
      { key: 'facilitator', role: '8D Quality Facilitator / 실무', matches: role => role.includes('Quality Facilitator') || role.includes('품질 실무') }
    ];

    function findOrgMemberByEmail(email) {
      let found = null;
      function visit(nodes) {
        (nodes || []).forEach(node => {
          (node.members || []).forEach(member => {
            if (member.email === email) found = { ...member, dept: member.dept || node.name };
          });
          if (!found) visit(node.children || []);
        });
      }
      visit(RAMOS_TREE);
      return found;
    }

    function getAICFTRecommendations(c = getActiveCase()) {
      if (!c) return [];
      const context = `${c.product || ''} ${c.partNumber || ''} ${c.leadDepartment || c.triageApproval?.leadDepartment || ''}`.toLowerCase();
      const isDram = context.includes('dram');
      const isFlash = !isDram && (context.includes('flash') || context.includes('emmc') || context.includes('ssd') || context.includes('nand'));
      const isUrgent = c.severityLevel === 'Critical' || c.lineStop || c.safetyRisk;
      const family = isDram ? 'DRAM' : isFlash ? 'Flash/eMMC/SSD' : '공통 품질';
      const pick = (email, role, reason, key) => {
        const member = findOrgMemberByEmail(email);
        return member ? { key, role, member, reason } : null;
      };

      return [
        pick('sahwang@ramostek.com', '8D Champion', `${c.severityLevel || '품질'} Case의 전사 품질 의사결정 및 고객 송부 최종 승인`, 'champion'),
        pick(isDram ? 'chpark@ramostek.com' : isFlash ? 'hskim@ramostek.com' : 'gh8229@ramostek.com', '8D Leader (연구소/개발 주관)', `${family} 제품군과 Triage 주관부서 기준 개발 책임자`, 'leader'),
        pick(isDram ? 'satiou@ramostek.com' : 'jhpark@ramostek.com', 'Technical / FA Lead', `${family} 불량 분석·물리/전기적 원인 규명 역량 기준`, 'fa'),
        pick(isDram ? 'hope@ramostek.com' : 'fog1007@ramostek.com', 'Process Engineer (공정기술)', `${family} 설계·공정 상관성 및 재현 조건 분석 기준`, 'process'),
        pick(isUrgent ? 'eunsan.lee@ramostek.com' : 'nrjcm@ramostek.com', 'Material Containment Lead', isUrgent ? 'Line Stop/Critical 위험으로 센터 단위 긴급 봉쇄 필요' : '자재·재고·출하 흐름 통제 필요', 'containment'),
        pick('sjkim@ramostek.com', '8D Quality Facilitator / 실무', '품질 Triage 승인자 및 8D 절차·Evidence 완결성 관리', 'facilitator')
      ].filter(Boolean);
    }

    function getCurrentCFTMemberForRule(c, ruleKey) {
      const rule = CFT_ROLE_RULES.find(item => item.key === ruleKey);
      return rule ? (c.team || []).find(member => rule.matches(member.role || '')) : null;
    }

    function isProtectedCFTMember(member) {
      const role = member?.role || '';
      return role.includes('Customer Response Owner') || role.includes('Quality Facilitator');
    }

    function isCFTAssignmentComplete(c) {
      return CFT_ROLE_RULES.every(rule => (c.team || []).some(member => rule.matches(member.role || '')));
    }

    function renderAICFTRecommendationPanel(c) {
      const recommendations = getAICFTRecommendations(c);
      const confirmed = c.cftRecommendation?.humanConfirmed === true;
      return `
        <section class="cft-ai-panel">
          <div class="cft-ai-head">
            <div>
              <span class="cft-ai-kicker">AI CFT ROUTING · HUMAN CONFIRMATION REQUIRED</span>
              <h3>조직도 기반 역할별 추천</h3>
              <p>제품군·Triage 주관부서·Severity·Line Stop 정보를 조직도와 대조한 추천입니다.</p>
            </div>
            <span class="cft-confirm-state ${confirmed ? 'is-confirmed' : ''}">${confirmed ? '사람 확정 완료' : '사람 확인 대기'}</span>
          </div>
          <div class="cft-recommendation-list">
            ${recommendations.map(rec => {
              const current = getCurrentCFTMemberForRule(c, rec.key);
              const isMatch = current?.contact === rec.member.email;
              return `
                <div class="cft-recommendation-row">
                  <div><span>${rec.role}</span><strong>${rec.member.name} ${rec.member.position}</strong><small>${rec.member.dept} · ${rec.member.email}</small></div>
                  <p>${rec.reason}</p>
                  <em class="${isMatch ? 'is-match' : ''}">${isMatch ? '추천 반영됨' : current ? `현재: ${current.name}` : '담당자 미지정'}</em>
                </div>
              `;
            }).join('')}
          </div>
          <div class="cft-ai-actions">
            <span>AI가 자동 확정하지 않습니다. 추천 적용 후 담당자를 검토·교체하고 최종 확정하세요.</span>
            <button class="btn btn-secondary" onclick="applyAICFTRecommendations()"><i data-lucide="sparkles" style="width:14px;height:14px;"></i> AI 추천 적용</button>
            <button class="btn btn-primary" onclick="confirmCFTAssignments()"><i data-lucide="user-check" style="width:14px;height:14px;"></i> 현재 구성 확정</button>
          </div>
        </section>
      `;
    }

    function applyAICFTRecommendations() {
      const c = getActiveCase();
      if (!c) return;
      if (!confirm('AI 추천 역할로 현재 Champion·Leader·FA·공정·물류 담당자를 교체하시겠습니까?\n\n고객 대응 담당과 품질 실무 간사는 유지됩니다.')) return;
      const recommendations = getAICFTRecommendations(c);
      const recommendationKeys = new Set(recommendations.map(rec => rec.key));
      c.team = (c.team || []).filter(member => {
        if (isProtectedCFTMember(member)) return true;
        const matchedRule = CFT_ROLE_RULES.find(rule => rule.matches(member.role || ''));
        return !matchedRule || !recommendationKeys.has(matchedRule.key);
      });
      recommendations.forEach(rec => {
        const existing = c.team.find(member => member.contact === rec.member.email);
        if (existing) {
          existing.role = rec.role;
          existing.assignment = 'AI Recommended / Human Review Required';
          existing.recommendationReason = rec.reason;
          return;
        }
        c.team.push({
          role: rec.role,
          name: `${rec.member.name} ${rec.member.position}`,
          dept: rec.member.dept,
          contact: rec.member.email,
          status: 'Active',
          assignment: 'AI Recommended / Human Review Required',
          recommendationReason: rec.reason
        });
      });
      c.cftRecommendation = {
        status: 'AI Suggested - Human Review Required',
        appliedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        humanConfirmed: false
      };
      saveAppData();
      renderCurrentView();
    }

    function confirmCFTAssignments() {
      const c = getActiveCase();
      if (!c) return;
      if (!isCFTAssignmentComplete(c)) {
        alert('CFT 필수 역할이 모두 지정되지 않았습니다.\n\nChampion, Leader, FA, 공정기술, 물류/봉쇄, 품질 실무 담당자를 확인해 주세요.');
        return;
      }
      const raciAcknowledged = document.getElementById('cftRaciAcknowledged');
      if (!raciAcknowledged?.checked) {
        alert('RACI 역할과 책임을 검토한 뒤 [RACI 책임 확인]에 체크해 주세요.');
        raciAcknowledged?.focus();
        return;
      }
      if (!confirm('현재 CFT 구성을 사람이 최종 확인하고 확정하시겠습니까?')) return;
      c.cftRecommendation = {
        ...(c.cftRecommendation || {}),
        status: 'Human Confirmed',
        humanConfirmed: true,
        confirmedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        confirmedBy: { name: CURRENT_USER.name, dept: CURRENT_USER.dept, email: CURRENT_USER.email }
      };
      c.cftRaci = {
        acknowledged: true,
        confirmedAt: c.cftRecommendation.confirmedAt,
        confirmedBy: c.cftRecommendation.confirmedBy
      };
      saveAppData();
      renderCurrentView();
    }

    

/* CFT ORG TREE MODAL & TEAM MANAGEMENT (62-PERSON TREE ENGINE)              */
    /* ========================================================================= */
    let modalOrgOpenNodes = { 'root': true, 'ceo': true, 'coo': true, 'mkt_div': true, 'rnd_div': true, 'mgmt_div': true };

    function openOrgTreeModalForCFT() {
      const c = getActiveCase();
      const modal = document.getElementById('globalModal');
      const container = document.getElementById('modalContainer');
      if (!modal || !container) return;

      container.style.width = '780px';
      container.style.maxWidth = '95vw';
      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid var(--border); padding-bottom:12px;">
          <div>
            <div style="font-size:1.15rem; font-weight:800; color:#60a5fa; display:flex; align-items:center; gap:8px;">
              <i data-lucide="network" style="color:#38bdf8; width:20px; height:20px;"></i> RAmos 전사 조직도 (총 62명) — D1 CFT 팀원 배속
            </div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">
              Active Case: <b class="num-mono" style="color:#f8fafc;">${c.id}</b> | 조직도에서 배속할 팀원을 선택하십시오.
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('globalModal').style.display='none'">
            <i data-lucide="x" style="width:14px; height:14px;"></i> 닫기
          </button>
        </div>

        <!-- Role Selector & Search Bar -->
        <div style="background:rgba(15,23,42,0.8); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px 14px; margin-bottom:12px;">
          <div class="grid-2" style="gap:12px;">
            <div>
              <label class="form-label" style="font-weight:700; color:#cbd5e1; margin-bottom:4px;">
                <span>배속할 CFT Role (역할 지정)</span>
              </label>
              <select id="modalCftRoleSelect" class="form-control">
                <option value="8D Champion">8D Champion (총괄 승인)</option>
                <option value="8D Leader (연구소/개발 주관)">8D Leader (연구소/개발 주관)</option>
                <option value="Technical / FA Lead">Technical / FA Lead (불량 분석)</option>
                <option value="Material Containment Lead">Material Containment Lead (물류/봉쇄)</option>
                <option value="Process Engineer (공정기술)" selected>Process Engineer (공정/제조기술)</option>
                <option value="Development Engineer (개발/설계)">Development Engineer (개발/설계엔지니어)</option>
                <option value="Quality Engineer (고객품질/CQE)">Quality Engineer (고객품질/CQE)</option>
                <option value="FA / Reliability Engineer (분석/신뢰성)">FA / Reliability Engineer (분석/신뢰성)</option>
                <option value="Firmware Engineer (FW 개발)">Firmware Engineer (FW 개발)</option>
                <option value="Supply Chain / Logistics (물류/자재)">Supply Chain / Logistics (물류/자재)</option>
                <option value="CFT Member (일반 팀원)">CFT Member (일반 팀원)</option>
              </select>
            </div>
            <div>
              <label class="form-label" style="font-weight:700; color:#cbd5e1; margin-bottom:4px;">
                <span>조직도 실시간 검색 (이름/부서/직급/이메일)</span>
              </label>
              <div style="position:relative;">
                <i data-lucide="search" style="position:absolute; left:10px; top:10px; width:14px; height:14px; color:var(--text-muted);"></i>
                <input type="text" id="modalOrgSearchInput" class="form-control" placeholder="예: 최현우, 개발, Pro, sjkim" style="padding-left:32px;" oninput="renderModalOrgTree(this.value)">
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Org Tree Container -->
        <div id="modalOrgTreeContainer" style="max-height:480px; overflow-y:auto; padding:12px; background:#070d19; border:1px solid var(--border); border-radius:var(--radius-sm);">
        </div>
      `;

      modal.style.display = 'flex';
      renderModalOrgTree();
      lucide.createIcons();
    }

    function toggleModalOrgNode(nodeId, e) {
      if (e) e.stopPropagation();
      modalOrgOpenNodes[nodeId] = !modalOrgOpenNodes[nodeId];
      renderModalOrgTree(document.getElementById('modalOrgSearchInput')?.value || '');
    }

    function expandAllModalOrgTree(expand) {
      function traverse(nodes) {
        nodes.forEach(n => {
          modalOrgOpenNodes[n.id] = expand;
          if (n.children) traverse(n.children);
        });
      }
      modalOrgOpenNodes['root'] = expand;
      traverse(RAMOS_TREE);
      renderModalOrgTree(document.getElementById('modalOrgSearchInput')?.value || '');
    }

    function renderModalOrgTree(searchQuery = '') {
      const container = document.getElementById('modalOrgTreeContainer');
      if (!container) return;
      const q = searchQuery.toLowerCase().trim();

      let html = `
        <div class="org-tree-controls" style="margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:700; color:#94a3b8; font-size:0.75rem;">조직 계통도 (총 62명)</span>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn btn-secondary btn-sm" style="padding:2px 8px; font-size:0.68rem;" onclick="expandAllModalOrgTree(true)">+ 전체 펼치기</button>
            <button type="button" class="btn btn-secondary btn-sm" style="padding:2px 8px; font-size:0.68rem;" onclick="expandAllModalOrgTree(false)">- 전체 접기</button>
          </div>
        </div>
      `;

      function renderModalNode(node, isRoot = false) {
        const isOpen = q ? true : !!modalOrgOpenNodes[node.id];
        const totalMembers = countTotalMembersInNode(node);
        const hasChildren = node.children && node.children.length > 0;
        const hasMembers = node.members && node.members.length > 0;

        // Filter members if query
        let filteredMembers = node.members || [];
        if (q) {
          filteredMembers = filteredMembers.filter(m => 
            m.name.toLowerCase().includes(q) || 
            (m.position && m.position.toLowerCase().includes(q)) || 
            (m.dept && m.dept.toLowerCase().includes(q)) ||
            (m.email && m.email.toLowerCase().includes(q))
          );
        }

        let childrenHtml = '';
        if (hasChildren) {
          childrenHtml = node.children.map(c => renderModalNode(c, false)).join('');
        }

        // If searching and nothing matches in this branch, hide
        if (q && filteredMembers.length === 0 && !childrenHtml.trim()) {
          return '';
        }

        return `
          <div class="folder-node" style="margin-bottom:4px;">
            <div class="folder-header ${isOpen ? 'open' : ''}" onclick="toggleModalOrgNode('${node.id}', event)" style="padding:6px 10px; border-radius:4px; display:flex; align-items:center; gap:8px; cursor:pointer; background:rgba(30,41,59,0.35);">
              <span class="folder-toggle-icon" style="font-family:monospace; font-weight:800; font-size:0.75rem; color:#60a5fa;">[${isOpen ? '-' : '+'}]</span>
              <i data-lucide="${isOpen ? 'folder-open' : 'folder'}" style="width:15px; height:15px; color:#f59e0b;"></i>
              <span class="folder-name" style="font-weight:700; font-size:0.8rem; color:#f8fafc;">${node.name}</span>
              <span class="folder-count-badge" style="margin-left:auto; font-size:0.65rem; background:#1e293b; color:#93c5fd; padding:1px 6px; border-radius:10px;">${totalMembers}명</span>
            </div>

            ${isOpen ? `
              <div class="folder-children" style="padding-left:16px; border-left:1px dashed rgba(59,130,246,0.25); margin-left:8px; margin-top:4px;">
                <!-- Members in this node -->
                ${filteredMembers.length > 0 ? `
                  <div class="folder-members-list" style="display:flex; flex-direction:column; gap:4px; margin-bottom:6px;">
                    ${filteredMembers.map(m => `
                      <div class="tree-member-card" style="display:flex; align-items:center; justify-content:space-between; padding:6px 10px; background:#0e172a; border:1px solid rgba(255,255,255,0.06); border-radius:5px;">
                        <div style="display:flex; align-items:center; gap:10px;">
                          <div style="width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,#2563eb,#7c3aed); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.7rem; color:#fff; flex-shrink:0;">
                            ${m.name.length > 2 ? m.name.slice(-2) : m.name}
                          </div>
                          <div style="display:flex; flex-direction:column; gap:2px;">
                            <div style="font-size:0.82rem; font-weight:700; color:#f8fafc; line-height:1.2;">
                              ${m.name} ${m.isMe ? `<span class="badge-me" style="font-size:0.6rem; background:#2563eb; color:#fff; padding:0 4px; border-radius:3px;">나</span>` : ''}
                            </div>
                            <div style="font-size:0.72rem; color:#94a3b8; line-height:1.2;">
                              ${m.position || 'Pro'}
                            </div>
                            <div class="num-mono" style="font-size:0.68rem; color:#60a5fa; line-height:1.2; word-break:break-all;">
                              ${m.email}
                            </div>
                          </div>
                        </div>
                        <button type="button" class="btn btn-primary btn-sm" style="padding:4px 12px; font-size:0.74rem;" onclick="assignModalMemberToCFT('${m.name}', '${m.position || 'Pro'}', '${node.name}', '${m.email}')">
                          <i data-lucide="user-plus" style="width:12px; height:12px;"></i> 배속 추가
                        </button>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}

                <!-- Sub-folders -->
                ${childrenHtml}
              </div>
            ` : ''}
          </div>
        `;
      }

      // Root
      const rootNode = {
        id: 'root',
        name: '라모스테크놀러지',
        children: RAMOS_TREE,
        members: []
      };

      html += `<div class="folder-tree-root">${renderModalNode(rootNode, true)}</div>`;
      container.innerHTML = html;
      lucide.createIcons();
    }

    function assignModalMemberToCFT(name, position, dept, email) {
      const c = getActiveCase();
      const roleSelect = document.getElementById('modalCftRoleSelect');
      const role = roleSelect ? roleSelect.value : 'Process Engineer (공정기술)';
      const fullNameWithPos = `${name} ${position}`;

      const existing = c.team.find(m => m.contact === email || m.name.includes(name));
      if (existing) {
        alert(`[${fullNameWithPos}] 님은 이미 CFT에 배속되어 있습니다. (${existing.role})`);
        return;
      }

      c.team.push({
        role: role,
        name: fullNameWithPos,
        dept: dept,
        contact: email,
        status: 'Active'
      });
      c.cftRecommendation = { ...(c.cftRecommendation || {}), humanConfirmed: false, status: 'Human Review Required' };

      saveAppData();
      document.getElementById('globalModal').style.display = 'none';
      renderCurrentView();
      alert(`🎉 [${fullNameWithPos}] 님이 D1 CFT [${role}]으로 성공적으로 배속되었습니다!`);
    }

    function removeCFTMember(idx) {
      const c = getActiveCase();
      const member = c?.team?.[idx];
      if (!member) return;
      if (isProtectedCFTMember(member)) {
        alert('고객 대응 담당과 품질 실무 간사는 접수·Triage 승인 정보와 연결된 필수 담당자입니다. 담당자 변경은 해당 원본 라우팅에서 수행해 주세요.');
        return;
      }
      if (confirm(`[${member.name}] 님을 D1 CFT의 [${member.role}] 역할에서 제외하시겠습니까?`)) {
        c.team.splice(idx, 1);
        c.cftRecommendation = { ...(c.cftRecommendation || {}), humanConfirmed: false, status: 'Human Review Required' };
        saveAppData();
        renderCurrentView();
      }
    }


    function uploadEvidencePrompt() {
      const title = prompt('등록할 Evidence 명칭을 입력하세요:', 'SAT 초음파 비파괴검사 성적서');
      if (!title) return;
      const c = getActiveCase();
      const newEvdId = `EVD-${String(c.evidenceList.length + 1).padStart(2, '0')}`;
      c.evidenceList.push({
        id: newEvdId,
        title: title,
        type: 'Inspection File',
        file: `SAT_Scan_${new Date().getTime()}.pdf`,
        linkedStages: ['D4']
      });
      saveAppData();
      alert(`신규 증거 [${newEvdId}]가 등록되었습니다.`);
      renderCurrentView();
    }

    function openAIAssistantModal() {
      const c = getActiveCase();
      const modal = document.getElementById('globalModal');
      const container = document.getElementById('modalContainer');
      
      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid var(--border); padding-bottom:12px;">
          <div style="font-size:1.1rem; font-weight:800; color:#60a5fa; display:flex; align-items:center; gap:8px;">
            <i data-lucide="sparkles" style="color:#38bdf8;"></i> AI 전수 품질 감사 보고서 (Case: ${c.id})
          </div>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('globalModal').style.display='none'">닫기</button>
        </div>

        <div style="font-size:0.84rem; line-height:1.6; color:#f8fafc;">
          <div style="background:#0e1628; border:1px solid var(--border); border-radius:var(--radius-sm); padding:14px; margin-bottom:12px;">
            <div style="font-weight:700; color:#34d399; margin-bottom:4px;">1. Fact & Evidence Traceability 검사: 통과 (100%)</div>
            <p style="color:#cbd5e1; font-size:0.8rem;">D2 Fact와 D4 Root Cause 간의 물리적 성적서(EVD-04, EVD-08)가 완벽하게 연결되어 있습니다.</p>
          </div>

          <div style="background:#0e1628; border:1px solid var(--border); border-radius:var(--radius-sm); padding:14px; margin-bottom:12px;">
            <div style="font-weight:700; color:#38bdf8; margin-bottom:4px;">2. 수량 정합성 (Consistency) 검사: 정상 일치</div>
            <p style="color:#cbd5e1; font-size:0.8rem;">고객 인입 불량 12ea와 D3 선별 결과 NG 12ea가 정확히 일치하여 데이터 왜곡이 없습니다.</p>
          </div>

          <div style="background:#0e1628; border:1px solid var(--border); border-radius:var(--radius-sm); padding:14px;">
            <div style="font-weight:700; color:#fbbf24; margin-bottom:4px;">3. 고객사 제출 준비도: 즉시 제출 가능 (Ready for Submission)</div>
            <p style="color:#cbd5e1; font-size:0.8rem;">Final 8D 리포트의 결재선(Leader -> FA -> Director -> Customer)이 완결되었습니다.</p>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:20px;">
          <button class="btn btn-primary" onclick="document.getElementById('globalModal').style.display='none'; switchNav('reports-hub');">공식 리포트 인쇄 화면으로 이동</button>
        </div>
      `;
      modal.style.display = 'flex';
      lucide.createIcons();
    }
