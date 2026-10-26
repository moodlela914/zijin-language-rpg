# 紫禁語文弈 · 開放授權音效資產

查核日期：2026-10-26。基礎包 37 個音檔、51 個事件 cue，另補充 2 個實錄鑼／鈴。目前合計 **39 個開放授權音檔、55 個事件 cue、3 個中國風音序配方**，音檔共 **17,672,694 bytes（約 16.85 MiB）**。這是素材交付與調度索引；不代表遊戲播放邏輯已經接入。使用者指定的 `The_Silent_Coup.mp3` 不列入這份 CC0 素材授權清單，且未修改。

## 調度入口

- `src/data/audio.js`：`audioAssets`（音檔 ID → URL／預設音量／loop／時長）、`audioCues`（遊戲事件 → assetId／volume／playbackRate／loop）。
- `docs/audio/manifest.json`：完整來源、授權、作者、原始下載 URL／ZIP 成員、檔案大小、SHA-256、編碼、取樣率與時長。
- `public/assets/audio/`：真實 OGG／WAV 音檔。
- 遊戲啟動後開啟 [試聽頁](http://127.0.0.1:5173/public/assets/audio/audition.html)，逐個點選播放。
- `docs/audio/licenses/`：官方 ZIP 授權原文與來源網站 HTML 查核快照。
- `docs/audio/source-packs/`：四個原始 Kenney ZIP，供來源追溯；不是全部打入執行目錄。

## 授權核對

本次只納入明確 **CC0 1.0** 素材，允許教育及商業使用，不強制署名；保留作者姓名作為可選致謝。此處的「開放授權」指音效內容授權，並非宣稱音效庫網站軟體是開源。

| 來源 | 作者／提供者 | 來源授權證據 | 本次用途 |
|---|---|---|---|
| [Interface Sounds](https://kenney.nl/assets/interface-sounds) | Kenney | 官方素材頁標示 Creative Commons CC0；包內 License.txt 同意個人、教育及商業使用 | 點選、返回、正誤、提示、倒數、玉器短聲 |
| [UI Audio](https://kenney.nl/assets/ui-audio) | Kenney | 官方 CC0 + 包內 License.txt | 滑入短聲 |
| [RPG Audio](https://kenney.nl/assets/rpg-audio) | Kenney | 官方 CC0 + 包內 License.txt | 書冊、布料、門、鎖、金屬與拾取擬音 |
| [Music Jingles](https://kenney.nl/assets/music-jingles) | Kenney | 官方 CC0 + 包內 License.txt | 四個短音樂提示，非整曲背景音樂 |
| [Ambient Bird Sounds](https://opengameart.org/content/ambient-bird-sounds) | isaiah658 | 作者上傳頁明示 CC0，署名不必但歡迎 | 庭園鳥鳴 |
| [wind1](https://opengameart.org/content/wind1) | Luke.RUSTLTD | 作者上傳頁明示 CC0，說明為合成風聲 | 庭院與冬季風聲 |
| [Short wind sound](https://opengameart.org/content/short-wind-sound) | remaxim | 作者上傳頁明示 CC0 | 淡入淡出過場 |
| [Fireplace Sound loop](https://opengameart.org/content/fireplace-sound-loop) | PagDev | 作者上傳頁明示 CC0，作者回覆確認可自由使用 | 有明火的室內環境，低音量選用 |

Kenney 的[官方使用說明](https://kenney.nl/support)也確認素材頁資產為 CC0、商用允許、署名自願。[CC0 1.0 授權說明](https://creativecommons.org/publicdomain/zero/1.0/)。可選致謝文案：

> Sound effects: Kenney (kenney.nl), isaiah658, Luke.RUSTLTD, remaxim and PagDev via OpenGameArt.org. CC0 1.0.

## 事件覆蓋

同一音檔可供多個有相近聽感的事件使用；索引明確重用，不把別名算成獨立錄音。

| 事件 cue | 使用時機 | 音檔 ID |
|---|---|---|
| uiClick / uiHover / uiBack | 按鈕、滑入、返回 | ui-click / ui-hover / ui-back |
| uiOpen / uiClose / inventoryOpen / inventoryClose | 面板與背包開合 | ui-open / ui-close |
| settingToggle / scroll / pause / resume | 設定、卷軸、課堂暫停 | setting-switch / scroll-soft / ui-close / ui-open |
| dialogue / choice | 對話框出現、提交答案 | cloth-soft / choice-select |
| correct / wrong | 答對／答錯 | answer-correct / answer-wrong |
| timeout / countdown | 超時、倒數最後幾秒 | timer-end / timer-tick |
| hint / hintJinxi / hintJing / hintDuan | 密友提示 | hint-question / clue-pluck / book-open |
| itemNeedle / itemPaper / itemShield / itemGain | 銀針、殘箋、金牌、獲得道具 | needle-metal / paper-flip / jade-chime |
| shard / sealComplete | 碎片獲得、鳳印集成 | token-collect / puzzle-jingle |
| chapterComplete / bossHit / victory / retry | 章節完成、心防受擊、通關、再試 | chapter-jingle / boss-impact / victory-jingle / ui-back |
| reviewCorrect / reviewWrong | 訂正正確／錯誤 | answer-correct / answer-wrong |
| hotspot / clue / questReveal | 熱點發現、線索拾取、任務揭示 | clue-pluck / book-place / chapter-jingle |
| puzzleOperate / puzzleSolved / woodMechanism | 機關操作、解謎成功、木製機關 | mechanism-click / puzzle-jingle / wood-creak |
| transition / sceneEnter / sceneExit | 淡入淡出、進出場景 | transition-wind / door-open / door-close |
| unlock / lock / step | 解鎖、鎖扣、單一步伐 | mechanism-latch / footstep-stone |
| bookOpen / bookFlip / bookClose | 書卷互動 | book-open / paper-flip / book-close |
| ambienceGarden / ambienceCourtyard / ambienceFire | 庭園鳥鳴、庭院風聲、明火環境 | ambience-birds / ambience-wind / ambience-fire |

## 接入示意

```js
import { audioAssets, audioCues } from './data/audio.js';
const cue = audioCues.correct;
const asset = audioAssets[cue.assetId];
const sound = new Audio(asset.src);
sound.volume = cue.volume;
sound.playbackRate = cue.playbackRate;
sound.loop = cue.loop;
// 必須放在玩家點選「開啟音效」之後；捕捉 autoplay 拒絕。
sound.play().catch(() => {});
```

主程式可快取 Audio 或改用 Web Audio，避免每字播放對話音。倒數只在最後幾秒每秒一次；正誤、通關與畫面切換應避免重疊播放。環境聲建議同時只播一條，場景切換淡出再換軌。

本機靜態伺服器需對 `.ogg` 回應 `audio/ogg`、`.wav` 回應 `audio/wav`。請提供音效開關及音量，預設安靜或待使用者開啟；不依賴瀏覽器自動播放。這些是接入建議，資料索引本身沒有改寫遊戲狀態。

## 驗證與再歸檔

已逐檔檢查：檔案非空、OGG/WAV magic bytes、ffprobe 正確辨識音訊與正時長、ffmpeg 完整解碼成功。沒有為了改名而重編碼或改動原始音質。39 個 SHA-256 值均唯一。

```powershell
python scripts/extend-chinese-audio.py
node --check src/data/audio.js
```

補充腳本保留現有音檔與 cue 索引，只更新鑼／鈴和音序，不重新連網；需要本機 Python、ffmpeg、ffprobe。遊戲播放不需要這些工具。`archive-audio.py` 是基礎包重建腳本，會重建為原始 37 檔索引，請勿單獨執行來覆蓋已擴充的清單。

## 中國風補充與上揚慶賀配方

| 新素材 | 作者 | 來源與授權 | 用途 |
|---|---|---|---|
| `palace-gong.ogg` | Joseph SARDIN | [Gong, sweet](https://bigsoundbank.com/gong-sweet-s1482.html)，頁面明示 CC0 | 宮廷儀式感、轉場尾聲、慶賀落點 |
| `palace-bell.ogg` | GlaneurDeSons | [Small Bell #1](https://bigsoundbank.com/clochette-1-s0292.html)，頁面明示 CC0 | 線索清音、揭示、慶賀尾聲 |

[BigSoundBank 授權頁](https://bigsoundbank.com/licenses.html)明列 CC0 1.0 Universal，允許商用、改作與再散布，署名自願。新增兩個音效的來源頁及授權 HTML 快照存於 `docs/audio/licenses/bsb-*.html`。音檔是實錄鑼／鈴，但並未宣稱錄自特定中國古樂器或清代器物；不使用「古箏實錄」「木魚實錄」等無法查證名稱。

沒有找到能快速核實 CC0 且合適的現成中國風熱烈上揚 stinger，因此交付**新編五聲音階音序配方**，由主程式播放時組合；它不是下載的古樂成品：

- `chineseAudioSequences.chineseVictory`：2.7 秒，以 `jade-chime` 按半音 `[0, 2, 4, 7, 9, 12, 14, 16]` 每 170 毫秒向上播放，音量逐漸增強；1200 毫秒疊輕鑼、1450 毫秒加小鈴。
- `chineseAudioSequences.chineseTransition`：1.2 秒，雙清音上行加輕鑼，供所有情境淡入淡出使用。
- `chineseAudioSequences.chineseReveal`：雙清音，供熱點／任務揭示。
- 每個 step 記錄 `assetId`、`atMs`、`semitones`、`volume`，部分另有 `maxDurationMs`；播放器將 `semitones` 換為 `2 ** (semitones / 12)` 的 playbackRate，依 `atMs` 排程並在 `maxDurationMs` 前後做短淡出，避免切斷爆音。
- 單檔後備 cue：`chineseTransition`、`chineseVictory`、`chineseReveal`、`chineseMechanism`。完整音序應優先使用配方；只播後備鑼聲並不等於已完成「熱烈上揚」音樂效果。

可選新增致謝：Gong by Joseph SARDIN and bell by GlaneurDeSons via BigSoundBank.com, CC0 1.0.

## 範圍與聽感限制

- 本批提供全部已列遊戲／探索事件所需的可用短音效，不含人物配音或完整古風背景配樂。
- Kenney 音效是通用遊戲音，不宣稱為清代器物實錄；針的短金屬聲來自原包 drawKnife1.ogg，是聽感上的再用途。
- 短音樂提示採撥弦／鋼音色，正式教學前應在遊戲中試聽，依節奏與角色氣氛微調 volume。
- 庭園鳥鳴不宣稱為北京特定鳥種。風聲為作者合成素材。火焰聲是木柴壁爐，不當作細線香燃燒的寫實聲音。
- source 作者說風與火可 loop，但尚未進行逐個接縫的藝術聽審；循環播放時使用淡入淡出。
- 環境音是可選配，安靜書房可保留靜音，以免干擾課堂閱讀。來源頁均無需登入即可下載，未採用不明或非商用限制授權。

