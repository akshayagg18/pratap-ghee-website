/* Pratap Ghee - shared interactions (no dependencies) */
(function () {
  "use strict";

  /* ---------- sticky header shadow ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- mobile drawer ---------- */
  var drawer = document.getElementById("drawer");
  var openBtn = document.getElementById("nav-open");
  var closeBtn = document.getElementById("nav-close");
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (openBtn) openBtn.setAttribute("aria-expanded", String(open));
    if (open) {
      var first = drawer.querySelector("a, button");
      if (first) first.focus();
    } else if (openBtn) {
      openBtn.focus();
    }
  }
  if (openBtn) openBtn.addEventListener("click", function () { setDrawer(true); });
  if (closeBtn) closeBtn.addEventListener("click", function () { setDrawer(false); });
  if (drawer) {
    drawer.querySelector(".drawer__scrim").addEventListener("click", function () { setDrawer(false); });
    drawer.addEventListener("keydown", function (e) { if (e.key === "Escape") setDrawer(false); });
  }

  /* ---------- desktop dropdowns (click + keyboard; hover handled by CSS) ---------- */
  document.querySelectorAll(".has-dropdown > button").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var li = btn.parentElement;
      var open = li.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
      document.querySelectorAll(".has-dropdown").forEach(function (other) {
        if (other !== li) { other.classList.remove("is-open"); }
      });
    });
  });
  document.addEventListener("click", function () {
    document.querySelectorAll(".has-dropdown.is-open").forEach(function (li) {
      li.classList.remove("is-open");
      var b = li.querySelector("button"); if (b) b.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".has-dropdown.is-open").forEach(function (li) { li.classList.remove("is-open"); });
    }
  });

  /* ---------- scroll reveal ---------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    // threshold 0 fires as soon as any part enters - reliable for tall
    // elements and short viewports (split screens, landscape phones)
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0, rootMargin: "0px 0px -36px 0px" });
    var vh = window.innerHeight;
    revealEls.forEach(function (el) {
      // content already on screen at load shows instantly, without stagger
      if (el.getBoundingClientRect().top < vh - 36) {
        el.style.transition = "none";
        el.classList.add("is-visible");
      } else {
        io.observe(el);
      }
    });
  }

  /* ---------- lightbox (galleries) ---------- */
  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
    var idx = 0;
    function show(i) {
      idx = (i + items.length) % items.length;
      var t = items[idx];
      lbImg.src = t.getAttribute("data-lightbox");
      lbImg.alt = t.querySelector("img") ? t.querySelector("img").alt : "";
    }
    function openLb(i) {
      show(i);
      lb.classList.add("is-open");
      document.body.style.overflow = "hidden";
      lb.querySelector(".lightbox__close").focus();
    }
    function closeLb() {
      lb.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    items.forEach(function (t, i) {
      t.addEventListener("click", function () { openLb(i); });
    });
    lb.querySelector(".lightbox__close").addEventListener("click", closeLb);
    var prev = lb.querySelector(".lightbox__nav--prev");
    var next = lb.querySelector(".lightbox__nav--next");
    if (prev) prev.addEventListener("click", function () { show(idx - 1); });
    if (next) next.addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft" && prev) show(idx - 1);
      if (e.key === "ArrowRight" && next) show(idx + 1);
    });
  }

  /* ---------- audio jingle players ---------- */
  var jingles = document.querySelectorAll(".jingle");
  if (jingles.length) {
    var players = [];
    function fmt(s) {
      if (!isFinite(s)) return "0:00";
      var m = Math.floor(s / 60), sec = Math.floor(s % 60);
      return m + ":" + (sec < 10 ? "0" : "") + sec;
    }
    var ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
    var ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
    jingles.forEach(function (card) {
      var audio = card.querySelector("audio");
      var btn = card.querySelector(".jingle__play");
      var fill = card.querySelector(".jingle__fill");
      var bar = card.querySelector(".jingle__bar");
      var time = card.querySelector(".jingle__time");
      players.push(audio);
      btn.innerHTML = ICON_PLAY;
      function refresh() {
        var d = audio.duration || 0;
        if (time) time.textContent = fmt(audio.currentTime) + " / " + fmt(d);
        if (fill && d) fill.style.width = (audio.currentTime / d) * 100 + "%";
      }
      audio.addEventListener("loadedmetadata", refresh);
      audio.addEventListener("timeupdate", refresh);
      audio.addEventListener("ended", function () { btn.innerHTML = ICON_PLAY; btn.setAttribute("aria-label", "Play " + card.dataset.title); });
      btn.addEventListener("click", function () {
        if (audio.paused) {
          players.forEach(function (a) {
            if (a !== audio && !a.paused) {
              a.pause();
              var c = a.closest(".jingle");
              c.querySelector(".jingle__play").innerHTML = ICON_PLAY;
            }
          });
          audio.play();
          btn.innerHTML = ICON_PAUSE;
          btn.setAttribute("aria-label", "Pause " + card.dataset.title);
        } else {
          audio.pause();
          btn.innerHTML = ICON_PLAY;
          btn.setAttribute("aria-label", "Play " + card.dataset.title);
        }
      });
      if (bar) {
        bar.addEventListener("click", function (e) {
          if (!audio.duration) return;
          var r = bar.getBoundingClientRect();
          audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
        });
      }
    });
  }

  /* ---------- footer year ---------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
