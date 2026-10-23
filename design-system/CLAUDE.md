# 大樹神獸 設計系統

做任何畫面、元件或圖片前，先讀 `design-system/README.md`（品牌手冊），再依需要讀 `design-system/components/<元件>.md`。

- 顏色、字級、間距、圓角、墨線粗細：只用 `design-system/tokens.css` 的 CSS 變數與字級 class，不要寫死色碼。
- 元件樣式：引入 `design-system/components.css`，用 `dsh-` 開頭的 class（例如 `dsh-btn dsh-btn--primary`、`dsh-tag dsh-tag--ok`）。
- 圖示、標誌、角色、紋樣：用 `design-system/assets/` 裡的檔案，不要自己重畫或改色。
- 字體：在 HTML `<head>` 載入 tokens.css 第二行註解裡的 Google Fonts 連結。
- 全系統平面：不加陰影、不用漸層、不用 emoji、不用抽卡用語。
- 「守護祂」是唯一的紅色主要按鈕；「公示中」是警報，永遠不做成按鈕。
