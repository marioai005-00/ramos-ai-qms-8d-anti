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


    /* ========================================================================= */
    /* RAMOS ORG SKILLS & R&R MANAGEMENT (Excel & Web UI Dual Mode)             */
    /* ========================================================================= */
    const DEFAULT_ORG_SKILLS = {
      'sahwang@ramostek.com': { jobDesc: '?„ì‚¬ ?ˆì§ˆ ì´ê´„, 8D Champion, ê³ ê° ê³µì‹ ?¹ì¸', products: 'ê³µí†µ (?„ì œ??', skills: '?ˆì§ˆê²½ì˜, IATF16949, ê³ ê°ê°ì‚¬' },
      'sjkim@ramostek.com': { jobDesc: '8D ?ˆì§ˆ ?¤ë¬´ ê°„ì‚¬, Master QA, ?¨ê³„ë³?Evidence ê²€ì¦?, products: 'eMMC, SSD, DRAM', skills: '?ˆì§ˆ?¤ë¬´, 25ê°??ˆì§ˆ?„êµ¬, ?ì¸ê²€ì¦? },
      'hskim@ramostek.com': { jobDesc: 'Flash ê°œë°œ ì´ê´„, 8D Leader, ?Œë¡œ/?¤ê³„ ë¶„ì„', products: 'eMMC, UFS, SSD', skills: 'Flash ?„í‚¤?ì²˜, ?Œì›¨?? ?¤ê³„ê²€?? },
      'jhpark@ramostek.com': { jobDesc: 'Physical FA / ë¶ˆëŸ‰ ë¶„ì„ ì´ê´„, ?œê° ì¦ê±° ê²€ì¦?, products: 'eMMC, Flash', skills: 'SEM ?¨ë©´ë¶„ì„, Decap, X-Ray, BGA ?¼íŠ¸' },
      'shk@ramostek.com': { jobDesc: 'LGE ?„ë‹´ ?ì—… ë°?ê³ ê° ë¶€?í•© 1ì°??Œí†µ', products: 'DTV eMMC, Flash', skills: 'ê³ ê°??CS, ?´ë ˆ???‘ìˆ˜, ?©ê¸°ì¡°ìœ¨' },
      'anasta@ramostek.com': { jobDesc: '?¼ì„±?„ì ?„ë‹´ ?ì—… ë°??œë²„ SSD ê³ ê° ?€??, products: 'PCIe SSD, Enterprise', skills: 'ê³ ê°??CS, SSD ?¤í™ ì¡°ìœ¨' },
      'jinyi711@ramostek.com': { jobDesc: 'SK?˜ì´?‰ìŠ¤ ?„ë‹´ ?ì—… ë°?DRAM ê³ ê° ?€??, products: 'DDR4, DDR5 SODIMM', skills: 'ê³ ê°??CS, ?ˆì§ˆ ?µë³´ ?‘ìˆ˜' },
      'chpark@ramostek.com': { jobDesc: 'DRAM ê°œë°œ ì´ê´„, 8D Leader', products: 'DDR4, DDR5, LPDDR', skills: 'DRAM ?„í‚¤?ì²˜, ?€?´ë° ë¶„ì„' },
      'satiou@ramostek.com': { jobDesc: 'DRAM ë¶ˆëŸ‰ ë¶„ì„ ë°?X-Ray Void ê²€??, products: 'DDR4, BGA PKG', skills: 'X-Ray ê²€?? Void??ë¶„ì„, Ball Grid' },
      'eunsan.lee@ramostek.com': { jobDesc: '?œì¡° ì´ê´„, ?¼ì¸ ?µì œ, ?„ì œ??ì°½ê³ (RAK4/5) ë´‰ì‡„', products: '?„ì œ??, skills: '?¼ì¸?¤íƒ‘, WIP ë´‰ì‡„, ERP ?¬ê³ ê´€ë¦? }
    };

    function getOrgMemberSkills(email) {
      appData.orgSkills = appData.orgSkills || {};
      return appData.orgSkills[email] || DEFAULT_ORG_SKILLS[email] || { jobDesc: '', products: '', skills: '' };
    }

    function saveOrgMemberSkills(email, data) {
      appData.orgSkills = appData.orgSkills || {};
      appData.orgSkills[email] = data;
      saveAppData();
      renderOrgTree();
      alert('?„ì§???´ë‹¹ ?…ë¬´ ë°??„ë¬¸ ?¤í‚¬ ?•ë³´ê°€ ?€?¥ë˜?ˆìŠµ?ˆë‹¤.');
    }

    function openOrgMemberSkillModal(email) {
      const member = findOrgMemberByEmail(email);
      if (!member) return;
      const skills = getOrgMemberSkills(email);

      const modal = document.getElementById('globalModal');
      const container = document.getElementById('modalContainer');
      if (!modal || !container) return;

      container.style.width = '640px';
      container.style.maxWidth = '92vw';
      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; border-bottom:1px solid var(--border); padding-bottom:12px;">
          <div>
            <div style="font-size:1.1rem; font-weight:800; color:#f8fafc; display:flex; align-items:center; gap:8px;">
              <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#38bdf8;"></span>
              ${member.name} ${member.position}
              <span style="font-size:0.75rem; color:#60a5fa; font-weight:600; background:rgba(56,189,248,0.12); padding:2px 7px; border-radius:4px;">${member.dept}</span>
            </div>
            <div style="font-size:0.72rem; color:var(--text-muted); margin-top:3px;" class="num-mono">${member.email}</div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('globalModal').style.display='none'" style="padding:3px 8px;">???«ê¸°</button>
        </div>

        <form id="orgSkillEditForm" onsubmit="event.preventDefault(); handleSaveOrgSkill('${member.email}')">
          <div style="display:flex; flex-direction:column; gap:14px;">
            <div class="form-group">
              <label class="form-label" style="display:flex; justify-content:space-between;">
                <span>?“‹ ?´ë‹¹ ?…ë¬´ (R&R)</span>
                <small style="color:#94a3b8; font-size:0.68rem;">ì£¼ìš” R&R ë°??„ì—… ??• </small>
              </label>
              <textarea id="editOrgJobDesc" class="form-control" rows="2" placeholder="?? eMMC 5.1 ë¶ˆëŸ‰ ë¶„ì„ ë°?SMT ?¤ì¥ ê²€?? ? ë¢°???œí—˜">${skills.jobDesc || ''}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label" style="display:flex; justify-content:space-between;">
                <span>?¯ ì£¼ë ¥ ?œí’ˆêµ?(Product Domain)</span>
                <small style="color:#94a3b8; font-size:0.68rem;">?¤ë£¨??ë©”ëª¨ë¦?ë¶€??/small>
              </label>
              <input type="text" id="editOrgProducts" class="form-control" value="${skills.products || ''}" placeholder="?? eMMC, UFS, PCIe SSD, DDR4, BGA Package">
            </div>

            <div class="form-group">
              <label class="form-label" style="display:flex; justify-content:space-between;">
                <span>?”¬ ?µì‹¬ ?„ë¬¸ ??Ÿ‰ / ?¤í‚¬??(?¼í‘œë¡?êµ¬ë¶„)</span>
                <small style="color:#94a3b8; font-size:0.68rem;">ë¶ˆëŸ‰ ë¶„ì„Â·ê³µì • ?¹í™” ê¸°ìˆ </small>
              </label>
              <input type="text" id="editOrgSkills" class="form-control" value="${skills.skills || ''}" placeholder="?? SEM ?¨ë©´ë¶„ì„, Decap, X-Ray ê²€?? Reflow ?„ë¡œ?Œì¼, ?Œì›¨??>
            </div>

            <div style="background:rgba(59,130,246,0.08); border:1px dashed #3b82f6; border-radius:6px; padding:10px 12px; font-size:0.72rem; color:#93c5fd; display:flex; align-items:center; gap:8px;">
              <i data-lucide="sparkles" style="width:16px; height:16px; flex-shrink:0;"></i>
              <span>?¬ê¸°???±ë¡???…ë¬´?€ ?¤í‚¬?€ D1 CFT ?ë™ ?¸ì„± ë°??ˆì§ˆ?„êµ¬ ë§¤ì¹­ ??AI ?ì´?„íŠ¸???µì‹¬ ?ë‹¨ ê·¼ê±°ë¡?ì¦‰ì‹œ ë°˜ì˜?©ë‹ˆ??</span>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:18px; border-top:1px solid var(--border); padding-top:12px;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="assignOrgMemberToCFT('${member.name}', '${member.position}', '${member.dept}', '${member.email}'); document.getElementById('globalModal').style.display='none';">
              + D1 CFT??ì§ì ‘ ë°°ì†
            </button>
            <div style="display:flex; gap:8px;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('globalModal').style.display='none'">ì·¨ì†Œ</button>
              <button type="submit" class="btn btn-primary btn-sm">?’¾ ?…ë¬´ ë°??¤í‚¬ ?€??/button>
            </div>
          </div>
        </form>
      `;
      modal.style.display = 'flex';
      lucide.createIcons();
    }

    function handleSaveOrgSkill(email) {
      const jobDesc = document.getElementById('editOrgJobDesc')?.value.trim() || '';
      const products = document.getElementById('editOrgProducts')?.value.trim() || '';
      const skills = document.getElementById('editOrgSkills')?.value.trim() || '';
      saveOrgMemberSkills(email, { jobDesc, products, skills });
      document.getElementById('globalModal').style.display = 'none';
    }

    function downloadOrgSkillExcel() {
      if (typeof XLSX === 'undefined') {
        alert('?‘ì? ?¼ì´ë¸ŒëŸ¬ë¦?SheetJS)ê°€ ë¡œë“œ?˜ì? ?Šì•˜?µë‹ˆ??');
        return;
      }

      const allMembers = [];
      function visit(nodes) {
        (nodes || []).forEach(node => {
          (node.members || []).forEach(m => {
            const sk = getOrgMemberSkills(m.email);
            allMembers.push({
              'ë¶€ë¬?: node.name.includes('ë¶€ë¬?) || node.name.includes('ì§ì†') ? node.name : '',
              '?€/?¼í„°': node.name,
              'ì§ìœ„': m.position || 'Pro',
              '?´ë¦„': m.name,
              '?´ë©”??: m.email,
              '?´ë‹¹?…ë¬´ (R&R)': sk.jobDesc || '',
              'ì£¼ë ¥?œí’ˆêµ?: sk.products || '',
              '?µì‹¬?¤í‚¬ (?¼í‘œêµ¬ë¶„)': sk.skills || ''
            });
          });
          if (node.children) visit(node.children);
        });
      }
      visit(RAMOS_TREE);

      const ws = XLSX.utils.json_to_sheet(allMembers);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'RAmos ì¡°ì§??ë°??…ë¬´?¤í‚¬');
      XLSX.writeFile(wb, 'RAmos_ì¡°ì§???…ë¬´?¤í‚¬_?¤ì‹œê°?xlsx');
    }

    function triggerOrgSkillExcelUpload() {
      const input = document.getElementById('orgExcelUploadInput');
      if (input) input.click();
    }

    function handleOrgSkillExcelUpload(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (typeof XLSX === 'undefined') {
        alert('?‘ì? ?¼ì´ë¸ŒëŸ¬ë¦¬ê? ë¡œë“œ?˜ì? ?Šì•˜?µë‹ˆ??');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

          let updatedCount = 0;
          appData.orgSkills = appData.orgSkills || {};

          rows.forEach(r => {
            const email = r['?´ë©”??] || r['email'] || r['Email'];
            if (!email) return;
            const jobDesc = r['?´ë‹¹?…ë¬´ (R&R)'] || r['?´ë‹¹?…ë¬´'] || r['R&R'] || '';
            const products = r['ì£¼ë ¥?œí’ˆêµ?] || r['?œí’ˆêµ?] || '';
            const skills = r['?µì‹¬?¤í‚¬ (?¼í‘œêµ¬ë¶„)'] || r['?µì‹¬?¤í‚¬'] || r['?¤í‚¬'] || '';

            if (jobDesc || products || skills) {
              appData.orgSkills[email] = { jobDesc, products, skills };
              updatedCount++;
            }
          });

          saveAppData();
          renderOrgTree();
          alert(`ì´?${updatedCount}ëª…ì˜ ?´ë‹¹ ?…ë¬´ ë°??„ë¬¸ ?¤í‚¬???‘ì?ë¡œë????±ê³µ?ìœ¼ë¡?ë°˜ì˜?˜ì—ˆ?µë‹ˆ??`);
        } catch (err) {
          alert('?‘ì? ?Œì¼ ?Œì‹± ?¤ë¥˜: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    }

    function renderOrgTree(searchQuery = '') {
      const container = document.getElementById('orgTreeContainer');
      const q = searchQuery.toLowerCase().trim();

      // Top controls with Dual Excel Sync & Member Edit
        let html = `
          <input type="file" id="orgExcelUploadInput" style="display:none;" accept=".xlsx,.xls" onchange="handleOrgSkillExcelUpload(event)">
          <div class="org-tree-controls" style="flex-direction:column; gap:6px; align-items:stretch; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:700; color:#94a3b8; font-size:0.75rem;">ì¡°ì§ ê³„í†µ??(ì´?62ëª?</span>
              <div style="display:flex; gap:4px;">
                <button class="btn btn-secondary btn-sm" style="padding:2px 6px; font-size:0.65rem;" onclick="expandAllOrgTree(true)">+ ?„ì²´ ?¼ì¹˜ê¸?/button>
                <button class="btn btn-secondary btn-sm" style="padding:2px 6px; font-size:0.65rem;" onclick="expandAllOrgTree(false)">- ?„ì²´ ?‘ê¸°</button>
              </div>
            </div>
            <div style="display:flex; gap:6px; background:#0b1322; border:1px solid #1e293b; border-radius:5px; padding:4px 8px; justify-content:space-between; align-items:center;">
              <span style="font-size:0.68rem; color:#60a5fa; font-weight:700;">?“‹ R&R / ?¤í‚¬ ?™ê¸°??</span>
              <div style="display:flex; gap:4px;">
                <button class="btn btn-secondary btn-sm" style="padding:2px 6px; font-size:0.62rem;" onclick="downloadOrgSkillExcel()" title="?„ì¬ ?±ë¡???…ë¬´/?¤í‚¬ ?•ë³´ë¥??‘ì?ë¡??´ë³´?…ë‹ˆ??">?“¥ ?‘ì? ?´ë³´?´ê¸°</button>
                <button class="btn btn-primary btn-sm" style="padding:2px 6px; font-size:0.62rem;" onclick="triggerOrgSkillExcelUpload()" title="?‘ì„±???‘ì? ?Œì¼???¬ë ¤ ?¼ê´„ ?±ë¡?©ë‹ˆ??">?“¤ ?‘ì? ê°€?¸ì˜¤ê¸?/button>
              </div>
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
                ${(hasChildren || hasMembers) ? (isOpen ? '?? : '+') : '??}
              </div>
              <i data-lucide="${isOpen ? 'folder-open' : 'folder'}" class="tree-folder-icon"></i>
              <span class="tree-node-name">${node.name}</span>
              <span class="tree-member-badge num-mono">${totalMembers}ëª?/span>
            </div>

            ${isOpen ? `
              <div class="tree-children-container">
                <!-- Direct Node Members -->
                ${(q ? filteredMembers : (node.members || [])).length > 0 ? `
                  <div class="tree-members-container">
                    ${(q ? filteredMembers : node.members).map(m => `
                      <div class="org-user-card ${m.isMe ? 'is-me' : ''}" onclick="openOrgMemberSkillModal('${m.email}')" title="?´ë¦­?˜ì—¬ ?´ë‹¹ ?…ë¬´(R&R) ë°??„ë¬¸ ?¤í‚¬???¸ì§‘?©ë‹ˆ??" style="cursor:pointer;">
                        <div class="org-avatar ${m.isMe ? 'me' : ''}">
                          ${m.name.length > 2 ? m.name.slice(-2) : m.name}
                        </div>
                        <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:2px;">
                          <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div style="font-size:0.82rem; font-weight:700; color:#f8fafc; line-height:1.2;">
                              ${m.name} ${m.isMe ? `<span class="badge-me" style="font-size:0.6rem; padding:0 4px; border-radius:3px;">??/span>` : ''}
                            </div>
                            <span style="font-size:0.6rem; color:#60a5fa; border:1px solid rgba(96,165,250,0.3); border-radius:3px; padding:0 3px;">R&R ?¤ì • ??/span>
                          </div>
                          <div style="font-size:0.72rem; color:#94a3b8; line-height:1.2;">
                            ${m.position || 'Pro'}
                          </div>
                          <div class="num-mono" style="font-size:0.68rem; color:#64748b; line-height:1.2; word-break:break-all;">
                            ${m.email}
                          </div>
                          ${(() => {
                            const sk = getOrgMemberSkills(m.email);
                            if (!sk.jobDesc && !sk.skills) return '';
                            return `
                              <div style="margin-top:4px; padding-top:4px; border-top:1px dashed #1e293b; display:flex; flex-direction:column; gap:2px;">
                                ${sk.jobDesc ? `<div style="font-size:0.66rem; color:#cbd5e1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">?“ ${sk.jobDesc}</div>` : ''}
                                ${sk.skills ? `<div style="font-size:0.62rem; color:#38bdf8; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">?”¬ ${sk.skills}</div>` : ''}
                              </div>
                            `;
                          })()}
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

      // Root level: ?Œì‚¬êµ¬ë¶„ > ?¼ëª¨?¤í…Œ?¬ë??¬ì?
      const rootNode = {
        id: 'root',
        name: '?¼ëª¨?¤í…Œ?¬ë??¬ì?',
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
        alert(`[${name} ${position}] ?˜ì? ?´ë? ë³?Case??CFT (${existing.role})???±ë¡?˜ì–´ ?ˆìŠµ?ˆë‹¤.`);
        return;
      }

      let suggestedRole = 'CFT Member';
      if (dept.includes('?ˆì§ˆ?ì‹ ')) suggestedRole = '8D Leader (?ˆì§ˆ?ì‹ )';
      else if (dept.includes('FA') || dept.includes('ê°œë°œ') || dept.includes('DRAM') || dept.includes('Flash')) suggestedRole = 'Technical / FA Lead';
      else if (dept.includes('?ì—…') || dept.includes('?Œì‹±') || dept.includes('CQE')) suggestedRole = 'Customer Quality';
      else if (dept.includes('?œì¡°') || dept.includes('ê¸°íš') || dept.includes('?´ì˜')) suggestedRole = 'Process Engineer';
      else if (position.includes('?„ì›') || position.includes('?ë¬´') || position.includes('?„ë¬´') || position.includes('ë¶€?¬ì¥') || position.includes('?€?œì´??)) suggestedRole = '8D Champion';

      c.team.push({
        role: suggestedRole,
        name: `${name} ${position}`,
        dept: dept,
        contact: email,
        status: 'Active'
      });
      c.cftRecommendation = { ...(c.cftRecommendation || {}), humanConfirmed: false, status: 'Human Review Required' };
      saveAppData();
      alert(`[${name} ${position}] ?˜ì´ ?„ì¬ Case [${c.id}]??D1 CFT (${suggestedRole}) ?€?ìœ¼ë¡?ë°°ì •?˜ì—ˆ?µë‹ˆ??`);
      if (appData.activeStage === 'D1' && appData.currentView === 'stage') {
        renderCurrentView();
      }
    }

    const CFT_ROLE_RULES = [
      { key: 'champion', role: '8D Champion', matches: role => role.includes('Champion') },
      { key: 'leader', role: '8D Leader (?°êµ¬??ê°œë°œ ì£¼ê?)', matches: role => role.includes('Leader') && !role.includes('Quality Facilitator') },
      { key: 'fa', role: 'Technical / FA Lead', matches: role => role.includes('Technical') || role.includes('FA') },
      { key: 'process', role: 'Process Engineer (ê³µì •ê¸°ìˆ )', matches: role => role.includes('Process Engineer') || role.includes('ê³µì •ê¸°ìˆ ') },
      { key: 'containment', role: 'Material Containment Lead', matches: role => role.includes('Containment') || role.includes('Logistics') || role.includes('ë¬¼ë¥˜') },
      { key: 'facilitator', role: '8D Quality Facilitator / ?¤ë¬´', matches: role => role.includes('Quality Facilitator') || role.includes('?ˆì§ˆ ?¤ë¬´') }
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
      const family = isDram ? 'DRAM' : isFlash ? 'Flash/eMMC/SSD' : 'ê³µí†µ ?ˆì§ˆ';
      const pick = (email, role, defaultReason, key) => {
        const member = findOrgMemberByEmail(email);
        if (!member) return null;
        const sk = typeof getOrgMemberSkills === 'function' ? getOrgMemberSkills(email) : null;
        let dynamicReason = defaultReason;
        if (sk && (sk.jobDesc || sk.skills)) {
          const detailParts = [];
          if (sk.jobDesc) detailParts.push(`R&R: ${sk.jobDesc}`);
          if (sk.skills) detailParts.push(`?„ë¬¸??Ÿ‰: ${sk.skills}`);
          dynamicReason = `${defaultReason} [${detailParts.join(' Â· ')}]`;
        }
        return { key, role, member, reason: dynamicReason };
      };

      return [
        pick('sahwang@ramostek.com', '8D Champion', `${c.severityLevel || '?ˆì§ˆ'} Case???„ì‚¬ ?ˆì§ˆ ?˜ì‚¬ê²°ì • ë°?ê³ ê° ?¡ë? ìµœì¢… ?¹ì¸`, 'champion'),
        pick(isDram ? 'chpark@ramostek.com' : isFlash ? 'hskim@ramostek.com' : 'gh8229@ramostek.com', '8D Leader (?°êµ¬??ê°œë°œ ì£¼ê?)', `${family} ?œí’ˆêµ°ê³¼ Triage ì£¼ê?ë¶€??ê¸°ì? ê°œë°œ ì±…ì„??, 'leader'),
        pick(isDram ? 'satiou@ramostek.com' : 'jhpark@ramostek.com', 'Technical / FA Lead', `${family} ë¶ˆëŸ‰ ë¶„ì„Â·ë¬¼ë¦¬/?„ê¸°???ì¸ ê·œëª… ??Ÿ‰ ê¸°ì?`, 'fa'),
        pick(isDram ? 'hope@ramostek.com' : 'fog1007@ramostek.com', 'Process Engineer (ê³µì •ê¸°ìˆ )', `${family} ?¤ê³„Â·ê³µì • ?ê???ë°??¬í˜„ ì¡°ê±´ ë¶„ì„ ê¸°ì?`, 'process'),
        pick(isUrgent ? 'eunsan.lee@ramostek.com' : 'nrjcm@ramostek.com', 'Material Containment Lead', isUrgent ? 'Line Stop/Critical ?„í—˜?¼ë¡œ ?¼í„° ?¨ìœ„ ê¸´ê¸‰ ë´‰ì‡„ ?„ìš”' : '?ì¬Â·?¬ê³ Â·ì¶œí•˜ ?ë¦„ ?µì œ ?„ìš”', 'containment'),
        pick('sjkim@ramostek.com', '8D Quality Facilitator / ?¤ë¬´', '?ˆì§ˆ Triage ?¹ì¸??ë°?8D ?ˆì°¨Â·Evidence ?„ê²°??ê´€ë¦?, 'facilitator')
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
              <span class="cft-ai-kicker">AI CFT ROUTING Â· HUMAN CONFIRMATION REQUIRED</span>
              <h3>ì¡°ì§??ê¸°ë°˜ ??• ë³?ì¶”ì²œ</h3>
              <p>?œí’ˆêµ°Â·Triage ì£¼ê?ë¶€?œÂ·SeverityÂ·Line Stop ?•ë³´ë¥?ì¡°ì§?„ì? ?€ì¡°í•œ ì¶”ì²œ?…ë‹ˆ??</p>
            </div>
            <span class="cft-confirm-state ${confirmed ? 'is-confirmed' : ''}">${confirmed ? '?¬ëŒ ?•ì • ?„ë£Œ' : '?¬ëŒ ?•ì¸ ?€ê¸?}</span>
          </div>
          <div class="cft-recommendation-list">
            ${recommendations.map(rec => {
              const current = getCurrentCFTMemberForRule(c, rec.key);
              const isMatch = current?.contact === rec.member.email;
              return `
                <div class="cft-recommendation-row">
                  <div><span>${rec.role}</span><strong>${rec.member.name} ${rec.member.position}</strong><small>${rec.member.dept} Â· ${rec.member.email}</small></div>
                  <p>${rec.reason}</p>
                  <em class="${isMatch ? 'is-match' : ''}">${isMatch ? 'ì¶”ì²œ ë°˜ì˜?? : current ? `?„ì¬: ${current.name}` : '?´ë‹¹??ë¯¸ì???}</em>
                </div>
              `;
            }).join('')}
          </div>
          <div class="cft-ai-actions">
            <span>AIê°€ ?ë™ ?•ì •?˜ì? ?ŠìŠµ?ˆë‹¤. ì¶”ì²œ ?ìš© ???´ë‹¹?ë? ê²€? Â·êµì²´í•˜ê³?ìµœì¢… ?•ì •?˜ì„¸??</span>
            <button class="btn btn-secondary" onclick="applyAICFTRecommendations()"><i data-lucide="sparkles" style="width:14px;height:14px;"></i> AI ì¶”ì²œ ?ìš©</button>
            <button class="btn btn-primary" onclick="confirmCFTAssignments()"><i data-lucide="user-check" style="width:14px;height:14px;"></i> ?„ì¬ êµ¬ì„± ?•ì •</button>
          </div>
        </section>
      `;
    }

    function applyAICFTRecommendations() {
      const c = getActiveCase();
      if (!c) return;
      if (!confirm('AI ì¶”ì²œ ??• ë¡??„ì¬ ChampionÂ·LeaderÂ·FAÂ·ê³µì •Â·ë¬¼ë¥˜ ?´ë‹¹?ë? êµì²´?˜ì‹œê² ìŠµ?ˆê¹Œ?\n\nê³ ê° ?€???´ë‹¹ê³??ˆì§ˆ ?¤ë¬´ ê°„ì‚¬??? ì??©ë‹ˆ??')) return;
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
        alert('CFT ?„ìˆ˜ ??• ??ëª¨ë‘ ì§€?•ë˜ì§€ ?Šì•˜?µë‹ˆ??\n\nChampion, Leader, FA, ê³µì •ê¸°ìˆ , ë¬¼ë¥˜/ë´‰ì‡„, ?ˆì§ˆ ?¤ë¬´ ?´ë‹¹?ë? ?•ì¸??ì£¼ì„¸??');
        return;
      }
      const raciAcknowledged = document.getElementById('cftRaciAcknowledged');
      if (!raciAcknowledged?.checked) {
        alert('RACI ??• ê³?ì±…ì„??ê²€? í•œ ??[RACI ì±…ì„ ?•ì¸]??ì²´í¬??ì£¼ì„¸??');
        raciAcknowledged?.focus();
        return;
      }
      if (!confirm('?„ì¬ CFT êµ¬ì„±???¬ëŒ??ìµœì¢… ?•ì¸?˜ê³  ?•ì •?˜ì‹œê² ìŠµ?ˆê¹Œ?')) return;
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
              <i data-lucide="network" style="color:#38bdf8; width:20px; height:20px;"></i> RAmos ?„ì‚¬ ì¡°ì§??(ì´?62ëª? ??D1 CFT ?€??ë°°ì†
            </div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">
              Active Case: <b class="num-mono" style="color:#f8fafc;">${c.id}</b> | ì¡°ì§?„ì—??ë°°ì†???€?ì„ ? íƒ?˜ì‹­?œì˜¤.
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('globalModal').style.display='none'">
            <i data-lucide="x" style="width:14px; height:14px;"></i> ?«ê¸°
          </button>
        </div>

        <!-- Role Selector & Search Bar -->
        <div style="background:rgba(15,23,42,0.8); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px 14px; margin-bottom:12px;">
          <div class="grid-2" style="gap:12px;">
            <div>
              <label class="form-label" style="font-weight:700; color:#cbd5e1; margin-bottom:4px;">
                <span>ë°°ì†??CFT Role (??•  ì§€??</span>
              </label>
              <select id="modalCftRoleSelect" class="form-control">
                <option value="8D Champion">8D Champion (ì´ê´„ ?¹ì¸)</option>
                <option value="8D Leader (?°êµ¬??ê°œë°œ ì£¼ê?)">8D Leader (?°êµ¬??ê°œë°œ ì£¼ê?)</option>
                <option value="Technical / FA Lead">Technical / FA Lead (ë¶ˆëŸ‰ ë¶„ì„)</option>
                <option value="Material Containment Lead">Material Containment Lead (ë¬¼ë¥˜/ë´‰ì‡„)</option>
                <option value="Process Engineer (ê³µì •ê¸°ìˆ )" selected>Process Engineer (ê³µì •/?œì¡°ê¸°ìˆ )</option>
                <option value="Development Engineer (ê°œë°œ/?¤ê³„)">Development Engineer (ê°œë°œ/?¤ê³„?”ì??ˆì–´)</option>
                <option value="Quality Engineer (ê³ ê°?ˆì§ˆ/CQE)">Quality Engineer (ê³ ê°?ˆì§ˆ/CQE)</option>
                <option value="FA / Reliability Engineer (ë¶„ì„/? ë¢°??">FA / Reliability Engineer (ë¶„ì„/? ë¢°??</option>
                <option value="Firmware Engineer (FW ê°œë°œ)">Firmware Engineer (FW ê°œë°œ)</option>
                <option value="Supply Chain / Logistics (ë¬¼ë¥˜/?ì¬)">Supply Chain / Logistics (ë¬¼ë¥˜/?ì¬)</option>
                <option value="CFT Member (?¼ë°˜ ?€??">CFT Member (?¼ë°˜ ?€??</option>
              </select>
            </div>
            <div>
              <label class="form-label" style="font-weight:700; color:#cbd5e1; margin-bottom:4px;">
                <span>ì¡°ì§???¤ì‹œê°?ê²€??(?´ë¦„/ë¶€??ì§ê¸‰/?´ë©”??</span>
              </label>
              <div style="position:relative;">
                <i data-lucide="search" style="position:absolute; left:10px; top:10px; width:14px; height:14px; color:var(--text-muted);"></i>
                <input type="text" id="modalOrgSearchInput" class="form-control" placeholder="?? ìµœí˜„?? ê°œë°œ, Pro, sjkim" style="padding-left:32px;" oninput="renderModalOrgTree(this.value)">
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
          <span style="font-weight:700; color:#94a3b8; font-size:0.75rem;">ì¡°ì§ ê³„í†µ??(ì´?62ëª?</span>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn btn-secondary btn-sm" style="padding:2px 8px; font-size:0.68rem;" onclick="expandAllModalOrgTree(true)">+ ?„ì²´ ?¼ì¹˜ê¸?/button>
            <button type="button" class="btn btn-secondary btn-sm" style="padding:2px 8px; font-size:0.68rem;" onclick="expandAllModalOrgTree(false)">- ?„ì²´ ?‘ê¸°</button>
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
              <span class="folder-count-badge" style="margin-left:auto; font-size:0.65rem; background:#1e293b; color:#93c5fd; padding:1px 6px; border-radius:10px;">${totalMembers}ëª?/span>
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
                              ${m.name} ${m.isMe ? `<span class="badge-me" style="font-size:0.6rem; background:#2563eb; color:#fff; padding:0 4px; border-radius:3px;">??/span>` : ''}
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
                          <i data-lucide="user-plus" style="width:12px; height:12px;"></i> ë°°ì† ì¶”ê?
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
        name: '?¼ëª¨?¤í…Œ?¬ë??¬ì?',
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
      const role = roleSelect ? roleSelect.value : 'Process Engineer (ê³µì •ê¸°ìˆ )';
      const fullNameWithPos = `${name} ${position}`;

      const existing = c.team.find(m => m.contact === email || m.name.includes(name));
      if (existing) {
        alert(`[${fullNameWithPos}] ?˜ì? ?´ë? CFT??ë°°ì†?˜ì–´ ?ˆìŠµ?ˆë‹¤. (${existing.role})`);
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
      alert(`?‰ [${fullNameWithPos}] ?˜ì´ D1 CFT [${role}]?¼ë¡œ ?±ê³µ?ìœ¼ë¡?ë°°ì†?˜ì—ˆ?µë‹ˆ??`);
    }

    function removeCFTMember(idx) {
      const c = getActiveCase();
      const member = c?.team?.[idx];
      if (!member) return;
      if (isProtectedCFTMember(member)) {
        alert('ê³ ê° ?€???´ë‹¹ê³??ˆì§ˆ ?¤ë¬´ ê°„ì‚¬???‘ìˆ˜Â·Triage ?¹ì¸ ?•ë³´?€ ?°ê²°???„ìˆ˜ ?´ë‹¹?ì…?ˆë‹¤. ?´ë‹¹??ë³€ê²½ì? ?´ë‹¹ ?ë³¸ ?¼ìš°?…ì—???˜í–‰??ì£¼ì„¸??');
        return;
      }
      if (confirm(`[${member.name}] ?˜ì„ D1 CFT??[${member.role}] ??• ?ì„œ ?œì™¸?˜ì‹œê² ìŠµ?ˆê¹Œ?`)) {
        c.team.splice(idx, 1);
        c.cftRecommendation = { ...(c.cftRecommendation || {}), humanConfirmed: false, status: 'Human Review Required' };
        saveAppData();
        renderCurrentView();
      }
    }


    function uploadEvidencePrompt() {
      const title = prompt('?±ë¡??Evidence ëª…ì¹­???…ë ¥?˜ì„¸??', 'SAT ì´ˆìŒ??ë¹„íŒŒê´´ê????±ì ??);
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
      alert(`? ê·œ ì¦ê±° [${newEvdId}]ê°€ ?±ë¡?˜ì—ˆ?µë‹ˆ??`);
      renderCurrentView();
    }

    function openAIAssistantModal() {
      const c = getActiveCase();
      const modal = document.getElementById('globalModal');
      const container = document.getElementById('modalContainer');

      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid var(--border); padding-bottom:12px;">
          <div style="font-size:1.1rem; font-weight:800; color:#60a5fa; display:flex; align-items:center; gap:8px;">
            <i data-lucide="sparkles" style="color:#38bdf8;"></i> AI ?„ìˆ˜ ?ˆì§ˆ ê°ì‚¬ ë³´ê³ ??(Case: ${c.id})
          </div>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('globalModal').style.display='none'">?«ê¸°</button>
        </div>

        <div style="font-size:0.84rem; line-height:1.6; color:#f8fafc;">
          <div style="background:#0e1628; border:1px solid var(--border); border-radius:var(--radius-sm); padding:14px; margin-bottom:12px;">
            <div style="font-weight:700; color:#34d399; margin-bottom:4px;">1. Fact & Evidence Traceability ê²€?? ?µê³¼ (100%)</div>
            <p style="color:#cbd5e1; font-size:0.8rem;">D2 Fact?€ D4 Root Cause ê°„ì˜ ë¬¼ë¦¬???±ì ??EVD-04, EVD-08)ê°€ ?„ë²½?˜ê²Œ ?°ê²°?˜ì–´ ?ˆìŠµ?ˆë‹¤.</p>
          </div>

          <div style="background:#0e1628; border:1px solid var(--border); border-radius:var(--radius-sm); padding:14px; margin-bottom:12px;">
            <div style="font-weight:700; color:#38bdf8; margin-bottom:4px;">2. ?˜ëŸ‰ ?•í•©??(Consistency) ê²€?? ?•ìƒ ?¼ì¹˜</div>
            <p style="color:#cbd5e1; font-size:0.8rem;">ê³ ê° ?¸ì… ë¶ˆëŸ‰ 12ea?€ D3 ? ë³„ ê²°ê³¼ NG 12eaê°€ ?•í™•???¼ì¹˜?˜ì—¬ ?°ì´???œê³¡???†ìŠµ?ˆë‹¤.</p>
          </div>

          <div style="background:#0e1628; border:1px solid var(--border); border-radius:var(--radius-sm); padding:14px;">
            <div style="font-weight:700; color:#fbbf24; margin-bottom:4px;">3. ê³ ê°???œì¶œ ì¤€ë¹„ë„: ì¦‰ì‹œ ?œì¶œ ê°€??(Ready for Submission)</div>
            <p style="color:#cbd5e1; font-size:0.8rem;">Final 8D ë¦¬í¬?¸ì˜ ê²°ì¬??Leader -> FA -> Director -> Customer)???„ê²°?˜ì—ˆ?µë‹ˆ??</p>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:20px;">
          <button class="btn btn-primary" onclick="document.getElementById('globalModal').style.display='none'; switchNav('reports-hub');">ê³µì‹ ë¦¬í¬???¸ì‡„ ?”ë©´?¼ë¡œ ?´ë™</button>
        </div>
      `;
      modal.style.display = 'flex';
      lucide.createIcons();
    }
