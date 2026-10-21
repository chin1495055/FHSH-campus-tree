健康檢查清單：鄰居站在樹旁，逐項勾選看到的狀況，送出就是一次回報。

- `<form class="dsh-check">`：`dsh-check__title`、多個 `<label class="dsh-check__item">`（內含 `<input type="checkbox" class="dsh-check__box">` 與 `dsh-check__q` 題目，補充說明放 `dsh-check__hint`）、`dsh-check__foot` 放一個主要按鈕「送出回報」。
- 題目一律寫成「正常的樣子」，勾選＝沒問題；沒勾的項目送出後轉成待關注事項。
- 每項整列都可點（`label` 包住），觸控高度至少 `target-min`。
- 題目 5～7 題為上限；需要拍照的題目在說明裡寫「看到請拍照」，拍照按鈕放在清單下方。

使用者提供：題目、說明、送出行為。

不要：用醫療診斷語氣（「確診」）；要求使用者判斷病名；預設全部勾選。
