/* ==========================================================================
   澜链 LanLink · 产品宣发页交互脚本
   职责：入场动画、滚动进度、导航吸顶、平台识别、校验值复制、控制台聚光、演示视频章节
   依赖：无（原生 JS，无构建步骤）
   ========================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 一、元素获取 ---------- */
  var progressBar = document.getElementById('progressBar');
  var nav = document.getElementById('nav');
  var toast = document.getElementById('toast');
  var mobileBar = document.getElementById('mobileBar');
  var osDetect = document.getElementById('osDetect');
  var osDetectName = document.getElementById('osDetectName');
  var osDetectHint = document.getElementById('osDetectHint');
  var ctaPrimary = document.getElementById('ctaPrimary');
  var mobileCta = document.getElementById('mobileCta');
  var heroConsole = document.getElementById('heroConsole');

  /* ---------- 二、滚动进度 + 导航吸顶 ---------- */
  var ticking = false;

  function onScroll() {
    var docTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = docHeight > 0 ? Math.min(docTop / docHeight, 1) : 0;

    if (progressBar) progressBar.style.width = (ratio * 100).toFixed(2) + '%';
    if (nav) nav.classList.toggle('is-stuck', docTop > 24);

    if (mobileBar) {
      var showBar = docTop > 520 && docTop < docHeight + 200;
      mobileBar.classList.toggle('is-visible', showBar);
    }

    revealVisible();

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  /* ---------- 三、入场动画 ----------
     以滚动位置判定可见性：只要元素进入视口即点亮。
     不使用 IntersectionObserver —— 快速滚动或锚点跳转时，
     观察器可能错过中间态，导致内容永久隐藏。 */
  var revealPending = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  function revealVisible() {
    if (!revealPending || !revealPending.length) return;
    var threshold = window.innerHeight * 0.92;
    var remaining = [];
    for (var i = 0; i < revealPending.length; i++) {
      var el = revealPending[i];
      if (el.getBoundingClientRect().top < threshold) {
        el.classList.add('is-in');
      } else {
        remaining.push(el);
      }
    }
    revealPending = remaining;
  }
  revealVisible();

  /* ---------- 四、卡片聚光（跟随指针） ---------- */
  var spotlightCards = document.querySelectorAll('.card');

  for (var k = 0; k < spotlightCards.length; k++) {
    (function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--cx', ((event.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
      });
    })(spotlightCards[k]);
  }

  /* ---------- 五、控制台聚光 ---------- */
  if (heroConsole) {
    heroConsole.addEventListener('pointermove', function (event) {
      var rect = heroConsole.getBoundingClientRect();
      heroConsole.style.setProperty('--mx', ((event.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
      heroConsole.style.setProperty('--my', ((event.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
    });
  }

  /* ---------- 六、平台识别 ---------- */
  var platform = detectPlatform();

  function detectPlatform() {
    var ua = navigator.userAgent;
    var platformHint = navigator.platform || '';

    if (/Macintosh|Mac OS X|MacIntel/i.test(ua) || /Mac/i.test(platformHint)) {
      /* Apple Silicon 与 Intel 均使用同一安装包时按 macOS 处理 */
      return 'macos';
    }
    if (/Windows/i.test(ua) || /Win/i.test(platformHint)) return 'windows';
    if (/Linux/i.test(ua) || /X11/i.test(platformHint)) return 'linux';
    return 'unknown';
  }

  var platformText = {
    windows: 'Windows',
    macos: 'macOS',
    linux: 'Linux',
    unknown: '未知系统'
  };

  var downloadTargets = {
    windows: document.querySelector('.dl-card--win'),
    macos: document.querySelector('.dl-card--mac')
  };

  if (osDetect && osDetectName) {
    osDetect.hidden = false;
    osDetectName.textContent = platformText[platform];

    if (platform === 'linux') {
      osDetectHint.textContent = 'Linux 版本请在 GitHub 仓库中自行构建 .AppImage 或 .deb';
    } else if (platform === 'unknown') {
      osDetectHint.textContent = '请手动选择对应平台的安装包';
    } else {
      osDetectHint.textContent = '已为你标记推荐版本';
    }
  }

  if (downloadTargets[platform]) {
    downloadTargets[platform].classList.add('is-current');
  }

  /* 主按钮文案随平台切换 */
  if (ctaPrimary) {
    var primaryLabel = ctaPrimary.querySelector('.btn__label');
    if (primaryLabel) {
      if (platform === 'macos') primaryLabel.textContent = '下载 macOS 版';
      else if (platform === 'windows') primaryLabel.textContent = '下载 Windows 版';
      else primaryLabel.textContent = '查看下载';
    }
  }

  if (mobileCta) {
    if (platform === 'macos') mobileCta.textContent = '下载 macOS 版';
    else if (platform === 'windows') mobileCta.textContent = '下载 Windows 版';
    else mobileCta.textContent = '立即下载';
  }

  /* ---------- 七、复制校验值 ---------- */
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-on');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-on');
    }, 2000);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    /* 降级方案：临时 textarea + execCommand */
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', 'readonly');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (error) {
        ok = false;
      }
      document.body.removeChild(area);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }

  var copyButtons = document.querySelectorAll('.copy-btn');

  for (var m = 0; m < copyButtons.length; m++) {
    copyButtons[m].addEventListener('click', function () {
      var value = this.getAttribute('data-copy') || '';
      var self = this;
      copyText(value).then(function () {
        var original = self.textContent;
        self.textContent = '已复制';
        showToast('SHA-256 校验值已复制');
        setTimeout(function () { self.textContent = original; }, 1800);
      }).catch(function () {
        showToast('复制失败，请手动选取');
      });
    });
  }

  /* ---------- 八、操作演示视频：章节跳转与当前章节高亮 ---------- */
  var demoVideo = document.getElementById('demoVideo');
  var demoChapters = document.getElementById('demoChapters');

  if (demoVideo && demoChapters) {
    var chapterButtons = demoChapters.querySelectorAll('button[data-time]');
    var chapterTimes = [];
    var activeChapter = -1;

    for (var c = 0; c < chapterButtons.length; c++) {
      chapterTimes.push(parseFloat(chapterButtons[c].getAttribute('data-time')) || 0);
      chapterButtons[c].addEventListener('click', function () {
        var target = parseFloat(this.getAttribute('data-time')) || 0;
        demoVideo.currentTime = target;
        /* 自动播放可能被浏览器策略拒绝，失败时静默忽略，用户可手动点击播放 */
        var playPromise = demoVideo.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      });
    }

    /* 根据播放进度高亮当前章节（章节起点前 0.25 秒即切换，避免临界抖动） */
    function syncActiveChapter() {
      var current = demoVideo.currentTime;
      var index = 0;
      for (var i = 0; i < chapterTimes.length; i++) {
        if (current >= chapterTimes[i] - 0.25) index = i;
      }
      if (index === activeChapter) return;
      activeChapter = index;
      for (var j = 0; j < chapterButtons.length; j++) {
        chapterButtons[j].classList.toggle('is-active', j === index);
      }
    }

    demoVideo.addEventListener('timeupdate', syncActiveChapter);
    demoVideo.addEventListener('seeked', syncActiveChapter);
    demoVideo.addEventListener('loadedmetadata', syncActiveChapter);
  }

  /* ---------- 九、平滑滚动兜底（老浏览器） ---------- */
  if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView();
      });
    });
  }
})();
