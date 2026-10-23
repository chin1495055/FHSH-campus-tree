// 通知頁（關鍵畫面 ⑤ 異動警報）：#/notices。負責人：Qmoa
// 守護的樹被公示要移除或移植時，在這裡看到通知（Demo 用畫面模擬，不真的發推播）。
// 目前是空殼：列出模擬公示，點了打開那棵樹的樹木頁。
// 可以用的東西：
//   - trees：所有樹，每棵有 id、species、beast（神獸，可能沒有）、status、guardians
//   - store.js 的 getGuard(樹號)：這台裝置有沒有守護這棵樹
//   - shared.js 的 statusTag、esc（文字放進 HTML 前一定要先 esc）
//   - 樣式寫在 css/notices.css，class 用 nt- 開頭，才不會跟別的畫面撞名
import { esc, loadJson, pageBarHtml } from './shared.js';

export async function renderNoticesPage(el, { trees }) {
  const { notices } = await loadJson('data/mock/mock_notices.json');
  const byId = new Map(trees.map((t) => [t.id, t]));
  const items = notices.map((n) => {
    const tree = byId.get(n.treeId);
    const name = tree?.beast?.name ?? tree?.species ?? n.treeId;
    return `
      <li class="nt-item">
        <a href="#/tree/${encodeURIComponent(n.treeId)}">${esc(name)}：預計${esc(n.action)}（${esc(n.plannedDate)}）</a>
      </li>`;
  }).join('');
  el.innerHTML = `
    ${pageBarHtml('通知')}
    <div class="tp-scroll">
      <ul class="nt-list">${items}</ul>
    </div>`;
}
