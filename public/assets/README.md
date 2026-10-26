# 美術與音效素材位置

建議使用以下分類；目前尚未加入正式美術，遊戲以 CSS 場景佔位。

| 類型 | 路徑範例 | 規格 |
| --- | --- | --- |
| 背景 | `backgrounds/gate.webp` | 16:9，優先壓縮成 WebP；原始 4K 圖另存工作檔 |
| 人物 | `characters/jinxi-neutral.png` | 3:4、透明背景；情緒用 neutral / angry / shocked |
| 道具 | `items/silver-needle.webp` | 1:1；需要透明時使用 PNG 或 WebP |
| UI | `ui/dialogue-frame.png` | 透明邊框，避免把文字烘焙進圖片 |
| 音效 | `audio/correct.mp3` | 音量一致，提供靜音與音量控制後再接入 |

URL 以 `/public/assets/` 開頭，例如 `/public/assets/backgrounds/gate.webp`。目前沒有 bundler，不會自動將 public 內容搬到根目錄。

素材名稱使用小寫英文和連字號。正式接入時新增資料表記錄關卡／角色 ID、檔案 URL、替代文字、來源與授權。請參照根目錄《遊戲美術素材清單與生成提示詞表.md》的風格與場景規範。
