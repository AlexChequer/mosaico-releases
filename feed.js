// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Alex Chequer
//
// The hooks section: one hook event lights up at a time, and the pane beside
// the list takes the state that event gives it, as the app does.
(function () {
  "use strict";

  var t = window.MosaicoPage.t;
  var icons = window.MosaicoStateIcons;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var STEP_MS = 1360;

  var feed = document.getElementById("feed");
  var events = feed.querySelectorAll(".events li");
  var pane = document.getElementById("feed-pane");
  var icon = pane.querySelector(".state-icon");
  var index = reduceMotion ? 3 : 0;
  var visible = false;
  var timer = null;

  function show(animate) {
    Array.prototype.forEach.call(events, function (item, position) {
      item.classList.toggle("active", position === index);
    });
    var state = events[index].getAttribute("data-state");
    var changed = pane.getAttribute("data-state") !== state;
    pane.setAttribute("data-state", state);
    icon.innerHTML = icons[state];
    pane.querySelector(".mini-state").textContent = t("s." + state);
    if (animate && changed) {
      icon.classList.remove("pop");
      void icon.offsetWidth;
      icon.classList.add("pop");
    }
  }

  function next() {
    clearTimeout(timer);
    if (reduceMotion || !visible || document.hidden) return;
    timer = setTimeout(function () {
      index = (index + 1) % events.length;
      show(true);
      next();
    }, STEP_MS);
  }

  if (reduceMotion) feed.classList.add("static");
  show(false);
  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    next();
  }, { threshold: 0.4 }).observe(feed);
  document.addEventListener("visibilitychange", next);
  window.MosaicoPage.onLanguage(function () { show(false); });
})();
