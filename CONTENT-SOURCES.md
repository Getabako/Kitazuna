# このサイトを更新するときの「正」はどこか（2026-10-19 本人指示）

公式サイトの記述は古くなりやすい。**更新・発信のときは、サイト自身ではなく次の二つを正として参照する。**

| 内容 | 正となる場所 |
|---|---|
| ゲームの計画・公開日・章の構成・操作 | `ゲーム/ECRPG/ReleasePlan/`（`decisions/` が最新の判断、`chapters/` が章の状態）と `Assets/Scripts/Common/ReleaseScope.cs`（次章の予告文言） |
| ゲームの実画面 | `CodexAppServer/情報発信管理/screen-assets/kitazuna-*.png`（`scripts/capture-kitazuna.mjs` で https://kitazuna-test.vercel.app/ から撮り直せる） |
| 本のタイトル・章構成・紹介文 | `~/.kindlemaker-data/generated/kitazuna-book/manuscript.md`・`description.md`・`outline.json`（第2巻は `_vol2/`） |
| 本の価格・発売日・販売ページ | Amazon https://www.amazon.co.jp/dp/B0HMTVHVN9（2026-11-11 発売・500円・Kindle Unlimited） |
| キャラクターの設定 | 本の原稿 ＞ `ゲーム/ECRPG/CLAUDE.md`「この作品の背骨」 ＞ このサイトの script.js |

公開: GitHub `Getabako/Kitazuna` の main に push。kitazuna.if-juku.net（Vercel）と getabako.github.io/Kitazuna の両方が main から配信される。
