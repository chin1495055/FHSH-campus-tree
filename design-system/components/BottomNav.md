底部導覽列：App 的五個主要入口，中間是掃描樹牌 QR code 的圓形按鈕。

- `<nav class="dsh-nav">` 內五個 `dsh-nav__item`：地圖、圖鑑、掃描、通知、我的。
- 目前頁面加 `aria-current="page"`：文字與圖示變 `brand-text`，上緣出現一條綠色小屋脊。
- 中間的掃描是 `dsh-nav__scan`：綠底圓形、匾額雙框，凸出列外；不用紅色（紅色只給「守護祂」）。
- 圖示：`<span class="dsh-nav__icon dsh-nav__icon--{map|collection|scan|bell|me}" aria-hidden="true"></span>`。圖檔在 `assets/icons/nav/`（26×26、2.5px 線、`currentColor`、不填色），CSS 用遮罩上色，所以會跟著文字顏色變（一般 `text-muted`、選取 `brand-text`、掃描鍵 `ink-50`）。
- 也可以把 SVG 檔內容直接內嵌在 `<a>` 裡，效果相同。
- 圖示與 48px 彩色版同一套造型：nav-map ↔ map、nav-collection ↔ collection、nav-scan ↔ scan、nav-bell ↔ bell；nav-me 是頭上長一片新芽的簡單人形。
- 遮罩圖檔要透過網頁伺服器讀取；用 `file://` 直接開檔時圖示不會顯示。
- 底部自動留出手機安全區。

```html
<nav class="dsh-nav" aria-label="主要導覽">
  <a class="dsh-nav__item" href="map.html" aria-current="page"><span class="dsh-nav__icon dsh-nav__icon--map" aria-hidden="true"></span>地圖</a>
  <a class="dsh-nav__item" href="collection.html"><span class="dsh-nav__icon dsh-nav__icon--collection" aria-hidden="true"></span>圖鑑</a>
  <span class="dsh-nav__item"><a class="dsh-nav__scan" href="scan.html" aria-label="掃描樹牌 QR code"><span class="dsh-nav__icon dsh-nav__icon--scan" aria-hidden="true"></span></a>掃描</span>
  <a class="dsh-nav__item" href="notices.html"><span class="dsh-nav__icon dsh-nav__icon--bell" aria-hidden="true"></span>通知</a>
  <a class="dsh-nav__item" href="me.html"><span class="dsh-nav__icon dsh-nav__icon--me" aria-hidden="true"></span>我的</a>
</nav>
```

使用者提供：連結與目前頁面。通知有未讀時在圖示右上加綠點，不加數字紅點。

不要：超過五個入口；用陰影讓中間按鈕浮起來；用紅色。

## 桌機版（1024px 以上）

- 載入 `desktop.css` 後，`dsh-nav` 自動隱藏，改用頂部導覽 `dsh-topnav`。
- 桌機沒有掃描功能，頂部導覽只有四個入口：地圖、圖鑑、通知、我的。找樹改用搜尋框和地圖。
- 目前頁面一樣加 `aria-current="page"`，下緣出現綠色小屋脊。
- 頂部搜尋框 `dsh-topnav__search` 放在最右邊；地圖首頁的搜尋框在左欄，頂部不放。

```html
<header class="dsh-topnav">
  <a class="dsh-topnav__brand" href="map.html"><img src="assets/logos/logo-horizontal.svg" alt="大樹神獸"></a>
  <nav aria-label="主要導覽">
    <ul class="dsh-topnav__links">
      <li><a class="dsh-topnav__item" href="map.html" aria-current="page"><span class="dsh-nav__icon dsh-nav__icon--map" aria-hidden="true"></span>地圖</a></li>
      <li><a class="dsh-topnav__item" href="collection.html"><span class="dsh-nav__icon dsh-nav__icon--collection" aria-hidden="true"></span>圖鑑</a></li>
      <li><a class="dsh-topnav__item" href="notices.html"><span class="dsh-nav__icon dsh-nav__icon--bell" aria-hidden="true"></span>通知</a></li>
      <li><a class="dsh-topnav__item" href="me.html"><span class="dsh-nav__icon dsh-nav__icon--me" aria-hidden="true"></span>我的</a></li>
    </ul>
  </nav>
  <label class="dsh-search dsh-topnav__search"><input type="search" placeholder="搜尋樹名、樹號或地點" aria-label="搜尋樹"></label>
</header>
```

手機和桌機的導覽可以同時寫在頁面上，由 `desktop.css` 依螢幕寬度決定顯示哪一個。
