守護人數（燈海）：一盞燈代表一位守護這棵樹的鄰居，深綠底上點亮的金燈越多，代表越多人看著祂。

- `<section class="dsh-lanterns">`：`dsh-lanterns__head`（「燈海」標籤＋數字 `dsh-lanterns__num`）、`dsh-lanterns__grid`（燈）、`dsh-lanterns__note`（一句說明）。
- 燈用 `<span class="dsh-lantern">`，未點亮用 `dsh-lantern--off`。最多畫 30 盞（3 排 × 10）；人數超過 30 時全部點亮，實際數字看 `dsh-lanterns__num`。未滿 30 時，點亮數＝人數，剩下的畫成未點亮，讓人知道還能再點。
- 燈格是裝飾（`aria-hidden`），數字才是資訊。

使用者提供：守護人數、近期新增數。

不要：把燈海做成可點擊的收集遊戲；在燈旁畫香、金紙或火焰。
