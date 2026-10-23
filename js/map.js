// 地圖首頁（關鍵畫面 ①）：真實樹木位置＋模擬的神獸、樹況、守護人數。
// 也負責 hash 路由：#/tree/樹號 打開樹木頁，其他網址回到地圖。
// 負責人：Saori。兩人共用（新增畫面要在 PAGES 加一行），要改先在 Discord 講一聲。
import { STATUS, esc, statusTag, loadJson } from './shared.js';
import { guardiansOf, totalOf } from './store.js';
import { renderTreePage } from './tree.js';
import { renderReportPage } from './report.js';
import { renderNoticesPage } from './notices.js';
import { renderScanPage } from './scan.js';

// 路由註冊表：#/名稱 或 #/名稱/樹號 → 要畫的畫面。
// 新增畫面：在 js/ 開一個檔案匯出 render(el, { tree, trees })，再到這裡加一行。
// needsTree：網址要帶樹號，找不到那棵樹就回地圖。
// 沒登記的網址（#/collection、#/me）先回地圖。
const PAGES = {
  tree: { render: (el, { tree }) => renderTreePage(el, tree), needsTree: true },
  report: { render: renderReportPage, needsTree: true },
  notices: { render: renderNoticesPage },
  scan: { render: renderScanPage },
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
      guardians: g,
    };
  });
}

function matches(tree, filter, query) {
  if (filter === 'beast' && !tree.beast) return false;
  if ((filter === 'watch' || filter === 'notice') && tree.status !== filter) return false;
  if (!query) return true;
  const text = [tree.beast?.name, tree.species, tree.location, tree.id].join(' ');
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
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M6 3 L12 9 L6 15" fill="none" stroke="#26231f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>`;
  el.hidden = false;
}

async function main() {
  const mapEl = document.getElementById('map');
  const card = document.getElementById('card');
  const bottom = document.querySelector('.bottom');
  const app = document.querySelector('.app');

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
  let selected = null;
  let filter = 'all';
  let query = '';

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
  }

  function applyFilter() {
    const shown = [];
    for (const tree of trees) {
      const m = markers.get(tree.id);
      if (matches(tree, filter, query)) {
        m.addTo(map);
        shown.push(tree);
      } else {
        m.remove();
      }
    }
    if ((filter !== 'all' || query) && shown.length) {
      const bounds = L.latLngBounds(shown.map((t) => [t.lat, t.lng]));
      map.fitBounds(bounds, { paddingTopLeft: [24, 140], paddingBottomRight: [24, bottom.offsetHeight + 24], maxZoom: 18 });
      if (shown.length === 1 || !shown.includes(selected)) select(shown.find((t) => t.beast) ?? shown[0]);
    }
  }

  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      filter = chip.dataset.filter;
      document.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      applyFilter();
    });
  });

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
  map.fitBounds(L.latLngBounds([HOME, ...beastSpots]), {
    paddingTopLeft: [40, 160],
    paddingBottomRight: [40, bottom.offsetHeight + 60],
    maxZoom: 18,
  });

  // 路由：依 PAGES 把畫面畫進同一個全螢幕的 #page，蓋在地圖上面
  const page = document.getElementById('page');
  const byId = new Map(trees.map((t) => [t.id, t]));
  const behindPage = [...app.children].filter((c) => c !== page);
  function showPage(on) {
    page.hidden = !on;
    behindPage.forEach((c) => { c.inert = on; });
  }
  async function route() {
    const [, name, id] = location.hash.match(/^#\/([^/]+)(?:\/([^/]+))?/) ?? [];
    const target = Object.hasOwn(PAGES, name) ? PAGES[name] : null;
    const tree = id ? byId.get(decodeURIComponent(id)) : null;
    if (target && (tree || !target.needsTree)) {
      if (tree && selected !== tree) select(tree);
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
  document.getElementById('card').hidden = false;
  document.getElementById('card').textContent = '資料載入失敗，請用本機伺服器開啟（不能直接雙擊 index.html）。';
});
