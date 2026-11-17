// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Alex Chequer
//
// The demo window at the top of the page: four sessions go through the
// states and the layouts. It works pose to pose: each step has a pose (which
// state each pane is in, which lines it shows, the layout) and a short
// choreography to reach it (a cursor that travels in an arc and clicks, a
// notification that slides in, the Dock icon that bounces). CSS fills in the
// frames between poses. With reduced motion it only changes poses.
(function () {
  "use strict";

  var page = window.MosaicoPage;
  var t = page.t;
  var layoutFrames = window.MosaicoLayout;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var ICONS = {
    working: '<svg class="spin" viewBox="0 0 20 20" fill="none"><path d="M10 3a7 7 0 1 1-6.06 3.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    waiting: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 2.5a5 5 0 0 0-5 5v3.2L3.6 13.4a.7.7 0 0 0 .62 1.1h11.56a.7.7 0 0 0 .62-1.1L15 10.7V7.5a5 5 0 0 0-5-5Zm-2 13.2a2 2 0 0 0 4 0Z"/></svg>',
    done: '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="currentColor"/><path d="m6.4 10.2 2.4 2.4 4.8-5" fill="none" stroke="var(--pane)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ready: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 3v14M3 10h14M5.05 5.05l9.9 9.9M14.95 5.05l-9.9 9.9"/></svg>'
  };
  window.MosaicoStateIcons = ICONS;
  var POINTER = '<svg viewBox="0 0 24 24"><path d="M5.5 3.2 18.6 11l-5.9 1.5-2.9 5.6Z" fill="var(--text)" stroke="var(--page)" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  var PANES = [
    { title: "Refactor auth flow", folder: "api", lines: [
      ["prompt", "> Move the session checks into a middleware"],
      ["", "● Update(src/middleware/session.ts)"],
      ["dim", "  ⎿  Added 34 lines"],
      ["", "● Update(src/routes/auth.ts)"],
      ["dim", "  ⎿  Removed 21 lines, added 3"],
      ["", "● Bash(npm test -- session)"],
      ["ok", "  ⎿  PASS test/session.test.ts (8 tests)"],
      ["", "● Every route now goes through requireSession."]
    ] },
    { title: "Evaluate the RM model", folder: "capstone", lines: [
      ["prompt", "> Run the evaluation on the new dataset"],
      ["", "● Bash(python eval.py --data rm_v2)"],
      ["ask", "Do you want to proceed?"],
      ["pick", "❯ 1. Yes"],
      ["dim", "  2. Yes, and don't ask again"],
      ["dim", "  3. No, tell Claude what to do"],
      ["ok", "  ⎿  4,200 examples · accuracy 0.913"],
      ["", "● Writing the report to eval/rm_v2.md"],
      ["", "● Up 2.4 points over rm_v1. Report saved."]
    ] },
    { title: "Landing page copy", folder: "website", lines: [
      ["prompt", "> Tighten the hero copy"],
      ["", "• Explored index.html"],
      ["", "• Edited index.html (+3 −5)"],
      ["dim", "  └ the headline is down to 7 words"],
      ["", "• Checked the page at 390 px"],
      ["ok", "• Done. The button sits closer to the subtitle."]
    ] },
    { title: "Onboarding screens", folder: "ios-app", lines: [
      ["dim", "● The three onboarding screens are in place."],
      ["prompt", "> ▍"]
    ] }
  ];

  var W = "working", A = "waiting", D = "done", R = "ready";
  // The key poses. "ask" is the moment between clicking the notification and answering.
  var POSES = {
    work: { layout: "grid", main: 0, states: [W, W, W, R], unseen: [], show: [[0, 1, 2], [0], [0, 1], [0, 1]], toast: null, badge: 0 },
    wait: { layout: "grid", main: 0, states: [W, A, W, R], unseen: [], show: [[0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5], [0, 1, 2], [0, 1]], toast: { pane: 1, state: A }, badge: 1 },
    ask: { layout: "focus", main: 1, states: [W, A, W, R], unseen: [], show: [[0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5], [0, 1, 2], [0, 1]], toast: null, badge: 1 },
    focus: { layout: "focus", main: 1, states: [W, W, W, R], unseen: [], show: [[0, 1, 2, 3, 4, 5], [0, 1, 6, 7], [0, 1, 2, 3], [0, 1]], toast: null, badge: 0 },
    done: { layout: "focus", main: 1, states: [W, W, D, R], unseen: [2], show: [[0, 1, 2, 3, 4, 5, 6], [0, 1, 6, 7], [0, 1, 2, 3, 4, 5], [0, 1]], toast: { pane: 2, state: D }, badge: 0 },
    columns: { layout: "columns", main: 1, states: [D, D, D, R], unseen: [0, 2], show: [[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 6, 7, 8], [0, 1, 2, 3, 4, 5], [0, 1]], toast: null, badge: 0 }
  };
  var STEPS = [
    { key: "work", tone: "--work", pose: "work", enter: enterWork },
    { key: "wait", tone: "--wait", pose: "wait", enter: enterWait },
    { key: "focus", tone: "--accent", pose: "focus", enter: enterFocus },
    { key: "done", tone: "--done", pose: "done", enter: enterDone },
    { key: "columns", tone: "--magenta", pose: "columns", enter: enterColumns }
  ];
  var DWELL_MS = 2600;
  var MORPH_MS = 300;
  var SIZES = { full: { width: 1080, height: 630 }, compact: { width: 620, height: 560 } };
  var MODES = ["grid", "focus", "columns"];
  var CANCELLED = {};

  // ---- Building the window ----
  var frame = document.getElementById("demo-frame");
  var dockIcon = document.getElementById("demo-dock");
  var badge = document.getElementById("demo-badge");
  var caption = document.getElementById("demo-caption");
  var chips = document.getElementById("demo-chips");
  var playButton = document.getElementById("demo-play");

  function node(tag, className, html) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (html !== undefined) el.innerHTML = html;
    return el;
  }

  var win = node("div", "win");
  win.setAttribute("aria-hidden", "true");
  var bar = node("div", "win-bar");
  var seg = node("div", "seg");
  var count = node("span", "win-count");
  // macOS: the traffic lights on the left. Windows: the icon and title on the left, caption buttons on the right.
  var left = node("div", "win-left", '<span class="lights"><i></i><i></i><i></i></span><img class="win-app-icon" src="assets/icon.png" alt=""><span class="win-title">Mosaico</span>');
  var title = left.querySelector(".win-title");
  var right = node("div", "win-right");
  right.appendChild(count);
  right.appendChild(node("span", "caption-buttons", '<svg class="i" viewBox="0 0 20 20"><path d="M5 10h10"/></svg><svg class="i" viewBox="0 0 20 20"><rect x="5.5" y="5.5" width="9" height="9" rx="1"/></svg><svg class="i" viewBox="0 0 20 20"><path d="m6 6 8 8M14 6l-8 8"/></svg>'));
  bar.appendChild(left);
  bar.appendChild(seg);
  bar.appendChild(right);
  var body = node("div", "win-body");
  var side = node("aside", "win-side");
  var sideHead = node("div", "side-head", "<span></span><span>4</span>");
  side.appendChild(sideHead);
  var area = node("div", "win-panes");
  body.appendChild(side);
  body.appendChild(area);
  var toast = node("div", "toast", '<img src="assets/icon.png" alt=""><div><div class="app"><span>Mosaico</span><span class="when"></span></div><b></b><span class="text"></span></div>');
  var cursor = node("div", "cursor", '<div class="cursor-shape">' + POINTER + "</div>");
  win.appendChild(bar);
  win.appendChild(body);
  win.appendChild(toast);
  win.appendChild(cursor);

  var modeButtons = MODES.map(function (mode) {
    var button = node("button");
    button.type = "button";
    button.tabIndex = -1;
    button.addEventListener("click", function () {
      takeOver();
      apply(Object.assign({}, shown, { layout: mode }));
    });
    seg.appendChild(button);
    return button;
  });

  var panes = PANES.map(function (pane, index) {
    var element = node("div", "dpane");
    var head = node("div", "dpane-head", '<span class="state-icon"></span><b></b><span class="folder"></span><span class="label"></span><span class="key"></span>');
    head.querySelector("b").textContent = pane.title;
    head.querySelector(".folder").textContent = pane.folder;
    var lines = node("div", "dpane-body");
    element.appendChild(head);
    element.appendChild(lines);
    area.appendChild(element);
    var sideRow = node("div", "side-row", '<span class="state-icon"></span><span><b></b><small></small></span><span class="key"></span>');
    sideRow.querySelector("b").textContent = pane.title;
    side.appendChild(sideRow);
    return { element: element, head: head, lines: lines, thinking: node("div", "ln thinking", "✻ Working… (esc to interrupt)"), sideRow: sideRow, state: null };
  });
  var usage = node("div", "side-usage", '<b></b><span class="meter"><span>5h</span><i style="--value: 42%"></i><span>42%</span></span><span class="week"></span>');
  side.appendChild(usage);

  var fallback = frame.querySelector(".demo-fallback");
  if (fallback) fallback.remove();
  frame.appendChild(win);

  // ---- Applying a pose ----
  var shown = null;
  var stepIndex = 0;
  var scale = 1;

  function replay(element, className) {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
  }

  function setState(pane, state, pose, index) {
    var before = pane.state;
    pane.state = state;
    pane.element.setAttribute("data-state", state);
    pane.element.classList.toggle("unseen", pose.unseen.indexOf(index) >= 0);
    pane.sideRow.setAttribute("data-state", state);
    [pane.head, pane.sideRow].forEach(function (place) {
      var icon = place.querySelector(".state-icon");
      icon.innerHTML = ICONS[state];
      if (before && before !== state && !reduceMotion) replay(icon, "pop");
    });
    if (before && before !== state && !reduceMotion && (state === A || state === D)) replay(pane.element, "ring");
  }

  function showLines(pane, wanted, source) {
    Array.prototype.slice.call(pane.lines.children).forEach(function (child) {
      var index = child.getAttribute("data-line");
      if (index !== null && wanted.indexOf(Number(index)) < 0) child.remove();
    });
    var delay = 0;
    wanted.forEach(function (index) {
      if (pane.lines.querySelector('[data-line="' + index + '"]')) return;
      var line = source[index];
      var element = node("div", "ln " + line[0]);
      element.textContent = line[1];
      element.setAttribute("data-line", index);
      element.style.animationDelay = delay + "ms";
      delay += 90;
      pane.lines.appendChild(element);
    });
    if (pane.state === W) pane.lines.appendChild(pane.thinking);
    else if (pane.thinking.parentNode) pane.thinking.remove();
  }

  function showToast(value) {
    var was = shown && shown.toast;
    if (value) {
      toast.querySelector(".when").textContent = t("n.now");
      toast.querySelector("b").textContent = PANES[value.pane].title;
      toast.querySelector(".text").textContent = t("s." + value.state) + " · " + t(value.state === D ? "toast.done" : "toast.wait");
    }
    if (Boolean(value) === Boolean(was)) return;
    toast.classList.remove("in", "out");
    void toast.offsetWidth;
    toast.classList.add(value ? "in" : "out");
  }

  function showBadge(value) {
    var windows = page.platform() === "win";
    dockIcon.classList.toggle("attention", windows && value > 0);
    title.textContent = windows && value > 0 ? "(" + value + ") Mosaico" : "Mosaico";
    var was = shown ? shown.badge : 0;
    if (value === was) return;
    badge.textContent = String(value || was);
    badge.hidden = false;
    badge.classList.remove("in", "out");
    void badge.offsetWidth;
    badge.classList.add(value ? "in" : "out");
  }

  function place(animate) {
    var compact = frame.clientWidth < 640;
    var size = compact ? SIZES.compact : SIZES.full;
    scale = Math.min(1.1, frame.clientWidth / size.width);
    win.classList.toggle("compact", compact);
    win.style.width = size.width + "px";
    win.style.height = size.height + "px";
    win.style.transform = "scale(" + scale + ")";
    frame.style.height = size.height * scale + "px";
    if (!shown) return;
    area.classList.toggle("still", !animate);
    var frames = layoutFrames(panes.length, shown.layout, shown.main, { x: 0, y: 0, width: area.clientWidth, height: area.clientHeight });
    panes.forEach(function (pane, index) {
      var box = frames[index];
      pane.element.style.left = box.x + "px";
      pane.element.style.top = box.y + "px";
      pane.element.style.width = box.width + "px";
      pane.element.style.height = box.height + "px";
    });
  }

  function apply(pose) {
    var moves = shown && (shown.layout !== pose.layout || shown.main !== pose.main);
    showToast(pose.toast);
    showBadge(pose.badge);
    panes.forEach(function (pane, index) {
      setState(pane, pose.states[index], pose, index);
      pane.element.classList.toggle("focused", index === pose.main);
      pane.sideRow.classList.toggle("focused", index === pose.main);
      showLines(pane, pose.show[index], PANES[index].lines);
    });
    var first = !shown;
    shown = pose;
    labels();
    if (!moves || reduceMotion) {
      place(false);
      return;
    }
    // Anticipation: a small wind-up, then the move; the panes settle after it.
    area.classList.add("windup");
    setTimeout(function () {
      area.classList.remove("windup");
      place(!first);
      setTimeout(function () { replay(area, "settle"); }, MORPH_MS);
    }, 90);
  }

  // ---- Texts (and the language switch) ----
  function labels() {
    modeButtons.forEach(function (button, index) {
      button.textContent = t("l." + MODES[index]);
      button.setAttribute("aria-pressed", String(shown && MODES[index] === shown.layout));
    });
    count.textContent = t("demo.panes");
    sideHead.firstChild.textContent = t("demo.open");
    usage.querySelector("b").textContent = t("demo.usage");
    usage.querySelector(".week").textContent = t("demo.week");
    var keyPrefix = page.platform() === "win" ? "Ctrl+" : "⌘";
    panes.forEach(function (pane, index) {
      pane.head.querySelector(".key").textContent = keyPrefix + (index + 1);
      pane.sideRow.querySelector(".key").textContent = keyPrefix + (index + 1);
      var label = t("s." + pane.state);
      pane.head.querySelector(".label").textContent = label;
      pane.sideRow.querySelector("small").textContent = label + " · " + PANES[index].folder;
    });
    if (shown && shown.toast) showToast(shown.toast);
  }

  function stepTexts() {
    // Captions that name the Dock or ⌘ have a Windows version.
    var key = "cap." + STEPS[stepIndex].key;
    var windowsKey = key + ".win";
    caption.textContent = page.platform() === "win" && t(windowsKey) !== windowsKey ? t(windowsKey) : t(key);
    var buttons = chips.querySelectorAll("button");
    Array.prototype.forEach.call(buttons, function (chip, index) {
      chip.querySelector("span").textContent = t("chip." + STEPS[index].key);
      if (index === stepIndex) chip.setAttribute("aria-current", "step"); else chip.removeAttribute("aria-current");
    });
    chips.style.setProperty("--tone", "var(" + STEPS[stepIndex].tone + ")");
    page.slideThumb(chips, buttons[stepIndex], thumbPlaced);
    thumbPlaced = true;
    playButton.setAttribute("aria-label", t(playing ? "demo.pause" : "demo.play"));
    playButton.classList.toggle("paused", !playing);
  }

  var thumbPlaced = false;

  // ---- The cursor: arcs, slow in and slow out, a squash on click ----
  var pointer = { x: 0, y: 0 };
  var hideTimer = null;

  function sleep(ms, token) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () { (token === run ? resolve : reject)(CANCELLED); }, ms);
    });
  }

  function targetOf(element, fx, fy) {
    var box = element.getBoundingClientRect();
    var origin = win.getBoundingClientRect();
    return { x: (box.left - origin.left + box.width * fx) / scale, y: (box.top - origin.top + box.height * fy) / scale };
  }

  function easeInOut(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function cursorTo(element, fx, fy, token) {
    var to = targetOf(element, fx, fy);
    var from = { x: pointer.x, y: pointer.y };
    var distance = Math.hypot(to.x - from.x, to.y - from.y);
    // The control point sits off the straight line, so the path is an arc.
    var control = { x: (from.x + to.x) / 2 - (to.y - from.y) * 0.3, y: (from.y + to.y) / 2 + (to.x - from.x) * 0.3 - distance * 0.12 };
    var duration = Math.max(380, Math.min(720, distance * 0.9));
    clearTimeout(hideTimer);
    cursor.classList.add("shown");
    return new Promise(function (resolve, reject) {
      var start = performance.now();
      function tick(now) {
        if (token !== run) { reject(CANCELLED); return; }
        var p = easeInOut(Math.min(1, (now - start) / duration));
        var q = 1 - p;
        pointer.x = q * q * from.x + 2 * q * p * control.x + p * p * to.x;
        pointer.y = q * q * from.y + 2 * q * p * control.y + p * p * to.y;
        cursor.style.transform = "translate(" + pointer.x + "px, " + pointer.y + "px)";
        if (p < 1) requestAnimationFrame(tick); else resolve();
      }
      requestAnimationFrame(tick);
    });
  }

  function click(element, token) {
    replay(cursor.firstChild, "press");
    if (element) {
      replay(element, "pressed");
      setTimeout(function () { element.classList.remove("pressed"); }, 170);
    }
    hideTimer = setTimeout(function () { cursor.classList.remove("shown"); }, 1400);
    return sleep(180, token);
  }

  // The Dock bounces on the Mac; the taskbar button flashes on Windows.
  function bounceDock() {
    if (!reduceMotion) replay(dockIcon, page.platform() === "win" ? "flash" : "bounce");
  }

  // ---- The steps: each one's choreography, ending on its pose ----
  async function enterWork(token) {
    if (shown && shown.layout !== "grid") {
      await cursorTo(modeButtons[0], 0.5, 0.6, token);
      await click(modeButtons[0], token);
    }
    apply(POSES.work);
  }

  async function enterWait(token) {
    apply(Object.assign({}, POSES.wait, { toast: null, badge: 0 }));
    await sleep(380, token);
    apply(POSES.wait);
    bounceDock();
  }

  async function enterFocus(token) {
    await cursorTo(toast, 0.42, 0.55, token);
    await click(toast, token);
    apply(POSES.ask);
    await sleep(MORPH_MS + 520, token);
    var yes = panes[1].lines.querySelector('[data-line="3"]');
    await cursorTo(yes, 0.12, 0.5, token);
    await click(yes, token);
    apply(POSES.focus);
  }

  async function enterDone(token) {
    apply(Object.assign({}, POSES.done, { toast: null }));
    await sleep(380, token);
    apply(POSES.done);
    bounceDock();
  }

  async function enterColumns(token) {
    await cursorTo(modeButtons[2], 0.5, 0.6, token);
    await click(modeButtons[2], token);
    apply(POSES.columns);
  }

  // ---- Playing, pausing, jumping ----
  var run = 0;
  var playing = !reduceMotion;
  var visible = false;

  async function loop(token, reached) {
    try {
      for (;;) {
        stepTexts();
        if (!reached) await STEPS[stepIndex].enter(token);
        reached = false;
        await sleep(DWELL_MS, token);
        stepIndex = (stepIndex + 1) % STEPS.length;
      }
    } catch (stop) {
      if (stop !== CANCELLED) throw stop;
    }
  }

  // Starts (again) from the current step: if its pose is already on screen it
  // just waits; otherwise it goes back to the pose before it, so the step's
  // choreography starts where it expects to.
  function restart() {
    run += 1;
    if (!(playing && visible && !document.hidden)) return;
    var reached = shown === POSES[STEPS[stepIndex].pose];
    if (!reached) apply(POSES[STEPS[(stepIndex + STEPS.length - 1) % STEPS.length].pose]);
    loop(run, reached);
  }

  function takeOver() {
    playing = false;
    run += 1;
    cursor.classList.remove("shown");
    stepTexts();
  }

  STEPS.forEach(function (step, index) {
    var chip = node("button", null, "<span></span>");
    chip.type = "button";
    chip.addEventListener("click", function () {
      takeOver();
      stepIndex = index;
      stepTexts();
      apply(POSES[step.pose]);
    });
    chips.appendChild(chip);
  });

  playButton.addEventListener("click", function () {
    if (playing) {
      takeOver();
      return;
    }
    playing = true;
    stepIndex = (stepIndex + 1) % STEPS.length;
    restart();
  });

  pointer = { x: SIZES.full.width * 0.55, y: SIZES.full.height * 0.82 };
  cursor.style.transform = "translate(" + pointer.x + "px, " + pointer.y + "px)";
  stepIndex = reduceMotion ? 1 : 0;
  apply(POSES[STEPS[stepIndex].pose]);
  stepTexts();
  new ResizeObserver(function () { place(false); }).observe(frame);
  new ResizeObserver(function () {
    page.slideThumb(chips, chips.querySelectorAll("button")[stepIndex], false);
  }).observe(chips);
  new IntersectionObserver(function (entries) {
    var nowVisible = entries[0].isIntersecting;
    if (nowVisible === visible) return;
    visible = nowVisible;
    if (visible) restart(); else run += 1;
  }, { threshold: 0.35 }).observe(frame);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) run += 1; else restart();
  });
  page.onLanguage(function () {
    labels();
    stepTexts();
  });
  page.onPlatform(function () {
    labels();
    stepTexts();
    if (shown) {
      var badgeNow = shown.badge;
      dockIcon.classList.toggle("attention", page.platform() === "win" && badgeNow > 0);
      title.textContent = page.platform() === "win" && badgeNow > 0 ? "(" + badgeNow + ") Mosaico" : "Mosaico";
    }
  });
})();
