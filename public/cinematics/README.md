# 圖片式過場

十二個可 seek 的 HyperFrames WAAPI HTML composition，每個 11.2 秒。根元素為 1280×720，動畫皆有限、fill both、初始化後暫停；遊戲播放器負責播放。沒有遠端依賴，不包含配音或預先轉碼的 MP4。可略過、重播，減少動態效果設定下改為靜態閱讀。

重建：node scripts/build-cinematics.mjs。檢查入口：public/cinematics/gate.html。
