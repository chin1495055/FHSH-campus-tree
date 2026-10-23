按鈕：匾額雙框，墨色外框內再一圈細線，平面、無陰影，主要按鈕「守護祂」用廟牆紅。

- `<button class="dsh-btn dsh-btn--primary">`：主要行動，底 `action`、字 `on-action`，內框線 `on-action`。一個畫面只放一個。
- `dsh-btn--secondary`：次要行動（回報樹況、分享），底 `surface-raised`，內框線 `outline`。
- `dsh-btn--text`：低強調連結式動作（看公告），無框。
- 加 `dsh-btn--block` 撐滿寬度（底部抽屜內）。
- `disabled`：已守護、不可操作；文字要改成說明狀態（「已守護」）。
- 按下：只把底色加深（`action-pressed`／`surface-sunken`），不位移、不加陰影。圓角 `radius-sm`。

使用者提供：按鈕文字（動詞開頭）、`type`、點擊行為。高度固定 `button-height`，戶外至少 `target-min`。

不要：加投影或偏移陰影；把「公示中」做成按鈕；在同一畫面放兩個紅色主要按鈕；用 emoji 當圖示。
