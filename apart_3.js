          item.classList.toggle('open');
        });
      }
    });

    // SAP order flow step-through (M16)
    initSapOrderFlow();

    // SCL MC (M10)
    const sclMc = $('#scl-mc');
    if (sclMc) {
      $$('input', sclMc).forEach((inp) => {
        inp.addEventListener('change', () => {
          const fb = $('#scl-mc-fb');
          const ok = inp.value === '0';
          fb.className = 'quiz-feedback show ' + (ok ? 'ok' : 'bad');
          fb.textContent = ok
            ? 'Helyes! Az SCL FOR … DO … END_FOR; szintaxist használ.'
            : 'Nem egészen. A helyes forma: FOR i := 1 TO 10 DO … END_FOR;';
          $$('.quiz-opt', sclMc).forEach((o) => o.classList.remove('correct', 'wrong'));
          inp.closest('.quiz-opt').classList.add(ok ? 'correct' : 'wrong');
        });
      });
    }
  }

  function gradeQuiz(mod) {
    const questions = mod.quiz || [];
    let correct = 0;
    const weak = [];

    questions.forEach((qq, i) => {
      const selected = $(`input[name="q${i}"]:checked`);
      const fb = $(`#fb-${i}`);
      $$(`.quiz-opt[data-q="${i}"]`).forEach((o) => o.classList.remove('correct', 'wrong'));

      if (!selected) {
        if (fb) {
          fb.className = 'quiz-feedback show bad';
          fb.textContent = 'Nem válaszoltál. ' + qq.explain;
        }
        weak.push(i + 1);
        return;
      }
      const val = parseInt(selected.value, 10);
      const lab = selected.closest('.quiz-opt');
      if (val === qq.answer) {
        correct++;
        if (lab) lab.classList.add('correct');
        if (fb) {
          fb.className = 'quiz-feedback show ok';
          fb.textContent = 'Helyes! ' + qq.explain;
        }
      } else {
        if (lab) lab.classList.add('wrong');
        const rightLab = $(`.quiz-opt[data-q="${i}"][data-opt="${qq.answer}"]`);
        if (rightLab) rightLab.classList.add('correct');
        if (fb) {
          fb.className = 'quiz-feedback show bad';
          fb.textContent = 'Helytelen. ' + qq.explain;
        }
        weak.push(i + 1);
      }
    });

    const total = questions.length;
    const pct = Math.round((correct / total) * 100);
    markCompleted(mod.id, { correct, total, pct, weak });

    const res = $('#quiz-result');
    if (res) {
      res.className = 'quiz-result show';
      let html = `\u003cstrong>Eredmény: ${correct} / ${total} (${pct}%)\u003c/strong>`;
      if (mod.id === 'm15') {
        html += `\u003cdiv class="final-report">\u003cp>Záróvizsga értékelés\u003c/p>`;
        if (pct >= 80) html += `\u003cp style="color:#22c55e">Gratulálunk — mesterszintű eredmény!\u003c/p>`;
        else if (pct >= 60) html += `\u003cp style="color:#f59e0b">Jó alap — ismételd a gyenge témákat.\u003c/p>`;
        else html += `\u003cp style="color:#ef4444">Érdemes visszatérni a korábbi modulokhoz.\u003c/p>`;
        if (weak.length) {
          html += `\u003cp>Gyenge kérdések:\u003c/p>\u003cul class="weak-list">${weak.map((n) => `\u003cli>Kérdés ${n}\u003c/li>`).join('')}\u003c/ul>`;
          html += `\u003cp style="font-size:0.85rem;color:#94a3b8;margin-top:0.5rem">Javasolt ismétlés: M0–M14 megfelelő fejezetei a fenti kérdések témái alapján.\u003c/p>`;
        }
        html += `\u003c/div>`;
      } else if (weak.length) {
        html += `\u003cp style="margin-top:0.5rem;color:#94a3b8;font-size:0.9rem">Hibás / hiányzó: ${weak.join(', ')}. olvasd el újra a magyarázatokat.\u003c/p>`;
      }
      res.innerHTML = html;
    }
  }

  /* ---------- Simulators ---------- */
  function decodeAddress() {
    const raw = (($('#addr-input') && $('#addr-input').value) || '').trim();
    const out = $('#addr-output');
    if (!out) return;
    const s = raw.replace(/\s+/g, '');
    if (!s) {
      out.textContent = 'Írj be egy címet.';
      return;
    }

    // Patterns
    let m;
    // %Ix.y / %Qx.y / %Mx.y
    m = s.match(/^%([IQM])(\d+)\.(\d+)$/i);
    if (m) {
      const area = { I: 'Input (folyamatkép bemenet)', Q: 'Output (folyamatkép kimenet)', M: 'Memory / Merker' }[m[1].toUpperCase()];
      const bit = +m[3];
      if (bit > 7) {
