(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (n, a, b) { return Math.min(b, Math.max(a, n)); };

  /* 1. Headlines: words rise in (hero on load, section titles when they scroll into view) */
  $$('[data-split], [data-split-scroll]').forEach(function (h) {
    var text = h.textContent.trim().replace(/\s+/g, ' ');
    h.setAttribute('aria-label', text);
    if (reduce) return;
    h.textContent = '';
    text.split(' ').forEach(function (word, i) {
      var w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
      var s = document.createElement('span'); s.textContent = word; s.style.setProperty('--i', i);
      w.appendChild(s); h.appendChild(w); h.appendChild(document.createTextNode(' '));
    });
  });

  /* icons draw themselves */
  $$('.ico svg *').forEach(function (el) { el.setAttribute('pathLength', '1'); });

  /* 2. Scroll reveal with stagger (data-reveal is removed afterwards so hover effects work) */
  var revealEls = $$('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.removeAttribute('data-reveal'); el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target; io.unobserve(el);
        el.classList.add('in');
        setTimeout(function () { el.removeAttribute('data-reveal'); el.style.removeProperty('--d'); }, 1500);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
    revealEls.forEach(function (el) { el.style.setProperty('--d', el.dataset.delay || 0); io.observe(el); });
  }
  $$('.pillar').forEach(function (p) { if (!p.hasAttribute('data-reveal')) p.classList.add('in'); });

  /* 3. Scroll-linked: progress bar, header, watermark parallax, timeline line, back to top */
  var bar = $('.progress'), header = $('.site-header'), hero = $('.hero'), tl = $('.timeline'), totop = $('.totop');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY, max = root.scrollHeight - window.innerHeight, p = max > 0 ? y / max : 0;
    bar.style.transform = 'scaleX(' + p + ')';
    header.classList.toggle('scrolled', y > 10);
    if (!reduce) hero.style.setProperty('--sy', y);
    if (tl) {
      var r = tl.getBoundingClientRect();
      tl.style.setProperty('--p', clamp((window.innerHeight * 0.65 - r.top) / r.height, 0, 1));
    }
    totop.style.setProperty('--pp', p);
    totop.classList.toggle('show', y > 700);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* 4. Pointer effects: hero glow, video card tilt, magnetic button, click ripple */
  if (fine && !reduce) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    $$('.vcard').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        if (c.classList.contains('playing')) return;
        var r = c.getBoundingClientRect();
        c.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 10 + 'deg');
        c.style.setProperty('--rx', -((e.clientY - r.top) / r.height - 0.5) * 8 + 'deg');
      });
      c.addEventListener('pointerleave', function () { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });
    $$('[data-magnetic]').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * 0.22 + 'px,' + (e.clientY - r.top - r.height / 2) * 0.32 + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }
  $$('.btn-grad').forEach(function (b) {
    b.addEventListener('click', function (e) {
      if (reduce) return;
      var r = b.getBoundingClientRect(), s = document.createElement('span'), d = Math.max(r.width, r.height);
      s.className = 'ripple'; s.style.width = s.style.height = d + 'px';
      s.style.left = (e.clientX - r.left - d / 2) + 'px'; s.style.top = (e.clientY - r.top - d / 2) + 'px';
      b.appendChild(s); setTimeout(function () { s.remove(); }, 700);
    });
  });

  /* 5. Nav: mobile toggle and highlight of the current section */
  var toggle = $('.nav-toggle'), nav = $('#site-nav');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); } });
  var spyMap = { hero: 'top', 'statement-band': 'top', about: 'about', story: 'about', solutions: 'solutions', clients: 'solutions', news: 'solutions', contact: 'contact' };
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var key = spyMap[en.target.id] || spyMap[en.target.className.split(' ')[0]];
        $$('#site-nav a').forEach(function (a) { a.classList.toggle('current', a.dataset.spy === key); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('.hero, .statement-band, #about, #story, #solutions, #clients, #news, #contact').forEach(function (s) { spy.observe(s); });
  }

  /* 6. Testimonial quotes: auto-rotate, pause on hover, dots */
  var quotes = $$('.quote'), dots = $$('.dot'), qi = 0, timer;
  function showQuote(i) {
    qi = (i + quotes.length) % quotes.length;
    quotes.forEach(function (q, n) { q.classList.toggle('active', n === qi); });
    dots.forEach(function (d, n) { d.classList.toggle('active', n === qi); });
  }
  function play() { if (!reduce) { clearInterval(timer); timer = setInterval(function () { showQuote(qi + 1); }, 6500); } }
  dots.forEach(function (d, n) { d.addEventListener('click', function () { showQuote(n); play(); }); });
  var qbox = $('.quotes');
  qbox.addEventListener('mouseenter', function () { clearInterval(timer); });
  qbox.addEventListener('mouseleave', play);
  play();

  /* 7. Videos: play inline. One card at a time autoplays (muted) when it scrolls into view.
        Click a card to play it with sound. Visitors who prefer reduced motion get no autoplay. */
  var cards = $$('.vcard'), ratios = new Map(), playing = null;
  function vsrc(card, muted) {
    return 'https://player.vimeo.com/video/' + card.dataset.vimeo + '?h=' + card.dataset.h +
      '&autoplay=1&muted=' + (muted ? 1 : 0) + '&playsinline=1&title=0&byline=0&portrait=0';
  }
  function startCard(card, muted) {
    if (playing && playing !== card) stopCard(playing);
    var f = $('.vframe', card);
    f.classList.remove('ready'); f.src = vsrc(card, muted);
    card.classList.add('playing'); card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg');
    $('.vsound', card).hidden = !muted;
    playing = card;
  }
  function stopCard(card) {
    var f = $('.vframe', card);
    f.removeAttribute('src'); f.classList.remove('ready'); card.classList.remove('playing');
    $('.vsound', card).hidden = true;
    if (playing === card) playing = null;
  }
  $$('.vframe').forEach(function (f) { f.addEventListener('load', function () { if (f.getAttribute('src')) f.classList.add('ready'); }); });
  cards.forEach(function (card) {
    $('.vhit', card).addEventListener('click', function () { startCard(card, false); });
    $('.vsound', card).addEventListener('click', function (e) {
      var f = $('.vframe', card), post = function (m, v) { try { f.contentWindow.postMessage(JSON.stringify({ method: m, value: v }), 'https://player.vimeo.com'); } catch (x) {} };
      post('setMuted', false); post('setVolume', 1); post('play');
      e.currentTarget.hidden = true;
    });
    $('.venlarge', card).addEventListener('click', function (e) {
      e.stopPropagation();
      startCard(card, false);
      var req = card.requestFullscreen || card.webkitRequestFullscreen;
      if (req) { try { req.call(card); } catch (x) {} }
    });
  });
  if (!reduce && 'IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { ratios.set(en.target, en.intersectionRatio); });
      if (playing && (ratios.get(playing) || 0) < 0.25) stopCard(playing);
      if (!playing) {
        var next = cards.filter(function (c) { return (ratios.get(c) || 0) >= 0.6; })[0];
        if (next) startCard(next, true);
      }
    }, { threshold: [0, 0.25, 0.6, 0.9] });
    cards.forEach(function (c) { vio.observe(c); });
  }

  /* 8. Contact: toast, copy address, lazy map, form with progress, success state */
  var toastEl = $('.toast'), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
  }
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.dataset.copy;
      var done = function () { toast('Address copied'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
      function fallback() {
        var t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); done(); } catch (e) { toast('Copy is not available in this browser'); }
        t.remove();
      }
    });
  });

  var mapbox = $('#mapbox'), map = $('#map');
  function loadMap() { if (!map.getAttribute('src')) map.setAttribute('src', map.dataset.src); }
  map.addEventListener('load', function () { if (map.getAttribute('src')) mapbox.classList.add('loaded'); });
  if ('IntersectionObserver' in window) {
    var mio = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { loadMap(); mio.disconnect(); } }, { rootMargin: '300px' });
    mio.observe(mapbox);
  } else { loadMap(); }

  var form = $('#contact-form'), status = $('#form-status'), submitBtn = $('button[type=submit]', form);
  var formbody = $('.formbody'), success = $('.success'), fcount = $('#fcount'), fbar = $('.fprogress');
  var msgBox = $('#message'), counter = $('#counter');
  function progress() {
    var names = ['name', 'company', 'phone', 'email'], n = 0;
    names.forEach(function (k) { var el = form.elements[k]; if (el.value.trim() && el.checkValidity()) n++; });
    if (form.querySelector('input[name=affiliation]:checked')) n++;
    fbar.style.setProperty('--fill', n / 5);
    fcount.textContent = n === 5 ? 'All set. Ready to send.' : n + ' of 5 required fields done';
  }
  form.addEventListener('input', progress); form.addEventListener('change', progress);
  msgBox.addEventListener('input', function () { counter.textContent = msgBox.value.length + '/500'; });
  progress();

  function showSuccess(demo) {
    submitBtn.classList.remove('loading'); submitBtn.disabled = false;
    formbody.hidden = true; success.hidden = false;
    $('.demo-note', success).hidden = !demo;
    success.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }
  $('#again').addEventListener('click', function () {
    form.reset(); counter.textContent = '0/500'; progress(); status.textContent = '';
    success.hidden = true; formbody.hidden = false;
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault(); status.className = 'status'; status.textContent = '';
    if (!form.checkValidity()) { form.reportValidity(); return; }
    submitBtn.classList.add('loading'); submitBtn.disabled = true;
    if (form.action.indexOf('YOUR_FORM_ID') !== -1) { setTimeout(function () { showSuccess(true); }, 1100); return; }
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(); form.reset(); counter.textContent = '0/500'; progress(); showSuccess(false); })
      .catch(function () {
        submitBtn.classList.remove('loading'); submitBtn.disabled = false;
        status.className = 'status err';
        status.textContent = 'Your message was not sent. Please try again, or call 632-8350-4904 / 0917-8368262.';
      });
  });
})();
