燕尾屋脊：一條墨線、兩端像廟頂燕尾上翹，用來分隔區塊或放在匾額上方。寬度隨容器伸縮，兩端燕尾維持原本比例不變形。

- 結構：`<div class="dsh-ridge" role="presentation"><span class="dsh-ridge__beam"></span></div>`
- 左右兩端是 `::before`／`::after`，用 `assets/patterns/ridge-end.svg`（32×24）當遮罩、`currentColor` 上色，右端鏡像；中段 `dsh-ridge__beam` 是一條會伸縮的梁。
- 線寬 `stroke-bold`，顏色 `outline`（`.dsh-ridge` 的 `color`）；高度 `space-6`（24px），燕尾每端寬 `space-8`（32px）。最小寬度建議 120px。
- `assets/patterns/ridge.svg`（320×24）是固定寬度的完整版，給簡報、海報等不需要伸縮的地方用 `<img>` 放。
- 用在頁面大區塊之間、匾額上方、分享卡頂部。一個畫面最多兩條。
- 遮罩圖檔要透過網頁伺服器讀取（`http://`／`https://`）；直接用 `file://` 開檔時瀏覽器會擋下，燕尾會不見。

```html
<div class="dsh-ridge" role="presentation"><span class="dsh-ridge__beam"></span></div>
<span class="dsh-plaque">樹的檔案</span>
```

使用者提供：容器寬度。

不要：當成一般列表分隔線（列表用 `line` 細線）；加漸層或金色描邊；把整條拉伸成變形的燕尾。
