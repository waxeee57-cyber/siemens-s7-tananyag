        out.textContent = 'Érvénytelen bit: 0…7 lehet bájton belül.';
        return;
      }
      out.textContent = `${s.toUpperCase()}\nTerület: ${area}\nBájtcím: ${m[2]}\nBit: ${bit} (LSB=0)\nMéret: 1 bit`;
      return;
    }
    // %IBx / %QBx / %MBx / %IWx / %QWx / %MWx / %IDx / %QDx / %MDx
    m = s.match(/^%([IQM])([BWD])(\d+)$/i);
    if (m) {
      const area = { I: 'Input', Q: 'Output', M: 'Memory' }[m[1].toUpperCase()];
      const size = { B: 'Byte (8 bit)', W: 'Word (16 bit, 2 bájt)', D: 'DWord (32 bit, 4 bájt)' }[m[2].toUpperCase()];
      const start = +m[3];
      const span = { B: 1, W: 2, D: 4 }[m[2].toUpperCase()];
      out.textContent = `${s.toUpperCase()}\nTerület: ${area}\nTípus: ${size}\nKezdő bájt: ${start}\nLefedett bájtok: ${start}…${start + span - 1}\nFigyelem: átfedés elkerülése más címekkel!`;
      return;
    }
    // %DBn.DBX x.y
    m = s.match(/^%DB(\d+)\.DBX(\d+)\.(\d+)$/i);
    if (m) {
      const bit = +m[3];
      if (bit > 7) {
        out.textContent = 'Érvénytelen bit (0…7).';
        return;
      }
      out.textContent = `${s.toUpperCase()}\nData Block: DB${m[1]}\nBájt: ${m[2]}, bit: ${bit}\nAbszolút bit a DB-ben (non-optimized layout esetén)`;
      return;
    }
    // %DBn.DBB/DBW/DBD
    m = s.match(/^%DB(\d+)\.DB([BWD])(\d+)$/i);
    if (m) {
      const size = { B: 'Byte', W: 'Word (2 bájt)', D: 'DWord (4 bájt)' }[m[2].toUpperCase()];
      const span = { B: 1, W: 2, D: 4 }[m[2].toUpperCase()];
      const start = +m[3];
      out.textContent = `${s.toUpperCase()}\nData Block: DB${m[1]}\nTípus: ${size}\nKezdő offset: ${start}\nBájtok: ${start}…${start + span - 1}\nOptimized DB-nél részesítsd előnyben a szimbolikus neveket.`;
      return;
    }

    out.textContent =
      'Nem ismertem fel a formátumot.\nPróbáld pl.: %I0.0, %Q1.3, %M10.2, %MW10, %MD20, %DB1.DBX0.0, %DB5.DBW2';
  }


  function initSapOrderFlow() {
    const root = $('#sap-order-flow');
    if (!root) return;
    const steps = $$('[data-sap-step]', root);
    if (!steps.length) return;
    let idx = 0;
    const status = $('#sap-flow-status');
    const show = (i) => {
      idx = Math.max(0, Math.min(i, steps.length - 1));
      steps.forEach((el, n) => {
        if (n === idx) el.classList.add('open');
        else el.classList.remove('open');
      });
      if (status) status.textContent = `Lépés ${idx + 1} / ${steps.length}`;
    };
    show(0);
    const nextBtn = $('#sap-flow-next');
    const resetBtn = $('#sap-flow-reset');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        show(idx >= steps.length - 1 ? 0 : idx + 1);
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', () => show(0));
    }
  }

  function initLadderSim() {
    const buttons = $$('.toggle-btn[data-bit]');
    if (!buttons.length) return;
    const state = { 'I0.0': false, 'I0.1': false, 'I0.2': false, 'I0.3': false };
    let sr = false;

    function refresh() {
      buttons.forEach((b) => {
        const bit = b.dataset.bit;
        b.classList.toggle('on', !!state[bit]);
      });
      const and = state['I0.0'] && state['I0.1'];
      const or = state['I0.0'] || state['I0.1'];
      if (state['I0.2']) sr = true;
      if (state['I0.3']) sr = false;
      const l0 = $('#lamp-q00');
      const l1 = $('#lamp-q01');
      const l2 = $('#lamp-q02');
      if (l0) l0.classList.toggle('on', and);
      if (l1) l1.classList.toggle('on', or);
      if (l2) l2.classList.toggle('on', sr);
    }

    buttons.forEach((b) => {
      b.addEventListener('click', () => {
        const bit = b.dataset.bit;
        state[bit] = !state[bit];
        // momentary feel for set/reset optional — keep toggle
        refresh();
      });
    });
    refresh();
  }

  function calcScale() {
    const raw = parseFloat($('#sc-raw').value);
    const rmin = parseFloat($('#sc-rmin').value);
    const rmax = parseFloat($('#sc-rmax').value);
    const emin = parseFloat($('#sc-emin').value);
