# Readable trials and lighter assets implementation plan

**Goal:** 題目在桌面右側安全可讀，線索可讀，移除所有額外機關檢驗，逐題審查並改善手機載入。

**Architecture:** 保留原生 ES modules 與既有存檔。桌面場景／題目兩欄，<=1100px 垂直排列。探索三線索後直接 startTrial；舊存檔 solved 僅保留為流程相容標記。原始 PNG 保留，執行版本改用兩尺寸 WebP。

**Tech Stack:** JavaScript、CSS Grid、Node tests、Pillow WebP，無新增瀏覽器依賴。

## Tasks

- [ ] 新增探索直接答題測試，確認未集齊線索不能進入、已集齊不需檢驗、不重複獎勵、存檔可讀。
- [ ] 移除 exploreView 機關 UI 和 main 事件，更新 startTrial，保留題目內十二種互動。
- [ ] 建立 scene-question-layout，題目框使用不被裝飾覆蓋的實色內層、預留邊距；線索卡內文 >=17px。
- [ ] 題庫 agent 審查47題的故事任務、學生用語、誘答；穩定ID不變，重新歸檔與查核。
- [ ] 產生97張 WebP 桌面／手機副本，建立索引及大小報告；限制預載至目前場景三張，過場使用壓縮圖。
- [ ] 驗證桌面、平板、手機頁面，執行全測試／題庫檢查／素材路徑檢查，更新說明並發布 GitHub Pages。

## Review focus

- 長題目不得超出圖框、三種螢幕無水平溢位。
- 舊探索存檔可直接繼續，已進答題者不退回。
- 手機首次載入不預載人物所有表情或所有關卡。
- 壓縮圖保留透明度與原圖一致性，UI花框不覆蓋文字。
- 題庫文字變動不得破壞互動解答、檔案索引及存檔ID。
