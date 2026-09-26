// ======================================================================
// hero.js — homepage hero choreography (GSAP)
// • entrance: photo settles in, title words rise from behind a mask,
//   the rest of the copy staggers up after them
// • idle: a slow float on the photo
// • pointer: the photo drifts a little with the cursor (fine pointers,
//   desktop widths only)
// • scroll: the copy lifts and fades as the hero leaves
//
// Progressive enhancement, deliberately: no CSS anywhere sets an
// opacity:0 / translated start state, so if GSAP fails to load or the
// visitor prefers reduced motion, the hero simply renders as static HTML.
// ======================================================================
(function () {
  var hero = document.querySelector('.im-hero');
  if (!hero) return;

  var gsap = window.gsap;
  if (!gsap) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var media = hero.querySelector('.im-hero-media');
  var img = hero.querySelector('.im-hero-img');
  var content = hero.querySelector('.im-hero-content');
  var line = hero.querySelector('.im-hero-line');
  var title = hero.querySelector('.im-hero-title');
  var rest = hero.querySelectorAll(
    '.im-hero-subtitle, .im-hero-meta, .im-hero-actions, .im-hero-content .im-footer-social'
  );

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ---- Split the title into per-word masks ----------------------------
  var words = [];
  if (title) {
    title.innerHTML = title.textContent.trim().split(/\s+/).map(function (w) {
      return '<span class="im-split"><span class="im-split-i">' + esc(w) + '</span></span>';
    }).join(' ');
    words = title.querySelectorAll('.im-split-i');
  }

  // ---- Entrance --------------------------------------------------------
  // Deliberately NOT started until the tab is actually visible. gsap.from()
  // writes its hidden start state (opacity 0, words pushed below their
  // masks) the moment it's created, but the ticker is rAF-driven and
  // browsers throttle rAF to a near-stop in background tabs — so building
  // the timeline on load in a background tab hides the hero and then
  // barely animates it. Waiting means a page opened in a background tab
  // still plays its entrance properly when someone switches to it.
  function playEntrance() {
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (media) tl.from(media, { opacity: 0, scale: 1.05, y: 28, duration: 1.1 }, 0);
    if (line) tl.from(line, { opacity: 0, y: 14, duration: 0.7 }, 0.12);
    if (words.length) tl.from(words, { yPercent: 115, duration: 0.9, stagger: 0.055 }, 0.18);
    if (rest.length) tl.from(rest, { opacity: 0, y: 18, duration: 0.7, stagger: 0.08 }, 0.5);

    // Safety net: whatever happens to the ticker, the hero must not be
    // left half-hidden. setTimeout is wall-clock, not rAF, so it fires
    // even when the timeline itself has stalled.
    var guard = setTimeout(function () {
      if (tl.progress() < 1) tl.progress(1);
    }, 6000);
    tl.eventCallback('onComplete', function () { clearTimeout(guard); });
  }

  if (document.hidden) {
    document.addEventListener('visibilitychange', function onVisible() {
      if (document.hidden) return;
      document.removeEventListener('visibilitychange', onVisible);
      playEntrance();
    });
  } else {
    playEntrance();
  }

  // ---- Idle float ------------------------------------------------------
  // On the <img>, while the entrance/pointer tweens own the <figure>, so
  // no two tweens ever fight over the same transform component.
  if (img) {
    gsap.to(img, {
      yPercent: -2.2,
      rotation: 0.7,
      duration: 5.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 1.2
    });
  }

  // ---- Pointer drift ---------------------------------------------------
  // xPercent/yPercent on the figure: the entrance uses y, and GSAP keeps
  // those as separate transform components, so they compose rather than
  // overwrite each other.
  if (media && window.matchMedia('(min-width: 992px) and (pointer: fine)').matches) {
    var toX = gsap.quickTo(media, 'xPercent', { duration: 0.7, ease: 'power3' });
    var toY = gsap.quickTo(media, 'yPercent', { duration: 0.7, ease: 'power3' });
    window.addEventListener('pointermove', function (e) {
      toX((e.clientX / window.innerWidth - 0.5) * 2);
      toY((e.clientY / window.innerHeight - 0.5) * 2);
    }, { passive: true });
  }

  // ---- Scroll lift -----------------------------------------------------
  // The copy column only — nothing in the entrance animates the container
  // itself, so this is free to own its transform.
  if (content) {
    var ticking = false;
    function onScroll() {
      ticking = false;
      var range = hero.offsetHeight || 1;
      var p = Math.min(1, Math.max(0, window.scrollY / range));
      gsap.set(content, { y: -60 * p, opacity: 1 - p * 0.85 });
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
  }
})();
