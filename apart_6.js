                title: { display: true, text: 'PID válaszvázlat (illusztráció)', color: '#e2e8f0' },
              },
            },
          })
        );
      }
    }
  }

  /* ---------- Mobile sidebar ---------- */
  function openSidebarMobile() {
    $('#sidebar') && $('#sidebar').classList.add('open');
    $('#sidebar-overlay') && $('#sidebar-overlay').classList.add('show');
  }
  function closeSidebarMobile() {
    $('#sidebar') && $('#sidebar').classList.remove('open');
    $('#sidebar-overlay') && $('#sidebar-overlay').classList.remove('show');
  }

  /* ---------- Init ---------- */
  function init() {
    renderNav();
    updateOverallProgress();

    const search = $('#search-input');
    if (search) {
      search.addEventListener('input', () => renderNav());
    }

    $('#menu-toggle') && $('#menu-toggle').addEventListener('click', openSidebarMobile);
    $('#sidebar-overlay') && $('#sidebar-overlay').addEventListener('click', closeSidebarMobile);
    $('#logo-home') && $('#logo-home').addEventListener('click', () => navigate('home'));

    const p = loadProgress();
    navigate('home');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
