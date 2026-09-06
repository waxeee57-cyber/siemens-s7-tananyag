    const emax = parseFloat($('#sc-emax').value);
    const out = $('#sc-out');
    if ([raw, rmin, rmax, emin, emax].some((x) => Number.isNaN(x))) {
      out.textContent = 'Érvénytelen szám.';
      return;
    }
    if (rmax === rmin) {
      out.textContent = 'Raw max nem egyezhet a raw min-nel.';
      return;
    }
    const eng = emin + ((raw - rmin) / (rmax - rmin)) * (emax - emin);
    const pct = ((raw - rmin) / (rmax - rmin)) * 100;
    out.textContent = `Mérnöki érték: ${eng.toFixed(4)}\nNyers arány: ${pct.toFixed(2)}%\nKéplet: eng = ${emin} + (${raw} − ${rmin}) / (${rmax} − ${rmin}) × (${emax} − ${emin})`;
  }

  /* ---------- Charts ---------- */
  function initCharts(mod) {
    if (typeof Chart === 'undefined') return;
    const charts = mod.charts || [];

    if (charts.includes('scan')) {
      const canvas = $('#chart-scan-cycle');
      if (canvas) {
        chartInstances.push(
          new Chart(canvas, {
            type: 'doughnut',
            data: {
              labels: ['I/O olvasás', 'Program', 'I/O írás', 'Kommunikáció / egyéb'],
              datasets: [
                {
                  data: [12, 55, 10, 23],
                  backgroundColor: ['#0891b2', '#06b6d4', '#22c55e', '#334155'],
                  borderWidth: 0,
                },
              ],
            },
            options: {
              plugins: {
                legend: { labels: { color: '#94a3b8' } },
                title: { display: true, text: 'Tipikus scan időarányok (%)', color: '#e2e8f0' },
              },
            },
          })
        );
      }
    }

    if (charts.includes('compare')) {
      const canvas = $('#chart-family-compare');
      if (canvas) {
        chartInstances.push(
          new Chart(canvas, {
            type: 'bar',
            data: {
              labels: ['Teljesítmény', 'I/O skálázhatóság', 'Motion', 'Safety választék', 'Egyszerűség'],
              datasets: [
                {
                  label: 'S7-1200',
                  data: [55, 45, 35, 50, 90],
                  backgroundColor: '#22c55e',
                },
                {
                  label: 'S7-1500',
                  data: [95, 95, 90, 95, 60],
                  backgroundColor: '#06b6d4',
                },
              ],
            },
            options: {
              scales: {
                y: { beginAtZero: true, max: 100, ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
                x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
              },
              plugins: {
                legend: { labels: { color: '#94a3b8' } },
                title: { display: true, text: 'Család összehasonlítás (relatív)', color: '#e2e8f0' },
              },
            },
          })
        );
      }
    }

    if (charts.includes('pid')) {
      const canvas = $('#chart-pid');
      if (canvas) {
        const n = 40;
        const sp = Array(n).fill(50);
        const pv = [];
        let y = 10;
        for (let i = 0; n > i; i++) {
          y += (50 - y) * 0.18 + (Math.sin(i / 3) * (15 > i ? 2 : 0.3));
          pv.push(y);
        }
        chartInstances.push(
          new Chart(canvas, {
            type: 'line',
            data: {
              labels: Array.from({ length: n }, (_, i) => i),
              datasets: [
                { label: 'SP', data: sp, borderColor: '#f59e0b', tension: 0, pointRadius: 0 },
                { label: 'PV (P-domináns válasz)', data: pv, borderColor: '#06b6d4', tension: 0.25, pointRadius: 0 },
              ],
            },
            options: {
              scales: {
                y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
                x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' }, title: { display: true, text: 'idő', color: '#64748b' } },
              },
              plugins: {
                legend: { labels: { color: '#94a3b8' } },
