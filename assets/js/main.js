/* Computer Care — small site script: nav, tabs, reveal, lightbox, WhatsApp enquiry */
(function () {
  'use strict';

  /* ------- EDIT HERE: your shop WhatsApp number in international format ------- */
  var WHATSAPP = '917979759998';

  /* ---------------- sticky header ---------------- */
  var header = document.querySelector('.header');
  var onScroll = function () {
    header.classList.toggle('is-stuck', window.scrollY > 8);
    highlightNav();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- mobile menu ---------------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------------- active nav link ---------------- */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  function highlightNav() {
    var pos = window.scrollY + 140;
    var current = null;
    sections.forEach(function (s) { if (s.offsetTop <= pos) current = s.id; });
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
    });
  }
  highlightNav();

  /* ---------------- product tabs ---------------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
        var panel = document.getElementById(t.dataset.tab);
        if (panel) panel.classList.toggle('is-active', active);
      });
    });
  });

  /* ---------------- reveal on scroll ---------------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------- gallery lightbox ---------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var closeBtn = document.getElementById('lightboxClose');
  document.getElementById('gallery-grid').addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-full]');
    if (!btn) return;
    lightboxImg.src = btn.dataset.full;
    lightboxImg.alt = btn.querySelector('img') ? btn.querySelector('img').alt : '';
    lightbox.classList.add('is-open');
  });
  function closeBox() { lightbox.classList.remove('is-open'); lightboxImg.src = ''; }
  closeBtn.addEventListener('click', closeBox);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeBox(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeBox(); });

  /* ---------------- opening hours badge ---------------- */
  // 0 = Sunday. [openHour, closeHour] in 24h decimal hours.
  var HOURS = { 0: [8, 20], 1: [8, 20], 2: [8, 20], 3: [8, 20], 4: [8, 20], 5: [8, 20], 6: [8, 20] };
  var badge = document.getElementById('openNow');
  if (badge) {
    var now = new Date();
    var h = now.getHours() + now.getMinutes() / 60;
    var today = HOURS[now.getDay()];
    var isOpen = h >= today[0] && h < today[1];
    badge.textContent = isOpen
      ? 'Open now · closes ' + fmt(today[1])
      : 'Closed now · opens ' + fmt(h < today[0] ? today[0] : (HOURS[(now.getDay() + 1) % 7][0]));
    badge.style.color = isOpen ? '#0b7a44' : '#9a3412';
    badge.style.background = isOpen ? '#e7f8ef' : '#fdece4';
  }
  function fmt(v) {
    var hr = Math.floor(v), mn = Math.round((v - hr) * 60);
    var ampm = hr >= 12 ? 'pm' : 'am';
    var h12 = hr % 12 === 0 ? 12 : hr % 12;
    return h12 + ':' + (mn < 10 ? '0' + mn : mn) + ' ' + ampm;
  }

  /* ---------------- enquiry form -> WhatsApp ---------------- */
  var form = document.getElementById('enquiry');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    if (!name || !/^[0-9+\-\s]{7,15}$/.test(phone)) {
      alert('Please enter your name and a valid mobile number.');
      return;
    }
    var text = 'Hello Computer Care,\n' +
      'Name: ' + name + '\n' +
      'Mobile: ' + phone + '\n' +
      'Need: ' + form.topic.value + '\n' +
      (form.msg.value.trim() ? 'Details: ' + form.msg.value.trim() + '\n' : '');
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    form.reset();
  });

  /* ---------------- footer year ---------------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
