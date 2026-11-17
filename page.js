// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Alex Chequer
//
// The page itself: English or Portuguese, the platform tab, the copy and
// download feedback, and the theme picker. The demos ask it for texts
// through window.MosaicoPage.
(function () {
  "use strict";

  // Texts that aren't in the HTML (the demos' and the picker's), in English.
  var EN = {
    "demo.pause": "Pause the demo",
    "demo.play": "Play the demo",
    "chip.work": "Side by side",
    "chip.wait": "Needs you",
    "chip.focus": "Focus",
    "chip.done": "Done",
    "chip.columns": "Columns",
    "cap.work": "Four sessions run side by side, and each pane shows what its agent is doing.",
    "cap.wait": "One asks for permission: a yellow border, a badge on the Dock and a notification.",
    "cap.focus": "Click the notification and that session takes the big pane. Answer, and it goes back to work.",
    "cap.done": "Another one finishes. A green glow stays on it until you look.",
    "cap.columns": "Columns puts them side by side at full height. ⌥⌘1, ⌥⌘2 and ⌥⌘3 switch layouts.",
    "s.working": "Working",
    "s.waiting": "Needs you",
    "s.done": "Done",
    "s.ready": "Ready",
    "demo.panes": "4 panes",
    "demo.open": "Open Sessions",
    "demo.usage": "Plan Usage",
    "demo.week": "Weekly: 23%",
    "toast.wait": "Wants permission to use Bash.",
    "toast.done": "Codex finished. Click to open Mosaico.",
    "t.system": "Match my system",
    "t.all": "Show all 23 themes",
    "t.fewer": "Show fewer themes",
    "t.group.mosaico": "Mosaico",
    "t.group.classic": "Classic terminal themes",
    "copied": "Copied. Paste it in Terminal and press Return.",
    "copied.win": "Copied. Paste it in PowerShell and press Enter.",
    "copied.label": "Copied",
    "copy.manual": "Selected. Press ⌘C (Ctrl+C on Windows) to copy it.",
    "cap.wait.win": "One asks for permission: a yellow border, a flashing taskbar button and a notification.",
    "cap.columns.win": "Columns puts them side by side at full height. Ctrl+Alt+1, 2 and 3 switch layouts.",
    "downloading": "Downloading. When it's done, follow the steps above."
  };

  var PT = {
    "nav.how": "Como funciona",
    "nav.notes": "Notas da versão",
    "nav.code": "Código-fonte",
    "nav.get": "Baixar",
    "hero.tagline": "Um terminal para rodar vários agentes de código ao mesmo tempo",
    "hero.lede": "Claude Code e Codex lado a lado, cada painel mostrando o que o agente está fazendo",
    "nav.get": "Instalar",
    "mac.paste": "Cole isto no Terminal. Ele coloca o Mosaico em Aplicativos e abre.",
    "win.paste": "Cole isto no PowerShell. Ele instala o Mosaico para o seu usuário e abre.",
    "copy": "Copiar",
    "copied.label": "Copiado",
    "copy.manual": "Selecionado. Aperte ⌘C (Ctrl+C no Windows) para copiar.",
    "file.link": "Prefere baixar o arquivo?",
    "copied": "Copiado. Cole no Terminal e aperte Return.",
    "copied.win": "Copiado. Cole no PowerShell e aperte Enter.",
    "version": "Versão",
    "free": "Gratuito",
    "mac.needs": "macOS 14 ou mais novo, com Apple silicon",
    "win.needs": "Windows 10 (1809 ou mais novo) ou 11, 64 bits",
    "downloading": "Baixando. Quando terminar, siga os passos acima.",
    "cap.wait.win": "Uma pede permissão: borda amarela, o botão na barra de tarefas pisca e chega uma notificação.",
    "cap.columns.win": "Colunas põe todas lado a lado na altura toda. Ctrl+Alt+1, 2 e 3 trocam o layout.",
    "shot.alt.win": "O app para Windows no modo Foco: uma sessão trabalhando, uma esperando permissão, uma concluída e uma pronta, com a barra lateral, o uso do plano e os projetos recentes.",
    "l.real.win": "O modo Foco no app para Windows",
    "n.p2.win": "Clique numa para voltar ao Mosaico",
    "n.p4.win": "O botão na barra de tarefas pisca, e o título da janela mostra quantas estão esperando",
    "d.title": "Prefere baixar o arquivo?",
    "d.intro": "O comando lá em cima é o jeito mais rápido. O Mosaico ainda não é assinado pela Apple nem pela Microsoft, então um arquivo baixado pelo navegador precisa ser liberado na primeira vez que você abre. Dá para ler o que o comando roda: <a href=\"install.sh\">install.sh</a> e <a href=\"install.ps1\">install.ps1</a>.",
    "d.mac": "Baixar o Mosaico-macOS.zip",
    "d.win": "Baixar o Mosaico-Windows-Setup.exe",
    "d.then": "Depois de baixar",
    "shot.alt": "O Mosaico no modo Foco: uma sessão trabalhando, uma esperando permissão e uma concluída, com a barra lateral listando cada sessão, o uso do plano e os projetos recentes.",
    "demo.pause": "Pausar a demonstração",
    "demo.play": "Continuar a demonstração",
    "chip.work": "Lado a lado",
    "chip.wait": "Precisa de você",
    "chip.focus": "Foco",
    "chip.done": "Concluído",
    "chip.columns": "Colunas",
    "cap.work": "Quatro sessões rodam lado a lado, e cada painel mostra o que o agente está fazendo.",
    "cap.wait": "Uma pede permissão: borda amarela, um número no ícone do Dock e uma notificação.",
    "cap.focus": "Clique na notificação e essa sessão vai para o painel grande. Responda, e ela volta a trabalhar.",
    "cap.done": "Outra termina. Um brilho verde fica nela até você olhar.",
    "cap.columns": "Colunas põe todas lado a lado na altura toda. ⌥⌘1, ⌥⌘2 e ⌥⌘3 trocam o layout.",
    "s.working": "Trabalhando",
    "s.waiting": "Precisa de você",
    "s.done": "Concluído",
    "s.ready": "Pronto",
    "demo.panes": "4 painéis",
    "demo.open": "Sessões abertas",
    "demo.usage": "Uso do plano",
    "demo.week": "Semanal: 23%",
    "toast.wait": "Quer permissão para usar o Bash.",
    "toast.done": "O Codex terminou. Clique para abrir o Mosaico.",
    "l.title": "Grade, Foco e Colunas",
    "l.intro": "Até nove painéis que se reorganizam sozinhos conforme você abre e fecha sessões. Troque quando quiser; nada reinicia.",
    "l.grid": "Grade",
    "l.grid.p": "Todas as sessões do mesmo tamanho, para ficar de olho em todas",
    "l.focus": "Foco",
    "l.focus.p": "Um painel grande para a sessão em que você está trabalhando, e as outras numa coluna ao lado",
    "l.columns": "Colunas",
    "l.columns.p": "Lado a lado na altura toda, para telas largas e ultrawide",
    "k.jump": "vão direto para um painel",
    "k.next": "vai para o próximo que precisa de você",
    "k.main": "põe o painel em foco no lugar grande",
    "l.real": "O modo Foco no app de verdade, num Mac",
    "h.title": "Cada agente conta ao Mosaico o que está fazendo",
    "h.intro": "O Claude Code e o Codex anunciam cada passo pelos seus hooks. O Mosaico transforma cada evento no estado do painel na hora em que ele acontece, sem ler a tela e sem adivinhar.",
    "h.note": "As sessões que você abre no Mosaico se reportam sozinhas. Para um <code>claude</code> que você digita, ou para o Codex, o Mosaico pergunta antes de pôr sua entrada nas configurações do agente.",
    "h.esc": "Esc e um novo prompt",
    "n.title": "Notificações só quando uma sessão precisa de você ou termina",
    "n.p1": "Elas só chegam enquanto você está em outro app",
    "n.p2": "Clique numa e o Mosaico abre naquele painel",
    "n.p3": "Responda ao Claude pela própria notificação",
    "n.p4": "O ícone no Dock mostra quantas sessões estão esperando",
    "n.now": "agora",
    "n.perm": "Quer permissão para usar o Bash.",
    "n.reply": "Responder ao Claude…",
    "n.finished": "Landing page copy: o Codex terminou. Clique para abrir o Mosaico.",
    "u.title": "Veja quanto do seu plano ainda resta",
    "u.intro": "A janela de 5 horas e a semana, de cada agente, no canto da barra lateral. O Mosaico lê esses números dos próprios agentes: a status line do Claude Code e o arquivo de sessão do Codex. A partir de 80% o número fica amarelo.",
    "u.claude": "Uso do Claude Code",
    "u.claude.reset": "Recomeça às 22:52 · em 3h 16m",
    "u.claude.week": "Semanal: 23%",
    "u.codex": "Uso do Codex",
    "u.codex.reset": "Recomeça às 18:10 · em 51m",
    "u.codex.week": "Semanal: 61%",
    "t.title": "Os 23 temas do app, aqui na página",
    "t.intro": "Escolha um e a página muda para ele. O Mosaico tem os mesmos, escuros e claros.",
    "t.system": "Seguir o sistema",
    "t.all": "Mostrar os 23 temas",
    "t.fewer": "Mostrar menos temas",
    "t.group.mosaico": "Mosaico",
    "t.group.classic": "Clássicos de terminal",
    "f4.t": "De volta de onde parou",
    "f4.p": "Feche o Mosaico e abra de novo: cada painel volta na sua pasta e na sua conversa.",
    "f5.t": "Claude Code e Codex",
    "f5.p": "Abra qualquer um pela Nova sessão. Um <code>claude</code> ou <code>codex</code> que você digita num terminal comum também é reconhecido.",
    "f7.t": "CPU e memória por painel",
    "f7.p": "Veja qual sessão está ocupada e quanta memória cada uma usa.",
    "o.mac1": "Descompacte e arraste o Mosaico para Aplicativos.",
    "o.mac2": "Abra. O macOS diz que não conseguiu verificar o app; feche o aviso sem mover para o Lixo.",
    "o.mac3": "Vá em Ajustes do Sistema → Privacidade e Segurança, role até o fim e clique em Abrir Mesmo Assim.",
    "o.mac4": "No macOS 14, clique no Mosaico em Aplicativos com Control apertado e escolha Abrir.",
    "o.win1": "Abra o Mosaico-Windows-Setup.exe.",
    "o.win2": "Em “O Windows protegeu o computador”, clique em Mais informações e depois em Executar assim mesmo.",
    "o.win3": "O Mosaico é instalado só para o seu usuário e aparece no menu Iniciar.",
    "p.t": "O Mosaico pergunta antes de mexer nas configurações dos agentes",
    "p.p1": "Ele guarda um backup antes, e os Ajustes têm um botão Remover que deixa tudo como estava.",
    "p.t2": "Nada sai do seu computador",
    "p.code": "O código é aberto, então dá para conferir isso: <a href=\"https://github.com/AlexChequer/mosaico\">leia no GitHub</a>.",
    "p.p2": "O Mosaico não tem conta e fica offline. A única exceção é você quem liga: uma verificação que pergunta ao GitHub o número da última versão. Os logs ficam no seu computador e guardam nomes de eventos e tamanhos, nunca seus prompts, código ou respostas.",
    "foot.license": "Software livre sob a GPL-3.0-or-later",
    "foot.code": "Código-fonte",
    "foot.tm": "O Claude Code é feito pela Anthropic e o Codex pela OpenAI. O Mosaico não tem vínculo com nenhuma das duas."
  };
  var META = {
    en: document.querySelector('meta[name="description"]').content,
    pt: "Rode suas sessões de Claude Code e Codex lado a lado e veja de relance qual precisa de você. Para macOS e Windows."
  };
  // The themes shown before "Show all": dark and light, calm and bright.
  var FEATURED = ["Terminal", "Paper", "Midnight", "Plum", "Tokyo Night", "Dracula", "Catppuccin Mocha", "Solarized Light"];

  function stored(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function store(key, value) {
    try {
      if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value);
    } catch (e) { /* the choice just isn't remembered */ }
  }

  // ---- Language ----
  var englishHTML = {};
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    englishHTML[el.getAttribute("data-i18n")] = el.innerHTML;
  });
  var englishAlt = [];
  document.querySelectorAll("[data-i18n-alt]").forEach(function (el) { englishAlt.push(el.alt); });
  var language = stored("mosaico.lang") || ((navigator.language || "").toLowerCase().indexOf("pt") === 0 ? "pt" : "en");
  var listeners = [];

  function t(key) {
    if (language === "pt" && PT[key]) return PT[key];
    return englishHTML[key] !== undefined ? englishHTML[key] : (EN[key] || key);
  }

  function applyLanguage() {
    var pt = language === "pt";
    document.documentElement.lang = pt ? "pt-BR" : "en";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el, index) {
      el.alt = pt ? PT[el.getAttribute("data-i18n-alt")] : englishAlt[index];
    });
    document.querySelectorAll("[data-i18n-label]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-label");
      if (!el.hasAttribute("data-label-en")) el.setAttribute("data-label-en", el.getAttribute("aria-label"));
      el.setAttribute("aria-label", pt && PT[key] ? PT[key] : el.getAttribute("data-label-en"));
    });
    document.querySelector('meta[name="description"]').content = META[language];
    document.querySelectorAll("[data-lang-toggle]").forEach(function (button) {
      var long = button.hasAttribute("data-long");
      button.textContent = long ? (pt ? "English" : "Português") : (pt ? "EN" : "PT");
      button.setAttribute("aria-label", pt ? "English" : "Português");
    });
    listeners.forEach(function (listener) { listener(); });
  }

  document.querySelectorAll("[data-lang-toggle]").forEach(function (button) {
    button.addEventListener("click", function () {
      language = language === "pt" ? "en" : "pt";
      store("mosaico.lang", language);
      applyLanguage();
    });
  });

  // ---- The bar stays out of the first viewport; it slides in once the install command scrolls away ----
  var bar = document.querySelector(".bar");
  new IntersectionObserver(function (entries) {
    var entry = entries[0];
    bar.classList.toggle("shown", !entry.isIntersecting && entry.boundingClientRect.top < 0);
  }).observe(document.getElementById("install"));

  // ---- The liquid thumb: it stretches over both places as it slides, then settles ----
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function slideThumb(container, target, animate) {
    var thumb = container.querySelector(".thumb");
    if (!thumb || !target) return;
    var x = target.offsetLeft;
    var w = target.offsetWidth;
    var fromX = thumb.dataset.x === undefined ? x : Number(thumb.dataset.x);
    var fromW = thumb.dataset.w === undefined ? w : Number(thumb.dataset.w);
    thumb.dataset.x = x;
    thumb.dataset.w = w;
    thumb.style.transform = "translateX(" + x + "px)";
    thumb.style.width = w + "px";
    if (!animate || reduceMotion || !thumb.animate || (fromX === x && fromW === w)) return;
    var left = Math.min(fromX, x);
    var right = Math.max(fromX + fromW, x + w);
    thumb.animate([
      { transform: "translateX(" + fromX + "px)", width: fromW + "px" },
      { transform: "translateX(" + left + "px) scaleY(0.9)", width: right - left + "px", offset: 0.45 },
      { transform: "translateX(" + x + "px)", width: w + "px" }
    ], { duration: 280, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
  }

  // ---- Platform: the switch decides what the whole page shows (html[data-os]) ----
  var tabs = { mac: document.getElementById("tab-mac"), win: document.getElementById("tab-win") };
  var platformSwitch = tabs.mac.parentNode;
  var os = "mac";
  var platformListeners = [];

  function speaker(element) {
    var timer = null;
    return function (html, ms) {
      element.innerHTML = html;
      clearTimeout(timer);
      if (html) timer = setTimeout(function () { element.innerHTML = ""; }, ms);
    };
  }
  var say = speaker(document.getElementById("feedback"));
  var sayFile = speaker(document.getElementById("file-feedback"));

  function show(next, animate) {
    if (next !== os) {
      say("", 0);
      sayFile("", 0);
    }
    os = next;
    document.documentElement.setAttribute("data-os", os);
    Object.keys(tabs).forEach(function (key) {
      tabs[key].setAttribute("aria-selected", String(key === os));
      document.getElementById("os-" + key).hidden = key !== os;
    });
    slideThumb(platformSwitch, tabs[os], animate);
    platformListeners.forEach(function (listener) { listener(os); });
  }
  var platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent;
  tabs.mac.addEventListener("click", function () { show("mac", true); });
  tabs.win.addEventListener("click", function () { show("win", true); });

  // ---- Copy: the page's one action ----
  document.querySelectorAll("[data-copy]").forEach(function (button) {
    var label = button.querySelector(".copy-label");
    var timer = null;
    // Liquid Glass catches the light where the pointer is.
    if (!reduceMotion) {
      button.addEventListener("pointermove", function (event) {
        var box = button.getBoundingClientRect();
        button.style.setProperty("--lx", ((event.clientX - box.left) / box.width) * 100 + "%");
        button.style.setProperty("--ly", ((event.clientY - box.top) / box.height) * 100 - 40 + "%");
      });
      button.addEventListener("pointerleave", function () {
        button.style.removeProperty("--lx");
        button.style.removeProperty("--ly");
      });
    }
    button.addEventListener("click", function () {
      var code = document.getElementById(button.getAttribute("data-copy"));
      var done = function () {
        button.classList.add("copied");
        label.textContent = t("copied.label");
        say(t(os === "win" ? "copied.win" : "copied"), 3200);
        clearTimeout(timer);
        timer = setTimeout(function () {
          button.classList.remove("copied");
          label.innerHTML = t("copy");
        }, 1800);
      };
      var select = function () {
        var range = document.createRange();
        range.selectNodeContents(code);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        say(t("copy.manual"), 4000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code.textContent.trim()).then(done, select);
      } else {
        select();
      }
    });
  });

  // ---- The file, for those who prefer it: the steps sit right beside it ----
  document.querySelectorAll("a.download").forEach(function (link) {
    link.addEventListener("click", function () { sayFile(t("downloading"), 9000); });
  });

  // A screenshot still loading fades in over a placeholder of its size.
  document.querySelectorAll(".shot img").forEach(function (image) {
    if (image.complete) return;
    image.classList.add("loading");
    image.addEventListener("load", function () { image.classList.remove("loading"); });
  });

  // ---- Themes: the app's own, from themes.js ----
  var catalog = window.MOSAICO_THEMES;
  var list = document.getElementById("theme-list");
  var chosen = stored("mosaico.theme");
  var showingAll = false;

  function applyTheme(name) {
    var style = document.documentElement.style;
    var theme = catalog.themes.filter(function (item) { return item.name === name; })[0];
    Object.keys(catalog.themes[0].colors).forEach(function (key) { style.removeProperty("--" + key); });
    ["--shadow", "color-scheme", "--glass-fill", "--glass-shadow"].forEach(function (key) { style.removeProperty(key); });
    if (theme) {
      Object.keys(theme.colors).forEach(function (key) { style.setProperty("--" + key, theme.colors[key]); });
      style.setProperty("--shadow", theme.shadow);
      style.setProperty("color-scheme", theme.dark ? "dark" : "light");
      style.setProperty("--glass-fill", "color-mix(in srgb, var(--raised) " + (theme.dark ? 42 : 55) + "%, transparent)");
      style.setProperty("--glass-shadow", theme.dark
        ? "0 10px 30px rgb(0 0 0 / 0.22), 0 2px 6px rgb(0 0 0 / 0.12)"
        : "0 10px 30px rgb(40 35 20 / 0.12), 0 2px 6px rgb(40 35 20 / 0.08)");
    }
    chosen = theme ? theme.name : null;
    list.querySelectorAll("[data-theme]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-theme") === (chosen || "")));
    });
  }

  function node(tag, className) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    return el;
  }

  function swatch(theme) {
    var button = node("button", "swatch");
    button.type = "button";
    button.setAttribute("data-theme", theme.name);
    var colors = node("span", "colors");
    ["surface", "accent", "work", "wait", "done"].forEach(function (key) {
      var part = node("span");
      part.style.background = theme.colors[key];
      colors.appendChild(part);
    });
    var label = node("span", "theme-name");
    label.setAttribute("data-en", theme.name);
    label.setAttribute("data-pt", theme.pt);
    button.appendChild(colors);
    button.appendChild(label);
    button.addEventListener("click", function () {
      applyTheme(theme.name);
      store("mosaico.theme", theme.name);
    });
    return button;
  }

  function buildThemes() {
    var tools = node("div", "theme-tools");
    var system = node("button", "text-button");
    system.type = "button";
    system.setAttribute("data-theme", "");
    system.setAttribute("data-key", "t.system");
    system.addEventListener("click", function () {
      applyTheme(null);
      store("mosaico.theme", null);
    });
    var more = node("button", "text-button");
    more.type = "button";
    more.id = "themes-more";
    more.setAttribute("aria-expanded", "false");
    tools.appendChild(system);
    tools.appendChild(more);

    var featured = node("div", "swatches");
    FEATURED.forEach(function (name) {
      var theme = catalog.themes.filter(function (item) { return item.name === name; })[0];
      if (theme) featured.appendChild(swatch(theme));
    });

    var rest = node("div", "all-themes");
    rest.hidden = true;
    catalog.groups.forEach(function (group) {
      var others = catalog.themes.filter(function (theme) {
        return theme.group === group.id && FEATURED.indexOf(theme.name) < 0;
      });
      if (!others.length) return;
      var box = node("div", "theme-group");
      var title = node("h3");
      title.setAttribute("data-key", "t.group." + group.id);
      var grid = node("div", "swatches");
      others.forEach(function (theme) { grid.appendChild(swatch(theme)); });
      box.appendChild(title);
      box.appendChild(grid);
      rest.appendChild(box);
    });
    more.addEventListener("click", function () {
      showingAll = !showingAll;
      rest.hidden = !showingAll;
      more.setAttribute("aria-expanded", String(showingAll));
      nameThemes();
    });

    list.appendChild(featured);
    list.appendChild(tools);
    list.appendChild(rest);
    // A theme picked earlier from the full list stays visible.
    if (chosen && FEATURED.indexOf(chosen) < 0) {
      showingAll = true;
      rest.hidden = false;
      more.setAttribute("aria-expanded", "true");
    }
  }

  function nameThemes() {
    list.querySelectorAll(".theme-name[data-en]").forEach(function (label) {
      label.textContent = label.getAttribute(language === "pt" ? "data-pt" : "data-en");
    });
    list.querySelectorAll("[data-key]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-key"));
    });
    document.getElementById("themes-more").textContent = t(showingAll ? "t.fewer" : "t.all");
  }

  buildThemes();
  listeners.push(nameThemes);
  listeners.push(function () { slideThumb(platformSwitch, tabs[os], false); });
  applyTheme(chosen);
  applyLanguage();
  show(/win/i.test(platform) ? "win" : "mac", false);
  new ResizeObserver(function () { slideThumb(platformSwitch, tabs[os], false); }).observe(platformSwitch);
  if (document.fonts) document.fonts.ready.then(function () { slideThumb(platformSwitch, tabs[os], false); });

  window.MosaicoPage = {
    t: t,
    slideThumb: slideThumb,
    platform: function () { return os; },
    onPlatform: function (listener) { platformListeners.push(listener); },
    onLanguage: function (listener) { listeners.push(listener); }
  };
})();
