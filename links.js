// ===== Kitazuna の「玄関」としての公開先リンク（2026-10-24） =====
// YouTube ショート・Instagram・note・本の巻末など、外からの入口はすべてこのサイトに向ける。
// ここを書き換えれば、トップのゲームバナー・/play の転送先・フッターの全部が一度に変わる。
// （index.html と play/index.html の両方が読む。script.js より先に読み込むこと）
window.KITAZUNA_LINKS = {
    // ゲーム本体（ブラウザ版）。いまは開発版の URL。公開 URL が決まったらここだけ差し替える（ReleasePlan: 10/31 決定）
    GAME_URL: "https://kitazuna-test.vercel.app/",
    // 第一章（男鹿編）の正式公開日。この日を過ぎると表示が「公開中」に切り替わる
    GAME_RELEASE_DATE: "2026-11-11",
    // 公式ファンブック第 1 巻（Amazon・500 円・Kindle Unlimited）
    BOOK_URL: "https://www.amazon.co.jp/dp/B0HMTVHVN9",
    // 最新情報・制作の裏側
    NOTE_URL: "https://note.com/ifjuku",
    X_URL: "https://x.com/kitazunaakita",
    YOUTUBE_URL: "https://www.youtube.com/@if-juku",
    INSTAGRAM_URL: "https://www.instagram.com/if_juku",
};
