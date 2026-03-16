/**
 * Remote slide sync via Supabase Realtime Broadcast.
 *
 * Presenter sends 'next'/'prev' commands.
 * Audience dispatches synthetic ArrowRight/ArrowLeft — reveal.js + deck.js
 * handle the rest exactly as if the presenter pressed a key on the projector.
 * Audience broadcasts current slide on ANY change (remote or local).
 */
(function () {
  var SUPABASE_URL = 'https://nubrmjgjmmsktnpbkmlh.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51YnJtamdqbW1za3RucGJrbWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NzE5MjYsImV4cCI6MjA4OTI0NzkyNn0.5Uz4KMC0drOPG6xxs8XIpoOL7b8aYxD26TwrVnbm72o';

  window.__SUPABASE_URL = SUPABASE_URL;
  window.__SUPABASE_KEY = SUPABASE_KEY;

  // Only run on the audience (deck) page
  if (!document.getElementById('deck')) return;

  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  script.onload = function () {
    var sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    var channel = sb.channel('presenter-remote');

    function broadcastSlide() {
      var current = typeof window.deckGetCurrent === 'function' ? window.deckGetCurrent() : 0;
      channel.send({ type: 'broadcast', event: 'slide-update', payload: { slide: current } });
      // Persist to DB for page-refresh recovery
      sb.from('presentation_state').update({ slide: current + 1, updated_at: new Date().toISOString() }).eq('id', 1).then(function () {});
    }

    // Listen for commands from presenter
    channel.on('broadcast', { event: 'command' }, function (payload) {
      var dir = payload.payload.direction;
      var key = dir === 'prev' ? 'ArrowLeft' : 'ArrowRight';
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: key, bubbles: true, cancelable: true
      }));
      // Broadcast back after reveal/deck processes the key
      setTimeout(broadcastSlide, 100);
    });

    channel.subscribe();

    // Watch for ANY slide change (local keyboard, click, sidenav, etc.)
    var lastBroadcast = -1;
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var el = mutations[i].target;
        if (el.classList.contains('slide') && el.classList.contains('active')) {
          var current = typeof window.deckGetCurrent === 'function' ? window.deckGetCurrent() : 0;
          if (current !== lastBroadcast) {
            lastBroadcast = current;
            broadcastSlide();
          }
        }
      }
    });
    document.querySelectorAll('.slide').forEach(function (s) {
      observer.observe(s, { attributes: true, attributeFilter: ['class'] });
    });
  };
  document.head.appendChild(script);
})();
