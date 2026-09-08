/* VIEW 4: EVIDENCE MATRIX & REPOSITORY                                      */
    /* ========================================================================= */
    function renderEvidenceHubView(c) {
      return `
        <div style="margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h1 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary); display:flex; align-items:center; gap:8px;">
              <i data-lucide="file-check-2" style="color: #a855f7;"></i> Evidence 중심 품질 증거 저장소 (Evidence Matrix)
            </h1>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">
              단순 파일 첨부가 아닌, Fact 입증 및 Root Cause 확정을 위해 D1~D8 단계와 양방향 연결된 신뢰성 증거 데이터입니다.
            </p>
          </div>
          <button class="btn btn-primary" onclick="uploadEvidencePrompt()"><i data-lucide="upload" style="width:14px;height:14px;"></i> 신규 증거 등록</button>
        </div>

        <div class="card">
          <table class="custom-table">
            <thead>
              <tr>
                <th>증거 ID (Evidence ID)</th>
                <th>증거 명칭 (Evidence Title)</th>
                <th>증거 유형</th>
                <th>파일명</th>
                <th>연결된 D 단계 (Traceability)</th>
                <th>열람</th>
              </tr>
            </thead>
            <tbody>
              ${c.evidenceList.map(evd => `
                <tr>
                  <td class="num-mono" style="font-weight:700; color:var(--accent);">${evd.id}</td>
                  <td style="font-weight:600; color:var(--text-primary);">${evd.title}</td>
                  <td><span class="badge-pill badge-purple">${evd.type}</span></td>
                  <td class="num-mono" style="font-size:0.75rem; color:var(--text-secondary);">${evd.file}</td>
                  <td>
                    ${evd.linkedStages.map(st => `<span class="badge-pill badge-ok" style="margin-right:3px;">${st}</span>`).join('')}
                  </td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="alert('증거 파일 [${evd.file}]를 다운로드 및 뷰어로 엽니다.')">
                      <i data-lucide="eye" style="width:12px; height:12px;"></i> 보기
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }