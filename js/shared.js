// 地圖首頁和樹木頁共用的小工具：讀資料、跳脫文字、樹況標籤。

// 模擬資料的狀態值 → 標記與標籤用的狀態
export const STATUS = { normal: 'ok', watch: 'watch', notice: 'notice', keep: 'keep', transplant: 'move' };
const STATUS_ICON = {
  ok: '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7 L6 11 L12 3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  watch: '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M7 2 V8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="7" cy="11.5" r="1.4" fill="currentColor"/></svg>',
  notice: '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 5 H5 L10 2 V12 L5 9 H2 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  keep: '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M7 2 L11 7 L7 12 L3 7 Z" fill="currentColor"/></svg>',
  move: '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7 H11 M8 4 L11 7 L8 10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

export const esc = (s) => dshEscape(s ?? '');

export const statusTag = (status) =>
  `<span class="dsh-tag dsh-tag--${status}">${STATUS_ICON[status]}${DSH_MARKER.labels[status]}</span>`;

export async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`讀不到 ${path}`);
  return res.json();
}
