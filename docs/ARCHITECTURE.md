# 架構與擴充

## 技術選擇

採原生 JavaScript ES Modules、HTML 與 CSS。現階段重點是對話、選項和學習回饋，使用 DOM 可保留可讀文字與鍵盤操作；不需先導入大型遊戲引擎。若日後加入場景移動或戰鬥動畫，可以在場景區整合 Phaser，保留題庫和規則模組。

沒有外部執行依賴，也沒有建置步驟。Node.js 只負責本機伺服器與測試，遊戲在瀏覽器執行。

## 模組責任

`data → engine → main`：資料檔定義內容，engine 負責狀態轉換，main 將狀態呈現為介面。storage 匯入 engine 的內容索引，負責持久化與基本格式檢查。engine 不使用 DOM、計時器或 localStorage，方便獨立測試。

`map → question → feedback → question / map` 是主要流程。氣血為零時，`feedback → remediation → feedback`，恢復後再繼續。每次操作會產生新狀態，介面統一儲存並重繪。倒數使用絕對截止時間，避免分頁降頻或重新整理帶來額外作答時間。

## 新增題目與關卡

1. 在 `src/data/questions.js` 新增物件，`chapterId` 對應 `chapters.js` 中的 ID。
2. 填入唯一 `id`、`concept`、`prompt`、至少兩個 `choices`、`answerId`、`hint`、`explanation`、`correction`。
3. `answerId` 必須與一個選項 ID 完全一致。選項 ID 與題目 ID 一旦發布應保持穩定。
4. 執行 `npm run check` 與 `npm test`，再實際試玩。

目前依章節目錄順序、只列入有題目的章節，計算可玩關卡與解鎖順序。因此為第四關加入題目即可開放第四關。不要跳過中間關卡加入正式內容，以免產生不符合故事順序的進程。關卡題目依陣列順序出現。

示意結構：

```js
{
  id: 'garden-season-01',
  chapterId: 'garden',
  concept: '節令詩詞',
  prompt: '請填入情境問題',
  choices: [{ id: 'a', text: '選項一' }, { id: 'b', text: '選項二' }],
  answerId: 'a',
  hint: '只給思考方向',
  explanation: '解釋正確答案及錯誤原因',
  correction: '需要記住的核心概念',
}
```

## 存檔與學習紀錄

localStorage key 為 `zijin-language-rpg:v1`。資料包含 `version`、氣血、提示次數、已通關 ID、目前題目、階段、倒數截止時間與作答紀錄。所有通關 ID 必須是可玩關卡的連續前綴；作答中題目必須屬於下一關。格式錯誤時回到新進度並顯示通知。此檢查用於容錯，不具防作弊或身分驗證功能。

變更題目 ID、關卡順序、增刪已發布題庫或修改存檔結構前，應規劃版本升級及遷移。新增功能若影響 state，請同步更新 `createGame()`、存檔驗證與測試。現階段報表是每個概念的答對數、作答數與提示次數，訂正重複練習不列入首次作答紀錄；不能直接解讀為完整學習能力評量。

若需要跨裝置或教師班級管理，再設計登入、資料庫、存取權限及紀錄保存期限。不要將學生個資加入目前的本機示範題庫。

## 視覺與素材

配色集中於 `styles.css` 的 `:root`。`main.js` 的 `.scene` 目前以 CSS 畫出佔位宮殿。素材準備完成後，先新增場景／人物素材資料表，再由關卡 ID 對應 URL；不要將判分規則寫進美術或介面模組。詳見 `public/assets/README.md`。
