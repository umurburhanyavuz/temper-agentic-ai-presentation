(function(){
  const root = document.documentElement, body = document.body;
  const panel = document.getElementById('em-panel');
  const overlayBox = document.getElementById('em-overlays');
  let editMode = false, selectedEl = null, hoveredEl = null, tags = [];

  const SEL = '.inner,.grid-2,.grid-3,.grid-4,.split,.card,.card-light,.card-ghost,.card-accent,.card-teal,.t-display,.t-hero,.t-body,.t-title,.t-label,.quote-block,h2,h3,p,.flow-step,.stat-big,.diagram-box';

  // ── Toggle ──
  function toggleEdit() {
    editMode = !editMode;
    body.classList.toggle('edit-mode', editMode);
    if (editMode) buildTags(); else { clearTags(); clearOv(); deselect(); panel.classList.remove('open'); }
  }

  // ── Scaffolding tags ──
  function buildTags() {
    clearTags();
    const slide = document.querySelector('.slide.active');
    if (!slide) return;
    slide.querySelectorAll('.inner,.grid-2,.grid-3,.grid-4,.split,.card,.card-light,.card-ghost,.card-accent,.card-teal,.quote-block').forEach(el => {
      const tag = document.createElement('div');
      tag.className = 'em-tag';
      const cls = el.className.split(/\s+/).filter(c => !['center','left','full','active','anim-in','section'].includes(c));
      const name = cls[0] || el.tagName.toLowerCase();
      tag.textContent = name;
      tag.classList.add(name === 'inner' ? 'em-tag-blue' : name.startsWith('grid') || name === 'split' ? 'em-tag-cyan' : name.startsWith('card') ? 'em-tag-orange' : 'em-tag-green');
      const pos = getComputedStyle(el).position;
      if (pos === 'static') el.style.position = 'relative';
      el.appendChild(tag);
      tags.push({el, tag});
    });
  }
  function clearTags() { tags.forEach(t => { t.tag.remove(); }); tags = []; }

  // ── Hover ──
  document.addEventListener('mouseover', e => {
    if (!editMode) return;
    const slide = document.querySelector('.slide.active');
    if (!slide) return;
    const t = e.target.closest(SEL);
    if (t && slide.contains(t) && !panel.contains(t)) {
      if (hoveredEl && hoveredEl !== t) hoveredEl.classList.remove('em-hover');
      t.classList.add('em-hover'); hoveredEl = t;
    }
  });
  document.addEventListener('mouseout', () => { if (hoveredEl) { hoveredEl.classList.remove('em-hover'); hoveredEl = null; } });

  // ── Click to select ──
  document.addEventListener('click', e => {
    if (!editMode) return;
    if (panel.contains(e.target) || e.target.id === 'em-badge') return;
    const slide = document.querySelector('.slide.active');
    if (!slide) return;
    const t = e.target.closest(SEL);
    if (t && slide.contains(t)) { e.preventDefault(); e.stopPropagation(); selectEl(t); }
  }, true);

  function selectEl(el) {
    deselect(); selectedEl = el; el.classList.add('em-selected');
    fillPanel(el); drawOv(el); panel.classList.add('open');
    document.querySelectorAll('.emp-tab').forEach(t => t.classList.toggle('active', t.dataset.pane === 'element'));
    document.querySelectorAll('.emp-pane').forEach(p => p.classList.toggle('active', p.id === 'emp-element'));
  }
  function deselect() { if (selectedEl) { selectedEl.classList.remove('em-selected'); selectedEl = null; } clearOv(); }

  // ── Helpers ──
  function toKebab(s) { return s.replace(/([A-Z])/g, '-$1').toLowerCase(); }
  function applyProp(el, cssProp, val) { el.style.setProperty(toKebab(cssProp), val, 'important'); }
  function parsePx(v) { const m = String(v).match(/([\d.]+)/); return m ? parseFloat(m[1]) : 0; }
  function rgbToHex(rgb) {
    const m = rgb.match(/\d+/g); if (!m || m.length < 3) return '#ffffff';
    return '#' + m.slice(0,3).map(x => parseInt(x).toString(16).padStart(2,'0')).join('');
  }

  // ── Collapsible sections ──
  document.querySelectorAll('.emp-sec-title').forEach(t => t.addEventListener('click', () => t.parentElement.classList.toggle('open')));

  // ── Fill panel ──
  function fillPanel(el) {
    const cs = getComputedStyle(el);
    const cls = [...el.classList].filter(c => !['em-selected','em-hover','anim-in','active'].includes(c)).join('.');
    document.getElementById('emp-el-info').textContent = el.tagName.toLowerCase() + (cls ? '.' + cls : '');
    // Typography
    document.getElementById('emp-fs').value = cs.fontSize;
    document.getElementById('emp-ff').value = cs.fontFamily.includes('Poppins') ? "'Poppins', sans-serif" : cs.fontFamily.includes('Inter') ? "'Inter', sans-serif" : cs.fontFamily.includes('monospace') ? 'monospace' : 'system-ui';
    document.getElementById('emp-fw').value = cs.fontWeight;
    document.getElementById('emp-lh').value = cs.lineHeight;
    document.getElementById('emp-ls').value = cs.letterSpacing;
    document.getElementById('emp-ta').value = cs.textAlign;
    document.getElementById('emp-tt').value = cs.textTransform;
    document.getElementById('emp-co').value = cs.color;
    document.getElementById('emp-op').value = cs.opacity;
    // Box Model
    document.getElementById('emp-pad').value = cs.padding;
    document.getElementById('emp-mar').value = cs.margin;
    document.getElementById('emp-w').value = cs.width;
    document.getElementById('emp-mw').value = cs.maxWidth;
    document.getElementById('emp-gap').value = cs.gap || 'normal';
    document.getElementById('emp-br').value = cs.borderRadius;
    // Layout
    document.getElementById('emp-disp').value = cs.display;
    document.getElementById('emp-fd').value = cs.flexDirection;
    document.getElementById('emp-ai').value = cs.alignItems;
    document.getElementById('emp-jc').value = cs.justifyContent;
    document.getElementById('emp-fwrap').value = cs.flexWrap;
    document.getElementById('emp-pos').value = cs.position;
    document.getElementById('emp-ov').value = cs.overflow;
    // Background & Border
    document.getElementById('emp-bg').value = cs.background.substring(0, 80);
    document.getElementById('emp-bor').value = cs.border;
    document.getElementById('emp-bs').value = cs.boxShadow === 'none' ? 'none' : cs.boxShadow.substring(0, 80);
    document.getElementById('emp-bf').value = cs.backdropFilter || cs.webkitBackdropFilter || 'none';
    // Dimensions
    const r = el.getBoundingClientRect();
    document.getElementById('emp-sz').value = Math.round(r.width) + ' x ' + Math.round(r.height) + 'px';
    // Sliders
    document.getElementById('emp-fs-r').value = parsePx(cs.fontSize);
    document.getElementById('emp-lh-r').value = parsePx(cs.lineHeight);
    document.getElementById('emp-ls-r').value = parsePx(cs.letterSpacing) || 0;
    document.getElementById('emp-op-r').value = parseFloat(cs.opacity);
    document.getElementById('emp-pad-r').value = parsePx(cs.paddingTop);
    document.getElementById('emp-mar-r').value = parsePx(cs.marginTop);
    document.getElementById('emp-w-r').value = parsePx(cs.width);
    document.getElementById('emp-mw-r').value = cs.maxWidth === 'none' ? 1400 : parsePx(cs.maxWidth);
    document.getElementById('emp-gap-r').value = parsePx(cs.gap);
    document.getElementById('emp-br-r').value = parsePx(cs.borderRadius);
    // Color pickers
    try { document.getElementById('emp-co-pick').value = rgbToHex(cs.color); } catch(e){}
    try { document.getElementById('emp-bg-pick').value = rgbToHex(cs.backgroundColor); } catch(e){}
    // Unit selector: detect current unit
    const fsUnit = document.getElementById('emp-fs-unit');
    const inlineFs = el.style.getPropertyValue('font-size');
    if (inlineFs && inlineFs.match(/(vw|vh|em|rem)/)) fsUnit.value = inlineFs.match(/(vw|vh|em|rem)/)[1];
    else fsUnit.value = 'px';
  }

  // ── Slider configs: id → {cssProp, unit, textId} ──
  const sliderMap = {
    'emp-fs-r':  {css:'fontSize',    txt:'emp-fs', unit:()=>document.getElementById('emp-fs-unit').value},
    'emp-lh-r':  {css:'lineHeight',  txt:'emp-lh', unit:()=>'px'},
    'emp-ls-r':  {css:'letterSpacing',txt:'emp-ls', unit:()=>'px'},
    'emp-op-r':  {css:'opacity',     txt:'emp-op', unit:()=>''},
    'emp-pad-r': {css:'padding',     txt:'emp-pad',unit:()=>'px'},
    'emp-mar-r': {css:'margin',      txt:'emp-mar',unit:()=>'px'},
    'emp-w-r':   {css:'width',       txt:'emp-w',  unit:()=>'px'},
    'emp-mw-r':  {css:'maxWidth',    txt:'emp-mw', unit:()=>'px'},
    'emp-gap-r': {css:'gap',         txt:'emp-gap',unit:()=>'px'},
    'emp-br-r':  {css:'borderRadius',txt:'emp-br', unit:()=>'px'},
  };
  Object.entries(sliderMap).forEach(([sid, cfg]) => {
    const slider = document.getElementById(sid);
    slider.addEventListener('input', () => {
      if (!selectedEl) return;
      const val = slider.value + cfg.unit();
      document.getElementById(cfg.txt).value = val;
      applyProp(selectedEl, cfg.css, val);
      drawOv(selectedEl); saveElOverrides();
    });
  });

  // ── Dropdown selects ──
  const dropdownMap = {
    'emp-ff':'fontFamily','emp-fw':'fontWeight','emp-ta':'textAlign','emp-tt':'textTransform',
    'emp-disp':'display','emp-fd':'flexDirection','emp-ai':'alignItems','emp-jc':'justifyContent',
    'emp-fwrap':'flexWrap','emp-pos':'position','emp-ov':'overflow'
  };
  Object.entries(dropdownMap).forEach(([id, cssProp]) => {
    document.getElementById(id).addEventListener('change', function() {
      if (!selectedEl) return;
      applyProp(selectedEl, cssProp, this.value);
      drawOv(selectedEl); saveElOverrides();
    });
  });

  // ── Color pickers ──
  document.getElementById('emp-co-pick').addEventListener('input', function() {
    if (!selectedEl) return;
    document.getElementById('emp-co').value = this.value;
    applyProp(selectedEl, 'color', this.value);
    saveElOverrides();
  });
  document.getElementById('emp-bg-pick').addEventListener('input', function() {
    if (!selectedEl) return;
    document.getElementById('emp-bg').value = this.value;
    applyProp(selectedEl, 'background', this.value);
    saveElOverrides();
  });

  // ── Unit selector: convert current font-size when unit changes ──
  document.getElementById('emp-fs-unit').addEventListener('change', function() {
    if (!selectedEl) return;
    const cs = getComputedStyle(selectedEl);
    const pxVal = parseFloat(cs.fontSize);
    let newVal;
    if (this.value === 'px') newVal = Math.round(pxVal) + 'px';
    else if (this.value === 'vw') newVal = (pxVal / window.innerWidth * 100).toFixed(2) + 'vw';
    else if (this.value === 'vh') newVal = (pxVal / window.innerHeight * 100).toFixed(2) + 'vh';
    else if (this.value === 'em') newVal = (pxVal / 16).toFixed(2) + 'em';
    else if (this.value === 'rem') newVal = (pxVal / 16).toFixed(2) + 'rem';
    document.getElementById('emp-fs').value = newVal;
    applyProp(selectedEl, 'fontSize', newVal);
    saveElOverrides();
  });

  // ── Text inputs: Enter to apply, Arrow Up/Down to nudge ──
  const textProps = {fs:'fontSize',lh:'lineHeight',ls:'letterSpacing',co:'color',op:'opacity',pad:'padding',mar:'margin',w:'width',mw:'maxWidth',gap:'gap',br:'borderRadius',bg:'background',bor:'border',bs:'boxShadow',bf:'backdropFilter'};
  Object.entries(textProps).forEach(([id, cssProp]) => {
    const input = document.getElementById('emp-' + id);
    input.addEventListener('keydown', e => {
      if (!selectedEl) return;
      if (e.key === 'Enter') {
        applyProp(selectedEl, cssProp, input.value);
        drawOv(selectedEl); fillPanel(selectedEl); saveElOverrides();
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const m = input.value.match(/^([\d.]+)(px|vw|vh|em|rem|%)$/);
        if (m) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          let n = parseFloat(m[1]) + (e.key === 'ArrowUp' ? step : -step);
          if (n < 0) n = 0;
          input.value = n + m[2];
          applyProp(selectedEl, cssProp, input.value);
          // sync slider
          const slider = document.getElementById('emp-'+id+'-r');
          if (slider) slider.value = n;
          drawOv(selectedEl); saveElOverrides();
        }
      }
    });
  });

  // ── Box-model overlays ──
  function drawOv(el) {
    clearOv(); overlayBox.style.display = 'block';
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    const pt = parseFloat(cs.paddingTop), pr = parseFloat(cs.paddingRight);
    const pb = parseFloat(cs.paddingBottom), pl = parseFloat(cs.paddingLeft);
    if (pt > 1) mkOv(r.left, r.top, r.width, pt, pt + 'px', 'top');
    if (pb > 1) mkOv(r.left, r.bottom - pb, r.width, pb, pb + 'px', 'bot');
    if (pl > 1) mkOv(r.left, r.top + pt, pl, r.height - pt - pb, pl + 'px', 'left');
    if (pr > 1) mkOv(r.right - pr, r.top + pt, pr, r.height - pt - pb, pr + 'px', 'right');
    const gap = parseFloat(cs.gap);
    if (gap > 0) {
      const d = document.createElement('div');
      d.className = 'em-dim em-dim-gap'; d.textContent = 'gap ' + cs.gap;
      d.style.cssText = 'left:' + r.left + 'px;top:' + (r.bottom + 4) + 'px';
      overlayBox.appendChild(d);
    }
  }
  function mkOv(x, y, w, h, label, pos) {
    const ov = document.createElement('div');
    ov.className = 'em-ov em-ov-pad';
    ov.style.cssText = 'left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px';
    overlayBox.appendChild(ov);
    if (parseFloat(label) > 4) {
      const d = document.createElement('div');
      d.className = 'em-dim em-dim-pad'; d.textContent = label;
      if (pos==='top') d.style.cssText = 'left:'+(x+w/2-12)+'px;top:'+(y+1)+'px';
      else if (pos==='bot') d.style.cssText = 'left:'+(x+w/2-12)+'px;top:'+(y+h-12)+'px';
      else if (pos==='left') d.style.cssText = 'left:'+(x+1)+'px;top:'+(y+h/2-5)+'px';
      else d.style.cssText = 'left:'+(x+w-26)+'px;top:'+(y+h/2-5)+'px';
      overlayBox.appendChild(d);
    }
  }
  function clearOv() { overlayBox.innerHTML = ''; overlayBox.style.display = 'none'; }

  // ── Tabs ──
  document.querySelectorAll('.emp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.emp-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.emp-pane').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('emp-' + tab.dataset.pane).classList.add('active');
    });
  });
  document.getElementById('emp-close').addEventListener('click', () => { deselect(); panel.classList.remove('open'); });

  // ── Global sliders ──
  const GD = {'--hdr-px':'60','--sub-px':'28','--card-title-px':'24','--card-body-px':'20','--card-pad-px':'28','--grid-gap-px':'20','--inner-gap-px':'18','--label-px':'16'};
  try { const s = JSON.parse(localStorage.getItem('em-globals')); if (s) Object.entries(s).forEach(([p,v]) => { root.style.setProperty(p,v); const i = document.querySelector('[data-gp="'+p+'"]'); if(i){i.value=v;i.nextElementSibling.textContent=parseFloat(v).toFixed(1);} }); } catch(e){}
  document.querySelectorAll('[data-gp]').forEach(inp => {
    inp.addEventListener('input', () => {
      root.style.setProperty(inp.dataset.gp, inp.value);
      inp.nextElementSibling.textContent = parseFloat(inp.value).toFixed(1);
      const v = {}; document.querySelectorAll('[data-gp]').forEach(i => v[i.dataset.gp]=i.value);
      localStorage.setItem('em-globals', JSON.stringify(v));
      if (selectedEl) { fillPanel(selectedEl); drawOv(selectedEl); }
    });
  });

  // ── Per-element persistence ──
  function elKey(el) {
    const slide = el.closest('.slide');
    const idx = [...document.querySelectorAll('.slide')].indexOf(slide);
    const path = []; let node = el;
    while (node && node !== slide) { const p = node.parentElement; if(p){ path.unshift([...p.children].indexOf(node)); } node = p; }
    return 's'+idx+':'+path.join('.');
  }
  function saveElOverrides() {
    if (!selectedEl) return;
    const ov = JSON.parse(localStorage.getItem('em-overrides')||'{}');
    const s = selectedEl.style, props = {};
    for (let i = 0; i < s.length; i++) { const p = s[i]; if (p !== 'position') props[p] = s.getPropertyValue(p); }
    if (Object.keys(props).length) ov[elKey(selectedEl)] = props; else delete ov[elKey(selectedEl)];
    localStorage.setItem('em-overrides', JSON.stringify(ov));
  }
  function loadElOverrides() {
    try {
      const ov = JSON.parse(localStorage.getItem('em-overrides')||'{}');
      const slides = document.querySelectorAll('.slide');
      Object.entries(ov).forEach(([key, props]) => {
        const m = key.match(/^s(\d+):(.+)$/); if (!m) return;
        const slide = slides[parseInt(m[1])]; if (!slide) return;
        let el = slide;
        for (const idx of m[2].split('.').map(Number)) { if (el.children[idx]) el = el.children[idx]; else return; }
        Object.entries(props).forEach(([p,v]) => el.style.setProperty(p,v,'important'));
      });
    } catch(e){}
  }
  loadElOverrides();

  // ── Reset ──
  document.getElementById('emp-reset').addEventListener('click', () => {
    Object.entries(GD).forEach(([p,v]) => { root.style.setProperty(p,v); const i=document.querySelector('[data-gp="'+p+'"]'); if(i){i.value=v;i.nextElementSibling.textContent=parseFloat(v).toFixed(1);} });
    localStorage.removeItem('em-globals'); localStorage.removeItem('em-overrides');
    if (confirm('Reset all? Page will reload.')) location.reload();
  });

  // ── Export ──
  document.getElementById('emp-export').addEventListener('click', () => {
    let css = '/* Global Design Tokens */\n:root {\n';
    document.querySelectorAll('[data-gp]').forEach(i => css += '  '+i.dataset.gp+': '+i.value+';\n');
    css += '}\n';
    const ov = JSON.parse(localStorage.getItem('em-overrides')||'{}');
    if (Object.keys(ov).length) { css += '\n/* Per-Element Overrides */\n'; Object.entries(ov).forEach(([k,p]) => css += '/* '+k+' */ '+Object.entries(p).map(([a,b])=>a+':'+b).join('; ')+';\n'); }
    navigator.clipboard.writeText(css).then(() => { const b=document.getElementById('emp-export'); b.textContent='Copied!'; setTimeout(()=>b.textContent='Export CSS',1200); });
  });

  // ── Keyboard ──
  document.addEventListener('keydown', e => {
    if (e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
    if (e.key==='e' && !e.ctrlKey && !e.metaKey) { e.preventDefault(); e.stopPropagation(); toggleEdit(); }
    if (e.key==='Escape' && editMode) { deselect(); panel.classList.remove('open'); }
  });

  // ── Rebuild tags on slide change ──
  const obs = new MutationObserver(() => { if (editMode) { clearOv(); deselect(); buildTags(); } });
  document.querySelectorAll('.slide').forEach(s => obs.observe(s, {attributes:true, attributeFilter:['class']}));
})();
