// 我的守護圖鑑（關鍵畫面「我的守護圖鑑」「圖鑑｜空白狀態」，PRD F7）：#/collection。負責人：Saori
// 列出這台裝置守護的樹：在地守護排成卡片，遠端關注排成清單。資料只來自 store.js，只有自己看得到。
import { esc, statusTag, pageBarHtml } from './shared.js';
import { getGuard, guardedIds } from './store.js';
import { findOutsideTree } from './lookup.js';
import { upcomingEventsOf } from './board.js';
import { OLD_TREE_AGE } from './tree.js';

const ICON_LOCK = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="2.5" y="6" width="9" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 6 V4.5 a2.5 2.5 0 0 1 5 0 V6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';

const treeHref = (tree) => `#/tree/${encodeURIComponent(tree.id)}`;
const nameOf = (tree) => tree.beast?.name ?? tree.species;

/** 神獸排前面，其他照守護的先後 */
function guardedTrees(trees, kind) {
  return trees.filter((t) => getGuard(t.id) === kind).sort((a, b) => Boolean(b.beast) - Boolean(a.beast));
}

/** 卡片左上角的緞帶：公示中優先，其次是樹下接下來的活動 */
function ribbonHtml(tree, events) {
  if (tree.status === 'notice') return '<span class="col-ribbon col-ribbon--notice">異動公告</span>';
  if (events) return `<span class="col-ribbon">新活動 ${events}</span>`;
  return '';
}

function cardHtml(tree, events) {
  const b = tree.beast;
  const old = b && tree.ageEstimated >= OLD_TREE_AGE;
  const mood = tree.status === 'watch' || b?.vitality < 40 ? 'sad' : 'healthy';
  const art = b
    ? `<img src="design-system/assets/character/beasts/${esc(b.slug)}/${mood}-cutout.webp" alt="">`
    : '<img class="col-card__tree" src="design-system/assets/icons/tree.svg" alt="">';
  return `
    <a class="dsh-beast col-card${old ? ' dsh-beast--rare' : ''}${b ? '' : ' col-card--tree'}" href="${treeHref(tree)}">
      <div class="dsh-beast__art ${old ? 'dsh-pattern--cloud' : 'dsh-pattern--leaves'}">
        ${art}
        ${old ? '<span class="dsh-beast__seal">老樹</span>' : ''}
      </div>
      <div class="dsh-beast__body">
        <span class="dsh-plaque dsh-beast__name">${esc(nameOf(tree))}</span>
        <p class="dsh-beast__meta">${esc(b ? `${tree.species}・#${tree.id}` : `#${tree.id}`)}</p>
        ${statusTag(tree.status)}
      </div>
      ${ribbonHtml(tree, events)}
    </a>`;
}

function rowHtml(tree, events) {
  const b = tree.beast;
  const art = b
    ? `<span class="col-row__avatar"><img src="${esc(b.images.icon)}" alt="" width="40" height="40"></span>`
    : '<img class="col-row__tree" src="design-system/assets/icons/tree.svg" alt="" width="36" height="36">';
  const pin = tree.status === 'notice'
    ? '<span class="dsh-pin dsh-pin--notice">異動公告</span>'
    : events ? '<span class="dsh-pin">新活動</span>' : '';
  return `
    <li><a class="col-row" href="${treeHref(tree)}">
      ${art}
      <span class="col-row__body">
        <span class="col-row__name">${esc(nameOf(tree))}${pin}</span>
        <span class="col-row__meta">${esc([b ? tree.species : null, tree.location].filter(Boolean).join('・'))}</span>
      </span>
      ${tree.status === 'ok' ? '' : statusTag(tree.status)}
    </a></li>`;
}

function emptyHtml() {
  return `
    <div class="col-empty dsh-pattern--lattice">
      <div class="col-empty__art">
        <img src="design-system/assets/character/beasts/xuxugong/healthy-cutout.webp" alt="" width="160" height="198">
      </div>
      <div class="col-empty__box">
        <h2 class="col-empty__title">你還沒有守護任何一棵樹</h2>
        <p class="col-empty__text">家附近、上班路上的大樹，都在等一群鄰居。找到一棵，按下「守護祂」，祂就會出現在這裡。</p>
        <a class="dsh-btn dsh-btn--primary dsh-btn--block" href="#/">去地圖找樹</a>
        <a class="dsh-btn dsh-btn--secondary dsh-btn--block col-empty__scan" href="#/scan">掃描樹牌 QR code</a>
      </div>
    </div>`;
}

export async function renderCollectionPage(el, { trees: mapTrees }) {
  // 地圖範圍外守護的樹（掃樹牌打開的）不在 mapTrees 裡，用樹號到全臺北的資料補上
  const known = new Set(mapTrees.map((t) => t.id));
  const outside = await Promise.all(guardedIds().filter((id) => !known.has(id)).map(findOutsideTree));
  const trees = [...mapTrees, ...outside];
  const local = guardedTrees(trees, 'local');
  const remote = guardedTrees(trees, 'remote');
  const events = new Map(await Promise.all(
    [...local, ...remote].map(async (t) => [t.id, (await upcomingEventsOf(t)).length]),
  ));

  const body = local.length || remote.length
    ? `
      <p class="col-private">${ICON_LOCK}只有你看得到，資料只存在這台裝置</p>
      <section class="col-section" aria-labelledby="col-local">
        <h2 class="tp-h col-h" id="col-local">在地守護<small>${local.length} 棵・家附近、常經過的樹</small></h2>
        ${local.length
          ? `<div class="col-grid dsh-dex">${local.map((t) => cardHtml(t, events.get(t.id))).join('')}</div>`
          : '<p class="tp-p tp-muted">還沒有。家附近或常經過的樹，在祂的檔案按「守護祂」、選在地守護。</p>'}
      </section>
      <section class="col-section" aria-labelledby="col-remote">
        <h2 class="tp-h col-h" id="col-remote">遠端關注<small>${remote.length} 棵・在遠方，收到祂們的消息</small></h2>
        ${remote.length
          ? `<ul class="col-list">${remote.map((t) => rowHtml(t, events.get(t.id))).join('')}</ul>`
          : '<p class="tp-p tp-muted">還沒有。不住附近也能遠端關注，祂有異動時會通知你。</p>'}
      </section>`
    : emptyHtml();

  el.innerHTML = `
    ${pageBarHtml('我的守護圖鑑')}
    <div class="tp-scroll col-scroll">${body}</div>`;
}
