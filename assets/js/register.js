/* ==========================================================================
   ROME JUNIOR WOLVES — REGISTRATION WIZARD
   Multi-step sign-up. Submits to Supabase when configured, otherwise runs
   in local test mode (saves locally + emails a summary to the program).
   ========================================================================== */
(function () {
  "use strict";
  var D = window.RJW || {};
  var CFG = window.RJW_CONFIG || {};
  var reg = D.registration || {};
  var SAVE_KEY = "rjw_reg_draft";

  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function scrollBehavior() { return (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) ? "auto" : "smooth"; }
  var supaReady = !!(CFG.supabaseUrl && CFG.supabaseAnonKey);

  var form = $("#regForm");
  if (!form) return;

  // Until our engine is approved + Supabase is connected, the wizard stays dormant on the
  // live site (shows a "use current portal" card). On localhost it runs so we can keep building it.
  var isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var qs = new URLSearchParams(location.search);
  var isDemo = qs.get("demo") === "1" || qs.get("preview") === "1";  // unlisted preview link for the directors
  if (false) {  // gate disabled — the camps & training sign-up is live
    var wiz = document.querySelector(".wizard");
    var portal = (D.org && D.org.leagueAppsUrl) || "#";
    if (wiz) {
      wiz.innerHTML =
        '<div class="wiz-card"><div class="wiz-confirm" style="padding:3.2rem 2rem">' +
        '<div class="badge-ok"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4.5l3 2"/></svg></div>' +
        '<h2 style="font-size:1.8rem;text-transform:uppercase">Online Registration Opening Soon</h2>' +
        '<p class="lead mt-1" style="margin-inline:auto;max-width:46ch">We\'re putting the finishing touches on our new sign-up. For now, register through our current portal — it only takes a few minutes.</p>' +
        '<div class="hero-cta center-x" style="justify-content:center;margin-top:2rem">' +
          '<a class="btn btn-gold btn-lg" href="' + portal + '" target="_blank" rel="noopener">Register Now</a>' +
          '<a class="btn btn-outline" href="index.html">Back to Home</a>' +
        '</div></div></div>';
    }
    return;
  }

  var steps = $all(".wiz-step", form);
  var TITLES = ["Program & Division", "Athlete Info", "Parent / Guardian", "Emergency & Medical", "Documents & Waivers", "Review & Submit"];
  var cur = 0;

  /* ---------- populate selects ---------- */
  function fillSelect(sel, items, keep) {
    if (!sel) return;
    var v = keep ? sel.value : "";
    var base = sel.querySelector("option") ? sel.querySelector("option").outerHTML : "";
    sel.innerHTML = base + items.map(function (i) { return "<option>" + i + "</option>"; }).join("");
    if (v) sel.value = v;
  }
  fillSelect($("#grade"), reg.grades || []);
  fillSelect($("#size"), reg.sizes || []);

  function populateDivisions() {
    var prog = (form.querySelector('input[name=program]:checked') || {}).value;
    var sel = $("#division");
    var type = prog === "Cheer" ? "cheer" : "football";
    var list = (D.divisions || []).filter(function (d) { return prog ? d.type === type : true; });
    var cur = sel.value;
    sel.innerHTML = '<option value="">Select a division…</option>' +
      list.map(function (d) { return '<option value="' + d.grades + '">' + d.grades + "</option>"; }).join("");
    if (cur) { sel.value = cur; if (sel.value !== cur) sel.value = ""; }
  }
  $all('input[name=program]').forEach(function (r) { r.addEventListener("change", populateDivisions); });
  populateDivisions();

  // default signed date = today
  (function () { var d = new Date(), p = function (n) { return String(n).padStart(2, "0"); };
    var t = d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
    if ($("#signed_date") && !$("#signed_date").value) $("#signed_date").value = t; })();

  /* ---------- step navigation ---------- */
  function show(i) {
    cur = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach(function (s, idx) { s.classList.toggle("active", idx === cur); });
    $("#stepNo").textContent = "Step " + (cur + 1) + " of " + steps.length;
    $("#stepTitle").textContent = TITLES[cur];
    $("#btnBack").hidden = cur === 0;
    $("#btnNext").hidden = cur === steps.length - 1;
    $("#btnSubmit").hidden = cur !== steps.length - 1;
    $all("#wizProgress li").forEach(function (li, idx) {
      li.classList.toggle("done", idx < cur); li.classList.toggle("current", idx === cur);
    });
    if (cur === steps.length - 1) buildReview();
    window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 90, behavior: scrollBehavior() });
  }
  function validateStep() {
    var fields = $all("input, select, textarea", steps[cur]);
    for (var i = 0; i < fields.length; i++) {
      if (!fields[i].checkValidity()) { fields[i].reportValidity(); return false; }
    }
    return true;
  }
  $("#btnNext").addEventListener("click", function () { if (validateStep()) { save(); show(cur + 1); } });
  $("#btnBack").addEventListener("click", function () { show(cur - 1); });

  /* ---------- autosave (localStorage) ---------- */
  function collect() {
    var o = {};
    $all("input, select, textarea", form).forEach(function (f) {
      if (f.type === "file") return;
      if (f.type === "radio") { if (f.checked) o[f.name] = f.value; }
      else if (f.type === "checkbox") { o[f.name] = f.checked; }
      else if (f.name) { o[f.name] = f.value; }
    });
    return o;
  }
  function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(collect())); } catch (e) {} }
  function restore() {
    var raw; try { raw = localStorage.getItem(SAVE_KEY); } catch (e) { return; }
    if (!raw) return;
    var o; try { o = JSON.parse(raw); } catch (e) { return; }
    if (o.program) { var pr = form.querySelector('input[name=program][value="' + o.program + '"]'); if (pr) pr.checked = true; populateDivisions(); }
    Object.keys(o).forEach(function (k) {
      var f = form.elements[k]; if (!f) return;
      if (f.length && f[0] && f[0].type === "radio") { var r = form.querySelector('input[name=' + k + '][value="' + o[k] + '"]'); if (r) r.checked = true; }
      else if (f.type === "checkbox") { f.checked = !!o[k]; }
      else { f.value = o[k]; }
    });
  }
  form.addEventListener("input", save);
  form.addEventListener("change", save);

  /* ---------- review ---------- */
  function row(label, val) { return val ? '<div class="r"><span>' + label + "</span><strong>" + String(val).replace(/</g, "&lt;") + "</strong></div>" : ""; }
  function group(title, stepIdx, rows) {
    var content = rows.filter(Boolean).join("");
    if (!content) return "";
    return '<div class="review-group"><h4>' + title + ' <button type="button" data-goto="' + stepIdx + '">Edit</button></h4><div class="review-list">' + content + "</div></div>";
  }
  function val(name) { var f = form.elements[name]; if (!f) return ""; if (f.length && f[0] && f[0].type === "radio") { var c = form.querySelector('input[name=' + name + ']:checked'); return c ? c.value : ""; } return f.value; }
  function buildReview() {
    var docFile = $("#doc").files[0];
    var html =
      group("Program", 0, [row("Program", val("program")), row("Division", val("division")), row("Season", val("season"))]) +
      group("Athlete", 1, [row("Name", val("athlete_first") + " " + val("athlete_last")), row("Date of birth", val("athlete_dob")), row("Grade", val("grade")), row("School", val("school")), row("Gender", val("gender")), row("Returning", val("returning")), row("Experience (yrs)", val("experience")), row("Jersey size", val("size"))]) +
      group("Parent / Guardian", 2, [row("Name", val("guardian_name")), row("Relationship", val("relationship")), row("Email", val("email")), row("Phone", val("phone")), row("Address", [val("address"), val("city"), val("state"), val("zip")].filter(Boolean).join(", ")), row("2nd guardian", val("guardian2_name")), row("2nd phone", val("guardian2_phone"))]) +
      group("Emergency & Medical", 3, [row("Contact", val("emergency_name")), row("Phone", val("emergency_phone")), row("Relationship", val("emergency_rel")), row("Medical notes", val("medical")), row("Physician", val("doctor"))]) +
      group("Documents & Agreements", 4, [row("Birth certificate", docFile ? docFile.name : "Will provide later"), row("Liability waiver", val("agree_waiver") ? "Agreed" : ""), row("Code of conduct", val("agree_conduct") ? "Agreed" : ""), row("Photo release", $("#photo_release").checked ? "Yes" : "No"), row("Signature", val("signature")), row("Date", val("signed_date"))]);
    $("#reviewArea").innerHTML = html;
    $all("#reviewArea [data-goto]").forEach(function (b) { b.addEventListener("click", function () { show(+b.getAttribute("data-goto")); }); });
    $("#payNote > div").innerHTML = reg.feeNote || "We'll be in touch about payment after you submit.";
  }

  /* ---------- submit ---------- */
  function payload() {
    return {
      season: val("season"), program: val("program"), division: val("division"),
      athlete_first: val("athlete_first"), athlete_last: val("athlete_last"), athlete_dob: val("athlete_dob") || null,
      grade: val("grade"), school: val("school"), gender: val("gender"),
      returning_player: val("returning") === "Yes", experience: val("experience"), size: val("size"),
      guardian_name: val("guardian_name"), relationship: val("relationship"), email: val("email"), phone: val("phone"),
      address: val("address"), city: val("city"), state: val("state"), zip: val("zip"),
      guardian2_name: val("guardian2_name"), guardian2_phone: val("guardian2_phone"),
      emergency_name: val("emergency_name"), emergency_phone: val("emergency_phone"), emergency_rel: val("emergency_rel"),
      medical: val("medical"), doctor: val("doctor"),
      photo_release: $("#photo_release").checked, agree_conduct: $("#agree_conduct").checked, agree_waiver: $("#agree_waiver").checked,
      signature: val("signature"), signed_date: val("signed_date") || null, status: "new"
    };
  }
  function loadScript(src) { return new Promise(function (res, rej) { var s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }

  function emailFallback(p) {
    var lines = Object.keys(p).map(function (k) { return k + ": " + p[k]; }).join("\n");
    var subj = "New registration: " + p.athlete_first + " " + p.athlete_last + " (" + p.program + ")";
    var a = document.createElement("a");
    a.href = "mailto:" + (D.org && D.org.email) + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(lines + "\n\n(Submitted via website test mode.)");
    a.click();
  }

  async function submitSupabase(p) {
    if (!window.supabase) await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2");
    var client = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
    var file = $("#doc").files[0];
    if (file) {
      var ext = (file.name.split(".").pop() || "dat").toLowerCase();
      var path = p.season + "/" + p.athlete_last + "_" + p.athlete_first + "_" + Date.now() + "." + ext;
      var up = await client.storage.from(CFG.docsBucket || "registration-docs").upload(path, file, { upsert: false });
      if (up.error) throw up.error;
      p.doc_path = up.data.path;
    }
    var ins = await client.from("registrations").insert(p);
    if (ins.error) throw ins.error;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!validateStep()) return;
    var btn = $("#btnSubmit"); btn.disabled = true; btn.textContent = "Submitting…";
    var p = payload();
    try {
      if (isDemo) {
        // Preview mode — intentionally do nothing: no database, no email, no saved copy.
      } else if (supaReady) {
        await submitSupabase(p);
      } else {
        // local test mode: keep a copy + email the program a summary
        try { var arr = JSON.parse(localStorage.getItem("rjw_submissions") || "[]"); arr.push(Object.assign({ ts: new Date().toISOString() }, p)); localStorage.setItem("rjw_submissions", JSON.stringify(arr)); } catch (er) {}
        emailFallback(p);
      }
      try { localStorage.removeItem(SAVE_KEY); } catch (er) {}
      finish();
    } catch (err) {
      btn.disabled = false; btn.textContent = "Submit Registration";
      alert("Sorry — something went wrong submitting (" + (err.message || err) + ").\nYour info is saved on this device. Please try again, or email " + (D.org && D.org.email) + ".");
    }
  });

  function finish() {
    form.hidden = true;
    $("#wizProgress").hidden = true;
    $("#confirm").hidden = false;
    var h2 = $("#confirm h2");
    if (h2) h2.textContent = isDemo ? "That's the Sign-Up Flow!" : "You're in the Pack!";
    $("#confirmMsg").textContent = isDemo
      ? "This was a preview — no information was saved or submitted. This is exactly what families will see when we turn registration on."
      : (reg.confirmMessage || "Thanks for registering! We'll be in touch soon.");
    window.scrollTo({ top: $("#confirm").getBoundingClientRect().top + window.scrollY - 100, behavior: scrollBehavior() });
  }
  $("#btnAnother").addEventListener("click", function () {
    form.reset(); $("#doc").value = ""; populateDivisions();
    form.hidden = false; $("#wizProgress").hidden = false; $("#confirm").hidden = true;
    $("#btnSubmit").disabled = false; $("#btnSubmit").textContent = "Submit Registration";
    show(0);
  });

  /* ---------- boot ---------- */
  if (isDemo) {
    var dmb = $("#modeBanner");
    if (dmb) { var dsp = $("span", dmb); if (dsp) dsp.innerHTML = "<strong>Preview mode</strong> — walk through the full sign-up to see how it works. Nothing you enter is saved or submitted."; dmb.hidden = false; }
  } else if (!supaReady && isLocal) {
    var mb = $("#modeBanner"); if (mb) mb.hidden = false;
  }
  restore();
  show(0);
})();
