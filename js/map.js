// 地圖首頁（關鍵畫面 ①）：真實樹木位置＋模擬的神獸、樹況、守護人數。
// 也負責 hash 路由：#/tree/樹號 打開樹木頁，其他網址回到地圖。
// 負責人：Saori。兩人共用（新增畫面要在 PAGES 加一行），要改先在 Discord 講一聲。
import { STATUS, DESKTOP, esc, statusTag, loadJson } from './shared.js';
import { guardiansOf, totalOf } from './store.js';
import { renderTreePage } from './tree.js';
import { renderReportPage } from './report.js';
import { renderNoticesPage } from './notices.js';
import { renderScanPage } from './scan.js';
import { renderBoardPage } from './board.js';
import { renderCollectionPage } from './collection.js';
import { renderSharePage } from './share.js';
import { renderMePage } from './me.js';
import { CATEGORIES, categoryOf } from './categories.js';
import { treeIdFrom, findOutsideTree } from './lookup.js';

// 路由註冊表：#/名稱 或 #/名稱/樹號 → 要畫的畫面。
// 新增畫面：在 js/ 開一個檔案匯出 render(el, { tree, trees })，再到這裡加一行。
// needsTree：網址要帶樹號，找不到那棵樹就回地圖。
const PAGES = {
  tree: { render: (el, { tree }) => renderTreePage(el, tree), needsTree: true },
  report: { render: renderReportPage, needsTree: true },
  notices: { render: renderNoticesPage },
  scan: { render: renderScanPage },
  board: { render: renderBoardPage, needsTree: true },
  collection: { render: renderCollectionPage },
  share: { render: renderSharePage, needsTree: true },
  me: { render: renderMePage },
};

// Demo 用的「你的位置」：總部（中正區北平東路 30-1 號）附近。真實定位離太遠時退回這裡。
const HOME = [25.0459, 121.5243];
const NEAR_LIMIT_M = 2000;
// 比這個近才畫完整的屋簷標記；拉遠時一般樹縮成小圓點，神獸和選取中的樹照常顯示
const FAR_ZOOM = 19;

// 標記疊在一起時誰在上面：選取中 > 公示中神獸 > 需關注神獸 > 其他神獸 > 一般樹
const Z_SELECTED = 2000;
const Z_BEAST = { notice: 1500, watch: 1200 };
const zFor = (tree) => (tree.beast ? Z_BEAST[tree.status] ?? 1000 : 0);

// 電腦版左欄「附近的樹」列幾棵
const NEARBY_MAX = 20;

// 載入畫面（index.html 的 #loading）：樹資料和底圖都好了才收起。
// 底圖卡住時，樹資料讀完後最多再等這麼久就先收起，地圖讓它自己慢慢畫。
const LOADING_MAP_WAIT_MS = 8000;
const loadingEl = document.getElementById('loading');
const loadingPending = new Set(['trees', 'map']);

function hideLoading() {
  if (loadingEl.classList.contains('is-done') || loadingEl.classList.contains('is-error')) return;
  loadingEl.classList.add('is-done');
  // 減少動態效果時沒有淡出，所以不等 transitionend，時間到直接收起
  setTimeout(() => {
    if (loadingEl.classList.contains('is-done')) loadingEl.hidden = true;
  }, 400);
}

function loadingStep(name) {
  loadingEl.querySelector(`[data-step="${name}"]`)?.classList.add('is-done');
  loadingPending.delete(name);
  if (!loadingPending.size) hideLoading();
}

function showLoadingError(message) {
  loadingEl.hidden = false;
  loadingEl.classList.remove('is-done');
  loadingEl.classList.add('is-error');
  loadingEl.querySelector('.loading__beast').src = 'design-system/assets/character/beasts/xuxugong/sad-icon.webp';
  loadingEl.querySelector('.loading__title').textContent = '資料載入失敗';
  loadingEl.querySelector('.loading__hint').textContent = message;
  loadingEl.querySelector('.loading__retry').hidden = false;
}

async function loadTrees() {
  const [real, beasts, guardians] = await Promise.all([
    loadJson('data/trees.json'),
    loadJson('data/mock/mock_beasts.json'),
    loadJson('data/mock/mock_guardians.json'),
  ]);
  const beastByTree = Object.fromEntries(beasts.beasts.map((b) => [b.treeId, b]));
  return real.trees.map((t) => {
    const beast = beastByTree[t.id];
    const g = beast?.guardians ?? guardians.guardians[t.id] ?? { local: 0, remote: 0 };
    return {
      ...t,
      beast,
      status: STATUS[beast?.status] ?? 'ok',
      category: categoryOf(t.species),
      guardians: g,
    };
  });
}

function matches(tree, filter, query, category) {
  if (category !== 'all' && tree.category.id !== category) return false;
  if (filter === 'beast' && !tree.beast) return false;
  if ((filter === 'watch' || filter === 'notice') && tree.status !== filter) return false;
  if (!query) return true;
  const text = [tree.beast?.name, tree.species, tree.category.name, tree.location, tree.id].join(' ');
  return text.includes(query);
}

function iconFor(tree, selected) {
  return dshMarkerIcon({
    status: tree.status,
    count: totalOf(guardiansOf(tree)),
    name: tree.beast?.name,
    beastIcon: tree.beast?.images.icon,
    selected,
  });
}

function renderCard(el, tree, here) {
  const b = tree.beast;
  const name = b ? b.name : tree.species;
  const dist = Math.round(L.latLng(here).distanceTo([tree.lat, tree.lng]));
  const meta = [
    b ? tree.species : tree.location,
    tree.ageEstimated ? `約 ${tree.ageEstimated} 年（推估）` : null,
    `距你 ${dist} 公尺`,
  ].filter(Boolean).join('・');
  const art = b
    ? `<div class="tree-card__art"><img src="${esc(b.images.icon)}" alt="" width="64" height="64"></div>`
    : `<div class="tree-card__art tree-card__art--tree"><img src="design-system/assets/icons/tree.svg" alt="" style="width:44px;height:44px"></div>`;
  el.innerHTML = `
    ${art}
    <div class="tree-card__body">
      <div class="tree-card__head">
        <h2 class="tree-card__name">${esc(name)}</h2>
        ${statusTag(tree.status)}
      </div>
      <p class="tree-card__meta">${esc(meta)}</p>
      <p class="tree-card__count"><b>${totalOf(guardiansOf(tree))}</b> 位鄰居守護</p>
    </div>
    <a class="tree-card__go" href="#/tree/${encodeURIComponent(tree.id)}" aria-label="看${esc(name)}">
      <span class="tree-card__go-label">看祂的檔案</span>
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M6 3 L12 9 L6 15" fill="none" stroke="#26231f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>`;
  el.hidden = false;
}

/** 電腦版左欄：離你最近的樹，點了在地圖上選取 */
function renderNearby(el, shown, selected, here, onPick) {
  const near = shown
    .map((tree) => ({ tree, dist: L.latLng(here).distanceTo([tree.lat, tree.lng]) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, NEARBY_MAX);
  el.innerHTML = near.map(({ tree, dist }) => {
    const name = tree.beast?.name ?? tree.species;
    const img = tree.beast ? tree.beast.images.icon : 'design-system/assets/icons/tree.svg';
    const meta = [tree.beast ? tree.species : null, `${Math.round(dist)} 公尺`].filter(Boolean).join('・');
    return `
      <li><a class="dsh-treelist__item" href="#/" data-id="${esc(tree.id)}"${tree === selected ? ' aria-current="true"' : ''}>
        <img src="${esc(img)}" alt="" width="48" height="48">
        <div><p class="dsh-treelist__name">${esc(name)}</p><p class="dsh-treelist__meta">${esc(meta)}</p></div>
        <span class="dsh-treelist__count">${totalOf(guardiansOf(tree))} 人</span>
      </a></li>`;
  }).join('');
  el.querySelectorAll('[data-id]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      onPick(near.find(({ tree }) => tree.id === a.dataset.id).tree);
    });
  });
}

/**
 * 樹種類別選單：chip 樣式的按鈕＋自己畫的清單（原生 select 打開後的樣子沒辦法配合設計系統）。
 * 鍵盤：↑↓ Home End 移動、Enter 或空白鍵選取、Esc 關閉。回傳關閉選單的函式。
 */
function setupCategoryMenu(button, menu, items, onChange) {
  let current = 'all';
  let active = 0;
  menu.innerHTML = items.map((item, i) => `
    <li class="cat-menu__item" id="cat-opt-${i}" role="option" aria-selected="${item.id === current}" data-index="${i}">
      <span class="cat-menu__emoji" aria-hidden="true">${item.emoji}</span>
      <span class="cat-menu__name">${esc(item.name)}</span>
      <span class="cat-menu__count">${item.count} 棵</span>
      <span class="cat-menu__check" aria-hidden="true"></span>
    </li>`).join('');
  const rows = [...menu.children];

  const label = (item) => (item.emoji ? `${item.emoji} ${item.name}` : item.name);

  function setActive(i) {
    active = (i + rows.length) % rows.length;
    rows.forEach((row, j) => row.classList.toggle('is-active-desc', j === active));
    menu.setAttribute('aria-activedescendant', rows[active].id);
    rows[active].scrollIntoView({ block: 'nearest' });
  }

  function open() {
    // 對齊按鈕：選單放在 .topbar 裡，按鈕所在的 chip 列可能被橫向捲動過
    menu.hidden = false;
    const box = button.getBoundingClientRect();
    const parent = menu.offsetParent;
    const pBox = parent.getBoundingClientRect();
    menu.style.top = `${box.bottom - pBox.top + parent.scrollTop + 6}px`;
    menu.style.left = `${Math.max(0, box.left - pBox.left)}px`;
    // 螢幕太矮時清單自己捲動，不超出畫面底部
    menu.style.maxHeight = `${Math.max(160, innerHeight - box.bottom - 16)}px`;
    button.setAttribute('aria-expanded', 'true');
    setActive(items.findIndex((item) => item.id === current));
    menu.focus({ preventScroll: true });
  }

  function close(refocus) {
    if (menu.hidden) return;
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (refocus) button.focus({ preventScroll: true });
  }

  function choose(i) {
    const item = items[i];
    current = item.id;
    rows.forEach((row, j) => row.setAttribute('aria-selected', String(j === i)));
    button.textContent = label(item);
    button.classList.toggle('is-active', current !== 'all');
    close(true);
    onChange(current);
  }

  button.addEventListener('click', () => (menu.hidden ? open() : close(true)));
  button.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      open();
    }
  });
  const keys = {
    ArrowDown: () => setActive(active + 1),
    ArrowUp: () => setActive(active - 1),
    Home: () => setActive(0),
    End: () => setActive(rows.length - 1),
    Enter: () => choose(active),
    ' ': () => choose(active),
    Escape: () => close(true),
  };
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') return close(false);
    if (!keys[e.key]) return;
    e.preventDefault();
    keys[e.key]();
  });
  menu.addEventListener('click', (e) => {
    const row = e.target.closest('[data-index]');
    if (row) choose(Number(row.dataset.index));
  });
  menu.addEventListener('pointermove', (e) => {
    const row = e.target.closest('[data-index]');
    if (row && Number(row.dataset.index) !== active) setActive(Number(row.dataset.index));
  });
  document.addEventListener('pointerdown', (e) => {
    if (!menu.contains(e.target) && !button.contains(e.target)) close(false);
  });
  return () => close(false);
}

async function main() {
  const mapEl = document.getElementById('map');
  const card = document.getElementById('card');
  const bottom = document.querySelector('.bottom');
  const app = document.querySelector('.app');
  const nearby = document.getElementById('nearby');

  const map = L.map(mapEl, { zoomControl: false, attributionControl: true }).setView(HOME, 17);
  // OpenFreeMap 向量底圖（免金鑰），透過 maplibre-gl-leaflet 放進 Leaflet。
  // CARTO 圖磚現在會蓋「API KEY REQUIRED」浮水印，所以不用。
  const base = L.maplibreGL({
    style: 'https://tiles.openfreemap.org/styles/positron',
    attribution: '<a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> &copy; <a href="https://www.openmaptiles.org/" target="_blank">OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
  }).addTo(map);
  // 底色改成設計系統的宣紙米色（surface-sunken）
  const gl = base.getMaplibreMap();
  gl.on('load', () => {
    loadingStep('map');
    if (gl.getLayer('background')) gl.setPaintProperty('background', 'background-color', '#ede6d8');
    // 路名、地名只顯示中文（預設會中英並列）
    for (const layer of gl.getStyle().layers) {
      if (layer.type === 'symbol' && gl.getLayoutProperty(layer.id, 'text-field')) {
        gl.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', 'name:zh-Hant'], ['get', 'name:zh'], ['get', 'name']]);
      }
    }
  });

  // 底部卡片的高度會變，讓定位鈕和圖資標示跟著往上推
  const syncBottom = () => app.style.setProperty('--bottom-h', `${bottom.offsetHeight}px`);
  new ResizeObserver(syncBottom).observe(bottom);

  const syncZoom = () => mapEl.classList.toggle('is-far', map.getZoom() < FAR_ZOOM);
  map.on('zoomend', syncZoom);
  syncZoom();

  let here = HOME;
  const meMarker = L.marker(here, {
    icon: L.divIcon({ className: 'dsh-leaflet-icon', html: '<div class="me-dot" aria-label="你的位置"></div>', iconSize: [22, 22], iconAnchor: [11, 11] }),
    keyboard: false,
    interactive: false,
  }).addTo(map);

  const trees = await loadTrees();
  loadingStep('trees');
  setTimeout(hideLoading, LOADING_MAP_WAIT_MS);
  let selected = null;
  let filter = 'all';
  let query = '';
  let category = 'all';
  let shown = trees;

  // 框選範圍時避開蓋在地圖上的東西：手機是上方搜尋列和底部卡片；電腦版左右欄不蓋地圖
  const mapPadding = (topLeft, bottomExtra) => (DESKTOP.matches
    ? { paddingTopLeft: [40, 40], paddingBottomRight: [40, 40] }
    : { paddingTopLeft: topLeft, paddingBottomRight: [topLeft[0], bottom.offsetHeight + bottomExtra] });

  const syncNearby = () => {
    if (DESKTOP.matches) renderNearby(nearby, shown, selected, here, pick);
  };
  DESKTOP.addEventListener('change', syncNearby);

  const markers = new Map();
  for (const tree of trees) {
    const m = L.marker([tree.lat, tree.lng], {
      icon: iconFor(tree, false),
      zIndexOffset: zFor(tree),
      title: tree.beast?.name ?? tree.species,
    });
    m.on('click', () => select(tree));
    markers.set(tree.id, m);
  }

  function select(tree) {
    if (selected) {
      const prev = markers.get(selected.id);
      prev.setIcon(iconFor(selected, false));
      prev.setZIndexOffset(zFor(selected));
    }
    selected = tree;
    const m = markers.get(tree.id);
    m.setIcon(iconFor(tree, true));
    m.setZIndexOffset(Z_SELECTED);
    renderCard(card, tree, here);
    syncNearby();
  }

  // 從左欄清單點選：選取並把地圖移過去
  function pick(tree) {
    select(tree);
    map.panTo([tree.lat, tree.lng]);
  }

  function applyFilter() {
    shown = [];
    for (const tree of trees) {
      const m = markers.get(tree.id);
      if (matches(tree, filter, query, category)) {
        m.addTo(map);
        shown.push(tree);
      } else {
        m.remove();
      }
    }
    if ((filter !== 'all' || query || category !== 'all') && shown.length) {
      const bounds = L.latLngBounds(shown.map((t) => [t.lat, t.lng]));
      map.fitBounds(bounds, { ...mapPadding([24, 140], 24), maxZoom: 18 });
      if (shown.length === 1 || !shown.includes(selected)) select(shown.find((t) => t.beast) ?? shown[0]);
    }
    syncNearby();
  }

  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      filter = chip.dataset.filter;
      document.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      applyFilter();
    });
  });

  // 樹種類別選單：棵數從資料算，沒有樹的類別不列
  const catCount = {};
  for (const tree of trees) catCount[tree.category.id] = (catCount[tree.category.id] ?? 0) + 1;
  const catItems = [
    { id: 'all', emoji: '', name: '所有樹種', count: trees.length },
    ...CATEGORIES.filter((c) => catCount[c.id]).map((c) => ({ ...c, count: catCount[c.id] })),
  ];
  const closeCatMenu = setupCategoryMenu(
    document.getElementById('category'),
    document.getElementById('category-menu'),
    catItems,
    (id) => {
      category = id;
      applyFilter();
    },
  );
  map.on('movestart', closeCatMenu);

  const q = document.getElementById('q');
  q.addEventListener('input', () => {
    query = q.value.trim();
    applyFilter();
  });

  // 定位只用來畫出你的位置、算距離，不保存
  document.getElementById('locate').addEventListener('click', () => {
    const back = () => map.setView(here, Math.max(map.getZoom(), 17));
    if (!navigator.geolocation) return back();
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = [pos.coords.latitude, pos.coords.longitude];
        if (L.latLng(p).distanceTo(HOME) < NEAR_LIMIT_M) {
          here = p;
          meMarker.setLatLng(here);
          if (selected) renderCard(card, selected, here);
          syncNearby();
        }
        back();
      },
      back,
      { enableHighAccuracy: true, timeout: 5000 },
    );
  });

  applyFilter();
  // 一打開就選 Demo 主角，地圖把所有神獸和你的位置一起框進畫面
  const hero = trees.find((t) => t.beast?.slug === 'xuxugong') ?? trees[0];
  select(hero);
  const beastSpots = trees.filter((t) => t.beast).map((t) => [t.lat, t.lng]);
  map.fitBounds(L.latLngBounds([HOME, ...beastSpots]), { ...mapPadding([40, 160], 60), maxZoom: 18 });

  // 路由：依 PAGES 把畫面畫進同一個全螢幕的 #page，蓋在地圖上面
  const page = document.getElementById('page');
  const byId = new Map(trees.map((t) => [t.id, t]));
  const behindPage = [...app.children].filter((c) => c !== page);
  function showPage(on) {
    page.hidden = !on;
    behindPage.forEach((c) => { c.inert = on; });
  }
  // 底部導覽列和電腦版頂部導覽，標出現在在哪一頁（沒有對應的畫面都算地圖）
  const navLinks = document.querySelectorAll('.dsh-nav__item[href], .dsh-topnav__item');
  function syncNav(name) {
    const current = Object.hasOwn(PAGES, name) && !['tree', 'report', 'board', 'share'].includes(name) ? `#/${name}` : '#/';
    navLinks.forEach((a) => {
      if (a.getAttribute('href') === current) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  async function route() {
    const [, name, id] = location.hash.match(/^#\/([^/]+)(?:\/([^/]+))?/) ?? [];
    syncNav(name);
    const target = Object.hasOwn(PAGES, name) ? PAGES[name] : null;
    let tree = id ? byId.get(decodeURIComponent(id)) : null;
    // 不在地圖範圍的樹號（例如在家附近掃到的樹牌）：到全臺北的資料找，找不到就用「樹種待查」（見 lookup.js）
    const outsideId = !tree && target?.needsTree && id ? treeIdFrom(decodeURIComponent(id)) : null;
    if (outsideId) {
      tree = byId.get(outsideId) ?? await findOutsideTree(outsideId);
      byId.set(outsideId, tree);
      // 等資料的時候網址已經換了，就不畫這一頁
      if (location.hash.match(/^#\/[^/]+\/([^/]+)/)?.[1] !== id) return;
    }
    if (target && (tree || !target.needsTree)) {
      // 範圍外的樹沒有地圖標記，不用選取
      if (tree && selected !== tree && markers.has(tree.id)) select(tree);
      // 換到別的畫面時清掉樹號，樹木頁才不會沿用上一次的捲動位置
      if (name !== 'tree') delete page.dataset.treeId;
      page.dataset.page = name;
      await target.render(page, { tree, trees });
      showPage(true);
      page.querySelector('.tp-back')?.focus({ preventScroll: true });
    } else {
      showPage(false);
      // 在樹木頁按了守護，回到地圖時人數要跟著更新
      if (selected) select(selected);
    }
  }
  window.addEventListener('hashchange', route);
  route();
}

main().catch((err) => {
  console.error(err);
  showLoadingError('請檢查網路後重新整理。在自己電腦上要用本機伺服器開啟（不能直接雙擊 index.html）。');
});
