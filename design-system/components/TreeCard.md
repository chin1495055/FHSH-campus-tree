樹的卡片：在地圖點一棵樹時從底部升起，告訴你祂是誰、狀態如何、有多少鄰居在看著祂。

結構（由上而下）：
1. `dsh-card__head`：樹名 `dsh-card__name`（神獸用暱稱，一般行道樹用樹種＋編號）＋ StatusTag。
2. `dsh-card__meta`：樹種、是否為神獸、樹齡、地點，用「・」分隔。
3. `dsh-card__count`：守護人數，數字包在 `<b>`。
4. 一個 `dsh-btn--primary dsh-btn--block`：「守護祂」；已守護時改為次要按鈕「回報樹況」。

使用者提供：樹名、狀態、樹種、樹齡、地點、守護人數、按鈕行為。資料未知時寫「［待查］」，不要編數字。

公示中的樹：卡片最上方加一條 NoticeBanner。

## 桌機版（1024px 以上）

- 手機的底部抽屜在桌機改成地圖右側的固定面板 `dsh-panel`，地圖不會被蓋住。左欄 `dsh-rail` 放搜尋、篩選和附近的樹清單 `dsh-treelist`。
- 三欄外框用 `dsh-mapdesk`：左欄 `--desk-rail`、地圖、右側面板 `--desk-panel`。1024–1279px 會自動收窄。
- 面板內容和手機卡片一樣，另外加神獸圖、元氣條和管理單位；底部按鈕「守護祂」（主要）＋「回報樹況」「看祂的頁面」（次要）。

```html
<main class="dsh-mapdesk">
  <aside class="dsh-rail" aria-label="找樹">…搜尋、篩選、dsh-treelist…</aside>
  <section class="dsh-mapview" aria-label="地圖">…Leaflet…</section>
  <aside class="dsh-panel" aria-label="選取的樹">
    <div class="dsh-card__head"><span class="dsh-tag dsh-tag--ok">正常</span><button class="dsh-close" aria-label="關閉面板">…</button></div>
    <h1 class="dsh-card__name">鬚鬚公</h1>
    <p class="dsh-card__meta">榕樹・約 120 年・距你 120 公尺</p>
    <p class="dsh-card__count"><b>128</b> 位鄰居守護</p>
    <a class="dsh-btn dsh-btn--primary dsh-btn--block" href="#">守護祂</a>
  </aside>
</main>
```
