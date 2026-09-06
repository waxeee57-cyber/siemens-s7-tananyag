/**
 * Siemens S7 Tananyag — SPA logika
 * Progress key: s7-tananyag-progress
 */
(function () {
  'use strict';

  const STORAGE_KEY = 's7-tananyag-progress';
  const content = window.S7_CONTENT;
  if (!content || !content.modules) {
    console.error('S7_CONTENT hiányzik');
    return;
  }

  const modules = content.modules;
  let currentId = null;
  let chartInstances = [];

  /* ---------- Progress ---------- */
  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { completed: {}, scores: {}, lastModule: null };
      return JSON.parse(raw);
    } catch (e) {
      return { completed: {}, scores: {}, lastModule: null };
    }
  }

  function saveProgress(p) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }

  function getProgress() {
    return loadProgress();
  }

  function markCompleted(moduleId, scoreInfo) {
    const p = loadProgress();
    p.completed[moduleId] = true;
    if (scoreInfo) p.scores[moduleId] = scoreInfo;
    p.lastModule = moduleId;
    saveProgress(p);
    renderNav();
    updateOverallProgress();
  }

  function completionRatio() {
    const p = loadProgress();
    const n = modules.filter((m) => p.completed[m.id]).length;
    return { done: n, total: modules.length, pct: Math.round((n / modules.length) * 100) };
  }

  /* ---------- DOM helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function destroyCharts() {
    chartInstances.forEach((c) => {
      try { c.destroy(); } catch (e) {}
    });
    chartInstances = [];
  }

  /* ---------- Sidebar / Nav ---------- */
  function renderNav() {
    const nav = $('#module-nav');
    if (!nav) return;
    const p = loadProgress();
    const q = ($('#search-input') && $('#search-input').value || '').trim().toLowerCase();

    nav.innerHTML = modules
      .map((m) => {
        const done = !!p.completed[m.id];
        const active = m.id === currentId;
        const hay = (m.num + ' ' + m.title + ' ' + m.short + ' ' + (m.keywords || '')).toLowerCase();
        const hide = q && !hay.includes(q);
        return `\u003cbutton type="button" class="nav-item${active ? ' active' : ''}${done ? ' completed' : ''}${hide ? ' hidden-by-search' : ''}" data-id="${m.id}">
          \u003cspan class="nav-id">${m.num}\u003c/span>
          \u003cspan class="nav-meta">\u003cspan class="nav-title">${escapeHtml(m.title)}\u003c/span>\u003cspan class="nav-sub">${escapeHtml(m.short)}\u003c/span>\u003c/span>
          \u003cspan class="nav-check">${done ? '✓' : '○'}\u003c/span>
        \u003c/button>`;
      })
      .join('');

    $$('.nav-item', nav).forEach((btn) => {
      btn.addEventListener('click', () => navigate(btn.dataset.id));
    });
  }

  function updateOverallProgress() {
    const { done, total, pct } = completionRatio();
    const fill = $('#overall-progress-fill');
    const label = $('#overall-progress-label');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = `${done} / ${total} modul (${pct}%)`;
    const mini = $('#module-progress-mini');
    if (mini) mini.textContent = `Haladás: ${pct}%`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/\u003c/g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------- Navigation ---------- */
  function navigate(id) {
    destroyCharts();
    currentId = id;
    const p = loadProgress();
    p.lastModule = id;
    saveProgress(p);

    renderNav();
    updateOverallProgress();
    closeSidebarMobile();

    const area = $('#content-area');
    if (!area) return;

    if (id === 'home') {
      area.innerHTML = renderHome();
      bindHome();
      $('#breadcrumb').innerHTML = '\u003cstrong>Kezdőlap\u003c/strong>';
      area.classList.remove('fade');
      void area.offsetWidth;
      return;
    }

    const mod = modules.find((m) => m.id === id);
    if (!mod) {
