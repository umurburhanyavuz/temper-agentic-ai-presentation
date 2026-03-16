(function() {
  // === Navigation & Animations ===

  const slides = document.querySelectorAll('.slide');
  const total = slides.length;
  let current = 0;
  const progress = document.getElementById('progress');
  const slidecount = document.getElementById('slidecount');
  const nav = document.getElementById('sidenav');

  // Build nav dots
  const sectionStarts = new Set();
  let lastSec = '';
  slides.forEach((s, i) => {
    const sec = s.dataset.section;
    if (sec !== lastSec) { sectionStarts.add(i); lastSec = sec; }
  });

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot' + (sectionStarts.has(i) ? ' section' : '');
    if (i === 0) d.classList.add('active');
    d.title = 'Slide ' + (i + 1);
    d.dataset.num = i + 1;
    d.addEventListener('click', () => goTo(i));
    nav.appendChild(d);
  });

  const dots = nav.querySelectorAll('.dot');

  function updateUI() {
    progress.style.width = ((current + 1) / total * 100) + '%';
    slidecount.textContent = (current + 1) + ' / ' + total;
    // Distance-based fade & blur on dots
    dots.forEach((d, i) => {
      const dist = Math.abs(i - current);
      if (dist === 0) {
        d.style.opacity = '1';
        d.style.filter = 'none';
      } else if (dist <= 3) {
        d.style.opacity = String(1 - dist * .15);
        d.style.filter = 'none';
      } else {
        const fade = Math.max(.15, 1 - dist * .12);
        const blur = Math.min((dist - 3) * .6, 2.5);
        d.style.opacity = String(fade);
        d.style.filter = 'blur(' + blur + 'px)';
      }
    });
  }
  updateUI();

  // Animation type per element — cycles for variety
  // Single subtle animation — consistent fade + slide up for all elements
  const animPool = ['up'];

  // Selectors for elements that should animate individually (leaf-level content blocks)
  const ANIM_SEL = [
    '.t-label', '.t-hero', '.t-display', '.t-body', '.t-title',
    'h1', 'h2', 'p',
    '.pill',
    '.card-light', '.card-ghost', '.card', '.card-accent', '.card-teal',
    '.vs-card',
    '.photo-card',
    '.tool-item',
    '.flow-step', '.flow-arrow',
    '.layer-row',
    '.quote-block',
    '.spectrum-bar',
    '.stat-big',
    '.num-badge',
    '.tbl',
    '.photo-inline',
    'img.icon-lg', 'img.icon-xl',
    'img[style*="height:clamp(140"]', // Q&A illustration
  ].join(',');

  // Wrapper selectors — if a match is inside one of these, animate the wrapper instead
  const WRAPPER_SEL = [
    '.card-light', '.card-ghost', '.card', '.card-accent', '.card-teal',
    '.vs-card', '.photo-card', '.tool-item',
    '.quote-block', '.tbl',
  ].join(',');

  function collectTargets(slide) {
    const inner = slide.querySelector('.inner');
    if (!inner) return [];

    // Strategy: walk .inner's direct children in DOM order.
    // For each direct child, if it's a simple element (heading, paragraph, pill) — add it.
    // If it's a layout container (grid, split, flow, div wrapper), add its visual children.
    const targets = [];
    const seen = new WeakSet();

    function addTarget(el) {
      if (seen.has(el)) return;
      seen.add(el);
      targets.push(el);
    }

    // Check if element is a layout wrapper (not a content block itself)
    function isLayout(el) {
      const tag = el.tagName;
      if (tag !== 'DIV') return false;
      const cl = el.classList;
      // Explicit content classes → not layout
      if (cl.contains('card-light') || cl.contains('card-ghost') || cl.contains('card') ||
          cl.contains('card-accent') || cl.contains('card-teal') || cl.contains('vs-card') ||
          cl.contains('quote-block') || cl.contains('pill') || cl.contains('photo-card')) return false;
      // Has grid/split/flow class or is a bare div with children → layout
      if (cl.contains('grid-2') || cl.contains('grid-3') || cl.contains('grid-4') ||
          cl.contains('split') || cl.contains('split-60-40') || cl.contains('split-40-60') ||
          cl.contains('flow') || cl.contains('tool-grid') || cl.contains('layer-stack')) return true;
      // Bare div wrapping flex rows (like the numbered action items)
      const style = el.getAttribute('style') || '';
      if (style.includes('flex-direction:column') || style.includes('display:flex') || style.includes('display:grid')) {
        // Only treat as layout if it has multiple child divs
        const childDivs = el.querySelectorAll(':scope > div, :scope > .tool-item, :scope > span');
        if (childDivs.length > 1) return true;
      }
      return false;
    }

    function walk(container, depth) {
      for (const child of container.children) {
        if (child.classList.contains('deco') || child.classList.contains('slide-photo-bg') ||
            child.tagName === 'IMG' && child.classList.contains('logo')) continue;

        if (depth < 3 && isLayout(child)) {
          // Recurse into layout containers
          walk(child, depth + 1);
        } else {
          addTarget(child);
        }
      }
    }

    walk(inner, 0);
    return targets;
  }

  function animateSlide(slide) {
    // Clean old animations
    slide.querySelectorAll('[data-a]').forEach(el => {
      el.classList.remove('anim-in');
      if (el.dataset.a !== 'stat') el.removeAttribute('data-a');
      el.style.removeProperty('--a-delay');
    });
    slide.querySelectorAll('.layer-row').forEach(r => r.style.removeProperty('--lr-delay'));

    const targets = collectTargets(slide);

    // Layer rows get their own cascade
    const layerRows = slide.querySelectorAll('.layer-row');
    layerRows.forEach((row, i) => {
      row.style.setProperty('--lr-delay', (.25 + i * .12) + 's');
    });

    // Photo card overlays
    slide.querySelectorAll('.photo-card-overlay').forEach((ov, i) => {
      ov.style.setProperty('--pc-delay', (.45 + i * .15) + 's');
    });

    // Assign animation type and stagger delay
    const baseDelay = 0.12;
    const stagger = 0.09;
    targets.forEach((el, i) => {
      el.dataset.a = el.dataset.a || animPool[i % animPool.length];
      el.style.setProperty('--a-delay', (baseDelay + i * stagger).toFixed(2) + 's');
      el.classList.remove('anim-in');
    });

    // Double-rAF to ensure browser paints the hidden state first
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        targets.forEach(el => el.classList.add('anim-in'));
      });
    });
  }

  function goTo(n) {
    if (n < 0 || n >= total || n === current) return;
    // Clean up old slide
    slides[current].querySelectorAll('[data-a]').forEach(el => {
      el.classList.remove('anim-in');
    });
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = n;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    updateUI();
    // Trigger entrance animations
    animateSlide(slides[current]);
    // Persist slide in URL hash
    history.replaceState(null, '', '#' + (current + 1));
  }

  // Restore slide from URL hash on load
  var startSlide = parseInt(location.hash.replace('#', '')) - 1;
  if (startSlide > 0 && startSlide < total) {
    slides[0].classList.remove('active');
    dots[0].classList.remove('active');
    current = startSlide;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    updateUI();
  }
  animateSlide(slides[current]);

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    if (e.key === 'End') { e.preventDefault(); goTo(total - 1); }
    document.getElementById('keyhint').style.opacity = '0';
  });

  document.getElementById('deck').addEventListener('click', e => {
    if (e.target.closest('#sidenav') || e.target.closest('a') || e.target.closest('button')) return;
    const x = e.clientX / window.innerWidth;
    if (x < 0.3) goTo(current - 1); else if (x > 0.7) goTo(current + 1);
  });

  setTimeout(() => { document.getElementById('keyhint').style.opacity = '0'; }, 4000);

  // ── COUNT-UP ANIMATION FOR STAT NUMBERS ──
  function countUp(el, target, suffix, duration) {
    const start = performance.now();
    const isFloat = target % 1 !== 0;
    el.classList.add('glow');
    // Find sibling fill element
    var card = el.closest('.stat-card');
    var fill = card ? card.querySelector('.stat-fill') : null;
    var fillTarget = fill ? parseFloat(fill.dataset.target) || 100 : 100;
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      // ease-out-quint
      const ease = 1 - Math.pow(1 - t, 5);
      const val = isFloat ? (target * ease).toFixed(1) : Math.round(target * ease);
      el.textContent = val + suffix;
      if (fill) fill.style.height = (ease * fillTarget) + '%';
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function parseStatValue(text) {
    const cleaned = text.trim();
    const num = parseFloat(cleaned);
    if (isNaN(num)) return null;
    const suffix = cleaned.replace(/[\d.]+/, '');
    return { num, suffix };
  }

  // Track which stats have already animated
  const animatedStats = new WeakSet();

  // Hook into goTo to trigger count-ups on slide entry
  const origGoTo = goTo;
  function triggerStatCountUps(slideEl) {
    const stats = slideEl.querySelectorAll('.stat-big');
    stats.forEach(el => {
      if (animatedStats.has(el)) {
        el.classList.add('glow');
        return;
      }
      const original = el.getAttribute('data-stat-original') || el.textContent;
      if (!el.getAttribute('data-stat-original')) el.setAttribute('data-stat-original', original);
      const parsed = parseStatValue(original);
      if (!parsed) return;
      animatedStats.add(el);
      el.textContent = '0' + parsed.suffix;
      setTimeout(() => countUp(el, parsed.num, parsed.suffix, 2200), 600);
    });
  }

  // Patch goTo
  const _origGoTo = goTo;
  goTo = function(n) {
    _origGoTo(n);
    triggerStatCountUps(slides[current]);
  };

  // Trigger for first slide if it has stats
  triggerStatCountUps(slides[0]);

  // ── GENERATE QR CODE FOR WORKSPACE STUDIO ──
  var qrEl = document.getElementById('qr-workspace-studio');
  if (qrEl && typeof QRCode !== 'undefined') {
    new QRCode(qrEl, {
      text: 'https://workspace.google.com/studio/',
      width: 88,
      height: 88,
      colorDark: '#0a2421',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  // ── TYPEWRITER EFFECT FOR PLOT TWIST TERMINAL ──
  var twEl = document.getElementById('typewriter-output');
  var twLines = [
    { type: 'cmd', text: '$ claude "Build a presentation about agentic AI for Temper Summit"' },
    { type: 'dim', text: '  Creating slides... Applying brand assets... Writing animations...' },
    { type: 'result', text: '✓ 23 slides generated — dark mode, staggered animations, research data' },
    { type: 'blank' },
    { type: 'cmd', text: '$ claude "Now add a plot twist revealing how this was made"' },
    { type: 'result', text: '✓ Done — you\'re looking at it right now' }
  ];
  var twRan = false;

  function typewriterRun() {
    if (!twEl || twRan) return;
    twRan = true;
    twEl.innerHTML = '';
    var lineIdx = 0;
    var charIdx = 0;
    var currentSpan = null;
    var cursor = document.createElement('span');
    cursor.style.cssText = 'display:inline-block;width:8px;height:1.1em;background:var(--green);vertical-align:text-bottom;animation:blink-cursor .7s step-end infinite;margin-left:2px';

    function getColor(type) {
      if (type === 'cmd') return 'var(--green)';
      if (type === 'dim') return 'rgba(255,255,255,.25)';
      return 'rgba(255,255,255,.75)';
    }

    function typeNext() {
      if (lineIdx >= twLines.length) {
        return;
      }
      var line = twLines[lineIdx];
      if (line.type === 'blank') {
        twEl.appendChild(document.createElement('br'));
        lineIdx++;
        setTimeout(typeNext, 200);
        return;
      }
      if (!currentSpan) {
        currentSpan = document.createElement('span');
        currentSpan.style.color = getColor(line.type);
        // For result lines, style the checkmark green
        twEl.appendChild(currentSpan);
        twEl.appendChild(cursor);
        charIdx = 0;
      }
      if (charIdx < line.text.length) {
        // Type checkmark in green for result lines
        if (line.type === 'result' && charIdx === 0) {
          var check = document.createElement('span');
          check.style.color = 'var(--green)';
          check.textContent = '✓';
          currentSpan.appendChild(check);
          charIdx = 1; // skip the ✓
          setTimeout(typeNext, 30);
          return;
        }
        currentSpan.appendChild(document.createTextNode(line.text[charIdx]));
        charIdx++;
        var delay = line.type === 'dim' ? 15 : 25;
        setTimeout(typeNext, delay);
      } else {
        twEl.appendChild(document.createElement('br'));
        currentSpan = null;
        lineIdx++;
        var pause = line.type === 'cmd' ? 600 : 300;
        setTimeout(typeNext, pause);
      }
    }

    setTimeout(typeNext, 800);
  }

  // Find the plot twist slide and trigger typewriter when it becomes active
  var plotSlide = twEl ? twEl.closest('.slide') : null;
  var plotSlideIdx = -1;
  if (plotSlide) {
    slides.forEach(function(s, i) { if (s === plotSlide) plotSlideIdx = i; });
  }

  // Patch goTo to trigger typewriter
  var _goToTW = goTo;
  goTo = function(n) {
    _goToTW(n);
    if (n === plotSlideIdx) typewriterRun();
  };
  // If starting on that slide
  if (current === plotSlideIdx) typewriterRun();

  // === Auto-fit: shrink-only safety net ===

  function fitSlide(slide) {
    const inner = slide.querySelector('.inner');
    if (!inner) return;
    inner.style.transform = '';
    inner.style.transformOrigin = '';
    const cs = getComputedStyle(slide);
    const slideH = slide.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const hdr = slide.querySelector('.slide-header');
    const hdrH = hdr ? hdr.offsetHeight + parseFloat(getComputedStyle(slide).gap || 0) : 0;
    const available = slideH - hdrH;
    const innerH = inner.scrollHeight;
    if (innerH > available) {
      const scale = Math.max(available / innerH, 0.65);
      inner.style.transform = 'scale(' + scale.toFixed(4) + ')';
      inner.style.transformOrigin = 'top center';
    }
  }
  function fitAll() { document.querySelectorAll('.slide').forEach(fitSlide); }
  fitAll();
  window.addEventListener('resize', fitAll);
  const obs = new MutationObserver(() => {
    const active = document.querySelector('.slide.active');
    if (active) fitSlide(active);
  });
  document.querySelectorAll('.slide').forEach(s => obs.observe(s, {attributes:true, attributeFilter:['class']}));
})();
