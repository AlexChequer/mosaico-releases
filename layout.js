// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Alex Chequer
//
// The app's layout rule (SPEC.md, section 3; the same as the Mac's
// PaneLayout and windows/src/layout.ts): where each pane goes in Grid, Focus
// and Columns. The demo window places its panes with it.
(function () {
  "use strict";

  var GAP = 8;
  /** Width of Focus's main pane relative to the right column (about 64% of the width). */
  var FOCUS_RATIO = 1.8;

  function along(count, length, start) {
    var size = (length - GAP * (count - 1)) / count;
    var out = [];
    for (var i = 0; i < count; i++) out.push({ start: start + i * (size + GAP), size: size });
    return out;
  }

  function row(count, box) {
    return along(count, box.width, box.x).map(function (part) {
      return { x: part.start, y: box.y, width: part.size, height: box.height };
    });
  }

  function column(count, box) {
    return along(count, box.height, box.y).map(function (part) {
      return { x: box.x, y: part.start, width: box.width, height: part.size };
    });
  }

  /** Panes per row in the Grid: the first `extra` rows get one more. */
  function gridRowCounts(count) {
    var cols = Math.ceil(Math.sqrt(count));
    var rows = Math.ceil(count / cols);
    var base = Math.floor(count / rows);
    var extra = count % rows;
    var out = [];
    for (var i = 0; i < rows; i++) out.push(i < extra ? base + 1 : base);
    return out;
  }

  function focusFrames(count, main, box) {
    var mainWidth = ((box.width - GAP) * FOCUS_RATIO) / (FOCUS_RATIO + 1);
    var side = { x: box.x + mainWidth + GAP, y: box.y, width: box.width - mainWidth - GAP, height: box.height };
    var stacked = column(count - 1, side);
    var next = 0;
    var out = [];
    for (var i = 0; i < count; i++) {
      out.push(i === main ? { x: box.x, y: box.y, width: mainWidth, height: box.height } : stacked[next++]);
    }
    return out;
  }

  window.MosaicoLayout = function (count, mode, main, box) {
    if (mode === "columns") return row(count, box);
    if (mode === "focus" && count > 1) return focusFrames(count, main, box);
    var counts = gridRowCounts(count);
    var bands = column(counts.length, box);
    return counts.reduce(function (all, rowCount, index) {
      return all.concat(row(rowCount, bands[index]));
    }, []);
  };
})();
