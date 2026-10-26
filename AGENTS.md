# 專案協作規範

## 專案目標

此專案為《紫禁語文弈》國中語文對話 RPG。開始修改前，閱讀 `README.md`、`docs/ARCHITECTURE.md` 與 `docs/ROADMAP.md`；劇情與視覺參照根目錄的原始兩份企劃。除非使用者要求，保留原始文件。

## 開發慣例

- 使用繁體中文作為學生介面與開發說明；程式識別字使用英文。
- 題庫放 `src/data/`，純遊戲規則放 `src/game/`，介面在 `src/main.js` 與 `src/styles.css`。
- 每題須有穩定 ID、唯一答案、提示、解析與訂正概念。新增題目先核對知識正確性。
- 尚未完成的關卡與功能應清楚標示，不把佔位內容描述為完整實作。
- 新增套件前先考慮是否有必要；保持初始框架可直接 `npm start` 執行。
- 修改規則、存檔或題庫後執行 `npm test` 和 `npm run check`；更改介面時實際用瀏覽器驗證。
- 變更存檔結構或已發布題目 ID 時，更新存檔驗證、版本遷移策略及測試。
- 不把學生個資、憑證或金鑰加入題庫或原始碼。

## 目前範圍

v0.3 已有十二關探索、47 題、場景機關、貼紙人物移動、圖片式過場、道具及終局。優先讀 `docs/PLAYTEST.md` 掌握最新行為；早期 ROADMAP／ARCHITECTURE 保留設計沿革。正式題庫索引見 `docs/question-bank/index.json`，執行來源仍為 `src/data/questions.js`。影像製作進度見 `docs/assets/manifest-v1.json`；不要一邊有影像 agent 正在 record，一邊以舊 manifest 重寫進度。音效來源見 `docs/audio/manifest.json`。
