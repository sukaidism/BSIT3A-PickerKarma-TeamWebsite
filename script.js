(function () {
  /* ── Easing: starts instantly, decelerates smoothly to a stop ── */
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  /* ── Smooth scroll with custom easing ── */
  function smoothScrollTo(targetY, duration) {
    const startY  = window.scrollY;
    const diff    = targetY - startY;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + diff * easeOutQuart(progress));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ── Navbar scroll-aware background ── */
  const header   = document.querySelector('.site-header');
  const HEADER_H = header ? header.offsetHeight : 72;

  /* Which sections have a dark background */
  const DARK_SECTIONS = ['team', 'updates'];

  var currentSection = 'home';

  function updateNavbar() {
    var scrolled = window.scrollY > 20;

    if (!scrolled) {
      /* At very top — fully transparent */
      header.classList.remove('scrolled', 'on-dark', 'on-light');
      return;
    }

    header.classList.add('scrolled');

    if (DARK_SECTIONS.indexOf(currentSection) !== -1) {
      header.classList.add('on-dark');
      header.classList.remove('on-light');
    } else {
      header.classList.add('on-light');
      header.classList.remove('on-dark');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); /* run once on load */

  /* ── Intercept all anchor clicks ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id     = this.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_H;
      /* Scale duration by distance so short scrolls feel snappy */
      const distance = Math.abs(top - window.scrollY);
      const duration = Math.min(Math.max(distance * 0.4, 380), 680);
      smoothScrollTo(top, duration);
    });
  });

  /* ── Active nav-link + section tracker via IntersectionObserver ── */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          currentSection = entry.target.id;
          updateNavbar();

          navLinks.forEach(function (link) {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach(function (section) { observer.observe(section); });

  /* ── Scroll-reveal for timeline items ── */
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('tl-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll('.tl-item').forEach(function (el) {
    revealObserver.observe(el);
  });
})();
