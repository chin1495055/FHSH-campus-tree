# Claude Design 提示詞：設計系統補件

> 用途：整段貼進 Claude Design，請它在現有的「大樹神獸」設計系統上補齊缺的元件和素材。
> 狀態：草稿（2026/10/22，Qmoa）。產出後放回 `design-system/`，再跟 Saori 確認。
> 背景：檢查 design-system 時發現，地圖標記、燕尾屋脊、導覽列線條圖示只有規格說明，沒有可以直接用的 CSS 或 SVG。

---

## 提示詞（從這裡開始複製）

請在現有的「大樹神獸」設計系統上補齊下面幾個缺的部分。**沿用既有的 tokens、命名規則和視覺風格，不要重新設計，也不要改動已經完成的元件。**

### 技術限制（很重要）

- App 是純前端靜態網站：HTML、CSS、原生 JavaScript，**不用 React 或任何框架，不用建置工具**。
- 所有元件都要是**純 CSS class ＋ HTML 結構**，class 一律用 `dsh-` 開頭，寫進 `components.css`。
- 顏色、尺寸、線寬、圓角只能用 `tokens.css` 的 CSS 變數（例如 `var(--outline)`、`var(--marker-size)`、`var(--stroke-ui)`），不要寫死色碼。
- SVG 素材放在 `assets/` 對應的資料夾，CSS 裡用相對路徑引用（和現有的 `assets/patterns/` 一樣）。
- 全系統平面：不加陰影、不用漸層、不用 emoji。

### 要補的東西

#### 1. 地圖標記 MapMarker（最優先）

照 `components/MapMarker.md` 的規格做出可以直接用的 CSS 和 HTML 結構。這個標記會放進 Leaflet 的 `L.divIcon`，所以：

- 給我一段 HTML 字串範本，可以直接塞進 `divIcon` 的 `html` 參數。
- 標記的「尖端」要對準樹的座標，請告訴我對應的 `iconSize` 和 `iconAnchor` 數值。
- 需要的狀態：正常 `ok`、需關注 `watch`（亮黃＋墨色「!」）、公示中 `notice`（橘色＋墨色 45° 斜紋）、保留 `keep`、移植 `move`。
- 神獸版：放大 1.5 倍、背後 `honor` 金色光圈、屋簷下一塊小金匾。屋簷裡可以放神獸的 96×96 小圖（`assets/character/beasts/{神獸}/healthy-icon.webp`）。
- 標記旁邊要能掛一個**守護人數小標籤**（例如「128」），選取時下方顯示狀態文字。
- 選取中的樣式（被點擊、底部卡片打開時）。
- 觸控範圍至少 `target-min`（48px），即使圖形比較小。
- 不用水滴形地圖釘，不用紅色表示任何樹況。

#### 2. 燕尾屋脊 Ridge

照 `components/Ridge.md` 的規格：

- 一個 SVG 檔 `assets/patterns/ridge.svg`，或可以內嵌的 SVG 片段。
- 一個 `dsh-ridge` class，寬度隨容器伸縮，**兩端燕尾維持原本比例不變形**（可以用左端、中段、右端三段組合，或 `preserveAspectRatio` 處理）。
- 線寬 `stroke-bold`，顏色 `outline`。

#### 3. 底部導覽列的線條圖示

`components/BottomNav.md` 要 26px 單色線條版圖示，但 `assets/icons/` 現在只有 48px 的彩色版。請畫這 5 個：

| 檔名 | 用途 | 參考的彩色版 |
|---|---|---|
| `nav-map.svg` | 地圖 | `icons/map.svg` |
| `nav-collection.svg` | 圖鑑 | `icons/collection.svg` |
| `nav-scan.svg` | 掃描（中間圓形按鈕裡） | `icons/scan.svg` |
| `nav-bell.svg` | 通知 | `icons/bell.svg` |
| `nav-me.svg` | 我的 | 目前沒有，請新畫，造型和其他四個同一套 |

- 放在 `assets/icons/nav/`，26×26，線寬 2.5px，`stroke="currentColor"`、不填色，讓選取狀態可以變色。
- 造型要和對應的 48px 彩色版一看就是同一個圖示。
- 「我的」不要畫成寫實人臉，可以用簡單的人形或一片葉子加人形。

#### 4. 更新文件

- 更新 `components/MapMarker.md`、`components/Ridge.md`、`components/BottomNav.md`，補上實際的 class 名稱和 HTML 範例。
- 更新 `README.md` 的「圖示」一節，加上導覽列線條圖示的位置。

### 不要做的事

- 不要改神獸的名字、角色圖或其他已完成的元件。
- 不要新增抽卡、星等、閃光這類暗示收集稀有度的設計。
- 不要用紅色（`action`）做地圖標記或導覽列；紅色只給「守護祂」按鈕。

### 交付

請列出新增和修改了哪些檔案，並附一個示範頁，把五種狀態的地圖標記（一般樹和神獸各一組）、燕尾屋脊和底部導覽列放在一起，讓我確認效果。
