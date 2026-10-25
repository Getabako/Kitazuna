// ===== Kitazuna の「玄関」としての公開先リンク（2026-10-24） =====
// YouTube ショート・Instagram・note・本の巻末など、外からの入口はすべてこのサイトに向ける。
// ここを書き換えれば、トップのゲームバナー・/play の転送先・フッターの全部が一度に変わる。
// （index.html と play/index.html の両方が読む。script.js より先に読み込むこと）
window.KITAZUNA_LINKS = {
    // ゲーム本体（ブラウザ版）。いまは開発版の URL。公開 URL が決まったらここだけ差し替える（ReleasePlan: 10/31 決定）
    GAME_URL: "https://kitazuna-test.vercel.app/",
    // 第一章（男鹿編）の正式公開日。この日（日本時間 0 時）から「遊ぶ」「/play」がゲーム本体へ通る。それまでは公開待ちページ
    GAME_RELEASE_DATE: "2026-11-11",
    // 公開前に関係者だけゲームを確認するための合言葉。/play?preview=<この値> を一度開くと、その端末では以後ずっと通る
    PREVIEW_KEY: "oga1111",
    // 公式ファンブック第 1 巻（Amazon・500 円・Kindle Unlimited）
    BOOK_URL: "https://www.amazon.co.jp/dp/B0HMTVHVN9",
    // 最新情報・制作の裏側
    NOTE_URL: "https://note.com/ifjuku",
    X_URL: "https://x.com/kitazunaakita",
    YOUTUBE_URL: "https://www.youtube.com/@if-juku",
    INSTAGRAM_URL: "https://www.instagram.com/if_juku",
};
