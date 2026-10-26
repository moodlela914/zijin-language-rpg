# 紫禁語文弈 · 本機探索試玩版

[線上遊戲](https://moodlela914.github.io/zijin-language-rpg/) · [線上玩法試玩台](https://moodlela914.github.io/zijin-language-rpg/public/playtest.html)

GitHub Pages 使用 `gh-pages` 分支；`main` 保留完整專案與素材。更新發布時執行 `npm run build:pages`，將 `dist/` 內容發布到 `gh-pages`。此指令會調整發布副本的子目錄路徑，不修改本機遊戲。線上與本機進度由各自瀏覽器來源分開保存。

國中語文 × 宮廷探索解謎 RPG。原始《核心計劃書》及《美術素材清單》完整保留。

## 啟動

需要 Node.js 22 以上；遊戲不需登入、API 金鑰、安裝套件或連接資料庫。

```powershell
cd C:\AgentFiles\gamemaker
npm start
```

開啟 [本機遊戲](http://127.0.0.1:5173/)，終端機按 Ctrl+C 停止。連接埠已占用時先在 PowerShell 設定 `$env:PORT = '5174'` 再啟動。不同連接埠使用各自的瀏覽器存檔。

## 遊玩方式

- 宮城地圖及關內探索：WASD／方向鍵移動貼紙人物，靠近標記按 E 互動；也可點目標自動走近。
- 手機：啟用傾斜移動並授權感測器，或使用畫面方向鍵；可放大探索畫面。
- 每殿：圖片式過場 → 搜索三條線索 → 直接語文應答 → 通關與下一殿。
- 十二關共 47 題，包含填詞／分類／排序／辨識／時辰輪等十二種主題機關。
- 氣血、三種策略、三次密友提示、銀針／殘箋／金牌、三題訂正與終局三回合已接入。
- 指定的 The_Silent_Coup.mp3 循環播放，背景音樂與音效各有獨立開關、音量及偏好記憶；首次互動後開始播放。過關採上行清音、鑼與鐘。
- 自動存檔、錯題索引、學習歷程 JSON 匯出及列印。資料不跨裝置同步。

詳細規則、驗收重點與實機限制見 [試玩指南](docs/PLAYTEST.md)。中等難度是題目設計目標，仍需教師審題與學生試作校準；探索機關提供教學鷹架。

## 開發與驗證

```powershell
npm test
npm run check
node scripts/archive-questions.mjs --check
node scripts/build-cinematics.mjs
```

`npm run dev` 會監看 Node 伺服器，前端改動後手動重新整理。本機伺服器只綁定 `127.0.0.1`；手機實機傾斜控制須另有可連線的安全來源（HTTPS），尚未宣稱通過真實感測器驗收。

## 模組

| 位置 | 用途 |
| --- | --- |
| `src/main.js` | 遊戲介面、操作、狀態與音效接線 |
| `src/views/exploration.js` | 沉浸地圖、關內場景、機關與過場容器 |
| `src/game/engine.js` | 純函式遊戲規則、解謎、資源、訂正、結局 |
| `src/game/world.js` | 貼紙人物、WASD、點選移動、方向鍵與感測器 |
| `src/game/storage.js` | 存檔驗證與舊版紀錄匯入 |
| `src/game/cinematic-player.js` | 圖片過場播放器、對話／任務進場 |
| `src/game/audio-player.js` | 音效開關、音量、事件與環境音 |
| `src/data/questions.js` | 正式試煉題庫的唯一執行來源 |
| `src/data/puzzles.js` | 十二關線索與場景機關 |
| `src/data/assets.js` | 動態載入已完成影像的本機目錄 |
| `src/data/audio.js` | 開放授權音效與事件索引 |
| `public/cinematics/` | 十二段可 seek 的圖片式 HTML 過場 |
| `public/assets/` | 遊戲執行素材與畫廊 |
| `output/images/production-v1/` | 影像原始交付副本 |
| `docs/question-bank/index.json` | 題庫按關卡／考點／題目 ID 調度入口 |
| `docs/audio/manifest.json` | 音效來源、授權、時長與檔案指紋 |
| `docs/assets/manifest-v1.json` | 97 張圖片清單、提示詞與製作進度 |

[影像規格與清單](docs/ASSET_PRODUCTION_V1.md) · [素材畫廊](http://127.0.0.1:5173/public/assets/gallery.html) · [音效試聽](http://127.0.0.1:5173/public/assets/audio/audition.html) · [過場節拍檢視](http://127.0.0.1:5173/public/cinematics/review.html)

97 張影像均已完成、歸檔並接入。可用 [玩法試玩台](http://127.0.0.1:5173/public/playtest.html) 直接試玩十二種形式，不改寫正式旅程進度。過場為 HTML 動畫，未預先轉碼成 MP4。完整分支劇本、多人連線、教師帳號及後端同步尚未製作；GitHub 推送尚未執行。
