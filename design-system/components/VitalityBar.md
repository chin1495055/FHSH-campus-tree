元氣值條：用 10 格葉片色塊表示一棵樹目前的健康程度（0～100），由鄰居回報累積而來。

- 結構：`dsh-vital__head`（「元氣」＋數值與狀態字 `dsh-vital__value`）、`dsh-vital__track`（10 個 `dsh-vital__seg`，點亮加 `is-on`）、`dsh-vital__hint`（依據或建議）。
- 點亮格數＝數值 ÷ 10 四捨五入。
- 狀態字：70 以上「茂盛」、40～69「普通」、39 以下「虛弱」。虛弱時在外層加 `dsh-vital--weak`，色塊改用 `state-watch`。
- 軌道加 `role="meter"` 與 `aria-valuenow`／`aria-valuetext`。

使用者提供：數值、計算依據說明。

不要：用紅色或「公示中」的橘色表示元氣低（元氣是健康，不是行政狀態）；做成會倒數歸零的遊戲血條；數值不明時寫「［資料不足］」，不要顯示 0。
