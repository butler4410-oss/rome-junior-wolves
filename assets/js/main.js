/* ==========================================================================
   ROME JUNIOR WOLVES — SITE ENGINE
   Injects header/footer, handles nav + interactions, renders data.js content.
   ========================================================================== */
(function () {
  "use strict";
  var D = window.RJW || {};
  var org = D.org || {};

  /* ---------- helpers ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]; }); }
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
  var MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var MONF = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  function parseDate(s) { var p = String(s).split("-"); return new Date(+p[0], (+p[1]) - 1, +p[2]); }
  function fmtShort(s) { var d = parseDate(s); return { m: MON[d.getMonth()], d: d.getDate() }; }
  function fmtLong(s) { var d = parseDate(s); return MONF[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear(); }
  function isPast(s) { var d = parseDate(s); var t = new Date(); t.setHours(0,0,0,0); return d < t; }

  var ICON = {
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  /* ---------- nav config ---------- */
  var NAV = [
    { href: "index.html",    label: "Home" },
    { href: "programs.html", label: "Programs" },
    { href: "teams.html",    label: "Teams" },
    { href: "schedule.html", label: "Schedule" },
    { href: "news.html",     label: "News" },
    { href: "gallery.html",  label: "Gallery" },
    { href: "sponsors.html", label: "Sponsors" },
    { href: "about.html",    label: "About" },
    { href: "contact.html",  label: "Contact" }
  ];
  function currentPage() {
    var f = location.pathname.split("/").pop();
    return (!f || f === "") ? "index.html" : f;
  }
  function isExternal(u) { return /^https?:/i.test(u); }
  function regAttrs() { return isExternal(org.registerUrl) ? ' target="_blank" rel="noopener"' : ""; }

  /* ---------- header ---------- */
  function buildHeader() {
    var mount = $("#site-header"); if (!mount) return;
    var cur = currentPage();
    var links = NAV.map(function (n) {
      return '<a href="' + n.href + '"' + (n.href === cur ? ' class="active" aria-current="page"' : "") + '>' + esc(n.label) + "</a>";
    }).join("");
    mount.outerHTML =
      '<a href="#main" class="skip-link">Skip to content</a>' +
      '<header class="site-header" id="siteHeader">' +
        '<div class="wrap">' +
          '<a class="brand" href="index.html" aria-label="' + esc(org.name) + ' home">' +
            '<img src="assets/img/logo-circle.png" alt="' + esc(org.name) + ' logo">' +
            '<span class="brand-text"><b>Rome Junior Wolves</b><span>Fear the Pack</span></span>' +
          '</a>' +
          '<button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false"><span></span></button>' +
          '<nav class="nav" id="primaryNav" aria-label="Primary">' + links +
            '<a class="btn btn-gold btn-sm" href="' + esc(org.registerUrl) + '"' + regAttrs() + '>' + esc(org.ctaLabel || "Register") + '</a>' +
          '</nav>' +
        '</div>' +
      '</header>';

    var header = $("#siteHeader");
    var toggle = $("#navToggle");
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $all("#primaryNav a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("nav-open"); toggle.setAttribute("aria-expanded","false"); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        document.body.classList.remove("nav-open"); toggle.setAttribute("aria-expanded", "false"); toggle.focus();
      }
    });
    function onScroll() { header.classList.toggle("solid", window.scrollY > 24 || !$(".hero")); }
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- footer ---------- */
  function buildFooter() {
    var mount = $("#site-footer"); if (!mount) return;
    var quick = NAV.slice(1).map(function (n) { return '<a href="' + n.href + '">' + esc(n.label) + "</a>"; }).join("");
    var social = '<a href="' + esc(org.facebook) + '" target="_blank" rel="noopener" aria-label="Facebook">' + ICON.fb + "</a>";
    if (org.instagram) social += '<a href="' + esc(org.instagram) + '" target="_blank" rel="noopener" aria-label="Instagram">' + ICON.ig + "</a>";
    social += '<a href="mailto:' + esc(org.email) + '" aria-label="Email">' + ICON.mail + "</a>";

    mount.outerHTML =
      '<footer class="site-footer">' +
        '<div class="wrap">' +
          '<div class="footer-top">' +
            '<div class="footer-brand">' +
              '<img src="assets/img/logo-circle.png" alt="' + esc(org.name) + '">' +
              "<p>" + esc(org.blurb) + "</p>" +
              '<div class="social-row">' + social + "</div>" +
            "</div>" +
            '<div class="footer-col"><h4>Explore</h4>' + quick + "</div>" +
            '<div class="footer-col"><h4>Get Involved</h4>' +
              '<a href="' + esc(org.registerUrl) + '"' + regAttrs() + '>Register Now</a>' +
              '<a href="sponsors.html">Become a Sponsor</a>' +
              '<a href="contact.html">Volunteer / Coach</a>' +
              '<a href="' + esc(org.highSchool.url) + '" target="_blank" rel="noopener">Rome Wolves Athletics</a>' +
            "</div>" +
            '<div class="footer-col"><h4>Find the Pack</h4>' +
              '<a href="' + esc(org.field.mapUrl) + '" target="_blank" rel="noopener">' + esc(org.field.address) + "</a>" +
              '<a href="mailto:' + esc(org.email) + '">' + esc(org.email) + "</a>" +
              '<a href="' + esc(org.facebook) + '" target="_blank" rel="noopener">facebook.com/romejuniorwolves</a>' +
            "</div>" +
          "</div>" +
          '<div class="footer-bottom">' +
            "<span>&copy; <span id=\"yr\"></span> " + esc(org.name) + ". Fear the Pack.</span>" +
            "<span>Proud youth feeder for the " + esc(org.highSchool.name) + ".</span>" +
          "</div>" +
        "</div>" +
      "</footer>";
    var yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();
  }

  /* ---------- generic link/text fills ---------- */
  function fillBindings() {
    $all("[data-register]").forEach(function (a) {
      a.href = org.registerUrl;
      if (isExternal(org.registerUrl)) { a.target = "_blank"; a.rel = "noopener"; }
      else { a.removeAttribute("target"); a.removeAttribute("rel"); }
    });
    $all("[data-leagueapps]").forEach(function (a) { a.href = org.leagueAppsUrl; a.target = "_blank"; a.rel = "noopener"; });
    $all("[data-fb]").forEach(function (a) { a.href = org.facebook; a.target = "_blank"; a.rel = "noopener"; });
    $all("[data-ig]").forEach(function (a) { if (org.instagram) { a.href = org.instagram; a.target = "_blank"; a.rel = "noopener"; } });
    $all("[data-email]").forEach(function (a) { a.href = "mailto:" + org.email; if (!a.textContent.trim()) a.textContent = org.email; });
    $all("[data-map]").forEach(function (a) { a.href = org.field.mapUrl; a.target = "_blank"; a.rel = "noopener"; });
    $all("[data-text=email]").forEach(function (n) { n.textContent = org.email; });
    $all("[data-text=address]").forEach(function (n) { n.textContent = org.field.address; });
    $all("[data-text=phone]").forEach(function (n) { n.textContent = org.phone || ""; });
  }

  /* ---------- renderers ---------- */
  var R = {};

  R.stats = function (node) {
    node.innerHTML = '<div class="wrap"><div class="grid cols-4">' +
      (D.stats || []).map(function (s) {
        return '<div class="stat"><div class="v">' + esc(s.value) + '</div><div class="l">' + esc(s.label) + "</div></div>";
      }).join("") + "</div></div>";
  };

  R.news = function (node) {
    var limit = +node.getAttribute("data-limit") || (D.news || []).length;
    var items = (D.news || []).slice(0, limit);
    node.innerHTML = items.map(function (n) {
      return '<article class="card hoverable news-card reveal"><span class="card-top"></span>' +
        '<div class="card-body">' +
          '<div class="meta"><span class="tag">' + esc(n.category) + '</span><span class="news-date">' + fmtLong(n.date) + "</span></div>" +
          "<h3>" + esc(n.title) + "</h3>" +
          "<p>" + esc(n.body) + "</p>" +
        "</div></article>";
    }).join("");
  };

  R.events = function (node) {
    var onlyUpcoming = node.getAttribute("data-upcoming") === "true";
    var list = (D.events || []).slice().sort(function (a, b) { return parseDate(a.date) - parseDate(b.date); });
    if (onlyUpcoming) list = list.filter(function (e) { return !isPast(e.date); });
    if (!list.length) { node.innerHTML = '<p class="lead">New dates are added here as they\'re announced. Check back soon!</p>'; return; }
    node.innerHTML = list.map(function (e) {
      var s = fmtShort(e.date), past = isPast(e.date);
      return '<div class="event-row reveal' + (past ? " past" : "") + '">' +
        '<div class="date-chip"><div class="m">' + s.m + '</div><div class="d">' + s.d + "</div></div>" +
        '<div class="event-info"><h4>' + esc(e.title) + (past ? ' <span class="tag">Past</span>' : "") + "</h4>" +
          '<div class="where">' + esc(e.time || "") + (e.location ? " · " + esc(e.location) : "") + "</div>" +
          (e.blurb ? "<p>" + esc(e.blurb) + "</p>" : "") +
        "</div></div>";
    }).join("");
  };

  R.divisions = function (node) {
    node.innerHTML = (D.divisions || []).map(function (dv) {
      return '<div class="card hoverable division-card reveal ' + (dv.type === "cheer" ? "cheer" : "") + '">' +
        '<div class="ages">' + esc(dv.ages) + "</div>" +
        "<h3>" + esc(dv.name) + "</h3>" +
        '<p class="mt-1">' + esc(dv.blurb) + "</p>" +
        '<span class="tag ' + (dv.type === "cheer" ? "gold" : "crimson") + ' mt-2" style="align-self:center">' + (dv.type === "cheer" ? "Cheer" : "Football") + "</span>" +
        "</div>";
    }).join("");
  };

  R.fees = function (node) {
    var f = D.fees || {};
    node.innerHTML =
      '<div class="grid cols-2" style="align-items:start">' +
        '<div class="card"><span class="card-top"></span><div class="card-body">' +
          "<h3>Fees</h3>" +
          (f.rows || []).map(function (r) {
            return '<div class="m-row" style="display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding:.7rem 0"><span>' + esc(r.item) + '</span><strong>' + esc(r.price) + "</strong></div>";
          }).join("") +
          (f.note ? '<p class="mt-2" style="font-size:.9rem;color:var(--text-soft)">' + esc(f.note) + "</p>" : "") +
        "</div></div>" +
        '<div class="card"><span class="card-top"></span><div class="card-body">' +
          "<h3>What's Included</h3><ul class=\"mt-1\">" +
          (f.includes || []).map(function (i) { return '<li style="padding:.45rem 0;display:flex;gap:.6rem"><span class="text-crimson">&#10003;</span>' + esc(i) + "</li>"; }).join("") +
          "</ul></div></div>" +
      "</div>";
  };

  R.registerSteps = function (node) {
    node.innerHTML = (D.registerSteps || []).map(function (s) {
      return '<div class="card feature reveal"><div class="icon" style="font-family:var(--f-display);font-size:1.5rem">' + esc(s.step) + "</div>" +
        "<h3>" + esc(s.title) + "</h3><p>" + esc(s.text) + "</p></div>";
    }).join("");
  };

  R.teams = function (node) {
    var teams = D.teams || [], divs = {};
    (D.divisions || []).forEach(function (d) { divs[d.id] = d; });
    var html = teams.map(function (t) {
      var dv = divs[t.divisionId] || {};
      var roster = t.roster || [];
      var body;
      if (!roster.length) {
        body = '<div class="notice" style="margin:1rem 0">' + ICON_INFO + "<div>Rosters for this division are posted here before the season kicks off. Check back soon — and register to claim your athlete's spot!</div></div>";
      } else {
        body = '<div class="roster-grid">' + roster.map(function (p, i) {
          return '<div class="player" data-team="' + esc(t.name) + '" data-i="' + i + '" tabindex="0" role="button" aria-label="View ' + esc(p.name) + '">' +
            (p.sample ? '<div class="sample-ribbon">Sample</div>' : "") +
            '<div class="jersey"><div class="num">' + esc(p.number) + "</div></div>" +
            '<div class="pinfo"><div class="nm">' + esc(p.name) + '</div><div class="pos">' + esc(p.position || "") + "</div></div>" +
          "</div>";
        }).join("") + "</div>";
      }
      return '<div class="reveal" style="margin-bottom:2.6rem">' +
        '<div class="flex items-center wrap-flex gap" style="justify-content:space-between;margin-bottom:1.1rem">' +
          "<div><h3 style=\"font-size:1.6rem;text-transform:uppercase\">" + esc(t.name) + "</h3>" +
          '<div style="color:var(--text-soft);font-size:.92rem">' + esc(dv.ages || "") + " · Coach: " + esc(t.coach || "TBA") + "</div></div>" +
          '<span class="tag crimson">' + (dv.type === "cheer" ? "Cheer" : "Football") + "</span>" +
        "</div>" + body + "</div>";
    }).join("");
    node.innerHTML = html || '<p class="lead">Teams are posted here once divisions are set for the season.</p>';
    wirePlayerModal();
  };

  R.coaches = function (node) {
    node.innerHTML = (D.coaches || []).map(function (c) {
      var initials = (c.name || "").split(" ").map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase();
      return '<div class="card coach-card reveal">' +
        (c.sample ? "" : '<div class="coach-avatar">' + esc(initials) + "</div>") +
        (c.sample ? '<div class="coach-avatar">&#9733;</div>' : "") +
        '<div class="role">' + esc(c.role) + (c.team ? " · " + esc(c.team) : "") + "</div>" +
        "<h3 style=\"font-size:1.2rem;margin-top:.3rem\">" + esc(c.name) + "</h3>" +
        (c.bio ? '<p class="mt-1" style="font-size:.92rem">' + esc(c.bio) + "</p>" : "") +
        "</div>";
    }).join("");
  };

  R.sponsors = function (node) {
    var tiers = { champion: "Champion Sponsor", varsity: "Varsity Sponsor", community: "Community Sponsor" };
    node.innerHTML = (D.sponsors || []).map(function (s) {
      var inner = (s.logo ? '<img src="' + esc(s.logo) + '" alt="' + esc(s.name) + '" style="max-height:70px">' : '<div class="s-name">' + esc(s.name) + "</div>") +
        (s.note ? '<div class="s-note">' + esc(s.note) + "</div>" : "") +
        '<div class="tier-label mt-1">' + esc(tiers[s.tier] || "") + "</div>";
      var cls = "sponsor reveal " + (s.tier === "champion" ? "champion " : "") + (s.placeholder ? "placeholder" : "");
      return s.url && !s.placeholder
        ? '<a class="' + cls + '" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + inner + "</a>"
        : '<div class="' + cls + '">' + inner + "</div>";
    }).join("");
  };

  R.gallery = function (node) {
    var imgs = D.gallery || [];
    var html = imgs.map(function (g) {
      return '<figure class="reveal"><img src="' + esc(g.src) + '" alt="' + esc(g.caption || "Rome Junior Wolves") + '" loading="lazy">' +
        (g.caption ? "<figcaption>" + esc(g.caption) + "</figcaption>" : "") + "</figure>";
    }).join("");
    // pad with placeholders so the gallery looks intentional before photos are added
    var pad = Math.max(0, 5 - imgs.length);
    for (var i = 0; i < pad; i++) {
      html += '<div class="gallery-ph reveal">' + ICON_IMG + "<div>More photos coming soon</div></div>";
    }
    node.innerHTML = html;
  };

  R.faqs = function (node) {
    node.innerHTML = (D.faqs || []).map(function (f) {
      return '<details class="faq reveal"><summary><span>' + esc(f.q) + '</span><span class="plus" aria-hidden="true"></span></summary><div class="answer">' + esc(f.a) + "</div></details>";
    }).join("");
  };

  R.schedule = function (node) {
    if (!D.scheduleReleased) {
      node.innerHTML = '<div class="card"><div class="card-body center" style="padding:3rem 1.5rem">' +
        '<h3 style="font-size:1.5rem">Fall 2026 Schedule — Coming Soon</h3>' +
        '<p class="lead mt-1" style="margin-inline:auto">The league releases game schedules closer to kickoff. As soon as ours is set, every game will appear right here. In the meantime, see <a class="text-crimson" href="schedule.html#events">key dates &amp; events</a> below.</p>' +
        '<a class="btn btn-outline mt-3" data-fb href="#">Follow on Facebook for updates</a>' +
      "</div></div>";
      fillBindings();
      return;
    }
    var rows = (D.schedule || []).map(function (g) {
      return "<tr><td><strong>" + fmtLong(g.date) + "</strong></td>" +
        '<td><span class="ha ' + (g.home ? "home" : "away") + '">' + (g.home ? "Home" : "Away") + "</span></td>" +
        "<td>" + esc(g.opponent) + "</td><td>" + esc(g.time || "TBA") + "</td>" +
        "<td>" + esc(g.location || "") + "</td><td>" + (g.result ? "<strong>" + esc(g.result) + "</strong>" : "&mdash;") + "</td></tr>";
    }).join("");
    node.innerHTML = '<div class="table-wrap"><table class="sched"><thead><tr><th>Date</th><th>H/A</th><th>Opponent</th><th>Time</th><th>Location</th><th>Result</th></tr></thead><tbody>' + rows + "</tbody></table></div>";
  };

  R.practice = function (node) {
    var p = D.practice || {};
    node.innerHTML =
      '<div class="grid cols-3">' +
      [["Days", p.days], ["Time", p.time], ["Where", p.location]].map(function (r) {
        return '<div class="card feature reveal"><div class="role text-crimson" style="font-family:var(--f-head);text-transform:uppercase;letter-spacing:.1em;font-size:.8rem;font-weight:600">' + esc(r[0]) + '</div><div style="font-family:var(--f-head);font-weight:600;font-size:1.25rem;margin-top:.3rem">' + esc(r[1]) + "</div></div>";
      }).join("") + "</div>" +
      (p.note ? '<div class="notice mt-3">' + ICON_INFO + "<div>" + esc(p.note) + "</div></div>" : "");
  };

  var ICON_INFO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>';
  var ICON_IMG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg>';

  /* ---------- player modal ---------- */
  var modalEl, lastFocus = null;
  function ensureModal() {
    if (modalEl) return;
    modalEl = el('<div class="modal-backdrop" id="playerModal" role="dialog" aria-modal="true" aria-label="Player profile"><div class="modal"><div class="m-head"><button class="m-close" aria-label="Close player profile">&times;</button><div class="num"></div><div class="nm"></div></div><div class="m-body"></div></div></div>');
    document.body.appendChild(modalEl);
    modalEl.addEventListener("click", function (e) { if (e.target === modalEl || e.target.classList.contains("m-close")) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modalEl.classList.contains("open")) closeModal(); });
    // basic focus trap: keep Tab within the dialog
    modalEl.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      e.preventDefault();
      $(".m-close", modalEl).focus();
    });
  }
  function openPlayer(team, p) {
    ensureModal();
    $(".m-head .num", modalEl).textContent = "#" + p.number;
    $(".m-head .nm", modalEl).textContent = p.name;
    var rows = [["Team", team], ["Position", p.position || "—"], ["Grade", p.grade || "—"], ["Number", "#" + p.number]];
    $(".m-body", modalEl).innerHTML = rows.map(function (r) {
      return '<div class="m-row"><span>' + esc(r[0]) + "</span><strong>" + esc(r[1]) + "</strong></div>";
    }).join("") + (p.sample ? '<p style="font-size:.85rem;color:var(--text-soft);margin-top:.5rem">This is a sample profile. Coaches: edit rosters in <code>assets/js/data.js</code>.</p>' : "");
    lastFocus = document.activeElement;
    modalEl.classList.add("open");
    document.body.classList.add("modal-open");
    $(".m-close", modalEl).focus();
  }
  function closeModal() {
    if (!modalEl || !modalEl.classList.contains("open")) return;
    modalEl.classList.remove("open");
    document.body.classList.remove("modal-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function wirePlayerModal() {
    $all(".player").forEach(function (card) {
      function open() {
        var tName = card.getAttribute("data-team");
        var team = (D.teams || []).filter(function (t) { return t.name === tName; })[0];
        if (team) openPlayer(tName, team.roster[+card.getAttribute("data-i")]);
      }
      card.addEventListener("click", open);
      card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
  }

  /* ---------- reveal on scroll ---------- */
  function initReveal() {
    var els = $all(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- boot ---------- */
  function boot() {
    buildHeader();
    buildFooter();
    $all("[data-render]").forEach(function (node) {
      var fn = R[node.getAttribute("data-render")];
      if (fn) fn(node);
    });
    fillBindings();
    initReveal();
    // Admin instructions are for the board while building locally — hide on the live site.
    if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
      $all(".admin-note").forEach(function (n) { n.style.display = "none"; });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
