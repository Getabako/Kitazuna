// =====================================================================
// Kitazuna 公式サイト（2026-10-24 全面リニューアル: ゲームの UI でサイトを進む）
// 公開先リンクは links.js に集約。文面の正は CONTENT-SOURCES.md を参照（サイトの古い記述から書き直さない）。
// 仕掛け一覧:
//   読み込み画面（秋田の豆知識・ゲーム本体と同じ文）/ HUD の提灯ゲージ / タイトルメニューの効果音（既定 OFF）
//   ナギサのメッセージ窓（文字送り）/ 秋田マップの章セレクト / パーティ編成 / 太鼓の試し打ち（Web Audio 合成）
//   本の「みつけた！」演出 / 画面下を歩く健太 / ロゴ 7 回タップでナマハゲ / セーブ画面
// =====================================================================

const L = window.KITAZUNA_LINKS || {};
const NOTE_URL = L.NOTE_URL || "https://note.com/ifjuku";
const BOOK_URL = L.BOOK_URL || "https://www.amazon.co.jp/dp/B0HMTVHVN9";
const GAME_URL = L.GAME_URL || "";
const GAME_RELEASE_DATE = L.GAME_RELEASE_DATE || "2026-11-11";

function openNote(event) { if (event) event.preventDefault(); window.open(NOTE_URL, "_blank", "noopener"); return false; }
function openBook(event) {
    if (event) event.preventDefault();
    if (BOOK_URL) { window.open(BOOK_URL, "_blank", "noopener"); return false; }
    alert("Amazonの予約ページは準備中です。公開されたらnoteでお知らせします。");
    return false;
}
function openGame(event) {
    if (event) event.preventDefault();
    if (GAME_URL) { window.open(GAME_URL, "_blank", "noopener"); return false; }
    alert("ゲームの公開URLは準備中です。公開されたらnoteとXでお知らせします。");
    return false;
}
function scrollToSection(id) { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth" }); }
function scrollToTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }

// ---------------------------------------------------------------------
// 公開日の前後で文言を切り替える（日本時間）
// ---------------------------------------------------------------------
function jstToday() {
    const now = new Date();
    const jst = new Date(now.getTime() + (now.getTimezoneOffset() + 9 * 60) * 60000);
    return jst;
}
function isGameReleased() { return jstToday().toISOString().slice(0, 10) >= GAME_RELEASE_DATE; }
function daysUntilRelease() {
    const today = jstToday(); today.setHours(0, 0, 0, 0);
    const rel = new Date(GAME_RELEASE_DATE + "T00:00:00");
    return Math.ceil((rel - today) / 86400000);
}
function applyLinksAndReleaseState() {
    const setHref = (id, url) => { const el = document.getElementById(id); if (el && url) el.href = url; };
    const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    ["hero-game-banner", "screens-play-link"].forEach(id => setHref(id, GAME_URL));
    ["hero-book-link", "book-amazon-link"].forEach(id => setHref(id, BOOK_URL));
    ["hero-note-link", "follow-note", "footer-note"].forEach(id => setHref(id, NOTE_URL));
    setHref("follow-youtube", L.YOUTUBE_URL); setHref("footer-youtube", L.YOUTUBE_URL);
    setHref("follow-x", L.X_URL); setHref("footer-x", L.X_URL);
    setHref("follow-instagram", L.INSTAGRAM_URL); setHref("footer-instagram", L.INSTAGRAM_URL);

    if (isGameReleased()) {
        setText("release-badge", "第1章 男鹿編　公開中（ブラウザで遊べます）");
        setText("countdown", "第1章 公開中");
        setText("game-banner-tag", "第1章 男鹿編・公開中");
        setText("game-banner-title", "はじめる");
        setText("game-banner-sub", "いますぐブラウザで遊ぶ。スマホの縦画面で開くだけ");
        setText("screens-play-link", "ブラウザで遊ぶ");
        setText("screens-play-note", "第1章 男鹿編を公開中。スマホの縦画面で開いてください。");
    } else {
        const d = daysUntilRelease();
        setText("release-badge", "第1章 男鹿編　2026年11月11日（きりたんぽの日）公開");
        setText("countdown", d === 0 ? "本日 公開" : `公開まで あと ${d} 日`);
        setText("game-banner-tag", "開発版を先行体験（ブラウザ）");
        setText("game-banner-title", "はじめる");
        setText("game-banner-sub", "いますぐブラウザで遊ぶ。スマホの縦画面で開くだけ");
    }
}

// ---------------------------------------------------------------------
// 効果音（Web Audio で合成。音声ファイル無し。既定は OFF、太鼓だけは叩いた時に鳴る）
// ---------------------------------------------------------------------
const SE = {
    ctx: null, enabled: false,
    init() {
        if (!this.ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) this.ctx = new AC(); }
        if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
        return this.ctx;
    },
    tone(freq, dur, type = "square", gain = 0.08, when = 0, slide = 0) {
        const ctx = this.init(); if (!ctx) return;
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = type; o.frequency.setValueAtTime(freq, ctx.currentTime + when);
        if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), ctx.currentTime + when + dur);
        g.gain.setValueAtTime(gain, ctx.currentTime + when);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + dur);
        o.connect(g).connect(ctx.destination); o.start(ctx.currentTime + when); o.stop(ctx.currentTime + when + dur + 0.02);
    },
    noise(dur, gain = 0.2, hp = 1000) {
        const ctx = this.init(); if (!ctx) return;
        const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
        const data = buf.getChannelData(0); for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        const src = ctx.createBufferSource(); src.buffer = buf;
        const f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = hp;
        const g = ctx.createGain(); g.gain.value = gain;
        src.connect(f).connect(g).connect(ctx.destination); src.start();
    },
    select() { if (this.enabled) this.tone(880, 0.06, "square", 0.05); },
    confirm() { if (this.enabled) { this.tone(660, 0.07, "square", 0.06); this.tone(990, 0.12, "square", 0.06, 0.07); } },
    don() { this.tone(95, 0.28, "sine", 0.6, 0, -50); this.noise(0.05, 0.25, 400); },
    ka() { this.noise(0.06, 0.35, 2500); this.tone(1800, 0.04, "triangle", 0.08); },
    chain() { [523, 659, 784].forEach((f, i) => this.tone(f, 0.1, "square", 0.07, i * 0.07)); this.noise(0.08, 0.25, 800); },
    item() { if (this.enabled) [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.16, "triangle", 0.09, i * 0.09)); },
    namahage() { if (this.enabled) { this.tone(60, 0.5, "sawtooth", 0.25, 0, -30); this.noise(0.3, 0.3, 200); } },
};
function setupSeToggle() {
    const btn = document.getElementById("se-toggle"); if (!btn) return;
    try { SE.enabled = localStorage.getItem("kitazuna.se") === "on"; } catch (e) { /* 無視 */ }
    const paint = () => { btn.textContent = SE.enabled ? "SE ON" : "SE OFF"; btn.setAttribute("aria-pressed", String(SE.enabled)); };
    paint();
    btn.addEventListener("click", () => {
        SE.enabled = !SE.enabled; SE.init(); paint();
        try { localStorage.setItem("kitazuna.se", SE.enabled ? "on" : "off"); } catch (e) { /* 無視 */ }
        if (SE.enabled) SE.confirm();
    });
    document.addEventListener("click", (e) => {
        const t = e.target.closest("[data-se]"); if (!t) return;
        if (t.dataset.se === "confirm") SE.confirm(); else SE.select();
    });
}

// ---------------------------------------------------------------------
// 読み込み画面: 秋田の豆知識（ゲーム本体 SceneLoader.cs と同じ文）
// ---------------------------------------------------------------------
const TRIVIA = [
    "「来たっすな」は秋田弁で「来たんですね」「よく来たね」。作品名 Kitazuna はこの言葉遊びと AKITAKIZUNA のアナグラム。",
    "ナマハゲは大晦日の晩、家々を回って怠け心を戒め、一年の祝福を授ける来訪神。家の主人は正装で迎え、酒と料理でもてなす。",
    "ナマハゲの面や装束は男鹿の集落ごとに違う。なまはげ館には各地区の面がずらりと並んでいる。",
    "男鹿・真山では毎年2月に「なまはげ柴灯まつり」。焼いた餅（護摩餅）をナマハゲに献じる。",
    "ナマハゲは2018年、ユネスコ無形文化遺産「来訪神：仮面・仮装の神々」の一つに登録された。",
    "小野小町は平安時代前期の歌人。湯沢市小野が生誕地と伝えられ、毎年6月に小町まつりが開かれる。",
    "稲庭うどんは湯沢市稲庭町発祥の手延べうどん。日本三大うどんの一つに数えられる。",
    "竿燈まつりは毎年8月3日から6日、秋田市で開かれる。竹竿に46個の提灯を吊るし、手のひら・額・肩・腰で支える。",
    "秋田市の「ねぶり流し館」では竿燈の体験ができる。竿燈は稲穂に見立てて豊作を願うもの。",
    "田沢湖は水深423.4メートル、日本でいちばん深い湖。湖畔には金色のたつこ像が立つ。",
    "三湖物語では、八郎太郎が冬に田沢湖の辰子のもとへ通うため、田沢湖は冬も凍らないと語られる。",
    "秋田犬は大館市が原産の大型の日本犬。忠犬ハチ公も大館生まれで、渋谷駅前と大館駅前に像がある。",
    "きりたんぽは炊いたご飯を杉の串に巻いて焼いたもの。鹿角市が発祥とされ、11月11日は「きりたんぽの日」。",
    "比内地鶏は日本三大地鶏の一つ。きりたんぽ鍋は比内地鶏のだしに、せり・舞茸・ごぼう・ねぎを入れる。",
    "天然秋田杉は青森ヒバ・木曽ヒノキとともに日本三大美林。まっすぐで木目が細かく、曲げわっぱにも使われる。",
    "太平山は秋田市の東にそびえる標高1170メートルの山。山頂に太平山三吉神社の奥宮がある。",
    "スギノオウは秋田県民の「過度な真面目さ」が生んだ化身。倒すのではなく浄化するのが、この物語の目標。",
];
function runBootScreen() {
    const boot = document.getElementById("boot-screen"); if (!boot) return;
    let seen = false; try { seen = sessionStorage.getItem("kitazuna.boot") === "1"; } catch (e) { /* 無視 */ }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) { boot.remove(); return; }
    document.getElementById("boot-trivia").textContent = TRIVIA[Math.floor(Math.random() * TRIVIA.length)];
    const fill = document.getElementById("boot-bar-fill");
    const total = 2200; const start = performance.now(); let done = false;
    const finish = () => {
        if (done) return; done = true;
        boot.classList.add("is-hidden"); setTimeout(() => boot.remove(), 520);
        try { sessionStorage.setItem("kitazuna.boot", "1"); } catch (e) { /* 無視 */ }
    };
    const tick = (t) => { const p = Math.min(1, (t - start) / total); fill.style.width = (p * 100) + "%"; if (p < 1 && !done) requestAnimationFrame(tick); else finish(); };
    requestAnimationFrame(tick);
    boot.addEventListener("click", finish);
}

// ---------------------------------------------------------------------
// HUD: 提灯ゲージ（スクロールの進み）と現在地の名前、下を歩く健太、トップへ戻る
// ---------------------------------------------------------------------
const SECTION_NAMES = [
    ["hero-section", "タイトル"], ["story-section", "物語"], ["character-section", "仲間"], ["game-section", "遊び方"],
    ["book-section", "本"], ["follow-section", "最新情報"], ["author-section", "作者"], ["footer", "セーブ"],
];
const WALK_FRAMES = [1, 2, 3, 2].map(n => `images/kitazunasozai/character/kenta/kentawalk/kentawalk${n}.png`);
const IDLE_FRAME = "images/kitazunasozai/character/kenta/kentaidle/kentaidle1.png";
let walkFrame = 0, walkTimer = null, lastScrollY = 0;
function setupScrollHud() {
    const fill = document.getElementById("hud-gauge-fill");
    const label = document.getElementById("hud-gauge-label");
    const walker = document.getElementById("walker");
    const walkerImg = document.getElementById("walker-img");
    const toTop = document.getElementById("back-to-top");
    const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        fill.style.width = (p * 100) + "%";
        // 現在地
        let current = SECTION_NAMES[0][1];
        for (const [id, name] of SECTION_NAMES) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) current = name; }
        label.textContent = current;
        // 健太が画面の下を歩く（進んだ分だけ右へ）
        const travel = window.innerWidth - 64 - 80;
        walker.style.transform = `translateX(${Math.max(0, travel * p)}px)`;
        walker.classList.toggle("is-flip", window.scrollY < lastScrollY);
        lastScrollY = window.scrollY;
        walkFrame = (walkFrame + 1) % WALK_FRAMES.length; walkerImg.src = WALK_FRAMES[walkFrame];
        clearTimeout(walkTimer); walkTimer = setTimeout(() => { walkerImg.src = IDLE_FRAME; }, 220);
        toTop.classList.toggle("is-show", window.scrollY > window.innerHeight * 0.8);
    };
    let ticking = false;
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); } }, { passive: true });
    onScroll();
}

// タイトル画面の提灯（ゆらゆら昇る魂の提灯）
function createLanterns() {
    const field = document.getElementById("lantern-field"); if (!field) return;
    for (let i = 0; i < 18; i++) {
        const el = document.createElement("span"); el.className = "lantern";
        el.style.left = (Math.random() * 100) + "%";
        el.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
        const scale = 0.7 + Math.random() * 0.9; el.style.transform = `scale(${scale})`;
        el.style.animationDuration = (14 + Math.random() * 12) + "s";
        el.style.animationDelay = (-Math.random() * 20) + "s";
        field.appendChild(el);
    }
}

// 出現アニメーション
function setupReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    els.forEach(e => io.observe(e));
}

// ---------------------------------------------------------------------
// ナギサのメッセージ窓（文字送り・タップで次へ）
// ---------------------------------------------------------------------
const MESSAGES = [
    { name: "ナギサ", face: "images/kitazunasozai/character/nagisa/nagisaface/8.png", text: "来たっすな。秋田へようこそ。ここは『Kitazuna 未来杉の守護者』の公式サイトだ。" },
    { name: "ナギサ", face: "images/kitazunasozai/character/nagisa/nagisaface/9.png", text: "私はナギサ。ナマハゲに憧れて、自分で面を作った。「男だけ」の掟に阻まれても、諦めない。" },
    { name: "ナギサ", face: "images/kitazunasozai/character/nagisa/nagisaface/10.png", text: "第1章は男鹿編。2026年11月11日、スマホのブラウザで遊べるようになる。下の地図から、章のあらすじを見てみて。" },
    { name: "健太", face: "images/kitazunasozai/character/kenta/kentaface/1.png", text: "……祖父さんから「魂の提灯」と紹介状を預かって、秋田に来たばかりなんだ。本当に守り神なんているのか？" },
    { name: "ナギサ", face: "images/kitazunasozai/character/nagisa/nagisaface/8.png", text: "信じた奴が動いて作る。源三郎さんの口癖だ。まずは男鹿へ。祠の試練が待っている。" },
];
let msgIndex = 0, msgTimer = null, msgTyping = false;
function showMessage(i) {
    const m = MESSAGES[i]; const text = document.getElementById("msg-text");
    document.getElementById("msg-name").textContent = m.name;
    const face = document.getElementById("msg-face"); face.src = m.face; face.alt = m.name;
    clearInterval(msgTimer); text.textContent = ""; msgTyping = true;
    document.getElementById("msg-next").style.visibility = "hidden";
    let n = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { text.textContent = m.text; msgTyping = false; document.getElementById("msg-next").style.visibility = ""; return; }
    msgTimer = setInterval(() => {
        n++; text.textContent = m.text.slice(0, n);
        if (n % 3 === 0) SE.select();
        if (n >= m.text.length) { clearInterval(msgTimer); msgTyping = false; document.getElementById("msg-next").style.visibility = ""; }
    }, 38);
}
function setupMessageWindow() {
    const win = document.getElementById("msg-window"); if (!win) return;
    let started = false;
    const start = () => { if (started) return; started = true; showMessage(0); };
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((es) => { if (es.some(e => e.isIntersecting)) { io.disconnect(); start(); } }, { threshold: 0.5 });
        io.observe(win);
    } else start();
    win.addEventListener("click", () => {
        if (!started) { start(); return; }
        if (msgTyping) { clearInterval(msgTimer); document.getElementById("msg-text").textContent = MESSAGES[msgIndex].text; msgTyping = false; document.getElementById("msg-next").style.visibility = ""; return; }
        msgIndex = (msgIndex + 1) % MESSAGES.length; showMessage(msgIndex);
    });
}

// ---------------------------------------------------------------------
// 物語: 章データ（文面は従来どおり）と秋田マップのピン
// ---------------------------------------------------------------------
const chapters = [
    { id: 1, number: "プロローグ", place: "秋田へ", pin: { x: 30, y: 66 }, state: "open", title: "真面目の国に、影が目覚める", status: "2026年11月11日 公開",
      description: "秋田の子どもは真面目に学び、大人は真面目に働く。それ自体はこの土地の誇り。けれど度を越した真面目さが黒い念となって杉山へ吸い込まれ、封印の祠の縄が千切れる。かつて秋田を消滅の危機に落とした老木の精霊「スギノオウ」が目を覚ます。その頃、内向的な大学生・杉野健太は祖父・雅弘から「魂の提灯」と一通の紹介状を託され、新幹線で秋田へ向かっていた。",
      teaseText: "紹介状に記された名は「男鹿・海風源三郎」。行けば、答えが見つかる。" },
    { id: 2, number: "第一章", place: "男鹿", pin: { x: 17, y: 36 }, state: "open", title: "男鹿編 ── ナギサと祠の試練", status: "2026年11月11日 公開",
      description: "男鹿で健太を迎えるのは、祖父の戦友・海風源三郎と、ナマハゲに憧れて自分で面を作った少女ナギサ。祠へ向かうのは「男だけ」の掟。それでもナギサは健太の代わりに参道を登る。真山神社の奥、ナマハゲの祠で待つのは、太鼓を叩いて祭に入る「祠の試練」。護摩餅のもてなしと口上の意味を知り、ナギサは最初の魂の提灯を受け取る。",
      teaseText: "そのものになれなくても、伝えられる。女のナマハゲ、ここに立つ。" },
    { id: 3, number: "第二章", place: "湯沢", pin: { x: 52, y: 87 }, state: "soon", title: "湯沢編 ── コマチ堂とバズる平安美人", status: "12月11日 公開予定",
      description: "雪と温泉の町、湯沢。閑古鳥が鳴く骨董品店「コマチ堂」で、小野小町の化身コマチと出会う。平安から続く美意識を、ナギサの提案でSNSという現代の手段につなぐ。古い価値に新しい居場所を作る物語。",
      teaseText: "二つ目の魂が目を覚ます。千年の美意識は、今の秋田に届くのか。" },
    { id: 4, number: "第三章", place: "秋田", pin: { x: 34, y: 52 }, state: "locked", title: "秋田編 ── 令和耕助と足竿燈",
      description: "稲庭うどんの職人イナニワと、父の技から新技「足竿燈」を生み出そうとする息子カント。伝統と革新を父子の勝ち負けにしない。竿燈まつりの夜、二人の技が一本の竿の上で重なる。",
      teaseText: "追い出されたうどん屋と、一枚の写真。親子の絆の行方は。" },
    { id: 5, number: "第四章", place: "三湖", pin: { x: 73, y: 48 }, state: "locked", title: "三湖編 ── 凍った田沢湖と三湖の恋歌",
      description: "龍の姿を受け入れられない田沢湖のタツコ、八郎潟を守るハチロウ、二人を試す十和田湖の南祖坊。秋田に伝わる三湖物語を、三人の声で。凍った湖を溶かすのは、愛の言葉。",
      teaseText: "永遠の愛は氷を溶かせるのか。三つの湖を結ぶ決意。" },
    { id: 6, number: "第五章", place: "大館", pin: { x: 58, y: 15 }, state: "locked", title: "大館編 ── 父とアキタ",
      description: "健太の実家で明かされる父・ひろしの本当の姿と、最先端の技術で甦った忠実な相棒・秋田犬アキタ。家族の絆と、秋田を守る新たな力。",
      teaseText: "酒飲みと思われていた父の、隠された想い。" },
    { id: 7, number: "第六章", place: "鹿角", pin: { x: 82, y: 22 }, state: "locked", title: "鹿角編 ── トリオとタンポ",
      description: "比内地鶏のトリオと、きりたんぽのタンポ。鹿角で起きた対立を通じて、分かれていた秋田の心をひとつに束ねる。協力することで生まれる力が、最後の戦いへの備えになる。",
      teaseText: "分裂から統一へ。秋田の象徴たちが束になる。" },
    { id: 8, number: "最終章", place: "太平山", pin: { x: 49, y: 44 }, state: "locked", title: "太平山の守護神",
      description: "ついに姿を現したスギノオウ。秋田の過度な真面目さが生んだ巨大な化身との最終決戦。健太と守り神たちは、旅で結んだ絆を胸に太平山の頂へ。破壊ではなく浄化で、未来杉を守る。",
      teaseText: "真面目さと柔らかさは、ひとつになれるのか。" },
];
let currentPage = 0;

function renderMapPins() {
    const map = document.getElementById("akita-map"); if (!map) return;
    map.querySelectorAll(".map-pin").forEach(p => p.remove());
    chapters.forEach((c, i) => {
        const b = document.createElement("button"); b.type = "button";
        b.className = `map-pin is-${c.state}${i === currentPage ? " is-active" : ""}`;
        b.style.left = c.pin.x + "%"; b.style.top = c.pin.y + "%";
        b.setAttribute("aria-label", `${c.number} ${c.place}`);
        b.innerHTML = `<span class="map-pin-dot"></span><span class="map-pin-label">${c.place}</span>`;
        b.addEventListener("click", () => { SE.select(); goToPage(i); });
        map.appendChild(b);
    });
}
function renderStoryPage() {
    const win = document.getElementById("chapter-window"); const c = chapters[currentPage];
    const sprites = [3, 4, 6, 7].includes(currentPage)
        ? `<img src="images/dotchara${currentPage}a.png" alt=""><img src="images/dotchara${currentPage}b.png" alt="">`
        : `<img src="images/dotchara${currentPage}.png" alt="">`;
    const statusClass = c.state === "open" ? "is-open" : c.state === "soon" ? "is-soon" : "";
    win.innerHTML = `
        <div class="chapter-head">
            <span class="chapter-number">${c.number}</span>
            <span class="chapter-status ${statusClass}">${c.status || "順次公開"}</span>
        </div>
        <h3 class="chapter-title">${c.title}</h3>
        <div class="chapter-grid">
            <div>
                <img class="chapter-image" src="images/story${currentPage}.png" alt="${c.title}" loading="lazy">
                <div class="chapter-sprites">${sprites}</div>
            </div>
            <div>
                <p class="chapter-description">${c.description}</p>
                <p class="chapter-tease">${c.teaseText}</p>
                ${c.state === "locked" ? `<p class="chapter-locked">この土地はまだひらいていません。章ごとに順次公開</p>` : ""}
            </div>
        </div>`;
    win.classList.remove("is-flash"); void win.offsetWidth; win.classList.add("is-flash");
    renderDots("page-dots", chapters.length, currentPage, goToPage);
    document.getElementById("prev-btn").disabled = currentPage === 0;
    document.getElementById("next-btn").disabled = currentPage === chapters.length - 1;
    document.querySelectorAll(".map-pin").forEach((p, i) => p.classList.toggle("is-active", i === currentPage));
}
function renderDots(id, count, active, onPick) {
    const dots = document.getElementById(id); if (!dots) return; dots.innerHTML = "";
    for (let i = 0; i < count; i++) { const b = document.createElement("button"); b.type = "button"; b.className = i === active ? "is-active" : ""; b.setAttribute("aria-label", `${i + 1} 番目`); b.addEventListener("click", () => { SE.select(); onPick(i); }); dots.appendChild(b); }
}
function nextPage() { if (currentPage < chapters.length - 1) { currentPage++; renderStoryPage(); } }
function prevPage() { if (currentPage > 0) { currentPage--; renderStoryPage(); } }
function goToPage(i) { currentPage = i; renderStoryPage(); }

// ---------------------------------------------------------------------
// 仲間: パーティ編成（文面は従来どおり）
// ---------------------------------------------------------------------
const characters = [
    { name: "杉野健太", inOga: true, role: "主人公・平凡な大学生", description: "祖父・雅弘から「魂の提灯」と紹介状を託され、秋田へ。信じ切れないまま動くところから、守り神たちとの絆が始まる。", imageIndex: 0, folderName: "kenta", faceImages: ["1.png", "2.png", "3.png", "4.png"] },
    { name: "ナギサ", inOga: true, role: "女のナマハゲ・最初の仲間", description: "ナマハゲに憧れ、自分で面を作った少女。「男だけ」の掟に阻まれても諦めず、新しいナマハゲの形を作って世に出す。青い面が目印。作者の自画像でもある。", imageIndex: 1, folderName: "nagisa", faceImages: ["8.png", "9.png", "10.png"] },
    { name: "源三郎", inOga: true, role: "男鹿の漁師・祖父の戦友", description: "海風源三郎。健太が最初に訪ねる男。真山神社へ続く参道と、ナマハゲの祠への道を示す。「信じた奴が動いて作る」が口癖。", imageIndex: 10, folderName: "genzaburo", faceImages: ["11.png", "12.png"], idleImage: "genzaburoidle/genzaburoidle1.png" },
    { name: "ナマハゲ", inOga: true, role: "男鹿の来訪神", description: "祠の試練で待つ赤い面のナマハゲ。口上の意味、赤と青の面、護摩餅のもてなしを語り、ナギサに最初の魂の提灯を渡す。", imageIndex: 11, folderName: "namahage", faceImages: ["13.png", "14.png", "15.png"] },
    { name: "杉野雅弘", inOga: true, role: "健太の祖父", description: "健太に「魂の提灯」と、男鹿・海風源三郎への紹介状を託す。スギノオウの封印が弱まっていることを、誰より早く察していた。", imageIndex: 14, folderName: "masahiro", faceImages: ["5.png", "6.png", "7.png"] },
    { name: "コマチ", role: "伝統と現代を繋ぐインフルエンサー", description: "小野小町の化身。平安時代からの美の知識をSNSで現代に伝える革新的な存在。", imageIndex: 2, folderName: "komachi", faceImages: ["16.png", "17.png", "18.png"] },
    { name: "イナニワ", role: "伝統を守る稲庭うどん職人", description: "稲庭うどんの老舗店主。息子カントとの世代間の葛藤を乗り越え、伝統と革新の融合を学ぶ。", imageIndex: 3, folderName: "inaniwa", faceImages: ["19.png", "20.png"] },
    { name: "カント", role: "革新を求める竿燈士", description: "イナニワの息子。父の稲庭うどんの技術を竿燈に活かし、新技「足竿燈」を完成させる。", imageIndex: 4, folderName: "kanto", faceImages: ["21.png", "22.png", "23.png", "24.png"] },
    { name: "タツコ", role: "田沢湖の美しき龍神", description: "美を求めて龍になった田沢湖の守り神。ハチロウとの純愛を通じて真の美しさを知る。", imageIndex: 5, folderName: "tatsuko", faceImages: ["25.png", "26.png", "27.png"] },
    { name: "ハチロウ", role: "八郎潟の優しき守護者", description: "八郎潟に住む心優しい男性。タツコへの純粋な愛で、凍った田沢湖を溶かす奇跡を起こす。", imageIndex: 6, folderName: "hachiro", faceImages: ["28.png", "29.png", "30.png"] },
    { name: "南祖坊", role: "十和田湖の南祖坊", description: "三湖物語でタツコとハチロウを試す存在。秋田に伝わる辰子姫・八郎太郎・南祖坊の伝説が、第四章の土台になる。", imageIndex: 13, folderName: "minamisobo", faceImages: ["43.png"] },
    { name: "アキタ", role: "技術と伝統を融合したAI秋田犬", description: "サイボーグ化された秋田犬。最先端技術と忠誠心を兼ね備えた秋田の守護者。", imageIndex: 7, folderName: "akita", faceImages: ["31.png", "32.png", "33.png"] },
    { name: "ひろし", role: "杉野健太の父・技術者", description: "健太の父。表向きは酒飲みだが、実は最先端技術で秋田を守る重要人物。", imageIndex: 12, folderName: "hiroshi", faceImages: ["34.png", "35.png", "36.png"] },
    { name: "トリオ", role: "比内地鶏の誇り高きギャング", description: "アメリカかぶれのギャング風比内地鶏。タンポとの料理対決を通じて協力の大切さを学ぶ。", imageIndex: 9, folderName: "torio", faceImages: ["40.png", "41.png"] },
    { name: "タンポ", role: "きりたんぽ魂を持つヤンキー", description: "秋田の米文化を愛するきりたんぽの化身。トリオとの和解により秋田統一への道を開く。", imageIndex: 8, folderName: "tanpo", faceImages: ["37.png", "38.png", "39.png"] },
];
let currentCharacterIndex = 0;
function facePath(c, f) { return `images/kitazunasozai/character/${c.folderName}/${c.folderName}face/${f}`; }
function heroImage(c) {
    if (c.idleImage) return { src: `images/kitazunasozai/character/${c.folderName}/${c.idleImage}`, pixel: true };
    if (c.imageIndex < 10) { const n = c.imageIndex === 9 ? "chara8" : c.imageIndex === 8 ? "chara9" : `chara${c.imageIndex}`; return { src: `images/${n}.png`, pixel: false }; }
    return { src: facePath(c, c.faceImages[0]), pixel: false };
}
function renderPartyRoster() {
    const roster = document.getElementById("party-roster"); if (!roster) return; roster.innerHTML = "";
    characters.forEach((c, i) => {
        const b = document.createElement("button"); b.type = "button"; b.className = `party-slot${i === currentCharacterIndex ? " is-active" : ""}`; b.setAttribute("role", "listitem");
        b.innerHTML = `<img src="${facePath(c, c.faceImages[0])}" alt="${c.name}" loading="lazy"><span>${c.name}</span>${c.inOga ? '<em class="party-oga">1章</em>' : ""}`;
        b.addEventListener("click", () => { SE.select(); goToCharacter(i); });
        roster.appendChild(b);
    });
}
function renderCharacterCard() {
    const card = document.getElementById("character-card"); const c = characters[currentCharacterIndex]; const hero = heroImage(c);
    card.innerHTML = `
        <div class="status-hero"><img class="${hero.pixel ? "is-pixel" : ""}" src="${hero.src}" alt="${c.name}" onerror="this.onerror=null;this.src='${facePath(c, c.faceImages[0])}'"></div>
        <div class="status-head">
            <h3 class="status-name">${c.name}</h3>
            <span class="status-badge ${c.inOga ? "is-oga" : ""}">${c.inOga ? "第1章 男鹿編に登場" : "続く章で登場"}</span>
        </div>
        <p class="status-role">${c.role}</p>
        <p class="status-desc">${c.description}</p>
        <div class="status-faces"><h4>表情</h4><div class="face-row">${c.faceImages.map(f => `<img src="${facePath(c, f)}" alt="${c.name} の表情" loading="lazy">`).join("")}</div></div>`;
    card.classList.remove("is-flash"); void card.offsetWidth; card.classList.add("is-flash");
    renderDots("character-dots", characters.length, currentCharacterIndex, goToCharacter);
    document.querySelectorAll(".party-slot").forEach((s, i) => s.classList.toggle("is-active", i === currentCharacterIndex));
}
function nextCharacter() { currentCharacterIndex = (currentCharacterIndex + 1) % characters.length; renderCharacterCard(); }
function prevCharacter() { currentCharacterIndex = (currentCharacterIndex - 1 + characters.length) % characters.length; renderCharacterCard(); }
function goToCharacter(i) { currentCharacterIndex = i; renderCharacterCard(); }

// ---------------------------------------------------------------------
// 太鼓の試し打ち: タップで「ドン」、横になぞって「カッ」。連鎖の節目で派手に
// ---------------------------------------------------------------------
function setupTaiko() {
    const drum = document.getElementById("taiko-drum"); if (!drum) return;
    const comboEl = document.getElementById("taiko-combo"); const judge = document.getElementById("taiko-judge");
    let combo = 0, comboTimer = null, startX = 0, startY = 0, moved = false;
    const JUDGES = ["ドンピシャ", "いいぞ", "ドン！"];
    const hit = (type, x, y) => {
        combo++; clearTimeout(comboTimer); comboTimer = setTimeout(() => { combo = 0; comboEl.textContent = "0 連鎖"; }, 1800);
        comboEl.textContent = `${combo} 連鎖`; comboEl.classList.remove("is-pop"); void comboEl.offsetWidth; comboEl.classList.add("is-pop");
        drum.classList.remove("is-don", "is-ka"); void drum.offsetWidth; drum.classList.add(type === "don" ? "is-don" : "is-ka");
        if (type === "don") SE.don(); else SE.ka();
        judge.textContent = type === "ka" ? "カッ" : JUDGES[combo % 10 === 0 ? 0 : combo % 3 === 0 ? 1 : 2];
        judge.classList.toggle("is-ka", type === "ka"); judge.classList.remove("is-show"); void judge.offsetWidth; judge.classList.add("is-show");
        // ゲームと同じく「+100」の点がドット字で飛ぶ。10 連鎖ごとに節目
        const pop = document.createElement("span"); pop.className = "score-pop"; pop.textContent = combo % 10 === 0 ? `${combo} 連鎖!!` : "+100";
        pop.style.left = x + "px"; pop.style.top = y + "px"; pop.style.color = `hsl(${(combo * 37) % 360}, 90%, 65%)`;
        document.body.appendChild(pop); setTimeout(() => pop.remove(), 800);
        if (combo % 10 === 0) { SE.chain(); document.body.classList.remove("is-quake"); void document.body.offsetWidth; document.body.classList.add("is-quake"); burstSparkles(drum, 14); }
    };
    drum.addEventListener("pointerdown", (e) => { startX = e.clientX; startY = e.clientY; moved = false; drum.setPointerCapture(e.pointerId); });
    drum.addEventListener("pointermove", (e) => { if (Math.abs(e.clientX - startX) > 28 && Math.abs(e.clientX - startX) > Math.abs(e.clientY - startY)) moved = true; });
    drum.addEventListener("pointerup", (e) => { hit(moved ? "ka" : "don", e.clientX, e.clientY); });
    drum.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); const r = drum.getBoundingClientRect(); hit(e.key === "Enter" ? "ka" : "don", r.left + r.width / 2, r.top); } });
}
function burstSparkles(anchor, n) {
    const r = anchor.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
        const s = document.createElement("span"); s.className = "sparkle"; s.style.position = "fixed"; s.style.zIndex = 950;
        s.style.left = (r.left + r.width / 2 + (Math.random() - 0.5) * r.width) + "px"; s.style.top = (r.top + r.height / 2 + (Math.random() - 0.5) * r.height) + "px";
        s.style.animationDelay = (Math.random() * 0.2) + "s"; document.body.appendChild(s); setTimeout(() => s.remove(), 1500);
    }
}

// 実画面のスマホ枠: 送った位置に点を合わせる
function setupPhoneDots() {
    const screen = document.getElementById("phone-screen"); const dots = document.getElementById("phone-dots"); if (!screen || !dots) return;
    const n = screen.children.length; dots.innerHTML = ""; for (let i = 0; i < n; i++) { const s = document.createElement("span"); if (i === 0) s.className = "is-active"; dots.appendChild(s); }
    screen.addEventListener("scroll", () => { const i = Math.round(screen.scrollLeft / screen.clientWidth); [...dots.children].forEach((d, k) => d.classList.toggle("is-active", k === i)); }, { passive: true });
}

// 本: 画面に入ったら「みつけた！」
function setupItemGet() {
    const box = document.getElementById("item-get"); const cover = document.getElementById("book-cover"); if (!box) return;
    if (!("IntersectionObserver" in window)) { box.classList.add("is-show"); return; }
    const io = new IntersectionObserver((es) => {
        if (!es.some(e => e.isIntersecting)) return; io.disconnect();
        box.classList.add("is-show"); cover.classList.add("is-float"); SE.item();
        const holder = box.querySelector(".item-sparkles");
        for (let i = 0; i < 16; i++) { const s = document.createElement("span"); s.className = "sparkle"; s.style.left = (Math.random() * 100) + "%"; s.style.top = (Math.random() * 100) + "%"; s.style.animationDelay = (Math.random() * 0.6) + "s"; holder.appendChild(s); }
    }, { threshold: 0.4 });
    io.observe(box);
}

// 隠し要素: ロゴを 7 回タップするとナマハゲが現れる
function setupSecret() {
    const logo = document.getElementById("title-logo"); const pop = document.getElementById("namahage-pop"); if (!logo || !pop) return;
    let taps = 0, timer = null;
    logo.addEventListener("click", () => {
        taps++; clearTimeout(timer); timer = setTimeout(() => { taps = 0; }, 1500);
        logo.classList.remove("is-shake"); void logo.offsetWidth; logo.classList.add("is-shake");
        if (taps >= 7) {
            taps = 0; SE.namahage(); pop.classList.add("is-show");
            document.body.classList.remove("is-quake"); void document.body.offsetWidth; document.body.classList.add("is-quake");
            setTimeout(() => pop.classList.remove("is-show"), 3200);
        }
    });
}

// つくっている人 → ファイル末尾の v2 renderTeam（顔アイコン版）に移した

// セーブ画面まで来たら THANK YOU FOR PLAYING
function setupThanks() {
    const el = document.getElementById("credits-thanks"); if (!el) return;
    if (!("IntersectionObserver" in window)) { el.classList.add("is-show"); return; }
    const io = new IntersectionObserver((es) => { if (es.some(e => e.isIntersecting)) { io.disconnect(); el.classList.add("is-show"); } }, { threshold: 0.8 });
    io.observe(el);
}

// タイトル動画: スマホは縦の動画に
function pickVideo() {
    const src = document.querySelector(".title-video source"); if (!src) return;
    const want = window.innerWidth <= 768 ? "videos/topmoviesp.mp4" : "videos/topmoviepc.mp4";
    if (!src.getAttribute("src").endsWith(want.split("/")[1])) { src.src = want; src.parentElement.load(); }
}

document.addEventListener("DOMContentLoaded", () => {
    applyLinksAndReleaseState();
    setupSeToggle();
    runBootScreen();
    createLanterns();
    pickVideo();
    setupScrollHud();
    setupReveal();
    setupMessageWindow();
    renderMapPins();
    renderStoryPage();
    renderPartyRoster();
    renderCharacterCard();
    setupTaiko();
    setupPhoneDots();
    setupItemGet();
    setupSecret();
    renderTeam();
    setupThanks();
    window.addEventListener("resize", pickVideo);
});

// =====================================================================
// 2026-10-24 v2: 最新レイヤー（視差・生きたスプライト・スタッフの顔）
// =====================================================================
// 立ち絵の視差: data-depth の分だけスクロールに遅れて動く
function setupParallax() {
    const els = Array.from(document.querySelectorAll(".parallax")); if (!els.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const update = () => {
        ticking = false; const vh = window.innerHeight;
        els.forEach(el => {
            const r = el.getBoundingClientRect(); const depth = parseFloat(el.dataset.depth || "0.1");
            const center = r.top + r.height / 2 - vh / 2; el.style.transform = `translate3d(0, ${(-center * depth).toFixed(1)}px, 0)`;
        });
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
}
// ドット絵の待機アニメ（nagisaidle1〜3 などをコマ送り）
function setupLiveSprites() {
    const els = Array.from(document.querySelectorAll(".live-sprite")); if (!els.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    els.forEach((el, i) => {
        const tpl = el.dataset.frames; const count = parseInt(el.dataset.count || "3", 10); let n = 1;
        setInterval(() => { n = n % count + 1; el.src = tpl.replace("{n}", n); }, 420 + i * 60);
    });
}
// つくっている人: 文字アイコンではなく、ゆかりのキャラクターの顔で
function renderTeam() {
    const grid = document.getElementById("team-grid"); if (!grid) return;
    const F = "images/kitazunasozai/character/";
    const team = [
        { face: F + "namahage/namahageface/13.png", role: "緒方孝治", description: "守り神たちの絵" },
        { face: F + "kenta/kentaface/1.png", role: "手塚屋", description: "健太と杉野家の絵" },
        { face: F + "nagisa/nagisaface/8.png", role: "高崎翔太", description: "企画・物語・開発" },
        { face: F + "akita/akitaface/31.png", role: "AI", description: "台本・背景・音・コード" },
        { face: F + "tanpo/tanpoface/37.png", role: "if(塾)の生徒", description: "テストプレイ・取材" },
    ];
    grid.innerHTML = team.map(t => `<div class="team-card"><div class="team-icon"><img src="${t.face}" alt="" loading="lazy"></div><div><h5>${t.role}</h5><p>${t.description}</p></div></div>`).join("");
}
document.addEventListener("DOMContentLoaded", () => { setupParallax(); setupLiveSprites(); renderTeam(); });
