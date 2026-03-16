/**
 * Sequential Reveal System
 *
 * Reads reveals.json (array of {slide, path, step, label}),
 * applies data-reveal attributes, then intercepts navigation
 * to show elements step-by-step.
 */
(function () {
  'use strict';

  var slideState = new WeakMap();
  var pendingDirection = null;
  var initialized = false;

  window.revealInvalidate = function (slide) {
    if (slide) slideState.delete(slide);
  };

  function resolveEntry(entry) {
    var slides = document.querySelectorAll('.slide');
    var slide = slides[entry.slide - 1]; // 1-based in JSON
    if (!slide) return null;
    var el = slide;
    for (var i = 0; i < entry.path.length; i++) {
      if (el.children[entry.path[i]]) el = el.children[entry.path[i]];
      else return null;
    }
    return el;
  }

  function getState(slide) {
    if (slideState.has(slide)) return slideState.get(slide);
    var els = slide.querySelectorAll('[data-reveal]');
    if (els.length === 0) return null;
    var steps = new Map();
    var max = 0;
    els.forEach(function (el) {
      var n = parseInt(el.dataset.reveal, 10);
      if (isNaN(n) || n < 1) return;
      if (!steps.has(n)) steps.set(n, []);
      steps.get(n).push(el);
      if (n > max) max = n;
    });
    if (max === 0) return null;
    var state = { steps: steps, current: 0, max: max };
    slideState.set(slide, state);
    return state;
  }

  function activeSlide() { return document.querySelector('.slide.active'); }

  function clearRevealClasses(el) {
    el.classList.remove('reveal-hidden', 'reveal-visible', 'reveal-visible-instant');
  }

  function hideAll(state) {
    state.steps.forEach(function (els) {
      els.forEach(function (el) {
        clearRevealClasses(el);
        el.classList.add('reveal-hidden');
      });
    });
    state.current = 0;
  }

  function showAll(state) {
    state.steps.forEach(function (els) {
      els.forEach(function (el) {
        clearRevealClasses(el);
        el.classList.add('reveal-visible-instant');
      });
    });
    state.current = state.max;
  }

  function revealStep(state, step) {
    var els = state.steps.get(step);
    if (!els) return;
    els.forEach(function (el, i) {
      el.style.setProperty('--a-delay', (i * 0.09).toFixed(2) + 's');
      clearRevealClasses(el);
      el.classList.add('reveal-hidden');
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        els.forEach(function (el) {
          el.classList.remove('reveal-hidden');
          el.classList.add('reveal-visible');
        });
      });
    });
    state.current = step;
  }

  function hideStep(state, step) {
    var els = state.steps.get(step);
    if (!els) return;
    els.forEach(function (el) {
      clearRevealClasses(el);
      el.classList.add('reveal-hidden');
    });
    state.current = step - 1;
  }

  function init() {
    if (initialized) return;
    initialized = true;
    var slide = activeSlide();
    if (slide) {
      var state = getState(slide);
      if (state) hideAll(state);
    }
  }

  // Fetch reveals.json, apply data-reveal attributes, then init
  fetch('config/reveals.json')
    .then(function (r) { return r.ok ? r.json() : []; })
    .catch(function () { return []; })
    .then(function (entries) {
      entries.forEach(function (entry) {
        var el = resolveEntry(entry);
        if (el) el.setAttribute('data-reveal', entry.step);
      });
      init();
    });

  // --- Capture-phase keydown ---
  document.addEventListener('keydown', function (e) {
    if (!initialized || document.body.classList.contains('edit-mode')) return;
    var slide = activeSlide();
    if (!slide) return;
    var state = getState(slide);

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      if (state && state.current < state.max) {
        e.preventDefault(); e.stopImmediatePropagation();
        revealStep(state, state.current + 1);
        return;
      }
      pendingDirection = 'forward'; return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      if (state && state.current > 0) {
        e.preventDefault(); e.stopImmediatePropagation();
        hideStep(state, state.current);
        return;
      }
      pendingDirection = 'backward'; return;
    }
    if (e.key === 'Home' || e.key === 'End') pendingDirection = 'forward';
  }, { capture: true });

  // --- Capture-phase click ---
  document.getElementById('deck').addEventListener('click', function (e) {
    if (!initialized || document.body.classList.contains('edit-mode')) return;
    if (e.target.closest('#sidenav') || e.target.closest('a') || e.target.closest('button')) {
      pendingDirection = 'forward'; return;
    }
    var x = e.clientX / window.innerWidth;
    var slide = activeSlide();
    if (!slide) return;
    var state = getState(slide);
    if (x > 0.7) {
      if (state && state.current < state.max) { e.stopImmediatePropagation(); revealStep(state, state.current + 1); return; }
      pendingDirection = 'forward';
    } else if (x < 0.3) {
      if (state && state.current > 0) { e.stopImmediatePropagation(); hideStep(state, state.current); return; }
      pendingDirection = 'backward';
    }
  }, { capture: true });

  // --- Slide change observer ---
  var observer = new MutationObserver(function (mutations) {
    if (!initialized) return;
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.attributeName !== 'class') continue;
      var el = m.target;
      if (!el.classList.contains('slide') || !el.classList.contains('active')) continue;
      var state = getState(el);
      if (!state) { pendingDirection = null; return; }
      var dir = pendingDirection || 'forward';
      pendingDirection = null;
      if (dir === 'backward') showAll(state); else hideAll(state);
    }
  });
  document.querySelectorAll('.slide').forEach(function (s) {
    observer.observe(s, { attributes: true, attributeFilter: ['class'] });
  });
})();
