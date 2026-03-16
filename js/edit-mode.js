(function(){
  var body = document.body;
  var panel = document.getElementById('em-panel');
  var editMode = false, selectedEl = null, hoveredEl = null, tags = [], revealBadges = [];

  function toggleEdit() {
    editMode = !editMode;
    body.classList.toggle('edit-mode', editMode);
    if (editMode) buildTags(); else { clearTags(); deselect(); panel.classList.remove('open'); }
  }

  // ── Scaffolding tags ──
  function buildTags() {
    clearTags();
    var slide = document.querySelector('.slide.active');
    if (!slide) return;
    slide.querySelectorAll('.inner,.grid-2,.grid-3,.grid-4,.split,.card,.card-light,.card-ghost,.card-accent,.card-teal,.quote-block').forEach(function(el) {
      var tag = document.createElement('div');
      tag.className = 'em-tag';
      var cls = el.className.split(/\s+/).filter(function(c) { return !['center','left','full','active','anim-in','section','reveal-hidden'].includes(c); });
      var name = cls[0] || el.tagName.toLowerCase();
      tag.textContent = name;
      tag.classList.add(name === 'inner' ? 'em-tag-blue' : name.startsWith('grid') || name === 'split' ? 'em-tag-cyan' : name.startsWith('card') ? 'em-tag-orange' : 'em-tag-green');
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.appendChild(tag);
      tags.push({el: el, tag: tag});
    });
    buildRevealBadges();
  }
  function clearTags() { tags.forEach(function(t) { t.tag.remove(); }); tags = []; clearRevealBadges(); }

  // ── Hover ──
  function findTarget(el) {
    var inner = document.querySelector('.slide.active .inner');
    if (!inner || !inner.contains(el) || el === inner) return null;
    return el;
  }

  document.addEventListener('mouseover', function(e) {
    if (!editMode) return;
    if (panel.contains(e.target)) return;
    var t = findTarget(e.target);
    if (t) {
      if (hoveredEl && hoveredEl !== t) hoveredEl.classList.remove('em-hover');
      t.classList.add('em-hover'); hoveredEl = t;
    }
  });
  document.addEventListener('mouseout', function() { if (hoveredEl) { hoveredEl.classList.remove('em-hover'); hoveredEl = null; } });

  // ── Click to select ──
  document.addEventListener('click', function(e) {
    if (!editMode) return;
    if (panel.contains(e.target) || e.target.id === 'em-badge') return;
    var t = findTarget(e.target);
    if (t) { e.preventDefault(); e.stopPropagation(); selectEl(t); }
  }, true);

  function selectEl(el) {
    deselect(); selectedEl = el; el.classList.add('em-selected');
    fillPanel(el); panel.classList.add('open');
  }
  function deselect() { if (selectedEl) { selectedEl.classList.remove('em-selected'); selectedEl = null; } }

  function fillPanel(el) {
    var cls = Array.from(el.classList).filter(function(c) { return !['em-selected','em-hover','anim-in','active','reveal-hidden'].includes(c); }).join('.');
    document.getElementById('emp-el-info').textContent = el.tagName.toLowerCase() + (cls ? '.' + cls : '');
    document.getElementById('emp-reveal').value = el.dataset.reveal || '';
  }

  document.getElementById('emp-close').addEventListener('click', function() { deselect(); panel.classList.remove('open'); });

  // ── Path & label helpers ──
  function elPath(el) {
    var slide = el.closest('.slide');
    var path = [], node = el;
    while (node && node !== slide) {
      var p = node.parentElement;
      if (p) path.unshift(Array.from(p.children).indexOf(node));
      node = p;
    }
    return path;
  }

  function slideNum(el) {
    var slide = el.closest('.slide');
    return Array.from(document.querySelectorAll('.slide')).indexOf(slide) + 1; // 1-based
  }

  function elLabel(el) {
    // Build a readable label: parentClass > elementClass #nth (textPreview)
    var parent = el.parentElement;
    var parentCls = parent ? (parent.className || '').split(/\s+/).filter(function(c) {
      return c && !['center','left','full','active','anim-in','section','reveal-hidden','inner'].includes(c);
    })[0] : '';

    var elCls = (el.className || '').split(/\s+/).filter(function(c) {
      return c && !['em-selected','em-hover','anim-in','active','reveal-hidden'].includes(c);
    })[0] || el.tagName.toLowerCase();

    // Nth among same-class siblings
    var nth = 1;
    if (parent) {
      var siblings = parent.querySelectorAll(':scope > .' + elCls.replace(/[^\w-]/g, ''));
      if (siblings.length > 1) {
        for (var i = 0; i < siblings.length; i++) {
          if (siblings[i] === el) { nth = i + 1; break; }
        }
        elCls += ' #' + nth;
      }
    }

    var preview = (el.textContent || '').trim().substring(0, 20).replace(/\s+/g, ' ');
    var label = (parentCls ? parentCls + ' > ' : '') + elCls;
    if (preview) label += ' (' + preview + ')';
    return label;
  }

  // ── Collect & save reveals ──
  function collectReveals() {
    var entries = [];
    var slides = document.querySelectorAll('.slide');
    slides.forEach(function(slide, si) {
      slide.querySelectorAll('[data-reveal]').forEach(function(el) {
        var step = parseInt(el.dataset.reveal);
        if (!step || step < 1) return;
        entries.push({
          slide: si + 1,
          path: elPath(el),
          step: step,
          label: elLabel(el)
        });
      });
    });
    // Sort by slide, then step
    entries.sort(function(a, b) { return a.slide - b.slide || a.step - b.step; });
    return entries;
  }

  function saveReveals() {
    var json = JSON.stringify(collectReveals(), null, 2) + '\n';
    fetch('config/reveals.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json
    }).catch(function() {});
  }

  function setRevealOnEl(el, step) {
    if (step && step > 0) {
      el.setAttribute('data-reveal', step);
    } else {
      el.removeAttribute('data-reveal');
    }
    var slide = el.closest('.slide');
    if (window.revealInvalidate) window.revealInvalidate(slide);
    saveReveals();
    buildRevealBadges();
  }

  function maxRevealOnSlide(slide) {
    var max = 0;
    slide.querySelectorAll('[data-reveal]').forEach(function(el) {
      var n = parseInt(el.dataset.reveal);
      if (n > max) max = n;
    });
    return max;
  }

  // ── Reveal input handlers ──
  var revealInput = document.getElementById('emp-reveal');

  revealInput.addEventListener('change', function() {
    if (!selectedEl) return;
    setRevealOnEl(selectedEl, parseInt(revealInput.value) || 0);
  });
  revealInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && selectedEl) setRevealOnEl(selectedEl, parseInt(revealInput.value) || 0);
  });

  document.getElementById('emp-reveal-next').addEventListener('click', function() {
    if (!selectedEl) return;
    var slide = selectedEl.closest('.slide');
    var next = maxRevealOnSlide(slide) + 1;
    revealInput.value = next;
    setRevealOnEl(selectedEl, next);
  });

  document.getElementById('emp-reveal-clear').addEventListener('click', function() {
    if (!selectedEl) return;
    revealInput.value = '';
    setRevealOnEl(selectedEl, 0);
  });

  // ── Reveal badges ──
  function buildRevealBadges() {
    clearRevealBadges();
    if (!editMode) return;
    var slide = document.querySelector('.slide.active');
    if (!slide) return;
    slide.querySelectorAll('[data-reveal]').forEach(function(el) {
      var badge = document.createElement('div');
      badge.className = 'em-reveal-badge';
      badge.textContent = el.dataset.reveal;
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.appendChild(badge);
      revealBadges.push({ el: el, badge: badge });
    });
  }
  function clearRevealBadges() { revealBadges.forEach(function(b) { b.badge.remove(); }); revealBadges = []; }

  // ── Keyboard ──
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'e' && !e.ctrlKey && !e.metaKey) { e.preventDefault(); e.stopPropagation(); toggleEdit(); }
    if (e.key === 'Escape' && editMode) { deselect(); panel.classList.remove('open'); }
    if (editMode && selectedEl && e.key >= '0' && e.key <= '9') {
      e.preventDefault();
      var step = parseInt(e.key);
      revealInput.value = step || '';
      setRevealOnEl(selectedEl, step);
    }
  });

  // ── Rebuild on slide change ──
  var obs = new MutationObserver(function() { if (editMode) { deselect(); buildTags(); } });
  document.querySelectorAll('.slide').forEach(function(s) { obs.observe(s, {attributes:true, attributeFilter:['class']}); });
})();
