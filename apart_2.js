        ${next ? `\u003cbutton type="button" class="btn btn-ghost" data-nav="${next.id}">${next.num} →\u003c/button>` : '\u003cspan>\u003c/span>'}
      \u003c/div>
    `;
  }

  function renderQuiz(mod) {
    const questions = mod.quiz || [];
    const isFinal = mod.id === 'm15';
    const items = questions
      .map((qq, i) => {
        const opts = qq.options
          .map(
            (o, j) =>
              `\u003clabel class="quiz-opt" data-q="${i}" data-opt="${j}">\u003cinput type="radio" name="q${i}" value="${j}"/>\u003cspan>${escapeHtml(o)}\u003c/span>\u003c/label>`
          )
          .join('');
        return `\u003cdiv class="quiz-q" data-qi="${i}">
          \u003cdiv class="quiz-q-title">${i + 1}. ${escapeHtml(qq.q)}\u003c/div>
          \u003cdiv class="quiz-options">${opts}\u003c/div>
          \u003cdiv class="quiz-feedback" id="fb-${i}">\u003c/div>
        \u003c/div>`;
      })
      .join('');

    return `\u003csection class="quiz-section" id="quiz-section">
      \u003ch3>${isFinal ? 'Záróvizsga (20 kérdés)' : 'Modulzáró kvíz'}\u003c/h3>
      \u003cp style="color:#94a3b8;font-size:0.9rem;margin-bottom:0.5rem">Válassz választ, majd értékeld. Rossz válasznál magyarázat jelenik meg.\u003c/p>
      ${items}
      \u003cdiv class="quiz-actions">
        \u003cbutton type="button" class="btn btn-primary" id="btn-grade-quiz">Értékelés\u003c/button>
        \u003cbutton type="button" class="btn btn-ghost" id="btn-clear-quiz">Válaszok törlése\u003c/button>
      \u003c/div>
      \u003cdiv class="quiz-result" id="quiz-result">\u003c/div>
    \u003c/section>`;
  }

  /* ---------- Module interactions ---------- */
  function bindModuleInteractions(mod) {
    // expandables
    $$('[data-expand]').forEach((el) => {
      const btn = $('.expandable-btn', el);
      if (btn) {
        btn.addEventListener('click', () => el.classList.toggle('open'));
      }
    });

    // prev/next
    $$('[data-nav]').forEach((b) => b.addEventListener('click', () => navigate(b.dataset.nav)));

    $('#btn-mark-done') &&
      $('#btn-mark-done').addEventListener('click', () => {
        markCompleted(mod.id);
        alert('Modul késznek jelölve.');
      });

    // quiz
    $$('.quiz-opt').forEach((lab) => {
      lab.addEventListener('click', () => {
        const q = lab.dataset.q;
        $$(`.quiz-opt[data-q="${q}"]`).forEach((x) => x.classList.remove('selected'));
        lab.classList.add('selected');
        const inp = $('input', lab);
        if (inp) inp.checked = true;
      });
    });

    $('#btn-grade-quiz') &&
      $('#btn-grade-quiz').addEventListener('click', () => gradeQuiz(mod));
    $('#btn-clear-quiz') &&
      $('#btn-clear-quiz').addEventListener('click', () => {
        $$('.quiz-opt').forEach((o) => o.classList.remove('selected', 'correct', 'wrong'));
        $$('.quiz-feedback').forEach((f) => {
          f.className = 'quiz-feedback';
          f.textContent = '';
        });
        $$('input[type=radio]').forEach((r) => (r.checked = false));
        const res = $('#quiz-result');
        if (res) {
          res.className = 'quiz-result';
          res.innerHTML = '';
        }
      });

    // Address decoder (M3)
    const addrBtn = $('#addr-decode-btn');
    if (addrBtn) {
      addrBtn.addEventListener('click', decodeAddress);
      $('#addr-input') &&
        $('#addr-input').addEventListener('keydown', (e) => {
          if (e.key === 'Enter') decodeAddress();
        });
    }

    // Ladder simulator (M5)
    initLadderSim();

    // Scaling calculator (M11)
    const scBtn = $('#sc-btn');
    if (scBtn) scBtn.addEventListener('click', calcScale);

    // Rack hover (M2)
    $$('.rack-module').forEach((g) => {
      const info = $('#rack-info');
      const show = () => {
        if (info) info.textContent = g.getAttribute('data-info') || '';
      };
      g.addEventListener('mouseenter', show);
      g.addEventListener('click', show);
    });

    // Fault checker (M14)
    $$('.fault-item').forEach((item) => {
      const btn = $('button', item);
      if (btn) {
        btn.addEventListener('click', () => {
