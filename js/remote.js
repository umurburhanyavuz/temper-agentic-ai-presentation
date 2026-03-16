/**
 * Remote slide sync via Supabase Realtime.
 *
 * Room-based: audience pages with ?room=XXXX pair with the presenter.
 * DB is source of truth — presenter writes, audience reads on connect.
 * Presence tracks whether an audience page is live in the room.
 */
(function () {
  var SUPABASE_URL = 'https://nubrmjgjmmsktnpbkmlh.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51YnJtamdqbW1za3RucGJrbWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NzE5MjYsImV4cCI6MjA4OTI0NzkyNn0.5Uz4KMC0drOPG6xxs8XIpoOL7b8aYxD26TwrVnbm72o';

  window.__SUPABASE_URL = SUPABASE_URL;
  window.__SUPABASE_KEY = SUPABASE_KEY;

  if (!document.getElementById('deck')) return;

  var params = new URLSearchParams(window.location.search);
  var room = params.get('room');
  if (!room) return;
  window.__REMOTE_ROOM = room;

  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  script.onload = function () {
    var sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    var channel = sb.channel('room-' + room);

    function broadcastSlide() {
      var current = typeof window.deckGetCurrent === 'function' ? window.deckGetCurrent() : 0;
      channel.send({ type: 'broadcast', event: 'slide-update', payload: { slide: current } });
    }

    // Listen for commands from presenter
    channel.on('broadcast', { event: 'command' }, function (payload) {
      var dir = payload.payload.direction;
      var key = dir === 'prev' ? 'ArrowLeft' : 'ArrowRight';
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: key, bubbles: true, cancelable: true
      }));
      setTimeout(broadcastSlide, 100);
    });

    // Track presence so presenter knows we're here
    channel.on('presence', { event: 'sync' }, function () {});

    channel.subscribe(function (status) {
      if (status === 'SUBSCRIBED') {
        channel.track({ role: 'audience', room: room });

        // On connect: read current slide from DB and jump there
        sb.from('presentation_state').select('slide').eq('room', room).single().then(function (res) {
          if (res.data && res.data.slide >= 1) {
            var target = res.data.slide - 1;
            var current = typeof window.deckGetCurrent === 'function' ? window.deckGetCurrent() : 0;
            if (target !== current) {
              window.dispatchEvent(new CustomEvent('remote-goto', { detail: { slide: target } }));
            }
          }
        });
      }
    });

    // Watch for ANY slide change and broadcast back
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

    // Room badge — hidden by default, toggle with E
    var badge = document.createElement('div');
    badge.textContent = 'ROOM: ' + room;
    badge.style.cssText = 'position:fixed;top:8px;left:50%;transform:translateX(-50%);background:rgba(61,215,108,.15);color:#3dd76c;font-family:Poppins,sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;padding:4px 14px;border-radius:20px;z-index:9999;pointer-events:none;opacity:0;transition:opacity .3s';
    document.body.appendChild(badge);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'e' || e.key === 'E') {
        badge.style.opacity = badge.style.opacity === '0' ? '.6' : '0';
      }
    });
  };
  document.head.appendChild(script);
})();
