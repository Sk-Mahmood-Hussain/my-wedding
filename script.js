/* =========================================================
   LAVENDER WEDDING INVITATION — UNIFIED CONTROLLER SCRIPT
   Gulzar E Eram & Samsul Khan
   ========================================================= */

/* ---------------------------------------------------------
   CONFIG: Names, Dates, Timings, Venue, Contact & Music
   --------------------------------------------------------- */
const CONFIG = {
  // Couple Names
  brideName: "Gulzar E Eram",
  groomName: "Samsul Khan",

  // Urdu Names (preserves authentic Nastaliq rendering)
  brideNameUrdu: "گلزارِ ارم",
  groomNameUrdu: "شمسل خان",

  // Host line (empty - invites only, not our family)
  hostLine: "",

  // Venue & Google Maps
  venueName: "Noor Jahan Mandap, Tilda",
  venueCity: "Cuttack, Odisha, India",
  venueAddress: "Noor Jahan Mandap, Tilda, Cuttack, Odisha, India",
  mapsQuery: "Noor Jahan Mandap, Tilda, Cuttack, Odisha, India",

  // Dates & Countdown (Nikah on 15 Nov 2026 at 12:00 PM IST)
  mainDate: "2026-11-15",
  mainTimeText: "12:00 PM",
  countdownTarget: "2026-11-15T12:00:00+05:30",

  // Background Music file path (named ausio)
  musicFile: "assets/ausio.mp3",

  // Contact details (WhatsApp & Phone Call)
  whatsappContact: {
    name: "Sk Mahmood Hussain",
    phoneDisplay: "+91 96928 55450",
    phoneRaw: "+919692855450",
    message: "Assalamu Alaikum! I am contacting you regarding the wedding invitation of Gulzar E Eram and Samsul Khan."
  },
  callContact: {
    name: "Sk Mujtaba Hussain",
    phoneDisplay: "+91 70086 78012",
    phoneRaw: "+917008678012"
  },

  // Event Celebrations
  events: [
    {
      icon: "floral",
      title: "Haldi",
      titleUrdu: "ہلدی",
      date: "2026-11-14",
      time: "5:00 PM at night",
      venue: "",
      note: "A joyful ceremony of turmeric, laughter and blessings."
    },
    {
      icon: "leaf",
      title: "Mehendi",
      titleUrdu: "مہندی",
      date: "2026-11-14",
      time: "5:00 PM at night",
      venue: "",
      note: "A celebration of henna and love."
    },
    {
      icon: "crescent",
      title: "Nikah",
      titleUrdu: "نکاح",
      date: "2026-11-15",
      time: "12:00 PM",
      venue: "Noor Jahan Mandap, Tilda, Cuttack",
      note: "The sacred union, in the presence of loved ones."
    },
    {
      icon: "star8",
      title: "Lunch",
      titleUrdu: "دعوتِ طعام",
      date: "2026-11-15",
      time: "1:00 PM",
      venue: "",
      note: "Join us for a celebratory feast with family and friends."
    },
    {
      icon: "arch",
      title: "Ruksati",
      titleUrdu: "رخصتی",
      date: "2026-11-15",
      time: "4:00 PM",
      venue: "",
      note: "A heartfelt farewell and prayer for the bride's new journey."
    }
  ]
};

// Shortcut helper
const $ = (selector) => document.querySelector(selector);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Toast Notification ---------- */
function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4200);
}

/* ---------- Date Formatter ---------- */
function formatDate(isoDate) {
  if (!isoDate) return "[Date to be confirmed]";
  const parts = isoDate.split("-");
  if (parts.length === 3) {
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
  }
  return isoDate;
}

/* ---------- 1. Fill Text Content from CONFIG ---------- */
function fillText() {
  document.querySelectorAll("[data-fill]").forEach((el) => {
    const key = el.dataset.fill;
    if (CONFIG[key] !== undefined) {
      el.textContent = CONFIG[key];
    }
  });

  const formattedDate = formatDate(CONFIG.mainDate);
  const heroDate = $("#hero-date");
  if (heroDate) heroDate.textContent = formattedDate;

  const scratchDate = $("#scratch-date");
  if (scratchDate) scratchDate.textContent = formattedDate;

  const scratchSub = $("#scratch-sub");
  if (scratchSub) scratchSub.textContent = "Nikah at " + CONFIG.mainTimeText;

  // WhatsApp Contact (Sk Mahmood Hussain)
  const waBtn = $("#whatsapp-btn");
  if (waBtn && CONFIG.whatsappContact) {
    const waUrl = "https://wa.me/" + CONFIG.whatsappContact.phoneRaw.replace("+", "") +
                  "?text=" + encodeURIComponent(CONFIG.whatsappContact.message);
    waBtn.href = waUrl;
  }
  const waName = $("#whatsapp-name");
  if (waName && CONFIG.whatsappContact) waName.textContent = CONFIG.whatsappContact.name;
  const waPhone = $("#whatsapp-phone");
  if (waPhone && CONFIG.whatsappContact) waPhone.textContent = CONFIG.whatsappContact.phoneDisplay;

  // Phone Call Contact (Sk Mujtaba Hussain)
  const callBtn = $("#call-btn");
  if (callBtn && CONFIG.callContact) {
    callBtn.href = "tel:" + CONFIG.callContact.phoneRaw;
  }
  const callName = $("#call-name");
  if (callName && CONFIG.callContact) callName.textContent = CONFIG.callContact.name;
  const callPhone = $("#call-phone");
  if (callPhone && CONFIG.callContact) callPhone.textContent = CONFIG.callContact.phoneDisplay;
}

/* ---------- 2. Ornate Corner Decorations ---------- */
function decorateFrames() {
  document.querySelectorAll(".gold-frame").forEach((frame) => {
    // Avoid duplicate corners if re-run
    if (frame.querySelector(".corner")) return;
    ["tl", "tr", "bl", "br"].forEach((pos) => {
      const corner = document.createElement("span");
      corner.className = "corner " + pos;
      corner.setAttribute("aria-hidden", "true");
      corner.innerHTML = '<svg viewBox="0 0 80 80"><use href="#corner"></use></svg>';
      frame.appendChild(corner);
    });
  });
}

/* ---------- 3. Render Celebration Event Cards ---------- */
function renderEvents() {
  const grid = $("#events-grid");
  if (!grid) return;
  grid.innerHTML = "";

  CONFIG.events.forEach((ev) => {
    const card = document.createElement("article");
    card.className = "event-card reveal";

    const dateText = ev.date ? formatDate(ev.date) : "[Date to be confirmed]";
    const venueLine = ev.venue ? `<p class="event-venue">📍 ${ev.venue}</p>` : "";

    card.innerHTML = `
      <svg class="event-svg" viewBox="0 0 100 100" aria-hidden="true"><use href="#${ev.icon}"></use></svg>
      <h3>${ev.title}</h3>
      <p class="event-urdu">${ev.titleUrdu}</p>
      <p class="event-date">${dateText}</p>
      <p class="event-time">🕒 ${ev.time}</p>
      ${venueLine}
      <p class="event-note">${ev.note}</p>
    `;
    grid.appendChild(card);
  });
}

/* ---------- 4. Word-by-Word Text Reveal on Welcome Frame ---------- */
function splitIntoWords(element) {
  if (element.classList.contains("urdu-line") || element.classList.contains("bismillah")) {
    element.classList.add("single-reveal");
    return;
  }

  const originalText = element.dataset.text || element.textContent.trim();
  const words = originalText.split(/\s+/);
  element.textContent = "";

  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = word;
    span.style.transitionDelay = `${0.65 + index * 0.095}s`;
    element.appendChild(span);
    if (index < words.length - 1) element.appendChild(document.createTextNode(" "));
  });
}

function initWordReveals() {
  document.querySelectorAll(".reveal-words").forEach(splitIntoWords);
}

/* ---------- 5. Door Opening & Closing Controller ---------- */
let isDoorAnimating = false;
let hasClosedAtEnd = false;

function openDoors() {
  const openingStage = $("#openingStage");
  const doorTrigger = $("#doorTrigger");
  const welcomeCopy = $("#welcomeCopy");
  const interactionStatus = $("#interactionStatus");

  if (!openingStage || openingStage.classList.contains("is-open") || isDoorAnimating) return;
  isDoorAnimating = true;

  // Animate doors outward from outer hinges
  openingStage.classList.add("is-open");
  doorTrigger.setAttribute("aria-expanded", "true");
  welcomeCopy.setAttribute("aria-hidden", "false");
  if (interactionStatus) interactionStatus.textContent = "Invitation opened.";

  // Attempt to start background music from this direct user interaction gesture
  tryPlayMusic();

  // Unlock body scroll once door swing is well underway
  window.setTimeout(() => {
    document.body.classList.remove("door-locked");
    isDoorAnimating = false;
  }, reduceMotion ? 50 : 1450);
}

function setupDoors() {
  const doorTrigger = $("#doorTrigger");
  if (doorTrigger) {
    doorTrigger.addEventListener("click", openDoors);
    doorTrigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDoors();
      }
    });
  }

  // Smooth scroll explore button inside welcome frame
  const scrollBtn = $("#scrollExploreBtn");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const content = $("#invitationContent");
      if (content) {
        content.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
}

/* ---------- 6. Automatic Closing at the End & Start Again ---------- */
function setupClosingDoors() {
  const closingStage = $("#closingStage");
  const startAgainBtn = $("#startAgainBtn");
  if (!closingStage) return;

  // Detect when visitor reaches the final closing area after reading Thank You
  const closingObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Trigger only when user scrolls well into the closing area and has not yet closed
      if (entry.isIntersecting && !hasClosedAtEnd) {
        hasClosedAtEnd = true;
        // Small delay to let the viewer see the open doors and farewell message
        setTimeout(() => {
          closingStage.classList.add("is-closed");
        }, reduceMotion ? 50 : 500);
      }
    });
  }, {
    threshold: 0.55 // Ensures user has read Thank You and scrolled into closing area
  });

  closingObserver.observe(closingStage);

  // "Start Again" button click resets everything cleanly
  if (startAgainBtn) {
    startAgainBtn.addEventListener("click", () => {
      // Scroll back smoothly to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      // After scroll begins, reset animation states cleanly
      setTimeout(() => {
        // Reset closing doors
        closingStage.classList.remove("is-closed");
        hasClosedAtEnd = false;

        // Reset opening stage doors and word transitions
        const openingStage = $("#openingStage");
        const doorTrigger = $("#doorTrigger");
        const welcomeCopy = $("#welcomeCopy");

        if (openingStage) openingStage.classList.remove("is-open");
        if (doorTrigger) doorTrigger.setAttribute("aria-expanded", "false");
        if (welcomeCopy) welcomeCopy.setAttribute("aria-hidden", "true");

        // Lock scroll until doors are tapped again
        document.body.classList.add("door-locked");

        // Re-focus the door trigger for accessibility
        if (doorTrigger) doorTrigger.focus({ preventScroll: true });
      }, reduceMotion ? 50 : 650);
    });
  }
}

/* ---------- 7. Language Selector (All / English / Urdu) ---------- */
function setupLanguageToggle() {
  const pills = document.querySelectorAll(".lang-pill");
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");

      const lang = pill.dataset.lang;
      document.body.classList.remove("filter-lang-en", "filter-lang-ur");

      if (lang === "en") {
        document.body.classList.add("filter-lang-en");
      } else if (lang === "ur") {
        document.body.classList.add("filter-lang-ur");
      }
    });
  });
}

/* ---------- 8. Scratch Card Feature ---------- */
function setupScratch() {
  const wrap = $("#scratch-wrap");
  const canvas = $("#scratch-canvas");
  if (!wrap || !canvas) return;

  const ctx = canvas.getContext("2d");
  const hint = $("#scratch-hint");
  const revealBtn = $("#reveal-btn");

  let isDrawing = false;
  let revealed = false;
  let lastPoint = null;
  let lastWidth = 0;
  let moveCount = 0;

  function paintCover() {
    const rect = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";

    // Champagne gold metallic gradient
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#C7A66A");
    gradient.addColorStop(0.3, "#F4E7CB");
    gradient.addColorStop(0.6, "#D9CFF0");
    gradient.addColorStop(1, "#A88647");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Diagonal texture lines
    ctx.strokeStyle = "rgba(102, 85, 154, 0.15)";
    ctx.lineWidth = 1.2;
    for (let i = -rect.height; i < rect.width; i += 14) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + rect.height, rect.height);
      ctx.stroke();
    }

    // Text on gold card
    ctx.fillStyle = "#463768";
    ctx.font = "600 17px Cinzel, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦ SCRATCH HERE ✦", rect.width / 2, rect.height / 2);

    lastWidth = rect.width;
  }

  function getPoint(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function scratchTo(point) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 46;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPoint = point;
  }

  function clearedFraction() {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 16) {
      total++;
      if (data[i] < 128) cleared++;
    }
    return cleared / total;
  }

  function revealAll() {
    if (revealed) return;
    revealed = true;
    wrap.classList.add("revealed");
    if (hint) hint.textContent = "Alhamdulillah! Tap the card to save the date to your calendar ✨";
    if (revealBtn) revealBtn.hidden = true;
    wrap.style.cursor = "pointer";
    wrap.addEventListener("click", openCalendarModal);
  }

  canvas.addEventListener("pointerdown", (e) => {
    if (revealed) return;
    isDrawing = true;
    canvas.setPointerCapture(e.pointerId);
    lastPoint = getPoint(e);
    scratchTo({ x: lastPoint.x + 0.01, y: lastPoint.y });
    e.preventDefault();
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!isDrawing || revealed) return;
    scratchTo(getPoint(e));
    moveCount++;
    if (moveCount % 8 === 0 && clearedFraction() > 0.42) {
      revealAll();
    }
    e.preventDefault();
  });

  function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    if (!revealed && clearedFraction() > 0.42) revealAll();
  }

  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointercancel", stopDrawing);

  if (revealBtn) {
    revealBtn.addEventListener("click", revealAll);
  }

  window.addEventListener("resize", () => {
    if (!revealed && Math.abs(wrap.clientWidth - lastWidth) > 2) paintCover();
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { if (!revealed) paintCover(); });
  }
  paintCover();
}

/* ---------- 9. Live Countdown to Nikah ---------- */
function setupCountdown() {
  const target = new Date(CONFIG.countdownTarget).getTime();
  const grid = $("#countdown-grid");
  const doneMsg = $("#countdown-done");
  if (!grid || !doneMsg) return;

  const pad = (n) => String(n).padStart(2, "0");

  if (isNaN(target)) {
    grid.hidden = true;
    doneMsg.hidden = false;
    doneMsg.textContent = "Please check CONFIG.countdownTarget in script.js";
    return;
  }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      grid.hidden = true;
      doneMsg.hidden = false;
      doneMsg.textContent = "Alhamdulillah! The blessed day has arrived. Thank you for your prayers and love.";
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000) % 24;
    const m = Math.floor(diff / 60000) % 60;
    const s = Math.floor(diff / 1000) % 60;

    const daysEl = $("#cd-days");
    const hoursEl = $("#cd-hours");
    const minEl = $("#cd-minutes");
    const secEl = $("#cd-seconds");

    if (daysEl) daysEl.textContent = pad(d);
    if (hoursEl) hoursEl.textContent = pad(h);
    if (minEl) minEl.textContent = pad(m);
    if (secEl) secEl.textContent = pad(s);
  }

  tick();
  if (target > Date.now()) {
    setInterval(tick, 1000);
  }
}

/* ---------- 10. Google Maps Setup ---------- */
function setupMap() {
  const q = encodeURIComponent(CONFIG.mapsQuery);
  const dirBtn = $("#directions-btn");
  const mapBtn = $("#open-map-btn");
  const mapFrame = $("#map-frame");

  if (dirBtn) dirBtn.href = "https://www.google.com/maps/dir/?api=1&destination=" + q;
  if (mapBtn) mapBtn.href = "https://www.google.com/maps/search/?api=1&query=" + q;
  if (mapFrame) mapFrame.src = "https://www.google.com/maps?q=" + q + "&output=embed";
}

/* ---------- 11. Background Music Controller ---------- */
let audioEl = null;
let musicBtn = null;
let isAudioPlaying = false;

function tryPlayMusic() {
  if (!audioEl) audioEl = $("#bg-music");
  if (!audioEl) return;

  if (audioEl.paused) {
    const playPromise = audioEl.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updateMusicUI(true);
        })
        .catch(() => {
          // Handled gracefully (e.g. autoplay restriction or missing file)
          updateMusicUI(false);
        });
    }
  }
}

function updateMusicUI(isPlaying) {
  isAudioPlaying = isPlaying;
  if (!musicBtn) musicBtn = $("#music-btn");
  if (!musicBtn) return;

  musicBtn.classList.toggle("playing", isPlaying);
  musicBtn.textContent = isPlaying ? "❚❚" : "♪";
  musicBtn.setAttribute("aria-label", isPlaying ? "Pause background music" : "Play background music");
}

function setupMusic() {
  audioEl = $("#bg-music");
  musicBtn = $("#music-btn");
  if (!audioEl || !musicBtn) return;

  audioEl.src = CONFIG.musicFile;
  audioEl.volume = 0.55;

  musicBtn.addEventListener("click", () => {
    if (audioEl.paused) {
      audioEl.play()
        .then(() => updateMusicUI(true))
        .catch(() => {
          updateMusicUI(false);
          showToast("Please place your audio file at " + CONFIG.musicFile);
        });
    } else {
      audioEl.pause();
      updateMusicUI(false);
    }
  });
}

/* ---------- 12. Save the Date Calendar Integration ---------- */
function getCalendarData() {
  const title = "Wedding of Gulzar E Eram & Samsul Khan";
  const desc = "Nikah ceremony of Gulzar E Eram & Samsul Khan.\\nVenue: Noor Jahan Mandap, Tilda, Cuttack.\\nMay Allah bless this union.";
  const location = "Noor Jahan Mandap, Tilda, Cuttack, Odisha, India";
  // 15 Nov 2026, 12:00 PM IST (06:30 UTC) to 5:00 PM IST (11:30 UTC)
  const startUtc = "20261115T063000Z";
  const endUtc = "20261115T113000Z";

  const gcalUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(title) +
    "&dates=" + startUtc + "/" + endUtc +
    "&details=" + encodeURIComponent("Nikah ceremony of Gulzar E Eram & Samsul Khan.\nVenue: Noor Jahan Mandap, Tilda, Cuttack.\nMay Allah bless this union.") +
    "&location=" + encodeURIComponent(location);

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gulzar E Eram & Samsul Khan//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:wedding-gulzar-samsul-20261115@invitation",
    "DTSTAMP:20261115T063000Z",
    "DTSTART:" + startUtc,
    "DTEND:" + endUtc,
    "SUMMARY:" + title,
    "DESCRIPTION:" + desc,
    "LOCATION:" + location,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  return { gcalUrl, icsContent };
}

function openCalendarModal() {
  const modal = $("#calendar-modal");
  if (!modal) return;
  modal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeCalendarModal() {
  const modal = $("#calendar-modal");
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
}

function downloadIcsFile() {
  const { icsContent } = getCalendarData();
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Wedding-Gulzar-and-Samsul.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  showToast("Calendar file downloaded! Tap to save the event ✨");
}

function setupSaveTheDate() {
  const { gcalUrl } = getCalendarData();
  const gcalBtn = $("#gcal-btn");
  if (gcalBtn) gcalBtn.href = gcalUrl;

  const icalBtn = $("#ical-btn");
  if (icalBtn) {
    icalBtn.addEventListener("click", () => {
      downloadIcsFile();
      closeCalendarModal();
    });
  }

  const saveDateBtn = $("#save-date-btn");
  if (saveDateBtn) {
    saveDateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openCalendarModal();
    });
  }

  const closeBtn = $("#calModalClose");
  if (closeBtn) closeBtn.addEventListener("click", closeCalendarModal);

  const backdrop = $("#calModalBackdrop");
  if (backdrop) backdrop.addEventListener("click", closeCalendarModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCalendarModal();
  });
}

/* ---------- 13. Floating Sparkles ---------- */
function setupSparkles() {
  const box = $("#sparkles");
  if (!box) return;
  box.innerHTML = "";
  for (let i = 0; i < 22; i++) {
    const s = document.createElement("span");
    const size = 2 + Math.random() * 3.5;
    s.className = "sparkle";
    s.style.width = size + "px";
    s.style.height = size + "px";
    s.style.left = Math.random() * 100 + "%";
    s.style.animationDuration = 7 + Math.random() * 9 + "s";
    s.style.animationDelay = Math.random() * 8 + "s";
    box.appendChild(s);
  }
}

/* ---------- 14. Scroll Reveal Controller ---------- */
function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((el) => observer.observe(el));
}

/* ---------- INITIALIZE EVERYTHING ON DOM READY ---------- */
document.addEventListener("DOMContentLoaded", () => {
  fillText();
  decorateFrames();
  renderEvents();
  initWordReveals();
  setupDoors();
  setupClosingDoors();
  setupLanguageToggle();
  setupScratch();
  setupSaveTheDate();
  setupCountdown();
  setupMap();
  setupMusic();
  setupSparkles();
  setupReveal();
});
