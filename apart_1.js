      navigate('home');
      return;
    }

    $('#breadcrumb').innerHTML = `\u003cspan>${mod.num}\u003c/span> · \u003cstrong>${escapeHtml(mod.title)}\u003c/strong>`;
    area.innerHTML = renderModule(mod);
    bindModuleInteractions(mod);
    // charts after DOM ready
    requestAnimationFrame(() => initCharts(mod));
  }

  function renderHome() {
    const { done, total, pct } = completionRatio();
    const cards = modules
      .map(
        (m) => `\u003cbutton type="button" class="home-mod-card" data-id="${m.id}">
        \u003cdiv class="hm-id">${m.num}\u003c/div>
        \u003cdiv class="hm-title">${escapeHtml(m.title)}\u003c/div>
        \u003cdiv class="hm-sub">${escapeHtml(m.short)}\u003c/div>
      \u003c/button>`
      )
      .join('');

    return `
      \u003cdiv class="welcome-hero">
        \u003ch2>${escapeHtml(content.title)}\u003c/h2>
        \u003cp>${escapeHtml(content.homeIntro)}\u003c/p>
        \u003cp style="color:#67e8f9;font-size:0.9rem;margin-bottom:1rem">Haladásod: \u003cstrong>${done}/${total}\u003c/strong> modul kész (${pct}%)\u003c/p>
        \u003cbutton type="button" class="btn btn-primary" id="btn-start">Kezdés / folytatás →\u003c/button>
        \u003cbutton type="button" class="btn btn-ghost" id="btn-reset-progress" style="margin-left:0.5rem">Haladás törlése\u003c/button>
      \u003c/div>
      \u003cp style="margin-bottom:1rem">\u003cimg src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MjAiIGhlaWdodD0iMzYwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTQyMDMwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiNlMmU4ZjAiIGZvbnQtZmFtaWx5PSJTZWdvZSBVSSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5TNyBDb3ZlcjwvdGV4dD48L3N2Zz4=" alt="Borítókép" style="width:100%;max-width:820px;border-radius:12px;border:1px solid #334155"/>\u003c/p>
      \u003ch3 style="margin-bottom:0.85rem">Modulok\u003c/h3>
      \u003cdiv class="home-modules">${cards}\u003c/div>
    `;
  }

  function bindHome() {
    $$('.home-mod-card').forEach((c) => c.addEventListener('click', () => navigate(c.dataset.id)));
    const start = $('#btn-start');
    if (start) {
      start.addEventListener('click', () => {
        const p = loadProgress();
        navigate(p.lastModule && p.lastModule !== 'home' ? p.lastModule : 'm0');
      });
    }
    const reset = $('#btn-reset-progress');
    if (reset) {
      reset.addEventListener('click', () => {
        if (confirm('Biztosan törlöd a helyi haladást és quiz pontszámokat?')) {
          localStorage.removeItem(STORAGE_KEY);
          renderNav();
          updateOverallProgress();
          navigate('home');
        }
      });
    }
  }

  function renderModule(mod) {
    const idx = modules.findIndex((m) => m.id === mod.id);
    const prev = idx > 0 ? modules[idx - 1] : null;
    const next = modules.length - 1 > idx ? modules[idx + 1] : null;
    const p = loadProgress();
    const score = p.scores[mod.id];

    const sections = (mod.sections || [])
      .map(
        (s) => `\u003csection class="section-block">\u003ch3>${escapeHtml(s.h)}\u003c/h3>${s.html}\u003c/section>`
      )
      .join('');

    const quizHtml = renderQuiz(mod);

    return `
      \u003cheader class="module-header">
        \u003cspan class="module-badge">${mod.num}\u003c/span>
        \u003ch2>${escapeHtml(mod.title)}\u003c/h2>
        \u003cp class="lead">${escapeHtml(mod.lead)}\u003c/p>
        ${score ? `\u003cp style="font-size:0.85rem;color:#22c55e;margin-top:0.5rem">Utolsó quiz: ${score.correct}/${score.total} (${score.pct}%)\u003c/p>` : ''}
      \u003c/header>
      ${sections}
      ${quizHtml}
      \u003cdiv class="mark-complete-bar">
        \u003cbutton type="button" class="btn btn-primary" id="btn-mark-done">Modul megjelölése késznek ✓\u003c/button>
        \u003cspan style="font-size:0.85rem;color:#94a3b8">A quiz kitöltése is menti a pontszámot.\u003c/span>
      \u003c/div>
      \u003cdiv class="nav-footer">
        ${prev ? `\u003cbutton type="button" class="btn btn-ghost" data-nav="${prev.id}">← ${prev.num}\u003c/button>` : '\u003cspan>\u003c/span>'}
