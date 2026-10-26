# 97 張素材製作規格與資產清單

版本：v1。2026-10-26 使用者已確認三張風格樣張，授權分批製作完整素材包。本清單取代原美術提示詞中相互衝突的寫實／3D風格指示；原企劃文件仍保留。

## 數量與交付

| 分類 | 數量 | 內容 |
|---|---:|---|
| BG | 12 | 十二關場景 |
| CH | 60 | 20 組人物造型，每組平常／緊張／收束 3 種表情 |
| PR | 18 | 5 件道具、12 個獨立收藏碎片、1 個完整鳳印 |
| UI | 3 | 對話框裝飾、燃香、氣血外框 |
| EX | 4 | 封面、地圖、兩款策書底圖 |
| 合計 | 97 | 包含已確認三張樣張，不重複計算 |

## 共用美術規格

- 錨定：`output/images/style-samples-v1/` 的 CH、PR、BG 三張，已獲使用者確認。
- 風格：細緻古風動漫、原創臉孔、柔和賽璐璐與細膩繪景；場景保留樣張的細節密度，不擅自改為扁平漫畫或寫實照片。
- 配色：硃砂紅 #A74739、青綠 #477D70、霧金 #C2A364、象牙 #F1E8D6、墨綠 #223D37。
- 光影：角色／物件以左上柔暖光為基準；場景依晨昏調整色溫，維持同一筆觸與陰影柔度。
- 人物：原創五官，清代宮廷題材的遊戲化服飾，非嚴格考古復原。年齡、臉型、髮型、服裝在同角色三表情間固定；終局甄嬛與初期同一臉孔。
- 表情：neutral 平常、tense 緊張／質疑、resolved 釋然／語塞，具體依角色立場。盟友不必一律憤怒、反派不必一律微笑。
- 不生成圖中文字，匾額／書目／題辭／數字／策書內文由程式疊加。
- 學生介面不使用血腥、恐怖或羞辱圖像；往事引導者以正常人像呈現。

## 尺寸、構圖與透明度

| 分類 | 構圖目標 | 檔案／透明度 | 安全區 |
|---|---|---|---|
| BG | 橫式 16:9 | PNG／不透明 | 下方 25% 對話區、左右可放角色 |
| CH | 直式 3:4，頭飾至大腿 | PNG／真 alpha | 頭頂與左右約 7%，不可切頭飾或手肘 |
| PR | 正方形 1:1 | PNG／真 alpha | 四周約 12%，小尺寸仍可辨識 |
| UI-01 | 橫式 16:9 裝飾框 | PNG／真 alpha | 中央空白透明，供程式放面板與文字 |
| UI-02 | 正方形 1:1 | PNG／真 alpha | 香爐與整根線香完整 |
| UI-03 | 長條 4:1 外框 | PNG／真 alpha | 中央透明，填色與數值由程式處理 |
| EX | 橫式 16:9 | PNG／不透明 | 地圖留標籤空間，策書保留空白文字區 |

生成器不保證精確像素，清單記錄各圖實際像素與 alpha，不把放大冒稱原生 4K。需要時保留原圖另行製作執行版，不覆寫錨定圖。UI 為靜態美術，倒數／進度動畫由程式實作。碎片是十二枚獨立收藏圖示，不保證幾何無縫拼接；地圖是遊戲示意而非歷史測繪。

## 檔案與追蹤

- 原始交付：`output/images/production-v1/{backgrounds,characters,items,ui,extras}/`。
- 遊戲資產副本：`public/assets/{backgrounds,characters,items,ui,extras}/`。
- 機器可讀清單：`docs/assets/manifest-v1.json`，含每張完整提示詞、來源參考、狀態、實際尺寸與路徑。
- CSV：`docs/assets/asset-list-v1.csv`。
- 瀏覽畫廊：`public/assets/gallery.html`，分類顯示已完成素材及待製作項目。
- 不自動替換現有遊戲介面；本輪工作為素材製作與儲存。

## 製作批次與驗收

1. 承接三張錨定圖，製作其餘十一張背景。
2. 人物逐組：先 neutral，檢視後以同組 neutral 編修 tense、resolved；保留固定服裝、姿態與構圖。
3. 完整鳳印先行，作為十二碎片的材質與花紋參考，再製作其餘道具。
4. UI、封面、地圖、策書底圖；檢查文字留白與元素數量。
5. 每批檢查主題、畫風、肢體、背景透明度、檔案可讀性與重複；有問題保留舊版並做新版本，清單不可把缺圖標成完成。

## 逐張清單

| ID | 素材 | 比例 | 透明 | 參考錨點 |
|---|---|---|---|---|
| BG-01 | 大清門外 | 16:9 | 否 | BG-01 |
| BG-02 | 太和殿前 | 16:9 | 否 | BG-01 |
| BG-03 | 文淵閣 | 16:9 | 否 | BG-01 |
| BG-04 | 御花園 | 16:9 | 否 | BG-01 |
| BG-05 | 碎玉軒 | 16:9 | 否 | BG-01 |
| BG-06 | 翊坤宮 | 16:9 | 否 | BG-01 |
| BG-07 | 延禧宮 | 16:9 | 否 | BG-01 |
| BG-08 | 太醫院 | 16:9 | 否 | BG-01 |
| BG-09 | 景仁宮 | 16:9 | 否 | BG-01 |
| BG-10 | 慈寧宮 | 16:9 | 否 | BG-01 |
| BG-11 | 慎刑司 | 16:9 | 否 | BG-01 |
| BG-12 | 養心殿 | 16:9 | 否 | BG-01 |
| CH-01-neutral | 秀女甄嬛・平常 | 3:4 | 是 | CH-01-neutral |
| CH-01-tense | 秀女甄嬛・謹慎沉思 | 3:4 | 是 | CH-01-neutral |
| CH-01-resolved | 秀女甄嬛・堅定微笑 | 3:4 | 是 | CH-01-neutral |
| CH-02-neutral | 熹貴妃甄嬛・平常 | 3:4 | 是 | CH-01-neutral |
| CH-02-tense | 熹貴妃甄嬛・凌厲駁斥 | 3:4 | 是 | CH-02-neutral |
| CH-02-resolved | 熹貴妃甄嬛・從容勝出 | 3:4 | 是 | CH-02-neutral |
| CH-03-neutral | 康祿海・平常 | 3:4 | 是 | CH-01-neutral |
| CH-03-tense | 康祿海・驚疑失措 | 3:4 | 是 | CH-03-neutral |
| CH-03-resolved | 康祿海・尷尬服氣 | 3:4 | 是 | CH-03-neutral |
| CH-04-neutral | 禮部禮官・平常 | 3:4 | 是 | CH-01-neutral |
| CH-04-tense | 禮部禮官・嚴肅追問 | 3:4 | 是 | CH-04-neutral |
| CH-04-resolved | 禮部禮官・認可頷首 | 3:4 | 是 | CH-04-neutral |
| CH-05-neutral | 侍讀學士・平常 | 3:4 | 是 | CH-01-neutral |
| CH-05-tense | 侍讀學士・凝神思索 | 3:4 | 是 | CH-05-neutral |
| CH-05-resolved | 侍讀學士・欣慰微笑 | 3:4 | 是 | CH-05-neutral |
| CH-06-neutral | 齊妃・平常 | 3:4 | 是 | CH-01-neutral |
| CH-06-tense | 齊妃・不悅質疑 | 3:4 | 是 | CH-06-neutral |
| CH-06-resolved | 齊妃・驚訝服氣 | 3:4 | 是 | CH-06-neutral |
| CH-07-neutral | 富察貴人・平常 | 3:4 | 是 | CH-01-neutral |
| CH-07-tense | 富察貴人・挑眉質疑 | 3:4 | 是 | CH-07-neutral |
| CH-07-resolved | 富察貴人・收斂釋然 | 3:4 | 是 | CH-07-neutral |
| CH-08-neutral | 崔槿汐・平常 | 3:4 | 是 | CH-01-neutral |
| CH-08-tense | 崔槿汐・關切思索 | 3:4 | 是 | CH-08-neutral |
| CH-08-resolved | 崔槿汐・溫和鼓勵 | 3:4 | 是 | CH-08-neutral |
| CH-09-neutral | 浣碧・平常 | 3:4 | 是 | CH-01-neutral |
| CH-09-tense | 浣碧・擔心驚訝 | 3:4 | 是 | CH-09-neutral |
| CH-09-resolved | 浣碧・開心釋然 | 3:4 | 是 | CH-09-neutral |
| CH-10-neutral | 華妃年世蘭・平常 | 3:4 | 是 | CH-01-neutral |
| CH-10-tense | 華妃年世蘭・盛怒反駁 | 3:4 | 是 | CH-10-neutral |
| CH-10-resolved | 華妃年世蘭・震驚語塞 | 3:4 | 是 | CH-10-neutral |
| CH-11-neutral | 頌芝・平常 | 3:4 | 是 | CH-01-neutral |
| CH-11-tense | 頌芝・急切驚疑 | 3:4 | 是 | CH-11-neutral |
| CH-11-resolved | 頌芝・低眉服氣 | 3:4 | 是 | CH-11-neutral |
| CH-12-neutral | 安陵容・平常 | 3:4 | 是 | CH-01-neutral |
| CH-12-tense | 安陵容・不安疑慮 | 3:4 | 是 | CH-12-neutral |
| CH-12-resolved | 安陵容・靦腆釋然 | 3:4 | 是 | CH-12-neutral |
| CH-13-neutral | 溫實初・平常 | 3:4 | 是 | CH-01-neutral |
| CH-13-tense | 溫實初・專注辨析 | 3:4 | 是 | CH-13-neutral |
| CH-13-resolved | 溫實初・安心微笑 | 3:4 | 是 | CH-13-neutral |
| CH-14-neutral | 皇后烏拉那拉氏・平常 | 3:4 | 是 | CH-01-neutral |
| CH-14-tense | 皇后烏拉那拉氏・冷峻質問 | 3:4 | 是 | CH-14-neutral |
| CH-14-resolved | 皇后烏拉那拉氏・錯愕失語 | 3:4 | 是 | CH-14-neutral |
| CH-15-neutral | 皇太后烏雅氏・平常 | 3:4 | 是 | CH-01-neutral |
| CH-15-tense | 皇太后烏雅氏・威嚴審視 | 3:4 | 是 | CH-15-neutral |
| CH-15-resolved | 皇太后烏雅氏・慈和讚許 | 3:4 | 是 | CH-15-neutral |
| CH-16-neutral | 祺貴人・平常 | 3:4 | 是 | CH-01-neutral |
| CH-16-tense | 祺貴人・氣惱質問 | 3:4 | 是 | CH-16-neutral |
| CH-16-resolved | 祺貴人・心虛震驚 | 3:4 | 是 | CH-16-neutral |
| CH-17-neutral | 冷宮往事引導者・平常 | 3:4 | 是 | CH-01-neutral |
| CH-17-tense | 冷宮往事引導者・憂傷回望 | 3:4 | 是 | CH-17-neutral |
| CH-17-resolved | 冷宮往事引導者・釋然微笑 | 3:4 | 是 | CH-17-neutral |
| CH-18-neutral | 雍正皇帝・平常 | 3:4 | 是 | CH-01-neutral |
| CH-18-tense | 雍正皇帝・威嚴震怒 | 3:4 | 是 | CH-18-neutral |
| CH-18-resolved | 雍正皇帝・震驚語塞 | 3:4 | 是 | CH-18-neutral |
| CH-19-neutral | 敬妃・平常 | 3:4 | 是 | CH-01-neutral |
| CH-19-tense | 敬妃・審慎提醒 | 3:4 | 是 | CH-19-neutral |
| CH-19-resolved | 敬妃・安心鼓勵 | 3:4 | 是 | CH-19-neutral |
| CH-20-neutral | 端妃・平常 | 3:4 | 是 | CH-01-neutral |
| CH-20-tense | 端妃・凝神分析 | 3:4 | 是 | CH-20-neutral |
| CH-20-resolved | 端妃・洞明微笑 | 3:4 | 是 | CH-20-neutral |
| PR-01 | 字形銀針 | 1:1 | 是 | PR-01 |
| PR-02 | 菊花殘箋 | 1:1 | 是 | PR-01 |
| PR-03 | 避坑玉鐲 | 1:1 | 是 | PR-01 |
| PR-04 | 四庫玉簡 | 1:1 | 是 | PR-01 |
| PR-05 | 免死金牌 | 1:1 | 是 | PR-01 |
| PR-06 | 鳳印玉璽碎片 01 | 1:1 | 是 | PR-18 |
| PR-07 | 鳳印玉璽碎片 02 | 1:1 | 是 | PR-18 |
| PR-08 | 鳳印玉璽碎片 03 | 1:1 | 是 | PR-18 |
| PR-09 | 鳳印玉璽碎片 04 | 1:1 | 是 | PR-18 |
| PR-10 | 鳳印玉璽碎片 05 | 1:1 | 是 | PR-18 |
| PR-11 | 鳳印玉璽碎片 06 | 1:1 | 是 | PR-18 |
| PR-12 | 鳳印玉璽碎片 07 | 1:1 | 是 | PR-18 |
| PR-13 | 鳳印玉璽碎片 08 | 1:1 | 是 | PR-18 |
| PR-14 | 鳳印玉璽碎片 09 | 1:1 | 是 | PR-18 |
| PR-15 | 鳳印玉璽碎片 10 | 1:1 | 是 | PR-18 |
| PR-16 | 鳳印玉璽碎片 11 | 1:1 | 是 | PR-18 |
| PR-17 | 鳳印玉璽碎片 12 | 1:1 | 是 | PR-18 |
| PR-18 | 完整鳳印玉璽 | 1:1 | 是 | PR-01 |
| UI-01 | 對話框裝飾 | 16:9 | 是 | PR-01 |
| UI-02 | 御前燃香 | 1:1 | 是 | PR-01 |
| UI-03 | 氣血儀態條外框 | 4:1 | 是 | PR-01 |
| EX-01 | 遊戲封面底圖 | 16:9 | 否 | BG-01 |
| EX-02 | 紫禁十二殿地圖底圖 | 16:9 | 否 | BG-01 |
| EX-03 | 通關策書底圖 | 16:9 | 否 | PR-01 |
| EX-04 | 勤學策書底圖 | 16:9 | 否 | PR-01 |

## 人物造型固定設定

| 造型 | 固定設定 |
|---|---|
| 秀女甄嬛 | Young adult heroine; use the approved CH sample EXACT face, hairstyle, jade butterfly ornament, cyan floral robe, folded hands. |
| 熹貴妃甄嬛 | The SAME woman as approved CH sample, same face and eye shape, grown confident; crimson silk robe with refined phoenix gold embroidery, elegant broad Qing court updo with phoenix hairpins and jade tassels, folded hands. |
| 康祿海 | Palace eunuch attendant age 45, narrow long face, small sly eyes, no beard, muted maroon servant robe and black Qing servant cap, slim build, holds a closed roster at waist. |
| 禮部禮官 | Dignified male official age 55, rectangular face, neat salt-pepper moustache, navy Qing official robe with small crane rank badge, red-topped black Qing official hat, holding closed ivory jade ceremonial tablet. |
| 侍讀學士 | Gentle scholarly man age 40, slender oval face, narrow warm eyes, short neat black beard, muted teal scholarly official robe, small black scholar cap, holding a closed blue book. |
| 齊妃 | Mature woman age 40, round face, warm complexion, expressive brows, ochre and muted plum silk robe with small floral pattern, modest black court updo and round gold floral pins, folded hands. |
| 富察貴人 | Young adult woman age 24, heart-shaped face, upturned brows, confident eyes, light apricot and ivory floral Qing robe, neat court updo with small coral ornaments, hands folded. |
| 崔槿汐 | Wise senior palace maid woman age 40, long oval face, warm steady eyes and fine smile lines, dark navy and muted teal modest palace maid robe, tidy small black bun and silver pin, hands folded. |
| 浣碧 | Young adult palace maid age 22, round bright eyes, softly squared chin, light sage-green practical court maid robe, modest double bun with tiny pale green ornaments, folded hands. |
| 華妃年世蘭 | Proud noblewoman age 30, diamond face, sharp upturned phoenix eyes, slightly raised chin, scarlet and rich gold embroidered Qing robe, elaborate gold-and-jade head ornaments, folded hands. |
| 頌芝 | Young adult attendant woman age 26, narrow oval face, alert slightly slanted eyes, muted russet and dark jade servant robe, sleek bun and modest bronze hairpin, hands folded. |
| 安陵容 | Young adult woman age 24, small oval face, fine brows, shy observant eyes, pale dusty pink silk robe with restrained orchid embroidery, small understated pearl hair ornament, hands folded. |
| 溫實初 | Young adult male physician age 30, gentle clean-shaven face, soft long eyes, dark teal Qing physician robe with small quail rank badge, plain black official hat, holds small closed rosewood medicine box at waist. |
| 皇后烏拉那拉氏 | Dignified woman age 45, elongated oval face, carefully arched brows, calculating deep eyes, imperial muted yellow robe with refined gold embroidery, symmetric formal court hairpiece with pearls, pearl earrings, folded hands. |
| 皇太后烏雅氏 | Elderly woman age 65, kind but authoritative eyes, gentle cheek wrinkles, dark aubergine and antique gold formal robe, restrained pearl and jade headpiece, one strand wooden prayer beads held at waist. |
| 祺貴人 | Young adult woman age 25, angular heart-shaped face, straight bold brows, pale lavender and indigo silk court robe, silver floral head ornament, folded hands. |
| 冷宮往事引導者 | A living-memory portrait of a mature court woman age 38, thoughtful oval face, sorrowful gentle eyes, plain faded blue-grey robe, simple old silver hairpin, hair tidy, hands folded. Fully opaque human, dignified non-horror, no wounds or ghost aura. |
| 雍正皇帝 | Emperor age 45, long face, stern narrow eyes, neat thin moustache and short goatee, golden ochre five-clawed-dragon Qing robe, dark Qing court cap with small red crown, holds white jade prayer beads at waist. |
| 敬妃 | Calm noblewoman age 38, softly rounded mature face, steady discerning eyes, muted slate blue and ivory robe with restrained chrysanthemum embroidery, jade bracelet, silver-jade modest headpiece, folded hands. |
| 端妃 | Wise noblewoman age 42, slender long face, quiet deep eyes, light fine smile lines, muted indigo robe with antique gold edging and small plum motifs, restrained gold pin, folded hands. |

