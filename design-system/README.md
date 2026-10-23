「大樹神獸」讓市民認養、照顧、守護家附近的樹：每棵樹都有一群鄰居看著。視覺取自廟門彩繪的**粗黑墨線、平塗色塊、對稱構圖**，用當代、乾淨的方式重新詮釋，溫暖、有人情味，不莊嚴、不俗豔。

> 新加坡讓每棵樹都有身分證，我們讓每棵樹都有一群鄰居。

## 標誌

- 主要用 `assets/logos/logo-horizontal.svg`（鬚鬚公圓章＋「大樹神獸」標準字）；小空間、App 圖示、頭像用 `assets/logos/logo-emblem.svg`；深色底用反白版；單色印刷用 mono 版。
- 四周留白至少圓章直徑的 1/4；圓章最小 24px，橫式最小寬 120px。詳細規則見 Logo 元件。

## 使用情境

- 使用者站在樹旁、在戶外大太陽下單手操作手機：對比要夠、按鈕要大。
- 第一次看的人兩分鐘內要看懂，小孩也看得懂畫面。
- 分享到 LINE、Threads、IG 的卡片要一眼認得出來。

## 文字語氣

- 用「你」稱呼使用者，像鄰居說話：「這棵榕樹已經有 128 位鄰居守護。」
- 按鈕說清楚會發生什麼：「守護祂」「回報樹況」「看公告」。
- 樹用尊稱與暱稱：「大樹公」「樹王公」。神獸是長輩、是朋友，不是怪物，也不是可以抽的卡。
- 講到移除、公示，語氣冷靜、給時間與行動：「公示中，剩 12 天。你可以看公告、表達意見。」不要恐嚇。
- 不用 emoji。不用「抽」「轉」「機率」「稀有」等抽卡用語。

## 顏色

- 比例：宣紙 `surface` 45%、樹綠 `brand` 35%、墨線 `outline` 12%、廟牆紅 `action` 6%、雕像金 `honor` 2%。
- 頁面底用 `surface`，卡片與抽屜用 `surface-raised`，地圖底用 `surface-sunken`。
- 主文字用 `text`，次要文字用 `text-muted`（不要再淺）。綠色文字用 `brand-text`，金色文字用 `honor-text`。
- `action`（廟牆紅）只給主要行動按鈕「守護祂」與紅布條圖示。一個畫面只有一個 `action` 按鈕。
- `honor`（雕像金）只做圖形點綴：神獸標記光圈、光明燈、徽章。不放小字。
- **紅與金不同時大面積出現**：同一畫面紅＋金合計不超過 15%，不要並排做大色塊。
- 匾額 = `brand-strong` 底配 `honor-on-dark` 字。

## 樹況（五種狀態）

每個狀態一定是「顏色＋圖示＋文字」三件一起出現，不只靠色相。

| 狀態 | 圖形 | 標籤 | 意思 |
| --- | --- | --- | --- |
| 正常 | `state-ok` | `state-ok-text` on `state-ok-bg` | 健康、有人守護 |
| 需關注 | `state-watch` 亮黃＋墨色「!」 | `state-watch-text` on `state-watch-bg` | 葉子轉黃、稀疏、疑似病害 |
| 公示中 | `state-notice` ＋墨色斜紋 | `state-notice-text` on `state-notice-bg`，虛線框 | 移除或移植公告期 |
| 保留 | `state-keep` | `state-keep` on `state-keep-bg` | 審議後原地保留 |
| 移植 | `state-move` | `state-move` on `state-move-bg` | 搬到新家，追蹤存活 |

「公示中」是**警報**，不是按鈕：亮橘＋墨色斜紋（取自路口警示桿），淺底、喇叭圖示、帶倒數天數。它永遠不用實心圓角按鈕的樣子，和 `action` 紅色按鈕一眼分得出來。

## 異動公告與社區佈告欄：兩種卡片的分工

| | OfficialNoticeCard 異動公告卡 | CommunityEventCard 社區活動卡 |
| --- | --- | --- |
| 用途 | 市府的移除或移植公告（官方說了什麼） | 在地守護者在樹下發起的活動（鄰居想一起做什麼） |
| 放在哪 | 樹木頁頂端提醒點進來、通知、異動警報頁 | 樹木頁的「社區佈告欄」 |
| 外觀 | 白底、粗墨框、橘黑警示斜紋、「異動公告」＋公示中標籤 | 淺綠三色輪替（green-200／100／50）、墨框＋內側綠虛線、撕頁日期、「市民活動」深綠籤 |
| 行動 | 「看原始公告」＋「表達意見」 | 「我想參加」次要按鈕＋想參加人數 |
| 誰能發 | 只有官方資料來源 | 在地守護者（自己選「家附近、常經過的樹」）；遠端關注者只能看與參加 |

- 橘色與斜紋只屬於異動公告、NoticeBanner 與公示中標籤；社區活動絕不使用。社區活動是綠色系，也不使用紅色。
- 兩種卡片都不用廟牆紅主要按鈕。
- 社區活動發起人預設匿名「在地守護者」，自己選擇才顯示暱稱；不顯示位置。發起畫面提醒：不寫他人個資、活動選在公開場所。

## 字體

- 標題用 `display` 家族（Noto Serif TC Black），厚實像匾額：`display`、`title-lg`、`plaque`、`title-sm`。
- 內文與介面用 `sans` 家族（Noto Sans TC）：`body-lg`、`body`、`button`、`label`、`caption`。
- 戶外內文最小 `body`（16px）；`caption` 只用於註記與資料來源。
- 中文示範見 Typography 元件（字體表格的範例句是頁面內建英文，以 Typography 元件為準）。
- 兩個字體都從 Google Fonts 載入：`https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Serif+TC:wght@700;900&display=swap`。

## 墨線、形狀、陰影

- 所有色塊都包墨線 `outline`。粗細依尺寸：標籤與小圖示 `stroke-fine`，按鈕、卡片、48px 圖示 `stroke-ui`，匾額與分享卡外框 `stroke-bold`，海報大圖 `stroke-hero`。
- 圓角少而小：按鈕、標籤與匾額 `radius-sm`，卡片與通知條 `radius-md`，篩選膠囊 `radius-pill`。
- 全系統平面，不用陰影、不用漸層。按鈕用「匾額雙框」表示可以按：墨色外框內再一圈細線（主要按鈕是米白線，次要按鈕是墨線）；按下只把底色加深。
- 焦點框：`focus-ring` 3px 實線、外推 3px。

## 版面與間距

- 手機左右邊距 `space-4`，卡片內距 `space-4`，元素間距 `space-3`，區塊間距 `space-6`。
- 觸控目標至少 `target-min`（48px），主要按鈕高 `button-height`。
- 構圖偏好對稱：簡報封面讓兩隻神獸像門神一樣左右相對，標題放中間的匾額裡。
- 分隔線用燕尾屋脊（見 Ridge），標題框用匾額（見 Plaque），底紋用窗花格紋，深色區塊用雲紋。紋樣是點綴，不鋪滿整面。

## 桌機版（1024px 以上）

- 在 `tokens.css`、`components.css` 之後載入 `desktop.css`。電腦版只在「寬度 1024px 以上，而且是滑鼠操作」時套用（`hover: hover` 且 `pointer: fine`）。手機和平板是 PWA，一律用手機版，包括 iPad 橫放；平板置中加寬。
- JS 判斷是否為電腦版，用同一個條件：`matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')`。
- 桌機和手機的功能差異只有一個：**電腦上沒有掃描**。底部導覽列換成頂部導覽 `dsh-topnav`（地圖、圖鑑、通知、我的），找樹靠搜尋和地圖。
- 在地守護由使用者自己選（「這是我家附近、常經過的樹」），不靠掃碼；回報可以回家用電腦上傳照片，附拍攝日期，位置資訊上傳前移除。
- 版面 token（在 `desktop.css` 的 `:root`）：`--content-max` 1280px、`--desk-rail` 360px、`--desk-panel` 400px、`--desk-aside` 420px、`--desk-topnav-h` 72px、`--desk-btn-max` 360px。
- 版面 class：`dsh-desk`（置中容器）、`dsh-cols`／`dsh-cols__aside`／`dsh-cols__main`（雙欄）、`dsh-mapdesk`／`dsh-rail`／`dsh-mapview`／`dsh-panel`（地圖三欄）、`dsh-dialog`＋`dsh-scrim`（置中對話框）、`dsh-upload`／`dsh-thumbs`（上傳照片）、`dsh-steps`（步驟條）、`dsh-btnrow`（按鈕列）。
- 按鈕在桌機不拉滿欄寬：`dsh-btn--block` 最寬 `--desk-btn-max` 並置中。
- 社區活動卡 `dsh-event-list` 在桌機排成格狀；圖鑑用 `dsh-dex`（神獸卡）與 `dsh-dexrow`／`dsh-dexmini`（遠端關注小卡）。
- 設計稿：Claude Design 畫布「大樹神獸 桌機網頁版」（12 張，1440 寬，地圖首頁與神獸頁另有 1024 寬）。

## 神獸與插畫

- 代表神獸「鬚鬚公」：葉叢頭冠、白色氣根鬍鬚、樹幹身體、腰間寬鬆繫一條紅布。角色設定以 `assets/character/xuxugong-3d.png` 為準；App 內與小尺寸用線稿版 `assets/character/xuxugong-line.svg`。
- 其他神獸的 3D 圖（鬚鬚公、茄苳仔、雀雀，各有元氣滿滿與需要關心兩種狀態）在 `assets/character/beasts/`，檔案用途見該資料夾的 README。名字、個性、故事見 `docs/design/神獸角色設定.md`。
- 線稿畫法：正面對稱、墨線包邊、平塗；樹皮用 `gold-600`／`gold-500`，葉叢用 `brand`，鬍鬚用 `ink-50`，腮紅用 `red-300`。
- 表情永遠溫和（瞇眼笑），不畫兇猛的門神臉。
- 敬樹不傷樹：紅布只寬鬆綁；不畫在樹幹上釘東西、用鐵絲纏樹、在樹根旁燒香燒金紙。
- 祭拜相關畫面要有敬意，不消費、不戲謔宗教。不放政治人物、政黨色彩或攻擊性符號。

## 圖示

- 自繪 48×48 圖示，`stroke-ui` 墨線＋平塗，見 `Icons` 群組。功能：guard（守護）、report（回報）、camera（拍照）、share（分享）、bell（通知）、map（地圖）、collection（圖鑑）、scan（掃 QR code）；主題：tree（樹）、lantern（光明燈）、red-cloth（紅布條＝已被守護）、notice（公示中）。
- 底部導覽列用同造型的 26px 單色線條版，放在 `assets/icons/nav/`：nav-map、nav-collection、nav-scan、nav-bell、nav-me（26×26、2.5px 線、`currentColor`、不填色）。用 `dsh-nav__icon--{名稱}` 套用，顏色跟著選取狀態變，見 BottomNav。
- 背景紋樣三種，見 Patterns：窗花格紋（頁面底）、榕葉紋（一般卡片插畫底）、雲紋（深色區塊、稀有款）。
- 圖示是固定顏色的 SVG，用 `<img>` 放，不能用 currentColor 改色；需要新顏色就新增一個檔。
- 地圖標記是小屋簷形狀加一根小柱，柱底墨點對準樹的座標（見 MapMarker）；一般樹 `marker-size`，神獸放大 1.5 倍並加 `honor` 光圈、小金匾與神獸小圖（`assets/character/beasts/{神獸}/healthy-icon.webp`）。
- 燕尾屋脊見 Ridge：`assets/patterns/ridge-end.svg` 做左右兩端，中段伸縮；`assets/patterns/ridge.svg` 是固定寬度完整版。
