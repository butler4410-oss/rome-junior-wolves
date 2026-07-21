/* ==========================================================================
   ROME JUNIOR WOLVES — ADMIN PANEL
   Board-member login (Supabase Auth) + CRUD for coaches, players, news,
   events, with photo upload to the public 'media' bucket. The public site
   reads these tables when RJW_CONFIG.contentApi is true (see main.js).
   ========================================================================== */
(function () {
  "use strict";
  var CFG = window.RJW_CONFIG || {};
  var D = window.RJW || {};
  var client = null, active = "news", editingId = null;

  /* ---------- tiny helpers ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]; }); }
  function show(id, on) { var n = typeof id === "string" ? $("#" + id) : id; if (n) n.hidden = !on; }
  function toast(msg, kind) {
    var t = $("#toast"); t.textContent = msg; t.className = "admin-toast " + (kind || "ok"); t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.hidden = true; }, 3200);
  }
  function loadScript(src) {
    return new Promise(function (res, rej) { var s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = function () { rej(new Error("load " + src)); }; document.head.appendChild(s); });
  }

  /* ---------- division options (from data.js) ---------- */
  var DIVS = (D.divisions || []).map(function (d) { return { value: d.id, label: d.grades + (d.type === "cheer" ? " · Cheer" : "") }; });
  function divLabel(id) { var d = (D.divisions || []).filter(function (x) { return x.id === id; })[0]; return d ? d.grades : (id || "—"); }

  /* ---------- collection schemas ---------- */
  var COLLECTIONS = {
    news: {
      label: "News", table: "news", order: "date.desc",
      hint: "Announcements and updates. Newest shows first on the News page.",
      fields: [
        { k: "date", label: "Date", type: "date", required: true },
        { k: "category", label: "Category", type: "select", options: ["Announcement", "Practice", "Event", "Fundraiser", "Registration"] },
        { k: "title", label: "Title", type: "text", required: true },
        { k: "body", label: "Body", type: "textarea", required: true },
        { k: "image", label: "Image / flyer (optional)", type: "image" }
      ],
      summary: function (r) { return esc(fmtDate(r.date)) + " &middot; <strong>" + esc(r.title) + "</strong>"; }
    },
    events: {
      label: "Events", table: "events", order: "date.asc",
      hint: "Camps, fundraisers, and key dates. Featured events show on the home page.",
      fields: [
        { k: "date", label: "Date", type: "date", required: true },
        { k: "title", label: "Title", type: "text", required: true },
        { k: "time", label: "Time", type: "text", placeholder: "e.g. 10:00 AM – 2:00 PM" },
        { k: "location", label: "Location", type: "text" },
        { k: "blurb", label: "Description", type: "textarea" },
        { k: "featured", label: "Feature on the home page", type: "checkbox" }
      ],
      summary: function (r) { return esc(fmtDate(r.date)) + " &middot; <strong>" + esc(r.title) + "</strong>" + (r.featured ? ' <span class="admin-pill">Featured</span>' : ""); }
    },
    coaches: {
      label: "Coaches", table: "coaches", order: "sort_order.asc",
      hint: "Coaching staff shown on the About page.",
      fields: [
        { k: "name", label: "Name", type: "text", required: true },
        { k: "role", label: "Role", type: "text", placeholder: "e.g. Head Coach", required: true },
        { k: "team", label: "Team / group", type: "text", placeholder: "e.g. Football, Cheer, Grades 3/4" },
        { k: "bio", label: "Short bio", type: "textarea" },
        { k: "photo", label: "Photo", type: "image" },
        { k: "sort_order", label: "Sort order (lower shows first)", type: "number" }
      ],
      summary: function (r) { return "<strong>" + esc(r.name) + "</strong> &middot; " + esc(r.role || ""); }
    },
    players: {
      label: "Players", table: "players", order: "sort_order.asc",
      hint: "Rosters shown on the Teams page. Please use first name + jersey # only, no birthdates, and photos only with a parent's OK.",
      fields: [
        { k: "division_id", label: "Team / division", type: "select", options: DIVS, required: true },
        { k: "number", label: "Jersey #", type: "text" },
        { k: "name", label: "Name (first name + last initial)", type: "text", required: true },
        { k: "position", label: "Position", type: "text", placeholder: "e.g. QB / DB" },
        { k: "grade", label: "Grade", type: "select", options: ["1st", "2nd", "3rd", "4th", "5th"] },
        { k: "photo", label: "Photo (optional, parent consent required)", type: "image" },
        { k: "bio", label: "Bio (optional)", type: "textarea" },
        { k: "sort_order", label: "Sort order", type: "number" }
      ],
      summary: function (r) { return "#" + esc(r.number || "—") + " <strong>" + esc(r.name) + "</strong> &middot; " + esc(divLabel(r.division_id)); }
    }
  };
  var ORDER = ["news", "events", "coaches", "players"];

  function fmtDate(s) { if (!s) return ""; var p = String(s).slice(0, 10).split("-"); if (p.length !== 3) return s; return p[1] + "/" + p[2] + "/" + p[0]; }

  /* ---------- boot ---------- */
  init();
  async function init() {
    if (!CFG.supabaseUrl || !CFG.supabaseAnonKey) { fatal("Supabase isn't configured. Add your project URL and anon key in <code>assets/js/config.js</code>."); return; }
    try { if (!window.supabase) await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"); }
    catch (e) { fatal("Couldn't load the Supabase library (check your internet connection)."); return; }
    client = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
    var sess = await client.auth.getSession();
    if (sess.data && sess.data.session) enterApp(sess.data.session.user);
    else showLogin();
    wireLogin();
    wireApp();
  }
  function fatal(html) { var b = $("#adminBoot"); b.innerHTML = '<div class="admin-login-card"><h1>Setup needed</h1><p class="admin-muted">' + html + "</p></div>"; b.hidden = false; }

  function showLogin() { show("adminBoot", false); show("adminApp", false); show("adminLogin", true); var e = $("#email"); if (e) e.focus(); }

  /* ---------- auth ---------- */
  function wireLogin() {
    var form = $("#loginForm"); if (!form || form._wired) return; form._wired = true;
    form.addEventListener("submit", async function (ev) {
      ev.preventDefault();
      var btn = $("#loginBtn"), msg = $("#loginMsg");
      msg.hidden = true; btn.disabled = true; btn.textContent = "Signing in…";
      var r = await client.auth.signInWithPassword({ email: $("#email").value.trim(), password: $("#password").value });
      btn.disabled = false; btn.textContent = "Sign In";
      if (r.error) { msg.textContent = r.error.message || "Sign-in failed."; msg.hidden = false; return; }
      enterApp(r.data.user);
    });
  }
  function wireApp() {
    var lo = $("#logoutBtn"); if (lo) lo.addEventListener("click", async function () { await client.auth.signOut(); location.reload(); });
    var add = $("#addBtn"); if (add) add.addEventListener("click", function () { openForm(active, null); });
    var fc = $("#formClose"), cb = $("#cancelBtn"); [fc, cb].forEach(function (b) { if (b) b.addEventListener("click", closeForm); });
    var sb = $("#saveBtn"); if (sb) sb.addEventListener("click", saveForm);
    var db = $("#deleteBtn"); if (db) db.addEventListener("click", removeItem);
    $("#adminForm").addEventListener("click", function (e) { if (e.target === $("#adminForm")) closeForm(); });
  }

  function enterApp(user) {
    show("adminBoot", false); show("adminLogin", false); show("adminApp", true);
    $("#whoami").textContent = user && user.email ? user.email : "";
    var tabs = $("#adminTabs");
    tabs.innerHTML = ORDER.map(function (k) { return '<button data-tab="' + k + '">' + esc(COLLECTIONS[k].label) + "</button>"; }).join("");
    $all("button", tabs).forEach(function (b) { b.addEventListener("click", function () { setActive(b.getAttribute("data-tab")); }); });
    setActive(active);
  }

  function setActive(k) {
    active = k;
    $all("#adminTabs button").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-tab") === k); });
    var c = COLLECTIONS[k];
    $("#collTitle").textContent = c.label;
    $("#collHint").textContent = c.hint || "";
    loadList();
  }

  /* ---------- list ---------- */
  async function loadList() {
    var c = COLLECTIONS[active], list = $("#collList");
    list.innerHTML = '<div class="admin-loading">Loading…</div>';
    var parts = c.order.split(".");
    var r = await client.from(c.table).select("*").order(parts[0], { ascending: parts[1] !== "desc" });
    if (r.error) {
      list.innerHTML = '<div class="admin-empty">Couldn\'t load ' + esc(c.label) + '.<br><span class="admin-muted">' + esc(r.error.message) +
        '</span><br><span class="admin-muted">Did you run <code>supabase/admin-schema.sql</code> yet?</span></div>';
      return;
    }
    var rows = r.data || [];
    if (!rows.length) { list.innerHTML = '<div class="admin-empty">No ' + esc(c.label.toLowerCase()) + ' yet. Click <strong>+ Add new</strong> to create one.</div>'; return; }
    list.innerHTML = rows.map(function (row) {
      var thumb = row.photo || row.image ? '<span class="admin-thumb" style="background-image:url(' + esc(row.photo || row.image) + ')"></span>' : '<span class="admin-thumb empty"></span>';
      return '<div class="admin-row" data-id="' + esc(row.id) + '">' + thumb +
        '<span class="admin-row-main">' + c.summary(row) + "</span>" +
        '<button class="btn btn-outline btn-sm admin-edit">Edit</button></div>';
    }).join("");
    $all(".admin-row .admin-edit", list).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.parentNode.getAttribute("data-id");
        openForm(active, rows.filter(function (x) { return String(x.id) === String(id); })[0]);
      });
    });
  }

  /* ---------- form ---------- */
  function openForm(k, row) {
    active = k; editingId = row ? row.id : null;
    var c = COLLECTIONS[k];
    $("#formTitle").textContent = (row ? "Edit " : "New ") + c.label.replace(/s$/, "");
    show("deleteBtn", !!row);
    var body = $("#itemForm");
    body.innerHTML = c.fields.map(function (f) { return fieldHtml(f, row ? row[f.k] : ""); }).join("");
    $all("[data-upload]", body).forEach(wireUpload);
    show("adminForm", true);
    var first = $("input,textarea,select", body); if (first) first.focus();
  }
  function closeForm() { show("adminForm", false); editingId = null; }

  function fieldHtml(f, val) {
    val = val == null ? "" : val;
    var id = "f_" + f.k, req = f.required ? ' required' : "", ph = f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : "";
    var inner;
    if (f.type === "textarea") inner = '<textarea id="' + id + '" data-k="' + f.k + '"' + req + ph + ' rows="4">' + esc(val) + "</textarea>";
    else if (f.type === "checkbox") inner = '<label class="admin-check"><input id="' + id + '" data-k="' + f.k + '" type="checkbox"' + (val ? " checked" : "") + "> " + esc(f.label) + "</label>";
    else if (f.type === "select") {
      var opts = (f.options || []).map(function (o) {
        var v = typeof o === "string" ? o : o.value, lb = typeof o === "string" ? o : o.label;
        return '<option value="' + esc(v) + '"' + (String(v) === String(val) ? " selected" : "") + ">" + esc(lb) + "</option>";
      }).join("");
      inner = '<select id="' + id + '" data-k="' + f.k + '"' + req + '><option value="">— select —</option>' + opts + "</select>";
    }
    else if (f.type === "image") {
      inner = '<div class="admin-img" data-upload data-k="' + f.k + '">' +
        '<input type="hidden" data-k="' + f.k + '" value="' + esc(val) + '">' +
        '<div class="admin-img-preview"' + (val ? ' style="background-image:url(' + esc(val) + ')"' : "") + '></div>' +
        '<div class="admin-img-ctrls"><input type="file" accept="image/*" class="admin-file"><input type="url" class="admin-url" placeholder="…or paste an image URL" value="' + esc(val) + '"><span class="admin-up-status admin-muted"></span></div></div>';
    }
    else inner = '<input id="' + id + '" data-k="' + f.k + '" type="' + (f.type === "number" ? "number" : f.type === "date" ? "date" : "text") + '"' + req + ph + ' value="' + esc(String(val).slice(0, f.type === "date" ? 10 : 999)) + '">';
    if (f.type === "checkbox") return '<div class="admin-field">' + inner + "</div>";
    return '<div class="admin-field"><label for="' + id + '">' + esc(f.label) + "</label>" + inner + "</div>";
  }

  function wireUpload(wrap) {
    var hidden = $('input[type=hidden]', wrap), file = $(".admin-file", wrap), url = $(".admin-url", wrap),
        prev = $(".admin-img-preview", wrap), status = $(".admin-up-status", wrap);
    url.addEventListener("input", function () { hidden.value = url.value.trim(); prev.style.backgroundImage = url.value ? "url(" + url.value + ")" : ""; });
    file.addEventListener("change", async function () {
      var f = file.files[0]; if (!f) return;
      status.textContent = "Uploading…";
      try {
        var clean = f.name.replace(/[^a-z0-9.\-_]/gi, "_");
        var path = active + "/" + fnv(f.name + f.size) + "-" + clean;
        var up = await client.storage.from(CFG.mediaBucket || "media").upload(path, f, { upsert: true, contentType: f.type });
        if (up.error) throw up.error;
        var pub = client.storage.from(CFG.mediaBucket || "media").getPublicUrl(path);
        var link = pub.data.publicUrl;
        hidden.value = link; url.value = link; prev.style.backgroundImage = "url(" + link + ")";
        status.textContent = "Uploaded ✓";
      } catch (e) { status.textContent = "Upload failed: " + (e.message || e); }
    });
  }
  // small deterministic id so filenames don't collide (no Math.random needed)
  function fnv(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 16777619) >>> 0; } return h.toString(36); }

  async function saveForm() {
    var c = COLLECTIONS[active], body = $("#itemForm"), rec = {}, missing = false;
    c.fields.forEach(function (f) {
      var node = $('[data-k="' + f.k + '"]' + (f.type === "image" ? "[type=hidden]" : ""), body);
      if (!node) return;
      var v;
      if (f.type === "checkbox") v = node.checked;
      else if (f.type === "number") v = node.value === "" ? null : Number(node.value);
      else v = node.value.trim();
      if (f.required && (v === "" || v == null)) missing = true;
      rec[f.k] = v;
    });
    if (missing) { toast("Please fill in the required fields.", "err"); return; }
    var btn = $("#saveBtn"); btn.disabled = true; btn.textContent = "Saving…";
    var r = editingId
      ? await client.from(c.table).update(rec).eq("id", editingId)
      : await client.from(c.table).insert(rec);
    btn.disabled = false; btn.textContent = "Save";
    if (r.error) { toast("Save failed: " + r.error.message, "err"); return; }
    closeForm(); toast("Saved ✓"); loadList();
  }

  async function removeItem() {
    if (!editingId) return;
    if (!confirm("Delete this " + COLLECTIONS[active].label.replace(/s$/, "").toLowerCase() + "? This can't be undone.")) return;
    var r = await client.from(COLLECTIONS[active].table).delete().eq("id", editingId);
    if (r.error) { toast("Delete failed: " + r.error.message, "err"); return; }
    closeForm(); toast("Deleted"); loadList();
  }
})();
