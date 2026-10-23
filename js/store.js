// 使用者自己的操作（守護哪些樹）存在這台裝置的 localStorage，不上傳。
// 私密視窗或儲存被擋時，退回只存在記憶體裡，重新整理就會消失。

const KEY = 'dsh.guards';
let guards = null;

function read() {
  if (guards) return guards;
  try {
    guards = JSON.parse(localStorage.getItem(KEY)) ?? {};
  } catch {
    guards = {};
  }
  return guards;
}

/** 'local'（在地守護）、'remote'（遠端關注）或 null */
export const getGuard = (id) => read()[id] ?? null;

export function setGuard(id, kind) {
  read()[id] = kind;
  try {
    localStorage.setItem(KEY, JSON.stringify(guards));
  } catch {
    // 存不進去也沒關係，這次瀏覽還是看得到
  }
}

/** 守護人數＝模擬的基礎人數＋自己按的那一下 */
export function guardiansOf(tree) {
  const g = { ...tree.guardians };
  const mine = getGuard(tree.id);
  if (mine) g[mine] += 1;
  return g;
}

export const totalOf = (g) => g.local + g.remote;
