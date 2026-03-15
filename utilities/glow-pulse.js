/**
 * GlowPulse — reusable pulsing glow effect for SVG circles.
 *
 * Usage:
 *   GlowPulse.attach(svgCircleElement, options?)
 *   GlowPulse.attachById(id, options?)
 *   GlowPulse.attachPair(id1, id2, options?)  // two offset waves, always visible
 *
 * Options:
 *   baseR       — starting radius (default: reads from element's r attribute)
 *   minExpand   — minimum extra radius per pulse (default: 32)
 *   maxExpand   — maximum extra radius per pulse (default: 72)
 *   duration    — ms per pulse (default: 2000)
 *   peakOpacity — opacity at start of pulse (default: 0.4)
 *   offset      — delay before first pulse in ms (default: 0)
 */
window.GlowPulse = (function() {
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animate(el, opts) {
    const baseR = opts.baseR || parseFloat(el.getAttribute('r')) || 58;
    const expand = opts.minExpand + Math.random() * (opts.maxExpand - opts.minExpand);
    const maxR = baseR + expand;
    const dur = opts.duration;
    const peak = opts.peakOpacity;
    const t0 = performance.now();
    function frame(now) {
      const p = Math.min((now - t0) / dur, 1);
      const eased = easeOutCubic(p);
      el.setAttribute('r', baseR + (maxR - baseR) * eased);
      el.setAttribute('opacity', peak * (1 - eased));
      if (p < 1) requestAnimationFrame(frame);
      else animate(el, opts);
    }
    requestAnimationFrame(frame);
  }

  function resolveOpts(opts) {
    return Object.assign({
      baseR: null,
      minExpand: 32,
      maxExpand: 72,
      duration: 2000,
      peakOpacity: 0.4,
      offset: 0,
    }, opts || {});
  }

  return {
    attach: function(el, opts) {
      opts = resolveOpts(opts);
      if (opts.offset > 0) setTimeout(() => animate(el, opts), opts.offset);
      else animate(el, opts);
    },
    attachById: function(id, opts) {
      const el = document.getElementById(id);
      if (el) this.attach(el, opts);
    },
    attachPair: function(id1, id2, opts) {
      opts = resolveOpts(opts);
      this.attachById(id1, Object.assign({}, opts, { offset: 0 }));
      this.attachById(id2, Object.assign({}, opts, { offset: opts.duration / 2 }));
    }
  };
})();
