/* Shared behavior for post pages: theme toggle, reading progress,
   sticky header, auto-built table of contents, scrollspy, image lightbox. */
(function () {
  'use strict';

  // --- Theme toggle ---
  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // --- Sticky header + reading progress ---
  var header = document.getElementById('header');
  var bar = document.getElementById('progressBar');
  function onScroll() {
    var doc = document.documentElement;
    var scrollTop = doc.scrollTop || document.body.scrollTop;
    if (header) header.classList.toggle('scrolled', scrollTop > 8);
    if (bar) {
      var h = doc.scrollHeight - doc.clientHeight;
      bar.style.width = (h > 0 ? (scrollTop / h) * 100 : 0) + '%';
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Build table of contents from the article's H2 headings ---
  var article = document.querySelector('article');
  var tocList = document.getElementById('tocList');
  var links = [];
  if (article && tocList) {
    var heads = article.querySelectorAll('h2[id]');
    heads.forEach(function (h) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      tocList.appendChild(li);
      links.push({ a: a, h: h });
    });

    // Scrollspy: highlight the section currently in view
    var spy = function () {
      var y = (document.documentElement.scrollTop || document.body.scrollTop) + 110;
      var current = null;
      for (var i = 0; i < links.length; i++) {
        if (links[i].h.offsetTop <= y) current = links[i];
      }
      links.forEach(function (l) { l.a.classList.toggle('active', l === current); });
    };
    addEventListener('scroll', spy, { passive: true });
    spy();
  }

  // --- Lightbox for figures ---
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<img alt="">';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector('img');
  document.querySelectorAll('.diagram img').forEach(function (img) {
    img.addEventListener('click', function () {
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      lb.classList.add('open');
    });
  });
  lb.addEventListener('click', function () { lb.classList.remove('open'); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('open'); });
})();
