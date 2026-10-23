// 回報頁（關鍵畫面 ③）：#/report/樹號。負責人：Saori
// 在地守護者拍照、勾選健康檢查清單，送出後元氣值和圖鑑跟著更新。
// 目前是空殼，只有標題列和返回鈕。
import { esc, pageBarHtml } from './shared.js';

export async function renderReportPage(el, { tree }) {
  const name = tree.beast?.name ?? tree.species;
  el.innerHTML = `
    ${pageBarHtml(`回報${name}`, `#/tree/${encodeURIComponent(tree.id)}`)}
    <div class="tp-scroll">
      <p class="tp-p tp-muted">回報流程還在做。（${esc(tree.id)}）</p>
    </div>`;
}
