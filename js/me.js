// 我的（PRD 路由表 #/me，P1）：#/me。負責人：Saori
// 守護成果、隱私說明、資料來源，最下面是「關於大樹神獸」介紹頁的入口（手機版沒有頂部導覽）。
// 數字只來自 store.js，只有自己看得到。
import { pageBarHtml } from './shared.js';
import { getGuard, getMyReports } from './store.js';

const README = 'https://github.com/innerwork-saori/2026-debugWithPuma#readme';

function statHtml(num, label) {
  return `<li class="me-stat"><span class="me-stat__num">${num}</span><span class="me-stat__label">${label}</span></li>`;
}

export function renderMePage(el, { trees }) {
  const local = trees.filter((t) => getGuard(t.id) === 'local').length;
  const remote = trees.filter((t) => getGuard(t.id) === 'remote').length;
  const reports = trees.reduce((n, t) => n + getMyReports(t.id).length, 0);

  el.innerHTML = `
    ${pageBarHtml('我的')}
    <div class="tp-scroll me-scroll">
      <section class="tp-box" aria-labelledby="me-done">
        <h2 class="tp-h" id="me-done">我的守護成果</h2>
        <ul class="me-stats">
          ${statHtml(local, '在地守護')}
          ${statHtml(remote, '遠端關注')}
          ${statHtml(reports, '次回報')}
        </ul>
        <a class="dsh-btn dsh-btn--secondary dsh-btn--block" href="#/collection">看我的守護圖鑑</a>
      </section>

      <section class="tp-box" aria-labelledby="me-privacy">
        <h2 class="tp-h" id="me-privacy">你的資料</h2>
        <p class="tp-p">守護了哪些樹、送出的回報，都只存在這台裝置，不會上傳，也不會記住你家的地址。別人只看得到守護人數，看不到是誰。</p>
      </section>

      <section class="tp-box" aria-labelledby="me-data">
        <h2 class="tp-h" id="me-data">資料來源</h2>
        <p class="tp-p">樹的位置、樹種、樹號來自臺北市政府開放資料「行道樹及公園樹木分布圖」。</p>
        <p class="tp-p">神獸的故事、守護人數、回報、異動公告和社區活動是黑客松 Demo 用的<strong>模擬資料</strong>。</p>
        <a class="tp-link" href="${README}" target="_blank" rel="noopener">看完整的資料說明（README）</a>
      </section>

      <a class="dsh-btn dsh-btn--primary dsh-btn--block me-about" href="about.html">關於大樹神獸</a>
    </div>`;
}
